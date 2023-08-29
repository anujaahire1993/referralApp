import express from 'express'
import usersController from '../controllers/usersController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router()

router
  .get('/profile/:id', usersController.getProfile)
  .post('/signup', usersController.signUp)
  .post('/signup/:code', usersController.signUpWithReferalCode)
  .post('/login', usersController.login)
  .put('/approve/:id', usersController.approveUser)
  .get('/profile', isAuthenticated, usersController.getUserProfile);
export default router