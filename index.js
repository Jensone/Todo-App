// Import d'Express
const express = require('express');

// Import de fs
const fs = require('fs');

// Import de body-parser
const bodyParser = require('body-parser');

// Import de json-server
const jsonServer = require('json-server');

// Le Middleware json-server
const jsm = jsonServer.router('db.json');

// On lance le serveur express
const app = express();

// ------------------ APP USE AND SET ------------------ //

app.use(bodyParser.urlencoded({ extended: false })); 

app.use(bodyParser.json()); 

app.use('/api', jsm); 

app.set('view engine', 'ejs');

// ------------------ ROUTES ------------------ //
app.get('/', (req, res) => {
    res.redirect('/tasks')
})

app.get('/tasks', (req, res) => {
    const tasks = JSON.parse(fs.readFileSync('db.json')).tasks
    let message = ''
    res.render('tasks', { tasks, message })
})

app.post('/tasks/create', (req, res) => {
    const tasks = JSON.parse(fs.readFileSync('db.json')).tasks;
    const newTask = { 
        id: Date.now(), 
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    };
    tasks.push(newTask);
    fs.writeFileSync('db.json', JSON.stringify({ tasks }));
    // let message = 'La tâche a bien été ajoutée';
    res.redirect('/tasks');
});

app.get('/tasks/delete/:id', (req, res) => {
    const tasks = JSON.parse(fs.readFileSync('db.json')).tasks; 
    const newTasks = tasks.filter(task => task.id !== parseInt(req.params.id)); 
    fs.writeFileSync('db.json', JSON.stringify({ tasks: newTasks }));
    // let message = 'La tâche a bien été supprimée';
    res.redirect('/tasks');
});





// Je suis le dernier de la liste !
app.listen(3000, () => console.log('Le serveur est lancé sur le port 3000'));