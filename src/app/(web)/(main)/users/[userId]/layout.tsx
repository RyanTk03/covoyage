import React, { Suspense } from 'react';
import { Avatar, Typography, Rating } from '@/components/MaterialTailwind';
import { getUser } from '@/services/user';
import Spinner from '@/components/Spinner';


const UserLayoutPage = async ({params, children}) => {
    const user = await getUser(params.userId);
    if (!user) {
        console.error("Cannot get user profile date");
		throw new Error("Cannot get user profile date")
    }

    return (
        <main className="flex justify-center items-stretch flex-col gap-4 w-3/4 m-auto mb-5">
        {
            !user ? <Typography variant="h1" className="text-center">Oups an error occurred</Typography> :
            <>
                <div className="flex justify-start gap-10 py-5">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar
                            src={user.imageUrl}
                            alt="avatar"
                            withBorder={true}
                            color="blue-gray"
                            size="xl"
                            className="p-0.5"
                        />
                        <div className="text-center">
							<Rating value={user.score ?? undefined} readonly />
                            <Typography variant="paragraph">{user.username}</Typography>
                        </div>
                    </div>
                    <div className="w-3/4 flex items-start justify-left text-center pl-6 py-5">
                        <Typography variant="paragraph">{user.description}</Typography>
                    </div>
                </div>
				<Suspense fallback={<Spinner />}>
                	{children}
				</Suspense>
            </>
        }
        </main>
    );
}

export default UserLayoutPage;
