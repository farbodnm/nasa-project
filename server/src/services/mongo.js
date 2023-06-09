const mongoose = require('mongoose');

const MONGO_URL =
  'mongodb+srv://nasa-api:3mXY1tzhZfmnsMt9@cluster0.nyla5lz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready.');
});
mongoose.connection.on('error', (err) => {
  console.log(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
