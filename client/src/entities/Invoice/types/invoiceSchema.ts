import { z } from "zod";

export const invoiceItemSchema = z.object({
  name: z.string().min(1, "Наименование обязательно"),
  quantity: z.number().min(1, "Количество должно быть больше 0"),
  price: z.number().min(1, "Цена должна быть больше 0"),
});

export const invoiceSchema = z.object({
  invoiceName: z.string().min(1, "Название инвойса обязательно"),
  clientName: z.string().min(1, "Имя клиента обязательно"),
  items: z.array(invoiceItemSchema).min(1, "Добавьте хотя бы одну позицию"),
});

export const InvoiceFormSchema = z.object({
  invoiceName: z.string().min(1, "Название инвойса обязательно"),
  clientName: z.string().min(1, "Имя клиента обязательно"),
  total: z.number().min(1, "Сумма должна быть больше 0"), // 👈 добавить
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Наименование обязательно"),
        quantity: z
          .number()
          .min(1, "Количество должно быть больше 0")
          .nullable(),
        price: z.number().min(1, "Цена должна быть больше 0").nullable(),
      })
    )
    .min(1, "Добавьте хотя бы одну позицию"),
});

export type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>;

// Схема для позиции инвойса (из ответа)
export const InvoiceItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
  invoice_id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Схема для инвойса (из ответа сервера)
export const InvoiceSchema = z.object({
  id: z.number(),
  status: z.string(),
  total: z.number(),
  pdf_url: z.string().nullable(),
  user_id: z.number(),
  client_name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  Invoice_items: z.array(InvoiceItemSchema), // 👈 ключ как в ответе
});

// Схема для массива инвойсов
export const InvoicesListSchema = z.array(InvoiceSchema);

// Типы
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoicesList = z.infer<typeof InvoicesListSchema>;

// Если хочешь отформатированный вариант для клиента
export const FormattedInvoiceSchema = z.object({
  id: z.number(),
  status: z.string(),
  total: z.number(),
  clientName: z.string(),
  createdAt: z.string().datetime(),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
      total: z.number(),
    })
  ),
});

export type FormattedInvoice = z.infer<typeof FormattedInvoiceSchema>;

// Схема для баланса
export const BalanceSchema = z.object({
  id: z.number(),
  credits: z.number(),
  user_id: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Схема для полного ответа
// Схема для ответа сервера
export const CreateInvoiceResponseSchema = z.object({
  newBalance: z.object({
    id: z.number(),
    credits: z.number(),
    user_id: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
      total: z.number(),
      invoice_id: z.number(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
  ),
  invoice: z.object({
    id: z.number(),
    status: z.string(),
    user_id: z.number(),
    client_name: z.string(),
    total: z.number(),
    pdf_url: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
});

// Типы
export type Balance = z.infer<typeof BalanceSchema>;
export type CreateInvoiceResponse = z.infer<typeof CreateInvoiceResponseSchema>;

export const changeInvoiceSchema = z.object({
  status: z.string(),
  id: z.number(),
});

export type changeInvoiceType = z.infer<typeof changeInvoiceSchema>;
