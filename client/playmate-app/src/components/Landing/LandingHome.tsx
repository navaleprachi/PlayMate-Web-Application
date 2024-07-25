import React, { ReactElement, useState, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/system';
import {
  Typography,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardContent,
  Button,
  Snackbar
} from '@mui/material';
import FooterTemp from '../Footer/Footer';
import Navbar from '../../components/NavBar/NavBar';
import "./LandingHome.css";
import EventIcon from '@mui/icons-material/Event'; // Calendar icon
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Location icon
import ScheduleIcon from '@mui/icons-material/Schedule'; // Clock icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; //AccountCircle
import * as upEventsService from '../../services/landing-service';
import { useDispatch } from "react-redux";
import { setEvents } from '../../store/slices/upcomingEvents-slice';
import backgroundImage from '../../assets/background.jpg';
import * as arenaBookService from '../../services/arenaBook-service';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { DateTime } from 'luxon';
import { AccountCircle } from '@mui/icons-material';


const RootContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const MainContent = styled('main')({
  flexGrow: 1,
  padding: '2rem',
});



const CenteredContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const BackgroundSection = styled('div')({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh',
  overflowY: 'auto',
});


const LandingHomePage: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [sportSearched, setSportSearched] = useState("");
  const [citySearched, setCitySearched] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');

  const showSnackbar = (messageKey: string, severity: AlertColor) => {
    setSnackbarMessage(messageKey);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const [eventCards, setEventCards] = useState<React.ReactNode[]>([]);
  useEffect(() => {
    if (sportSearched !== "" && citySearched !== "") {
      fetchEvents();
    }
  }, [sportSearched, citySearched]);

  let upcomingEvents: any[];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      upcomingEvents = await upEventsService.upcomingEvents(
        sportSearched,
        citySearched
      );
      dispatch(setEvents(upcomingEvents));
      const currentDate = DateTime.local();
      console.log(currentDate);
      const cards = await Promise.all(
        upcomingEvents
          .filter((event: {
            id: any;
            dateOfBooking: string;
            userId: string | null;
            isPublic: boolean;
            isPrimaryUser: boolean;
          }) => {
            console.log(event.id)
            console.log(DateTime.fromISO(event.dateOfBooking));
            return (
              event.isPrimaryUser === true &&
              event.isPublic === true &&
              event.userId !== localStorage.getItem('userId') &&
              DateTime.fromISO(event.dateOfBooking) > currentDate
            );
          })
          .map(renderEventCard)
      );
      setEventCards(cards);

    } catch (error) {
      console.error("Error fetching arenas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinBtn = async (eventDetails: any) => {

    try {
      await joinEvent(eventDetails);
      await updateEvent(eventDetails);
      await fetchEvents();
      // Close the modal after setting values and saving the event
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle error if needed
    }
  };

  const joinEvent = async (eventDetails: any) => {
    const saveObj = {
      userId: localStorage.getItem('userId'),
      name: eventDetails.name,
      placeId: eventDetails.placeId,
      dateOfBooking: eventDetails.dateOfBooking,
      timeSlot: eventDetails.timeSlot,
      playerCount: eventDetails.playerCount - 1,
      sport: eventDetails.sport,
      location: eventDetails.location,
      isPrimaryUser: false,
      isPublic: true,
      city: eventDetails.city,
      parentEventId: eventDetails._id
    };
    try {
      const response = await arenaBookService.createEvent(saveObj);
      if (response != null) {
        // Handle success, e.g., show a success message
        console.log('Data posted successfully');
        showSnackbar('Event Joined Successfully!', 'success');
      } else {
        // Handle errors, e.g., show an error message
        console.error('Failed to post data');
        showSnackbar(`Error joining event ${response.message}`, 'error');
      }
    } catch (error) {
      console.error('Error during data posting:', error);
    }
  };

  const updateEvent = async (eventDetails: any) => {
    const saveObj = {
      playerCount: eventDetails.playerCount - 1
    };
    try {
      const response = await arenaBookService.updateEvent(saveObj, eventDetails._id);
      if (response !== null) {
        // Handle success, e.g., show a success message
        console.log('Data posted successfully');
      } else {
        // Handle errors, e.g., show an error message
        console.error('Failed to post data');
        console.log(saveObj);
      }
    } catch (error) {
      console.error('Error during data posting:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  }


  const renderEventCard = async (event: any, index: any) => {
    const userHasJoined = upcomingEvents.some(
      (joinedEvent) =>
        joinedEvent.userId === localStorage.getItem('userId') &&
        joinedEvent.parentEventId === event._id
    );
    return (
      <div style={{ padding: 30, alignItems: 'center', width: "40vw" }}>
        <Card key={event["id"]} id="event-card" sx={{
          backgroundColor: '#4CAF50', // Different shade of green
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '20px',
        }} >
          <CardContent>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <EventIcon fontSize="small" />
                <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
                  Date: {formatDate(new Date(event['dateOfBooking']).toISOString())}
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <AccountCircleIcon fontSize="small" />
                <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
                  Court Name: {event['name']}
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <ScheduleIcon fontSize="small" />
                <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
                  Time: {event['timeSlot']}
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
                  Location: {event['location']}
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <AccountCircleIcon fontSize="small" />
                <Typography variant="subtitle1" style={{ marginLeft: '0.5rem' }}>
                  Available Slots: {event['playerCount']}
                </Typography>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button onClick={() => handleJoinBtn(event)} disabled={event.playerCount === 0 || userHasJoined} variant="contained" style={{ backgroundColor: 'green' }}>
                  Join
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <RootContainer>

      <Navbar />
      <BackgroundSection>
        <MainContent >
          <Container maxWidth="lg" >
            <CenteredContent>
              <Typography variant="h2" component="h1" gutterBottom marginTop={'4rem'}>
                {t('joinGame')}
              </Typography>

              <div id="search-bar">
                <FormControl id="location-upcoming-form" variant="outlined" required>
                  <InputLabel htmlFor="play-location">Choose your Location</InputLabel>
                  <Select
                    label="Choose your Location"
                    value={citySearched || ''}
                    onChange={(e) => setCitySearched(e.target.value as string)}
                    name="location"
                    id="play-location"
                    className="search-item"
                  >
                    <MenuItem value="default" disabled>
                      Choose your Location
                    </MenuItem>
                    <MenuItem value="Boston">Boston</MenuItem>
                    <MenuItem value="New York">New York</MenuItem>
                    <MenuItem value="San Francisco">San Francisco</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="outlined" required>
                  <InputLabel htmlFor="sport-name">Choose your Sport</InputLabel>
                  <Select
                    label="Choose your Sport"
                    value={sportSearched || ''}
                    onChange={(e) => setSportSearched(e.target.value as string)}
                    name="sport"
                    id="sport-name"
                    className="search-item"
                  >
                    <MenuItem value="default" disabled>
                      Choose your Sport
                    </MenuItem>
                    <MenuItem value="Badminton">Badminton</MenuItem>
                    <MenuItem value="Basketball">Basketball</MenuItem>
                    <MenuItem value="Tennis">Tennis</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {sportSearched && citySearched && (
                <div id="event-grid">
                  {eventCards.length === 0 && (
                    <Typography variant="subtitle1">
                      {t('noEvents')}
                    </Typography>
                  )}
                </div>
              )}
              {sportSearched && citySearched && <div id="event-grid">{eventCards}</div>}
              <div className="animation-container">
                <div className="sports-animation soccer-ball"></div>
                <div className="sports-animation basketball"></div>
                <div className="sports-animation tennis-ball"></div>
              </div>
            </CenteredContent>
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

export default LandingHomePage;