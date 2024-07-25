import * as baseService from './base-service';

// API endpoint paths
const eventPath = "/events";
const multipleEventPath = "/events/multiple";

// Function to create a new event
export const createEvent = async (eventData: any): Promise<any> => {
    // Use the base service to make a POST request to create an event
    const event = await baseService.post<any>(eventPath, eventData);
    return event;
}

// Function to update a single event
export const updateEvent = async (eventData: any, eventId: any): Promise<any> => {
    // Construct the URL for the specific event to be updated
    const requestURL = `${eventPath}/${eventId}`;
    // Use the base service to make an update request
    const event = await baseService.update<any>(requestURL, eventData);
    return event;
}

// Function to update multiple events
export const updateMultipleEvents = async (eventData: any, eventId: any): Promise<any> => {
    // Construct the URL for updating multiple events
    const requestURL = `${multipleEventPath}/${eventId}`;
    // Use the base service to make an update request
    const event = await baseService.update<any>(requestURL, eventData);
    return event;
}

// Function to delete an event
export const deleteEvent = async (eventId: any): Promise<any> => {
    // Construct the URL for the specific event to be deleted
    const requestURL = `${eventPath}/${eventId}`;
    // Use the base service to make a delete request
    const blog = await baseService.deleteRequest<any>(requestURL);
    return blog;
}