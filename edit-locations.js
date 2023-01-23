const {
    startOptions,
    requestDeleteLocationsOptions,
    requestEditLocationDescriptionOptions,
    requestEditLocationTypeOptions,
    requestTypeOfLocationOptions,
    emptyOptions
} = require('./tg-reply-options');
const db = require('./db-models');
const Modes = require('./session-modes');
const {getChatId, getInputData} = require("./helpers");
const STRINGS = require('./string-literals');

class EditLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.sessionModes = sessionModes;
        this.sessionData = sessionData;
    }


    async requestEditLocationDesc(msg) {
        let chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.SELECT_POINT_DESC(), requestEditLocationDescriptionOptions());
            this.sessionModes.set(chatId, Modes.RequestEditLocationDescription);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

    async requestEditLocationType(msg) {
        let chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.SELECT_POINT_TYPE(), requestEditLocationTypeOptions());
            this.sessionModes.set(chatId, Modes.RequestEditLocationType);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
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
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.PROMPT_NEW_DESC(), emptyOptions());
            this.sessionModes.set(chatId, Modes.EditDescription);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
        }

    }

    async promptNewType(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.indxToEdit = number;
            userData.entering = '';
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.PROMPT_NEW_TYPE(), requestTypeOfLocationOptions());
            this.sessionModes.set(chatId, Modes.EditType);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
        }

    }

    async finalizeEditLocationDesc(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            let desc = getInputData(msg);
            if (desc !== 'empty') {
                desc = desc.trim();
                desc = desc.charAt(0).toUpperCase() + desc.slice(1);
            } else {
                desc = '';
            }
            const lastResult = this.sessionData.get(chatId).lastDisplayed;
            const indx = lastResult[userData.indxToEdit - 1].dataValues.id;
            let res = await db.Location.findOne({where: {id: indx}});
            res.desc = desc;
            await res.save();
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.DONE(), startOptions());
            delete userData.indxToEdit;
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT(), emptyOptions());
        }
    }

    async finalizeEditLocationType(msg) {
        const chatId = getChatId(msg);
        const userData = this.sessionData.get(chatId);
        try {
            let type = getInputData(msg);
            if (type !== 'empty') {
                type = type.trim();
                type = type.charAt(0).toUpperCase() + type.slice(1);
            } else {
                throw('');
            }
            const lastResult = this.sessionData.get(chatId).lastDisplayed;
            const indx = lastResult[userData.indxToEdit - 1].dataValues.id;
            let res = await db.Location.findOne({where: {id: indx}});
            res.type = type;
            await res.save();
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.DONE(), startOptions());
            delete userData.indxToEdit;
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT(), emptyOptions());
        }
    }

    async requestDeleteLocations(msg) {
        let chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.SELECT_POINTS_DELETE(), requestDeleteLocationsOptions());
            this.sessionModes.set(chatId, Modes.RequestDeleteLocations);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
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
                if (isNaN(number)) throw('');
                numbersToDelete[index] = number;
            });
            const lastResult = this.sessionData.get(chatId).lastDisplayed;
            for (const number of numbersToDelete) {
                const indx = lastResult[number - 1].dataValues.id;
                let res = await db.Location.findOne({where: {id: indx}});
                await res.destroy();
            }
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.DONE(), startOptions());
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

}

module.exports = EditLocations;