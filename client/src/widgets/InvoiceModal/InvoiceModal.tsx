import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./InvoiceModal.module.css";
import {
  InvoiceFormValues,
  invoiceSchema,
} from "../../entities/Invoice/types/invoiceSchema";
import { createInvoice } from "../../entities/Invoice/model/invoiceThunks";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { setBalance } from "../../entities/Balances/model/balanceSlice";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InvoiceModal({ isOpen, onClose }: InvoiceModalProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      invoiceName: "",
      clientName: "",
      items: [{ name: "", quantity: null, price: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  if (!isOpen) return null;

  const calculateTotal = () => {
    if (!watchedItems) return 0;
    return watchedItems.reduce((sum, item) => {
      const qty = item?.quantity || 0;
      const prc = item?.price || 0;
      return sum + qty * prc;
    }, 0);
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    const total = calculateTotal();
    const items = data.items.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity),
      price: Number(item.price),
      total: Number(item.quantity) * Number(item.price),
    }));
    onClose();
    setIsLoading(true);
    try {
      const response = await dispatch(
        createInvoice({
          invoiceName: data.invoiceName,
          clientName: data.clientName,
          total,
          items,
        })
      ).unwrap();

      dispatch(setBalance(response.newBalance));
      reset();
    } catch (error) {
      console.error("Ошибка при создании инвойса:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Создание инвойса</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.body}>
            <div className={styles.invoiceNameField}>
              <label className={styles.label}>Название инвойса</label>
              <Controller
                control={control}
                name="invoiceName"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Например: Счет за услуги"
                    className={errors.invoiceName ? styles.error : ""}
                  />
                )}
              />
              {errors.invoiceName && (
                <span className={styles.errorText}>
                  {errors.invoiceName.message}
                </span>
              )}
            </div>

            <div className={styles.clientNameField}>
              <label className={styles.label}>Имя клиента</label>
              <Controller
                control={control}
                name="clientName"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Например: Иван Иванов"
                    className={errors.clientName ? styles.error : ""}
                  />
                )}
              />
              {errors.clientName && (
                <span className={styles.errorText}>
                  {errors.clientName.message}
                </span>
              )}
            </div>

            <div className={styles.itemsSection}>
              <h3 className={styles.itemsTitle}>Позиции инвойса</h3>

              <div className={styles.itemsHeader}>
                <span>Наименование</span>
                <span>Количество</span>
                <span>Цена</span>
                <span></span>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className={styles.itemRow}>
                  <div className={styles.field}>
                    <Controller
                      control={control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Наименование товара"
                          className={
                            errors.items?.[index]?.name ? styles.error : ""
                          }
                        />
                      )}
                    />
                    {errors.items?.[index]?.name && (
                      <span className={styles.errorText}>
                        {errors.items[index]?.name?.message}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <Controller
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          placeholder="Количество"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : Number(val));
                          }}
                          className={
                            errors.items?.[index]?.quantity ? styles.error : ""
                          }
                        />
                      )}
                    />
                    {errors.items?.[index]?.quantity && (
                      <span className={styles.errorText}>
                        {errors.items[index]?.quantity?.message}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <Controller
                      control={control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          placeholder="Цена"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? null : Number(val));
                          }}
                          className={
                            errors.items?.[index]?.price ? styles.error : ""
                          }
                        />
                      )}
                    />
                    {errors.items?.[index]?.price && (
                      <span className={styles.errorText}>
                        {errors.items[index]?.price?.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                className={styles.addBtn}
                onClick={() =>
                  append({ name: "", quantity: null, price: null })
                }
              >
                + Добавить позицию
              </button>

              <div className={styles.total}>
                <strong>Итого:</strong> {calculateTotal().toLocaleString()} ₽
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Создание..." : "Создать инвойс"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
