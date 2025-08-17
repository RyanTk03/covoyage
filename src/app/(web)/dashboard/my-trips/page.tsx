"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Typography } from '@/components/MaterialTailwind';
import DashboardRideCard from '@/components/DashboardRideCard';
import { RideStateCodeEnum } from '@/lib/constants';

export default function MemoriesPage() {
    const [rides, setRides] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [canceled, setCanceled] = useState(false);
    
    const handleCancel = (id) => {
        fetch(`/api/v0/rides/${id}`, {method: "DELETE"})
        .then(res => {
            if (res.ok) {
                setCanceled(true);
            }
        })
        .catch(err => console.error(err))
    }

    useEffect(() => {
        fetch('/api/v0/me/rides')
        .then(res => {
            if (!res.ok) {
                setError(true);
                setLoading(false)
            } else {
                res.json()
                .then(data => {
					console.log(data)
                    setRides(data.rides);
                    setError(false);
                    setLoading(false);
                })
                .catch(err => {
                    setError(true);
                    setLoading(false);
                });
            }
        })
        .catch(err => {
            setError(true);
            setLoading(false);
        });
    }, []);

    const commingRides: any = useMemo(() => {
        if (!rides) return null;
        return rides.find((ride: any) => ride.state === RideStateCodeEnum.COMMING);
    }, [rides]);

    const otherRides: any = useMemo(() => {
        if (!rides) return [];
        return rides.filter((ride: any) => ride.state !== RideStateCodeEnum.COMMING);
    }, [rides]);

    return (!error ?
        <div className="w-full">
            <Typography variant="h2" className="p-5">My trips</Typography>
            <div className="flex flex-col w-full p-1 pr-4">
                <div className="flex flex-col border-2 border-gray-color rounded-md p-2 my-5 w-full">
                    <Typography variant="h3" color="green">Comming</Typography>
                    {canceled ? <Typography variant="lead">Travel canceled</Typography> : commingRides ?
                    <DashboardRideCard ride={commingRides}/> : null}
                    {<Button disabled={!commingRides || canceled} variant="text" color="red" onClick={() => handleCancel(commingRides._id)} className="self-end">Cancel</Button>}
                </div>
                <div className="border-t-2 border-primary-color py-4 px-10 w-full">
                    <Typography variant="h3" color="gray">Past trips</Typography>
                    <div className="flex flex-col w-full">
                        {otherRides.map(ride =>
                            <DashboardRideCard
                                key={ride._id}
                                ride={ride}
                            />
                        )}
                    </div>
                        
                </div>
            </div>
        </div> :
        <Typography variant="lead">Oops an error occured</Typography>
    );
}