const {requestTypeOfLocationOptions, startOptions, displayResultMenuOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {getChatId, getDbUser, getInputData} = require("./helpers");


class DisplayLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.sessionModes = sessionModes;
        this.sessionData = sessionData;
    }

    async promptType(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            userData.originReq = await this.bot.sendMessage(chatId, `Выбери тип:`, requestTypeOfLocationOptions);
            this.sessionModes.set(chatId, Modes.SelectType);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
        }
    }

    async showLocations(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const mode = this.sessionModes.get(chatId);
            const userData = this.sessionData.get(chatId);
            let type;
            if (mode === Modes.SelectType) type = getInputData(msg);

            const mapId = await db.Map.findOne({where: {userId: user}});
            let replyHeader = '';
            let replyBody = '';
            let locations;
            if (type === undefined) {
                locations = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                replyHeader += '<b>Все точки:</b>';
            } else {
                locations = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                replyHeader += '<b>Все точки типа "' + type + '":</b>';
            }
            this.sessionData.set(chatId, {lastDisplayed: locations});
            for (let i = 0; i < locations.length; ++i) {
                let line = '<pre>';
                line += `${('   ' + (i + 1)).slice(-3)} `;
                line += `[${('      ' + locations[i].dataValues.first).slice(-6)}`;
                line += `${('      ' + locations[i].dataValues.center).slice(-6)}`;
                line += `${('      ' + locations[i].dataValues.last).slice(-6)}]`;
                if (type === undefined) {
                    line += ` ${locations[i].dataValues.type}`;
                    if (locations[i].dataValues.desc !== '') {
                        line += ` (${locations[i].dataValues.desc})`;
                    }
                } else {
                    if (locations[i].dataValues.desc !== '') {
                        line += ` ${locations[i].dataValues.desc}`;
                    } else {
                        line += ` ${locations[i].dataValues.type}`;
                    }
                }
                line += '</pre>';
                line += '\n';
                replyBody += line;
            }
            if (replyBody.length === 0) {
                replyBody = '<b>Нету</b>'
            }
            replyBody = replyHeader + '\n' + replyBody;
            userData.originReq = await this.bot.sendMessage(chatId, replyBody, {parse_mode: 'html', ...displayResultMenuOptions});
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
        }
    }

}

module.exports = DisplayLocations;