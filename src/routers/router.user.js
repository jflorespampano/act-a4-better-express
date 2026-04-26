import express from 'express';
import modelUsers from '../models/model.users.js';

const getRouterUser = (controllerDB=null) => {
    const modelUsersInstance = modelUsers(controllerDB);
    const routerUser = express.Router();

    //espera una url asi: http://localhost:3000/user/3
    routerUser.get('/:id', (req, res) => {
        const userId = req.params.id;
        const user=modelUsersInstance.get(userId)
        res.send(user);
    });

    //espera una url asi: http://localhost:3000/user
    routerUser.get('/', (req, res) => {
          const resp=modelUsersInstance.getAll()
        res.send(resp);
    }); 
    routerUser.post('/', (req, res) => {
        const userData = req.body;
        const { name, username } = req.body;
        console.log(`${name}, ${username}`);
        const resp=modelUsersInstance.create({name, username})
        res.send(resp);
    });
    return routerUser;
}

export default getRouterUser;