import express from 'express'
import db from './config/dbConnect.js'
import routes from './routes/index.js'
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import bcrypt from 'bcrypt';
// import crypto from 'crypto';

db.on('error', console.log.bind(console, 'Erro de conexão'))
db.once('open', () => {
  // console.log('conexão com o banco feita com sucesso')
})


// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log('Generated Secret Key:', secretKey);

const app = express()
app.use(express.json())
// app.use(passport.session());
routes(app)

// app.use(session({
//   secret: 'f557d5f24b1c3e3fd394625123479a64298e87d4a5c49c93220b3b21802a0e3d80fbcbaffea45a7809584b9449defca1257d18ff7fa97c0d1e363b3a0afd31a5',
//   resave: false,
//   saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Configure local strategy
// passport.use(new LocalStrategy(
//   async (username, password, done) => {
//       try {
//           const user = await User.findOne({ username });

//           if (!user) {
//               return done(null, false, { message: 'Incorrect username.' });
//           }

//           const passwordMatch = await bcrypt.compare(password, user.password);

//           if (!passwordMatch) {
//               return done(null, false, { message: 'Incorrect password.' });
//           }

//           return done(null, user);
//       } catch (error) {
//           return done(error);
//       }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//       const user = await User.findById(id);
//       done(null, user);
//   } catch (error) {
//       done(error);
//   }
// });

// app.use('/auth', authRoutes);

export default app
