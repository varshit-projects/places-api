import express from "express";
import ejs from "ejs";
import fs from "fs";
import { getAll, insertIntoTable } from "./db.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

// Render index.ejs file
app.get("/", function (req, res) {
  // Render page using renderFile method
  ejs.renderFile("index.ejs", {}, {}, function (err, template) {
    if (err) {
      throw err;
    } else {
      res.end(template);
    }
  });
});

app.post("/", async function (req, res) {
  // console.log(req.body);
  const { place_id, name, fullname, lat, lng } = req.body;
  if(!place_id){
    return res.send({message:'Send places data'});
  }
  await insertIntoTable(req.body, (data) => {
    return res.send(data);
  });
});
app.get("/places", async function (req, res) {
  let value = req.query.searchText ? req.query.searchText : "";
  const data = await getAll(value, (data) => {
    return res.send({
      success: true,
      data: data,
    });
  });
});

// Server setup
app.listen(port, function (error) {
  if (error) throw error;
  else console.log("Server is running on http://localhost:" +port);
});
