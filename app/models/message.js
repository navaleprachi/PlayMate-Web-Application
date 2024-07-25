import mongoose from "mongoose";

const Schema = mongoose.Schema;
//Define message schema with the required fields
const MessageSchema = new Schema({
    //Sender of the message, refering from the user model
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    //Content/body of the message, a string with trimming
    content: {
        type: String,
        trim: true
    },
    //Chat associated with the particular messages, refring from the chat model
    chat: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'chat'
    }
},
{
    //Automatically will track creation and update times
    timestamps: true
})
//Creating the message model
const MessageModel = mongoose.model('message', MessageSchema);
export default MessageModel;

