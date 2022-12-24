const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const db = require('./dbModels');
const Modes = require('./sessionModes');
const {startOptions, createMapOptions} = require('./tgReplyOptions')
const AddLocations = require('./addLocations');
const DisplayLocations = require('./displayLocations');
const EditAccountSettings = require('./editAccountSettings');

const token = process.env.TG_MINECRAFT_TOKEN || undefined;
if (token === undefined) {
    console.error('Telegram token is absent');
    return;
}

const bot = new TelegramApi(token, {polling: true});

let sessionModes = new Map();
let sessionData = new Map();
let displayLocations = new DisplayLocations(bot, sessionModes);
let addLocations = new AddLocations(bot, sessionModes, sessionData);
let editAccountSettings = new EditAccountSettings(bot, sessionModes);

try {
    sequelize.authenticate()
    sequelize.sync()
} catch (e) {
    console.error('Проблема с подключением к БД', e)
}

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/add', description: 'Добавить точку на карте'},
    {command: '/all', description: 'Показать список всех точек'},
    {command: '/type', description: 'Показать список точек определенного типа'},

]);

const initUser = async function () {
    // await db.Map.create({userId: 'user', mapId: 1});
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
            await initUser();
            sessionModes.set(msg.from.chatId, Modes.Start);

            const mapId = await db.Map.findOne({where: {userId: user}});

            if (!mapId) {
                await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/741/656/7416567c-bc94-36e7-8d4b-ecb706761efc/11.webp');
                return bot.sendMessage(chatId, `Добрый вечер я диспетчер, играем, ${msg.from.first_name}?`, createMapOptions);
            } else {
                await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/741/656/7416567c-bc94-36e7-8d4b-ecb706761efc/11.webp');
                return bot.sendMessage(chatId, `Добрый вечер я диспетчер, для начала нужно создать карту, ${msg.from.first_name}?`, startOptions);
            }
        }

        if (text === '/add') {
            return await addLocations.promptPointStage(chatId, user);
        }

        if (text === '/all') {
            return await displayLocations.showPoints(chatId, user);
        }

        if (text === '/type') {
            return await displayLocations.promptType(chatId);
        }

        if (sessionModes.get(chatId) === Modes.AddCoordinates) {
            return await addLocations.promptTypeStage(chatId, text);
        }

        if (sessionModes.get(chatId) === Modes.AddDescription) {
            return await addLocations.finalizeStage(chatId, user, text);
        }

        if (text === '/createmap') {
            return await editAccountSettings.createMap(chatId, user);
        }

        if (text === '/deletemap') {
            return await editAccountSettings.requestDeleteMap(chatId, user);
        }

        return bot.sendMessage(chatId, 'Нет такой команды', startOptions);
        
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

        if (data === '/add') {
            return await addLocations.promptPointStage(chatId, user);
        }

        if (sessionModes.get(chatId) === Modes.AddType) {
            return await addLocations.promptDescStage(chatId, data);
        }

        if (sessionModes.get(chatId) === Modes.AddDescription) {
            return await addLocations.finalizeStage(chatId, user, data);
        }

        if (data === '/all') {
            return await displayLocations.showPoints(chatId, user);
        }

        if (data === '/type') {
            return await displayLocations.promptType(chatId);
        }

        if (sessionModes.get(chatId) === Modes.SelectType/* || sessionModes.get(chatId) === Modes.Start*/) {
            return await displayLocations.showPoints(chatId, user, data);
        }

        if (data === '/createmap') {
            return await editAccountSettings.createMap(chatId, user);
        }

        if (data === '/deletemap') {
            return await editAccountSettings.requestDeleteMap(chatId, user);
        }

        if (data === '/confirmMapDeletion') {
            return await editAccountSettings.finalizeDeleteMap(chatId, user);
        }

        if (data === '/declineMapDeletion') {
            sessionModes.set(chatId, Modes.Start);
            return await bot.sendMessage(chatId, 'Хорошо', startOptions);
        }

        return await bot.sendMessage(chatId, 'Нет такой команды', startOptions);

    } catch (e) {
        console.log('e:', e);
        return bot.sendMessage(chatId, 'Ошибка на сервере', startOptions);
    }
})
