import express from 'express';
import * as userAuthController from '../controllers/userAuth-controller.js';
import authenticateUser from '../middleware/userAuth-middleware.js';


const router = express.Router();

//Route for User Sign Up : Unauthenticated Route
router.route("/signUp")
    .post(userAuthController.registerUser);

//Route for User Log In : Unauthenticated Route
router.route("/logIn")
    .post(userAuthController.login);

//Route for fetching the new accessToken based on refereshToken : 
router.route("/refereshToken")
    .post(userAuthController.refereshAccessToken);

//Route for forgot password process : Unauthenticated Route
router.route("/forgotPassword")
    .post(userAuthController.forgotPassword);

//Route for updating the password using the reset token : Unauthenticated Route
router.route("/resetPassword")
    .post(userAuthController.resetPassword);

//Route for logging out : Authenticated Route
router.route('/logOut')
    .post(authenticateUser, userAuthController.logout);


export default router;