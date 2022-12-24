const {requestTypeOfLocation, startOptions, displayResultMenuOptions} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class DisplayLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.data = sessionData;
    }

    async promptType(chatId) {
        this.modes.set(chatId, Modes.SelectType);
        return await this.bot.sendMessage(chatId, `Выбери тип:`, requestTypeOfLocation);
    }

    async showPoints(chatId, user, type) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            let header = '';
            let msg = '';
            let points;
            if (type === undefined) {
                points = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                header += '<b>Все точки:</b>';
            } else {
                points = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                header += '<b>Все точки типа "' + type + '":</b>';
            }
            this.data.set(chatId, {lastDisplayed: points});
            for (let i = 0; i < points.length; ++i) {
                let line = '<pre>';
                line += `${('   ' + (i + 1)).slice(-3)} `;
                line += `[${('      ' + points[i].dataValues.first).slice(-6)}`;
                line += `${('      ' + points[i].dataValues.center).slice(-6)}`;
                line += `${('      ' + points[i].dataValues.last).slice(-6)}]`;
                if (type === undefined) {
                    line += ` ${points[i].dataValues.type}`;
                    if (points[i].dataValues.desc != '') {
                        line += ` (${points[i].dataValues.desc})`;
                    }
                } else {
                    if (points[i].dataValues.desc != '') {
                        line += ` ${points[i].dataValues.desc}`;
                    } else {
                        line += ` ${points[i].dataValues.type}`;
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