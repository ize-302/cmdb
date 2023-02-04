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
  children: any;
}

const Menu: React.FC<MenuProps> = ({ setisopen, children }) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, setisopen);

  return (
    <ul ref={wrapperRef} className="cmdb-menu">
      {children}
    </ul>
  );
};

export default Menu;
