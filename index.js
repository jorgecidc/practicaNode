//hola

const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const url = require("url");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./img",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "NODE_PRUEBAS",
});

//  const connection = mysql.createConnection({
//   host: "82.223.123.233",
//   port: 3306,
//   user: "user_pruebanode",
//   password: "O@3zk8s95",
//   database: "bd_pruebanode",
//  });


connection.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.stack);
    return;
  }
  console.log("Conexión establecida con la base de datos");
});

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);

  if (pathname === "/marcar-como-eliminado" && req.method === "PUT") {
    console.log("Solicitud para marcar como eliminado recibida");

    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk.toString();
    });

    req.on("end", () => {
      const { id } = JSON.parse(requestBody);

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

    connection.query(
      "SELECT ID, NOMBRE, APELLIDO, EMAIL, TELEFONO, IMG FROM empleado WHERE SINO = true",
      (error, results) => {
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          res.writeHead(500);
          res.end("Error al consultar la base de datos");
          return;
        }

        const responseData = JSON.stringify(results);
        console.log("Datos de empleados enviados:", responseData);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(responseData);
      }
    );
  } else if (pathname === "/datos_departamentos" && req.method === "GET") {
    console.log("Solicitud de datos de departamentos recibida");

    connection.query(
      "SELECT ID, NOMBRE, DESCRIPCION FROM departamentos",
      (error, results) => {
        if (error) {
          console.error("Error al consultar la base de datos:", error);
          res.writeHead(500);
          res.end("Error al consultar la base de datos");
          return;
        }

        const responseData = JSON.stringify(results);
        console.log("Datos de departamentos enviados:", responseData);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(responseData);
      }
    );
  } else if (pathname === "/datos_empleado" && req.method === "GET") {
    const queryObject = url.parse(req.url, true).query;
    const idEmpleado = queryObject.id;

    if (idEmpleado) {
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

          const responseData = JSON.stringify(results);
          console.log("Datos del empleado enviados:", responseData);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(responseData);
        }
      );
    } else {
      console.error("ID de empleado no proporcionado");
      res.writeHead(400);
      res.end("ID de empleado no proporcionado");
    }
  } else if (pathname === "/guardar-empleado") {
    console.log("Solicitud para guardar empleado recibida");

    upload.single("imagen")(req, res, (err) => {
      if (err) {
        console.error("Error al cargar la imagen:", err);
        res.writeHead(500);
        res.end("Error al cargar la imagen");
        return;
      }

      const { id, nombre, apellido, email, telefono } = req.body;
      let imagen = req.file ? req.file.filename : null;

      if (id == "hola") {
        connection.query(
          "UPDATE empleado SET NOMBRE=?, APELLIDO=?, EMAIL=?, TELEFONO=?, IMG=? WHERE ID=?",
          [nombre, apellido, email, telefono, imagen, id],
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

            console.log("Empleado actualizado correctamente en la base de datos");
            res.writeHead(200);
            res.end("Empleado actualizado correctamente en la base de datos");
          }
        );
      } else {
        connection.query(
          'INSERT INTO empleado (NOMBRE, APELLIDO, EMAIL, TELEFONO, IMG, SINO) VALUES (?, ?, ?, ?, ?, 1)',
          [nombre, apellido, email, telefono, imagen],
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
  } else if (pathname === "/actualizar-empleado" && req.method === "POST") {
    console.log("Solicitud para actualizar empleado recibida");
    upload.single("imagen")(req, res, (err) => {
      if (err) {
        console.error("Error al cargar la imagen:", err);
        res.writeHead(500);
        res.end("Error al cargar la imagen");
        return;
      }

      try {
        const { id, nombre, apellido, email, telefono } = req.body;
        let imagen;

        connection.query(
          "SELECT IMG FROM empleado WHERE ID = ?",
          [id],
          (error, results) => {
            if (error) {
              console.error("Error al obtener la imagen del empleado:", error);
              res.writeHead(500);
              res.end("Error al obtener la imagen del empleado");
              return;
            }

            imagen = req.file ? req.file.filename : results[0].IMG;

            console.log("Datos a actualizar:", { id, nombre, apellido, email, telefono, imagen });

            connection.query(
              'UPDATE empleado SET NOMBRE = ? , APELLIDO = ? , EMAIL = ? , TELEFONO = ? , IMG = ? WHERE ID = ?',
              [nombre, apellido, email, telefono, imagen, id],
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

                console.log("Empleado actualizado correctamente en la base de datos");
                res.writeHead(200);
                res.end("Empleado actualizado correctamente en la base de datos");
              }
            );
          }
        );
      } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.writeHead(400);
        res.end("Error al procesar la solicitud");
      }
    });
  } else {
    let filePath = "." + pathname;
    if (filePath === "./") {
      filePath = "./index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        res.writeHead(404); 
        res.end("Archivo no encontrado");
        return;
      }

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

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
