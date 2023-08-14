/****************************
 File    : server.js
 Date    : 09-06-2021
 Purpose : Server js 
 * ********************** */
const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');

const mountRoutes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bodyParser= require('body-parser')


const app = express();


// cors
app.use(cors());
var options = {
  swaggerOptions: {
    url: 'http://petstore.swagger.io/v2/swagger.json'
  }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
dotEnv.config();
// request payload middleware
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(express.urlencoded({limit: '50mb',  extended: true }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));
mountRoutes(app)

process.env.TZ = 'Asia/Calcutta';

app.get('/', (req, res, next) => {
  res.send('Hello from Node API Server');
}); 


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// error handler middleware
app.use(function (err, req, res, next) {
  res.status(500).send({
    status: 500,
    message: err.message,
    body: {}
  });
})


