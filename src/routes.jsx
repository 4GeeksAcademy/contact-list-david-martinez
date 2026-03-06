import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { EditContact } from "./pages/EditContact";
import { AddContact } from "./pages/AddContact"; 

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<div className="text-center mt-5"><h1>404 Not found!</h1></div>} >
        <Route index element={<Home />} />
        <Route path="edit/:id" element={<EditContact />} />
        <Route path="add" element={<AddContact />} />
      </Route>
    )
);
