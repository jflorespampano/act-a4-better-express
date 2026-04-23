//no tome encuenta este archivo se usara en proximas clases para crear un modelo de datos, por ahora se usara el modelo de datos que se encuentra en model.users.js
import Database from "better-sqlite3";

function controllerDbSqlite(dbFilePath) {
  let db = null;
  let dbOpen = false;

  return {
    open() {
      db = new Database(dbFilePath);
      dbOpen = true;
    },

    run(sql, params = []) {
        this.open()
      const insertData = db.prepare(sql);
      const r = insertData.run(params);
      this.db.close();
      return r;
    },

    get(sql, params = []) {
      const res = db.prepare(sql).get(params);
      return res;
    },

    all(sql, params = []) {
      const res = db.prepare(sql).all();
      return res;
    },

    close() {
      console.log("base de datos cerrada");
      if (dbOpen) db.close();
      dbOpen = false;
    },
  };
}

export default controllerDbSqlite;