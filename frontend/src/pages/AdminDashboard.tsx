import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: string;
}

interface Store {
  id: number;
  name: string;
  email: string;
  address: string;
  averageRating?: number;
}

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get("/admin/dashboard");
    setDashboard(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await api.get("/admin/stores");
    setStores(res.data);
  };

  const filterUsers = async () => {
    try {
      const res = await api.get(
        `/admin/filter-users?name=${nameFilter}&email=${emailFilter}&address=${addressFilter}&role=${roleFilter}`
      );

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const sortUsersByName = () => {
  const sorted = [...users].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  setUsers(sorted);
};

const sortUsersByEmail = () => {
  const sorted = [...users].sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  setUsers(sorted);
};

const sortStoresByName = () => {
  const sorted = [...stores].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  setStores(sorted);
};
  const viewUserDetails = async (id: number) => {
  try {
    const res = await api.get(`/admin/users/${id}`);

    setSelectedUser(res.data);
  } catch (error) {
    console.log(error);
  }
};


  const addUser = async () => {
    try {
      await api.post("/admin/add-user", userForm);

      alert("User Added");

      setUserForm({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });

      fetchUsers();
      fetchDashboard();
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  const addStore = async () => {
    try {
      await api.post("/admin/add-store", {
        ...storeForm,
        ownerId: Number(storeForm.ownerId),
      });

      alert("Store Added");

      setStoreForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });

      fetchStores();
      fetchDashboard();
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };


  return (
    <div>
      <h1>Admin Dashboard</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <h2>Total Users: {dashboard.totalUsers}</h2>
      <h2>Total Stores: {dashboard.totalStores}</h2>
      <h2>Total Ratings: {dashboard.totalRatings}</h2>

      <hr />

      <h2>Add User</h2>

      <input
        placeholder="Name"
        value={userForm.name}
        onChange={(e) =>
          setUserForm({ ...userForm, name: e.target.value })
        }
      />

      <input
        placeholder="Email"
        value={userForm.email}
        onChange={(e) =>
          setUserForm({ ...userForm, email: e.target.value })
        }
      />

      <input
        placeholder="Password"
        value={userForm.password}
        onChange={(e) =>
          setUserForm({
            ...userForm,
            password: e.target.value,
          })
        }
      />

      <input
        placeholder="Address"
        value={userForm.address}
        onChange={(e) =>
          setUserForm({
            ...userForm,
            address: e.target.value,
          })
        }
      />

      <select
        value={userForm.role}
        onChange={(e) =>
          setUserForm({
            ...userForm,
            role: e.target.value,
          })
        }
      >
        <option value="USER">USER</option>
        <option value="OWNER">OWNER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      <button onClick={addUser}>
        Add User
      </button>

      <hr />

      <h2>Add Store</h2>

      <input
        placeholder="Store Name"
        value={storeForm.name}
        onChange={(e) =>
          setStoreForm({
            ...storeForm,
            name: e.target.value,
          })
        }
      />

      <input
        placeholder="Store Email"
        value={storeForm.email}
        onChange={(e) =>
          setStoreForm({
            ...storeForm,
            email: e.target.value,
          })
        }
      />

      <input
        placeholder="Address"
        value={storeForm.address}
        onChange={(e) =>
          setStoreForm({
            ...storeForm,
            address: e.target.value,
          })
        }
      />

      <input
        placeholder="Owner ID"
        value={storeForm.ownerId}
        onChange={(e) =>
          setStoreForm({
            ...storeForm,
            ownerId: e.target.value,
          })
        }
      />

      <button onClick={addStore}>
        Add Store
      </button>

      <hr />
      

      <h2>Filter Users</h2>

      <input
        placeholder="Name"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />

      <input
        placeholder="Email"
        value={emailFilter}
        onChange={(e) => setEmailFilter(e.target.value)}
      />

      <input
        placeholder="Address"
        value={addressFilter}
        onChange={(e) => setAddressFilter(e.target.value)}
      />

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="">All Roles</option>
        <option value="ADMIN">ADMIN</option>
        <option value="OWNER">OWNER</option>
        <option value="USER">USER</option>
      </select>

      <button onClick={filterUsers}>
        Filter
      </button>

      <hr />

      <h2>Users</h2>

      <table border={1}>
        <thead>
          <tr>
          <th>
  Name
  <button onClick={sortUsersByName}>
    ↑↓
  </button>
</th>

<th>
  Email
  <button onClick={sortUsersByEmail}>
    ↑↓
  </button>
</th>

<th>Address</th>
<th>Role</th>
<th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>

<td>
  <button
    onClick={() => viewUserDetails(user.id)}
  >
    View
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />

<h2>User Details</h2>

{selectedUser && (
  <div>
    <p>
      <strong>Name:</strong>{" "}
      {selectedUser.name}
    </p>

    <p>
      <strong>Email:</strong>{" "}
      {selectedUser.email}
    </p>

    <p>
      <strong>Address:</strong>{" "}
      {selectedUser.address}
    </p>

    <p>
      <strong>Role:</strong>{" "}
      {selectedUser.role}
    </p>

    {selectedUser.role === "OWNER" && (
      <p>
        <strong>Store Rating:</strong>{" "}
        {selectedUser.averageRating}
      </p>
    )}
  </div>
)}

      <hr />

      <h2>Stores</h2>

      <table border={1}>
        <thead>
          <tr>
           <th>
  Name
  <button onClick={sortStoresByName}>
    ↑↓
  </button>
</th>

<th>Email</th>
<th>Address</th>
<th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.averageRating ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;