import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const Breadcrumbs = ({bookName}) => {
    const location = useLocation();
    const params = useParams();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    
    useEffect(() => {
        if(params.bookId && bookName){
            const crumbs = location.pathname.split("/").filter(crumb => crumb != "").slice(0, -2)
            crumbs.push(bookName);
            const crumbsElements = crumbs.map((crumb, index) => (
              index === crumbs.length - 1 ? (
                <span key={index} className="breadcrumb last book-name">{crumb}</span>
              ) : (
                <Link to={`/${crumb}`} className="breadcrumb" key={index}>
                  {crumb}/
                </Link>
              )
            ));
            setBreadcrumbs(crumbsElements);

        }else{
            const crumbs = location.pathname.split("/").filter(breadcrumb => breadcrumb != "");
            const crumbsElements = crumbs.map((crumb, index) => (
                index === crumbs.length - 1 ? (
                    <span key={index} className="breadcrumb last">{crumb}</span>
                  ) : (
                    <Link to={`/${crumb}`} className="breadcrumb" key={index}>
                      {crumb}/
                    </Link>
                  )
            ))
            setBreadcrumbs(crumbsElements);
        }

    }, [])

    return(
        <div className="breadcrumbs">
            {breadcrumbs && breadcrumbs}
        </div>
    );
};

export default Breadcrumbs;