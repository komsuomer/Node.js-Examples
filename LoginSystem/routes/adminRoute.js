const express = require('express');
const router = express.Router();

const controller = require('../controller/adminController');

router.route('/')
    .get( async (req, res) => {
        console.log('Get Admin');
        controller.sendLoginPage(res);
    })
    .post(async (req,res) => {
        console.log('Post Admin');
        controller.loginController(res, req.body);
    })
    .delete(async (req,res) => {
        console.log('Delete Admin => ' + JSON.stringify(req.body));
        controller.deleteUser(res, req.body);
    })

module.exports = router;