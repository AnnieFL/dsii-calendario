const { sequelizeCon } = require("../config/db-config");
const { Users } = require("./Users");
const { Equipes } = require("./Equipes");
const { Eventos } = require("./Eventos");

Equipes.belongsTo(Users, {
    foreignKey: 'admin'
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

sequelizeCon.sync();

