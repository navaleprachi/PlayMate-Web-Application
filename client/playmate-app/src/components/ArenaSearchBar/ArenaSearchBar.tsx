// Import necessary React components, styles, and assets
import React, { useEffect, useState, useRef } from "react";
import {
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import './ArenaSearchBar.css'; // Import the stylesheet for the ArenaSearchBar
import basketballAnimation from '../../assets/Basketball.json';
import tennisAnimation from '../../assets/Tennis.json';
import { useLottie } from "lottie-react";
import { useTranslation } from "react-i18next";
import Navbar from "../NavBar/NavBar";

// Define the ArenaSearchBar functional component
const ArenaSearchBar = () => {

    // Initialize hooks and variables
    const { t } = useTranslation();
    const basketballOptions = {
        loop: true,
        autoplay: true,
        animationData: basketballAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const tennisOptions = {
        loop: true,
        autoplay: true,
        animationData: tennisAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const { View: basketballView } = useLottie(basketballOptions);
    const { View: tennisView } = useLottie(tennisOptions);
    const navigate = useNavigate();
    const [sportSearched, setSportSearched] = useState("");
    const [citySearched, setCitySearched] = useState("");

    // Effect to navigate when both sport and city are selected
    useEffect(() => {
        if (sportSearched !== "" && citySearched !== "") {
            navigate('/arenas', { state: { sportSearched: sportSearched, citySearched: citySearched } });
        }
    }, [sportSearched, citySearched]);

    // Render the component
    return (
        <div>
            <Navbar />
            <div id="arenaSearch-container">
                {/* Basketball animation */}
                <Container id="basketball-container">{basketballView}</Container>
                {/* Tennis animation */}
                <Container id="tennis-container">{tennisView}</Container>
                {/* Search bar container */}
                <div id="search-bar-container">
                    <div id="search-bar">
                        {/* Select prompt */}
                        <div id="select-prompt">
                            <Typography variant="h6">{t("selectPrompt")}</Typography>
                        </div>
                        {/* Location selection */}
                        <FormControl id="play-location-form" variant="outlined" required>
                            <InputLabel htmlFor="play-location">
                                {t("chooseLocation")}
                            </InputLabel>
                            <Select
                                label={t("chooseLocation")}
                                value={citySearched || ""}
                                onChange={(e) => setCitySearched(e.target.value as string)}
                                name="location"
                                id="play-location"
                                className="search-item"
                            >
                                {/* Location options */}
                                <MenuItem value="default" disabled>
                                    {t("chooseLocation")}
                                </MenuItem>
                                <MenuItem value="Boston">{t("boston")}</MenuItem>
                                <MenuItem value="New York">{t("newYork")}</MenuItem>
                                <MenuItem value="San Francisco">{t("sanFrancisco")}</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Sport selection */}
                        <FormControl variant="outlined" required>
                            <InputLabel htmlFor="sport-name">{t("chooseSport")}</InputLabel>
                            <Select
                                label={t("chooseSport")}
                                value={sportSearched || ""}
                                onChange={(e) => setSportSearched(e.target.value as string)}
                                name="sport"
                                id="sport-name"
                                className="search-item"
                            >
                                {/* Sport options */}
                                <MenuItem value="default" disabled>
                                    {t("chooseSport")}
                                </MenuItem>
                                <MenuItem value="Badminton">{t("badminton")}</MenuItem>
                                <MenuItem value="Basketball">{t("basketball")}</MenuItem>
                                <MenuItem value="Tennis">{t("tennis")}</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export the ArenaSearchBar component
export default ArenaSearchBar;