import React from "react";

export function useOutsideAlerter(ref: any, setisopen: any) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: { target: any }) {
      if (ref.current && !ref.current.contains(event.target)) {
        setisopen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

interface MenuProps {
  setisopen: (payload: boolean) => void;
  deleteBookmark: () => void;
  bookmark: any;
  editBookmark: (bookmark: any) => void;
}

const Menu: React.FC<MenuProps> = ({
  setisopen,
  deleteBookmark,
  bookmark,
  editBookmark,
}) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, setisopen);

  return (
    <ul ref={wrapperRef} className="cmdb-menu">
      <li
        className="cmdb-menu-item"
        onClick={() => {
          window.open(bookmark.url, "_self");
          setisopen(false);
        }}
      >
        Open
      </li>
      <li
        className="cmdb-menu-item"
        onClick={() => {
          window.open(bookmark.url, "_blank");
          setisopen(false);
        }}
      >
        Open in new tab
      </li>
      <li className="cmdb-menu-item">Move</li>
      <li
        className="cmdb-menu-item"
        onClick={() => {
          editBookmark(bookmark);
          setisopen(false);
        }}
      >
        Edit
      </li>
      <li
        className="cmdb-menu-item delete"
        onClick={() => {
          deleteBookmark();
          setisopen(false);
        }}
      >
        Delete
      </li>
    </ul>
  );
};

export default Menu;
