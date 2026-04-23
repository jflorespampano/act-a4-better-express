// import controllerDbSqlite from './controller.db.sqlite.js';
import Database from "better-sqlite3";

function modelUsers(mydb){

    function getAll(){
        const db = new Database(mydb)
        const query = "select * from users;"
        const personas = db.prepare(query).all()
        db.close()
        // console.log(personas)
        return (personas)
    }

    function get(id){
        const db = new Database(mydb)
        const query = "select * from users where id=?;"
        const personas = db.prepare(query).get([id])
        db.close()
        // console.log(personas)
        return(personas)
    }

    function create(datos){
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
    return {
        getAll,
        get,
        create
    }
}

export default modelUsers;
