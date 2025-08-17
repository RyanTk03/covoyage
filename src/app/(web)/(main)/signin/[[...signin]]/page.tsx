import { SignIn } from '@clerk/nextjs';
import React from 'react';

const page = () => {
    return (
        <div className='flex item-center justify-center pt-[8rem] h-[98vh]'>
            <SignIn fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL} />
        </div>
    );
}

export default page;