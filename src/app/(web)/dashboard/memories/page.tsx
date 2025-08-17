import React from 'react';
import { Typography } from '@/components/MaterialTailwind';
import Image from 'next/image';
import { backendClient } from '@/lib/edgestore/backend';
import ImageUploader from '@/components/ImageUploader';
import { auth } from '@clerk/nextjs/server';


export default async function MemoriesPage() {
	const photos = await backendClient.travels.listFiles({
		filter: {
			path: {
				author: auth().userId ?? '',
			}
		},
	});

    return (
        <div className="w-full p-2 flex flex-col gap-4">
            <Typography variant="h2">Travels memories</Typography>
			<ImageUploader/>
            <div className="w-full flex flex-wrap gap-5 p-5">
                {photos.data.map((photo) => (
                    <div key={photo.url} className="cursor-pointer relative w-[20vw] h-[140px]">
                        <Image
                            src={photo.url}
                            alt="travel memory"
                            fill
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
