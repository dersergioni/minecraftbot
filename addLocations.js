const {
    requestCoordinatesOptions, requestTypeOfLocationOptions, startOptions, emptyOptions, createMapOptions
} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {getChatId, getDbUser, getInputData} = require("./helpers");

class AddLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.sessionModes = sessionModes;
        this.sessionData = sessionData;
    }

    async promptCoordinateOne(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) {
                return await this.bot.sendMessage(chatId, 'Сначала необходимо создать карту', createMapOptions);
            }
            let sentMsg = await this.bot.sendMessage(chatId, 'Первая координата:');
            const sentReq = await this.bot.sendMessage(chatId, 'Ок, введи первую координату:', requestCoordinatesOptions);
            userData.entering = '';
            userData.mapId = mapId.dataValues.mapId;
            userData.demoMsg = sentMsg;
            userData.originReq = sentReq;
            userData.initialCommand = getInputData(msg);

            this.sessionModes.set(chatId, Modes.EnterCoordinateOne);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

    async promptCoordinateTwo(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations = [number];
            userData.entering = '';
            await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            let sentMsg = await this.bot.sendMessage(chatId, 'Вторая координата:');
            userData.originReq = await this.bot.sendMessage(chatId, 'Ок, введи вторую координату:', requestCoordinatesOptions);
            userData.demoMsg = sentMsg;
            this.sessionModes.set(chatId, Modes.EnterCoordinateTwo);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }

    }

    async promptCoordinateThree(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations.push(number);
            userData.entering = '';
            await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            let sentMsg = await this.bot.sendMessage(chatId, 'Третья координата:');
            userData.originReq = await this.bot.sendMessage(chatId, 'Ок, введи третью координату:', requestCoordinatesOptions);
            userData.demoMsg = sentMsg;
            this.sessionModes.set(chatId, Modes.EnterCoordinateThree);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async promptType(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations.push(number);
            userData.entering = '';
            if (userData.locations.length !== 3) throw('');
            await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            userData.originReq = await this.bot.sendMessage(chatId, `Отлично, координаты [${userData.locations[0]} ${userData.locations[1]} ${userData.locations[2]}], теперь тип точки:`, requestTypeOfLocationOptions);
            this.sessionModes.set(chatId, Modes.AddType);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async promptDesc(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.type = getInputData(msg);
            // await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            userData.originReq = await this.bot.sendMessage(chatId, `Отлично, это ${userData.type}. И последнее, теперь описание (можно оставить пустым):`, emptyOptions);
            this.sessionModes.set(chatId, Modes.AddDescription);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async finalize(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            let desc = getInputData(msg);
            if (desc !== 'empty') {
                desc = desc.trim();
                userData.desc = desc.charAt(0).toUpperCase() + desc.slice(1);
            }
            userData.author = user;
            userData.first = userData.locations[0];
            userData.center = userData.locations[1];
            userData.last = userData.locations[2];
            // await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            await db.Location.create(userData);
            userData.originReq = await this.bot.sendMessage(chatId, `Готово`, startOptions);
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз', emptyOptions);
        }
    }

}

module.exports = AddLocations;