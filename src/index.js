
const express = require('express')
const app = express()
const port = 3000

const mongoose = require("mongoose")
mongoose.connect('mongodb://0.0.0.0:27017/apiExam');

app.use(express.urlencoded());
app.use(express.json());

const userRoute = require('./routes/userRoute');
app.use('/users', userRoute);

const groupRoute = require('./routes/groupRoute');
app.use('/groups', groupRoute);


app.listen(port);