// Import necessary modules and components from third-party libraries and your project
import { useEffect, useState } from 'react';
import { Button, Card, CardContent, Snackbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBlogs, setSelectedBlog } from '../../store/slices/blog-slice';
import "./AllBlogs.css";
import * as blogService from '../../services/blog-service';
import CreateIcon from '@mui/icons-material/Create';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useTranslation } from 'react-i18next';
import Navbar from '../NavBar/NavBar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

// Define the AllBlogs functional component
const AllBlogs: React.FC = () => {
    // Initialize necessary hooks and variables
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const blogsData = useSelector((state: any) => state.blog.blogs);

    // Extract snackbar information from the location state
    const snackBarMessage = location.state?.snackBarMessage;
    const snackBarColor = location.state?.snackBarColor;
    const snackBarOpen = location.state?.snackBarOpen;

    // Initialize state for the Snackbar component
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    // Function to show a Snackbar with a given message and severity
    const showSnackBar = (messageKey: string, severity: AlertColor) => {
        setSnackbarMessage(messageKey);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }

    // Function to handle Snackbar close event
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    // Function to fetch blogs from an API
    const fetchBlogs = async () => {
        const response = await blogService.fetchBlogs();
        dispatch(setBlogs(response));
    };

    // useEffect hook to fetch blogs on component mount
    useEffect(() => {
        fetchBlogs();
    }, []);

    // useEffect hook to show Snackbar when it is open
    useEffect(() => {
        if (snackBarOpen) {
            showSnackBar(snackBarMessage, snackBarColor);
        }
    }, [snackBarOpen]);

    // Function to handle "Read More" button click
    const handleReadMoreBtnClick = (blogData: any) => {
        dispatch(setSelectedBlog(blogData))
        navigate('/blog');
    };

    // Function to navigate to the create blog page
    const handleCreateBlogBtnClick = () => {
        navigate('/createBlog');
    };

    // Function to limit the number of words in a paragraph
    function limitWords(classNameString: string, limit: number): void {
        const paragraphs = document.getElementsByClassName(classNameString);

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i] as HTMLElement;

            const words = paragraph.textContent?.split(' ') || [];
            const limitedWords = words.slice(0, limit).join(' ');

            paragraph.textContent = words.length > limit ? `${limitedWords}...` : limitedWords;
        }
    }

    // Call the function with the paragraph ID and the desired word limit
    limitWords('content-para', 20);

    // Map blogs data to Card components
    const blogsGrid = blogsData.map((c: any, index: any) => (
        <Card key={index} id="blog-card">
            <CardContent>
                <Typography id='blog-title' variant="h5" component="div">
                    {c["title"]}
                </Typography>
                <Typography id='blog-metaData' color="text.secondary">
                    {c["author"]} - {c["createdDate"]}
                </Typography>
                <Typography className="content-para" variant="body2" paragraph>
                    {c["description"]}
                </Typography>
                <Button id='readMore-btn' onClick={() => handleReadMoreBtnClick(c)} variant="contained" endIcon={<ReadMoreIcon />}>
                    {t("readMoreBtnLabel")}
                </Button>
            </CardContent>
        </Card>
    ));

    // Render the component
    return (
        <div id="all-blog-container">
            <Navbar />
            <div id="create-blog-container">
                <Button onClick={handleCreateBlogBtnClick} variant="contained" endIcon={<CreateIcon />}>{t("createBlogBtnLabel")}</Button>
            </div>
            <div id="blog-grid">{blogsGrid}</div>
            {/* Snackbar component for displaying messages */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', maxWidth: '600px' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

// Export the component as the default export
export default AllBlogs;