var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const pg = require('pg');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Error Handling Part*/
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });



/* REST API Part*/
// connect to the database
var client = new pg.Client({
    user: "cdayzybxzlxefj",
    password: "GVj_jvlUnzzpecARZjyoa6LV4l",
    database: "dduukt3891q3gl",
    port: 5432,
    host: "ec2-54-243-185-185.compute-1.amazonaws.com",
    ssl: true
}); 

client.connect();

app.get("/isLoggedIn", function(req, res){
  console.log("isLoggedIn called");

  if (req != null && req.session != null && req.session.isLoggedIn != null){
    return res.json({isLoggedIn : req.session.isLoggedIn, session: req.session});
  }else{
    return res.json({isLoggedIn : false, session: "no session"});
  }
});


// the main page shows the list of notes
// app.get('/', (req, res, next) => {
//   console.log("success getting into the main page!");

//   res.sendFile('index.html');
//   // const results = [];
//   // // Get a Postgres client from the connection pool

//   // // SQL Query > Select Data
//   // const query = client.query('SELECT subject, dateCreated, count FROM note WHERE userAccountKey = $1 ORDER BY noteKey ASC;', [req.body.userKey]);
//   // // Stream results back one row at a time
//   // query.on('row', (row) => {
//   //   results.push(row);
//   // });
//   // // After all data is returned, close connection and return results
//   // query.on('end', () => {
//   //   done();
//   //   return res.json(results);
//   // });

// });

app.post('/create', (req, res, next) => {
  // the router function to create a new one (IT IS NOT EDIT!)
  const results = [];
  // Grab data from http request
  const data = {
    subject: req.body.subject, 
    description: req.body.description,
    dateCreated: new Date(),
    version: 1,
    userAccountKey: req.body.userAccountKey
  };

  // SQL Query > Insert Data
  client.query('INSERT INTO note (subject, description, dateCreated, version, userAccountKey) ' + 
    'values($1, $2, $3, $4, $5)',
  [data.subject, data.description, data.dateCreated, data.version, data.userAccountKey]);
  // get the primary key
  // update the parent key for this record

  // SQL Query > Select Data
  const query = client.query('SELECT subject, dateCreated, count FROM note ORDER BY id');
  // Stream results back one row at a time
  query.on('row', (row) => {
    results.push(row);
  });
  // After all data is returned, close connection and return results
  query.on('end', () => {
    done();
    return res.json(results);
  });
});

app.get('/notes', (req, res, next) => {
  const results = [];
  var userKey = req.body.userKey;
  // Get a Postgres client from the connection pool

  const query = client.query('SELECT * FROM note WHERE userKey = $1 ORDER BY notesKey ASC;');
  // Stream results back one row at a time
  query.on('row', (row) => {
    results.push(row);
  });
  // After all data is returned, close connection and return results
  query.on('end', () => {
    done();
    return res.json(results);
  });
});


app.get('/notes/:noteKey', (req, res, next)=> {
  // the function that gives you the note based on the note key



});


app.put('/notes/:noteKey', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

app.delete('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


var server = app.listen(process.env.PORT || 3001, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


module.exports = app;
