import express from 'express'
import usersController from '../controllers/usersController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';
// import { getUserProfile } from '../controllers/userController';
const router = express.Router()

router
  // .get('/users', usersController.listarLivros)
  // .get('/users/busca', usersController.listarLivroPorEditora)
  // .get('/users/:id', usersController.listarLivroPorID)
  .post('/signup', usersController.signUp)
  .post('/signup/:code', usersController.signUpWithReferalCode)
  .post('/login', usersController.login)
  .put('/approve/:id', usersController.approveUser)
  // .delete('/users/:id', usersController.excluirLivro)
  .get('/profile', isAuthenticated, usersController.getUserProfile);
export default router