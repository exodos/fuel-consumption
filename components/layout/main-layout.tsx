import { useContext } from "react";
import NotificationContext from "../../store/notification-context";
import Notification from "../ui/notification";
import axios from "axios";
import useSWR from "swr";
import NavBar from "./navbar";

const MainLayout = ({ children }) => {
  const notificationCtx = useContext(NotificationContext);
  const activeNotification = notificationCtx.notification;

  return (
    <>
      <NavBar>{children}</NavBar>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
      {/* </div> */}
    </>
  );
};

export default MainLayout;
