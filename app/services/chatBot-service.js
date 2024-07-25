import ChatbotChatModel from '../models/chatBot.js';

export const getChatHistory = async (username) => {
    return await ChatbotChatModel.findOne({ username }).exec();
};

export const sendMessage = async ({ username, sender, content }) => {
    await ChatbotChatModel.findOneAndUpdate(
        { username },
        {
            $push: {
                messages: { sender, content }
            }
        },
        { upsert: true, new: true }
    ).exec();

    return { message: 'Message sent successfully' };
};
