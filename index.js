//hola

const http = require("http");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const url = require("url");
const multer = require("multer");
const { parse } = require('url');


const storage = multer.diskStorage({
  destination: "./img",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// const connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "",
//   database: "NODE_PRUEBAS",
// });

//  const connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "user_pruebanode",
//   password: "O@3zk8s95",
//   database: "bd_pruebanode",
//  });


 const connection = mysql.createConnection({
  host: "82.223.123.233",
  port: 3306,
  user: "user_pruebanode",
  password: "O@3zk8s95",
  database: "bd_pruebanode",
 });

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
  } else if (pathname === "/eliminar-departamento" && req.method === "DELETE") {
    console.log("Solicitud para eliminar departamento recibida");

    let requestBody = "";
    req.on("data", (chunk) => {
      requestBody += chunk.toString();
    });

    req.on("end", () => {
      const { idDpt } = JSON.parse(requestBody);

      if (!idDpt) {
        res.writeHead(400);
        res.end("El ID del departamento es necesario para eliminarlo");
        return;
      }

      connection.query(
        "DELETE FROM departamento WHERE ID = ?",
        [idDpt],
        (error, results) => {
          if (error) {
            console.error("Error al eliminar el departamento:", error);
            res.writeHead(500);
            res.end("Error al eliminar el departamento de la base de datos");
            return;
          }

          console.log("Departamento eliminado correctamente");
          res.writeHead(200);
          res.end("Departamento eliminado correctamente");
        }
      );
    });
  }
 else if (pathname === "/datos_empleados" && req.method === "GET") {
    console.log("Solicitud de datos de empleados recibida");

    connection.query(
      "SELECT * FROM empleado WHERE SINO = true",
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
      "SELECT * FROM departamento",
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
  } else if (pathname === "/datos_departamento" && req.method === "GET") {
    const queryObject = url.parse(req.url, true).query;
    const idDepartamento = queryObject.id;
  
    if (idDepartamento) {
      connection.query(
        "SELECT * FROM departamento WHERE ID = ?",
        [idDepartamento],
        (error, results) => {
          if (error) {
            console.error("Error al consultar la base de datos:", error);
            res.writeHead(500);
            res.end("Error al consultar la base de datos");
            return;
          }
  
          const responseData = JSON.stringify(results[0]);
          console.log("Datos del departamento enviados:", responseData);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(responseData);
        }
      );
    } else {
      console.error("ID de departamento no proporcionado");
      res.writeHead(400);
      res.end("ID de departamento no proporcionado");
    }
  } else if (pathname === "/datos_empleado" && req.method === "GET") {
    const queryObject = url.parse(req.url, true).query;
    const idEmpleado = queryObject.id;

    if (idEmpleado) {
      connection.query(
        "SELECT * FROM empleado WHERE ID = ?",
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
  
      const { nombre, apellido, email, telefono, departamento, genero } = req.body;
      let imagen = req.file ? req.file.filename : null;
  
      connection.query(
        'INSERT INTO empleado (NOMBRE, APELLIDO, EMAIL, TELEFONO, IMG, DEPARTAMENTO, SEXO, SINO) VALUES (?, ?, ?, ?, ?, ?,?, 1)',
        [nombre, apellido, email, telefono, imagen, departamento, genero],
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
    });
  } 
  else if (pathname === "/guardar-departamento") {
    console.log("Solicitud para guardar departamento recibida");
  
    // Analizar el cuerpo de la solicitud para obtener los datos del departamento
    upload.none()(req, res, (err) => {
      if (err) {
        console.error("Error al analizar el cuerpo de la solicitud:", err);
        res.writeHead(500);
        res.end("Error al procesar la solicitud");
        return;
      }
  
      const { nombre, descripcion } = req.body;
  
      // Insertar el departamento en la base de datos
      connection.query(
        'INSERT INTO departamento (NOMBRE, DESCRIPCION) VALUES (?, ?)',
        [nombre, descripcion],
        (error, results) => {
          if (error) {
            console.error("Error al insertar departamento en la base de datos:", error);
            res.writeHead(500);
            res.end("Error al guardar departamento en la base de datos");
            return;
          }
  
          console.log("Departamento guardado correctamente en la base de datos");
          res.writeHead(200);
          res.end("Departamento guardado correctamente en la base de datos");
        }
      );
    });
  }
  

  else if (pathname === "/actualizar-empleado" && req.method === "POST") {
    console.log("Solicitud para actualizar empleado recibida");
    upload.single("imagen")(req, res, (err) => {
      if (err) {
        console.error("Error al cargar la imagen:", err);
        res.writeHead(500);
        res.end("Error al cargar la imagen");
        return;
      }
  
      try {
        const { id, nombre, apellido, email, telefono, departamento , genero} = req.body;
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
  
            console.log("Datos a actualizar:", { id, nombre, apellido, email, telefono, imagen, departamento });
  
            connection.query(
              'UPDATE empleado SET NOMBRE = ? , APELLIDO = ? , EMAIL = ? , TELEFONO = ? , IMG = ? , DEPARTAMENTO = ?, SEXO = ? WHERE ID = ?',
              [nombre, apellido, email, telefono, imagen, departamento, genero, id],
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
  } 
  else if (pathname === "/actualizar-departamento" && req.method === "POST") {
    console.log("Solicitud para actualizar departamento recibida");

    upload.none()(req, res, (err) => { // Usamos upload.none() para indicar que no esperamos archivos
        if (err) {
            console.error("Error al cargar los datos del formulario:", err);
            res.writeHead(500);
            res.end("Error al cargar los datos del formulario");
            return;
        }

        try {
            const { idDpt, nombre, descripcion } = req.body;

            console.log("Datos recibidos del cliente:", { idDpt, nombre, descripcion });

            // Ejecutar la consulta para actualizar el departamento en la base de datos
            connection.query(
                'UPDATE departamento SET NOMBRE = ?, DESCRIPCION = ? WHERE ID = ?',
                [nombre, descripcion, idDpt],
                (error, results) => {
                    if (error) {
                        console.error("Error al actualizar departamento en la base de datos:", error);
                        res.writeHead(500);
                        res.end("Error al actualizar departamento en la base de datos");
                        return;
                    }

                    console.log("Departamento actualizado correctamente en la base de datos");
                    res.writeHead(200);
                    res.end("Departamento actualizado correctamente en la base de datos");
                }
            );
        } catch (error) {
            console.error("Error al procesar la solicitud:", error);
            res.writeHead(400);
            res.end("Error al procesar la solicitud");
        }
    });
}

else {
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
