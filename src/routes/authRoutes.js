// routes/authRoutes.js
import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

router
  // .get('/users', usersController.listarLivros)
  // .get('/users/busca', usersController.listarLivroPorEditora)
  // .get('/users/:id', usersController.listarLivroPorID)
  .post('/register', authController.register)
  .post('/login',authController.login);
export default router
