import * as React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Menu from "./Menu";
import { BookmarkProps } from "../types";

interface BookmarkItemProps {
  selectedBookmarks: any[];
  bookmark: BookmarkProps;
  handleSelectBookmark: (e: any, bookmark: BookmarkProps) => void;
  deleteBookmark: (bookmark: BookmarkProps) => void;
  index: number;
  editBookmark: (bookmark: BookmarkProps) => void;
  moveBookmark: () => void;
  deleteBookmarkFromTrash: (bookmarks: BookmarkProps[]) => void;
  restoreBookmarkFromTrash: (bookmarks: BookmarkProps[]) => void;
  selectedFolder: any;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  selectedBookmarks,
  bookmark,
  handleSelectBookmark,
  deleteBookmark,
  index,
  editBookmark,
  moveBookmark,
  deleteBookmarkFromTrash,
  restoreBookmarkFromTrash,
  selectedFolder,
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
        checked={selectedBookmarks.includes(bookmark)}
        value={bookmark.id}
        readOnly
      />
      <label
        onClick={(e) => handleSelectBookmark(e, bookmark)}
        htmlFor={bookmark.title}
        className="cmdb-list-item"
        title="Double click to open"
        id={bookmark.id}
      >
        <span className="cmdb-list-item_title">
          <img
            src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}
            alt={bookmark.title}
          />
          {bookmark.title}
        </span>
        <span
          className="cmdb-list-item_kebab"
          onClick={() => setisopen(!isopen)}
        >
          <EllipsisVerticalIcon color="white" width="18" />
        </span>
      </label>
      {isopen && (
        <Menu
          setisopen={setisopen}
          deleteBookmark={() => deleteBookmark(bookmark)}
          bookmark={bookmark}
          editBookmark={editBookmark}
          moveBookmark={moveBookmark}
          deleteBookmarkFromTrash={() => deleteBookmarkFromTrash([bookmark])}
          selectedFolder={selectedFolder}
          restoreBookmarkFromTrash={() => restoreBookmarkFromTrash([bookmark])}
        />
      )}
    </div>
  );
};
