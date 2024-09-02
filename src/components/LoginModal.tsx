import { useState } from 'react';
import Modal from 'react-modal';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

Modal.setAppElement('body');

export default function LoginModal({ isOpen, onRequestClose }: LoginModalProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check if the email is verified
      if (user.emailVerified) {
        onRequestClose(); // Close modal on successful login
      } else {
        // Sign out the user immediately since they are not verified
        await auth.signOut();
        setError('Please verify your email before logging in.');
      }
    } catch (error) {
      console.error('Error during email login:', error);
      setError('Invalid login credentials. Please try again.');
    }
  };

  const handleEmailRegister = async () => {
    try {
      // Attempt to create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send verification email if the user is successfully created
      await sendEmailVerification(user);

      // Immediately sign the user out to ensure they verify their email first
      await auth.signOut();
    } catch (error) {
      console.error('Error during email registration:', error);
      // Suppress error details and always show the same message
    } finally {
      // Always inform the user to check their email for verification
      setError('A verification email has been sent. Please check your inbox and verify your email before logging in.');
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);      
      onRequestClose(); // Close modal on successful login
    } catch (error) {
      console.error('Error during Facebook login:', error);
      setError('Failed to login with Facebook. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onRequestClose(); // Close modal on successful login
    } catch (error) {
      console.error('Error during Google login:', error);
      setError('Failed to login. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Login Modal"
      className="bg-white p-6 rounded shadow-lg w-full max-w-sm mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-xl font-bold mb-6 text-center">{isRegistering ? 'Register' : 'Login'}</h2>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>} {/* Display error message */}

      <div className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Please enter your Email"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Please enter your password"
          />
          <span className="absolute inset-y-0 right-3 flex items-center">
            👁️
          </span>
        </div>

        <button
          onClick={isRegistering ? handleEmailRegister : handleEmailLogin}
          className="w-full bg-orange-500 text-white p-2 rounded mb-4"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <div className="text-center text-sm text-gray-500">
          {isRegistering ? (
            <>
              Already have an account?{' '}
              <button className="text-blue-500" onClick={() => { setIsRegistering(false); setError(null); }}>
                Login
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button className="text-blue-500" onClick={() => { setIsRegistering(true); setError(null); }}>
                Sign up
              </button>
            </>
          )}
        </div>

        {!isRegistering && (
          <>
            <div className="text-center text-sm text-gray-500 my-4">Or, login with</div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center bg-white border border-gray-300 rounded p-2"
              >
                <img
                  src="/images/google-icon-logo-svgrepo-com.svg"
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                Google
              </button>
              <button
                onClick={handleFacebookLogin}
                className="flex items-center bg-white border border-gray-300 rounded p-2"
              >
                <img
                  src="/images/facebook-3-logo-svgrepo-com.svg"
                  alt="Facebook"
                  className="w-6 h-6 mr-2"
                />
                Facebook
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
