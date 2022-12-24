const sequelize = require('./db');
const {DataTypes} = require('sequelize');

const Location = sequelize.define('Location', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    mapId: {type: DataTypes.INTEGER, allowNull: false},
    first: {type: DataTypes.INTEGER, allowNull: false},
    center: {type: DataTypes.INTEGER, allowNull: false},
    last: {type: DataTypes.INTEGER, allowNull: false},
    type: {type: DataTypes.STRING, allowNull: false},
    desc: {type: DataTypes.STRING, defaultValue: ""},
    author: {type: DataTypes.STRING, allowNull: false}
})


const Map = sequelize.define('Map', {
    userId: {type: DataTypes.STRING, primaryKey: true, unique: true},
    mapId: {type: DataTypes.INTEGER, allowNull: false}
})

module.exports = {Location, Map};
