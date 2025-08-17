import { Auth } from "../utils/auth.js"
export class Message {
    constructor(content) {
        this.sender = Auth.getCurrentUser().id;
        this.sentAt = new Date();
        this.readAt = null;
        this.status = false; // false means sent but not read So true is sent and read
        this.content = content;
    }

    isRead() {
        return this.status
    }

    markAsRead() {
        this.status = true;
        return { success: true, message: "marked as read" }
    }
}