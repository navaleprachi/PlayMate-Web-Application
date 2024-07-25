import * as arenaService from '../services/arena-service.js';
import { setResponse, setErrorResponse } from './response-handler.js'; // Importing the response handlers

// Controller to fing the sports areans
export const findArenas = async (request, response) => {
    try {
        const params = { ...request.params }; // Taking in the request parameters
        const arenas = await arenaService.searchArenas(params['sport'], params['city']); // Requesting info based on sport and city
        setResponse(arenas, response); // Setting the response
    } catch (err) {
        setErrorResponse(err, response); // If error occurs set the error details
    }
}