import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

export default function useGlobalReducer() {
    const context = useContext(StoreContext);

    if (!context) {
        throw new Error("useGlobalReducer must be used inside StoreProvider");
    }

    return context;
}
