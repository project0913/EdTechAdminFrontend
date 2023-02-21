import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./adminsignup.css";
import { clerkLogin, clerkSignup } from "../../DataService/auth.service";
import { AxiosError } from "axios";
export default function ClerkAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [marginLeft, setMarginLeft] = useState("0%");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  function handleSignUpBtnClick(e: any) {
    setMarginLeft("-50%");
  }
  function handleLoginBtnClick(e: any) {
    setMarginLeft("0%");
  }
  async function handleLoginSubmit(e: any) {
    e.preventDefault();
    let result = await clerkLogin(username, password, token);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " ";
      setMessage(msgTxt);
    } else {
      localStorage.setItem(
        "coydoeClerkUser",
        JSON.stringify({ token: result?.token, username: result?.username })
      );
      console.log( result?.token);
      
      window.location.href = "/admin-user";
    }
  }
  async function handleSignupSubmit(e: any) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("password must match");
      return;
    }
    let result = await clerkSignup(username, password, token);
    if (result instanceof AxiosError) {
      let msgTxt = "";
      const messages =
        result.response?.data?.message ||
        (["something is wrong try again Later"] as Array<string>);
      for (const msg of messages) msgTxt += msg + " ";
      setMessage(msgTxt);
    } else {
      localStorage.setItem(
        "coydoeClerkUser",
        JSON.stringify({ token: result?.token, username: result?.username })
      );
      window.location.href = "/admin-user";
    }
  }
  useEffect(() => {
    let token = location.state?.token as string;
    if (!token) {
      navigate("/");
      return;
    }
    setToken(token);
  
  }, []);
  return (
    <div className="bg1">
      <div className="wrapper ">
        {message && <p style={{ color: "red" }}>{message}</p>}
        <div className="title-text">
          <div className="title login" style={{ marginLeft: marginLeft }}>
            Login
          </div>
          <div className={`title signup `}>Signup</div>
        </div>
        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" checked />
            <input type="radio" name="slide" id="signup" />
            <label
              htmlFor="login"
              className="slide login"
              onClick={handleLoginBtnClick}
            >
              Login
            </label>
            <label
              htmlFor="signup"
              className="slide signup"
              onClick={handleSignUpBtnClick}
            >
              SignUp
            </label>
            <div className="slider-tab"></div>
          </div>
          <div className="form-inner">
            <form
              className="login"
              onSubmit={handleLoginSubmit}
              style={{ marginLeft: marginLeft }}
            >
              <div className="field">
                <input
                  type="text"
                  placeholder="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pass-link">
                <a href="#">Forgot password?</a>
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link" onClick={handleSignUpBtnClick}>
                Not a Coydoe member? <span className="sign-span">SignUp </span>{" "}
                now
              </div>
            </form>
            <form className="signup" onSubmit={handleSignupSubmit}>
              <div className="field">
                <input
                  type="text"
                  placeholder="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
