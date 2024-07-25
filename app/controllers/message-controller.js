import * as  messageService from '../services/message-service.js';


export const allMessages = async (req, res) => {
    try{
        //Call the fetchAllMessages method in the service with the provided chat Id
        const result = await messageService.fetchAllMessages(req.params.chatId);
        //Respond with a success status object and fetch the messages
        res.status(200).json({
            success: true, 
            result
        })
    }
    catch(err){
        res.status(400).json({
            succes: false,
            message: err.message
        })
    }
}

export const sendMessage = async( req, res) => {
    //Extract content and chatId from the request body
    const {content, chatId} = req.body;

    try{
        //Call the sendMessage method from the service with content, chatId and the senderId
        const result = await messageService.sendMessage(content, chatId, req.user._id);
        //Respond with a success status
        res.status(200).json({
            success: true, 
            result
        })
    }
    catch(err){
        res.status(400).json({
            succes: false,
            message: err.message
        })
    }
}