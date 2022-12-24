const {requestTypeOfLocation, startOptions, emptyOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class AddLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.datas = sessionData;
    }

    async promptPointStage(chatId, user) {
        this.modes.set(chatId, Modes.AddCoordinates);
        const mapId = await db.Map.findOne({where: {userId: user}});
        this.datas.set(chatId, {mapId: mapId.dataValues.mapId});
        return await this.bot.sendMessage(chatId, 'Ок, введи координаты как на экране через пробел:');
    }

    async promptTypeStage(chatId, text) {
        try {
            let points = text.split(' ');
            points.forEach((element, index) => {
                let number = parseInt(element);
                if (isNaN(number))
                    throw('');
                points[index] = number;
            });
            if (points.length != 3) throw('');
            const userData = this.datas.get(chatId);
            userData.first = points[0];
            userData.center = points[1];
            userData.last = points[2];
            this.modes.set(chatId, Modes.AddType);
            return await this.bot.sendMessage(chatId, `Отлично, координаты ${points}, теперь тип точки:`, requestTypeOfLocation);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async promptDescStage(chatId, text) {
        try {
            this.modes.set(chatId, Modes.AddDescription);
            const userData = this.datas.get(chatId);
            userData.type = text;
            return await this.bot.sendMessage(chatId, `Отлично, это ${text}. И последнее, теперь описание (можно оставить пустым):`, emptyOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async finalizeStage(chatId, user, text) {
        try {
            const userData = this.datas.get(chatId);
            if (text != 'empty') {
                text = text.trim();
                userData.desc = text.charAt(0).toUpperCase() + text.slice(1);
            }
            userData.author = user;

            await db.Location.create(userData);
            this.modes.set(chatId, Modes.Start);
            // userData = {};
            return await this.bot.sendMessage(chatId, `Готово`, startOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз', emptyOptions);
        }
    }

}

module.exports = AddLocations;