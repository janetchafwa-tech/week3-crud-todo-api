
const express = require('express');
const logger = require('./logger');
const validateTodo = require('./validator');

const app = express();

app.use(logger);
app.use(express.json());

// Starting todo list
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false }
];

// GET All – Read all todos

app.get('/todos', async (req, res, next) => {
    try {
    res.status(200).json(todos);    
    } catch (error) {
        next(error);
    }
});


// GET Active – Bonus: read unfinished todos
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  res.status(200).json(activeTodos);
});

// GET Single – Read one todo
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(200).json(todo);
});

// POST – Create a todo with validation

app.post('/todos', validateTodo, async (req, res, next) => {
    try {
        const { task } = req.body;

        const newId = todos.length
            ? Math.max(...todos.map(todo => todo.id)) + 1
            : 1;

        const newTodo = {
            id: newId,
            task: task.trim(),
            completed: false
        };

        todos.push(newTodo);

        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
});


// DELETE – Remove a todo
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = todos.length;

  todos = todos.filter(todo => todo.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(204).send();
});

// Error handler

app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.message);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});


const PORT = process.env.PORT || 3002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});