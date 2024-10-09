import { JoiSchema } from 'nestjs-joi';

import * as Joi from 'joi';

export const CatJoiSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  breed: Joi.string().required(),
});
