import fs from "fs";
import http from "http";
import url from "url";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  console.log("req: ", req.method);

  if (pathname === "/api/students") {
    if (req.method === "GET") {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      fs.readFile("./Data/students.json", "utf8", (err, data) => {
        if (err) {
          console.log(`Error reading file: ${err}`);
          res.writeHead(500);
          res.end(`Error reading file: ${err}`);
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        }
      });
    } else if (req.method === "POST") {
      console.log("POST ");
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const student = JSON.parse(body);
          console.log("student: ", student);
          const students = JSON.parse(
            fs.readFileSync("./Data/students.json", "utf8")
          );
          student.id = uuidv4();

          const index = students.findIndex((s) => s.id === student.id);

          if (index !== -1) {
            students[index] = student;
          } else {
            students.push(student);
          }

          fs.writeFileSync(
            "./Data/students.json",
            JSON.stringify(students),
            "utf8"
          );
          res.writeHead(201, { "Content-Type": "application/json" });
          //   res.end(JSON.stringify(student));
          res.end(JSON.stringify(students));
        } catch (err) {
          console.log(`Error adding student: ${err}`);
          res.writeHead(500);
          res.end(`Error adding student: ${err}`);
        }
      });
    } else if (req.method === "DELETE") {
      console.log("DELETE ");
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      const id = parsedUrl.pathname.split("/").pop();
      if (!id) {
        res.writeHead(400);
        res.end("ID is required");
      } else {
        const students = JSON.parse(
          fs.readFileSync("./Data/students.json", "utf8")
        );
        const filteredStudents = students.filter((s) => s.id !== id);
        fs.writeFileSync(
          "./Data/students.json",
          JSON.stringify(filteredStudents),
          "utf8"
        );
        res.writeHead(200);
        res.end("Student deleted");
      }
    } else if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.writeHead(200);
      res.end();
    }
  } else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

server.listen(port, () => {
  console.log(`Le serveur est en route au port ${port}`);
});
