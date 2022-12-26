const {startOptions, requestDeleteLocationsOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {getChatId, getInputData} = require("./helpers");

class deleteLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.sessionData = sessionData;
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
            this.modes.set(chatId, Modes.Start);
            userData.originReq = await this.bot.sendMessage(chatId, 'Готово', startOptions);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

}

module.exports = deleteLocations;