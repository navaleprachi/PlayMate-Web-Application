import React, { useState, useEffect, ReactElement } from 'react';
import { styled } from '@mui/system';
import Navbar from '../../components/NavBar/NavBar';
import backgroundImage from '../../assets/background.jpg';
import {
  Typography,
  Card,
  CardContent,
  Button,
  AlertColor,
  Snackbar,
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import * as eventHistoryService from '../../services/userhistory-service';
import * as eventService from '../../services/arenaBook-service';
import { setEventHistory } from '../../store/slices/eventHistory-slice';
import EventIcon from '@mui/icons-material/Event'; // Calendar icon
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Location icon
import ScheduleIcon from '@mui/icons-material/Schedule'; // Clock icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; //AccountCircle
import ArenaUpdate from '../ArenaUpdateModal/ArenaUpdate';
import MuiAlert from '@mui/material/Alert';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';


const BookingCard = styled('div')({
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '10px',
  width: "50vw"
});

const RootContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',

});

const BackgroundSection = styled('div')({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh',
  overflowY: 'auto',
  padding: '20px', // Adding padding for better appearance
});


const UserBookingsPage: React.FC = (): ReactElement => {
  const { t } = useTranslation();
  //const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  var isActive = false;
  //   const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  //   const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [eventCardsActive, setEventHistoryCards1] = useState<React.ReactNode[]>([]);
  const [eventCardsPast, setEventHistoryCards2] = useState<React.ReactNode[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [clickedEventData, setClickedEventData] = useState({
    id: "",
    name: "",
    location: "",
    rating: 0.0,
  });
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');


  const toggleUpdateModal = (eventData: any) => {
    console.log(isUpdateModalOpen);
    setIsUpdateModalOpen((prevIsUpdateModalOpen) => !prevIsUpdateModalOpen);
    console.log(!isUpdateModalOpen);
    setClickedEventData(eventData);
  };

  const showSnackbar = (messageKey: string, severity: AlertColor) => {
    setSnackbarMessage(messageKey);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    if (severity === "success") {
      fetchEventHistory();
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const handleDelete = async (id: any) => {
    // Logic to handle deleting the booking with the given ID
    try {
      const response = await eventService.deleteEvent(id);
      if (response != null) {
        // Handle success, e.g., show a success message
        showSnackbar('Event Deletd Successfully!', 'success');
      } else {
        // Handle errors, e.g., show an error message
        console.error('Failed to delete data');
        showSnackbar(`Error deleting data ${response.message}`, 'error');
      }
    } catch (error) {
      console.error('Error during data deleting:', error);
    }
  };

  useEffect(() => {

    fetchEventHistory();

  }, []);
  const fetchEventHistory = async () => {
    const currentDate = DateTime.local();

    try {
      setLoading(true);
      const eventHistory = await eventHistoryService.eventHistory(localStorage.getItem('userId'));
      console.log(eventHistory);
      //dispatch(setEventHistory(eventHistory));

      const cardsActive = await Promise.all(eventHistory
        .filter((c: { dateOfBooking: string | null }) => {
          // Convert the dateOfBooking string to a Luxon DateTime object
          const bookingDate = DateTime.fromISO(c.dateOfBooking || '');
          isActive = true;
          // Check if the bookingDate is valid and it's greater than the current date
          return bookingDate >= currentDate;
        })
        .sort((a: { dateOfBooking: any; }, b: { dateOfBooking: any; }) => {
          // Sort by booking date in ascending order
          const dateA = DateTime.fromISO(a.dateOfBooking || '').valueOf();
          const dateB = DateTime.fromISO(b.dateOfBooking || '').valueOf();

          return dateA - dateB;
        })
        .map(renderBookingCards)
      );

      const cardsPast = await Promise.all(eventHistory
        .filter((c: { dateOfBooking: string | null }) => {
          // Convert the dateOfBooking string to a Luxon DateTime object
          const bookingDate = DateTime.fromISO(c.dateOfBooking || '');
          isActive = false;
          // Check if the bookingDate is valid and it's less than the current date
          return bookingDate < currentDate;
        })
        .sort((a: { dateOfBooking: any; }, b: { dateOfBooking: any; }) => {
          // Sort by booking date in ascending order
          const dateA = DateTime.fromISO(a.dateOfBooking || '').valueOf();
          const dateB = DateTime.fromISO(b.dateOfBooking || '').valueOf();

          return dateA - dateB;
        })
        .map(renderBookingCards)
      );

      setEventHistoryCards1(cardsActive);
      setEventHistoryCards2(cardsPast);
    } catch (error) {
      console.error("Error fetching arenas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  }



  const renderBookingCards = (event: any, index: any) => {
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
              {isActive && event.parentEventId === "" && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button onClick={() => toggleUpdateModal(event)} variant="contained" style={{ backgroundColor: 'green' }}>
                      Edit
                    </Button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button onClick={() => handleDelete(event._id)} variant="contained" style={{ backgroundColor: 'green' }}>
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };




  return (
    <RootContainer>
      <BackgroundSection>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '50%', padding: '20px', height: '100vh', overflowY: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom marginTop={'4rem'}>
            {t('activeBookings')}
            </Typography>
            {eventCardsActive}
          </div>
          <div style={{ width: '50%', padding: '20px', height: '100vh', overflowY: 'auto' }}>
            <Typography variant="h4" component="h1" gutterBottom marginTop={'4rem'}>
              {t('pastBookings')}
            </Typography>
            {eventCardsPast}
          </div>
        </div>
      </BackgroundSection>
      <ArenaUpdate
        isOpen={isUpdateModalOpen}
        onClose={() => toggleUpdateModal({})}
        selectedEvent={clickedEventData}
        onSnackbarOpen={showSnackbar}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', maxWidth: '600px' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </RootContainer>
  );
};

export default UserBookingsPage;
