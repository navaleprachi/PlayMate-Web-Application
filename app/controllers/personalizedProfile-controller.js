import { request, response } from 'express';
import * as profileService from '../services/personailzedProfile-service.js';
import { setErrorResponse, setResponse } from './response-handler.js';

//search the created user profiles
export const findProfiles = async (request, response) => {
    try {
        const params = { ...request.query };
        const profiles = await profileService.searchProfiles(params);
        setResponse(profiles, response);
    } catch (error) {
        setErrorResponse(error, response);
    }
}

export const createProfile = async (request, response) => {
    try {
        // Extract the id from the request parameters
        const id = request.params.id;
        
        // Clone the request body to ensure immutability
        const newProfile = { ...request.body };

        // Call the createProfile function from profileService to create a new profile
        const profile = await profileService.createProfile(newProfile, id);

        // Set the response based on the profile creation result
        setResponse(profile, response);
    } catch (error) {
        // Handle any errors that occur during profile creation and set the error response
        setErrorResponse(error, response);
    }
}


// Retrieve a user profile based on the provided dynamicId
export const getProfileByDynamicId = async (request, response) => {
    try {
        const dynamicId = request.params.dynamicId;
        const profile = await profileService.getProfileByDynamicId(dynamicId);
        setResponse(profile, response);
    } catch (error) {
        setErrorResponse(error, response);
    }
}

// Update a user profile based on the provided dynamicId and updated profile data
export const updateProfileByDynamicId = async (request, response) => {
    try {
        const dynamicId = request.params.dynamicId;
        const updatedProfile = { ...request.body };
        const profile = await profileService.updateProfileByDynamicId(updatedProfile, dynamicId);
        setResponse(profile, response);
    } catch (error) {
        setErrorResponse(error, response);
    }
}

// Delete a user profile based on the provided dynamicId
export const deleteProfileByDynamicId = async (request, response) => {
    try {
        const dynamicId = request.params.dynamicId;
        await profileService.deleteProfileByDynamicId(dynamicId);
        setResponse({}, response);
    } catch (error) {
        setErrorResponse(error, response);
    }
}
