import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatbotChatSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    messages: [
        {
            sender: {
                type: String,
                enum: ['user', 'bot'],
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
},
{
    versionKey: false
});

const ChatbotChatModel = mongoose.model('chatbotChat', ChatbotChatSchema);
export default ChatbotChatModel;
