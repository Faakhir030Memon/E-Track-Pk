const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors from express-validator
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for checking user score
 */
const validateCheckUser = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isString().withMessage('Phone must be a string')
    .matches(/^(\+?92|0)?3\d{9}$/).withMessage('Invalid Pakistani phone number format'),
  handleValidation,
];

/**
 * Validation rules for reporting order status
 */
const validateReportOrder = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^(\+?92|0)?3\d{9}$/).withMessage('Invalid Pakistani phone number format'),
  body('orderId')
    .notEmpty().withMessage('Order ID is required')
    .isString().withMessage('Order ID must be a string'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['delivered', 'returned', 'cancelled', 'refused', 'no_pick_up', 'fake_address', 'partial'])
    .withMessage('Invalid status value'),
  body('orderValue')
    .optional()
    .isNumeric().withMessage('Order value must be a number'),
  body('address')
    .optional()
    .isString().withMessage('Address must be a string'),
  body('reason')
    .optional()
    .isString().withMessage('Reason must be a string'),
  handleValidation,
];

/**
 * Validation rules for store registration
 */
const validateRegister = [
  body('storeName')
    .notEmpty().withMessage('Store name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Store name must be 2-100 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('platform')
    .optional()
    .isIn(['shopify', 'woocommerce', 'custom', 'instagram', 'facebook', 'daraz', 'other'])
    .withMessage('Invalid platform'),
  handleValidation,
];

/**
 * Validation rules for store login
 */
const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidation,
];

module.exports = {
  validateCheckUser,
  validateReportOrder,
  validateRegister,
  validateLogin,
};
