import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Breadcrumbs = () => {
    const location = useLocation();
    useEffect(() => {console.log(location)}, [])
    return(
        <div className="breadcrumbs">
            {location.pathname}
        </div>
    );
};

export default Breadcrumbs;