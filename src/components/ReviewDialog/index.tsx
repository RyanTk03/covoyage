"use client"
import React, { useEffect, useState } from 'react';
import { 
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Typography,
	Textarea,
	Button,
	Alert,
	Rating
} from '@/components/MaterialTailwind';


interface DialogProps {
	toggler: () => void
	open: boolean
	reviewed: {
		userId: string
	}
}

const ReviewDialog = ({ toggler, open, reviewed }: DialogProps) => {
	const [sending, setSending] = useState(false);
	const [comment, setComment] = useState('');
	const [rating, setRating] = useState<number | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSendMessage = async () => {
		if (rating === undefined) {
			setError('Please provide a rating.');
			setSuccess(false);
			return;
		}

		setSending(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await fetch('/api/v0/reviews', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					comment,
					rating,
					reviewedId: reviewed.userId
				})
			});

			if (response.ok) {
				setSuccess(true);
			} else {
				setError('Something went wrong. Please try again.');
			}
		} catch (err) {
			console.error(err);
			setError('Something went wrong. Please try again.');
		} finally {
			setSending(false);
		}
	};

	// Reset state on dialog open
	useEffect(() => {
		if (open) {
			setComment('');
			setRating(undefined);
			setError(null);
			setSuccess(false);
			setSending(false);
		}
	}, [open]);

	return (
		<Dialog open={open} size="xs" handler={toggler}>
			<div className="flex items-center justify-between">
				<DialogHeader className="flex flex-col items-start">
					<Typography className="mb-1" variant="h4">
						Review this user
					</Typography>
				</DialogHeader>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="mr-3 h-5 w-5 cursor-pointer"
					onClick={toggler}
				>
					<path
						fillRule="evenodd"
						d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
						clipRule="evenodd"
					/>
				</svg>
			</div>

			{success && <Alert className="my-2" variant="ghost" color="green">Review submitted successfully.</Alert>}
			{error && <Alert className="my-2" variant="ghost" color="red">{error}</Alert>}

			<DialogBody>
				<div className="grid gap-6">
					<Textarea
						label="Comment (optional)"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
				</div>
				<div className="flex pt-3">
					<Rating onChange={(value) => setRating(value)} value={rating} />
				</div>
			</DialogBody>

			<DialogFooter className="space-x-2">
				<Button variant="text" color="blue" onClick={toggler}>
					Cancel
				</Button>
				<Button
					variant="gradient"
					color="blue"
					onClick={handleSendMessage}
					disabled={sending || rating === undefined}
				>
					{sending ? 'Submitting...' : 'Review'}
				</Button>
			</DialogFooter>
		</Dialog>
	);
};

export default ReviewDialog;