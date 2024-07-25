import React, { useEffect, useState } from 'react';
import { styled } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import { useTranslation } from 'react-i18next';
import MuiAlert, {AlertColor} from '@mui/material/Alert';
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { HowToRegOutlined } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/NavBar/NavBar';
import backgroundImage from '../../assets/background.jpg';
import * as personalizeProfileService from '../../services/personalizedProfile-service';

// array of sports interest
interface SportSchema {
    sports_interest: string;
    skill_level: string;
    play_frequency: string;
  }
  
// user profile object
  interface UserProfile {
    dynamic_Id: string;
    first_name: string;
    last_name: string;
    sports_entries: SportSchema[];
  }

const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
const playFrequencies = ['Daily', 'Weekly', 'Monthly'];

// Styled components for the layout
  const RootContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  });
  
  const MainContent = styled('main')({
    flexGrow: 1,
    padding: '2rem',
  }); 
  
  const BackgroundSection = styled('div')({
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    height: '100vh',
    overflowY: 'auto',
  });

const MyProfilePage = () => {
  const { t } = useTranslation(); // Initialize the useTranslation hook for translation
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  // console.log("Profile data", profileData);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  // Function to display a snackbar with a message and severity
  const showSnackbar = (message: string, severity: AlertColor) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // fetch data from Backend API 
        const response = await fetch(`http://localhost:3000/personalizedProfile/myProfile/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          // console.log('Profile data', data);
          // Profile data successfully fetched 
          setProfileData(data);
          setUpdatedProfile(data);
        } else {
            const errorData = await response.json();
          console.error('Error fetching profile:', response.status, errorData);
          // Handle error cases
        }
      } catch (error) {
        console.error('Unexpected error during profile fetch:', error);
        // Handle error cases
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state if profile data is not available
  if (!profileData) {
    return <div>Error loading profile data</div>;
  }

  // Function to handle entering edit mode
  const handleEdit = () => {
    setIsEditMode(true);
   
    // Create a deep copy of the current profile data for editing
    setUpdatedProfile({
      ...profileData,
      sports_entries: profileData.sports_entries.map((entry) => ({ ...entry })),
    });
  };

   // Function to handle saving changes
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/personalizedProfile/myProfile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Update the local state with the saved data
        setProfileData(data);
        setIsEditMode(false);
        console.log('Profile Data updated sucessfully: ', response);
        showSnackbar('Profile Data updated sucessfully', 'success');

      } else {

        showSnackbar(`Error updating profile:`, 'error');
        console.error('Error updating profile:', response.status);
        // Handle error cases
      }
    } catch (error) {
      showSnackbar('Unexpected error during profile update:', 'error');
      console.error('Unexpected error during profile update:', error);
      // Handle error cases
    }
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }


   // Function to handle canceling the edit mode
  const handleCancel = () => {
    // Cancel the editing and reset the state
    setIsEditMode(false);
    setUpdatedProfile(null);
  };

  // Function to handle input changes
  const handleInputChange = (field: string, value: string, index?: number) => {
    setUpdatedProfile((prevProfile: UserProfile | null) => {
      if (!prevProfile) {
        return prevProfile;
      }
  
      // If the field is related to sports_entries, update the nested structure
      if (field.startsWith('sports_entries')) {
        const updatedSportsEntries = [...prevProfile.sports_entries];
        const [sportsField, sportsIndex, sportsProperty] = field.split('.');
  
        if (sportsField === 'sports_entries' && sportsIndex && sportsProperty) {
          const entryIndex = parseInt(sportsIndex, 10);
          const entry = updatedSportsEntries[entryIndex];
  
          if (entry) {
            // Update the specific property of the sports entry
            if (sportsProperty === 'sports_interest') {
              entry.sports_interest = value;
            } else if (sportsProperty === 'skill_level') {
              entry.skill_level = value;
            } else if (sportsProperty === 'play_frequency') {
              entry.play_frequency = value;
            }
          }
        }
  
        return {
          ...prevProfile,
          sports_entries: updatedSportsEntries,
        };
      }
  
      // For other fields, update normally
      return {
        ...prevProfile,
        [field]: value,
      };
    });
  };
  
 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileData) {
    return <div>Error loading profile data</div>;
  }

  // Render the main component
  return (
    <RootContainer>
    <Navbar/>
    <BackgroundSection>
    <MainContent>
    <Container maxWidth = "xs" sx={{mt: 10}}>
    
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'rgba(1, 181, 98, 0.8)' }}>
          <HowToRegOutlined />
        </Avatar>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          {t('myProfile')}
        </Typography>
        <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{mt: 2}}
                  fullWidth
                  label={t('firstName')}
                  value={isEditMode ? updatedProfile?.first_name : profileData.first_name}
                  disabled={!isEditMode}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('lastName')}
                  value={isEditMode ? updatedProfile?.last_name : profileData.last_name}
                  disabled={!isEditMode}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                />
              </Grid>
              {profileData?.sports_entries?.map((entry, index) => (
                <Grid item xs={12} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      border: '1px solid #ddd',
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: isEditMode ? '#f5f5f5' : 'transparent',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {t('sportsInterest')} {index + 1}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Sport"
                      value={isEditMode ? updatedProfile?.sports_entries[index]?.sports_interest : entry.sports_interest}
                      disabled={!isEditMode}
                      onChange={(e) => handleInputChange(`sports_entries.${index}.sports_interest`, e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Skill Level"
                      value={isEditMode ? updatedProfile?.sports_entries[index]?.skill_level : entry.skill_level}
                      disabled={!isEditMode}
                      onChange={(e) => handleInputChange(`sports_entries.${index}.skill_level`, e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Play Frequency"
                      value={isEditMode ? updatedProfile?.sports_entries[index]?.play_frequency : entry.play_frequency}
                      disabled={!isEditMode}
                      onChange={(e) => handleInputChange(`sports_entries.${index}.play_frequency`, e.target.value)}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              {!isEditMode && (
                <Button variant="outlined" color="primary" onClick={handleEdit}>
                  {t('profile.edit')}
                </Button>
              )}
              {isEditMode && (
                <>
                  <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{mr: 4}}>
                    {t('cancel')}
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    {t('save')}
                  </Button>
                </>
              )}
            </Grid>
      </Paper> 
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', maxWidth: '600px' }}>
                    {snackbarMessage}
            </MuiAlert>
      </Snackbar>
    </Container>
    </MainContent>
    </BackgroundSection>
    </RootContainer>
    
  );
};

export default MyProfilePage;
