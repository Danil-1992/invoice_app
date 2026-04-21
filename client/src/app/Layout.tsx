import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../shared/hooks/hooks";
import { refresh } from "../entities/User/model/userThunks";
import NavBar from "../widgets/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import { getAllInvoicesByUser } from "../entities/Invoice/model/invoiceThunks";

export default function Layout(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { invoices, invoiceError } = useAppSelector((state) => state.invoices);
  console.log(invoiceError);

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllInvoicesByUser());
  }, [dispatch]);

 
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}
