import { AxiosError } from "axios";

import { useState } from "react";
import "./adminlogin.css";
import { useNavigate } from "react-router-dom";
import { publicLogin } from "../../DataService/auth.service";

export default function AdminPublicLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loginClerk = async (e: any) => {
    e.preventDefault();

    let result = await publicLogin(username, password);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " ";
      setMessage(msgTxt);
    } else {
      localStorage.setItem("coydoePublicUser", JSON.stringify({ token: true }));
      ///console.log(result?.token);

      navigate("/clerk-auth", { state: { token: result?.token } });
    }
  };
  return (
    <div className="public-login-container">
      <div className="public-wrapper">
        {message && <p style={{ color: "red" }}>{message}</p>}
        <div className="title-text">
          <div className="title login">Login</div>
        </div>
        <div className="public-form-container">
          <div className="public-form-inner">
            <form onSubmit={loginClerk}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
