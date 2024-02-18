const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'vida_sana',
    allowExitOnIdle: true
})

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2";
    const values = [email, password];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount)
        throw {code: 404, message: "NO se encontro ningun usuario con esta credencial"};
};

const getEventos = async () => {
    const { rows: eventos } = await pool.query("SELECT * FROM eventos");
    return eventos;
};

const deleteEvento = async (id) => {
    const consulta = "DELETE FROM eventos WHERE id = $1";
    const values = [id];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" };
};

const updateEvento = async (titulo, descripcion, fecha, lugar, id) => {
    const consulta = "UPDATE eventos SET titulo = $1, descripcion = $2, fecha = $3, lugar = $4 WHERE id = $5";
    const values = [titulo, descripcion, fecha, lugar, id]
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount) throw { code: 404, message: "No se encontró ningún evento con este ID" };
};

module.exports = { getEventos, deleteEvento, updateEvento, verificarCredenciales };
