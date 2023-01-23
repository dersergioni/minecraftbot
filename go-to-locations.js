const {startOptions, requestDestinationTypeOfLocation, createMapOptions} = require('./tg-reply-options');
const db = require('./db-models');
const Modes = require('./session-modes');
const {getChatId, getDbUser, getInputData} = require("./helpers");
const STRINGS = require('./string-literals');

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
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.WHERE_TO_GO(), requestDestinationTypeOfLocation());
            this.sessionModes.set(chatId, Modes.SelectDestinationType);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
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
            const userData = this.sessionData.get(chatId);
            const user = getDbUser(msg);
            const mode = this.sessionModes.get(chatId);
            let type;
            if (mode === Modes.SelectDestinationType) type = getInputData(msg);
            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) {
                return userData.originReq = await this.bot.sendMessage(chatId, STRINGS.CREATE_MAP_FIRST(), createMapOptions());
            }
            let replyHeader = '';
            let replyBody = '';
            let locations;
            if (type === 'any') {
                locations = await db.Location.findAll({where: {mapId: mapId.dataValues.mapId}});
                replyHeader += `<b>${STRINGS.NEAREST_POINT_HEADER()}</b>`;
            } else {
                locations = await db.Location.findAll({where: {type: type, mapId: mapId.dataValues.mapId}});
                replyHeader += `<b>${STRINGS.NEAREST_POINT_TYPE_HEADER(STRINGS.getLocalizedPointType(type))}</b>`;
            }

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
                replyBody = `<b>${STRINGS.NONE()}</b>`
            } else {
                replyBody += `[${('      ' + candidate.first).slice(-6)}`;
                replyBody += `${('      ' + candidate.center).slice(-6)}`;
                replyBody += `${('      ' + candidate.last).slice(-6)}]`;
                if (candidate.desc !== '') {
                    replyBody += ` - ${candidate.desc}`;
                } else {
                    replyBody += ` - ${STRINGS.getLocalizedPointType(candidate.type)}`;
                }
                replyBody += '\n';
                replyBody += STRINGS.DISTANCE(Math.floor(currMinDistance));
            }
            replyBody = replyHeader + '\n' + replyBody;
            await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            userData.originReq = await this.bot.sendMessage(chatId, replyBody, {parse_mode: 'html', ...startOptions()});
            delete userData.locations;
            delete userData.initialCommand;
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

}

module.exports = GoToLocations;