import React, { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { BookmarkItem } from "./BookmarkItem";

interface ContentProps {
  bookmarksOnView: any[];
  selectedFolder: any;
  deleteBookmark: (bookmark: any) => void;
}

export const Content: React.FC<ContentProps> = ({
  bookmarksOnView,
  selectedFolder,
  deleteBookmark,
}) => {
  const [selectedBookmarks, setselectedBookmarks] = React.useState<string[]>(
    []
  );
  const handleSelectBookmark = (e: any, bookmark: any, index: number) => {
    if (e.shiftKey) {
      const previouslyselected = [...selectedBookmarks];
      previouslyselected.push(bookmark.id);
      setselectedBookmarks(previouslyselected);
    } else {
      if (e.detail === 1) setselectedBookmarks([bookmark.id]);
      else if (e.detail === 2) window.open(bookmark.url, "_blank");
    }
  };

  return (
    <div className="cmdb-app-content">
      {bookmarksOnView?.length === 0 ? (
        <div className="cmdb-app-content-nobookmark">
          <ExclamationCircleIcon width="34" opacity={0.4} />
          <p>Nothing to see here!</p>
        </div>
      ) : (
        <div className="cmdb-app-content-bookmarklist">
          <b className="cmdb-app-content-bookmarkheader">
            {selectedFolder?.title || "Recently added"}
          </b>
          {bookmarksOnView?.map((bookmark, index) => (
            <BookmarkItem
              key={index}
              index={index}
              bookmark={bookmark}
              handleSelectBookmark={(e, bookmark) =>
                handleSelectBookmark(e, bookmark, index)
              }
              selectedBookmarks={selectedBookmarks}
              deleteBookmark={deleteBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
