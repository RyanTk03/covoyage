"use client";
import React, { useCallback, useEffect, useState } from 'react';
import SearchTravelForm from '@/components/SearchTravelForm';
import SearchSidebar from '@/components/SearchSidebar';
import RideCard from '@/components/RideCard';
import Spinner from '@/components/Spinner';
import { Typography } from '@/components/MaterialTailwind';

const Page = () => {
    const [rides, setRides] = useState<any[]>();
	const [openFilter, setOpenFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({});

	const fetchRides = useCallback(() => {
        setLoading(true);
        fetch(`/api/v0/rides?${new URLSearchParams({
            ...searchCriteria
        }).toString()}`, {cache: 'no-store'})
        .then(res => {
            if (!res.ok) {
                console.log("cannot get the listing");
                setLoading(false);
            } else {
                res.json()
                .then(data => {
                    setRides(data.rides);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
            }
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
	}, [searchCriteria]);

    const handleChange = (criterion: 'departureCity' | 'arrivalCity' | 'departureDate' | 'transport' | 'ownerMinScore' | 'maxTravellers', value: string|undefined) => {
        setSearchCriteria({
            ...searchCriteria,
            [criterion]: value
        })
    }

	useEffect(() => {
		fetchRides();
	}, [fetchRides]);

    return (
        <div className="flex">
            <div style={{width: openFilter ? '25%' : '0', overflow: 'hidden'}} className="transition-all">
                <SearchSidebar
                    criteria={searchCriteria}
                    onFilterCriteriaChange={handleChange}
                />
            </div>
            <main className="flex flex-col items-center w-full">
                <SearchTravelForm
					criteria={searchCriteria}
					onSearchCriteriaChange={handleChange}
					toggleFilter={() => setOpenFilter(prev => !prev)}
				/>
                <div className=" w-full flex flex-col justify-center items-center gap-4">
                    {loading && <div className="w-full pt-24 flex items-center justify-center"><Spinner /></div>}
					{rides && rides.length === 0 && <Typography className="py-5" variant="paragraph">No ride found</Typography> }
                    {rides && rides.map((ride, index) => <RideCard key={index} travel={ride} />)}
                </div>
            </main>
        </div>
        
    );
}

export default Page;