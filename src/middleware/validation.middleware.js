import Joi from 'joi';

const shortenSchema = Joi.object({
  url: Joi.string().uri().required().max(2048),
  customAlias: Joi.string().alphanum().min(3).max(20).optional(),
  expiresIn: Joi.number().integer().min(1).max(365).optional(), // days
});

export const validateShortenRequest = (req, res, next) => {
  const { error } = shortenSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
