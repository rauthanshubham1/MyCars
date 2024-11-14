const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(cookieParser());
app.use(express.json());
require("./db/conn")();
const apiRoutes = require('./routes/routes');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const port = 8000 || process.env.PORT;

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log("Server active on port ", port);
});
