const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Empresas extends Model {}
    
Empresas.init({
    nome: DataTypes.STRING,
}, { 
    sequelize: sequelizeCon, 
    schema: 'calendario',
    modelName: 'empresas'
});

module.exports = { Empresas };