const STRINGS = require('./string-literals');

module.exports = {
    startOptions() {
        return {
            disable_notification: true, reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.ADD_POINT(), callback_data: '/add'}], [{
                    text: STRINGS.DISPLAY_NEAREST_POINT(), callback_data: '/go'
                }], [{text: STRINGS.DISPLAY_ALL_POINTS(), callback_data: '/all'}], [{
                    text: STRINGS.DISPLAY_ALL_POINTS_BY_TYPE(),
                    callback_data: '/allbytype'
                }], [{
                    text: STRINGS.DISPLAY_ONLY_POINTS_BY_TYPE(), callback_data: '/type'
                }], [{
                    text: STRINGS.DECIDE_NEXT(), callback_data: '/decide'
                }]]
            })
        }
    },

    requestCoordinatesOptions() {
        return {
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
                    text: STRINGS.NEXT(), callback_data: 'Далее'
                }]]
            })
        }
    },

    requestTypeOfLocationOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.HOME(), callback_data: 'Дом'}, {
                    text: STRINGS.SHELTER(),
                    callback_data: 'Бункер'
                }, {
                    text: STRINGS.VILLAGE(), callback_data: 'Деревня'
                }], [{text: STRINGS.SHIP(), callback_data: 'Корабль'}, {
                    text: STRINGS.TREASURE(),
                    callback_data: 'Клад'
                }, {
                    text: STRINGS.PORTAL(), callback_data: 'Портал'
                }], [{text: STRINGS.FORTRESS(), callback_data: 'Подводная крепость'}, {
                    text: STRINGS.WITCH_HOUSE(), callback_data: 'Дом ведьмы'
                }, {text: STRINGS.WRECK(), callback_data: 'Затонувший корабль'}], [{
                    text: STRINGS.INTERESTING_PLACE(), callback_data: 'Интересное место'
                }],]
            })
        }
    },

    requestDestinationTypeOfLocation() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.HOME(), callback_data: 'Дом'}, {
                    text: STRINGS.SHELTER(),
                    callback_data: 'Бункер'
                }, {
                    text: STRINGS.VILLAGE(), callback_data: 'Деревня'
                }], [{text: STRINGS.SHIP(), callback_data: 'Корабль'}, {
                    text: STRINGS.TREASURE(),
                    callback_data: 'Клад'
                }, {
                    text: STRINGS.PORTAL(), callback_data: 'Портал'
                }], [{text: STRINGS.FORTRESS(), callback_data: 'Подводная крепость'}, {
                    text: STRINGS.WITCH_HOUSE(), callback_data: 'Дом ведьмы'
                }, {text: STRINGS.WRECK(), callback_data: 'Затонувший корабль'}], [{
                    text: STRINGS.INTERESTING_PLACE(), callback_data: 'Интересное место'
                }], [{text: STRINGS.ANYWHERE(), callback_data: 'any'}]]
            })
        }
    },

    emptyOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.EMPTY(), callback_data: 'empty'}],]
            })
        }
    },

    createMapOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.CREATE_MAP(), callback_data: '/createmap'}],]
            })
        }
    },

    confirmMapDeletionOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.YES(), callback_data: '/confirmmapdeletion'}], [{
                    text: STRINGS.NO(), callback_data: '/declinemapdeletion'
                }],]
            })
        }
    },

    displayResultMenuOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{
                    text: STRINGS.CHANGE_POINT_DESC(), callback_data: '/editlocationdesc'
                }], [{
                    text: STRINGS.CHANGE_POINT_TYPE(), callback_data: '/editlocationtype'
                }], [{text: STRINGS.REMOVE_POINTS(), callback_data: '/deletelocation'}], [{
                    text: STRINGS.MAIN_MENU(), callback_data: '/start'
                }],]
            })
        }
    },

    requestDeleteLocationsOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.CANCEL(), callback_data: '/start'}],]
            })
        }
    },

    requestEditLocationDescriptionOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.CANCEL(), callback_data: '/start'}],]
            })
        }
    },

    requestEditLocationTypeOptions() {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: [[{text: STRINGS.CANCEL(), callback_data: '/start'}],]
            })
        }
    },

}
