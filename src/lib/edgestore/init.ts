import { auth } from '@clerk/nextjs/server';
import { initEdgeStore } from '@edgestore/server';

export type EdgeStoreContext = {
	userId: string | null;
};

const es = initEdgeStore.context<EdgeStoreContext>().create();

/**
 * This is the main router for the EdgeStore buckets.
 */
export const edgeStoreRouter = es.router({
  travels: es.imageBucket()
  .path(({ ctx }) => [{ author: ctx.userId ?? '' }]),
});

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
