import Blog from '../models/blog.js';

// Method to save a blog
export const saveBlog = async (newBlog) => {
    const blog = new Blog(newBlog);
    return await blog.save();
}

// Method to fetch all the existing blogs
export const getAllBlogs = async () => {
    const blogs = await Blog.find().exec();
    // Use toObject to trigger the getter for createdDate
    const formattedBlogs = blogs.map(blog => blog.toObject({ getters: true }));
    return formattedBlogs;
}
//method to delete a blog post
export const deleteBlog = async (blogId) => {
    return await Blog.findByIdAndDelete(blogId).exec();
}
//method to update a blog post
export const updateBlog = async (blogId, updatedBlog) => {
    const blog = await Blog.findByIdAndUpdate(blogId, updatedBlog, { new: true }).exec();
    return blog;
}