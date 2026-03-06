import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { router } from "./routes";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    </StrictMode>
);
