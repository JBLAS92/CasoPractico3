// test.js
const sqlite3 = require('sqlite3').verbose();

function testSQLInjection() {
  const db = new sqlite3.Database(':memory:');

  db.serialize(() => {
    db.run("CREATE TABLE users (id INT, name TEXT)");
    db.run("INSERT INTO users VALUES (1, 'Alice')");
    db.run("INSERT INTO users VALUES (2, 'Bob')");

    // Intento de inyección SQL
    const maliciousId = "1 OR 1=1";
    const query = `SELECT * FROM users WHERE id = ${maliciousId}`;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error en consulta:", err);
        process.exit(1);
      }
      // Si se obtienen >1 filas, la inyección fue posible
      if (rows.length > 1) {
        console.error("❌ Vulnerabilidad detectada: SQL Injection posible");
        process.exit(1);
      } else {
        console.log("✅ Consulta segura");
        process.exit(0);
      }
    });
  });
}

testSQLInjection();
