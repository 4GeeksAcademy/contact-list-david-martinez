import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ children }) => {
    const { pathname } = useLocation();

    // Reading the pathname from the router guarantees the scroll resets on every route change.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return children;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
    children: PropTypes.node.isRequired,
};
