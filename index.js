const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const url = require('url');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306, // Puerto de MySQL
  user: 'root',
  password: '',
  database: 'NODE_PRUEBAS'
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conexión establecida con la base de datos');
});

const server = http.createServer((req, res) => {
  // Parsear la URL para obtener la ruta
  const { pathname } = url.parse(req.url);

  // Si la ruta coincide con el patrón para obtener datos de empleados
  if (pathname === '/datos_empleados') {
    console.log('Solicitud de datos de empleados recibida');
    // Realizar la consulta a la base de datos para obtener los datos de los empleados
    connection.query('SELECT ID, NOMBRE, APELLIDO, EMAIL, TELEFONO FROM empleado WHERE SINO = true', (error, results) => {
      if (error) {
        console.error('Error al consultar la base de datos:', error);
        res.writeHead(500);
        res.end('Error al consultar la base de datos');
        return;
      }

      // Enviar los datos de los empleados como respuesta en formato JSON
      const responseData = JSON.stringify(results);
      console.log('Datos de empleados enviados:', responseData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(responseData);
    });
  } else {
    // Si la ruta no coincide con /datos_empleados, asumimos que es un archivo estático
    let filePath = '.' + pathname;
    // Si la ruta es '/', servir el archivo index.html
    if (filePath === './') {
      filePath = './index.html';
    }

    // Lee el contenido del archivo
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        res.writeHead(500);
        res.end('Error interno del servidor');
        return;
      }

      // Configura el encabezado de la respuesta según la extensión del archivo
      const extname = path.extname(filePath);
      let contentType = 'text/html';
      switch (extname) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.jpg':
          contentType = 'image/jpg';
          break;
      }

      // Configurar el encabezado de la respuesta para indicar el tipo de contenido
      res.writeHead(200, { 'Content-Type': contentType });

      // Enviar el contenido del archivo como respuesta
      res.end(data);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
