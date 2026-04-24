# better express

Objetivo:
Crear un servidor que permita el acceso a una tabla de base de datos SQLite. Trabajaremos con una base de datos que contenga la tabla de usuarios:

```sql
CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    name STRING NOT NULL,
    username STRING NOT NULL UNIQUE
)    
```
Y permita recuperar:
a. todos los usuarios
b. un usuario por su id

## Actividad

Creamos el proyecto

1. crear una carpeta para el proyecto llamada `act-14-better-express`
2. dentro de la nueva carpeta abra una consola
3. en la consola, crear proyecto: `npm init -y`
3. en el package.json, cambie el nombre del archivo principal: **"main": "server.js"**
4. indicar que usaremos modulos ES6, agregar al package.json: **"type":"module"**
5. agregar a los scripts el comando: **"dev": "node server.js"**
6. en la consola instalar paquete express: `npm i express`
7. en la consola instalar paquete better: `npm i better-sqlite3`

## crear la base de datos

Creamos un módulo de apoyo para crear y poblar la badse de datos:

Archivo: `crearDB.js`
```js
import Database from "better-sqlite3";
const db = new Database('app.db')

const query=`CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    name STRING NOT NULL,
    username STRING NOT NULL UNIQUE
)    
`
db.exec(query)

const data=[
    {name:"ana",username:"an1"},
    {name:"juan",username:"ju2"},
    {name:"bety",username:"be3"},
    {name:"paco",username:"pa0"},
    {name:"luis",username:"lu5"}
]
//Usar `?` en la consulta y pasar los valores como argumentos a `run()` 
//previene automáticamente los ataques de inyección SQL
//preparamos la sentencia de inserción
const insertData=db.prepare(`insert into users(name,username) values(?,?)`)
//note que al insertar datos no incluimos el id, esto es poque en SQLite una llave
//primaria numérica automaticamente es autoincrementable

//para todos los valores de arreglo hacemos
data.forEach(user=>{
    const r=insertData.run(user.name, user.username)
    console.log(r)
})
db.close()
```

## creamos la base de datos

Ejecutamos en la consola:
```bash
node crearDB.js
```
Listo, tenemos la base de datos creada y poblada.

## crear el servidor

Creamos el servidor con los endpoints:

1. /user  # nos devolverá todos los usuarios
2. /user/2  # nos devolverá el usuario inidcado (2 por ejemplo)

Archivo: `server.js`
```js
import express from 'express';

const app = express();
const PORT = 3000;

//-------- acceso a la base de datos
// aun falta agregar
//--------- fin de acceso a la base de datos

//manejo del servidor
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

//espera una url asi: http://localhost:3000/user/3
app.get('/user/:id', (req, res) => {
    //obtenemos el id:
    const userId = req.params.id;
    const user={id: userId, name: 'John Doe'}
    res.send(user);
});

//espera una url asi: http://localhost:3000/user
app.get('/user', (req, res) => {
    const users=[
        {id: 1, name: 'John Doe'},
        {id: 2, name: 'Jane Smith'},
        {id: 3, name: 'Alice Johnson'}
    ]
  res.send(users);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

```

Pruebe el servidor que por ahora nos devuelve datos fijos:
```bash
npm run dev
```
En el navegador pruebe las rutas:

1. `http://localhost:3000/user`
2. `http://localhost:3000/user/2`

Si sus rutas funcionan vamos ahora con la base de datos

## acceder a la base de datos

Agregamos el código para leer datos desde la BD:

Primero al inicio del archivo cargamos la biblioteca better, abajo de donde importamoe express.

```js
import Database from "better-sqlite3";
```

despues entre los comentarios **acceso a la base de datos / fin de acceso a la base de datos** ponemos:

```js
//-------- acceso a la base de datos
export function getAll(mydb){
    const db = new Database(mydb)
    const query = "select * from personas;"
    const personas = db.prepare(query).all()
    db.close()
    // console.log(personas)
    return (personas)
}

export function get(mydb,id){
    const db = new Database(mydb)
    const query = "select * from personas where id=?;"
    const personas = db.prepare(query).get([id])
    db.close()
    // console.log(personas)
    return(personas)
}
//--------- fin de acceso a la base de datos
```

cambiamos las funciones del servidor:

```js
//espera una url asi: http://localhost:3000/user/3
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user=get(mydb,userId)
  res.send(user);
});

//espera una url asi: http://localhost:3000/user
app.get('/user', (req, res) => {
  const resp=getAll(mydb)
  res.send(resp);
});
```
Pruebe el servidor con:
1. `http://localhost:3000/user`
2. `http://localhost:3000/user/2`

>nota, las sentencia `const personas = db.prepare(query).all()`, se puede poner en 2 sentencias así: `const stmt = db.prepare(query);` y `const personas = stmt.all();`

## middlewere

```js
//debajo de la sentencia: const app=express()
//middleware para  procesar parametros url-encode
app.use(express.urlencoded({ extended: true }));
//middleware para  procesar parametros json
app.use(express.json())
//middleware para  procesar parametros text
app.use(express.text())
```

## insertar datos

```js
import express from 'express';
import Database from "better-sqlite3";

const PORT = 3000;
const mydb='app.db'

const app = express();
//middlewere
app.use(express.json())

//-------- acceso a la base de datos
export function getAll(mydb){
    const db = new Database(mydb)
    const query = "select * from users;"
    const personas = db.prepare(query).all()
    db.close()
    // console.log(personas)
    return (personas)
}

export function get(mydb,id){
    const db = new Database(mydb)
    const query = "select * from users where id=?;"
    const personas = db.prepare(query).get([id])
    db.close()
    // console.log(personas)
    return(personas)
}

export function create(mydb,datos){
  // console.log("recibido",datos)
    const sql=`
    insert into users(name,username) 
    values(@name,@username)
    `
    const db = new Database(mydb)
    const insertData=db.prepare(sql)
    const resp=insertData.run(datos)
    // const resp=insertData.run(datos)
    db.close()
    return resp
}
//--------- fin de acceso a la base de datos

//manejo del servidor
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

//espera una url asi: http://localhost:3000/user/3
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user=get(mydb,userId)
  res.send(user);
});

//espera una url asi: http://localhost:3000/user
app.get('/user', (req, res) => {
  const resp=getAll(mydb)
  res.send(resp);
});

app.post('/user', (req, res) => {
    const userData = req.body;
    const { name, username } = req.body;
    console.log(`${name}, ${username}`);
    const resp=create(mydb, {name, username})
    res.send(resp);
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

```

## crear modelos

Para organizar mejor el código creamos un modelo de datos para cada entidad a manejar, por ejemplo para personas:

Archivo:`model.personas.js`
```js
import Database from "better-sqlite3";
export function getAll(mydb){
    const db = new Database(mydb)
    const query = "select * from personas;"
    const personas = db.prepare(query).all()
    db.close()
    // console.log(personas)
    return (personas)
}

export function get(mydb,id){
    const db = new Database(mydb)
    const query = "select * from personas where id=?;"
    const personas = db.prepare(query).get([id])
    db.close()
    // console.log(personas)
    return(personas)
}
/**
 * 
 * @param {*} mydb nombre del archivo de base de datos sqlite3
 * @param {*} datos {first_name,last_name,sexo,edad}
 * @returns 
 */
export function create(mydb,datos){
    const sql=`
    insert into personas(first_name,last_name,sexo,edad) 
    values(@first_name,@last_name,@sexo,@edad)
    `
    const db = new Database(mydb)
    const insertData=db.prepare(sql)
    // const resp=insertData.run(user.name, user.username)
    const resp=insertData.run(datos)
    db.close()
    return resp
}
```

Escriba el modelo para usuarios

## el modelo DAO

El DAO es un patrón de diseño que abstrae y encapsula todo el acceso a los datos (consultas, inserciones, actualizaciones, eliminaciones) de una fuente de datos (base de datos, archivo, API, etc.). Su objetivo es separar la lógica de negocio de la lógica de persistencia, haciéndolo más mantenible y testeable.

## agregar rutas

agregaremos rutas en una nueva rama:

```bash
# Crear y moverse a rama "feature/login"
git checkout -b routes

# Hacer cambios (ej: crear routes.js)
echo "function routes() {}" > routes.js

# Añadir y commit
git add .
git commit -m "Agrega rutas"

# Subir al remoto
git push -u origin routes

# Volver a main y fusionar
git checkout main
git merge routes

# Eliminar rama local y remota
git branch -d routes
git push origin --delete routes
```