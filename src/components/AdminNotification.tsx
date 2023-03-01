import React, { useEffect, useState } from "react";
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
  useEffect(() => {
    getAdminNotifications();
  }, []);
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
      if (notifications.length > 0) resetNotificationsFromServer();
      //destroy seen notifications
      setNotificationCounter(0);
    }
  }

  return (
    <div>
      <div className={styles.icon} onClick={handleNotificationIconClick}>
        <span className={styles.iconNotification}>
          <i className="far fa-bell "></i>
        </span>
        {notifications.length > 0 && notificationCounter > 0 && (
          <span className={styles.notificationNumber}>
            {notificationCounter}
          </span>
        )}
      </div>

      <div
        className={`${styles.notificationBox}`}
        style={{ height: height, opacity: opacity }}
      >
        <h2>New Notifications</h2>

        <div className={styles.notificationItem}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div className={styles.text} key={index}>
                <h4>{notification?.clerkId?.username || "System Admin"}</h4>
                <p>
                  {notification?.clerkId?.username || "System Admin"} inserted{" "}
                  {notification.count} questions
                </p>
              </div>
            ))
          ) : (
            <p>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
