import './App.css'; // Import necessary components and styles
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Import app components
import SignUp from './components/SignUpPage/SignUp';
import SignIn from './components/SignInPage/SignIn';
import ForgotPassword from './components/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './components/ResetPasswordPage/ResetPassword';
import ProfilePage from './components/CreateProfilePage/ProfilePage';
import LandingPage from './components/Landing/LandingBeforeSignUp';
import ArenaSearch from './components/ArenaSearchPage/ArenaSearch';
import AllBlogs from './components/AllBlogsPage/AllBlogs';
import Blog from './components/IndividualBlogPage/Blog';
import CreateBlog from './components/CreateBlogPage/CreateBlog';
import ArenaSearchBar from './components/ArenaSearchBar/ArenaSearchBar';
import LandingHomePage from './components/Landing/LandingHome';
import MyProfilePage from './components/MyProfilePage/MyProfile';
import UserBookingsPage from './components/UserBooking/UserBooking';
import ErrorPage from './components/ErrorPage/ErrorPage';


function App() {
  // Use Router to handle routes
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
        <Route path="/profile/:id" Component={ProfilePage} />
        <Route path='/myProfile/:userId' Component={MyProfilePage}></Route>
        <Route path="/" Component={LandingPage} />
        <Route path='/arenaSearch' element={<ArenaSearchBar />} />
        <Route path='/arenas' element={<ArenaSearch />} />
        <Route path="/allBlogs" element={<AllBlogs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path='/createBlog' element={<CreateBlog />} />
        <Route path="/upcomingEvents" Component={LandingHomePage} />
        <Route path="/userBookings" element={<UserBookingsPage/>} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  )
}

export default App;
