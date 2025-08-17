
import { EdgeStoreContext, edgeStoreRouter } from '@/lib/edgestore/init';
import { auth } from '@clerk/nextjs/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

function createContext(): EdgeStoreContext {
	const { userId } = auth();

	return {
		userId: userId,
	};
}

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});

export { handler as GET, handler as POST };
