const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Users extends Model {}
    
Users.init({
    email: DataTypes.STRING,
    nome: DataTypes.STRING,
    senha: DataTypes.STRING,
    foto: DataTypes.STRING,
    empresaId: DataTypes.INTEGER
}, { 
    sequelize: sequelizeCon, 
    schema: 'calendario',
    modelName: 'users'
});

module.exports = { Users };