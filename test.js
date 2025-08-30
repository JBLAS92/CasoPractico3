const sqlite3 = require('sqlite3').verbose();
 
function testSQLInjectionSecure() {
  const db = new sqlite3.Database(':memory:');
 
  db.serialize(() => {
db.run("CREATE TABLE users (id INT, name TEXT)");
db.run("INSERT INTO users VALUES (1, 'Alice')");
db.run("INSERT INTO users VALUES (2, 'Bob')");
 
    // Intento de inyección SQL
    const maliciousId = "1 OR 1=1";
 
    // Uso de parámetros evita la inyección
    const query = "SELECT * FROM users WHERE id = ?";
    db.all(query, [maliciousId], (err, rows) => {
      if (err) {
        console.error("Error en consulta segura:", err);
        process.exit(1);
      }
 
      if (rows.length > 1) {
        console.error("❌ Vulnerabilidad detectada: se filtraron varios usuarios");
        process.exit(1);
      } else {
        console.log("✅ Consulta segura, no hubo inyección");
        process.exit(0);
      }
    });
  });
}
 
testSQLInjectionSecure();
