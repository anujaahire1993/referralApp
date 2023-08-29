import mongoose from 'mongoose'
mongoose.set('strictQuery', true);
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'referaldb';
mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

let db = mongoose.connection

export default db
