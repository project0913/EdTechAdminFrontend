import { AxiosError } from "axios";
import { useState } from "react";
import styles from "./adminlogin.module.css";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../DataService/auth.service";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { FadeLoader } from "react-spinners";
import { override } from "../../utils/helper";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginAdmin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    let result = await adminLogin(username, password);
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
      localStorage.setItem(
        "coydoeAdminUser",
        JSON.stringify({ token: result.token, username: result.username })
      );
      ///console.log(result?.token);

      window.location.href = "/admin";
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
      <div className={styles.bg}>
        <div className={styles.wrapper}>
          {message && <p style={{ color: "red" }}>{message}</p>}
          <div className={styles.titleText}>
            <div className={styles.titleLogin}>Login</div>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.formInner}>
              <form className={styles.login} onSubmit={loginAdmin}>
                <div className={styles.field}>
                  <input
                    type="text"
                    placeholder="Email Address"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className={styles.btn}>
                  <div className={styles.btnLayer}></div>
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
