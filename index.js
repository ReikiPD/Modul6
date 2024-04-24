const dotenv = require("dotenv").config();
const express = require("express");
const port = 2939;
const app = express();
const bodyParser = require('body-parser');
const eventRepo = require('./repositories/repository.event');

app.use(bodyParser.json());

app.post('/events', eventRepo.addEvent);
app.get('/events', eventRepo.getAllEvents);
app.put('/events/:id', eventRepo.updateEvent);
app.delete('/events/:id', eventRepo.updateEvent);

app.post('/events/bulk', eventRepo.addRecord);
app.get('/events/country', eventRepo.getCountry);
app.get('/events/paginate', eventRepo.getPaginate);

app.listen(port, () => {
    console.log("Server is running and listening on port", port);
});