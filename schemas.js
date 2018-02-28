const Joi = require('joi')
module.exports = {
  payload: Joi.object().keys({
    ext: Joi.string()
            .description('tipo de recurso'),
    file: Joi
            .any()
            .meta({ swaggerType: 'file' })
            .description('image to be uploaded')
  })
}
