import controllerDbSqlite from './controller.db.sqlite.js';

/**
 * 
 * @param {object} dbController controlado de base de datos
 * @returns {object} un modelo de usuarios con métodos para obtener todos los usuarios, obtener un usuario por id y crear un nuevo usuario {getAll, get, create}
 */
function modelUsers(dbController=null){
    const {open, run, get:getOne, all, close}=dbController

    /**
     * 
     * @returns {array} arreglo de objetos de usuarios [{},{},...]
     */
    function getAll(){
        open()
        const query = "select * from users;"
        const personas = all(query)
        close()
        return (personas)
    }

    /**
     * 
     * @param {number} id del usuario
     * @returns {object} un objeto de usuario {id: 1, name: "ana", username: "an1"}
     */
    function get(id){
        open()
        const query = "select * from users where id=?;"
        const personas = getOne(query, [id])
        close()
        return(personas)
    }

    /**
     * 
     * @param {object} datos del usuario {name: "ana", username: "an1"}
     * @returns {object} el objeto del usuario creado {changes: 1, lastInsertRowid: 1}
     */
    function create(datos){
    // console.log("recibido",datos)
        const sql=`
        insert into users(name,username) 
        values(@name,@username)
        `
        open()
        const resp=run(sql, datos)
        close()
        return resp
    }
    return {
        getAll,
        get,
        create
    }
}

export default modelUsers;
