// src/components/Login.jsx
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
    const handleSuccess = (credentialResponse) => {
        const user = jwtDecode(credentialResponse.credential);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.reload();
    };

    return (
        <div>
            <GoogleLogin onSuccess={handleSuccess} onError={() => console.error('Login Failed')} />
        </div>
    );
}
