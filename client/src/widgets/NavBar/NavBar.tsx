import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { signOut } from "../../entities/User/model/userThunks";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { getUserBalance } from "../../entities/Balances/model/balanceThunks";
import UpToModal from "../UpToModal/UpToModal";
import { connectSocket } from "../../services/socket";

export default function NavBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [upToModal, setUpToModal] = useState(false);
  const [notify, setNotify] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const { balance } = useAppSelector((state) => state.balance);

  console.log(notify);
  const logout = () => {
    dispatch(signOut());
    navigate("/enter");
  };

  useEffect(() => {
    dispatch(getUserBalance());
  }, [dispatch]);

  useEffect(() => {
    const socket = connectSocket();

    if (socket) {
      console.log("Socket instance created");

      socket.on("connect", () => {
        console.log("✅ SOCKET CONNECTED!", socket.id);
      });

      // socket.on("update_invoice", (data: any) => {
      //   setNotify(data.status);
      // });

      socket.on("connect_error", (err: any) => {
        console.error("❌ Socket error:", err);
      });
    }
  }, []);

  return (
    <header className={styles.container}>
      <div className={styles.logo} onClick={() => navigate("/main")}>
        WebInvoice
      </div>

      <div className={styles.center}>
        {user && (
          <span className={styles.greet}>
            Привет,{" "}
            <b>
              {user.userName}! Твой баланс {balance.credits}
            </b>
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.linkBtn} onClick={() => navigate("/profile")}>
          Кабинет
        </button>
        <button className={styles.linkBtn} onClick={() => setUpToModal(true)}>
          Пополнить баланс
        </button>
        <button className={styles.logoutBtn} onClick={logout}>
          Выйти
        </button>
        {notify && <div>{notify}</div>}
      </div>
      <UpToModal
        isOpen={upToModal}
        onClose={() => setUpToModal(false)}
      ></UpToModal>
    </header>
  );
}
