import React, { useEffect, useState } from "react";
import styles from "./adminuserpage.module.css";
import PlainQuestionData from "../PlainQuestionPage/PlainQuestionData";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getClerkInfoFromServer } from "../../DataService/clerkData.service";

export default function AdminUserPage() {
  const [totalData,setTotalData] = useState(0);
  const [balance,setBalance] = useState(0);
  const [username,setUsername] = useState('');
  const navigate = useNavigate();

  const getClerkData = async () =>{ 
    const user = await getClerkInfoFromServer();
    setTotalData(user.questionsEntered);
    setBalance(user.questionsEntered * 3);
    setUsername(user.username);
  }
  useEffect(()=>{
    getClerkData();
  },[]);
  const logout = async () =>{ 
    localStorage.removeItem('coydoePublicUser');
    localStorage.removeItem('coydoeClerkUser');
    navigate('/',{replace:true});
  }
  return (
    <div>
      <div className={styles.top}>
      <div className={styles.iconContainer}>
        <i className={`fas fa-user  ${styles.userIcon}`}></i>
        </div>
        <div  className={styles.username}>
        <span >{username.toUpperCase()}</span>
        </div>
        
       
        <span className={styles.topBalance}>
       
        <label className={styles.balanceLabel}>Your Total Data </label><span className={styles.spanLabel}>{totalData}</span>
        <label className={styles.balanceLabel}>Your Balance </label><span className={styles.spanLabel}>{balance}</span>
        </span>
        <span><button onClick={()=>logout()} className={styles.logoutBtn}>Log out <i className="fas fa-sign-out-alt"></i></button></span>
      </div>
      <div className={styles.content}>
        <div className={styles.leftBar}>
          <ul className={styles.ulLeftBar}>
            <li className={styles.leftBarText}>
              <b>Data Insertion</b>{" "}
            </li>
            <li>
              <Link to={""}>
                <button className={styles.btnList}>
                  Insert Plain Questions
                </button>
              </Link>
            </li>
            <li>
              <Link to={"direction"}>
                <button className={styles.btnList}>Insert Directions</button>
              </Link>
            </li>
            <li >
              <Link to={"grouped-question"}>
                <button className={styles.btnList}>
                  Insert Grouped Question
                </button>
              </Link>
            </li>
            <li className={styles.leftBarText}>
              <b>Data Editing</b>{" "}
            </li>
            <li>
              <Link to={"view-plain-questions"}>
                <button className={styles.btnList}>
                  View Plain Questions{" "}
                </button>
              </Link>
            </li>
            <li>
              <Link to={"view-directions"}>
                <button className={styles.btnList}>View Directions </button>
              </Link>
            </li>

            <li>
              <Link to={"view-grouped-questions"}>
                <button className={styles.btnList}>
                  View Grouped Question{" "}
                </button>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.rightBar}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
