"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { Avatar, Badge, Button, Card, List, ListItem, ListItemPrefix, Textarea, Typography } from "@/components/MaterialTailwind";
import { FaUserCog, FaBell, FaImages, FaMapMarkedAlt } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import { SignOutButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

export default function DashboardSidebar({user}: {user: {
    clerkId: string,
    imageUrl?: string,
    username?: string,
    description?: string
}}) {
    const [description, setDescription] = useState(user.description);
    const [userDescription, setUserDescription] = useState(user.description);
    const [fetching, setFetching] = useState(false);
    const [descriptionChanged, setDescriptionChanged] = useState(false);
	const { notificationsCounts } = useNotifications();

    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (segment) => {
        router.push(`/dashboard/${segment}`);
    }

    const handleDescriptionSave = () => {
        setFetching(true)
        fetch(`/api/v0/me/description`, {
            method: "PUT",
            body: JSON.stringify({
                description
            })
        })
        .then((res) => {
            if (!res.ok) {
                console.log(res.statusText);
            } else {
                setUserDescription(description);
            }
            setFetching(false);
        })
        .catch(err => {
            console.error(err);
            setFetching(false);
        });
    }

    useEffect(() => {
        if (description !== userDescription) {
            setDescriptionChanged(true);
        } else {
            setDescriptionChanged(false);
        }
    }, [description, userDescription]);

    return (
        <Card className="h-[100vh] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-primary-color rounded-tl-none sticky top-0">
            <div className="flex flex-col">
                <div className="mb-2 p-4 flex flex-col items-center">
                    <Avatar
                        withBorder={true}
                        color="blue"
                        size="xl"
                        src={user.imageUrl}
                    />
                    <Typography variant="h5" color="blue-gray">
                        {user.username}
                    </Typography>
                </div>
                <div className="flex flex-col items-end">
                    <Textarea color="green" value={description} onChange={e => setDescription(e.target.value)} label="description"></Textarea>
                    <Button className="mt-1" color="green" size="sm" onClick={handleDescriptionSave} disabled={!descriptionChanged || fetching}>Save modification</Button>
                </div>
            </div>
            <hr className="mt-3 border-gray-color"/>
            <List className="text-black">
                <ListItem
                    onClick={() => handleNavigation("my-account")}
                    className={`hover:bg-[#d0e3fd] focus:bg-[#d0e3fd] ${pathname.includes("my-account") ? "bg-[#d0e3fd]" : ""}`}
                >
                    <ListItemPrefix>
                        <FaUserCog className="h-5 w-5" />
                    </ListItemPrefix>
                    My account
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation("my-trips")}
                    className={`hover:bg-[#d0e3fd] focus:bg-[#d0e3fd] ${pathname.includes("my-trips") ? "bg-[#d0e3fd]" : ""}`}
                >
                    <ListItemPrefix>
                        <FaMapMarkedAlt className="h-5 w-5" />
                    </ListItemPrefix>
                    My trips
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation("notifications")}
                    className={`hover:bg-[#d0e3fd] focus:bg-[#d0e3fd] ${pathname.includes("notifications") ? "bg-[#d0e3fd]" : ""}`}
                >
                    <ListItemPrefix>
                        <Badge content={notificationsCounts.unread} withBorder>
                            <FaBell className="h-5 w-5" />
                        </Badge>
                    </ListItemPrefix>
                    Notifications
                </ListItem>
                <ListItem
                    onClick={() => handleNavigation("memories")}
                    className={`hover:bg-[#d0e3fd] focus:bg-[#d0e3fd] ${pathname.includes("memories") ? "bg-[#d0e3fd]" : ""}`}
                >
                    <ListItemPrefix>
                        <FaImages className="h-5 w-5" />
                    </ListItemPrefix>
                    Travels photos
                </ListItem>
            </List>
			<div className="flex gap-2 mt-5 p-2 rounded-md hover:bg-[#efefef]">
				<GoSignOut className="h-5 w-5" />
				<SignOutButton />
			</div>
        </Card>
    );
};
