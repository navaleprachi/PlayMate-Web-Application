// Importing necessary dependencies and components from MUI and other sources
import './Blog.css';
import { AlertColor, Button, Container, Paper, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import * as blogService from '../../services/blog-service';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from 'react';
import { useLottie } from 'lottie-react';
import readingAnimation from '../../assets/reading.json';

// Main functional component for rendering individual blog details
const Blog = () => {
    // Accessing the selected blog from the Redux store
    const selectedBlog = useSelector((state: any) => state.blog.selectedBlog);
    // Initializing the navigate function from React Router
    const navigate = useNavigate();
    // State variables for handling snackbar messages
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarColor, setSnackBarColor] = useState<AlertColor>("success");
    const [snackBarOpen, setSnackBarOpen] = useState<Boolean>(false);

    // Lottie animation options
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: readingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const { View } = useLottie(lottieOptions);

    // useEffect hook to handle navigation based on snackbar state changes
    useEffect(() => {
        if (snackBarOpen) {
            navigate('/allBlogs', { state: { snackBarMessage, snackBarColor, snackBarOpen } });
        }
    }, [snackBarOpen, snackBarMessage, snackBarColor, navigate]);

    // Handling the case where no blog is selected
    if (!selectedBlog) {
        return null;
    }

    // Function to handle the delete button click and delete the selected blog
    const handleDeleteBtn = async (blogId: any) => {
        try {
            const response = await blogService.deleteBlog(blogId);

            if (Object.keys(response).length === 0) {
                // Handle success, e.g., show a success message
                console.log('Blog Deleted successfully');
                setSnackBarMessage("Blog deleted successfully!");
                setSnackBarColor("success");
                setSnackBarOpen(true);
            } else {
                // Handle errors, e.g., show an error message
                console.error('Failed to delete data');
                setSnackBarMessage("Error deleting blog!");
                setSnackBarColor("error");
                setSnackBarOpen(true);
            }
        } catch (error) {
            console.error('Error during deleting data:', error);
        }
    }

    // Function to handle the back button click and navigate to allBlogs page
    const handleBackBtn = () => {
        navigate('/allBlogs', { state: { snackBarMessage, snackBarColor, snackBarOpen } });
    }

    // Determine whether to hide the delete button based on user ownership
    const hideDeleteBtn = selectedBlog.userId !== localStorage.getItem("userId");

    // JSX structure to render individual blog details
    return (
        <div id="individual-blog-container">
            <Container id="reading-animation">
                {View}
            </Container>
            <Paper elevation={3} id="blog-container" className="blog-paper">
                {/* Conditionally render the delete button based on ownership */}
                <Container id="individual-blog-btn-container">
                    {/* Back button to navigate to the allBlogs page */}
                    <Container id="blogBackBtn-container">
                        <Button
                            id="blogBack-btn"
                            className="button-primary"
                            type="submit"
                            variant="outlined"
                            color="primary"
                            onClick={handleBackBtn}
                            startIcon={<ArrowBackIosNewIcon />}
                        >Back</Button>
                    </Container>
                    {!hideDeleteBtn && <Container id="deleteBtn-container">
                        <Button
                            id="delete-btn"
                            className="button-primary"
                            type="submit"
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteBtn(selectedBlog._id)}
                            endIcon={<DeleteIcon />}
                        >Delete</Button>
                    </Container>}
                </Container>
                {/* Displaying the blog title */}
                <Typography id="selectedBlog-title" variant="h2" gutterBottom>
                    {selectedBlog.title}
                </Typography>
                {/* Displaying metadata such as author and creation date */}
                <Typography id="selectedBlog-metaData" variant="subtitle1" color="textSecondary" paragraph>
                    {selectedBlog.author} - {selectedBlog.createdDate}
                </Typography>
                {/* Displaying the blog content */}
                <Typography variant="body1" paragraph>
                    {selectedBlog.description}
                </Typography>
            </Paper>
        </div>
    )
}

export default Blog;