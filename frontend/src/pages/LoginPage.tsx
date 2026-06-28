import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

 const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      email: email.trim(),
      password: password.trim(),
    });

    console.log(res.data);

    login(res.data.token, res.data.role);

    if (res.data.role === "ADMIN") {
      navigate("/admin");
    } else if (res.data.role === "OWNER") {
      navigate("/owner");
    } else {
      navigate("/stores");
    }
  } catch (err: any) {
    console.log(err.response?.data);
    alert(err.response?.data?.message || "Login failed");
  }
};
  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
      <br />
<br />

<p>
  Don't have an account?{" "}
  <Link to="/register">
    Register Here
  </Link>
</p>
    </div>
  );
};

export default LoginPage;

