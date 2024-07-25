import * as baseService from './base-service';

// API endpoint path for fetching arenas
const fetchArenasPath = "/arenas";

/**
 * Fetches arenas based on the specified sport and city.
 * @param sport - The sport for which arenas are to be fetched.
 * @param city - The city in which arenas are to be fetched.
 * @returns Promise containing the fetched arenas.
 */
export const fetchArenas = async (sport: string, city: string): Promise<any> => {
    // Construct the URL for fetching arenas based on sport and city
    const requestURL = `${fetchArenasPath}/${sport}/${city}`;

    // Use the base service to make a GET request to fetch arenas
    const arenas = await baseService.get<any>(requestURL);

    // Return the fetched arenas
    return arenas;
}