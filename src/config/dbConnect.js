import mongoose from 'mongoose'
mongoose.set('strictQuery', true);
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'referaldb';
mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    // Perform database operations here
    //  app.listen(3001, ()=> {
    //     console.log(`Node API app is running on port 3001`)
    //   });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });



// mongoose.connect(
//   'mongodb+srv://aula:aula@cluster0.y53x8v3.mongodb.net/alura-node'
// )

let db = mongoose.connection

export default db
