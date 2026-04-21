import { useState } from "react";
import styles from "./MainPage.module.css";
import InvoiceModal from "../../widgets/InvoiceModal/InvoiceModal";

export default function MainPage() {
  const [modal, setModal] = useState(false);
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Управление инвойсами без лишней сложности
        </h1>
        <p className={styles.subtitle}>
          Создавайте, отправляйте и отслеживайте инвойсы в одном месте.
          Контролируйте платежи и держите финансы под контролем.
        </p>
        <button className={styles.primaryButton} onClick={() => setModal(true)}>
          Создать инвойс
        </button>
      </section>

      <section className={styles.features}>
        <h2>Возможности</h2>
        <ul>
          <li>Быстрое создание инвойсов</li>
          <li>Отслеживание платежей и транзакций</li>
          <li>Контроль баланса</li>
          <li>Удобное хранение данных клиентов</li>
        </ul>
      </section>

      <section className={styles.info}>
        <h2>Зачем это нужно</h2>
        <p>
          Ручное ведение инвойсов — это долго и неудобно. Система помогает
          автоматизировать процесс и сосредоточиться на работе.
        </p>
      </section>

      <section className={styles.cta}>
        <h2>Начните прямо сейчас</h2>
        <p>Создайте свой первый инвойс и упростите управление финансами.</p>
        <button className={styles.secondaryButton}>Попробовать сейчас</button>
      </section>
      <InvoiceModal
        isOpen={modal}
        onClose={() => setModal(false)}
      ></InvoiceModal>
    </div>
  );
}
