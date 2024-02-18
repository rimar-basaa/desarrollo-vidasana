const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const morgan = require('morgan')
const { getEventos, deleteEvento, updateEvento, verificarCredenciales } = require('./consultas');

//MMiddleware
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
        const token = jwt.sign({ email }, "rimar");
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    };
});

app.delete("/eventos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const Authorization = req.header('Authorization');
        const token = Authorization.split(' ')[1];
        jwt.verify(token, "rimar");
        const { email } = jwt.decode(token);
        await deleteEvento(id);
        res.send(`El usuario ${email} ha eliminado el evento con id:${id}`);

    } catch (error) {
        res.status(500).json({message: "NO tiene autorizacion"});
    };
});

app.put("/eventos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, fecha, lugar } = req.body;
        const Authorization = req.header('Authorization');
        const token = Authorization.split(' ')[1];
        jwt.verify(token, "rimar");
        const { email } = jwt.decode(token);
        await updateEvento(titulo, descripcion, fecha, lugar, id);
        res.send(`El usuario ${email} ha modificado el evento con id:${id}`);

    } catch (error) {
        res.status(500).json({message: "NO tiene autorizacion"});
    };
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`servidor corriendo... en puerto:${PORT}`));