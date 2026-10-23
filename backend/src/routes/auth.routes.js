const { Router } = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const { loginLimiter, registroLimiter } = require('../middlewares/rateLimit');
const { registroRules, loginRules } = require('../validators/auth.validator');
const auth = require('../controllers/auth.controller');

const router = Router();

router.post('/register', registroLimiter, registroRules, validate, asyncHandler(auth.registrar));
router.post('/login', loginLimiter, loginRules, validate, asyncHandler(auth.login));
router.get('/me', requireAuth, asyncHandler(auth.yo));

module.exports = router;
