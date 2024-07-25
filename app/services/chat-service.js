import Chat from '../models/chat.js'; //Importing the Chat model

//Function to access an existing personal chat or create a new one
export const accessChat = async(userIdFirst, userIdSecond) => {
    //Check if the personal chat exists between the two users
    const existingChat = await Chat.findOne({
        isPersonalChat: true,
        users: { $all: [userIdFirst, userIdSecond]},
    });
    //If an existing chat is found, populate the users field and return the chat
    if(existingChat) {
        return Chat.populate(existingChat, {
            path: "users",
            select: "-password",
        });
    }
    //If no existing chat is found, create a new personal chat between the users
    const newChat = await Chat.create({
        users: [userIdFirst, userIdSecond],
        isPersonalChat: true
    });
    //Populate the users field and return the new chat
    return Chat.populate(newChat, {
        path: "users",
        select: "-password",
    })
}

//Function to fetch all the chats associated with a user
export const fetchChats = async(userId) => {
    //Find all chats where the participant is the user, populate the fields and sort by update time
    const chats = await Chat.find({users: userId})
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({updatedAt: -1});

    //Populate the latestMessage field with user information and return the chats
    return Chat.populate(chats, {
        path: "latestMessage.sender",
        select: "userName email",
    });
}