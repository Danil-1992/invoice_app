import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../shared/hooks/hooks";
import styles from "./Profile.module.css";
import { generatePdf } from "../../entities/Invoice/model/invoiceThunks";

export default function Profile(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state.invoices);
  const [err, setErr] = useState("");

  if (invoices.length === 0) {
    return (
      <div className={styles.empty}>
        На данный момент у вас нет созданных инвойсов
      </div>
    );
  }
  console.log(err);

  const handleDownloadPdf = async (id: string) => {
    try {
      const pdfUrl = await dispatch(generatePdf(Number(id))).unwrap();
      window.open(pdfUrl, "_blank");
    } catch (error) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Произошла неизвестная ошибка");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Мои инвойсы</h2>
      <div className={styles.invoicesList}>
        {invoices.map((invoice) => (
          <div key={invoice.id} className={styles.invoiceCard}>
            <div className={styles.invoiceHeader}>
              <div className={styles.clientInfo}>
                <span className={styles.clientName}>{invoice.client_name}</span>
              </div>
              <div className={styles.total}>Итого: {invoice.total} ₽</div>
            </div>

            <div className={styles.itemsTable}>
              <div className={styles.itemsHeader}>
                <span>Наименование</span>
                <span>Цена</span>
                <span>Количество</span>
                <span>Сумма</span>
              </div>
              {invoice.Invoice_items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <span>{item.name}</span>
                  <span>{item.price} ₽</span>
                  <span>{item.quantity} шт.</span>
                  <span>{item.total} ₽</span>
                </div>
              ))}
            </div>

            <div className={styles.invoiceFooter}>
              <div className={styles.createdAt}>
                Создан: {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
              <div className={styles.actions}>
                {invoice.pdf_url && (
                  <button
                    className={styles.downloadBtn}
                    onClick={() => handleDownloadPdf(invoice.id.toString())}
                  >
                    📄 Скачать PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
