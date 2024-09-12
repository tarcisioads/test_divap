const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
const port = 3099;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define User model
class Alert extends Model {}
Alert.init({
  content: DataTypes.STRING,
  readed: DataTypes.BOOLEAN
}, { sequelize, modelName: 'alert' });

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CRUD routes for User model
app.get('/alert', async (req, res) => {
  const alerts = await Alert.findAll();
  res.json(alerts);
});

app.post('/alert', async (req, res) => {
  const alert = await Alert.create(req.body);
  res.json(alert);
});

app.put('/alert/:id', async (req, res) => {
  const alert = await Alert.findByPk(req.params.id);
  if (alert) {
    await alert.update(req.body);
    res.json(alert);
  } else {
    res.status(404).json({ message: 'Alert not found' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

