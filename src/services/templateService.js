import template from '../models/Template.js'

const templateService = {
    getTemplate: async (type) => {
        console.log(type);
        return new Promise((resolve, reject) => {
            template
              .findOne({ templateType: type })
              .exec((err, template) => {
                // console.log(template);
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

    },
};

export default templateService;
