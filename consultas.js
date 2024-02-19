const { Pool } = require('pg')
const bcrypt = require('bcryptjs');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'vida_sana',
    allowExitOnIdle: true
})

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const { rows: [usuario], rowCount } = await pool.query(consulta, values);
    const { password: passwordEncriptada } = usuario;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" };
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

const registrarUsuario = async (usuario) => {
    const { email, password } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2)";
    const values = [email, passwordEncriptada];
    await pool.query(consulta, values);
};

module.exports = { 
    getEventos,
    deleteEvento, 
    updateEvento, 
    registrarUsuario,
    verificarCredenciales
 };
