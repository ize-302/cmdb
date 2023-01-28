import React, { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { BookmarkItem } from "./BookmarkItem";
import { BookmarkProps } from "../types";

interface ContentProps {
  bookmarksOnView: BookmarkProps[];
  selectedFolder: any;
  deleteBookmark: (bookmark: BookmarkProps) => void;
  editBookmark: (bookmark: BookmarkProps) => void;
}

export const Content: React.FC<ContentProps> = ({
  bookmarksOnView,
  selectedFolder,
  deleteBookmark,
  editBookmark,
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
    <div className="cmdb-content-section">
      <div className="cmdb-list">
        <b className="cmdb-page-title">
          {selectedFolder?.title || "Recently added"}
        </b>
        {bookmarksOnView?.length === 0 ? (
          <div className="cmdb-empty-page">
            <ExclamationCircleIcon width="34" opacity={0.4} />
            <p>Nothing to see here!</p>
          </div>
        ) : (
          <>
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
                editBookmark={editBookmark}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
