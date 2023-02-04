import React from "react";
import {
  ExclamationCircleIcon,
  FolderPlusIcon,
  PencilSquareIcon,
  ArrowsRightLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { BookmarkItem } from "./BookmarkItem";
import { BookmarkProps } from "../types";
import {
  CMDB_TRASH,
  CMDB_MOVE_ITEM,
  CMDB_MOVED_BOOKMARK_MSG,
  CMDB_UPDATE_ITEM,
  CMDB_DELETE_BOOKMARK,
} from "../keys";
import Menu from "./Menu";
import MoveBookmarkModal from "./MoveBookmarkModal";
import toast from "react-hot-toast";
import EditBookmarkModal from "./EditBookmarkModal";

interface ContentProps {
  bookmarksOnView: BookmarkProps[];
  selectedFolder: any;
  setselectedBookmarks: (value: BookmarkProps[]) => void;
  selectedBookmarks: any[];
  deleteBookmarkFromTrash: (bookmarks: BookmarkProps[]) => void;
  handleEmptyTrash: () => void;
  trash: BookmarkProps[];
  restoreBookmarkFromTrash: (bookmarks: BookmarkProps[]) => void;
  createFolder: () => void;
  renameFolder: () => void;
  setshowmovefoldermodal: () => void;
  deleteFolder: () => void;
  folders: any[];
  getBoomarksByFolder: (payload: object) => void;
  getFoldersByFolder: (payload: string) => void;
  currentParent: any;
  setcurrentParent: (payload: object) => void;
  setselectedFolder: (payload: object) => void;
  fetchBookmarks: () => void;
  fetchTrash: () => void;
}

export const Content: React.FC<ContentProps> = ({
  bookmarksOnView,
  selectedFolder,
  selectedBookmarks,
  setselectedBookmarks,
  deleteBookmarkFromTrash,
  handleEmptyTrash,
  restoreBookmarkFromTrash,
  createFolder,
  renameFolder,
  trash,
  setshowmovefoldermodal,
  deleteFolder,
  folders,
  getBoomarksByFolder,
  getFoldersByFolder,
  currentParent,
  setcurrentParent,
  setselectedFolder,
  fetchBookmarks,
  fetchTrash,
}) => {
  const [showmovemodal, setshowmovemodal] = React.useState(false);
  const [bookmarksToMove, setbookmarksToMove] = React.useState([]);
  const [showeditmodal, setshoweditmodal] = React.useState(false);
  const [bookmarkToEdit, setbookmarkToEdit] = React.useState({});

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

  const updateBookmark = (bookmark: BookmarkProps) => {
    const { id, title, url } = bookmark;
    if (!title) {
      return toast.error("Name is required");
    }
    chrome.runtime.sendMessage(
      { id, title, url, command: CMDB_UPDATE_ITEM },
      (result) => {
        if (result) {
          setshoweditmodal(false);
          setbookmarkToEdit({});
          if (url) {
            // for bookmarks
            toast.success("Bookmark updated");
            getBoomarksByFolder(selectedFolder);
          } else {
            // for folders
            toast.success("Folder renamed");
            getFoldersByFolder(currentParent.id);
            fetchBookmarks();
            if (currentParent.id === selectedFolder.id) {
              setcurrentParent(result);
            }
            setselectedFolder(result);
          }
        }
      }
    );
  };

  const handleMoveBookmark = (bookmarks: string[], parentId: string) => {
    chrome.runtime.sendMessage(
      {
        bookmarks,
        parentId,
        command: CMDB_MOVE_ITEM,
      },
      (res) => {
        if (res) {
          toast.success(CMDB_MOVED_BOOKMARK_MSG);
          getBoomarksByFolder(selectedFolder);
          setbookmarksToMove([]);
          setselectedBookmarks([]);
          setshowmovemodal(false);
        }
      }
    );
  };

  const moveBookmarks = () => {
    setshowmovemodal(true);
    const merged: any = [...selectedBookmarks];
    setbookmarksToMove(merged);
  };

  const deleteBookmarks = () => {
    chrome.runtime.sendMessage(
      {
        bookmarks: selectedBookmarks,
        command: CMDB_DELETE_BOOKMARK,
      },
      (res) => {
        if (res === "deleted") {
          toast.success("Bookmark has been trashed");
          getBoomarksByFolder(selectedFolder);
          setselectedBookmarks([]);
          fetchTrash();
          return;
        }
      }
    );
  };

  return (
    <>
      <div className="cmdb-content-section">
        <div className="cmdb-list">
          <div className="cmdb-page-heading">
            <b className="cmdb-page-title">
              {selectedFolder?.title || "Recently added"}
            </b>
            <div className="cmdb-page-heading-actions">
              {selectedFolder.parentId ? (
                <>
                  <button onClick={() => createFolder()}>
                    <FolderPlusIcon color="white" width="17" />
                  </button>
                  {selectedFolder.parentId !== "0" && (
                    <>
                      <button onClick={() => renameFolder()}>
                        <PencilSquareIcon color="white" width="17" />
                      </button>
                      <button onClick={() => setshowmovefoldermodal()}>
                        <ArrowsRightLeftIcon color="white" width="17" />
                      </button>

                      <button onClick={() => deleteFolder()}>
                        <TrashIcon color="red" width="17" />
                      </button>
                    </>
                  )}
                </>
              ) : null}
              {selectedFolder?.id === CMDB_TRASH && trash.length > 0 && (
                <button onClick={() => handleEmptyTrash()}>
                  <TrashIcon color="red" width="17" />
                </button>
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
                  deleteBookmark={() => deleteBookmarks()}
                  editBookmark={() => {
                    setshoweditmodal(true);
                    setbookmarkToEdit(bookmark);
                  }}
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
              <b style={{ fontWeight: 600 }}>{selectedBookmarks.length}</b>{" "}
              items
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
      {/* modals */}
      {/* move bookmark modal */}
      {showmovemodal && (
        <MoveBookmarkModal
          folders={folders}
          bookmarks={bookmarksToMove}
          setisopen={(payload) => {
            setshowmovemodal(payload);
            setbookmarksToMove([]);
          }}
          submitMoveBookmark={handleMoveBookmark}
        />
      )}
      {/* edit modal */}
      {showeditmodal && (
        <EditBookmarkModal
          bookmark={bookmarkToEdit}
          setisopen={(payload) => {
            setshoweditmodal(payload);
            setbookmarkToEdit({});
          }}
          submitEditBookmark={updateBookmark}
        />
      )}
    </>
  );
};
