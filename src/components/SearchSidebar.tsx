"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    Typography,
    Input,
    Option,
    Select
} from '@/components/MaterialTailwind';

interface Transport{
	code: string;
	label: string;
	_id: string;
}

export default function SearchSidebar({criteria, onFilterCriteriaChange}) {
    const [transports, setTransports] = useState<Transport[]>([]);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        fetch("/api/v0/transports")
        .then(response => {
            response.json()
            .then((data: {transports: Transport[]}) => setTransports(data.transports))
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <aside className="min-h-screen w-full border-r-2 border-gray-100" ref={ref}>
            <Card className="bg-slate-500 min-h-screen w-full p-4 shadow-xl shadow-blue-gray-900/5">
				<Typography variant="h5" className="text-secondary-color py-5">
					More filters
				</Typography>
                <div className="p-2">
                    <Input
                        label="Minimum owner mark"
                        type="number"
                        max={5}
                        min={0}
                        value={criteria.ownerMinRate}
                        onChange={e => onFilterCriteriaChange('ownerMinScore', e.target.value ?? undefined)}
                    />
                </div>
                <div className="p-2">
                    <Input
                        label="Max travellers"
                        type="number"
                        max={5}
                        min={1}
                        value={criteria.maxTravellers}
                        onChange={e => onFilterCriteriaChange('maxTravellers', e.target.value)}
                    />
                </div>
                <div className="p-2">
                    <Select
                        label="Transport"
                        onChange={value => onFilterCriteriaChange('transport', value)}
                    >
						<Option value="any">Any</Option>
                        {transports?.map((transport, index) => (
                            <Option key={index} value={transport._id}>{transport.label}</Option>
                        ))}
                    </Select>
                </div>
            </Card>
        </aside>
    );
}
