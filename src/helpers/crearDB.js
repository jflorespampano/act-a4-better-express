import Database from "better-sqlite3";

export function crearDB(){
    const raiz= process.cwd();
    const mydb=`${raiz}/app.db`
    const db = new Database(mydb)
    
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
    const insertData=db.prepare(`insert into users(name,username) values(?,?)`)
    
    data.forEach(user=>{
        const r=insertData.run(user.name, user.username)
        console.log(r)
    })
    db.close()
}