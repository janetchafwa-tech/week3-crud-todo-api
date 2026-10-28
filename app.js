
const express = require('express');

const app = express();

app.use(express.json());

// Starting todo list
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false }
];

// GET All – Read all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
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
app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (typeof task !== 'string' || !task.trim()) {
    return res.status(400).json({
      error: 'Task field is required'
    });
  }

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
});

// PUT – Update a todo
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { task, completed } = req.body;

  if (task !== undefined) {
    if (typeof task !== 'string' || !task.trim()) {
      return res.status(400).json({
        error: 'Task must be a non-empty string'
      });
    }

    todo.task = task.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({
        error: 'Completed must be true or false'
      });
    }

    todo.completed = completed;
  }

  res.status(200).json(todo);
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
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});