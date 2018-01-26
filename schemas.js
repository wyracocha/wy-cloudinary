const Joi = require('joi')
module.exports = {
  payload: Joi.object().keys({
    folder: Joi.string().description('the folder'),
    tags: Joi.string().description('array list in string format: a,b,c'),
    resource_type: Joi
                    .string()
                    .allow(['image', 'raw', 'video', 'auto'])
                    .default('image')
                    .description('tipo de recurso'),
    file: Joi
            .any()
            .meta({ swaggerType: 'file' })
            .description('image to be uploaded')
  }).optionalKeys(['folder', 'tags', 'resource_type'])
}
