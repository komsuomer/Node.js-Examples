const dbOperation = require('../model/dbOperation');
const view = require('../view/view');
const hashPwd = require('./hashPassword');

const sendLoginPage = (res) => {
    view.renderLoginPage(res);
}

const sendRegisterPage = (res) => {
    view.renderRegisterPage(res);
}

const loginController = async (res,formData) => {
    try {
        let user = await dbOperation.getUser(formData.email);
        if(user){
            if(user.password.hashedpassword == hashPwd.hash(formData.password, user.password.salt).hashedpassword){
                view.renderHomePage(res, user);
            }else{
                console.log(formData.email + ' / user login failed');
                res.sendStatus(403)
            }
        }else{
            console.log(formData.email + ' / Does not exist user');
            res.sendStatus(403)
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    } 
}

const registerController = async (res, formData) => {
    try {
        await dbOperation.getUser(formData.email)
            .then(async (user) => {
                if(user){
                    console.log(formData + ' / user exist');
                    res.sendStatus(400);
                }
                else{
                    formData.password = hashPwd.hash(formData.password, hashPwd.generateSalt(12));
                    await dbOperation.insertUser(formData);
                    // res.redirect(307,'/login');
                    res.sendStatus(200);
                }
            });
        
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
    

}






module.exports = {
    sendLoginPage,
    sendRegisterPage,
    loginController,
    registerController
}

