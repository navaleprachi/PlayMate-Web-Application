//Importing the message, chat and user models
import Message from '../models/message.js';
import Chat from '../models/chat.js';
import User from '../models/user.js';

//Function to fetch all messages for a given chat
export const fetchAllMessages = async(chatId) =>{
    //Find all messages for that particular chatid, populate the sender and chat fields.
    return Message.find({chat: chatId})
        .populate("sender", "userName email")
        .populate("chat").exec();
}

//Function to send a new message to a chat
export const sendMessage = async(content, chatId, senderId) => {
    //Create a new message with the provided content, senderId, and the chatId
    const newMessage = await Message.create({
        sender: senderId,
        content: content,
        chat: chatId,
    });
    //Save the new message to the database
    await newMessage.save();
    //Find the sender user by id and select only the userName and email fields
    const sender = await User.findById(senderId).select("userName email");
    //Find the chat by id and populate the users field with userName and email
    const chat = await Chat.findById(chatId).populate("users", "userName email");
    //Update the sender and chat fields of the new message
    newMessage.sender = sender;
    newMessage.chat = chat;
    //Update the latestMessage field of the chat with the new message
    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: newMessage
    });
    //return the new message
    return newMessage;
}