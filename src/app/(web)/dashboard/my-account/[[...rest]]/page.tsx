"use client";
import { UserProfile, useAuth } from '@clerk/nextjs';
import Spinner from '@/components/Spinner';

export default function AccountPage() {
    const {isLoaded, isSignedIn} = useAuth();

    return (
        <div className="w-full h-full flex justify-center">
            {isSignedIn && isLoaded && (
				<UserProfile
					path="/dashboard/my-account"
					appearance={{
    					elements: {
							rootBox: {
								flex: '1',
								padding: '1rem'
							},
    						cardBox: {
								width: '100%',
								height: '100%',
							},
    					}
					}}
				/>
			)}
            {!isLoaded && <div className="w-full pt-24 flex items-center justify-center"><Spinner /></div>}
            {!isSignedIn && <p>Redirecting to login page...</p>}
        </div>
    );
}
