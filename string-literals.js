class LOCALIZATION {
    static WELCOME_TEXT_RU() {return 'Начальное приветствие';}

    static WELCOME_TEXT_EN() {return 'Welcoming';}

    static SET_RU_RU() {return 'Интерфейс на русском языке';}

    static SET_RU_EN() {return 'Change to russian';}

    static SET_EN_RU() {return 'Интерфейс на английском языке';}

    static SET_EN_EN() {return 'Change to english';}

    static DELETE_MAP_RU() {return 'Удалить карту и все локации на ней';}

    static DELETE_MAP_EN() {return 'Delete the map and all points on it';}

    static SERVER_ERROR_RU() {return 'Ошибка на сервере';}

    static SERVER_ERROR_EN() {return 'Server error';}

    static INCORRECT_INPUT_RU() {return 'Некорректный ввод, попробуй еще раз';}

    static INCORRECT_INPUT_EN() {return 'Incorrect input, try again';}

    static COMMAND_NOT_FOUND_RU() {return 'Нет такой команды';}

    static COMMAND_NOT_FOUND_EN() {return 'Command not found';}

    static GOOD_RU() {return 'Хорошо';}

    static GOOD_EN() {return 'Good';}

    static DONE_RU() {return 'Готово';}

    static DONE_EN() {return 'Done';}

    static CREATE_MAP_FIRST_RU() {return 'Сначала необходимо создать карту';}

    static CREATE_MAP_FIRST_EN() {return 'At first we need to create a map';}

    static WELCOME_NONAUTHORIZED_RU(name) { return `Добрый вечер я диспетчер, ${name}, для начала нужно создать карту, ок?`;}

    static WELCOME_NONAUTHORIZED_EN(name) { return `Hi, ${name}, at first we need to create a map, ok?`; }

    static WELCOME_AUTHORIZED_RU(name) { return `Добрый вечер я диспетчер, играем, ${name}?`;}

    static WELCOME_AUTHORIZED_EN(name) { return `Hi, let's play ${name}?`; }

    static FIRST_COORD_INFO_RU() {return 'Первая координата:'; }

    static FIRST_COORD_INFO_EN() {return 'The first coordinate:'; }

    static FIRST_COORD_PROMPT_RU() {return 'Ок, введи первую координату:'; }

    static FIRST_COORD_PROMPT_EN() {return 'Ok, enter a first coordinate:'; }

    static SECOND_COORD_INFO_RU() {return 'Вторая координата:'; }

    static SECOND_COORD_INFO_EN() {return 'The second coordinate:'; }

    static SECOND_COORD_PROMPT_RU() {return 'Ок, введи вторую координату:'; }

    static SECOND_COORD_PROMPT_EN() {return 'Ok, enter a second coordinate:'; }

    static THIRD_COORD_INFO_RU() {return 'Третья координата:'; }

    static THIRD_COORD_INFO_EN() {return 'The third coordinate:'; }

    static THIRD_COORD_PROMPT_RU() {return 'Ок, введи третью координату:'; }

    static THIRD_COORD_PROMPT_EN() {return 'Ok, enter a third coordinate:'; }

    static TYPE_PROMPT_RU(l1, l2, l3) {return `Отлично, координаты [${l1} ${l2} ${l3}], теперь тип точки:`;}

    static TYPE_PROMPT_EN(l1, l2, l3) {return `Fine, coordinates [${l1} ${l2} ${l3}], enter a point type:`;}

    static DESC_PROMPT_RU(type) {return `Отлично, это ${type}. И последнее, теперь описание (можно оставить пустым):`};

    static DESC_PROMPT_EN(type) {return `Fine, it's a ${type}. And finally, enter a description (can be empty):`};

    static WHERE_TO_GO_RU() {return 'Выбери куда:';}

    static WHERE_TO_GO_EN() {return 'Where to go:';}

    static SELECT_TYPE_RU() {return 'Выбери тип:';}

    static SELECT_TYPE_EN() {return 'Select a type:';}

    static SELECT_POINT_DESC_RU() {return 'Ок, введи номер точки описание которой надо изменить:';}

    static SELECT_POINT_DESC_EN() {return 'Ok, enter a number of the point which description should be changed:';}

    static SELECT_POINT_TYPE_RU() {return 'Ок, введи номер точки тип которой надо изменить:';}

    static SELECT_POINT_TYPE_EN() {return 'Ok, enter a number of the point which type should be changed:';}

    static PROMPT_NEW_DESC_RU() {return 'Ок, введи новое описание:';}

    static PROMPT_NEW_DESC_EN() {return 'Ok, enter a new description:';}

    static PROMPT_NEW_TYPE_RU() {return 'Ок, введи новый тип:';}

    static PROMPT_NEW_TYPE_EN() {return 'Ok, enter a new type:';}

    static SELECT_POINTS_DELETE_RU() {return 'Ок, введи номера точек которые надо удалить через пробел:';}

    static SELECT_POINTS_DELETE_EN() {return 'OK, enter numbers of the points separated by a space that should be deleted:';}

    static ADD_POINT_RU() { return 'Добавить точку'; }

    static ADD_POINT_EN() { return 'Add a point'; }

    static DISPLAY_NEAREST_POINT_RU() { return 'Показать ближайшую точку'; }

    static DISPLAY_NEAREST_POINT_EN() { return 'Display the nearest point'; }

    static DISPLAY_ALL_POINTS_RU() { return 'Показать все точки'; }

    static DISPLAY_ALL_POINTS_EN() { return 'Display all points'; }

    static DISPLAY_ALL_POINTS_BY_TYPE_RU() { return 'Показать список всех точек с сортировкой по типу'; }

    static DISPLAY_ALL_POINTS_BY_TYPE_EN() { return 'Display all points sorted by type'; }

    static DISPLAY_ONLY_POINTS_BY_TYPE_RU() { return 'Показать только точки одного типа'; }

    static DISPLAY_ONLY_POINTS_BY_TYPE_EN() { return 'Display only points of the same type'; }

    static MAP_EXISTS_RU() { return 'Карта уже есть'; }

    static MAP_EXISTS_EN() { return 'The map already exists'; }

    static CANT_DELETE_RU() { return 'Сложно удалить то, чего нету'; }

    static CANT_DELETE_EN() { return 'It is difficult to remove what doesn\'t exist'; }

    static CONFIRMATION_RU() { return 'Вы уверены?'; }

    static CONFIRMATION_EN() { return 'Are you sure?'; }

    static DECIDE_NEXT_RU() { return 'Решить, что делать дальше';}

    static DECIDE_NEXT_EN() { return 'Decide what to do next'; }

    static NEXT_RU() { return 'Далее'; }

    static NEXT_EN() { return 'Next'; }

    static CANCEL_RU() { return 'Отменить'; }

    static CANCEL_EN() { return 'Cancel'; }

    static EMPTY_RU() { return 'Пустым'; }

    static EMPTY_EN() { return 'Empty'; }

    static CREATE_MAP_RU() { return 'Создать карту'; }

    static CREATE_MAP_EN() { return 'Create a map'; }

    static YES_RU() { return 'Да'; }

    static YES_EN() { return 'Yes'; }

    static NO_RU() { return 'Нет'; }

    static NO_EN() { return 'No'; }

    static CHANGE_POINT_DESC_RU() { return 'Изменить описание точки'; }

    static CHANGE_POINT_DESC_EN() { return 'Change a point description'; }

    static CHANGE_POINT_TYPE_RU() { return 'Изменить тип точки'; }

    static CHANGE_POINT_TYPE_EN() { return 'Change a point type'; }

    static REMOVE_POINTS_RU() { return 'Удалить точки (указать далее)'; }

    static REMOVE_POINTS_EN() { return 'Remove points (select later)'; }

    static MAIN_MENU_RU() { return 'Главное меню'; }

    static MAIN_MENU_EN() { return 'Main menu'; }

    static HOME_RU() { return 'Дом'; }

    static HOME_EN() { return 'Home'; }

    static SHELTER_RU() { return 'Бункер'; }

    static SHELTER_EN() { return 'Shelter'; }

    static VILLAGE_RU() { return 'Деревня'; }

    static VILLAGE_EN() { return 'Village'; }

    static SHIP_RU() { return 'Корабль'; }

    static SHIP_EN() { return 'Ship'; }

    static TREASURE_RU() { return 'Клад'; }

    static TREASURE_EN() { return 'Treasure'; }

    static PORTAL_RU() { return 'Портал'; }

    static PORTAL_EN() { return 'Portal'; }

    static FORTRESS_RU() { return 'Подводная крепость'; }

    static FORTRESS_EN() { return 'Underwater fortress'; }

    static WITCH_HOUSE_RU() { return 'Дом ведьмы'; }

    static WITCH_HOUSE_EN() { return 'Witch\'s house'; }

    static WRECK_RU() { return 'Затонувший корабль'; }

    static WRECK_EN() { return 'Sunken ship'; }

    static INTERESTING_PLACE_RU() { return 'Интересное место'; }

    static INTERESTING_PLACE_EN() { return 'Interesting place'; }

    static ANYWHERE_RU() { return 'В любое место'; }

    static ANYWHERE_EN() { return 'Anywhere'; }

    static ALL_POINTS_HEADER_RU() { return 'Все точки:'; }

    static ALL_POINTS_HEADER_EN() { return ' All points:'; }

    static ALL_POINTS_TYPE_HEADER_RU(type) { return `Все точки типа ${type}:`; }

    static ALL_POINTS_TYPE_HEADER_EN(type) { return `All points with the type ${type}:`; }

    static NEAREST_POINT_HEADER_RU() { return 'Ближайшая точка:'; }

    static NEAREST_POINT_HEADER_EN() { return 'The nearest point:'; }

    static NEAREST_POINT_TYPE_HEADER_RU(type) { return `Ближайшая точка типа ${type}:`; }

    static NEAREST_POINT_TYPE_HEADER_EN(type) { return `The nearest point with the type ${type}:`; }

    static NONE_RU() { return 'Нету'; }

    static NONE_EN() { return 'No'; }

    static DISTANCE_RU(arg) { return `Расстояние: ${arg}`; }

    static DISTANCE_EN(arg) { return `Distance: ${arg}`; }

}

class StringBuilder {

    constructor() {
        this.language = 'EN';
    }


    setLang(lang) {
        this.language = lang;
    }

    getLocalizedPointType(type) {

        switch (type) {
            case LOCALIZATION['HOME_RU']():
                return this.HOME();
            case LOCALIZATION['SHELTER_RU']():
                return this.SHELTER();
            case LOCALIZATION['HOME_RU']():
                return this.HOME();
            case LOCALIZATION['VILLAGE_RU']():
                return this.VILLAGE();
            case LOCALIZATION['SHIP_RU']():
                return this.SHIP();
            case LOCALIZATION['TREASURE_RU']():
                return this.TREASURE();
            case LOCALIZATION['PORTAL_RU']():
                return this.PORTAL();
            case LOCALIZATION['FORTRESS_RU']():
                return this.FORTRESS();
            case LOCALIZATION['HOME_RU']():
                return this.HOME();
            case LOCALIZATION['WITCH_HOUSE_RU']():
                return this.WITCH_HOUSE();
            case LOCALIZATION['WRECK_RU']():
                return this.WRECK();
            case LOCALIZATION['INTERESTING_PLACE_RU']():
                return this.INTERESTING_PLACE();
            default:
                return type;
        }
    }

    f_(function_name) {
        return function_name.name + '_' + this.language;
    }

    WELCOME_TEXT() {
        const func_name = this.f_(this.WELCOME_TEXT);
        return LOCALIZATION[func_name]();
    }

     SET_RU() {
        const func_name = this.f_(this.SET_RU);
        return LOCALIZATION[func_name]();
    }

    SET_EN() {
        const func_name = this.f_(this.SET_EN);
        return LOCALIZATION[func_name]();
    }

    DELETE_MAP() {
        const func_name = this.f_(this.DELETE_MAP);
        return LOCALIZATION[func_name]();
    }

    SERVER_ERROR() {
        const func_name = this.f_(this.SERVER_ERROR);
        return LOCALIZATION[func_name]();
    }

    INCORRECT_INPUT() {
        const func_name = this.f_(this.INCORRECT_INPUT);
        return LOCALIZATION[func_name]();
    }

    COMMAND_NOT_FOUND() {
        const func_name = this.f_(this.COMMAND_NOT_FOUND);
        return LOCALIZATION[func_name]();
    }

    GOOD() {
        const func_name = this.f_(this.GOOD);
        return LOCALIZATION[func_name]();
    }

    DONE() {
        const func_name = this.f_(this.DONE);
        return LOCALIZATION[func_name]();
    }

    CREATE_MAP_FIRST() {
        const func_name = this.f_(this.CREATE_MAP_FIRST);
        return LOCALIZATION[func_name]();
    }

    WELCOME_NONAUTHORIZED(name) {
        const func_name = this.f_(this.WELCOME_NONAUTHORIZED);
        return LOCALIZATION[func_name](name);
    }

    WELCOME_AUTHORIZED(name) {
        const func_name = this.f_(this.WELCOME_AUTHORIZED);
        return LOCALIZATION[func_name](name);
    }

    FIRST_COORD_INFO() {
        const func_name = this.f_(this.FIRST_COORD_INFO);
        return LOCALIZATION[func_name]();
    }

    FIRST_COORD_PROMPT() {
        const func_name = this.f_(this.FIRST_COORD_PROMPT);
        return LOCALIZATION[func_name]();
    }

    SECOND_COORD_INFO() {
        const func_name = this.f_(this.SECOND_COORD_INFO);
        return LOCALIZATION[func_name]();
    }

    SECOND_COORD_PROMPT() {
        const func_name = this.f_(this.SECOND_COORD_PROMPT);
        return LOCALIZATION[func_name]();
    }

    THIRD_COORD_INFO() {
        const func_name = this.f_(this.THIRD_COORD_INFO);
        return LOCALIZATION[func_name]();
    }

    THIRD_COORD_PROMPT() {
        const func_name = this.f_(this.THIRD_COORD_PROMPT);
        return LOCALIZATION[func_name]();
    }

    TYPE_PROMPT(l1, l2, l3) {
        const func_name = this.f_(this.TYPE_PROMPT);
        return LOCALIZATION[func_name](l1, l2, l3);
    }

    DESC_PROMPT(desc) {
        const func_name = this.f_(this.DESC_PROMPT);
        return LOCALIZATION[func_name](desc);
    }

    WHERE_TO_GO() {
        const func_name = this.f_(this.WHERE_TO_GO);
        return LOCALIZATION[func_name]();
    }

    SELECT_TYPE() {
        const func_name = this.f_(this.SELECT_TYPE);
        return LOCALIZATION[func_name]();
    }

    SELECT_POINT_DESC() {
        const func_name = this.f_(this.SELECT_POINT_DESC);
        return LOCALIZATION[func_name]();
    }

    PROMPT_NEW_DESC() {
        const func_name = this.f_(this.PROMPT_NEW_DESC);
        return LOCALIZATION[func_name]();
    }

    PROMPT_NEW_TYPE() {
        const func_name = this.f_(this.PROMPT_NEW_TYPE);
        return LOCALIZATION[func_name]();
    }

    SELECT_POINTS_DELETE() {
        const func_name = this.f_(this.SELECT_POINTS_DELETE);
        return LOCALIZATION[func_name]();
    }


    SELECT_POINT_TYPE() {
        const func_name = this.f_(this.SELECT_POINT_TYPE);
        return LOCALIZATION[func_name]();
    }


    ADD_POINT() {
        const func_name = this.f_(this.ADD_POINT);
        return LOCALIZATION[func_name]();
    }

    DISPLAY_NEAREST_POINT() {
        const func_name = this.f_(this.DISPLAY_NEAREST_POINT);
        return LOCALIZATION[func_name]();
    }

    DISPLAY_ALL_POINTS() {
        const func_name = this.f_(this.DISPLAY_ALL_POINTS);
        return LOCALIZATION[func_name]();
    }

    DISPLAY_ALL_POINTS_BY_TYPE() {
        const func_name = this.f_(this.DISPLAY_ALL_POINTS_BY_TYPE);
        return LOCALIZATION[func_name]();
    }

    DISPLAY_ONLY_POINTS_BY_TYPE() {
        const func_name = this.f_(this.DISPLAY_ONLY_POINTS_BY_TYPE);
        return LOCALIZATION[func_name]();
    }

    MAP_EXISTS() {
        const func_name = this.f_(this.MAP_EXISTS);
        return LOCALIZATION[func_name]();
    }

    CANT_DELETE() {
        const func_name = this.f_(this.CANT_DELETE);
        return LOCALIZATION[func_name]();
    }

    CONFIRMATION() {
        const func_name = this.f_(this.CONFIRMATION);
        return LOCALIZATION[func_name]();
    }


    DECIDE_NEXT() {
        const func_name = this.f_(this.DECIDE_NEXT);
        return LOCALIZATION[func_name]();
    }

    NEXT() {
        const func_name = this.f_(this.NEXT);
        return LOCALIZATION[func_name]();
    }

    CANCEL() {
        const func_name = this.f_(this.CANCEL);
        return LOCALIZATION[func_name]();
    }

    EMPTY() {
        const func_name = this.f_(this.EMPTY);
        return LOCALIZATION[func_name]();
    }

    CREATE_MAP() {
        const func_name = this.f_(this.CREATE_MAP);
        return LOCALIZATION[func_name]();
    }

    YES() {
        const func_name = this.f_(this.YES);
        return LOCALIZATION[func_name]();
    }

    NO() {
        const func_name = this.f_(this.NO);
        return LOCALIZATION[func_name]();
    }

    CHANGE_POINT_DESC() {
        const func_name = this.f_(this.CHANGE_POINT_DESC);
        return LOCALIZATION[func_name]();
    }

    CHANGE_POINT_TYPE() {
        const func_name = this.f_(this.CHANGE_POINT_TYPE);
        return LOCALIZATION[func_name]();
    }

    REMOVE_POINTS() {
        const func_name = this.f_(this.REMOVE_POINTS);
        return LOCALIZATION[func_name]();
    }

    MAIN_MENU() {
        const func_name = this.f_(this.MAIN_MENU);
        return LOCALIZATION[func_name]();
    }

    HOME() {
        const func_name = this.f_(this.HOME);
        return LOCALIZATION[func_name]();
    }

    SHELTER() {
        const func_name = this.f_(this.SHELTER);
        return LOCALIZATION[func_name]();
    }

    VILLAGE() {
        const func_name = this.f_(this.VILLAGE);
        return LOCALIZATION[func_name]();
    }

    SHIP() {
        const func_name = this.f_(this.SHIP);
        return LOCALIZATION[func_name]();
    }

    TREASURE() {
        const func_name = this.f_(this.TREASURE);
        return LOCALIZATION[func_name]();
    }

    PORTAL() {
        const func_name = this.f_(this.PORTAL);
        return LOCALIZATION[func_name]();
    }

    FORTRESS() {
        const func_name = this.f_(this.FORTRESS);
        return LOCALIZATION[func_name]();
    }

    WITCH_HOUSE() {
        const func_name = this.f_(this.WITCH_HOUSE);
        return LOCALIZATION[func_name]();
    }

    WRECK() {
        const func_name = this.f_(this.WRECK);
        return LOCALIZATION[func_name]();
    }

    INTERESTING_PLACE() {
        const func_name = this.f_(this.INTERESTING_PLACE);
        return LOCALIZATION[func_name]();
    }

    ANYWHERE() {
        const func_name = this.f_(this.ANYWHERE);
        return LOCALIZATION[func_name]();
    }

    ALL_POINTS_HEADER() {
        const func_name = this.f_(this.ALL_POINTS_HEADER);
        return LOCALIZATION[func_name]();
    }

    ALL_POINTS_TYPE_HEADER(type) {
        const func_name = this.f_(this.ALL_POINTS_TYPE_HEADER);
        return LOCALIZATION[func_name](type);
    }

    NEAREST_POINT_HEADER() {
        const func_name = this.f_(this.NEAREST_POINT_HEADER);
        return LOCALIZATION[func_name]();
    }

    NEAREST_POINT_TYPE_HEADER(type) {
        const func_name = this.f_(this.NEAREST_POINT_TYPE_HEADER);
        return LOCALIZATION[func_name](type);
    }

    NONE() {
        const func_name = this.f_(this.NONE);
        return LOCALIZATION[func_name]();
    }

    DISTANCE(arg) {
        const func_name = this.f_(this.DISTANCE);
        return LOCALIZATION[func_name](arg);
    }
}

const stringBuilder = new StringBuilder();

module.exports = stringBuilder;