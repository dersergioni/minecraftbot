module.exports = {
    getChatId(msg) {
        let chatId;
        if (msg.message_id !== undefined) {
            //Get chatId from message
            chatId = msg.chat.id;
        } else {
            //Get chatId from reply callback
            chatId = msg.message.chat.id;
        }
        return chatId;
    },

    getDbUser(msg) {
        let user;
        if (msg.message_id !== undefined) {
            //Get username from message
            if (msg.chat.username !== undefined) {
                user = msg.chat.username;
            } else {
                user = msg.chat.id;
            }
        } else {
            //Get username from reply callback
            if (msg.message.chat.username !== undefined) {
                user = msg.message.chat.username;
            } else {
                user = msg.message.chat.id;
            }
        }
        return user;
    },

    getInputData(msg) {
        let data;
        if (msg.message_id !== undefined) {
            //Get chatId from message
            data = msg.text;
        } else {
            //Get chatId from reply callback
            data = msg.data;
        }
        return data;
    },
};
