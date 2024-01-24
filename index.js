const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");

const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");

app.use(express.urlencoded({ extended: true }));
// hum patch me url se data access kernge ye uske liye hai

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "rachitde",
});

const getuser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
    // birthdate: faker.date.birthdate(),
    // registeredAt: faker.date.past(),
  ];
};

// let q = "INSERT INTO wow (userId,username,email,password) VALUES ?";

// let data = [];

// for (let i = 0; i <= 100; i++){
//   data.push(getuser());
// }

// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// };
// connection.end();

app.listen("8080", () => {
  console.log("server is listening on 3000");
});

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM wow`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];

      // yaha pe result ek array hai or iss arry ke ander objects stored hai key value pair me toh yaha hum result ke 0th index pe jo object hai usse access ker rehe hai step 1 me and fir uss object me jo count naam ki key hai uski value ko hum count me pass ker rehe hai eske leye ek or command hai better understand ke liye
      // let count = result[0][`key.${key}`];

      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log("some error occured");
    res.send("some error occured");
  }
});

let q2 = `SELECT * FROM wow`;

app.get("/user", (req, res) => {
  try {
    connection.query(q2, (err, result) => {
      if (err) throw err;
      let data = result;
      res.render("show.ejs", { data });
    });
  } catch (error) {
    res.send("some error occured");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q3 = `SELECT * FROM wow WHERE userId='${id}'`;
  //  hume "" kudh dene hai variable me ager hum string type data use ker rehe hai apne database me system nhi dega enhe

  try {
    connection.query(q3, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(user);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let edit = req.body.username;
  let edit2 = req.body.email;
  let pass = req.body.password;
  let q4 = `SELECT * FROM wow WHERE userId='${id}'`;
  try {
    connection.query(q4, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (pass == user.password) {
        user.username = edit;
        user.email = edit2;

        let q = `UPDATE wow
            SET username='${edit}' , email = '${edit2}'
            WHERE userId='${id}'`;

        connection.query(q, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
          console.log(edit);
          console.log(edit2);
        });
      } else {
        res.send("wrong password");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// patch me humne phele id prams ki fir data access kiya url se fir first querry laga ke databse me se data mangainge fir password compare keringe if statment se fir ager password sahi hai toh database me changes keinge or redirect ker dinge nhi toh worng hone pe erroe show ker dingeeeeee
