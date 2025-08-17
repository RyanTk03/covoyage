import React from 'react';
import { Avatar, Card, CardBody, Rating, Typography } from '@/components/MaterialTailwind';


const EvaluationCard = ({ review }) => {
    return (
        <Card className="w-2/3">
            <CardBody className="px-8 text-center">
                <Typography variant="paragraph" className="mb-6 font-medium">
                    {review.comment}
                </Typography>
                <Avatar
                    src={review?.reviewer?.profilePicture}
                    alt="user avatar"
                    size="md"
                />
                <Typography variant="h6" className="mt-4">
                    {review?.reviewer?.username}
                </Typography>
                <Typography variant="small" color="gray" className="flex items-center justify-center gap-2">Score awarded<Rating value={review.rating} readonly /></Typography>
            </CardBody>
        </Card>
    );
}

export default EvaluationCard;