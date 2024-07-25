import express from "express";

import * as blogController from '../controllers/blog-controller.js';

const router = express.Router();

// Routes for saving and fetching the blogs
router.route('/')
    .post(blogController.saveNewBlog)
    .get(blogController.findAllBlogs);

router.route('/:blogId')
    .put(blogController.updateBlog)
    .delete(blogController.deleteBlog);
export default router;