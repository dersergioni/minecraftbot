const {
    requestCoordinatesOptions, requestTypeOfLocationOptions, startOptions, emptyOptions
} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class AddLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.sessionData = sessionData;
    }

    async promptCoordinateOne(chatId, user, data) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            this.modes.set(chatId, Modes.EnterCoordinateOne);
            let sentMsg = await this.bot.sendMessage(chatId, 'Первая координата:');
            this.sessionData.set(chatId, {
                entering: '', mapId: mapId.dataValues.mapId, demoMsg: sentMsg, initialCommand: data
            });
            await this.bot.sendMessage(chatId, 'Ок, введи первую координату:', requestCoordinatesOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

    async promptCoordinateTwo(chatId) {
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations = [number];
            userData.entering = '';
            this.modes.set(chatId, Modes.EnterCoordinateTwo);
            let sentMsg = await this.bot.sendMessage(chatId, 'Вторая координата:');
            userData.demoMsg = sentMsg;
            await this.bot.sendMessage(chatId, 'Ок, введи вторую координату:', requestCoordinatesOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }

    }

    async promptCoordinateThree(chatId) {
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations.push(number);
            userData.entering = '';
            this.modes.set(chatId, Modes.EnterCoordinateThree);
            let sentMsg = await this.bot.sendMessage(chatId, 'Третья координата:');
            userData.demoMsg = sentMsg;
            await this.bot.sendMessage(chatId, 'Ок, введи третью координату:', requestCoordinatesOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async promptTypeStage(chatId) {
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations.push(number);
            userData.entering = '';
            if (userData.locations.length != 3) throw('');
            this.modes.set(chatId, Modes.AddType);
            return await this.bot.sendMessage(chatId, `Отлично, координаты [${userData.locations[0]} ${userData.locations[1]} ${userData.locations[2]}], теперь тип точки:`, requestTypeOfLocationOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async promptDesc(chatId, data) {
        try {
            this.modes.set(chatId, Modes.AddDescription);
            const userData = this.sessionData.get(chatId);
            userData.type = data;
            return await this.bot.sendMessage(chatId, `Отлично, это ${data}. И последнее, теперь описание (можно оставить пустым):`, emptyOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async finalize(chatId, user, data) {
        try {
            const userData = this.sessionData.get(chatId);
            if (data != 'empty') {
                data = data.trim();
                userData.desc = data.charAt(0).toUpperCase() + data.slice(1);
            }
            userData.author = user;
            userData.first = userData.locations[0];
            userData.center = userData.locations[1];
            userData.last = userData.locations[2];
            await db.Location.create(userData);
            this.modes.set(chatId, Modes.Start);
            return await this.bot.sendMessage(chatId, `Готово`, startOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз', emptyOptions);
        }
    }

}

module.exports = AddLocations;