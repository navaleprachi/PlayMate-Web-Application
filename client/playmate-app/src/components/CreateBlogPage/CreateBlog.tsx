import { FormEvent, useEffect, useRef, useState } from 'react';
import './CreateBlog.css';
import {
    AlertColor,
    Button,
    Container,
    Paper,
    TextField,
    TextareaAutosize,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as blogService from '../../services/blog-service';
import { setCreating, setErrorMessage } from '../../store/slices/blogCreate-slice';
import { useDispatch, useSelector } from 'react-redux';
import PublishIcon from '@mui/icons-material/Publish';
import uploadAnimation from '../../assets/Upload.json';
import { useLottie } from "lottie-react";
import { useTranslation } from 'react-i18next';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const CreateBlog = () => {
    // Localization hook
    const { t } = useTranslation();

    // Redux hooks
    const dispatch = useDispatch();
    const isCreating = useSelector((state: any) => state.blogCreate.isCreating);
    const errorMessage = useSelector((state: any) => state.blogCreate.errorMessage);

    // State for snackbar
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarColor, setSnackBarColor] = useState<AlertColor>("success");
    const [snackBarOpen, setSnackBarOpen] = useState<Boolean>(false);

    // Refs for form inputs
    const titleInputRef = useRef<HTMLInputElement>(null);
    const authorInputRef = useRef<HTMLInputElement>(null);
    const contentInputRef = useRef<HTMLTextAreaElement>(null);

    // Lottie animation options
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: uploadAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const { View } = useLottie(lottieOptions);

    const navigate = useNavigate();

    const handleSubmitBtn = async (e: FormEvent) => {
        e.preventDefault();

        dispatch(setCreating(true));

        const titleInput = titleInputRef.current?.value || "";
        const authorInput = authorInputRef.current?.value || "";
        const contentInput = contentInputRef.current?.value || "";

        try {
            await saveBlog(titleInput, authorInput, contentInput);
        } catch (error) {
            console.error('Error during form submission:', error);
            // Handle error if needed
            dispatch(setErrorMessage('Error saving blog!'));
        } finally {
            dispatch(setCreating(false));
        }
    }

    useEffect(() => {
        if (snackBarOpen) {
            // Navigate only if the snackbar is open
            navigate('/allBlogs', { state: { snackBarMessage, snackBarColor, snackBarOpen } });
        }
    }, [snackBarOpen, snackBarMessage, snackBarColor, navigate]);

    const handleCreateBlogBackBtn = () => {
        navigate('/allBlogs', { state: { snackBarMessage, snackBarColor, snackBarOpen } });
    }

    const saveBlog = async (titleInput: string, authorInput: string, contentInput: string) => {
        const saveObj = {
            userId: localStorage.getItem('userId'),
            title: titleInput,
            author: authorInput,
            description: contentInput,
            createdDate: new Date().toLocaleDateString('en-US')
        };

        try {
            const response = await blogService.createBlog(saveObj);

            if (response != null) {
                // Handle success, e.g., show a success message
                console.log('Data posted successfully');
                setSnackBarMessage("Blog created successfully!");
                setSnackBarColor("success");
                setSnackBarOpen(true);
            } else {
                // Handle errors, e.g., show an error message
                console.error('Failed to post data');
                setSnackBarMessage("Error saving blog!");
                setSnackBarColor("error");
                setSnackBarOpen(true);
            }
        } catch (error) {
            console.error('Error during data posting:', error);
        }
    };

    return (
        <div id='createBlog-container'>
            <Container id="animation-container" maxWidth="lg">
                {View}
            </Container>
            <Paper elevation={3} id="blog-form-container" className="blog-paper">
                <Container id="createBlogBackBtn-container">
                    <Button
                        id="createBlogBack-btn"
                        className="button-primary"
                        type="submit"
                        variant="outlined"
                        color="primary"
                        onClick={handleCreateBlogBackBtn}
                        startIcon={<ArrowBackIosNewIcon />}
                    >Back</Button>
                </Container>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                <Typography variant="h3" id="blog-heading" gutterBottom>
                    {t("blogDetailsHeading")}
                </Typography>
                <form onSubmit={handleSubmitBtn} id="blog-form">
                    <div className="form-group">
                        <TextField
                            inputRef={titleInputRef}
                            label={t("titleLabel")}
                            variant="outlined"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <TextField
                            inputRef={authorInputRef}
                            label={t("authorLabel")}
                            variant="outlined"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">{t("contentLabel")}:</label>
                        <TextareaAutosize
                            ref={contentInputRef}
                            placeholder={t("contentPlaceholder")}
                            id="content-input"
                            name="content"
                            minRows={25}
                            required
                        />
                    </div>
                    <div className="form-group btn-middle">
                        <Button
                            id="submit-btn"
                            className="button-primary"
                            type="submit"
                            variant="contained"
                            color='success'
                            disabled={isCreating}
                            endIcon={<PublishIcon />}
                        >
                            {t("publishBtn")}
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
}

export default CreateBlog;