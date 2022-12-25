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
const editAccountSettings = new EditAccountSettings(bot, sessionModes);

try {
    sequelize.authenticate()
    sequelize.sync()
} catch (e) {
    console.error('Failed to connect to the DB', e)
}

bot.setMyCommands([{command: '/start', description: 'Начальное приветствие'}, {
    command: '/add', description: 'Добавить точку на карте'
}, {command: '/all', description: 'Показать список всех точек'}, {
    command: '/type', description: 'Показать список точек определенного типа'
}, {
    command: '/go', description: 'Показать ближайшую точку'
},]);

const initUser = async function () {
    // await db.Map.create({userId: 'user', mapId: 1});
}


const startMenu = async function (msg, chatId, user) {
    // await initUser();
    sessionModes.set(msg.from.chatId, Modes.Start);
    const mapId = await db.Map.findOne({where: {userId: user}});
    await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/741/656/7416567c-bc94-36e7-8d4b-ecb706761efc/11.webp');
    if (!mapId) {
        return bot.sendMessage(chatId, `Добрый вечер я диспетчер, для начала нужно создать карту, ${msg.from.first_name}?`, createMapOptions);
    } else {
        return bot.sendMessage(chatId, `Добрый вечер я диспетчер, играем, ${msg.from.first_name}?`, startOptions);
    }
}


bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    let user = msg.from.username;
    if (!user) {
        user = chatId;
    }
    // console.log('message', msg);
    // console.log('message! mode:', sessionModes.get(chatId));
    try {
        if (text === '/start') {
            return await startMenu(msg, chatId, user);
        }

        if (text === '/add') {
            return await addLocations.promptCoordinateOne(chatId, user, data);
        }

        if (text === '/all') {
            return await displayLocations.showLocations(chatId, user);
        }

        if (text === '/type') {
            return await displayLocations.promptType(chatId);
        }

        if (text === '/go') {
            return await addLocations.promptCoordinateOne(chatId, user, text);
        }

        if (text === '/createMap') {
            return await editAccountSettings.createMap(chatId, user);
        }

        if (text === '/deleteMap') {
            return await editAccountSettings.requestDeleteMap(chatId, user);
        }

        if (sessionModes.get(chatId) === Modes.EnterCoordinateOne) {
            const userData = sessionData.get(chatId);
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            return await addLocations.promptCoordinateTwo(chatId);
        }

        if (sessionModes.get(chatId) === Modes.EnterCoordinateTwo) {
            const userData = sessionData.get(chatId);
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            return await addLocations.promptCoordinateThree(chatId);
        }

        if (sessionModes.get(chatId) === Modes.EnterCoordinateThree) {
            const userData = sessionData.get(chatId);
            userData.entering = text;
            await bot.editMessageText(userData.demoMsg.text + ' ' + text, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
            return await addLocations.promptTypeStage(chatId);
        }

        if (sessionModes.get(chatId) === Modes.AddDescription) {
            return await addLocations.finalize(chatId, user, text);
        }

        if (sessionModes.get(chatId) === Modes.RequestDeleteLocations) {
            return await deleteLocations.finalizeDeleteLocations(chatId, user, text);
        }

        return await bot.sendMessage(chatId, 'Нет такой команды', startOptions);

    } catch (e) {
        console.log('Exception:', e);
        return bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
    }

})

bot.on('callback_query', async msg => {

    const data = msg.data;
    const chatId = msg.message.chat.id;
    let user = msg.from.username;
    if (!user) {
        user = chatId;
    }
    // console.log('\n\ncallback_query', msg);
    // console.log('callback_query! mode:', sessionModes.get(chatId));
    try {

        if (data === '/start') {
            return await startMenu(msg, chatId, user);
        }

        if (data === '/add') {
            return await addLocations.promptCoordinateOne(chatId, user, data);
        }

        if (data === '/all') {
            return await displayLocations.showLocations(chatId, user);
        }

        if (data === '/type') {
            return await displayLocations.promptType(chatId);
        }

        if (data === '/go') {
            return await addLocations.promptCoordinateOne(chatId, user, data);
        }

        if (data === '/createMap') {
            return await editAccountSettings.createMap(chatId, user);
        }

        if (data === '/deleteMap') {
            return await editAccountSettings.requestDeleteMap(chatId, user);
        }

        if (data === '/confirmMapDeletion') {
            return await editAccountSettings.finalizeDeleteMap(chatId, user);
        }

        if (data === '/declineMapDeletion') {
            sessionModes.set(chatId, Modes.Start);
            return await bot.sendMessage(chatId, 'Хорошо', startOptions);
        }

        if (data === '/deleteLocation') {
            return await deleteLocations.requestDeleteLocations(chatId);
        }

        if (sessionModes.get(chatId) === Modes.RequestDeleteLocations) {
            return await deleteLocations.finalizeDeleteLocations(chatId, user, data);
        }

        if (sessionModes.get(chatId) === Modes.EnterCoordinateOne) {
            const userData = sessionData.get(chatId);
            if (data === 'Далее') {
                return await addLocations.promptCoordinateTwo(chatId);
            } else if (data === '\u232B') {
                userData.entering = userData.entering.slice(0, -1);
            } else {
                userData.entering += data;
            }
            await bot.answerCallbackQuery(msg.id);
            return await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
        }

        if (sessionModes.get(chatId) === Modes.EnterCoordinateTwo) {
            const userData = sessionData.get(chatId);
            if (data === 'Далее') {
                return await addLocations.promptCoordinateThree(chatId);
            } else if (data === '\u232B') {
                userData.entering = userData.entering.slice(0, -1);
            } else {
                userData.entering += data;
            }
            await bot.answerCallbackQuery(msg.id);
            return await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
        }

        if (sessionModes.get(chatId) === Modes.EnterCoordinateThree) {
            const userData = sessionData.get(chatId);
            if (data === 'Далее') {
                if (userData.initialCommand === '/go') {
                    return await goToLocations.promptType(chatId);
                } else {
                    return await addLocations.promptTypeStage(chatId);
                }
            } else if (data === '\u232B') {
                userData.entering = userData.entering.slice(0, -1);
            } else {
                userData.entering += data;
            }
            await bot.answerCallbackQuery(msg.id);
            return await bot.editMessageText(userData.demoMsg.text + ' ' + userData.entering, {
                chat_id: chatId, message_id: userData.demoMsg.message_id
            });
        }

        if (sessionModes.get(chatId) === Modes.AddType) {
            return await addLocations.promptDesc(chatId, data);
        }

        if (sessionModes.get(chatId) === Modes.AddDescription) {
            return await addLocations.finalize(chatId, user, data);
        }

        if (sessionModes.get(chatId) === Modes.SelectType) {
            return await displayLocations.showLocations(chatId, user, data);
        }

        if (sessionModes.get(chatId) === Modes.SelectDestinationType) {
            return await goToLocations.calculate(chatId, user, data);
        }

        return await bot.sendMessage(chatId, 'Нет такой команды', startOptions);

    } catch (e) {
        console.log('Exception:', e);
        return bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
    }
})
