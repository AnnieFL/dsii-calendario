const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Eventos extends Model {}
    
Eventos.init({
    descricao: DataTypes.STRING,
    data: DataTypes.DATE
}, { 
    sequelize: sequelizeCon, 
    schema: 'calendario',
    modelName: 'eventos'
});

module.exports = { Eventos };