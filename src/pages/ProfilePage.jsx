import { useAuth } from "../contexts/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();
  return (
    <div style={{ padding: "20px" }}>
      <h1>Profil Saya</h1>
      <p>Nama: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}