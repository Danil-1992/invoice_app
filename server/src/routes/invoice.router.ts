import { Router } from "express";
import verifyAccessToken from "../middlewares/verifyAccessToken";
import InvoiceController from "../controllers/invoice.controller";

const invoiceRouter = Router();

invoiceRouter.get(
  "/invoicesByUser",
  verifyAccessToken,
  InvoiceController.getInvoicesByUserId
);
invoiceRouter.post("/pdf", verifyAccessToken, InvoiceController.createInvoice);
invoiceRouter.get("/:id", verifyAccessToken, InvoiceController.generatePdf);

export default invoiceRouter;
