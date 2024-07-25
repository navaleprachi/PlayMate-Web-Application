import express from 'express';
import * as messageController from '../controllers/message-controller.js';
import authenticateUser from '../middleware/userAuth-middleware.js';


const router = express.Router();
//Route for fetching all the messages for a chat : Authenticated Route
router.route("/:chatId").get(authenticateUser, messageController.allMessages);
//Route for posting a message in a chat : Authenticated Route
router.route("/").post(authenticateUser, messageController.sendMessage);

export default router;