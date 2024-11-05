const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const auth = require('../middleware/auth');

router.use(auth);

// Routes
router.get('/posts', socialController.getPosts);
router.post('/posts', socialController.createPost);
router.put('/posts/:id', socialController.updatePost);
router.delete('/posts/:id', socialController.deletePost);

module.exports = router;