const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const url = require("url");
const formidable = require("formidable");

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "NODE_PRUEBAS",
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.stack);
    return;
  }
  console.log("Conexión establecida con la base de datos");
});

const server = http.createServer((req, res) => {
  // Parsear la URL para obtener la ruta
  const { pathname } = url.parse(req.url);

  // Si la ruta coincide con el patrón para marcar como eliminado
  if (pathname === "/marcar-como-eliminado" && req.method === "PUT") {
    console.log("Solicitud para marcar como eliminado recibida");

    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk.toString(); // Agrega el cuerpo de la solicitud al requestBody
    });

    req.on("end", () => {
      // Parsea los datos del cuerpo de la solicitud como JSON
      const { id } = JSON.parse(requestBody);

      // Actualiza el valor de la columna SINO en la base de datos
      connection.query(
        "UPDATE empleado SET SINO = 0 WHERE ID = ?",
        [id],
        (error, results) => {
          if (error) {
            console.error(
              "Error al marcar como eliminado en la base de datos:",
              error
            );
            res.writeHead(500);
            res.end("Error al marcar como eliminado en la base de datos");
            return;
          }

          console.log(
            "Empleado marcado como eliminado correctamente en la base de datos"
          );
          res.writeHead(200);
          res.end(
            "Empleado marcado como eliminado correctamente en la base de datos"
          );
        }
      );
    });
  } else if (pathname === "/datos_empleados" && req.method === "GET") {
    console.log("Solicitud de datos de empleados recibida");
    // Realizar la consulta a la base de datos para obtener los datos de los empleados
    connection.query(
      "SELECT ID, NOMBRE, APELLIDO, EMAIL, TELEFONO, IMG FROM empleado WHERE SINO = true",
      (error, results) => {
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          res.writeHead(500);
          res.end("Error al consultar la base de datos");
          return;
        }

        // Enviar los datos de los empleados como respuesta en formato JSON
        const responseData = JSON.stringify(results);
        console.log("Datos de empleados enviados:", responseData);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(responseData);
      }
    );
  } else if (pathname === "/datos_empleado" && req.method === "GET") {
    // Si la ruta coincide con /datos_empleado, se espera un parámetro de ID en la URL
    const queryObject = url.parse(req.url, true).query;
    const idEmpleado = queryObject.id;

    if (idEmpleado) {
      // Realizar la consulta a la base de datos para obtener los datos del empleado con el ID proporcionado
      connection.query(
        "SELECT ID, NOMBRE, APELLIDO, EMAIL, TELEFONO, IMG FROM empleado WHERE ID = ?",
        [idEmpleado],
        (error, results) => {
          if (error) {
            console.error("Error al consultar la base de datos:", error);
            res.writeHead(500);
            res.end("Error al consultar la base de datos");
            return;
          }

          // Enviar los datos del empleado como respuesta en formato JSON
          const responseData = JSON.stringify(results);
          console.log("Datos del empleado enviados:", responseData);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(responseData);
        }
      );
    } else {
      // Si no se proporciona un ID, mostrar un error
      console.error("ID de empleado no proporcionado");
      res.writeHead(400);
      res.end("ID de empleado no proporcionado");
    }
  } else if (pathname === "/guardar-empleado" && req.method === "POST") {
    console.log("Solicitud para guardar empleado recibida");

    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk.toString(); // Agrega el cuerpo de la solicitud al requestBody
    });

    req.on("end", () => {
      // Parsea los datos del cuerpo de la solicitud como JSON
      const { id, nombre, apellido, email, telefono } = JSON.parse(requestBody);

      if (id) {
        // Si hay un ID, actualiza el empleado en la base de datos
        connection.query(
          "UPDATE empleado SET NOMBRE=?, APELLIDO=?, EMAIL=?, TELEFONO=? WHERE ID=?",
          [nombre, apellido, email, telefono, id],
          (error, results) => {
            if (error) {
              console.error(
                "Error al actualizar empleado en la base de datos:",
                error
              );
              res.writeHead(500);
              res.end("Error al actualizar empleado en la base de datos");
              return;
            }

            console.log(
              "Empleado actualizado correctamente en la base de datos"
            );
            res.writeHead(200);
            res.end("Empleado actualizado correctamente en la base de datos");
          }
        );
      } else {
        // Si no hay un ID, inserta un nuevo empleado en la base de datos
        connection.query(
          'INSERT INTO empleado (NOMBRE, APELLIDO, EMAIL, TELEFONO, IMG, SINO) VALUES (?, ?, ?, ?, "imagen1.png", 1)',
          [nombre, apellido, email, telefono],
          (error, results) => {
            if (error) {
              console.error(
                "Error al insertar empleado en la base de datos:",
                error
              );
              res.writeHead(500);
              res.end("Error al guardar empleado en la base de datos");
              return;
            }

            console.log("Empleado guardado correctamente en la base de datos");
            res.writeHead(200);
            res.end("Empleado guardado correctamente en la base de datos");
          }
        );
      }
    });
  } else {
    // Si la ruta no coincide con ninguna de las anteriores, asumimos que es un archivo estático
    let filePath = "." + pathname;
    // Si la ruta es '/', servir el archivo index.html
    if (filePath === "./") {
      filePath = "./index.html";
    }

    // Lee el contenido del archivo
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        res.writeHead(500);
        res.end("Error interno del servidor");
        return;
      }

      // Configura el encabezado de la respuesta según la extensión del archivo
      const extname = path.extname(filePath);
      let contentType = "text/html";
      switch (extname) {
        case ".js":
          contentType = "text/javascript";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".json":
          contentType = "application/json";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".jpg":
          contentType = "image/jpg";
          break;
      }

      // Configurar el encabezado de la respuesta para indicar el tipo de contenido
      res.writeHead(200, { "Content-Type": contentType });

      // Enviar el contenido del archivo como respuesta
      res.end(data);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
