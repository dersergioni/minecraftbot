const {startOptions, confirmMapDeletionOptions, createMapOptions} = require('./tg-reply-options');
const db = require('./db-models');
const Modes = require('./session-modes');
const {getChatId, getDbUser} = require("./helpers");
const STRINGS = require('./string-literals');

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
            if (mapId) {
                return userData.originReq = await this.bot.sendMessage(chatId, STRINGS.MAP_EXISTS(), startOptions());
            }
            let currMaxMapId = await db.Map.max('mapId');
            if (isNaN(currMaxMapId)) currMaxMapId = 0;
            await db.Map.create({userId: user, mapId: currMaxMapId + 1});
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.DONE(), startOptions());
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

    async requestDeleteMap(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) {
                return userData.originReq = await this.bot.sendMessage(chatId, STRINGS.CANT_DELETE(), createMapOptions());
            }
            this.sessionModes.set(chatId, Modes.RequestDeleteMap);
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.CONFIRMATION(), confirmMapDeletionOptions());
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }

    }

    async finalizeDeleteMap(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) {
                return userData.originReq = await this.bot.sendMessage(chatId, STRINGS.CANT_DELETE(), createMapOptions());
            }
            await db.Location.destroy({where: {mapId: mapId.dataValues.mapId}});
            await db.Map.destroy({where: {mapId: mapId.dataValues.mapId}});
            this.sessionModes.set(chatId, Modes.Start);
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.DONE(), createMapOptions());
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

}

module.exports = EditAccountSettings;