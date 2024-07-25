import * as chatService from '../services/chat-service.js';

export const accessChat = async (req, res) => {
    //Extract userId from the request body
    const {userId} = req.body;

    try{
        //Call the accessChat function from the chat service with current user's id and the user id with whom to chat with
        const result = await chatService.accessChat(req.user._id, userId);
        //Respond with the success status object and return the chat details
        res.status(200).json({
            success: true,
            result
        })
    }
    catch(err){
        res.status(400).json({
            success: false, 
            message: err.message
        })
    }
}

export const fetchChats = async (req, res) => {
    try{
        //Call the fetchChats function from the chat service with the current user's id
        const result = await chatService.fetchChats(req.user._id);
        //Respond with succes status object and the list of chats associated with the user
        res.status(200).json({
            success: true,
            result
        })
    }
    catch(err){
        res.status(400).json({
            success: true,
            message: err.message
        })
    }
}