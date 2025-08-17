'use client';
import React, { ChangeEvent, useState } from 'react';
import { useEdgeStore } from '@/lib/edgestore/client';
import Image from 'next/image';
import { Button, Typography } from '@material-tailwind/react';
import { TbTrashX } from "react-icons/tb";

interface PreviewImage {
	file: File;
	previewUrl: string;
	progress: number;
	uploadedUrl?: string;
}

interface ImageUploaderProps {
	multiple?: boolean;
}

function ImageUploader({multiple = true}: ImageUploaderProps) {
	const [uploads, setUploads] = useState<PreviewImage[] | PreviewImage>([]);
	const [success, setSuccess] = useState<boolean>();
	const [uploading, setUploading] = useState<boolean>(false);
	const { edgestore } = useEdgeStore();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (success === true || success === false) setSuccess(undefined);
		if (!event.target.files) return;

		let files: typeof uploads;
		if (multiple) {
			files = Array.from(event.target.files).map((file) => ({
				file,
				previewUrl: URL.createObjectURL(file),
				progress: 0,
			}));
		} else {
			files = {
				file: event.target.files[0],
				previewUrl: URL.createObjectURL(event.target.files[0]),
				progress: 0,
			};
		}

		setUploads((prev) => (multiple ? [...(prev as PreviewImage[]), ...(files as PreviewImage[])] : files));
	};

	const handleUpload = async () => {
		if (!uploads) return;
		setUploading(true);

		if (Array.isArray(uploads)) {
			Promise.all(uploads.map(upload => {
				return edgestore.travels.upload({
					file: upload.file,
					// onProgressChange: (progress) => {
					// 	setUploads((prev) =>
					// 		(prev as PreviewImage[]).map((u) =>
					// 			u.previewUrl === upload.previewUrl ? { ...u, progress } : upload
					// 		)
					// 	);
					// },
				});
			}))
			.then(() => {
				setSuccess(true);
				setUploads([]);
			})
			.catch((error) => {
				console.error('error while uploading', error)
				setSuccess(false);
			})
			.finally(() => setUploading(false));
		} else {
			edgestore.travels.upload({
				file: uploads.file,
				onProgressChange: (progress) => {
					setUploads((prev) => ({ ...(prev as PreviewImage), progress }));
				},
			})
			.then(() => setSuccess(true))
			.catch((error) => {
				console.error('error while uploading', error)
				setSuccess(false);
			})
			.finally(() => setUploading(false));
		}
	}

	const handleDelete = (upload: PreviewImage) => {
		setUploads((prev) => !multiple ? [] : (prev as PreviewImage[]).filter((u) => u.previewUrl !== upload.previewUrl));
	};

	return (
        <div className="py-20 bg-white px-2">
            <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                <div className="md:flex">
                    <div className="w-full p-3">
                        <div className="relative h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                            <div className="absolute">
                                <div className="flex flex-col items-center">
                                    <span className="block text-gray-400 font-normal">add you image here</span>
                                </div>
                            </div>
                            <input type="file" multiple={multiple} accept="image/*" className="h-full w-full opacity-0" onChange={handleChange} />
                        </div>
						{success === true ? (
							<Typography className="text-center pt-2" color="green">All images uploaded</Typography>
						) : success === false ? (
							<Typography className="text-center pt-2"color="red">Some images upload failed, please retry</Typography>
						) : null}
						<div className="flex overflow-x-auto my-2">
							{!multiple ? (
								<Preview image={uploads as PreviewImage} onDelete={handleDelete}/>
							) : (uploads as PreviewImage[])?.map(upload => (
								<Preview key={upload.previewUrl} image={upload} onDelete={handleDelete} />
							))}
						</div>
						<Button loading={uploading} size="md" className="self-center" fullWidth disabled={(uploads as PreviewImage[]).length === 0} onClick={handleUpload}>Upload</Button>
                    </div>
                </div>
            </div>
        </div>
	);
}

export default ImageUploader;

const Preview = ({ image, onDelete,  }: { image: PreviewImage, onDelete: (image: PreviewImage) => void }) => {
	return (
		<div
            key={image.previewUrl}
            className="relative w-32 h-32 flex-shrink-0 border rounded-lg overflow-hidden"
		>
            <Image
				src={image.previewUrl}
				alt="preview"
				fill
				className="object-cover"
            />

            {/* Bouton delete */}
            <button
				onClick={() => onDelete(image)}
				className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black"
            >
              	<TbTrashX className="w-4 h-4" />
            </button>

            {/* Barre de progression */}
            {image.progress > 0 && image.progress < 100 && (
				<div className="absolute bottom-0 left-0 w-full bg-black/50">
					<div
						className="h-1 bg-green-500"
						style={{ width: `${image.progress}%` }}
					/>
				</div>
			)}
		</div>
	);
}
