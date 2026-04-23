import express from 'express';
import Database from "better-sqlite3";
import modelUsers from './src/models/model.users.js';

const PORT = 3000;
const raiz = process.cwd();
const mydb = `${raiz}/app.db`;
const db = modelUsers(mydb);

const app = express();
//middlewere
app.use(express.json())

//manejo del servidor
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

//espera una url asi: http://localhost:3000/user/3
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user=db.get(userId)
  res.send(user);
});

//espera una url asi: http://localhost:3000/user
app.get('/user', (req, res) => {
  const resp=db.getAll()
  res.send(resp);
});

app.post('/user', (req, res) => {
    const userData = req.body;
    const { name, username } = req.body;
    console.log(`${name}, ${username}`);
    const resp=db.create({name, username})
    res.send(resp);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

