const { Router } = require('express');
const ControllerGet = require('../controllers/controllerGet');
const ControllerPost = require('../controllers/controllerPost');

const routes = Router();

const controllerGet = new ControllerGet();
const controllerPost = new ControllerPost();

routes.get('/', controllerGet.index);
routes.get('/calendario', controllerGet.calendario);
routes.get('/login', controllerGet.login);

routes.post('/login', controllerPost.login)


module.exports = routes;