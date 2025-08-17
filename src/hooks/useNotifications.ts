import { useCallback, useEffect, useState } from 'react';

const staleTime = 300000;

export function useNotifications() {
	const [notificationsCounts, setNotificationsCounts] = useState({
		unread: 0,
		read: 0
	});
	const [notifications, setNotifications] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState<null | string>(null);
	const [searchState, setSearchState] = useState<'read' | 'unread' | 'all'>('all');

	const fetchNotificationsCount = useCallback(() => {
		setIsFetching(true);
		setError(null);

		return fetch('/api/v0/me/notifications/count')
			.then(res => {
				if (res.ok) {
					return res.json().then(data => {
						setNotificationsCounts(prev => ({
							...prev,
							...data.counts
						}));
					});
				}
			})
			.catch(error => setError("Failed to fetch counts"));
	}, []);

	const fetchNotifications = useCallback(() => {
		setIsFetching(true);
		setError(null);

		const url = new URL('/api/v0/me/notifications', window.location.origin);
		if (searchState === 'read') {
			url.searchParams.set('isRead', 'true');
		} else if (searchState === 'unread') {
			url.searchParams.set('isRead', 'false');
		}

		return fetch(url)
			.then(res => {
				if (!res.ok) {
					setError("Cannot fetch notifications");
				} else {
					return res.json().then(data => {
						setNotifications(data.notifications);
					});
				}
			})
			.catch(() => {
				setError("Network error");
			})
			.finally(() => {
				setIsFetching(false);
			});
	}, [searchState]);

	const refetch = useCallback(() => {
		fetchNotificationsCount();
		fetchNotifications();
	}, [fetchNotificationsCount, fetchNotifications]);

	useEffect(() => {
		refetch();

		const timer = setTimeout(() => {
			refetch();
		}, staleTime);

		return () => clearTimeout(timer);
	}, [refetch]);

	return {
		notificationsCounts,
		isFetching,
		error,
		notifications,
		setSearchState,
		searchState,
		refetch
	};
}
