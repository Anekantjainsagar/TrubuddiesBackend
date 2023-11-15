const { check, validationResult } = require("express-validator");

exports.validateSignUp = [
  check("password")
    ?.trim()
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 15 })
    .withMessage("Password must be in 8 to 15 characters"),
  // check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
];

exports.userValidationResult = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.status(202).json({ success: false, data: error });
};
