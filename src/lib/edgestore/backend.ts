import { initEdgeStoreClient } from "@edgestore/server/core";
import { edgeStoreRouter } from "./init";
  
export const backendClient = initEdgeStoreClient({
	router: edgeStoreRouter,
});
