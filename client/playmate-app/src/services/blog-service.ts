import * as baseService from './base-service';

// API endpoint path for blogs
const blogsPath = "/blogs";

/**
 * Fetches all blogs.
 * @returns Promise containing the fetched blogs.
 */
export const fetchBlogs = async (): Promise<any> => {
    // Use the base service to make a GET request to fetch all blogs
    const blogs = await baseService.get<any>(blogsPath);
    
    // Return the fetched blogs
    return blogs;
}

/**
 * Creates a new blog.
 * @param blogData - The data for creating the new blog.
 * @returns Promise containing the created blog.
 */
export const createBlog = async (blogData: any): Promise<any> => {
    // Use the base service to make a POST request to create a new blog
    const blog = await baseService.post<any>(blogsPath, blogData);
    
    // Return the created blog
    return blog;
}

/**
 * Deletes a blog based on the specified blog ID.
 * @param blogId - The ID of the blog to be deleted.
 * @returns Promise containing the deleted blog.
 */
export const deleteBlog = async (blogId: any): Promise<any> => {
    // Construct the URL for deleting a blog based on the specified blog ID
    const requestURL = `${blogsPath}/${blogId}`;
    
    // Use the base service to make a DELETE request to delete the blog
    const blog = await baseService.deleteRequest<any>(requestURL);
    
    // Return the deleted blog
    return blog;
}