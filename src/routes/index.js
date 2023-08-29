import express from 'express'
import users from '../routes/userRoutes.js'

const routes = app => {
  app.route('/').get((req, res) => {
    res.status(200).send({ titulo: 'Curso de node' })
  })

  app.use(express.json(), users)
}

export default routes
