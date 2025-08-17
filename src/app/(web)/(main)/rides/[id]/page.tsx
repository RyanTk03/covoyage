"use client";
import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Typography,
	Rating,
	Button,
	Alert,
	Card
} from '@/components/MaterialTailwind';
import Spinner from '@/components/Spinner';
import { BookingStateCodeEnum } from '@/lib/constants';
import MessageDialog from '@/components/MessageDialog';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = ({ params }: { params: { id: string } }) => {
	const [ride, setRide] = useState<any>(null);
	const [bookings, setBookings] = useState<any[]>([]);
	const [fetching, setFetching] = useState(false);
	const [firstLoading, setFirstLoading] = useState(true);
	const [error, setError] = useState(false);
	const [participationError, setParticipationError] = useState(false);
	const [subscribed, setSubscribed] = useState(false);
	const [subscriptionState, setSubscriptionState] = useState('');
	const [openDialog, setOpenDialog] = useState(false);

	const { userId: authentifiedUserId } = useAuth();

	const handleOpenDialog = () => setOpenDialog(!openDialog);

	const askParticipation = async () => {
		if (!authentifiedUserId) {
			redirect('/signin')
		}
		setFetching(true);
		try {
			const res = await fetch(`/api/v0/me/bookings`, {
				method: "POST",
				body: JSON.stringify({ rideId: params.id })
			});
			const data = await res.json();
			if (!res.ok) throw new Error("Participation failed");

			setParticipationError(false);
			setSubscribed(true);
			setSubscriptionState(data.booking.state);
		} catch {
			setParticipationError(true);
		} finally {
			setFetching(false);
		}
	};

	const fetchRide = async () => {
		try {
			const res = await fetch(`/api/v0/rides/${params.id}`, { cache: "no-store" });
			const data = await res.json();
			if (!res.ok || !data.ride) throw new Error("Ride not found");
			setRide(data.ride);
		} catch {
			setError(true);
		}
	};

	const fetchBookings = async () => {
		try {
			const res = await fetch(`/api/v0/rides/${params.id}/bookings`);
			const data = await res.json();
			if (!res.ok || !data.bookings) throw new Error("Bookings not found");
			setBookings(data.bookings);

			const userBooking = data.bookings.find(
				(b: any) => b.user.clerkId === authentifiedUserId
			);
			if (userBooking) {
				setSubscribed(true);
				setSubscriptionState(userBooking.state);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		(async () => {
			await Promise.all([fetchRide(), fetchBookings()]);
			setFirstLoading(false);
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (firstLoading)
		return <div className="w-full h-screen flex items-center justify-center"><Spinner /></div>;

	if (error)
		return <Typography variant="lead">Oops, an error occurred.</Typography>;

	if (!ride) {
		return <Spinner />;
	}

	return (
		<main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
			{participationError && (
				<Alert className="text-center" variant="filled" color="red">
					Error when sending the participation request
				</Alert>
			)}

			{/* Ride Title and Description */}
			<section className="text-center">
				<Typography variant="h2" className="mb-2">{ride?.title}</Typography>
				<Typography variant="paragraph" color="gray">{ride?.description}</Typography>
			</section>

			{/* Ride Creator */}
			<Typography variant="lead">Created by</Typography>
			<Card className="p-6 flex flex-col sm:flex-row items-center gap-5 shadow-md rounded-xl transition hover:shadow-lg">
				<Avatar
					src={ride.owner?.imageUrl}
					alt="owner"
					withBorder
					size="lg"
					className="transition-transform duration-200 hover:scale-105"
				/>
				<div className="text-center sm:text-left">
					<Typography variant="h5">{ride.owner?.username}</Typography>
					<Rating value={ride.owner?.score} readonly />
					<div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
						<a href={`/users/${ride.owner?.clerkId}`}>
							<Button variant="outlined" color="blue" size="sm">See profile</Button>
						</a>
						<Button variant="filled" color="blue" size="sm" onClick={handleOpenDialog}>
							Contact
						</Button>
					</div>
				</div>
			</Card>

			{/* Ride Details */}
			<Typography variant="lead">Details</Typography>
			<section className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<Card className="p-4 bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition">
					<Typography variant="h6" className="mb-1">Departure</Typography>
					<p className="text-gray-700">
						{ride.departure.city}<br />
						{new Date(ride.departure.date).toLocaleDateString()}
					</p>
				</Card>
				<Card className="p-4 bg-green-50 rounded-xl shadow-sm hover:shadow-md transition">
					<Typography variant="h6" className="mb-1">Arrival</Typography>
					<p className="text-gray-700">
						{ride.arrival.city}<br />
						{ride.arrival?.date && new Date(ride.arrival.date).toLocaleDateString()}
					</p>
				</Card>
			</section>

			{/* Participants */}
			<section className="text-center">
				<Typography variant="lead" className="mb-4">You could travel with</Typography>
				{bookings.length > 0 ? (
					<div className="flex flex-wrap justify-center gap-6">
						{bookings.map((b: any, index) => (
							<a
								key={index}
								href={`/users/${b.user.clerkId}`}
								className="flex flex-col items-center group transition-transform hover:scale-105"
							>
								<Avatar src={b.user.imageUrl} size="md" />
								<Typography className="mt-1 text-sm group-hover:underline">{b.user.username}</Typography>
							</a>
						))}
					</div>
				) : (
					<p className="text-gray-500">No user subscribed yet</p>
				)}
			</section>

			{/* Participation CTA */}
			{authentifiedUserId !== ride?.userId && (
				<div className="flex justify-center">
					<Button
						color="green"
						size="lg"
						className="w-full sm:w-auto transition hover:scale-[1.02]"
						disabled={fetching || subscribed || authentifiedUserId === ride.owner?.clerkId}
						onClick={askParticipation}
					>
						{!subscribed
							? "Ask to join"
							: subscriptionState === BookingStateCodeEnum.PENDING
								? "Request sent – waiting for approval"
								: subscriptionState === BookingStateCodeEnum.REJECTED
									? "Request rejected – cannot join"
									: "Accepted – get ready for the trip"}
					</Button>
				</div>
			)}

			{/* Contact Dialog */}
			{openDialog && (
				<MessageDialog
					open={openDialog}
					handleOpen={handleOpenDialog}
					receiver={ride.owner?.clerkId}
					sender={authentifiedUserId as string}
					receiverUsername={ride.owner?.username}
				/>
			)}
		</main>
	);
};

export default Page;
