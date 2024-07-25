import errorPageAnimation from '../../assets/ErrorPageAnimation.json';
import { useLottie } from "lottie-react";
import './ErrorPage.css'

// Functional component for the Error Page
export default () => {
     // Lottie animation options
    const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: errorPageAnimation ,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };
    // Get the View component from the useLottie hook
    const { View } = useLottie(lottieOptions);
    // Rendering the Error Page component
    return (
        <div className='error-container'>
            <h2>404 - Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <div className="animation-container">
                {View}
            </div>
        </div>
    );
}