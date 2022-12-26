const {startOptions, confirmMapDeletionOptions, createMapOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {getChatId, getDbUser} = require("./helpers");

class EditAccountSettings {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.sessionModes = sessionModes;
        this.sessionData = sessionData;
    }

    async createMap(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (mapId) throw('');
            let currMaxMapId = await db.Map.max('mapId');
            if (isNaN(currMaxMapId)) currMaxMapId = 0;
            await db.Map.create({userId: user, mapId: currMaxMapId + 1});
            userData.originReq = await this.bot.sendMessage(chatId, 'Готово', startOptions);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

    async requestDeleteMap(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) throw('');
            this.sessionModes.set(chatId, Modes.RequestDeleteMap);
            userData.originReq = await this.bot.sendMessage(chatId, 'Вы уверены?', confirmMapDeletionOptions);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }

    }

    async finalizeDeleteMap(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) throw('');
            await db.Location.destroy({where: {mapId: mapId.dataValues.mapId}});
            await db.Map.destroy({where: {mapId: mapId.dataValues.mapId}});
            this.sessionModes.set(chatId, Modes.Start);
            userData.originReq = await this.bot.sendMessage(chatId, 'Готово', createMapOptions);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

}

module.exports = EditAccountSettings;