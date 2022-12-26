const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {startOptions, createMapOptions} = require('./tgReplyOptions')
const AddLocations = require('./addLocations');
const DisplayLocations = require('./displayLocations');
const DeleteLocations = require('./deleteLocations');
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
const deleteLocations = new DeleteLocations(bot, sessionModes, sessionData);
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
    const mapId = await db.Map.findOne({where: {userId: user}});
    sessionModes.set(chatId, Modes.Start);
    await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/741/656/7416567c-bc94-36e7-8d4b-ecb706761efc/11.webp');
    if (!mapId) {
        return await bot.sendMessage(chatId, `Добрый вечер я диспетчер, ${msg.from.first_name}, для начала нужно создать карту, ок?`, createMapOptions);
    } else {
        return await bot.sendMessage(chatId, `Добрый вечер я диспетчер, играем, ${msg.from.first_name}?`, startOptions);
    }
}

try {
    bot.setMyCommands([{command: '/start', description: 'Начальное приветствие'}, {
        command: '/add', description: 'Добавить точку на карте'
    }, {
        command: '/go', description: 'Показать ближайшую точку'
    }, {
        command: '/all', description: 'Показать список всех точек'
    }, {command: '/type', description: 'Показать список точек определенного типа'}, {
        command: '/deletemap', description: 'Удалить карту и все локации на ней'
    }]);
} catch (e) {
    console.log('Cannot set Bot MyCommand:', e);
    bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
}

const messageCallback = async function (msg) {

    const text = msg.text;
    const chatId = msg.chat.id;
    let user = msg.from.username;
    if (!user) {
        user = chatId;
    }
    // console.log('\n\n!message:', msg);
    // console.log('!message mode:', sessionModes.get(chatId));
    try {

        const userData = sessionData.get(chatId);
        if (userData === undefined)
            sessionData.set(chatId, {});

        if (text === '/start') {
            await startMenu(msg, chatId, user);
        } else if (sessionModes.get(chatId) === Modes.EnterCoordinateOne) {
            const userData = sessionData.get(chatId);
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            await addLocations.promptCoordinateTwo(msg);
        } else if (sessionModes.get(chatId) === Modes.EnterCoordinateTwo) {
            const userData = sessionData.get(chatId);
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            await addLocations.promptCoordinateThree(msg);
        } else if (sessionModes.get(chatId) === Modes.EnterCoordinateThree) {
            const userData = sessionData.get(chatId);
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            if (userData.initialCommand === '/go') {
                await goToLocations.promptType(msg);
            } else {
                await addLocations.promptType(msg);
            }
        } else if (sessionModes.get(chatId) === Modes.AddDescription) {
            await addLocations.finalize(msg);
        } else if (sessionModes.get(chatId) === Modes.RequestDeleteLocations) {
            await deleteLocations.finalizeDeleteLocations(msg);
        } else if (text === '/add') {
            await addLocations.promptCoordinateOne(msg);
        } else if (text === '/all') {
            await displayLocations.showLocations(msg);
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
        await bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
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
    // console.log('!callback_query mode:', sessionModes.get(chatId));
    try {

        let answerResp = await bot.answerCallbackQuery(msg.id);
        // console.log('answerCallbackQuery:', answerResp);

        const userData = sessionData.get(chatId);
        if (userData === undefined)
            sessionData.set(chatId, {});

        if (data === '/start') {
            await startMenu(msg, chatId, user);
        } else if (sessionModes.get(chatId) === Modes.RequestDeleteLocations) {
            await deleteLocations.finalizeDeleteLocations(chatId, user, data);
        } else if (sessionModes.get(chatId) === Modes.EnterCoordinateOne) {
            try {
                const userData = sessionData.get(chatId);
                if (msg.message.message_id !== userData.originReq.message_id) throw('');
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

        } else if (sessionModes.get(chatId) === Modes.EnterCoordinateTwo) {
            try {
                const userData = sessionData.get(chatId);
                if (msg.message.message_id !== userData.originReq.message_id) throw('');
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
        } else if (sessionModes.get(chatId) === Modes.EnterCoordinateThree) {
            try {
                const userData = sessionData.get(chatId);
                if (msg.message.message_id !== userData.originReq.message_id) throw('');
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
        } else if (sessionModes.get(chatId) === Modes.AddType) {
            try {
                const userData = sessionData.get(chatId);
                if (msg.message.message_id !== userData.originReq.message_id) throw('');
                await addLocations.promptDesc(msg);
            } catch (e) {
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
            }
        } else if (sessionModes.get(chatId) === Modes.AddDescription) {
            await addLocations.finalize(msg);
        } else if (sessionModes.get(chatId) === Modes.SelectType) {
            await displayLocations.showLocations(msg);
        } else if (sessionModes.get(chatId) === Modes.SelectDestinationType) {
            try {
                const userData = sessionData.get(chatId);
                if (msg.message.message_id !== userData.originReq.message_id) throw('');
                await goToLocations.calculate(msg);
            } catch (e) {
                await bot.sendMessage(chatId, 'Что-то не то ввел, попробуй еще раз');
            }
        } else if (data === '/add') {
            await addLocations.promptCoordinateOne(msg);
        } else if (data === '/all') {
            await displayLocations.showLocations(msg);
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
        } else if (data === '/deletelocation') {
            await deleteLocations.requestDeleteLocations(msg);
        } else {
            await bot.sendMessage(chatId, 'Нет такой команды', startOptions);
        }

    } catch (e) {
        console.log('Exception:', e);
        await bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
    }
}

bot.on('message', messageCallback);
bot.on('callback_query', queryCallback);
