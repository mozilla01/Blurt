const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const catchAsync = require("../utils/catchAsync");
const postCRUD = require("../controllers/postCRUD");

// Create post
router.post("/social-media/create-post", catchAsync(postCRUD.createPost));

// Edit post
router.post("/social-media/edit-post", catchAsync(postCRUD.editPost));

// Delete post
router.post("/social-media/delete-post", catchAsync(postCRUD.deletePost));

module.exports = router;
