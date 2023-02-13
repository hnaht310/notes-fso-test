const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

// app.use(morgan(':method :url :status :res[content-length - :response-time ms'));
// app.use(morgan('tiny'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let contacts = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/contacts', (req, res) => {
  res.send(contacts);
});

app.get('/api/contacts/:id', (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.get('/info', (req, res) => {
  const numOfContacts = contacts.length;
  const date = new Date();
  res.send(`Phonebook has info for ${numOfContacts} people <br/> ${date}`);
});

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

app.post('/api/contacts', (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.number) {
    return res.status(404).json({ error: 'content missing' });
  }

  if (contacts.find((contact) => contact.name === body.name)) {
    return res
      .status(404)
      .json({ error: 'name already exists in the phonebook' });
  }

  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  contacts = [...contacts, contact];

  res.json(contact);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
