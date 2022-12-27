module.exports = {

    startOptions: {
        disable_notification: true, reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Добавить точку', callback_data: '/add'}], [{
                text: 'Показать ближайшую точку', callback_data: '/go'
            }], [{text: 'Показать все точки', callback_data: '/all'}], [{
                text: 'Показать только точки одного типа', callback_data: '/type'
            }]]
        })
    },

    requestCoordinatesOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {
                text: '3', callback_data: '3'
            }], [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {
                text: '6', callback_data: '6'
            }], [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {
                text: '9', callback_data: '9'
            }], [{text: '\u232B', callback_data: '\u232B'}, {text: '0', callback_data: '0'}, {
                text: '-', callback_data: '-'
            }], [{
                text: 'Далее', callback_data: 'Далее'
            }]]
        })
    },

    requestTypeOfLocationOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Дом', callback_data: 'Дом'}, {text: 'Бункер', callback_data: 'Бункер'}, {
                text: 'Деревня', callback_data: 'Деревня'
            }], [{text: 'Корабль', callback_data: 'Корабль'}, {text: 'Клад', callback_data: 'Клад'}, {
                text: 'Портал', callback_data: 'Портал'
            }], [{text: 'Подводная крепость', callback_data: 'Подводная крепость'}, {
                text: 'Дом ведьмы', callback_data: 'Дом ведьмы'
            }, {text: 'Затонувший корабль', callback_data: 'Затонувший корабль'}], [{
                text: 'Интересное место', callback_data: 'Интересное место'
            }],]
        })
    },

    requestDestinationTypeOfLocation: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Дом', callback_data: 'Дом'}, {text: 'Бункер', callback_data: 'Бункер'}, {
                text: 'Деревня', callback_data: 'Деревня'
            }], [{text: 'Корабль', callback_data: 'Корабль'}, {text: 'Клад', callback_data: 'Клад'}, {
                text: 'Портал', callback_data: 'Портал'
            }], [{text: 'Подводная крепость', callback_data: 'Подводная крепость'}, {
                text: 'Дом ведьмы', callback_data: 'Дом ведьмы'
            }, {text: 'Затонувший корабль', callback_data: 'Затонувший корабль'}], [{
                text: 'Интересное место', callback_data: 'Интересное место'
            }], [{text: 'В любое место', callback_data: 'any'}],]
        })
    },

    emptyOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Пустым', callback_data: 'empty'}],]
        })
    },

    createMapOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Создать карту', callback_data: '/createmap'}],]
        })
    },

    confirmMapDeletionOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Да', callback_data: '/confirmmapdeletion'}], [{
                text: 'Нет', callback_data: '/declinemapdeletion'
            }],]
        })
    },

    displayResultMenuOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{
                text: 'Изменить описание точки', callback_data: '/editlocationdesc'
            }], [{
                text: 'Удалить точки (указать далее)', callback_data: '/deletelocation'
            }], [{text: 'Главное меню', callback_data: '/start'}],]
        })
    },

    requestDeleteLocationsOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Отменить', callback_data: '/start'}],]
        })
    },

    requestEditLocationDescriptionOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{text: 'Отменить', callback_data: '/start'}],]
        })
    },

}
