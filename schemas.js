const Joi = require('joi')
module.exports = {
  payload: Joi.object().keys({
    folder: Joi.string(),
    tags: Joi.string(),
    resource_type: Joi.string().allow(['image', 'raw', 'video', 'auto']).default('image'),
    file: Joi.string().required()
  }).optionalKeys(['folder' ,'tags', 'resource_type'])
}