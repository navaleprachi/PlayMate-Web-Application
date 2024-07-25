import * as baseService from './base-service';

// API paths
const registerPath = '/auth/signUp';
const loginPath = '/auth/logIn';
const forgotPasswordPath = '/auth/forgotPassword'
const resetPasswordPath = '/auth/resetPassword'
const logoutUserPath = '/auth/logOut'
const getNewAccesTokPath = '/auth/refereshToken'

/**
 * Registers a new user.
 * @param userData (object) - User data for registration.
 * @returns - A promise resolving to the registration result.
 */
export const registerUser = async (userData: any): Promise<any> => {
    const user = await baseService.post<any>(registerPath, userData);
    return user;
}

/**
 * Logs in a user.
 * @param  credentials (object) - User login credentials.
 * @returns - A promise resolving to the user login result.
 */
export const loginUser = async (credentials: any): Promise<any> => {
    const user = await baseService.post<any>(loginPath, credentials);
    return user;
}

/**
 * Sends a request to reset the user's password.
 * @param  email (string) - User's email for password reset.
 * @returns - A promise resolving to the password reset result.
 */
export const forgotPassword = async (email: string): Promise<any> => {
    const result = await baseService.post<any>(forgotPasswordPath,{email});
    return result;
}

/**
 * Resets the user's password.
 * @param  resetData (object) - Data required for password reset.
 * @returns  - A promise resolving to the password reset result.
 */
export const resetPassword = async (resetData: any): Promise<any> => {
    const result = await baseService.post<any>(resetPasswordPath,resetData);
    return result;
}

/**
 * Logs out a user.
 * @param accessToken (string) - User's access token.
 * @returns - A promise resolving to the logout result.
 */
export const logoutUser = async (accessToken: string): Promise<any> => {
    const result = await baseService.logoutPost<any>(logoutUserPath, {}, accessToken);
    return result;
} 

/**
 * Refreshes the user's access token using the provided refresh token.
 * @param  refreshToken (string) - User's refresh token.
 * @returns - A promise resolving to the new access token result.
 */
export const getNewAccesToken = async(refereshToken: string): Promise<any> => {
    const result = await baseService.post<any>(getNewAccesTokPath, {refereshToken});
    return result;
}