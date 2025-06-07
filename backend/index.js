const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: "root",
  password: "",
  database: "feedback_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

app.get("/api/feedback", (req, res) => {
  db.query("SELECT * FROM feedbacks", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/api/feedback", (req, res) => {
  const { sender, recipient_team, content, category, anonymous } = req.body;
  db.query("INSERT INTO feedbacks (sender, recipient_team, content, category, anonymous) VALUES (?, ?, ?, ?, ?)", [sender, recipient_team, content, category, anonymous], (err, result) => {
    if (err) throw err;
    res.json({ message: "Feedback submitted", id: result.insertId });
  });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
