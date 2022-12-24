const {Sequelize} = require('sequelize');

module.exports = new Sequelize({
    dialect: 'sqlite',
    storage: 'var/minecraft.sqlite',
    logging: false
});