import React, { useState, useContext } from "react";
import { Link } from "gatsby";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
// import { MenuContext } from "../../context/Menu";
import { getCategoryURL } from "../../utils/url";

const Sidebar = props => {
  // const { closeMenu } = useContext(MenuContext);   
  const { title, data } = props;
  const [display, setDisplay] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const RenderList = () => {
    let list = [...data];
    if (!showAll) list = data.slice(0, 5);
    return list.map(
      ({ id, name, children_data, product_count }) =>
        product_count !== 0 && (
          <Link
            key={id}
            className="text-gray-800 hover:text-black hover:font-bold"
            to={getCategoryURL({ id, name })}
          >
            <div>
              <span className="mr-1">{name}</span>
              <span className="text-sm text-gray-600 mt-3 font-thin">
                ({product_count})
              </span>
            </div>
          </Link>
        )
    );
  };

  return (
    <div
      style={{
        width: props.width || "300px",
      }}
      className="filter mb-4"
    >
      
      <div
        className="bg-gray-200 p-3 font-bold flex items-center justify-between cursor-pointer"
        onClick={() => setDisplay(!display)}
      >
        {title}
        <div className="text-xl p-1">
          {display ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </div>
      </div>
      {display && (     
        <>
          <div className="filter__data p-3">
            <RenderList />
          </div>
          {data.length > 5 && (
            <div
              className="filter__view-more pt-0 p-3 text-blue-800 font-bold cursor-pointer inline-block hover:underline"
              onClick={() => setShowAll(!showAll)}
            >
              {!showAll ? "View More" : "View Less"}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
