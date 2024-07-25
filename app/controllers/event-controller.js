import { request, response } from 'express';
import * as eventService from '../services/event-service.js';
import { setResponse, setErrorResponse } from './response-handler.js';

// Controller to save new events
export const saveNewEvent = async (request, response) => {
    try {
        const newEvent = { ...request.body }; // Taking in the request body
        const event = await eventService.saveEvent(newEvent); // Saving the request body received
        setResponse(event, response); // Setting the response
    } catch (err) {

        setErrorResponse(err, response); // If error occurs set the error details

    }
}

// Controller to update existing events
export const updateEvent = async (request, response) => {
    try {
        const updatedEvent = { ...request.body }; // Taking in the request body
        const event = await eventService.updateEvent(request.params.id, updatedEvent); // Update the existing event with the updated details received
        setResponse(event, response); // Setting the response
    } catch (err) {
        setErrorResponse(err, response); // If error occurs set the error details
    }
}

export const fetchAllEvents = async (request, response) => {
    try {
        const params = { ...request.params };
        console.log("params", params);
        const fetch = await eventService.getAllEvents(params['sport'], params['city']);
        setResponse(fetch, response); // Setting the response
    } catch (err) {

        setErrorResponse(err, response); // If error occurs set the error details
    }

}

export const fetchUserEvents = async (request, response) => {
    try {
        const params = { ...request.params };
        console.log("params", params);
        const fetch = await eventService.getUserEvents(params['userId']);
        setResponse(fetch, response); // Setting the response
    } catch (err) {

        setErrorResponse(err, response); // If error occurs set the error details
    }

}

// Controller to update existing events
export const updateMultipleEvents = async (request, response) => {
    try {
        const updatedEvent = { ...request.body }; // Taking in the request body
        const events = await eventService.updateMultipleEvents(request.params.id, updatedEvent); // Update the existing event with the updated details received
        setResponse(events, response); // Setting the response
    } catch (err) {
        setErrorResponse(err, response); // If error occurs set the error details
    }
}

export const deleteEvent = async (request, response) => {
    try {
        // Extracting the event ID from the request parameters
        const eventId = request.params["id"];

        // Calling a function to delete the event by ID
        await eventService.deleteEvent(eventId);

        // Sending a success response
        setResponse({}, response);
    } catch (error) {
        // Handling errors and sending an error response
        setErrorResponse(error, response);
    }
}
