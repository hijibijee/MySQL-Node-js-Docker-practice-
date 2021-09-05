var mysql = require('mysql');
var http = require('http');
var cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser")

var con = mysql.createConnection({
  host: "localhost",
  port : 8080,
  user: "root",
  password: "taif",
  database: "userDB"
});

const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({
    extended:true
}));

app.post("/insert", function(req, res) {
  console.log(req.body)
  if(req.body.id.length == 0 || req.body.name.length == 0) res.json({msg: "Fill in all the informations"})
  else con.query('INSERT INTO user(id, name) values(' + req.body.id + ',"' + req.body.name + '");', function(err, result){
    if(err) res.json({
      msg: "Invalid Input"
    })
    else res.json({
      msg: "Successfully inserted"
    })
  })
})

app.post("/update", function(req, res) {
  console.log(req.body)
  if(req.body.id.length == 0 || req.body.name.length == 0) res.json({msg: "Fill in all the informations"})
  else con.query('SELECT * FROM user where id = ' + req.body.id + ';', function(err, result){
    console.log(result)
    if(result.length == 0){
      res.json({
        msg : "ID not found"
      })
    }
    else if(req.body.name == result[0].name) res.json({msg: "Identical entry already exists"})
    else{
      con.query('UPDATE user SET name = ' + '"' + req.body.name + '" WHERE id = ' + req.body.id + ';');
      res.json({
        msg: "Successfully updated"
      })
    }
  });
});

app.post("/delete", function(req, res){
  console.log(req.body)
  if(req.body.id.length == 0 || req.body.name.length == 0) res.json({msg: "Fill in all the informations"})
  else con.query('SELECT * FROM user where id = ' + req.body.id + ';', function(err, result){
    if(result.length == 0){
      res.json({
        msg : "May or may not be already deleted"
      })
    }
    else if(result[0].name != req.body.name){
      res.json({
        msg: "Wrong information"
      })
    }
    else{
      con.query('DELETE FROM user WHERE id = ' + req.body.id + ';');
      res.json({
        msg: "Successfully deleted"
      })
    }
  });
})

app.listen(7171, function(){
  console.log("server is running...");
})