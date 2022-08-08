const { Router } = require('express');
const ControllerGet = require('../controllers/controllerGet');
const ControllerPost = require('../controllers/controllerPost');

const routes = Router();

const controllerGet = new ControllerGet();
const controllerPost = new ControllerPost();

routes.get('/', controllerGet.login);
routes.get('/sair', controllerGet.sair);
routes.get('/calendario/:id', controllerGet.calendario);
routes.get('/inicio', controllerGet.index);
routes.get('/meuperfil', controllerGet.meuPerfil);
routes.get('/login', controllerGet.login);
routes.get('/equipes', controllerGet.equipes);
routes.get('/equipe/:id', controllerGet.equipe);
routes.get('/addequipe', controllerGet.addEquipe);
routes.get('/evento/:id', controllerGet.evento);
routes.get('/convites', controllerGet.convites);
routes.get('/removerequipe', controllerGet.removerEquipe);
routes.get('/sairequipe', controllerGet.sairEquipe);
routes.get('/convite', controllerGet.convite);
routes.get('/addevento/:id', controllerGet.addEvento);

routes.post('/login', controllerPost.login)
routes.post('/cadastro', controllerPost.cadastro)
routes.post('/addequipe', controllerPost.addEquipe)
routes.post('/addevento', controllerPost.addEvento)
routes.post('/editevento', controllerPost.editEvento)
routes.post('/addmember', controllerPost.addMembro)
routes.post('/changefoto', controllerPost.changefoto)

routes.get('*', controllerGet.index);

module.exports = routes;