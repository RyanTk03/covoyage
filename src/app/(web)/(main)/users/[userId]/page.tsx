"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Typography, Button, Alert } from '@/components/MaterialTailwind';
import EvaluationCard from '@/components/EvaluationCard';
import Carousel from '@/components/Carousel';
import Spinner from '@/components/Spinner';
import ReviewDialog from '@/components/ReviewDialog';
import Link from 'next/link';


const Page = ({params})  => {
    const [photos, setPhotos] = useState<{data: Array<any>}>({data: []});
    const [reviews, setReviews] = useState<Array<any>>([]);
    const [error, setError] = useState({
		photos: false,
		reviews: false,
		canReview: false,
	});
    const [loading, setLoading] = useState({
		photos: true,
		reviews: true,
		canReview: true,
	});
    const [openReviewDialog, setOpenReviewDialog] = useState(false);
    const [reviewCheck, setReviewCheck] = useState<{
		canReview: boolean;
		alreadyReview: boolean;
	} | undefined>(undefined);

	useEffect(() => {
		const fetchData = async ({
			url,
			onSuccess,
			key
		}: {
			url: string;
			onSuccess: (data: any) => void;
			key: keyof typeof error;
		}) => {
			try {
				const res = await fetch(url);
				if (!res.ok) {
					setError(prev => ({ ...prev, [key]: true }));
					setLoading(prev => ({ ...prev, [key]: false }));
					return;
				}
				const data = await res.json();
				onSuccess(data);
				setError(prev => ({ ...prev, [key]: false }));
				setLoading(prev => ({ ...prev, [key]: false }));
			} catch (err) {
				setError(prev => ({ ...prev, [key]: true }));
				setLoading(prev => ({ ...prev, [key]: false }));
			}
		};

		fetchData({
			url: `/api/v0/users/${params.userId}/photos?limit=3`,
			onSuccess: (data) => setPhotos(data.photos),
			key: "photos"
		});

		fetchData({
			url: `/api/v0/users/${params.userId}/reviews`,
			onSuccess: (data) => setReviews(data.reviews),
			key: "reviews"
		});

		fetchData({
			url: `/api/v0/reviews/check?reviewedId=${params.userId}`,
			onSuccess: (data) => setReviewCheck({
				canReview: data.canReview,
				alreadyReview: data.alreadyReview
			}),
			key: "canReview"
		});
	}, [params.userId]);

    return (
        <>
            {Object.keys(error).find(key => error[key] === true) && <Alert color="red">Oups an error occurred</Alert>} 
			<div className="flex flex-col gap-4">
				<Typography variant="h3">Travels memories</Typography>
            	{loading.photos ? (
            		<div className="w-full flex items-center justify-center"><Spinner /></div>
				) : (
					photos.data.length === 0 ? (
						<Typography variant="paragraph">No travel memory yet</Typography>
					) : (
						<>
							<div className="flex justify-between flex-wrap gap-y-5">
								{photos.data?.map((photo, index) => (
									<Image
										key={index}
										src={photo.url}
										alt="travel"
										className="object-cover object-center"
										width={280}
										height={300}
									/>
								))}
							</div>
							<Link className="self-end" href={`/users/${params.userId}/photos`}><Button variant="text" color="indigo">See all</Button></Link>
						</>
					)
				)}
			</div>
			<div>
				<Typography variant="h3">Comments</Typography>
				{loading.reviews ? '...' : (
					reviews.length === 0 ? <Typography variant="paragraph">No comments yet</Typography> : (
						<Carousel
							
							items={
								reviews?.map((review, index) => (
									<EvaluationCard
										key={index}
										review={review}
									/>
								))
							}
						/>
					)
				)}
				{reviewCheck?.canReview && <Button className="mt-10" onClick={() => setOpenReviewDialog(true)}>{reviewCheck.alreadyReview ? "Change your review" : "Review user"}</Button>}
				{openReviewDialog && (
					<ReviewDialog
						toggler={() => setOpenReviewDialog(!openReviewDialog)}
						open={openReviewDialog}
						reviewed={{
							userId: params.userId,
						}}
					/>
				)}
			</div>
        </>
    );
}

export default Page;