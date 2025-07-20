import { googleLogout } from '@react-oauth/google';

export default function Logout() {
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    window.location.reload();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
