import React from 'react';
import { styled } from '@mui/system';
import {
  Typography,
  Button,
  Container,
  Grid,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Rating,
  Card,
  CardContent,
} from '@mui/material';
import backgroundImage from '../../assets/bgimage2.jpg'; 
import NavbarSign from '../../components/NavBar/NavBarBeforeSignUp';
import FooterTemp from '../Footer/Footer';
import { useTranslation } from 'react-i18next';

const RootContainer = styled('div')({
  height: '100vh',
  overflow: 'hidden',
});

const BackgroundSection = styled('div')({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  height: '100vh',
  overflowY: 'auto',
});

const ContentSection = styled('div')({
  height: '100vh',
  overflowY: 'auto',
  padding: '20rem',

});

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   height: 500,
// //   width: 800,
// //   marginRight:200
// }));

const ReviewCard = styled(Card)({
  height: '25vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '20px',
  width: '100%'
});


const LandingPage = () => {
  const [slideIn, setSlideIn] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    setSlideIn(true);
  }, []);

  const reviews = [
    { name: 'Alice Smith', rating: 5, review: 'Great experience using the app! Highly recommended!' },
    { name: 'Bob Johnson', rating: 4, review: 'Nice app, enjoyed playing sports with friends.' },
    { name: 'Emma Brown', rating: 5, review: 'Great app! My evenings look completely different now.' },
    // Add more review objects as needed
  ];

  return (
    <RootContainer>
      
     <NavbarSign/>
      <BackgroundSection>
        {/* Content for the background section */}
        <Container maxWidth="lg" sx={{ marginTop: '2rem' , width: 1/2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                
                  <Typography variant="h1" component="h1" gutterBottom align='center' padding= "8rem" color="common.white" >
                  {t('welcomeTitle')}
                  </Typography>
                  <Typography variant="h3" component="p" gutterBottom align='center' color="common.white" padding="10rem">
                  {t('buildingCommunity')}
                  </Typography>
            </Grid>
          </Grid>
        </Container>

        {/* Reviews Section */}
        <ContentSection>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="common.white">
            {t('reviewsTitle')}
          </Typography>
          <Grid container spacing={3}>
            {reviews.map((review, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} width='100vh' borderRadius={'40'}>
                <ReviewCard variant="outlined">
                  <CardContent>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={review.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={review.name}
                        secondary={
                          <React.Fragment>
                            <Rating name="read-only" value={review.rating} readOnly />
                            <Typography variant="body2" color="textPrimary">
                              {review.review}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </CardContent>
                </ReviewCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </ContentSection>
      <FooterTemp />
      </BackgroundSection>
    </RootContainer>
  );
};
      

export default LandingPage;
