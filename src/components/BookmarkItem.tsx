import * as React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

function useOutsideAlerter(ref: any, setisopen: any) {
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
}

const Menu: React.FC<MenuProps> = ({ setisopen, deleteBookmark, bookmark }) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, setisopen);

  return (
    <ul ref={wrapperRef} className="cmdb-app-menu">
      <li
        className="cmdb-app-menu-item"
        onClick={() => window.open(bookmark.url, "_blank")}
      >
        Open
      </li>
      <li className="cmdb-app-menu-item">Edit</li>
      <li
        className="cmdb-app-menu-item delete"
        onClick={() => deleteBookmark()}
      >
        Delete
      </li>
    </ul>
  );
};

interface BookmarkItemProps {
  selectedBookmarks: any[];
  bookmark: any;
  handleSelectBookmark: (e: any, bookmark: any) => void;
  deleteBookmark: (bookmark: any) => void;
  index: number;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  selectedBookmarks,
  bookmark,
  handleSelectBookmark,
  deleteBookmark,
  index,
}) => {
  const [isopen, setisopen] = React.useState(false);
  const dragItem = React.useRef();

  const dragStart = (e: any, position: any) => {
    dragItem.current = position;
    console.log(e.target);
  };

  return (
    <div
      style={{ position: "relative" }}
      draggable
      onDragStart={(e) => dragStart(e, index)}
      id={bookmark.id}
    >
      <input
        type="checkbox"
        name="items"
        checked={selectedBookmarks.includes(bookmark.id)}
        value={bookmark.id}
        readOnly
      />
      <label
        onClick={(e) => handleSelectBookmark(e, bookmark)}
        htmlFor={bookmark.title}
        className="cmdb-app-content-bookmark-item"
        title="Double click to open"
        id={bookmark.id}
      >
        <span className="cmdb-app-content-bookmark-item_title">
          <img
            src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}
          />
          {bookmark.title}
        </span>
        <span
          className="cmdb-app-content-bookmark-item_kebab"
          onClick={() => setisopen(!isopen)}
        >
          <EllipsisVerticalIcon color="white" width="18" />
        </span>
      </label>
      {isopen && (
        <Menu
          setisopen={setisopen}
          deleteBookmark={() => {
            deleteBookmark(bookmark);
            setisopen(false);
          }}
          bookmark={bookmark}
        />
      )}
    </div>
  );
};
