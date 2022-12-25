const {startOptions, requestDestinationTypeOfLocation} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');

class GoToLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.sessionData = sessionData;
    }

    async promptType(chatId) {
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations.push(number);
            userData.entering = '';
            if (userData.locations.length != 3) throw('');
            this.modes.set(chatId, Modes.SelectDestinationType);
            return await this.bot.sendMessage(chatId, `Выбери куда:`, requestDestinationTypeOfLocation);
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    getDistance(x, y) {
        let compX = (y.first - x[0]) * (y.first - x[0]);
        let compY = (y.center - x[1]) * (y.center - x[1]);
        let compZ = (y.last - x[2]) * (y.last - x[2]);
        return Math.sqrt(compX + compY + compZ);
    }

    async calculate(chatId, user, type) {
        try {
            const mapId = await db.Map.findOne({where: {userId: user}});
            let header = '';
            let msg = '';
            let locations;
            if (type === 'any') {
                locations = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                header += '<b>Ближайшая точка:</b>';
            } else {
                locations = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                header += '<b>Ближайшая точка типа "' + type + '":</b>';
            }

            const userData = this.sessionData.get(chatId);
            let currMinDistance = Number.MAX_VALUE;
            let candidate;
            for (let i = 0; i < locations.length; ++i) {
                let distance = Math.abs(this.getDistance(userData.locations, locations[i].dataValues))
                if (distance < currMinDistance) {
                    currMinDistance = distance;
                    candidate = locations[i].dataValues;
                }
            }
            if (candidate === undefined) {
                msg = '<b>Нету</b>'
            } else {
                msg += `[${('      ' + candidate.first).slice(-6)}`;
                msg += `${('      ' + candidate.center).slice(-6)}`;
                msg += `${('      ' + candidate.last).slice(-6)}]`;
                if (candidate.desc != "") {
                    msg += ` - ${candidate.desc}`;
                } else {
                    msg += ` - ${candidate.type}`;
                }
                msg += '\n';
                msg += `Расстояние: ${Math.floor(currMinDistance)}`
            }
            this.modes.set(chatId, Modes.Start);
            msg = header + '\n' + msg;
            return await this.bot.sendMessage(chatId, msg, {parse_mode: 'html', ...startOptions});
        } catch (e) {
            return await this.bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
        }
    }

}

module.exports = GoToLocations;