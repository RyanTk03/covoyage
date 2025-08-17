import { Typography } from '@/components/MaterialTailwind';
import React from 'react';
import Image from 'next/image';
import { backendClient } from '@/lib/edgestore/backend';

const UserPhotosPage = async ({params}) => {
    const photos = await backendClient.travels.listFiles({
		filter: {
			path: {
				author: params.id,
			},
		},
	});

    return photos.data.length === 0 ? <Typography variant="lead">No travel memory yet</Typography> : (
		<div className="grid grid-cols-5 gap-4">
			{photos.data.map(({ url }, index) => (
				<div key={index} className="relative h-[200px] w-[200px]">
					<Image
						src={url}
						className="cursor-pointer rounded-lg object-cover object-center"
						alt="gallery-image"
						fill
					/>
				</div>
			))}
		</div>
	);
}

export default UserPhotosPage;