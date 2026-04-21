import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Enter from "../../pages/Enter/Enter";
import Layout from "../Layout";
import MainPage from "../../pages/MainPage/MainPage";
import Profile from "../../pages/Profile/Profile";

export default function Router(): React.JSX.Element {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="enter" element={<Enter />} />
          <Route element={<Layout />}>
            <Route path="/main" element={<MainPage />}></Route>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
