import express from "express";
import * as profileController from '../controllers/personalizedProfile-controller.js';

// Create an instance of the Express Router
const router = express.Router();

// Define a route for creating a new profile using POST request
router.route('/profile/:id').post(profileController.createProfile)

router.route('/myProfile/:dynamicId')
    .get(profileController.getProfileByDynamicId)  // GET request to retrieve the profile
    .put(profileController.updateProfileByDynamicId)    // PUT request to update the profile
    .delete(profileController.deleteProfileByDynamicId);    // DELETE request to delete the profile

// Define a route for fetching all profiles using a GET request
router.route('/profile')
    .get(profileController.findProfiles)
    

export default router;
