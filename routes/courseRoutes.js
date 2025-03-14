const express = require('express');
const { addCourse } = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add-course', verifyToken, checkRole, addCourse);

module.exports = router;
