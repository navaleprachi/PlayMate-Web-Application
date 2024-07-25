import React, {ReactElement} from 'react';
import { styled } from '@mui/system';
import {
    Typography,
    Button,
    Container,
    Link
   } from '@mui/material';
import backgroundImage from '../../assets/bg.avif'; 

const Footer = styled('footer')({
    backgroundColor: '#001f3f',
    color: 'white',
    padding: '2rem 0',
  });
  
  const FooterContent = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  });
  
  const FooterLinks = styled('div')({
    marginTop: '1rem',
    '& > *': {
      margin: '0 0.5rem',
      color: 'white',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  });
  
const FooterTemp: React.FC = (): ReactElement => {
    return(
        <Footer>
        <Container maxWidth="lg">
          <FooterContent>
            <Typography variant="body1">&copy; {new Date().getFullYear()} Playmate </Typography>
            <FooterLinks>
              <Link href="#" variant="body1" padding={"1rem"}>About</Link>
              <Link href="#" variant="body1" padding={"1rem"}>Contact</Link>
              <Link href="#" variant="body1" padding={"1rem"}>Privacy Policy</Link>
              <Link href="#" variant="body1" padding={"1rem"}>Terms of Service</Link>
            </FooterLinks>
          </FooterContent>
        </Container>
      </Footer>

    );
};

export default FooterTemp;