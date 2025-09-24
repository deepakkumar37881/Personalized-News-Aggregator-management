import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import reportWebVitals from "./reportWebVitals.js";
import Source from "./pages/Source.jsx";
import LatestNews from "./pages/LatestNews.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing.jsx";
import Home from "./pages/Home.jsx";
import SavedNews from "./pages/SavedNews.jsx";
import DomainNews from "./pages/DomainNews.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/sources" element={<Source />} />
      <Route path="/latest-news" element={<LatestNews />} />
      <Route path="/saved" element={<SavedNews />} />
      <Route path="/domain-news" element={<DomainNews />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RouterProvider router={router} />
    </PersistGate>
  </Provider>
  
);


reportWebVitals();