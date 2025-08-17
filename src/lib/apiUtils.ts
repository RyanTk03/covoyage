import { getUser } from "@/services/user";
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Parse query parameters from a URL
 * @param {string} url
 * @return {Record<string, any>}
 */
export function getQueryParams(url) {
	const params = new URLSearchParams((new URL(url)).search);
	const result = {};

	for (const key in params.keys()) {
		const allValues = params.getAll(key);
		result[key] = allValues.length > 1 ?
		allValues.map((v) => tryParseJSON(v)) :
		tryParseJSON(allValues[0]);
	}

	return result;
}

/**
 * Try parse JSON string
 * @param {string} value
 * @return {any}
 */
function tryParseJSON(value) {
	try {
		return JSON.parse(value);
	} catch (error) {
		return value;
	}
}
