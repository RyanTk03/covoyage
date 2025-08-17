import { SignUp } from '@clerk/nextjs';
import React from 'react';

const page = () => {
    return (
        <div className="flex item-center justify-center pt-[5rem] h-[98vh]">
            <SignUp fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}/>
        </div>
    );
}

export default page;