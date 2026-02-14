import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <span className="navbar-title">MemLayer</span>
      {isAuthenticated && (
        <button className="navbar-btn" onClick={logout}>
          Logout
        </button>
      )}
    </nav>
  );
}
