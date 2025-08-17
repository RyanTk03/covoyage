import DashboardSidebar from '@/components/DashbordSidebar';
import React from 'react';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { getUser } from '@/services/user';


export default async function DashboardLayout({children}) {
    const { userId } = auth();
	if (!userId) {
		throw new Error("No logged in user");
	}

    const user = await getUser(userId);

    return (
        <>
        {user && 
            <div className="flex">
                <aside>
                    <DashboardSidebar user={{
                        clerkId: user.id,
                        username: user.username ?? undefined,
                        imageUrl: user.imageUrl,
                        description: user.description ?? undefined,
                    }}/>
                </aside>
                <main className="w-full">
                    {children}
                </main>
            </div>
        }
        </>
        
    );
}
