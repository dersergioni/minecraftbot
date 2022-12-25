const {requestTypeOfLocationOptions, startOptions, displayResultMenuOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class DisplayLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.sessionData = sessionData;
    }

    async promptType(chatId) {
        this.modes.set(chatId, Modes.SelectType);
        return await this.bot.sendMessage(chatId, `Выбери тип:`, requestTypeOfLocationOptions);
    }

    async showLocations(chatId, user, type) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            let header = '';
            let msg = '';
            let locations;
            if (type === undefined) {
                locations = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                header += '<b>Все точки:</b>';
            } else {
                locations = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                header += '<b>Все точки типа "' + type + '":</b>';
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
                    if (locations[i].dataValues.desc != '') {
                        line += ` (${locations[i].dataValues.desc})`;
                    }
                } else {
                    if (locations[i].dataValues.desc != '') {
                        line += ` ${locations[i].dataValues.desc}`;
                    } else {
                        line += ` ${locations[i].dataValues.type}`;
                    }
                }
                line += '</pre>';
                line += '\n';
                msg += line;
            }
            if (msg.length === 0) {
                msg = '<b>Нету</b>'
            }
            this.modes.set(chatId, Modes.Start);
            msg = header + '\n' + msg;
            return await this.bot.sendMessage(chatId, msg, {parse_mode: 'html', ...displayResultMenuOptions});
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
        }
    }

}

module.exports = DisplayLocations;