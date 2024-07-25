import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Snackbar,
} from "@mui/material";
import "./ArenaSearch.css";
import ArenaBook from "../ArenaBookModal/ArenaBook";
import * as arenaSearchService from "../../services/arenaSearch-service";
import { setArenas } from "../../store/slices/arenaSearch-slice";
import { useDispatch } from "react-redux";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../NavBar/NavBar";
import MuiAlert, { AlertColor } from '@mui/material/Alert';

// Define the ArenaSearch functional component
const ArenaSearch = () => {

    // Initialize hooks and variables
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const sportSearched = location.state.sportSearched;
    const citySearched = location.state.citySearched;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedArenaData, setClickedArenaData] = useState({
        id: "",
        name: "",
        location: "",
        rating: 0.0,
    });
    const [loading, setLoading] = useState(false);
    const [arenaCards, setArenaCards] = useState<React.ReactNode[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    // Function to toggle the modal and set clicked arena data
    const toggleModal = (arenaObj: any) => {
        setIsModalOpen(!isModalOpen);
        setClickedArenaData(arenaObj);
    };

    // Function to show a snackbar with a message and severity
    const showSnackbar = (messageKey: string, severity: AlertColor) => {
        setSnackbarMessage(messageKey);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }

    // Function to close the snackbar
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    // Effect to fetch arenas when sport and city are provided
    useEffect(() => {
        if (sportSearched !== "" && citySearched !== "") {
            fetchArenas();
        }
    }, [sportSearched, citySearched]);

    // Function to fetch arenas and render arena cards
    const fetchArenas = async () => {
        try {
            setLoading(true);
            const arenas = await arenaSearchService.fetchArenas(sportSearched, citySearched);
            dispatch(setArenas(arenas));
            const cards = await Promise.all(arenas.map(renderArenaCard));
            setArenaCards(cards);
        } catch (error) {
            console.error("Error fetching arenas:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to render an individual arena card
    const renderArenaCard = async (arena: any, index: any) => {
        const { default: imagePath } = await import(`../../assets/play${index + 1}.jpg`);

        return (
            <Card key={arena["id"]} id="arena-card">
                <CardContent>
                    <div id="courtImage-container">
                        <img src={imagePath} alt="Court Placeholder" className="arena-image" />
                    </div>
                    <Typography className="arena-name" variant="h6">
                        {arena["name"]}
                    </Typography>
                    <Typography className="arena-location" variant="body2" color="textSecondary">
                        {arena["location"]}
                    </Typography>
                    <Button
                        onClick={() => toggleModal(arena)}
                        variant="contained"
                        endIcon={<AddTaskIcon />}
                    >
                        {t("bookButton")}
                    </Button>
                </CardContent>
            </Card>
        );
    };

    // Render the component
    return (
        <div id="arenas-container">
            <Navbar />
            <div id="book-prompt">
                <Typography variant="h2">{t("bookPrompt")}</Typography>
            </div>
            {loading ? (
                <div id="loading-container">
                    <CircularProgress />
                </div>
            ) : null}
            {sportSearched && citySearched && <div id="arena-grid">{arenaCards}</div>}
            <ArenaBook
                isOpen={isModalOpen}
                onClose={() => toggleModal({})}
                arenasData={clickedArenaData}
                sportSelected={sportSearched}
                citySelected={citySearched}
                onSnackbarOpen={showSnackbar}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', maxWidth: '600px' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default ArenaSearch;