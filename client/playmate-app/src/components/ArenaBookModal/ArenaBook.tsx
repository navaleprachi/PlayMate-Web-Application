import React, { useRef, FormEvent, useState } from "react";
import {
    Button,
    Typography,
    Modal,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    AlertColor
} from "@mui/material";
import './ArenaBook.css';
import * as arenaBookService from '../../services/arenaBook-service';
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import { DateTime } from 'luxon';

// Define the props for the ArenaBook component
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    arenasData: {
        id: string;
        name: string;
        location: string;
    };
    sportSelected: string;
    citySelected: string;
    onSnackbarOpen: (messageKey: string, severity: AlertColor) => void;
}

// Define the ArenaBook functional component
const ArenaBook: React.FC<ModalProps> = ({ isOpen, onClose, arenasData, sportSelected, citySelected, onSnackbarOpen }) => {

    // Initialize hooks and variables
    const { t } = useTranslation();
    const timeSelectedRef = useRef<HTMLSelectElement>(null);
    const playerCountRef = useRef<HTMLInputElement>(null);
    const dateSelectedRef = useRef<HTMLInputElement>(null);
    const [timeSelected, setTimeSelected] = useState("");
    const [visibility, setVisibility] = useState("public");

    // Function to handle form submission
    const handleSubmitBtn = async (e: FormEvent) => {
        e.preventDefault();
        const playerCountInput = playerCountRef.current ? playerCountRef.current.value : "";
        const dateSelectedInput = dateSelectedRef.current ? dateSelectedRef.current.value : "";

        try {
            await saveEvent(playerCountInput, dateSelectedInput);
            onClose(); // Close the modal after setting values and saving the event
        } catch (error) {
            console.error('Error during form submission:', error);
            // Handle error if needed
        }
    };

    // Function to save the event
    const saveEvent = async (playerCountInput: string, dateSelectedInput: string) => {
        const inputDate = DateTime.fromISO(dateSelectedInput, { zone: 'utc' });

        const saveObj = {
            userId: localStorage.getItem('userId'),
            name: arenasData.name,
            placeId: arenasData.id,
            dateOfBooking: inputDate,
            timeSlot: timeSelected,
            playerCount: playerCountInput,
            sport: sportSelected,
            location: arenasData.location,
            isPrimaryUser: true,
            isPublic: visibility === "public",
            city: citySelected,
            parentEventId: ""
        };
        try {
            const response = await arenaBookService.createEvent(saveObj);
            if (response !== null) {
                // Handle success, e.g., show a success message
                console.log('Data posted successfully');
                onSnackbarOpen("Event created successfully!", "success")
            } else {
                // Handle errors, e.g., show an error message
                console.error('Failed to post data');
                onSnackbarOpen("Error creating event!", "error")
                console.log(saveObj);
            }
        } catch (error) {
            console.error('Error during data posting:', error);
        }
    };

    // Render the component
    return (
        <>
            {isOpen && <div className="modal-overlay" onClick={onClose} />}
            <Modal className="modal" open={isOpen} onClose={onClose}>
                <div className="modal-content">
                    <Card className="form-container" elevation={5}>
                        <span className="close" onClick={onClose}>
                            &times;
                        </span>
                        <CardContent>
                            <Typography
                                id="booking-heading"
                                variant="h5"
                                color="primary"
                            >
                                {t("confirmBooking")}{" "}
                                {/* Use the translation key for the heading */}
                            </Typography>
                            <form onSubmit={handleSubmitBtn} id="booking-form">
                                <div className="form-group">
                                    <Typography variant="body1">
                                        <b>{t("nameLabel")}:</b>&nbsp;{arenasData.name}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <Typography variant="body1">
                                        <b>{t("addressLabel")}:</b>&nbsp;{arenasData.location}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <TextField
                                        required
                                        type="date"
                                        inputRef={dateSelectedRef}
                                        label={t("dateLabel")}
                                        id="event-date"
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                    />
                                </div>
                                <div className="form-group">
                                    <FormControl required>
                                        <InputLabel htmlFor="play-time">
                                            {t("timeLabel")}
                                        </InputLabel>
                                        <Select
                                            ref={timeSelectedRef}
                                            required
                                            label={t("timeLabel")}
                                            id="play-time"
                                            onChange={(e) =>
                                                setTimeSelected(e.target.value as string)
                                            }
                                        >
                                            <MenuItem value="" disabled>
                                                {t("chooseTime")}
                                            </MenuItem>
                                            <MenuItem value="10:00 - 11:00">10:00 - 11:00</MenuItem>
                                            <MenuItem value="11:00 - 12:00">11:00 - 12:00</MenuItem>
                                            <MenuItem value="12:00 - 13:00">12:00 - 13:00</MenuItem>
                                            <MenuItem value="13:00 - 14:00">13:00 - 14:00</MenuItem>
                                            <MenuItem value="14:00 - 15:00">14:00 - 15:00</MenuItem>
                                            <MenuItem value="15:00 - 16:00">15:00 - 16:00</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="form-group">
                                    <TextField
                                        id="player-count-input"
                                        inputRef={playerCountRef}
                                        placeholder={t("playerCountLabel")}
                                        type="number"
                                        label={t("playerCountLabel")}
                                        inputProps={{
                                            min: '0', // Ensure the input cannot be negative
                                            step: '1', // Allow only whole numbers
                                            max: '15'
                                        }}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                            {t("visibilityLabel")}
                                        </FormLabel>
                                        <RadioGroup
                                            aria-label="visibility"
                                            name="visibility"
                                            value={visibility}
                                            onChange={(e) => setVisibility(e.target.value)}
                                            row
                                        >
                                            <FormControlLabel
                                                value="public"
                                                control={<Radio />}
                                                label={t("publicLabel")}
                                            />
                                            <FormControlLabel
                                                value="private"
                                                control={<Radio />}
                                                label={t("privateLabel")}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div className="form-group">
                                    <Button
                                        id="submit-btn"
                                        className="button-primary"
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SendIcon />}
                                    >
                                        {t("submitBtn")}{" "}
                                        {/* Use the translation key for the button label */}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Modal>
        </>
    );
};

export default ArenaBook;