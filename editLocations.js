const {
    startOptions,
    requestDeleteLocationsOptions,
    requestEditLocationDescriptionOptions,
    emptyOptions
} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {getChatId, getInputData, getDbUser} = require("./helpers");

class EditLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.sessionData = sessionData;
    }


    async requestEditLocationDesc(msg) {
        let chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.originReq = await this.bot.sendMessage(chatId, 'Ок, введи номер точки описание которой надо изменить:', requestEditLocationDescriptionOptions);
            this.modes.set(chatId, Modes.RequestEditLocationDescription);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

    async promptNewDesc(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.indxToEdit = number;
            userData.entering = '';
            userData.originReq = await this.bot.sendMessage(chatId, 'Ок, введи новое описание:', emptyOptions);
            this.modes.set(chatId, Modes.EditDescription);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }

    }


    async finalizeEditLocationDesc(msg) {
        const chatId = getChatId(msg);
        try {
            // const user = getDbUser(msg);
            const userData = this.sessionData.get(chatId);
            let desc = getInputData(msg);
            if (desc !== 'empty') {
                desc = desc.trim();
                userData.desc = desc.charAt(0).toUpperCase() + desc.slice(1);
            }
            const lastResult = this.sessionData.get(chatId).lastDisplayed;
            const indx = lastResult[userData.indxToEdit - 1].dataValues.id;
            let res = await db.Location.findOne({where: {id: indx}});
            res.desc = desc;
            await res.save();
            userData.originReq = await this.bot.sendMessage(chatId, `Готово`, startOptions);
            this.modes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз', emptyOptions);
        }
    }

    async requestDeleteLocations(msg) {
        let chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.originReq = await this.bot.sendMessage(chatId, 'Ок, введи номера точек которые надо удалить через пробел:', requestDeleteLocationsOptions);
            this.modes.set(chatId, Modes.RequestDeleteLocations);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    async finalizeDeleteLocations(msg) {
        let chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            let data = getInputData(msg);
            let numbersToDelete = data.split(' ');
            numbersToDelete.forEach((element, index) => {
                const number = parseInt(element);
                if (isNaN(number))
                    throw('');
                numbersToDelete[index] = number;
            });
            const lastResult = this.sessionData.get(chatId).lastDisplayed;
            for (const number of numbersToDelete) {
                const indx = lastResult[number - 1].dataValues.id;
                let res = await db.Location.findOne({where: {id: indx}});
                await res.destroy();
            }
            userData.originReq = await this.bot.sendMessage(chatId, 'Готово', startOptions);
            this.modes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

}

module.exports = EditLocations;