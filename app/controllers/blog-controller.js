import * as blogService from '../services/blog-service.js';
import { setResponse, setErrorResponse } from './response-handler.js';

// Controller to save new blogs
export const saveNewBlog = async (request, response) => {
    try {
        const newBlog = { ...request.body }; // Taking in the request body
        const blog = await blogService.saveBlog(newBlog); // Saving the request body received
        setResponse(blog, response); // Setting the response
    } catch (err) {
        setErrorResponse(err, response); // If error occurs set the error details
    }
}

// Controller to fetch all blogs
export const findAllBlogs = async (request, response) => {
    try {
        const blogs = await blogService.getAllBlogs(); // Calling the service to fetch all blogs
        setResponse(blogs, response); // Setting the response
    } catch (err) {
        setErrorResponse(err, response); // If error occurs set the error details
    }
}

// Controller to delete a blog post 
export const deleteBlog = async (request, response) => {
    try {
        const blogId = request.params["blogId"];
        await blogService.deleteBlog(blogId);
        setResponse({}, response);
    } catch (error) {
        setErrorResponse(error, response);
    }
}


//Controller to update a blog post
export const updateBlog = async (request, response) => {

    try {
        const updatedBlog = { ...request.body }; // Taking in the request body
        const event = await blogService.updateBlog(request.params["blogID"], updatedBlog); // Update the existing blog with the updated details received
        setResponse(event, response); // Setting the response
    } catch (err) {
        setErrorResponse(err, response); // If error occurs set the error details
    }
}


