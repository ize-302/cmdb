import * as React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface BookmarkItemProps {
  selectedBookmarks: any[];
  bookmark: any;
  handleSelectBookmark: (e: any, bookmark: any) => void;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  selectedBookmarks,
  bookmark,
  handleSelectBookmark,
}) => {
  return (
    <div>
      <input
        type="checkbox"
        name="items"
        checked={selectedBookmarks.includes(bookmark.id)}
        id={bookmark.id}
        value={bookmark.id}
        readOnly
      />
      <label
        onClick={(e) => handleSelectBookmark(e, bookmark)}
        htmlFor={bookmark.title}
        className="cmdb-app-content-bookmark-item"
        title="Double click to open"
      >
        <span className="cmdb-app-content-bookmark-item_title">
          <img
            src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}
          />
          {bookmark.title}
          <span className="cmdb-app-content-bookmark-item_url">
            {bookmark.url}
          </span>
        </span>
        <span className="cmdb-app-content-bookmark-item_kebab">
          <EllipsisVerticalIcon color="white" width="18" />
        </span>
      </label>
    </div>
  );
};
