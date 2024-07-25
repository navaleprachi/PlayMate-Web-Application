import PersonalizedProfile from '../models/personalizedProfile.js';

// Function to search for profiles based on specified parameters
export const searchProfiles = async (params = {}) => {

    // Use the PersonalizedProfile model to find profiles matching the specified parameters
    const profiles = await PersonalizedProfile.find(params).exec();
    return profiles;
}

// Function to create a new profile
export const createProfile = async (newProfile, id) => {

     // Create a new instance of the PersonalizedProfile model with the provided data
    const profile = new PersonalizedProfile({ id, ...newProfile });

    // Save the new profile to the database
    return await profile.save();
}

// Function to retrieve a profile by its dynamicId
export const getProfileByDynamicId = async (dynamicId) => {

    // Use the PersonalizedProfile model to find a profile by its dynamicId
    const profile = await PersonalizedProfile.findOne({ dynamic_Id: dynamicId }).exec();
    return profile;
}

// Function to update a profile by its dynamicId
export const updateProfileByDynamicId = async (updatedProfile, dynamicId) => {

    // Use the PersonalizedProfile model to update a profile by its dynamicId
    const profile = await PersonalizedProfile.findOneAndUpdate({dynamic_Id: dynamicId} , updatedProfile, { new: true }).exec();
    return profile;
}


// Function to delete a profile by its dynamicId
export const deleteProfileByDynamicId = async (dynamicId) => {

    // Use the PersonalizedProfile model to delete a profile by its dynamicId
    return await PersonalizedProfile.findOneAndDelete(dynamicId).exec();
}