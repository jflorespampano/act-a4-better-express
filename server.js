import express from 'express';
import { getVariablesDB, getVariablesEntorno } from './src/helpers/getVariablesEntorno.js';
import controllerDbFactory from './src/models/factory.controller.db.js';
import getRouterUser from './src/routers/router.user.js';

const { PORT, HOST } = getVariablesEntorno();

const controllerDB = controllerDbFactory(getVariablesDB())
const routerUser = getRouterUser(controllerDB);

const app = express();
//middlewere
app.use(express.json())

//manejo de ruta raiz
app.get('/', (req, res) => {
  res.send("Bienvenido a la API de usuarios");
});

//manejo de ruta user
app.use('/user', routerUser);

// manejo de rutas no encontradas
app.use((_, res, next) => {
  res.status(404).send("404 página no encontrada");
});

//lanzar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://${HOST}:${PORT}`);
});

