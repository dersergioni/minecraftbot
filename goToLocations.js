const {
    requestTypeOfLocation,
    startOptions,
    displayResultMenuOptions,
    EnterCurrentLocationOptions, requestDestinationTypeOfLocation
} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {Map} = require("./dbModels");

class GoToLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.modes = sessionModes;
        this.data = sessionData;
    }

    async promptCurrentPoint(chatId) {
        this.modes.set(chatId, Modes.EnterCurrentPoint);
        return await this.bot.sendMessage(chatId, `Введи свои текущие координаты через пробел:`, EnterCurrentLocationOptions);
    }

    async promptType(chatId, user, data) {
        try {
            let points = data.split(' ');
            points.forEach((element, index) => {
                let number = parseInt(element);
                if (isNaN(number))
                    throw('');
                points[index] = number;
            });
            this.data.set(chatId, points);
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
            let points;
            if (type === 'any') {
                points = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                header += '<b>Ближайшая точка:</b>';
            } else {
                points = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                header += '<b>Ближайшая точка типа "' + type + '":</b>';
            }

            const currPosition = this.data.get(chatId);
            let currMinDistance = Number.MAX_VALUE;
            let candidate;
            for (let i = 0; i < points.length; ++i) {
                let distance = Math.abs(this.getDistance(currPosition, points[i].dataValues))
                if (distance < currMinDistance) {
                    currMinDistance = distance;
                    candidate = points[i].dataValues;
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