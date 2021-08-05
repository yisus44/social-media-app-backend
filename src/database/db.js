const mongoose = require('mongoose');

async function startDB() {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB up and running!');
  } catch (error) {
    console.log('Something went wrong connecting to database');
    console.log(error);
  }
}

module.exports = { startDB };
