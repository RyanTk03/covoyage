"use client";
import React, { useEffect, useState } from "react";
import {
	Avatar, Button, Card, Input, Option, Select, Textarea, Typography, Chip
} from "@/components/MaterialTailwind";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { BookingStateCodeEnum } from "@/lib/constants";

export default function RideEditPage({ params }) {
	const [ride, setRide] = useState<Record<string, any>>();
	const [bookings, setBookings] = useState<Array<Record<string, any>>>([]);
	const [transports, setTransports] = useState([]);

	const [rideLoading, setRideLoading] = useState(true);
	const [bookingsLoading, setBookingsLoading] = useState(true);
	const [transportsLoading, setTransportsLoading] = useState(true);
	const [saved, setSaved] = useState(false);
	const [closed, setClosed] = useState(false);
	const [error, setError] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);

	const router = useRouter();

	const handleSave = async () => {
		try {
			setActionLoading(true);
			const res = await fetch(`/api/v0/me/rides/${params.id}`, {
				method: "PUT",
				body: JSON.stringify(ride),
			});
			if (res.ok) setSaved(true);
		} catch (err) {
			console.error(err);
		} finally {
			setActionLoading(false);
		}
	};

	const handleClose = async () => {
		try {
			setActionLoading(true);
			const res = await fetch(`/api/v0/me/rides/${params.id}/close`, {
				method: "POST",
			});
			if (res.ok) setClosed(true);
		} catch (err) {
			console.error(err);
		} finally {
			setActionLoading(false);
		}
	};

	const handleChange = (field: string, value: any) => {
		setRide({ ...ride, [field]: value });
	};

	const handleBookingAction = async (bookingId: string, action: "accept" | "reject") => {
		try {
			setActionLoading(true);
			if (action === 'accept' && bookings.filter(b => b.state.toUpperCase() === "accept".toUpperCase()).length >= ride?.numberOfTraveller) {
				if (confirm('Maximum traveller reached. Do you want to update it?')) {
					const res = await fetch(`/api/v0/me/rides/${params.id}`, {
						method: "PUT",
						body: JSON.stringify({
							numberOfTraverller: ride?.numberOfTraveller + 1,
						}),
					});

					if (!res.ok) {
						throw Error('cannot update ride number of traveller');
					}
				} else {
					return;
				}
			}
			const res = await fetch(
				`/api/v0/me/rides/${params.id}/bookings/${bookingId}/${action}`,
				{ method: "POST" }
			);
			if (res.ok) {
				setBookings((prev) =>
					prev.map((b) =>
						b._id === bookingId ? { ...b, state: action.toUpperCase() } : b
					)
				);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setActionLoading(false);
		}
	};

	const handleDeleteRide = async () => {
		try {
			setActionLoading(true);
			const res = await fetch(`/api/v0/me/rides/${params.id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				router.push("/dashboard/my-travels");
			}
		} catch (err) {
			console.error(err);
		} finally {
			setActionLoading(false);
		}
	};

	useEffect(() => {
		const load = async () => {
			try {
				const resRide = await fetch(`/api/v0/rides/${params.id}`);
				const { ride: rideData } = await resRide.json();
				const depDate = new Date(rideData.departure.date);
				setRide({
					...rideData,
					departure: {
						...rideData.departure,
						date: depDate.toISOString().split("T")[0],
					},
				});
				setRideLoading(false);
			} catch (err) {
				setError(true);
				setRideLoading(false);
			}

			try {
				const res2 = await fetch("/api/v0/transports");
				const data2 = await res2.json();
				setTransports(data2.transports);
				setTransportsLoading(false);
			} catch (err) {
				setTransports([]);
				setTransportsLoading(false);
			}

			try {
				const bookingsRes = await fetch(`/api/v0/me/rides/${params.id}/bookings`);
				const bookingsData = await bookingsRes.json();
				setBookings(bookingsData.bookings.map(booking => ({...booking._doc, user: booking.user})));
				setBookingsLoading(false);
			} catch (err) {
				setBookingsLoading(false);
			}
		};

		load();
	}, [params.id]);

	if (rideLoading) {
		return (
			<div className="w-full pt-24 flex items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (error) {
		return <Typography variant="lead" className="text-center mt-10">Error loading ride data</Typography>;
	}
console.log(bookings);
	return (
		<div className="py-10 px-6 max-w-5xl mx-auto">
			<Typography variant="h2" className="mb-6">Edit Travel</Typography>

			<div className="flex flex-col gap-6">
				<Card className="p-6 shadow-md space-y-6">
					{/* Formulaire principal */}
					<div className="space-y-4">
						<Input label="Title" value={ride?.title} onChange={(e) => handleChange("title", e.target.value)} />
						<Textarea label="Description" value={ride?.description} onChange={(e) => handleChange("description", e.target.value)} />
					</div>

					<div className="space-y-3">
						<Typography variant="h5" className="text-primary-color">Departure</Typography>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								label="City"
								value={ride?.departure.city}
								onChange={(e) =>
									setRide({
										...ride,
										departure: { ...ride?.departure, city: e.target.value },
									})
								}
							/>
							<Input
								type="date"
								label="Date"
								value={ride?.departure.date}
								onChange={(e) =>
									setRide({
										...ride,
										departure: { ...ride?.departure, date: e.target.value },
									})
								}
							/>
						</div>
					</div>

					<div className="space-y-3">
						<Typography variant="h5" className="text-primary-color">Arrival</Typography>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								label="City"
								value={ride?.arrival.city}
								onChange={(e) =>
									setRide({
										...ride,
										arrival: { ...ride?.arrival, city: e.target.value },
									})
								}
							/>
							<Input type="date" label="Date" value={ride?.arrival.date} disabled />
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<Input
							type="number"
							label="Number of Travellers"
							value={ride?.numberOfTraveller}
							onChange={(e) => handleChange("numberOfTraveller", e.target.value)}
						/>

						<Select
							label="Transport"
							onChange={(value) => handleChange("transport", value)}
							disabled={transportsLoading}
						>
							{transports.map((transport: any) => (
								<Option key={String(transport._id)} value={String(transport._id)}>
									{transport.label}
								</Option>
							))}
						</Select>
					</div>

					<div className="flex gap-4 mt-6">
						<Button color="blue" onClick={handleClose} disabled={actionLoading}>
							Close travel
						</Button>
						<Button color="green" onClick={handleSave} disabled={actionLoading}>
							Save Changes
						</Button>
						<Button color="red" onClick={handleDeleteRide} disabled={actionLoading}>
							Delete Ride
						</Button>
					</div>

					{saved && (
						<Typography color="green" className="text-sm mt-2">
							✔️ Trip saved successfully
						</Typography>
					)}
				</Card>

				<div className="mt-10">
					<Typography variant="h4" className="mb-4 text-primary-color">Bookings</Typography>

					{bookingsLoading ? (
						<div className="flex justify-center py-8"><Spinner /></div>
					) : (
						<Card className="overflow-x-auto">
							<table className="min-w-full table-auto text-left">
								<thead>
									<tr className="bg-gray-100">
										<th className="p-4">User</th>
										<th className="p-4">Username</th>
										<th className="p-4">Status</th>
										<th className="p-4 text-center">Actions</th>
									</tr>
								</thead>
								<tbody>
									{bookings?.length > 0 ? (
										bookings.map((booking, index) => (
											<tr key={index} className="border-t">
												<td className="p-4"><Avatar size="sm" src={booking.user?.imageUrl} /></td>
												<td className="p-4">{booking.user?.username}</td>
												<td className="p-4">
													<Chip
														className="text-center"
														value={booking.state === BookingStateCodeEnum.PENDING ? "Pending" : booking.state === BookingStateCodeEnum.ACCEPTED ? "Accepted" : "Rejected"}
														color={
															booking.state === BookingStateCodeEnum.PENDING
																? "blue-gray"
																: booking.state === BookingStateCodeEnum.ACCEPTED
																	? "green"
																	: "red"
														}
														size="sm"
													/>
												</td>
												<td className="p-4 flex gap-2 justify-center">
													<Button
														size="sm"
														color="blue"
														onClick={() => handleBookingAction(booking._id, "accept")}
														disabled={actionLoading || booking.state !== BookingStateCodeEnum.PENDING}
													>
														Accept
													</Button>
													<Button
														size="sm"
														color="red"
														onClick={() => handleBookingAction(booking._id, "reject")}
														disabled={actionLoading || booking.state !== BookingStateCodeEnum.PENDING}
													>
														Reject
													</Button>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={4} className="text-center p-4 text-gray-500">
												No participations found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
