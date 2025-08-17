'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Typography, Avatar, Button } from '@/components/MaterialTailwind';
import { NotificationTypeCodeEnum } from '@/lib/constants';
import { resolveNotification } from '@/lib/notificationUtils';
import { BiCheck, BiUndo } from 'react-icons/bi';
import { redirect } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationCardProps {
	notification: {
		_id: string;
		type: NotificationTypeCodeEnum;
		isRead: boolean;
		details?: {
			user?: {
				clerkId: string;
				username: string;
				profilePicture?: string;
			};
			ride?: {
				_id: string;
			};
		};
	};
}

export default function NotificationCard({ notification }: NotificationCardProps) {
	const [isRead, setIsRead] = useState(notification.isRead);
	const [loading, setLoading] = useState(false);
	const { refetch } = useNotifications();

	const { subject, content, link, icon: Icon } = resolveNotification(notification.type, notification.details);

	const handleToggleRead = async (toRead: boolean) => {
		setIsRead(toRead)
		setLoading(true);
		try {
			await fetch(`/api/v0/me/notifications/${notification._id}/${toRead ? 'read' : 'unread'}`, {
				method: 'PATCH',
			});
			setIsRead(toRead);
			refetch();
		} catch (err) {
			console.error(`Failed to mark as ${toRead ? 'read' : 'unread'}`, err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className={`flex gap-4 items-start p-4 border rounded-2xl shadow-sm transition-all duration-200 ${
				isRead ? 'border-gray-300 bg-white' : 'border-blue-color bg-primary-color'
			} hover:shadow-md ${link && 'cursor-pointer'}`}
			onClick={() => {
				if (link) {
					redirect(link);
				}
			}}
		>
			<div className="relative w-10 h-10">
				<div className="w-10 h-10 bg-blue-color text-white rounded-full flex items-center justify-center shadow-md">
					<Icon size={20} />
				</div>

				{notification.details?.user?.profilePicture && (
					<div className="absolute -bottom-1 -right-1">
						<Avatar
							src={notification.details.user.profilePicture}
							alt="profile"
							size="xs"
							className="border-2 border-white shadow-sm"
						/>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-1 flex-1">
				<Typography variant="h6" className="text-gray-900 font-semibold">
					{subject}
				</Typography>
				<Typography variant="paragraph" className="text-gray-700 text-sm">
					{content}
				</Typography>
			</div>

			<div className="ml-auto mt-1">
				{isRead ? (
					<Button
						variant="text"
						size="sm"
						color="gray"
						onClick={() => handleToggleRead(false)}
						disabled={loading}
					>
						<BiUndo size={18} className="mr-1 inline" />
						Mark as unread
					</Button>
				) : (
					<Button
						variant="text"
						size="sm"
						color="gray"
						onClick={() => handleToggleRead(true)}
						disabled={loading}
					>
						<BiCheck size={18} className="mr-1 inline" />
						Mark as read
					</Button>
				)}
			</div>
		</div>
	);
}
