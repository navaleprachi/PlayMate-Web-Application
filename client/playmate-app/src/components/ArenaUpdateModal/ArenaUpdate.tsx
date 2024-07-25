import React, { useRef, FormEvent, useState, useEffect } from "react";
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
import './ArenaUpdate.css';
import * as arenaBookService from '../../services/arenaBook-service';
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";

interface UpdateModalProps {
    isOpen: boolean;
    onClose: (evtData: any) => void;
    selectedEvent: any;
    onSnackbarOpen: (messageKey: string, severity: AlertColor) => void;
}

const ArenaUpdate: React.FC<UpdateModalProps> = ({ isOpen, onClose, selectedEvent, onSnackbarOpen }) => {

    // Localization hook
    const { t } = useTranslation();

    // Refs for form inputs
    const timeSelectedRef = useRef<HTMLSelectElement>(null);
    const dateSelectedRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (Object.keys(selectedEvent).length !== 0) {
            // Update the state when the selectedEvent changes
            setTimeSelected(selectedEvent.timeSlot);
            setDateSelected(formatDate(selectedEvent.dateOfBooking));
        }
    }, [selectedEvent]);

    const formatDate = (dateStr: string | null) => {

        if (!dateStr) {
            return ''; // Handle the case where dateStr is null or undefined
        }

        const date = new Date(dateStr);
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    };

    // State for form values
    const [timeSelected, setTimeSelected] = useState(() => selectedEvent.timeSlot);
    const [dateSelected, setDateSelected] = useState(() => formatDate(selectedEvent.dateOfBooking));

    // Handle form submission
    const handleSubmitBtn = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await updateEvent();
            onClose({}); // Close the modal after setting values and updating the event
        } catch (error) {
            console.error('Error during form submission:', error);
            // Handle error if needed
        }
    };

    // Update event in the database
    const updateEvent = async () => {
        const updateObj = {
            dateOfBooking: DateTime.fromISO(dateSelected, { zone: 'utc' }),
            timeSlot: timeSelected
        };
        try {
            const response = await arenaBookService.updateMultipleEvents(updateObj, selectedEvent._id);
            if (response !== null) {
                // Handle success, e.g., show a success message
                console.log('Data updated successfully');
                onSnackbarOpen("Event updated successfully!", "success");
            } else {
                // Handle errors, e.g., show an error message
                console.error('Failed to update data');
                onSnackbarOpen("Error updating event!", "error");
                console.log(updateObj);
            }
        } catch (error) {
            console.error('Error during updating event:', error);
        }
    };

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
                                {t("editBooking")}{" "}
                            </Typography>
                            <form onSubmit={handleSubmitBtn} id="booking-form">
                                {/* Form groups for displaying event information */}
                                <div className="form-group">
                                    <Typography variant="body1">
                                        <b>{t("nameLabel")}:</b>&nbsp;{selectedEvent.name}
                                    </Typography>
                                </div>
                                <div className="form-group">
                                    <Typography variant="body1">
                                        <b>{t("addressLabel")}:</b>&nbsp;{selectedEvent.location}
                                    </Typography>
                                </div>
                                {/* Form group for updating event date */}
                                <div className="form-group">
                                    <TextField
                                        required
                                        type="date"
                                        inputRef={dateSelectedRef}
                                        label={t("dateLabel")}
                                        id="event-date"
                                        value={dateSelected || ""}
                                        onChange={(e) =>
                                            setDateSelected(e.target.value as string)
                                        }
                                        InputLabelProps={{ shrink: true }}
                                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                    />
                                </div>
                                {/* Form group for updating event time */}
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
                                            value={timeSelected || ""}
                                            onChange={(e) =>
                                                setTimeSelected(e.target.value as string)
                                            }
                                        >
                                            {/* Time slot options */}
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
                                {/* Form group for the submit button */}
                                <div className="form-group">
                                    <Button
                                        id="submit-btn"
                                        className="button-primary"
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SendIcon />}
                                    >
                                        {t("submitBtn")}{" "}
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

export default ArenaUpdate;