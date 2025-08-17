"use client";
import React, { useState } from 'react';
import { Typography, Card, Spinner, Button } from '@material-tailwind/react';
import NotificationCard from '@/components/NotificationCard';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationsPage() {
    const { notifications, isFetching, error, setSearchState, searchState } = useNotifications();

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6 text-left">
            <Typography variant="h3" className="text-primary">
                🔔 Notifications
            </Typography>

            <div className="flex gap-2">
                <Button
                    onClick={() => setSearchState('all')}
                    color={searchState === 'all' ? 'blue' : 'gray'}
                    size="sm"
                >
                    All
                </Button>
                <Button
                    onClick={() => setSearchState('unread')}
                    color={searchState === 'unread' ? 'blue' : 'gray'}
                    size="sm"
                >
                    Unread
                </Button>
                <Button
                    onClick={() => setSearchState('read')}
                    color={searchState === 'read' ? 'blue' : 'gray'}
                    size="sm"
                >
                    Read
                </Button>
            </div>

            {isFetching && (
                <div className="flex justify-center py-10">
                    <Spinner color="blue" />
                </div>
            )}

            {error && (
                <Card className="bg-red-100 text-red-700 p-4">
                    An error occurs : {error}
                </Card>
            )}

            {!isFetching && notifications.length === 0 && (
                <Typography variant="paragraph" className="text-gray-600 text-center">
                    No notifications to show.
                </Typography>
            )}

            <div className="flex flex-col gap-3">
                {notifications.map((notification: any) => (
                    <NotificationCard
                        key={notification._id}
                        notification={notification}
                    />
                ))}
            </div>
        </div>
    );
}
