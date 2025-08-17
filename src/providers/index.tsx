import React, { PropsWithChildren } from 'react';
import ClerkProvider from './clerk';
import MaterialTailwindProvider from './materialTailwind';
import EdgeStoreProvider from './edgestore';


/**
 * This component is a wrapper that wrap all the application with all
 * the providers of the application
 * 
 * 
 * @param props the props of this component that content the children which
 * represent all the pages and component of the app
 * @returns A component that wrap all the elements of the app with all the
 * providers used in the application
 */
export default function Providers({children}: PropsWithChildren) {
    return (
        <ClerkProvider>
            <MaterialTailwindProvider>
				<EdgeStoreProvider>
                	{children}
				</EdgeStoreProvider>
            </MaterialTailwindProvider>
        </ClerkProvider>
    );
}
