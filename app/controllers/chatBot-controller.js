import { request, response } from 'express';
import * as chatBotService from '../services/chatBot-service.js';
import { setErrorResponse, setResponse } from './response-handler.js';

export const getChatHistory = async (req, res) => {
    try {
        const username = req.params.username;
        const chatHistory = await chatBotService.findOne({ username });
        setResponse(chatHistory, res);
    } catch (error) {
        setErrorResponse(error, res);
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { username, sender, content } = {...req.body};

        // Update or create a chat history entry
        await chatBotService.findOneAndUpdate(
            { username },
            {
                $push: {
                    messages: { sender, content }
                }
            },
            { upsert: true, new: true }
        );

        setResponse({ message: 'Message sent successfully' }, res);
    } catch (error) {
        setErrorResponse(error, res);
    }
};
