const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    department TEXT
  )`);
});

const getUsers = (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

const getUserById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
};

const addUser = (req, res) => {
  const { firstName, lastName, email, department } = req.body;
  db.run(
    'INSERT INTO users (firstName, lastName, email, department) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, department],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, department } = req.body;
  db.run(
    'UPDATE users SET firstName = ?, lastName = ?, email = ?, department = ? WHERE id = ?',
    [firstName, lastName, email, department, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};

module.exports = { getUsers, getUserById, addUser, updateUser, deleteUser };
