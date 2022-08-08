const { sequelizeCon } = require("../config/db-config");
const { Users } = require("./Users");
const { Equipes } = require("./Equipes");
const { Eventos } = require("./Eventos");
const { Empresas } = require("./Empresas");
const { EquipesEmpresas } = require("./EquipesEmpresas");
const { UsersEquipes } = require("./UsersEquipes");

Equipes.belongsTo(Users, {
    foreignKey: 'dono'
});
Users.hasMany(Equipes);

Equipes.belongsToMany(Users, {
    through: 'usersEquipes'
});
Users.belongsToMany(Equipes, {
    through: 'usersEquipes'
});

Eventos.belongsTo(Equipes);
Equipes.hasMany(Eventos);

Empresas.belongsTo(Users, {
    foreignKey: 'dono'
});
Users.hasMany(Empresas);

Empresas.belongsToMany(Equipes, {
    through: 'equipesEmpresas'
});
Equipes.belongsToMany(Empresas, {
    through: 'equipesEmpresas'
});


sequelizeCon.sync();

