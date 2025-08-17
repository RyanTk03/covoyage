import React from 'react';
import Footer from '@/components/Footer';


export default function MainLayout({children}: Readonly<{children: React.ReactNode;}>) {
	return (
        <>
			<div className="min-h-screen">
            	{children}
			</div>
            <Footer />
        </>
		
	);
}