import mongoose from "mongoose";    

const Schema = mongoose.Schema;
//Define chat schema with the required fields
const ChatSchema = new Schema({
    //Array of user id's participating in the chat, refering from the user model
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    //Boolean value whether the chat is personal 1 on 1 or not.
    isPersonalChat: {
        type: Boolean, 
        default: false
    },
    //Latest message in the chat, refering from the message model
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'message'
    }
},
{
    //Automatically will track creation and update times.
    timestamps: true
})
//Creating the chat model
const ChatModel = mongoose.model('chat', ChatSchema);
export default ChatModel;