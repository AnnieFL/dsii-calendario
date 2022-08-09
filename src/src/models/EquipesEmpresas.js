const { DataTypes, Model } = require('sequelize');

const { sequelizeCon } = require('../config/db-config');

class EquipesEmpresas extends Model {}
    
EquipesEmpresas.init({}, { 
    sequelize: sequelizeCon, 
    schema: 'calendario',
    modelName: 'equipesEmpresas'
});

module.exports = { EquipesEmpresas };