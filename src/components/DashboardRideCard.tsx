import React from 'react';
import { Typography } from '@/components/MaterialTailwind';
import { FaRegUser } from 'react-icons/fa';
import { IoCalendarNumberOutline, IoLocation } from 'react-icons/io5';
import { RideStateCodeEnum } from '@/lib/constants';
import Link from 'next/link';
import { BiArrowToRight } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';

interface DashboardRideCardProps {
	ride: {
		_id: string;
		title: string;
		departure: {
			date: string;
			city: string;
		};
		arrival: {
			date?: string;
			city: string;
		};
		numberOfTraveller: number;
		state: RideStateCodeEnum;
	};
}

export default function DashboardRideCard({ ride }: DashboardRideCardProps) {
	const isComing = ride.state === RideStateCodeEnum.COMMING;
	const departureDate = new Date(ride.departure.date).toLocaleDateString();
	const arrivalDate = ride.arrival.date ? new Date(ride.arrival.date).toLocaleDateString() : null;

	const cardStyle = isComing
		? 'bg-blue-50 border-blue-200 text-blue-800'
		: 'bg-gray-100 border-gray-300 text-gray-800';

	const titleStyle = isComing ? 'text-blue-700' : 'text-gray-700';
	const iconColor = isComing ? 'text-blue-600' : 'text-gray-600';

	return (
		<Link
			href={`/dashboard/my-trips/${ride._id}`}
			className="transition-all duration-200 hover:shadow-xl hover:scale-[1] scale-[0.99]"
		>
			<div className={`flex flex-col gap-3 border rounded-xl p-5 shadow-sm ${cardStyle}`}>
				<Typography variant="h5" className={`font-bold ${titleStyle}`}>
					{ride.title}
				</Typography>

				<div className="flex flex-wrap items-center gap-5 text-sm font-medium">
					<div className="flex items-center gap-2">
						<FaRegUser className={iconColor} />
						<span>{ride.numberOfTraveller} passager{ride.numberOfTraveller > 1 ? 's' : ''}</span>
					</div>

					<div className="flex items-center gap-2 flex-wrap">
						<IoLocation className="text-green-600" />
						<span>{ride.departure.city}</span>

						<IoCalendarNumberOutline className="text-purple-600" />
						<span>{departureDate}</span>

						<BsArrowRight size={20} />

						<IoLocation className="text-red-600" />
						<span>{ride.arrival.city}</span>

						{arrivalDate && (
							<>
								<IoCalendarNumberOutline className="text-purple-600" />
								<span>{arrivalDate}</span>
							</>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
}
