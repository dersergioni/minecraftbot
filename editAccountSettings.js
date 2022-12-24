const {startOptions, confirmMapDeletionOptions, createMapOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class EditAccountSettings {

    constructor(bot, sessionModes) {
        this.bot = bot;
        this.modes = sessionModes;
    }

    async createMap(chatId, user) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (mapId) throw('');
            const currMaxMapId = await db.Map.max('mapId');
            await db.Map.create({userId: user, mapId: currMaxMapId + 1});
            return await this.bot.sendMessage(chatId, `Готово`, startOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

    async requestDeleteMap(chatId, user) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) throw('');
            this.modes.set(chatId, Modes.RequestDeleteMap);
            return await this.bot.sendMessage(chatId, 'Вы уверены?', confirmMapDeletionOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }

    }

    async finalizeDeleteMap(chatId, user) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) throw('');
            await db.Location.destroy({where: {mapId: mapId.dataValues.mapId}});
            await db.Map.destroy({where: {id: mapId.dataValues.mapId}});
            this.modes.set(chatId, Modes.Start);
            return await this.bot.sendMessage(chatId, 'Готово', createMapOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

}

module.exports = EditAccountSettings;