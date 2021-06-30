const express = require('express');
const router = express.Router();

const controller = require('../controller/userController');

router.get('/', async (req, res) => {
    controller.sendLoginPage(res);
})

router.route('/login')
    .get(async (req, res) => {
        controller.sendLoginPage(res);
    })
    .post(async (req, res) => {
        console.log('REQ : ' + req.body);
        controller.loginController(res, req.body);
    })


router.route('/register')
    .get(async (req, res) => {
        controller.sendRegisterPage(res);
    })
    .post(async (req, res) => {
        console.log(req.body);
        controller.registerController(res, req.body);
    })




module.exports = router;