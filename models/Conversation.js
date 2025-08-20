import { Auth } from "../utils/auth.js";
import { User } from "./User.js";
import { Message } from "./Message.js";
import { Storage } from "../utils/localStorageHelper.js";
export class Conversation {
    constructor(reciverId) {
        this.participants = { sender: Auth.getCurrentUser().id, reciever: reciverId };
        this.messages = [];
        this.updatedAt = new Date();
        this.class="conversation";
    }

    static send(messageContent, reciverId) {
        const message = new Message(messageContent);
        const users = Storage.get("users");
        const currentUser = Auth.getCurrentUser();
        if (reciverId === currentUser.id) return { success: false, message: "can't message yourself" }
        let recieverIndex = -1;
        let chatIndexAtReciever = -1;
        users.forEach((user, i) => {
            if (user.id !== currentUser.id) {
                let userChats = user.chats;
                userChats.forEach((chat, x) => {
                    if (JSON.stringify(chat.participants) === JSON.stringify({ sender: currentUser.id, reciever: reciverId }) || JSON.stringify(chat.participants) === JSON.stringify({ sender: reciverId, reciever: currentUser.id })) {
                        recieverIndex = i;
                        chatIndexAtReciever = x;
                    }
                })
            }

        })
        if (recieverIndex !== -1) {
            users[recieverIndex].chats[chatIndexAtReciever].messages.push(message);
            User.updateInDB(users[recieverIndex]);
            currentUser.chats.forEach(chat => {
                if (JSON.stringify(chat.participants) === JSON.stringify({ sender: currentUser.id, reciever: reciverId }) || JSON.stringify(chat.participants) === JSON.stringify({ sender: reciverId, reciever: currentUser.id })) {
                    chat.messages.push(message);
                    User.updateCurrentUser(currentUser);
                }
            })
            return { success: true, message: "sent" }
        }
        else {
            const conv = new Conversation(reciverId)
            conv.messages.push(message);
            currentUser.chats.push(conv);
            User.updateCurrentUser(currentUser);
            users.forEach(user => {
                if (user.id === reciverId) {
                    user.chats.push(conv)
                    User.updateInDB(user);
                }
            })
            return { success: true, message: "sent" }
        }
    }

    static removeAllChats() {
        const users = Storage.get("users");
        users.forEach(user => {
            user.chats = [];
            if (user.id === Auth.getCurrentUser().id) {
                User.updateCurrentUser(user);
            } else {
                User.updateInDB(user)
            }
        })
    }
}