import template from '../models/Template.js'
// import passport from 'passport';
// import 'dotenv/config';

class templateController {
  static getTemplate = (type) => {
    return new Promise((resolve, reject) => {
      template
        .findOne({ templateType: type })
        .exec((err, template) => {
          if (err) {
            reject(`${err.message} - Invalid template type.`);
          } else {
            if (!template) {
              reject('Template not found for the provided type.');
            } else {
              resolve(template);
            }
          }
        });
    });
  }


  static createTemplate = async (req, res) => {
    let templates = new template(req.body);
    // const templateRes = await templates.save();
    // console.log(templateRes);
    templates.save((err) => {
      if (err) {
        res.status(500).send({ message: err.message });
      } else {
        res.status(201).send(templates.toJSON());
      }
    });
  }



}

export default templateController