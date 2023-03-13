import { AxiosError } from "axios";

import { useState } from "react";
import "./adminlogin.css";
import { useNavigate } from "react-router-dom";
import { publicLogin } from "../../DataService/auth.service";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { override } from "../../utils/helper";

export default function AdminPublicLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginClerk = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let result = await publicLogin(username, password);
    if (result instanceof AxiosError) {
      setLoading(false);
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " ";
      setMessage(msgTxt);
    } else {
      setLoading(false);
      localStorage.setItem("coydoePublicUser", JSON.stringify({ token: true }));
      ///console.log(result?.token);

      navigate("/clerk-auth", { state: { token: result?.token } });
    }
  };
  return (
    <LoadingOverlayWrapper
      active={loading}
      spinner={
        <FadeLoader
          loading={loading}
          cssOverride={override}
          // size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      }
    >
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
    </LoadingOverlayWrapper>
  );
}
