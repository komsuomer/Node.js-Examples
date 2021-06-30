const dbOperation = require('../model/dbOperation');
const view = require('../view/view');
const hashPwd = require('./hashPassword');


const sendLoginPage = (res) => {
    view.renderAdminLoginPage(res);
}

const loginController = async (res,data) => {
    try {
        if(process.env.ADMIN_HASHEDPASSWORD === hashPwd.hash(data.password, process.env.ADMIN_SALT).hashedpassword){
            let userList = await dbOperation.listUser(100);
            view.renderAdminPage(res, userList);
        }else{
            console.log(data + ' / Admin login failed');
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } 
}

const deleteUser = async (res, body) => {
    try {
        if(await dbOperation.removeUser(body.email)){
            res.sendStatus(200);
            return;
        }
        res.sendStatus(404);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


module.exports = {
    sendLoginPage,
    loginController,
    deleteUser
}