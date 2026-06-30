import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { isConnected, onlineCount } = useSocket();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/tasks">WAD Task Manager</Link>
      </div>

      <div className="navbar-menu">
        <Link to="/tasks">Tasks</Link>

        <Link to="/profile">Profil</Link>

        <span
          style={{
            color: isConnected ? "green" : "red",
            fontWeight: 600,
          }}
        >
          {isConnected ? "🟢 Online" : "🔴 Offline"}
        </span>

        <span>
          👥 {onlineCount}
        </span>

        <span className="navbar-user">
          Halo, {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="btn-logout"
        >
          Keluar
        </button>
      </div>
    </nav>
  );
}