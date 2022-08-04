const { Router } = require('express');
const ControllerGet = require('../controllers/controllerGet');
const ControllerPost = require('../controllers/controllerPost');

const routes = Router();

const controllerGet = new ControllerGet();
const controllerPost = new ControllerPost();

routes.get('/', controllerGet.login);
routes.get('/sair', controllerGet.sair);
routes.get('/calendario', controllerGet.calendario);
routes.get('/inicio', controllerGet.index);
routes.get('/login', controllerGet.login);
routes.get('/equipes', controllerGet.equipes);
routes.get('/equipe/:id', controllerGet.equipe);
routes.get('/addequipe', controllerGet.addEquipe);

routes.post('/login', controllerPost.login)
routes.post('/cadastro', controllerPost.cadastro)
routes.post('/addequipe', controllerPost.addEquipe)


module.exports = routes;