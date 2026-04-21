// client/src/components/ToastProvider.tsx
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { connectSocket } from "../../services/socket";
import {
  changeStatus,
  clearInvoiceError,
} from "../../entities/Invoice/model/invoiceSlice";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";

export function ToastProvider() {
  const dispatch = useAppDispatch();
  const { invoiceError } = useAppSelector((state) => state.invoices);

  // Обработка ошибок из Redux
  useEffect(() => {
    if (invoiceError) {
      toast.error(invoiceError, { id: "invoice-error" });
      dispatch(clearInvoiceError());
    }
  }, [invoiceError, dispatch]);

  // Socket соединение и обработка статусов
  useEffect(() => {
    const socket = connectSocket();

    socket.on("update_invoice", (data: any) => {
      const { status, message, pdfUrl, invoiceId } = data;

      console.log("📡 Получен статус:", status, "ID:", invoiceId, pdfUrl);

      // Обновляем статус в Redux
      if (status === "completed") {
        dispatch(changeStatus({ status, id: invoiceId }));
      }

      // ✅ Удаляем старый тост перед созданием нового
      toast.dismiss("invoice");

      switch (status) {
        case "pending":
          toast.loading("🟡 Создание инвойса...", {
            id: "invoice",
            duration: Infinity,
          });
          break;

        case "balance_debited":
          toast.loading("💰 Баланс списан, начинаем генерацию...", {
            id: "invoice",
            duration: Infinity,
          });
          break;

        case "processing":
          toast.loading("📄 Генерация PDF...", {
            id: "invoice",
            duration: Infinity,
          });
          break;

        case "uploading":
          toast.loading("☁️ Загрузка в MinIO...", {
            id: "invoice",
            duration: Infinity,
          });
          break;

        case "completed":
          // Удаляем loading тост
          toast.dismiss("invoice");
          // Показываем success тост
          toast.success(
            (t) => (
              <div>
                <strong>✅ PDF готов!</strong>
                {pdfUrl && (
                  <div style={{ marginTop: "8px" }}>
                    <a
                      href={`http://localhost:9000/invoices/${pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#22c55e" }}
                    >
                      📥 Скачать PDF
                    </a>
                  </div>
                )}
              </div>
            ),
            { id: "invoice", duration: 8000 }
          );
          break;

        case "failed":
          toast.dismiss("invoice");
          toast.error(`❌ ${message || "Ошибка генерации PDF"}`, {
            id: "invoice",
            duration: 5000,
          });
          break;

        default:
          if (message) {
            toast.dismiss("invoice");
            toast(message, { id: "invoice", duration: 4000 });
          }
      }
    });

    // Очистка при размонтировании
    return () => {
      socket.off("update_invoice");
      toast.dismiss();
    };
  }, [dispatch]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#363636",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        success: {
          duration: 6000,
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
        loading: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
