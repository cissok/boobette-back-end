const express = require('express');
const { updateProfile } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/profile', verifyToken, updateProfile);

module.exports = router;