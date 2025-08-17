import React from 'react';
import { Button, IconButton, Input } from '@/components/MaterialTailwind';
import { FiMoreHorizontal } from 'react-icons/fi';


export default function SearchTravelForm({criteria, onSearchCriteriaChange, toggleFilter}) {

    return (
        <div className="w-full flex justify-center gap-5 items-center flex-wrap p-8 border-b border-b-blue-gray-100">
            <div className="flex gap-1 flex-wrap">
				<div>
					<Input
						type="text"
						label="departure address"
						value={criteria.departureCity}
						onChange={e => onSearchCriteriaChange('departureCity', e.target.value)}
					/>
				</div>
				<div>
					<Input
						type="text"
						label="arrival address"
						value={criteria.arrivalCity}
						onChange={e => onSearchCriteriaChange('arrivalCity', e.target.value)}
					/>
				</div>
				<div>
					<Input
						type="date"
						label="departure date"
						value={criteria.departureDate}
						onChange={e => onSearchCriteriaChange('departureDate', e.target.value)}
					/>
				</div>
            </div>
            <div className="flex gap-2">
                <IconButton color="teal" onClick={toggleFilter}><FiMoreHorizontal /></IconButton>
            </div>
        </div>
    );
}
