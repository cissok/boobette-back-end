const express = require('express');
const { addCourse, updateCourse, deleteCourse, getCourses, getCourseById } = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add-course', verifyToken, checkRole, addCourse);
router.put('/update-course/:id', verifyToken, checkRole, updateCourse);
router.delete('/delete-course/:id', verifyToken, checkRole, deleteCourse);
router.get('/courses', verifyToken, getCourses);
router.get('/courses/:id', verifyToken, getCourseById);

module.exports = router;
