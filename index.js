const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const db = require('./db-models');
const Modes = require('./session-modes');
const {startOptions, createMapOptions} = require('./tg-reply-options')
const AddLocations = require('./add-locations');
const DisplayLocations = require('./display-locations');
const EditLocations = require('./edit-locations');
const GoToLocations = require('./go-to-locations');
const EditAccountSettings = require('./edit-account-settings');
const {getChatId, getDbUser} = require("./helpers");
const STRINGS = require('./string-literals');
STRINGS.setLang('EN');

const token = process.env.TG_MINECRAFT_TOKEN || undefined;
if (token === undefined) {
    console.error('Telegram token is absent');
    return;
}

const bot = new TelegramApi(token, {polling: true});

const sessionModes = new Map();
const sessionData = new Map();
const addLocations = new AddLocations(bot, sessionModes, sessionData);
const displayLocations = new DisplayLocations(bot, sessionModes, sessionData);
const editLocations = new EditLocations(bot, sessionModes, sessionData);
const goToLocations = new GoToLocations(bot, sessionModes, sessionData);
const editAccountSettings = new EditAccountSettings(bot, sessionModes, sessionData);
try {
    sequelize.authenticate()
    sequelize.sync()
} catch (e) {
    console.error('Failed to connect to the DB', e)
}
const initUser = async function () {
    await db.Map.create({userId: 'user', mapId: 1});
}

const setBotCommands = async function () {
    try {
        await bot.setMyCommands([{command: '/start', description: STRINGS.WELCOME_TEXT()}, {
            command: '/add', description: STRINGS.ADD_POINT()
        }, {
            command: '/go', description: STRINGS.DISPLAY_NEAREST_POINT()
        }, {
            command: '/all', description: STRINGS.DISPLAY_ALL_POINTS()
        }, {
            command: '/allbytype', description: STRINGS.DISPLAY_ALL_POINTS_BY_TYPE()
        }, {command: '/type', description: STRINGS.DISPLAY_ONLY_POINTS_BY_TYPE()},
            {command: '/seten', description: STRINGS.SET_EN()},
            {command: '/setru', description: STRINGS.SET_RU()}, {
                command: '/deletemap', description: STRINGS.DELETE_MAP()
            }]);
    } catch (e) {
        console.log('Cannot set Bot MyCommand:', e);
        await bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
    }
}

const startMenu = async function (msg) {
    // await initUser();
    const chatId = getChatId(msg);
    const user = getDbUser(msg);
    const userData = sessionData.get(chatId);
    const mapId = await db.Map.findOne({where: {userId: user}});
    await setBotCommands();
    await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/741/656/7416567c-bc94-36e7-8d4b-ecb706761efc/11.webp');
    if (!mapId) {
        userData.originReq = await bot.sendMessage(chatId, STRINGS.WELCOME_NONAUTHORIZED(msg.from.first_name), createMapOptions());
    } else {
        userData.originReq = await bot.sendMessage(chatId, STRINGS.WELCOME_AUTHORIZED(msg.from.first_name), startOptions());
    }
    sessionModes.set(chatId, Modes.Start);
}

const updateLanguage = async function (msg) {
    const user = getDbUser(msg);
    const dbRes = await db.Map.findOne({where: {userId: user}});
    let lang = 'EN';
    if (dbRes) {
        lang = dbRes.dataValues.lang;
    }
    STRINGS.setLang(lang);
}

const setLanguage = async function (msg, lang) {
    const user = getDbUser(msg);
    const dbRes = await db.Map.findOne({where: {userId: user}});
    if (!dbRes) return;

    dbRes.set({lang: lang});
    await dbRes.save();
}

const messageCallback = async function (msg) {

    const text = msg.text;
    const chatId = getChatId(msg);
    // console.log('\n\n!message:', msg);
    // console.log('!message mode:', sessionMode);
    if (sessionData.get(chatId) === undefined) sessionData.set(chatId, {});
    const userData = sessionData.get(chatId);
    const sessionMode = sessionModes.get(chatId);

    await updateLanguage(msg);

    try {
        if (text === '/start') {
            await startMenu(msg);
        } else if (text === '/add') {
            await addLocations.promptCoordinateOne(msg);
        } else if (text === '/all') {
            await displayLocations.showLocations(msg);
        } else if (text === '/allbytype') {
            await displayLocations.showLocations(msg, true);
        } else if (text === '/type') {
            await displayLocations.promptType(msg);
        } else if (text === '/go') {
            await addLocations.promptCoordinateOne(msg);
        } else if (text === '/createmap') {
            await editAccountSettings.createMap(msg);
        } else if (text === '/setru') {
            await setLanguage(msg, 'RU');
            await updateLanguage(msg);
            await bot.sendMessage(chatId, STRINGS.DONE());
        } else if (text === '/seten') {
            await setLanguage(msg, 'EN');
            await updateLanguage(msg);
            await bot.sendMessage(chatId, STRINGS.DONE());
        } else if (text === '/deletemap') {
            await editAccountSettings.requestDeleteMap(msg);
        } else if (sessionMode === Modes.EnterCoordinateOne) {
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            await addLocations.promptCoordinateTwo(msg);
        } else if (sessionMode === Modes.EnterCoordinateTwo) {
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            await addLocations.promptCoordinateThree(msg);
        } else if (sessionMode === Modes.EnterCoordinateThree) {
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            if (userData.initialCommand === '/go') {
                await goToLocations.promptType(msg);
            } else {
                await addLocations.promptType(msg);
            }
        } else if (sessionMode === Modes.AddDescription) {
            await addLocations.finalize(msg);
        } else if (sessionMode === Modes.RequestEditLocationDescription) {
            userData.entering = text;
            await editLocations.promptNewDesc(msg);
        } else if (sessionMode === Modes.EditDescription) {
            await editLocations.finalizeEditLocationDesc(msg);
        } else if (sessionMode === Modes.RequestEditLocationType) {
            userData.entering = text;
            await editLocations.promptNewType(msg);
        } else if (sessionMode === Modes.EditType) {
            await editLocations.finalizeEditLocationType(msg);
        } else if (sessionMode === Modes.RequestDeleteLocations) {
            await editLocations.finalizeDeleteLocations(msg);
        } else {
            userData.originReq = await bot.sendMessage(chatId, STRINGS.COMMAND_NOT_FOUND(), startOptions());
        }
    } catch (e) {
        console.log('Exception:', e);
        await bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
    }
}

const queryCallback = async function (msg) {
    const data = msg.data;
    const chatId = getChatId(msg);
    // console.log('\n\n!callback_query:', msg.data);
    // console.log('!callback_query mode:', sessionMode);
    if (sessionData.get(chatId) === undefined) sessionData.set(chatId, {});
    const sessionMode = sessionModes.get(chatId);
    const userData = sessionData.get(chatId);

    await updateLanguage(msg);

    try {
        await bot.answerCallbackQuery(msg.id);
        if (sessionMode !== undefined && msg.message.message_id !== userData.originReq?.message_id) {
            await bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
            return;
        }
        if (data === '/start') {
            await startMenu(msg);
        } else if (sessionMode === Modes.EnterCoordinateOne) {
            try {
                if (data === 'Далее') {
                    await addLocations.promptCoordinateTwo(msg);
                } else if (data === '\u232B') {
                    if (userData.entering.length === 0) {
                        return;
                    }
                    userData.entering = userData.entering.slice(0, -1);
                    await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                        chat_id: chatId, message_id: userData.demoMsg.message_id
                    });
                } else {
                    userData.entering += data;
                    await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                        chat_id: chatId, message_id: userData.demoMsg.message_id
                    });
                }

            } catch (e) {
                await bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
            }

        } else if (sessionMode === Modes.EnterCoordinateTwo) {
            try {
                if (data === 'Далее') {
                    await addLocations.promptCoordinateThree(msg);
                } else if (data === '\u232B') {
                    if (userData.entering.length === 0) {
                        return;
                    }
                    userData.entering = userData.entering.slice(0, -1);
                    await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                        chat_id: chatId, message_id: userData.demoMsg.message_id
                    });
                } else {
                    userData.entering += data;
                    await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                        chat_id: chatId, message_id: userData.demoMsg.message_id
                    });
                }

            } catch (e) {
                await bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
            }
        } else if (sessionMode === Modes.EnterCoordinateThree) {
            try {
                if (data === 'Далее') {
                    if (userData.initialCommand === '/go') {
                        await goToLocations.promptType(msg);
                    } else {
                        await addLocations.promptType(msg);
                    }
                } else if (data === '\u232B') {
                    if (userData.entering.length === 0) {
                        return;
                    }
                    userData.entering = userData.entering.slice(0, -1);
                    await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                        chat_id: chatId, message_id: userData.demoMsg.message_id
                    });
                } else {
                    userData.entering += data;
                    await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                        chat_id: chatId, message_id: userData.demoMsg.message_id
                    });
                }

            } catch (e) {
                await bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
            }
        } else if (sessionMode === Modes.AddType) {
            try {
                await addLocations.promptDesc(msg);
            } catch (e) {
                await bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
            }
        } else if (sessionMode === Modes.AddDescription) {
            await addLocations.finalize(msg);
        } else if (sessionMode === Modes.SelectType) {
            await displayLocations.showLocations(msg);
        } else if (sessionMode === Modes.SelectDestinationType) {
            try {
                await goToLocations.calculate(msg);
            } catch (e) {
                await bot.sendMessage(chatId, STRINGS.INCORRECT_INPUT());
            }
        } else if (sessionMode === Modes.RequestEditLocationDescription) {
            await editLocations.promptNewDesc(msg);
        } else if (sessionMode === Modes.EditDescription) {
            await editLocations.finalizeEditLocationDesc(msg);
        } else if (sessionMode === Modes.RequestEditLocationType) {
            await editLocations.promptNewType(msg);
        } else if (sessionMode === Modes.EditType) {
            await editLocations.finalizeEditLocationType(msg);
        } else if (sessionMode === Modes.RequestDeleteLocations) {
            await editLocations.finalizeDeleteLocations(chatId);
        } else if (data === '/add') {
            await addLocations.promptCoordinateOne(msg);
        } else if (data === '/all') {
            await displayLocations.showLocations(msg);
        } else if (data === '/allbytype') {
            await displayLocations.showLocations(msg, true);
        } else if (data === '/type') {
            await displayLocations.promptType(msg);
        } else if (data === '/go') {
            await addLocations.promptCoordinateOne(msg);
        } else if (data === '/createmap') {
            await editAccountSettings.createMap(msg);
        } else if (data === '/deletemap') {
            await editAccountSettings.requestDeleteMap(msg);
        } else if (data === '/confirmmapdeletion') {
            await editAccountSettings.finalizeDeleteMap(msg);
        } else if (data === '/declinemapdeletion') {
            sessionModes.set(chatId, Modes.Start);
            userData.originReq = await bot.sendMessage(chatId, STRINGS.GOOD(), startOptions());
        } else if (data === '/editlocationdesc') {
            await editLocations.requestEditLocationDesc(msg);
        } else if (data === '/editlocationtype') {
            await editLocations.requestEditLocationType(msg);
        } else if (data === '/deletelocation') {
            await editLocations.requestDeleteLocations(msg);
        } else if (data === '/decide') {
            const actions = ['строить', 'рыбачить', 'добывать опыт', 'путешествовать', 'идти в Незер', 'учиться чему-то новому', 'добывать ресурсы'];
            const decision = Math.floor(Math.random() * actions.length);
            userData.originReq = await bot.sendMessage(chatId, `Давай-ка ${actions[decision]}!`);
        } else {
            userData.originReq = await bot.sendMessage(chatId, STRINGS.COMMAND_NOT_FOUND(), startOptions());
        }
    } catch (e) {
        console.log('Exception:', e);
        await bot.sendMessage(chatId, STRINGS.SERVER_ERROR());
    }
}

bot.on('message', messageCallback);
bot.on('callback_query', queryCallback);
