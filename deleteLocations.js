const {
    startOptions,
    confirmMapDeletionOptions,
    createMapOptions,
    requestDeleteLocationsOptions
} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class deleteLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.data = sessionData;
    }

    async requestDeleteLocations(chatId) {
        this.modes.set(chatId, Modes.RequestDeleteLocations);
        return await this.bot.sendMessage(chatId, 'Ок, введи номера точек которые надо удалить через пробел:', requestDeleteLocationsOptions);
    }

    async finalizeDeleteLocations(chatId, user, data) {
        try {
            let numbersToDelete = data.split(' ');
            numbersToDelete.forEach((element, index) => {
                let number = parseInt(element);
                if (isNaN(number))
                    throw('');
                numbersToDelete[index] = number;
            });
            let lastResult = this.data.get(chatId).lastDisplayed;
            for (const number of numbersToDelete) {
                let indx = lastResult[number - 1].dataValues.id;
                let res = await db.Location.findOne({where: {id: indx}});
                await res.destroy();
            }
            this.modes.set(chatId, Modes.Start);
            return await this.bot.sendMessage(chatId, 'Готово', startOptions);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере');
        }
    }

}

module.exports = deleteLocations;