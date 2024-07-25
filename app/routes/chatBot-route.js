import express from 'express';
import * as chatbotController from '../controllers/chatBot-controller.js';

const router = express.Router();

router.route('/chat/:username')
    .get(chatbotController.getChatHistory);

router.route('/chat/send')
    .post(chatbotController.sendMessage);

export default router;
