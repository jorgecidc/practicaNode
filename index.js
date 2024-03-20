const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Ruta al archivo HTML que deseas servir
    const filePath = path.join(__dirname, 'index.html');

    // Lee el contenido del archivo HTML
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Si hay un error al leer el archivo, envía una respuesta de error
            res.writeHead(500);
            res.end('Error interno del servidor');
            return;
        }

        // Configura el encabezado de la respuesta para indicar que es HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });

        // Envía el contenido del archivo HTML como respuesta
        res.end(data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
