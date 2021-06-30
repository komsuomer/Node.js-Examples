const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.set("view engine", "ejs");
app.set('views', './template/views')
app.use(express.static('./public'));

// Set routes
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
app.use('/', userRouter);
app.use('/admin', adminRouter);


app.listen(PORT, () => {
    console.log(`Server Works !!! At port ${PORT}`);
});