import express from 'express'
import db from './config/dbConnect.js'
import routes from './routes/index.js'
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/User.js';
import authRoutes from './routes/authRoutes.js';
import bcrypt from 'bcrypt';

db.on('error', console.log.bind(console, 'Erro de conexão'))
db.once('open', () => {
  // console.log('open')
})


const app = express()
app.use(express.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
routes(app)

// Configure local strategy
passport.use(new LocalStrategy(
  async (username, password, done) => {
      try {
          const user = await User.findOne({ username });

          if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
              return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
      } catch (error) {
          return done(error);
      }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (error) {
      done(error);
  }
});

app.use('/auth', authRoutes);

export default app
