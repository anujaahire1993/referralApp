import express from 'express'
import templateController from '../controllers/templateController.js'
import validationMiddleware from '../middlewares/validationMiddleware.js';

const router = express.Router()

router
  .get('/template/:type', templateController.getTemplate)
  .post('/template', validationMiddleware.validateTemplate, templateController.createTemplate);
export default router