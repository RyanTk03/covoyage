"use client";
import React from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/MaterialTailwind";
import { useNotifications } from "@/hooks/useNotifications";

const userButton = (
	<UserButton
		showName
		userProfileMode="navigation"
		userProfileUrl={process.env.NEXT_PUBLIC_CLERK_DASHBOARD_URL as string}
	/>
);

export default function SignedInNav() {
	const { notificationsCounts } = useNotifications();

	return (
		<ul className="flex items-center gap-5">
			<li className="text-white font-bold">
				<Link href="/rides/search">Search</Link>
			</li>
			<li className="text-white font-bold">
				<Link href="/rides/create">Publish travel</Link>
			</li>
			<li className="ml-10">
				{notificationsCounts.unread > 0 ? (
					<Badge content={notificationsCounts.unread} withBorder color="red">
						{userButton}
					</Badge>
				) : userButton}
			</li>
		</ul>
	);
}
