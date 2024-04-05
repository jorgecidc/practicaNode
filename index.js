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

  // Si la ruta coincide con el patrón para guardar empleado
  if (pathname === '/guardar-empleado' && req.method === 'POST') {
    console.log('Solicitud para guardar empleado recibida');

    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString(); // Agrega el cuerpo de la solicitud al requestBody
    });

    req.on('end', () => {
      // Parsea los datos del cuerpo de la solicitud como JSON
      const { nombre, apellido, email, telefono } = JSON.parse(requestBody);

      // Verificar si los campos del formulario están vacíos
      if (nombre.trim() === '' || apellido.trim() === '' || email.trim() === '' || telefono.trim() === '') {
        console.log('Campos del formulario vacíos, no se pudo guardar el empleado');
        res.writeHead(400);
        res.end('Campos del formulario vacíos, no se pudo guardar el empleado');
        return;
      }

      // Insertar un nuevo empleado en la base de datos
      connection.query('INSERT INTO empleado (NOMBRE, APELLIDO, EMAIL, TELEFONO, SINO) VALUES (?, ?, ?, ?, 1)', [nombre, apellido, email, telefono], (error, results) => {
        if (error) {
          console.error('Error al insertar empleado en la base de datos:', error);
          res.writeHead(500);
          res.end('Error al guardar empleado en la base de datos');
          return;
        }

        console.log('Empleado guardado correctamente en la base de datos');
        // Redirigir al cliente de vuelta a la página principal (index.html) después de la inserción
        res.writeHead(302, { 'Location': '/index.html' });
        res.end();
      });
    });
  } else {
    // Si la ruta no coincide con /guardar-empleado, asumimos que es un archivo estático
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
