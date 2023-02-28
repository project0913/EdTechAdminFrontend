import React, { useState } from "react";
import styles from "./adminNotification.module.css";
import {
  AdminNotificationDto,
  fetchAdminNotifications,
  resetAdminNotifications,
} from "../DataService/adminNotification.service";

export default function AdminNotification() {
  const [height, setHeight] = useState<string>("0%");
  const [message, setMessage] = useState<string>("");
  const [down, setDown] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [notifications, setNotifications] = useState<AdminNotificationDto[]>(
    []
  );
  const getAdminNotifications = async () => {
    const data = await fetchAdminNotifications();
    if (data.length == 0) {
      setMessage("It looks Like you don't have new Notifications");
      return;
    }
    setNotifications((prev) => data);
    setNotificationCounter(data.length);
  };
  const resetNotificationsFromServer = async () => {
    if (notifications.length == 0) return;
    let notificationIds: string[] = [];
    for (const notification of notifications) {
      notificationIds.push(notification._id || "");
    }
    const data = await resetAdminNotifications(notificationIds);
  };
  function handleNotificationIconClick(e: any) {
    if (down) {
      setHeight("0px");
      setOpacity(0);
      setDown(false);
    } else {
      setHeight("25%");
      setDown(true);
      setOpacity(1);
    }
  }

  return (
    <div>
      <div className={styles.icon} onClick={handleNotificationIconClick}>
        <span className={styles.iconNotification}>
          <i className="far fa-bell "></i>
        </span>
        <span className={styles.notificationNumber}>2</span>
      </div>

      <div
        className={`${styles.notificationBox}`}
        style={{ height: height, opacity: opacity }}
      >
        <h2>
          Notifications <span>6</span>
        </h2>
        <div className={styles.notificationItem}>
          <div className={styles.text}>
            <h4>Lesi Belay</h4>
            <p>
              Hi Keno (username), Throughout this course, I aim to push you
              (course ID). I'm going to put forward a
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
