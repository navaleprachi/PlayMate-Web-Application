import React, { ReactElement, useEffect, useState } from 'react';
// import * as prodfileServices from '../../services/personalizedProfile-service';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { styled } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { HowToRegOutlined} from "@mui/icons-material";
import {
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  Box,
  Snackbar,
  CssBaseline,
  Slide,
  Avatar,
  Grid
} from '@mui/material';
import backgroundImage from '../../assets/background.jpg';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

//style the background image
const BackgroundSection = styled('body')({
    height: '100vh',
    display: 'flex',
    backgroundSize: 'fill',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    overflowY: 'auto',
    backgroundImage: `url(${backgroundImage})`,
  });

// array of sport entries
interface SportEntry {
    sports_interest: string;
    skill_level: string;
    play_frequency: string;
}

// define sports
const sportsInterests = ['Badminton', 'Basketball', 'Tennis'];

const ProfilePage: React.FC = (): ReactElement => {
    const { t } = useTranslation();
    const { id } = useParams();
    // console.log('Current id:', id);
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(true);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [sportsEntries, setSportsEntries] = useState<SportEntry[]>([]);
    const [newSportEntry, setNewSportEntry] = useState<SportEntry>({
        sports_interest: '',
        skill_level: '',
        play_frequency: '',
    });

    const [isCreateProfileButtonDisabled, setIsCreateProfileButtonDisabled] = useState<boolean>(true);

    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

    const showSnackbar = (message: string, severity: AlertColor) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    useEffect(() => {
        const isFormComplete = sportsEntries.length > 0;
        setIsCreateProfileButtonDisabled(!isFormComplete);
    }, [sportsEntries]);

    const handleCreateProfile = async() => {
        try {
            const profileData = {
                dynamic_Id: id,
                first_name: firstName,
                last_name: lastName,
                sports_entries: sportsEntries.map(entry => ({
                    sports_interest: entry.sports_interest,
                    skill_level: entry.skill_level,
                    play_frequency: entry.play_frequency,
                })),
            };

            // console.log('Profile Data:', profileData);
    
            // fetch data from backend API 
            const response = await fetch(`http://localhost:3000/personalizedProfile/profile/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                // Profile created successfully
                console.log('Profile created successfully:', response);
                showSnackbar('Profile created sucessfully', 'success');
                navigate('/upcomingEvents');

            } else {
                // Handle error cases
                showSnackbar(`Error creating profile:`, 'error');
                console.error('Error creating profile:', response.statusText);
               
            }

        } catch (error) {
            // handle unexpected errors
            showSnackbar('Unexpected error during profile creation:', 'error');
            console.error('Unexpected error during profile creation:', error);
            
        }
    };

    const addSportEntry = () => {
        console.log('Adding Sport Entry:', newSportEntry);
        if (newSportEntry.sports_interest && newSportEntry.skill_level && newSportEntry.play_frequency) {
            setSportsEntries(prevEntries => [...prevEntries, newSportEntry]);

            // Clear the newSportEntry after adding it to sportsEntries
            setNewSportEntry({
                sports_interest: '',
                skill_level: '',
                play_frequency: '',
            });
        } else {
            // Handle the case where the new sport entry doesn't have valid values
            console.warn('Invalid values in the new sport entry. Please select values for all fields.');
        }
    };

    const removeSportEntry = (index: number) => {
        setSportsEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
    };

    // Render the main component
    return (
        <>
        <BackgroundSection>
            <Container maxWidth="md">
                <CssBaseline/>
                <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                    <Box 
                        sx={{
                            mt: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar sx={{m: 1, bgcolor: "rgba(1, 181, 98, 0.8)"}}>
                                <HowToRegOutlined/>
                        </Avatar>
                        <Typography variant="h5" component="div" align="center" gutterBottom>
                            {t('createProfile')}
                        </Typography>
                        <Box sx={{mt: 3, width: "100%"}}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label={t('firstName')}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label={t('lastName')}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                {sportsEntries.map((entry, index) => (
                                    <div key={index} style={{ marginBottom: '10px' }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        {t('sportsInterest')} {index + 1}
                                    </Typography>
                                    <Select
                                        name="sportsInterest"
                                        value={entry.sports_interest === '' ? 'null': entry.sports_interest}
                                        fullWidth
                                        style={{ marginTop: '10px', marginBottom: '10px' }}
                                        onChange={(e) => {
                                        const updatedEntries = [...sportsEntries];
                                        updatedEntries[index].sports_interest = e.target.value as string;
                                        setSportsEntries(updatedEntries);
                                        }}
                                        required
                                    >
                                        <MenuItem value="null" disabled>Select Sports Interest</MenuItem>
                                        {sportsInterests.map((interest) => (
                                        <MenuItem key={interest} value={interest}>
                                            {interest}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    <Select
                                        name="skillLevel"
                                        value={entry.skill_level === '' ? 'null': entry.skill_level}
                                        fullWidth
                                        style={{ marginTop: '10px', marginBottom: '10px' }}
                                        onChange={(e) => {
                                        const updatedEntries = [...sportsEntries];
                                        updatedEntries[index].skill_level = e.target.value as string;
                                        setSportsEntries(updatedEntries);
                                        }}
                                        required
                                    >
                                        <MenuItem value="null" disabled>Select Skill Level</MenuItem>
                                        <MenuItem value="Beginner">Beginner</MenuItem>
                                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                                        <MenuItem value="Advanced">Advanced</MenuItem>
                                    </Select>
                                    <Select
                                        name="playFrequency"
                                        value={entry.play_frequency === '' ? 'null': entry.play_frequency}
                                        fullWidth
                                        style={{ marginTop: '10px', marginBottom: '10px' }}
                                        onChange={(e) => {
                                        const updatedEntries = [...sportsEntries];
                                        updatedEntries[index].play_frequency = e.target.value as string;
                                        setSportsEntries(updatedEntries);
                                        }}
                                        required
                                    >
                                        <MenuItem value="null" disabled>Select Play Frequency</MenuItem>
                                        <MenuItem value="Daily">Daily</MenuItem>
                                        <MenuItem value="Weekly">Weekly</MenuItem>
                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                    </Select>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => removeSportEntry(index)}
                                    >
                                        {t('removeSportsInterest')}
                                    </Button>
                                    </div>
                                ))}

                                <Typography variant="subtitle2" gutterBottom>
                                    {t('newSportsInterest')}
                                </Typography>
                                <Select
                                    name="sportsInterest"
                                    value={newSportEntry.sports_interest === '' ? 'null': newSportEntry.sports_interest}
                                    fullWidth
                                    style={{ marginTop: '10px', marginBottom: '10px' }}
                                    onChange={(e) => setNewSportEntry((prevEntry) => ({ ...prevEntry, sports_interest: e.target.value as string }))}
                                    required
                                >
                                    <MenuItem value="null" disabled>Select Sports Interest</MenuItem>
                                    {sportsInterests.map((interest) => (
                                    <MenuItem key={interest} value={interest}>
                                        {interest}
                                    </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    name="skillLevel"
                                    value={newSportEntry.skill_level === '' ? 'null': newSportEntry.skill_level}
                                    fullWidth
                                    style={{ marginTop: '10px', marginBottom: '10px' }}
                                    onChange={(e) => setNewSportEntry((prevEntry) => ({ ...prevEntry, skill_level: e.target.value as string }))}
                                    required
                                >
                                    <MenuItem value="null" disabled>Select Skill Level</MenuItem>
                                    <MenuItem value="Beginner">Beginner</MenuItem>
                                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                                    <MenuItem value="Advanced">Advanced</MenuItem>
                                </Select>
                                <Select
                                    name="playFrequency"
                                    value={newSportEntry.play_frequency === '' ? 'null': newSportEntry.play_frequency}
                                    fullWidth
                                    style={{ marginTop: '10px', marginBottom: '10px' }}
                                    onChange={(e) => setNewSportEntry((prevEntry) => ({ ...prevEntry, play_frequency: e.target.value as string }))}
                                    required
                                >
                                    <MenuItem value="null" disabled>Select Play Frequency</MenuItem>
                                    <MenuItem value="Daily">Daily</MenuItem>
                                    <MenuItem value="Weekly">Weekly</MenuItem>
                                    <MenuItem value="Monthly">Monthly</MenuItem>
                                </Select>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={addSportEntry}
                                >
                                    {t('addSportsInterest')}
                                </Button>
                            </Grid>
                            <Button
                                variant="contained"
                                fullWidth
                                color="primary"
                                onClick={handleCreateProfile}
                                disabled={isCreateProfileButtonDisabled}
                                style={{ marginTop: '10px' }}
                                sx={{mt:3, 
                                    mb: 2,
                                    bgcolor: 'rgba(1, 181, 98, 0.8)',
                                    '&:hover': {
                                    backgroundColor: 'rgba(29, 211, 126, 0.8)', 
                                    },
                                    transition: 'background-color 0.3s', 
                                    }}
                            >
                                {t('create')}
                            </Button>

                        </Box>

                    </Box>

                </Slide>       

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', maxWidth: '600px' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
                               
        </Container>
        </BackgroundSection>
        </>
    );
};

export default ProfilePage;
