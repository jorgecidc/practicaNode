const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;

    // Si la ruta es '/', servir el archivo index.html
    if (filePath === './') {
        filePath = './index.html';
    }

    // Lee el contenido del archivo
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // Si hay un error al leer el archivo, envía una respuesta de error
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

        // Configura el encabezado de la respuesta para indicar el tipo de contenido
        res.writeHead(200, { 'Content-Type': contentType });

        // Envía el contenido del archivo como respuesta
        res.end(data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
