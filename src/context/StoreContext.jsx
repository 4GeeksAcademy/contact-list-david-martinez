import { createContext, useReducer } from "react";
import PropTypes from "prop-types";
import storeReducer, { initialStore } from "../store";

export const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    return <StoreContext.Provider value={{ store, dispatch }}>{children}</StoreContext.Provider>;
}

StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
