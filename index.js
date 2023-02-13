// EXPRESS
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express(); // create an Express application

app.use(cors()); // use middleware to allow for requests from all origins.
// the backend server is in localhost port 3001 while our frontend is in localhost port 3000 => they do not have the same origin (protocol, host, port)=> will get an error
// to allow requests from other origins by using Node's cors middleware (CROSS-ORIGIN RESOURCE)

// use json-parse in express
app.use(express.json());

// to make Express show static content, the page index.html and the JS, etc it fetches, we need an Express middleware called static
app.use(express.static('build'));

// since it’s a middleware, So we used the .use() method to tell express to use that as a middleware in our app. => SERVE STATIC files from the backend
app.use(
  // morgan('tiny')
  //morgan reads presets like tiny in a format string defined below:
  morgan(':method :url :status :res[content-length] - :response-time ms')
);

// morgan.token('host', function (req, res) {
//   return req.hostname;
// });

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

// Next, we define two routes to the application. The first one defines an event handler that is used to handle HTTP GET requests made to the application's / root:
//The event handler function accepts two parameters. The first request parameter contains all of the information of the HTTP request, and the second response parameter is used to define how the request is responded to.

// const requestLogger = (req, res, next) => {
//   console.log('Method:', req.method);
//   console.log('Path:', req.path);
//   console.log('Body: ', req.body);
//   console.log('----');
//   next();
// };

// app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes); // if we only used Node, we had to transform data in to JSON format using JSON.stringify. With Express, the transformation happens automatically
});

app.get('/api/notes/:id', (request, response) => {
  console.log(request.params);
  const id = request.params.id;
  console.log(id);
  const note = notes.find((note) => note.id === parseInt(id));
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

// without the parser, the body property would be undefined
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//-------------------------------

// USE HTTP module instead of Express => CUMBERSOME
// const http = require('http');

// let notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true,
//   },
//   {
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false,
//   },
//   {
//     id: 3,
//     content: 'GET and POST are the most important methods of HTTP protocol',
//     important: true,
//   },
// ];

// // use createServer method of the http module to create a new web server
// // an event handler is registered to the server that is called every time an HTTP request is made to the server's address
// //The request is responded with the status code 200, with the Content-Type header set to application/json, and the content of the site to be returned is notes array that gets transformed into JSON.
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-type': 'application/json' });
//   response.end(JSON.stringify(notes));
// });

// // bind the http server assigned to the app variable, to listen to HTTP requests sent to port 3001
// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on PORT ${PORT}`);
