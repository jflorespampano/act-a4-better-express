import express from 'express';
import modelUsers from './src/models/model.users.js';
import { getVariablesDB, getVariablesEntorno } from './src/helpers/getVariablesEntorno.js';
import controllerDbFactory from './src/models/factory.controller.db.js';

const { PORT, HOST } = getVariablesEntorno();
const dbDefinition=getVariablesDB()

const controllerDB = controllerDbFactory(getVariablesDB())
const modelUsersInstance = modelUsers(controllerDB);

const app = express();
//middlewere
app.use(express.json())

//manejo del servidor
app.get('/', (req, res) => {
  res.send(dbDefinition);
});

//espera una url asi: http://localhost:3000/user/3
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user=modelUsersInstance.get(userId)
  res.send(user);
});

//espera una url asi: http://localhost:3000/user
app.get('/user', (req, res) => {
  const resp=modelUsersInstance.getAll()
  res.send(resp);
});

app.post('/user', (req, res) => {
    const userData = req.body;
    const { name, username } = req.body;
    console.log(`${name}, ${username}`);
    const resp=modelUsersInstance.create({name, username})
    res.send(resp);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://${HOST}:${PORT}`);
});

