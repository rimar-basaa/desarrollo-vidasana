const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan')
const { getEventos, deleteEvento, verificarCredenciales } = require('./consultas');


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get("/eventos", async (req, res) => {
    try {
        const eventos = await getEventos();
        res.json(eventos);
    } catch (error) {
        res.status(error.code || 500).send(error);
    };
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, "az_AZ");
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    };
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`servidor corriendo... en puerto:${PORT}`));