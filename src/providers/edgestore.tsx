import React, { PropsWithChildren } from 'react'
import { EdgeStoreProvider as DefaultEdgeStoreProvider } from '@/lib/edgestore/client';

const EdgeStoreProvider = ({ children }: PropsWithChildren) => {
	return (
		<DefaultEdgeStoreProvider basePath="/api/v0/edgestore">
			{children}
		</DefaultEdgeStoreProvider>
	);
};

export default EdgeStoreProvider;
