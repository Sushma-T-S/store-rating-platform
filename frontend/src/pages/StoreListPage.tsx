import { useEffect, useState } from "react";
import api from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Store {
  id: number;
  name: string;
  address: string;
  averageRating: number;
  userRating: number | null;
}

const StoreListPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [keyword, setKeyword] = useState("");

  const getStores = async () => {
    try {
      const res = await api.get("/stores");
      setStores(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchStores = async () => {
    try {
      const res = await api.get(`/stores/search?keyword=${keyword}`);
      setStores(res.data);
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
  const submitRating = async (
    storeId: number,
    rating: number
  ) => {
    try {
      await api.post("/ratings", {
        storeId,
        rating,
      });

      alert("Rating submitted");

      getStores();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <div>
      <button onClick={handleLogout}>
  Logout
</button>
      <h1>Stores</h1>

      <input
        placeholder="Search by name or address"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button onClick={searchStores}>
        Search
      </button>

      <hr />
        {stores.length === 0 && (
  <h3>No stores found</h3>
)}
      {stores.map((store) => (
        <div
          key={store.id}
          style={{
            border: "1px solid black",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h2>{store.name}</h2>

          <p>{store.address}</p>

          <p>
            Overall Rating:
            {store.averageRating.toFixed(1)}
          </p>

          <p>
            Your Rating:
            {store.userRating || "Not Rated"}
          </p>

          <select
            onChange={(e) =>
              submitRating(
                store.id,
                Number(e.target.value)
              )
            }
            defaultValue=""
          >
            <option value="">
              Select Rating
            </option>

            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default StoreListPage;