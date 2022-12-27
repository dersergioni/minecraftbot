const {startOptions, requestDestinationTypeOfLocation} = require('./tgReplyOptions');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {getChatId, getDbUser, getInputData} = require("./helpers");

class GoToLocations {

    constructor(bot, sessionModes, sessionData) {
        this.bot = bot;
        this.sessionModes = sessionModes;
        this.sessionData = sessionData;
    }

    async promptType(msg) {
        const chatId = getChatId(msg);
        try {
            const userData = this.sessionData.get(chatId);
            const number = parseInt(userData.entering);
            if (isNaN(number)) throw('');
            userData.locations.push(number);
            userData.entering = '';
            if (userData.locations.length !== 3) throw('');
            await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            userData.originReq = await this.bot.sendMessage(chatId, `Выбери куда:`, requestDestinationTypeOfLocation);
            this.sessionModes.set(chatId, Modes.SelectDestinationType);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
        }
    }

    getDistance(x, y) {
        let compX = (y.first - x[0]) * (y.first - x[0]);
        let compY = (y.center - x[1]) * (y.center - x[1]);
        let compZ = (y.last - x[2]) * (y.last - x[2]);
        return Math.sqrt(compX + compY + compZ);
    }

    async calculate(msg) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const mode = this.sessionModes.get(chatId);
            let type;
            if (mode === Modes.SelectDestinationType) type = getInputData(msg);


            const mapId = await db.Map.findOne({where: {userId: user}});
            let replyHeader = '';
            let replyBody = '';
            let locations;
            if (type === 'any') {
                locations = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                replyHeader += '<b>Ближайшая точка:</b>';
            } else {
                locations = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                replyHeader += '<b>Ближайшая точка типа "' + type + '":</b>';
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
                replyBody = '<b>Нету</b>'
            } else {
                replyBody += `[${('      ' + candidate.first).slice(-6)}`;
                replyBody += `${('      ' + candidate.center).slice(-6)}`;
                replyBody += `${('      ' + candidate.last).slice(-6)}]`;
                if (candidate.desc !== '') {
                    replyBody += ` - ${candidate.desc}`;
                } else {
                    replyBody += ` - ${candidate.type}`;
                }
                replyBody += '\n';
                replyBody += `Расстояние: ${Math.floor(currMinDistance)}`
            }
            replyBody = replyHeader + '\n' + replyBody;
            await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            userData.originReq = await this.bot.sendMessage(chatId, replyBody, {parse_mode: 'html', ...startOptions});
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
        }
    }

}

module.exports = GoToLocations;