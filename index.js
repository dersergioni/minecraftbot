const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {startOptions, createMapOptions} = require('./tgReplyOptions')
const AddLocations = require('./addLocations');
const DisplayLocations = require('./displayLocations');
const EditLocations = require('./editLocations');
const GoToLocations = require('./goToLocations');
const EditAccountSettings = require('./editAccountSettings');
const {getChatId, getDbUser} = require("./helpers");

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
    // await db.Map.create({userId: 'user', mapId: 1});
}


const startMenu = async function (msg) {
    // await initUser();
    const chatId = getChatId(msg);
    const user = getDbUser(msg);
    const userData = sessionData.get(chatId);
    const mapId = await db.Map.findOne({where: {userId: user}});
    await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/741/656/7416567c-bc94-36e7-8d4b-ecb706761efc/11.webp');
    let sentReq;
    if (!mapId) {
        sentReq = await bot.sendMessage(chatId, `Добрый вечер я диспетчер, ${msg.from.first_name}, для начала нужно создать карту, ок?`, createMapOptions);
    } else {
        sentReq = await bot.sendMessage(chatId, `Добрый вечер я диспетчер, играем, ${msg.from.first_name}?`, startOptions);
    }
    userData.originReq = sentReq;
    sessionModes.set(chatId, Modes.Start);
}


try {
    bot.setMyCommands([{command: '/start', description: 'Начальное приветствие'}, {
        command: '/add', description: 'Добавить точку на карте'
    }, {
        command: '/go', description: 'Показать ближайшую точку'
    }, {
        command: '/all', description: 'Показать список всех точек'
    }, {
        command: '/allbytype', description: 'Показать список всех точек с сортировкой по типу'
    }, {command: '/type', description: 'Показать список точек определенного типа'}, {
        command: '/deletemap', description: 'Удалить карту и все локации на ней'
    }]);
} catch (e) {
    console.log('Cannot set Bot MyCommand:', e);
    bot.sendMessage(chatId, 'Ошибка на сервере');
}

const messageCallback = async function (msg) {

    const text = msg.text;
    const chatId = msg.chat.id;
    let user = msg.from.username;
    if (!user) {
        user = chatId;
    }
    // console.log('\n\n!message:', msg);
    try {

        if (sessionData.get(chatId) === undefined)
            sessionData.set(chatId, {});
        const userData = sessionData.get(chatId);

        const sessionMode = sessionModes.get(chatId);
        // console.log('!message mode:', sessionMode);

        if (text === '/start') {
            await startMenu(msg, chatId, user);
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
        } else if (text === '/deletemap') {
            await editAccountSettings.requestDeleteMap(msg);
        } else {
            await bot.sendMessage(chatId, 'Нет такой команды', startOptions);
        }
    } catch (e) {
        console.log('Exception:', e);
        await bot.sendMessage(chatId, 'Ошибка на сервере');
    }
}

const queryCallback = async function (msg) {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    let user = msg.from.username;
    if (!user) {
        user = chatId;
    }
    // console.log('\n\n!callback_query:', msg);
    try {

        await bot.answerCallbackQuery(msg.id);

        if (sessionData.get(chatId) === undefined)
            sessionData.set(chatId, {});
        const userData = sessionData.get(chatId);

        const sessionMode = sessionModes.get(chatId);
        // console.log('!callback_query mode:', sessionMode);
        if (sessionMode !== undefined && msg.message.message_id !== userData.originReq?.message_id) {
            await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
            return;
        }

        if (data === '/start') {
            await startMenu(msg, chatId, user);
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
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
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
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
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
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
            }
        } else if (sessionMode === Modes.AddType) {
            try {
                await addLocations.promptDesc(msg);
            } catch (e) {
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
            }
        } else if (sessionMode === Modes.AddDescription) {
            await addLocations.finalize(msg);
        } else if (sessionMode === Modes.SelectType) {
            await displayLocations.showLocations(msg);
        } else if (sessionMode === Modes.SelectDestinationType) {
            try {
                await goToLocations.calculate(msg);
            } catch (e) {
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
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
            await editLocations.finalizeDeleteLocations(chatId, user, data);
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
            await bot.sendMessage(chatId, 'Хорошо', startOptions);
        } else if (data === '/editlocationdesc') {
            await editLocations.requestEditLocationDesc(msg);
        } else if (data === '/editlocationtype') {
            await editLocations.requestEditLocationType(msg);
        } else if (data === '/deletelocation') {
            await editLocations.requestDeleteLocations(msg);
        } else if (data === '/throw') {
            await bot.sendDice(chatId);
        } else if (data === '/decide') {
            const actions = ['строить', 'рыбачить', 'добывать опыт', 'путешествовать', 'идти в Незер', 'учиться чему-то новому', 'добывать ресурсы'];
            const decision = Math.floor(Math.random() * actions.length);
            await bot.sendMessage(chatId, `Давай-ка ${actions[decision]}!`);
        } else {
            await bot.sendMessage(chatId, 'Нет такой команды', startOptions);
        }
    } catch (e) {
        console.log('Exception:', e);
        await bot.sendMessage(chatId, 'Ошибка на сервере');
    }
}

bot.on('message', messageCallback);
bot.on('callback_query', queryCallback);
