import express from 'express';
import * as chatController from '../controllers/chat-controller.js';
import authenticateUser from '../middleware/userAuth-middleware.js';


const router = express.Router();

router.route("/")
//Route for creating a 1 on 1 chat: Authenticated Route
    .post(authenticateUser, chatController.accessChat)
//Route for fetching all the chats : Authenticated Route
    .get(authenticateUser,chatController.fetchChats)

export default router;