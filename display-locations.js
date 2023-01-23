const {
    requestTypeOfLocationOptions,
    displayResultMenuOptions,
    createMapOptions
} = require('./tg-reply-options');
const db = require('./db-models');
const Modes = require('./session-modes');
const {getChatId, getDbUser, getInputData} = require("./helpers");
const STRINGS = require('./string-literals');

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
            userData.originReq = await this.bot.sendMessage(chatId, STRINGS.SELECT_TYPE(), requestTypeOfLocationOptions());
            this.sessionModes.set(chatId, Modes.SelectType);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

    async showLocations(msg, isByType) {
        const chatId = getChatId(msg);
        try {
            const user = getDbUser(msg);
            const mode = this.sessionModes.get(chatId);
            const userData = this.sessionData.get(chatId);
            let type;
            if (mode === Modes.SelectType) type = getInputData(msg);

            const mapId = await db.Map.findOne({where: {userId: user}});
            if (!mapId) {
                return await this.bot.sendMessage(chatId, STRINGS.CREATE_MAP_FIRST(), createMapOptions());
            }
            let replyHeader = '';
            let replyBody = '';
            let locations;
            const orderBy = [];
            if (isByType)
                orderBy.push(['type', 'ASC']);

            if (type === undefined) {
                locations = await db.Location.findAll({
                    where: {mapId: mapId.dataValues.mapId},
                    order: orderBy
                });
                replyHeader += `<b>${STRINGS.ALL_POINTS_HEADER()}</b>`;
            } else {
                locations = await db.Location.findAll({
                    where: {type: type, mapId: mapId.dataValues.mapId},
                    order: orderBy
                });
                replyHeader += `<b>${STRINGS.ALL_POINTS_TYPE_HEADER(STRINGS.getLocalizedPointType(type))}</b>`;
            }
            userData.lastDisplayed = locations;
            for (let i = 0; i < locations.length; ++i) {
                let line = '<pre>';
                line += `${('   ' + (i + 1)).slice(-3)} `;
                line += `[${('      ' + locations[i].dataValues.first).slice(-6)}`;
                line += `${('      ' + locations[i].dataValues.center).slice(-6)}`;
                line += `${('      ' + locations[i].dataValues.last).slice(-6)}]`;
                if (type === undefined) {
                    line += ` ${STRINGS.getLocalizedPointType(locations[i].dataValues.type)}`;
                    if (locations[i].dataValues.desc !== '') {
                        line += ` (${locations[i].dataValues.desc})`;
                    }
                } else {
                    if (locations[i].dataValues.desc !== '') {
                        line += ` ${locations[i].dataValues.desc}`;
                    } else {
                        line += ` ${STRINGS.getLocalizedPointType(locations[i].dataValues.type)}`;
                    }
                }
                line += '</pre>';
                line += '\n';
                replyBody += line;
            }
            if (replyBody.length === 0) {
                replyBody = `<b>${STRINGS.NONE()}</b>`;
            }
            replyBody = replyHeader + '\n' + replyBody;
            if (mode === Modes.SelectType)
                await this.bot.deleteMessage(chatId, userData.originReq.message_id);
            userData.originReq = await this.bot.sendMessage(chatId, replyBody, {parse_mode: 'html', ...displayResultMenuOptions()});
            this.sessionModes.set(chatId, Modes.Start);
        } catch (e) {
            await this.bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
        }
    }

}

module.exports = DisplayLocations;