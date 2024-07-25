// Importing necessary dependencies
import { Modal, Card, CardContent, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { clearUserAndToken, setUserAndToken } from "../../store/slices/signIn-slice";
import { useNavigate } from "react-router-dom";
import * as userAuthService from '../../services/userAuth-service';
import {isExpired} from 'react-jwt';
import { useTranslation } from "react-i18next";

// Props interface for the LogOutModal component
interface LogOutModalProps {
    isOpen: boolean;
    onClose: () => void;
}
// Interface for the response from the refreshToken API call
interface RefreshTokenResponse {
    success: boolean;
    accessToken: string;
  }

// LogOutModal component
const LogOutModal: React.FC<LogOutModalProps> = ({isOpen, onClose}) => {
    // Hooks and state management
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation('common');

    // Function to handle the logout process
    const handleLogout = async () => { 
        // Retrieving access token and refresh token from local storage  
        const accessToken: string | null = localStorage.getItem('accessToken');
        const refereshToken: string | null = localStorage.getItem('refereshToken');
        if (accessToken !== null && refereshToken !== null) {
          // Checking if the access token is expired
            const isTokenExp = isExpired(accessToken);
      
            if (isTokenExp) {
              try {
                // Wrap the refreshToken call in a Promise to ensure it completes before moving on
                const refreshedTokens = await new Promise<RefreshTokenResponse>(async (resolve, reject) => {
                  try {
                    //Service call to get new access token
                    const resp = await userAuthService.getNewAccesToken(refereshToken);
      
                    if (resp.success) {
                      // Update the access token in local storage
                      localStorage.setItem('accessToken', resp.accessToken);
                      resolve(resp);
                    } else {
                      console.error('Error getting new access token');
                      reject(resp);
                    }
                  } catch (error) {
                    console.error('Error getting new access token:', error);
                    reject(error);
                  }
                });
      
                // Proceeding with the logout after handling the token refresh
                const response = await userAuthService.logoutUser(refreshedTokens.accessToken);
      
                if (response.success) {
                  // Clearing user and token from Redux state and localstorage
                  dispatch(clearUserAndToken());
                  onClose();
                  // Navigating to the home page
                  navigate('/');
                } else {
                  console.error('Error during logout');
                  onClose();
                }
              } catch (error) {
                console.error('Error during logout:', error);
                onClose();
              }
            } else {
              // Proceeding with the logout directly if the token is not expired
              const response = await userAuthService.logoutUser(accessToken);
      
              if (response.success) {
                // Clearing user and token from Redux state and localstorage
                dispatch(clearUserAndToken());
                onClose();
                // Navigating to the home page
                navigate('/');
              } else {
                console.error('Error during logout');
                onClose();
              }
            }
          } else {
            console.error('Access token or refresh token is null');
            onClose();
          }
    }

    // Rendering the JSX for the LogOutModal component
    return(
        <Modal open={isOpen} onClose={onClose} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
            <div className="modal-content" style={{width: '400px', padding: '16px', background: '#fff', borderRadius: '8px'}}>
                <Card className="form-container" elevation={5}>
                  {/* Close button */}
                    <span className="close" onClick={onClose} style={{ cursor: 'pointer', position: 'absolute', top: '8px', right: '8px', fontSize: '1.5rem' }}>
                        &times;
                    </span>
                    <CardContent>
                      {/* Logout Modal heading */}
                        <Typography variant="h5" color="primary" gutterBottom>
                        {t('card.logout.heading')}
                        </Typography>
                        {/* Logout Modal content */}
                        <Typography variant="body1" paragraph>
                        {t('card.logout.message')}
                        </Typography>
                        {/* Buttons for confirming or canceling the logout */}
                        <div className="form-group" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleLogout}
                                style={{ marginRight: '8px' }}
                                >  
                                {t('card.button.yes')}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={onClose}
                                style={{marginLeft: '8px'}}
                                >  
                                {t('card.button.cancel')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Modal>
    )
}
// Exporting the LogOutModal component as the default export
export default LogOutModal;