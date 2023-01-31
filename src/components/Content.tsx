import React, { useEffect, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { BookmarkItem } from "./BookmarkItem";
import { BookmarkProps } from "../types";
import { CMDB_TRASH } from "../keys";

interface ContentProps {
  bookmarksOnView: BookmarkProps[];
  selectedFolder: any;
  // deleteBookmark: (bookmark: BookmarkProps) => void;
  editBookmark: (bookmark: BookmarkProps) => void;
  setselectedBookmarks: (value: BookmarkProps[]) => void;
  selectedBookmarks: any[];
  deleteBookmarks: () => void;
  moveBookmarks: () => void;
  deleteBookmarkFromTrash: (bookmarks: BookmarkProps[]) => void;
  handleEmptyTrash: () => void;
  trash: BookmarkProps[];
}

export const Content: React.FC<ContentProps> = ({
  bookmarksOnView,
  selectedFolder,
  // deleteBookmark,
  editBookmark,
  selectedBookmarks,
  setselectedBookmarks,
  deleteBookmarks,
  moveBookmarks,
  deleteBookmarkFromTrash,
  handleEmptyTrash,
  trash,
}) => {
  const handleSelectBookmark = (e: any, bookmark: any, index: number) => {
    if (e.shiftKey) {
      const previouslyselected = [...selectedBookmarks];
      previouslyselected.push(bookmark);
      setselectedBookmarks(previouslyselected);
    } else {
      if (e.detail === 1) setselectedBookmarks([bookmark]);
      else if (e.detail === 2) window.open(bookmark.url, "_blank");
    }
  };

  return (
    <div className="cmdb-content-section">
      <div className="cmdb-list">
        <div className="cmdb-page-heading">
          <b className="cmdb-page-title">
            {selectedFolder?.title || "Recently added"}
          </b>
          <div>
            {selectedFolder?.id === CMDB_TRASH && trash.length > 0 && (
              <button onClick={() => handleEmptyTrash()}>Empty Trash</button>
            )}
          </div>
        </div>
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
                deleteBookmark={deleteBookmarks}
                editBookmark={editBookmark}
                moveBookmark={moveBookmarks}
                deleteBookmarkFromTrash={deleteBookmarkFromTrash}
                selectedFolder={selectedFolder}
              />
            ))}
          </>
        )}
      </div>
      {/* actions for multiple selection */}
      {selectedBookmarks.length > 1 && (
        <div className="cmdb-content-actions">
          <span>
            <b style={{ fontWeight: 600 }}>{selectedBookmarks.length}</b> items
          </span>
          <div className="cmdb-content-actions-controls">
            {selectedFolder?.id === CMDB_TRASH ? (
              <button
                className="delete"
                onClick={() => deleteBookmarkFromTrash(selectedBookmarks)}
              >
                Delete
              </button>
            ) : (
              <>
                <button onClick={() => moveBookmarks()}>Move</button>
                <button className="delete" onClick={() => deleteBookmarks()}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
