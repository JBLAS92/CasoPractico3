// index.js (solución - parametrizado)
const sqlite3 = require('sqlite3').verbose();
const http = require('http');

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INT, name TEXT)");
  db.run("INSERT INTO users VALUES (1, 'Alice')");
  db.run("INSERT INTO users VALUES (2, 'Bob')");
});

const server = http.createServer((req, res) => {
  const urlParams = new URL(req.url, `http://${req.headers.host}`);
  const id = urlParams.searchParams.get('id');

  // ✔️ Solución: usar placeholder y pasar el parámetro como dato
  const query = `SELECT * FROM users WHERE id = ?`;
  console.log("Ejecutando consulta parametrizada:", query, "params:", String(id).replace(/\n|\r/g, ""));

  db.all(query, [id], (err, rows) => {
    if (err) {
      res.writeHead(500);
      return res.end("Error en la consulta");
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  });
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
