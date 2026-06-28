import { useEffect, useState } from "react";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const [data, setData] = useState<any>(null);

  const getDashboard = async () => {
    try {
      const res = await api.get("/owner/dashboard");
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const { logout } = useContext(AuthContext);
const navigate = useNavigate();

const handleLogout = () => {
  logout();
  navigate("/login");
};

  useEffect(() => {
    getDashboard();
  }, []);

  if (!data) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Owner Dashboard</h1>
      <button onClick={handleLogout}>
  Logout
</button>

      <h2>Store: {data.storeName}</h2>

      <h3>
        Average Rating:
        {Number(data.averageRating).toFixed(1)}
      </h3>

      <hr />

      <h2>Users Ratings</h2>

      {data.ratings.map((rating: any) => (
        <div
          key={rating.id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <p>Name: {rating.user.name}</p>
          <p>Email: {rating.user.email}</p>
          <p>Rating: {rating.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default OwnerDashboard;