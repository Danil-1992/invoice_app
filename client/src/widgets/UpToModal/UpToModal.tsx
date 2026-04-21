import React, { useState } from "react";
import { useAppDispatch } from "../../shared/hooks/hooks";
import { toUpBalance } from "../../entities/Balances/model/balanceThunks";

export default function UpToModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const [summ, setSumm] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const amount = Number(summ);
    if (amount > 0) {
      dispatch(toUpBalance(amount));
      setSumm("");
      onClose();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "300px",
          maxWidth: "90vw",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ fontWeight: 500 }}>Введите сумму пополнения</label>

          <input
            type="number"
            min={1}
            max={100000}
            value={summ}
            placeholder="10"
            onChange={(e) => setSumm(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                border: "1px solid #ccc",
                background: "white",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Отменить
            </button>
            <button
              onClick={handleConfirm}
              disabled={!summ || Number(summ) < 1}
              style={{
                padding: "8px 16px",
                background: "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Пополнить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
