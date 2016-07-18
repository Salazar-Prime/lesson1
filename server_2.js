var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var fs = require('fs');
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: 'password',
  database: 'staff_app'
});
connection.connect();


app.post('/index', urlencodedParser, function (req,res){
  console.log("Verifying Login Credentials for "+req.body.username);
  var query2 = connection.query('select password from login_details where username = ' + connection.escape(req.body.username), function(err,result){
    if(err){
      console.log(err);
      throw err;
    }  
    try{
      console.log(result[0].password);
      console.log(req.body.pass);
      console.log(!(req.body.pass!=result[0].password));
      if(req.body.pass!=result[0].password){
        res.status(401);
        res.end();
      }
      else{
        res.status(200);
        res.end();
      }
    }//try
    catch(error){
      console.log("error caught");
      res.status(401);
      res.end()
    }//catch

  })//query2
});//app.post



app.get('/index', function (req, res) {
 console.log("request recieved");

 var query1=connection.query('select * from room_clean' , function(err,result){
  if (err){
    console.error(err);
  }
  console.log(result);
  res.send(result);
  res.status(200);
})
});

app.post('/process_post', urlencodedParser, function (req, res) {

   // Prepare output in JSON format
   var d = new Date(req.body.donedate);
   //var t = new Time(req.body.donetime)
   console.log(d.toDateString());
   var response = {
     hostel_name:req.body.hostelname,
     room_number:req.body.roomnumber,
     date:d,
     time:req.body.donetime
   };
   
   var query = connection.query('insert into room_clean set ?' , response, function(err,result){
     if (err){
      console.error(err);
      return;
    }
    console.error(result);
  });

   console.log(response);
   res.end(JSON.stringify(response));
 })


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})