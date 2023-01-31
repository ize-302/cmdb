import React, { useEffect, useState } from "react";
import {
  ExclamationCircleIcon,
  FolderPlusIcon,
  PencilIcon,
  PencilSquareIcon,
  ArrowsRightLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BookmarkItem } from "./BookmarkItem";
import { BookmarkProps } from "../types";
import { CMDB_TRASH } from "../keys";
import Menu from "./Menu";

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
  restoreBookmarkFromTrash: (bookmarks: BookmarkProps[]) => void;
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
  restoreBookmarkFromTrash,
  trash,
}) => {
  const [isopen, setisopen] = React.useState(false);

  const handleSelectBookmark = (e: any, bookmark: any, index: number) => {
    if (e.shiftKey) {
      const previouslyselected = [...selectedBookmarks];
      // check if bookmark has already been selected
      const hasPreviouslyBeenSelected = previouslyselected.find(
        (item) => item.id === bookmark.id
      );
      if (hasPreviouslyBeenSelected) {
        const filtered = previouslyselected.filter(
          (item) => item.id !== bookmark.id
        );
        setselectedBookmarks(filtered);
      }
      if (!hasPreviouslyBeenSelected) {
        previouslyselected.push(bookmark);
        console.log(previouslyselected);
        setselectedBookmarks(previouslyselected);
      }
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
          <div className="cmdb-page-heading-actions">
            {selectedFolder.parentId ? (
              <>
                <span
                  className="cmdb-list-item_kebab"
                  onClick={() => setisopen(!isopen)}
                >
                  <FolderPlusIcon color="white" width="17" />
                </span>
                {selectedFolder.parentId !== "0" && (
                  <>
                    <span
                      className="cmdb-list-item_kebab"
                      onClick={() => setisopen(!isopen)}
                    >
                      <PencilSquareIcon color="white" width="17" />
                    </span>
                    <span
                      className="cmdb-list-item_kebab"
                      onClick={() => setisopen(!isopen)}
                    >
                      <ArrowsRightLeftIcon color="white" width="17" />
                    </span>

                    <span
                      className="cmdb-list-item_kebab"
                      onClick={() => setisopen(!isopen)}
                    >
                      <TrashIcon color="red" width="17" />
                    </span>
                  </>
                )}
              </>
            ) : null}
            {selectedFolder?.id === CMDB_TRASH && trash.length > 0 && (
              <span
                className="cmdb-list-item_kebab"
                onClick={() => handleEmptyTrash()}
              >
                <TrashIcon color="red" width="17" />
              </span>
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
                restoreBookmarkFromTrash={restoreBookmarkFromTrash}
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
              <>
                <button
                  onClick={() => restoreBookmarkFromTrash(selectedBookmarks)}
                >
                  Restore
                </button>
                <button
                  className="delete"
                  onClick={() => deleteBookmarkFromTrash(selectedBookmarks)}
                >
                  Delete
                </button>
              </>
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
