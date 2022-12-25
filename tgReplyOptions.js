module.exports = {

    startOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Добавить точку', callback_data: '/add'}],
                [{text: 'Показать все точки', callback_data: '/all'}],
                [{text: 'Показать только точки одного типа', callback_data: '/type'}],
                [{text: 'Показать ближайшую точку', callback_data: '/go'}],
                [{text: 'Удалить карту и все локации на ней', callback_data: '/deleteMap'}],
            ]
        })
    },

    requestTypeOfLocation: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Дом', callback_data: 'Дом'}, {text: 'Бункер', callback_data: 'Бункер'}, {
                    text: 'Деревня',
                    callback_data: 'Деревня'
                }],
                [{text: 'Корабль', callback_data: 'Корабль'}, {text: 'Клад', callback_data: 'Клад'}, {
                    text: 'Портал',
                    callback_data: 'Портал'
                }],
                [{text: 'Подводная крепость', callback_data: 'Подводная крепость'}, {
                    text: 'Дом ведьмы',
                    callback_data: 'Дом ведьмы'
                }, {text: 'Затонувший корабль', callback_data: 'Затонувший корабль'}],
                [{text: 'Интересное место', callback_data: 'Интересное место'}],
            ]
        })
    },

    emptyOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Пустым', callback_data: 'empty'}],
            ]
        })
    },

    createMapOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Создать карту', callback_data: '/createMap'}],
            ]
        })
    },

    confirmMapDeletionOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Да', callback_data: '/confirmMapDeletion'}],
                [{text: 'Нет', callback_data: '/declineMapDeletion'}],
            ]
        })
    },

    displayResultMenuOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Удалить точки (указать далее)', callback_data: '/deleteLocation'}],
                [{text: 'Главное меню', callback_data: '/start'}],
            ]
        })
    },

    requestDeleteLocationsOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Отменить', callback_data: '/start'}],
            ]
        })
    },

    EnterCurrentLocationOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'В главное меню', callback_data: '/start'}],
            ]
        })
    },

    requestDestinationTypeOfLocation: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Дом', callback_data: 'Дом'}, {text: 'Бункер', callback_data: 'Бункер'}, {
                    text: 'Деревня',
                    callback_data: 'Деревня'
                }],
                [{text: 'Корабль', callback_data: 'Корабль'}, {text: 'Клад', callback_data: 'Клад'}, {
                    text: 'Портал',
                    callback_data: 'Портал'
                }],
                [{text: 'Подводная крепость', callback_data: 'Подводная крепость'}, {
                    text: 'Дом ведьмы',
                    callback_data: 'Дом ведьмы'
                }, {text: 'Затонувший корабль', callback_data: 'Затонувший корабль'}],
                [{text: 'Интересное место', callback_data: 'Интересное место'}],
                [{text: 'В любое место', callback_data: 'any'}],
            ]
        })
    },

}
