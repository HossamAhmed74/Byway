import { atom, useAtomValue, useSetAtom , useAtom} from 'jotai';
import { useNavigate } from 'react-router-dom';
import { isLoggedInAtom, usernameAtom, tokenAtom } from '../components/Jotai/auth/authAtoms'; 

// --- UTILITY FUNCTION ---

export const isExpired = (expiryTime) => {
  const currentTime = new Date().getTime();
  const expiryDate = new Date(expiryTime).getTime();
  return expiryDate < currentTime;
};

export const useAuthService = () => {
    // Hooks must be called inside the functional component/hook body
    const navigate = useNavigate();
    const [token, setToken] = useAtom(tokenAtom);
    const [username, setUsername] = useAtom(usernameAtom);

  
    const loginSuccess = (authResult) => {

        if (isExpired(authResult.expiration)) {
            console.error("Login failed: Received token is already expired.");
            return;
        }

        localStorage.setItem("token", authResult.token);
        localStorage.setItem("username", authResult.username);

        setToken(authResult.token);
        setUsername(authResult.username);
        

        navigate('/dashboard');
    };
    

    const logout = () => {
        localStorage.removeItem("token");
        setToken('');
        setUsername(null);
        navigate('/login');
    };

    return { loginSuccess, logout };
};

export const usePublicAuthChecker = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const username = localStorage.getItem('username') || '';
  return {
    isLoggedIn,
    username: isLoggedIn ? username : '', 
  };
};