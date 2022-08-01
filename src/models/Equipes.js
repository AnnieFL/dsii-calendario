const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class Equipes extends Model {}
    
Equipes.init({
    nome: DataTypes.STRING,
    cor: DataTypes.STRING
}, { 
    sequelize: sequelizeCon, 
    schema: 'calendario',
    modelName: 'equipes'
});

module.exports = { Equipes };