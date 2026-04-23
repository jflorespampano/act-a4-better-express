## middlewere

```js
//debajo de la sentencia: const app=express()
//middleware para  procesar parametros json
app.use(express.json())

//en las funciones de base de datos agregar
export function create(mydb,{name,username}){
    const sql=`
    insert into users(name,user) 
    values(@name,@username)
    `
    const db = new Database(mydb)
    const insertData=db.prepare(sql)
    const resp=insertData.run(name, username)
    // const resp=insertData.run(datos)
    db.close()
    return resp
}

//en las rutas agregar
app.post('/user', (req, res) => {
    const userData = req.body;
    const { name, username } = req.body;
    console.log(`${name}, ${username}`);
    const resp=create(mydb, {name, username})
    res.send(resp);
});
```

funcion create
```js

```