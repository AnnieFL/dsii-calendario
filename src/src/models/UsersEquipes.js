const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class UsersEquipes extends Model {}
    
UsersEquipes.init({}, { 
    sequelize: sequelizeCon, 
    schema: 'calendario',
    modelName: 'usersEquipes'
});

module.exports = { UsersEquipes };