/*global chrome*/

import React from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Content } from "./components/Content";
import { SideNav } from "./components/SideNav";
import { TopNav } from "./components/TopNav";
import cheerio from "cheerio";
import axios from "axios";
import {
  CMDB_RECENTLY_ADDED,
  CMDB_FETCH_BOOKMARKS,
  CMDB_FETCH_RECENT_BOOKMARKS,
  SEARCH_RESULT,
  CMDB_CREATE_ITEM,
  CMDB_SEARCH,
  CMDB_DELETE_ITEM,
  CMDB_UPDATE_ITEM,
  CMDB_MOVE_ITEM,
  CMDB_GET_TRASHED_BOOKMARK,
  CMDB_TRASH,
  CMDB_EMTPY_TRASH,
  CMDB_DELETE_TRASHED_BOOKMARK,
  CMDB_RESTORE_TRASHED_BOOKMARK,
  CMDB_REMOVED_BOOKMARK_MSG,
  CMDB_SAVED_BOOKMARK_MSG,
  CMDB_UPDATED_BOOKMARK_MSG,
  CMDB_REMOVED_BOOKMARKS_MSG,
  CMDB_MOVED_BOOKMARK_MSG,
  CMDB_EMPTIED_TRASH_MSG,
  CMDB_RESTORED_BOOKMARK_MSG,
} from "./keys";
import EditBookmarkModal from "./components/EditBookmarkModal";
import toast from "react-hot-toast";
import CustomToast from "./components/CustomToast";
import { BookmarkProps } from "../src/types";
import MoveBookmarkModal from "./components/MoveBookmarkModal";
import { CmdbWrapper } from "./components/Style";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  // states
  let [folders, setfolders] = React.useState<any>([]);
  let [bookmarks, setbookmarks] = React.useState<any>([]);
  const [recentBookmarks, setrecentBookmarks] = React.useState<BookmarkProps[]>(
    []
  );
  const [selectedFolder, setselectedFolder] = React.useState<any>({});
  const [bookmarksOnView, setbookmarksOnView] = React.useState<any>([]);
  const [foldersToDisplay, setfoldersToDisplay] = React.useState<any>(null);
  const [currentParent, setcurrentParent] = React.useState<any>(null);
  const [showeditmodal, setshoweditmodal] = React.useState(false);
  const [bookmarkToEdit, setbookmarkToEdit] = React.useState({});
  const [showmovemodal, setshowmovemodal] = React.useState(false);
  const [bookmarksToMove, setbookmarksToMove] = React.useState([]);
  const [isbookmarked, setisbookmarked] = React.useState(false);
  const [selectedBookmarks, setselectedBookmarks] = React.useState<any[]>([]);
  const [trash, settrash] = React.useState([]);

  // separate folders from bookmarks(actual bookmarks)
  let newBookmarks: any[] = [];
  let newFolders: any[] = [];
  const separateFolderFromBookmarks = (node: {
    children: any[];
    url: string;
  }) => {
    if (node?.children) {
      /*
       * check if children of node are bookmarks
       * only bookmarks have url property so we use that
       * */
      const hasBookmarks = node?.children.some((child) => child.url);
      newFolders.push({ ...node, children: [], hasBookmarks: hasBookmarks });
      folders = newFolders;
      node.children.forEach((child) => separateFolderFromBookmarks(child));
    } else {
      newBookmarks.push(node);
      bookmarks = newBookmarks;
    }
    // handle nesting folders
    const temp_nested_folders: object[] = [];
    // iterate over folders
    folders.forEach((folder: { parentId: string; id: string }) => {
      // check if folder has children
      const hasChildren = folders?.find(
        (child: { parentId: string }) => child.parentId === folder.id
      );
      temp_nested_folders.push({
        ...folder,
        hasChildren: hasChildren ? true : false,
      });
    });
    setfolders([...temp_nested_folders]);
    setselectedFolder(selectedFolder ? selectedFolder : folders?.[0]);
    showbookmarksOnView(selectedFolder?.id);
    setbookmarks(bookmarks);
  };

  const handleSearch = (str: string) => {
    if (str === "") {
      setselectedFolder({ id: CMDB_RECENTLY_ADDED });
    } else {
      chrome.runtime.sendMessage(
        { string: str, command: CMDB_SEARCH },
        (result) => {
          setselectedFolder({ id: SEARCH_RESULT, title: "Search result" });
          setbookmarksOnView(result);
        }
      );
    }
  };

  // this handles whats category of bookmarks to show in the content section
  const showbookmarksOnView = (id: string) => {
    if (id === "0") {
      setbookmarksOnView(bookmarks);
    } else if (id === CMDB_RECENTLY_ADDED) {
      setbookmarksOnView(recentBookmarks);
    } else if (id === SEARCH_RESULT) {
      if (bookmarksOnView.length === 0) {
        //
      }
    } else if (id === CMDB_TRASH) {
      setbookmarksOnView(trash || []);
    } else {
      const filteredBookmarks = bookmarks.filter(
        (bookmark: { parentId: string }) =>
          parseInt(bookmark.parentId) === parseInt(selectedFolder?.id)
      );
      setbookmarksOnView(filteredBookmarks);
    }
  };

  const handleSaveUrl = async () => {
    const url = window.location.href;
    if (!isbookmarked) {
      const parentId = selectedFolder.title ? selectedFolder?.id : null;
      const command = CMDB_CREATE_ITEM;
      try {
        const response = axios.get(url);
        var $ = cheerio.load((await response).data);
        var title = $("title").text();
        chrome.runtime.sendMessage(
          { title, url, command, parentId },
          (response) => {}
        );
        toast.success(CMDB_SAVED_BOOKMARK_MSG);
        fetchBookmarks();
        fetchRecentBookmarks();
      } catch (error) {
        console.log("error => ", error);
      }
    } else {
      const findBookmark = bookmarks.find(
        (bookmark: BookmarkProps) => bookmark.url === url
      );
      const currentSelectedfolder = selectedFolder;
      chrome.runtime.sendMessage(
        { bookmarks: [findBookmark], command: CMDB_DELETE_ITEM },
        (result) => {
          if (result === "deleted") {
            toast.success(CMDB_REMOVED_BOOKMARK_MSG);
            fetchBookmarks();
            fetchTrash();
            if (!currentSelectedfolder.index) {
              fetchRecentBookmarks();
            }
          }
        }
      );
    }
  };

  const fetchBookmarks = () => {
    chrome.runtime.sendMessage(CMDB_FETCH_BOOKMARKS, (result) => {
      separateFolderFromBookmarks(result);
    });
  };

  const fetchRecentBookmarks = () => {
    chrome.runtime.sendMessage(CMDB_FETCH_RECENT_BOOKMARKS, (result) => {
      setrecentBookmarks(result);
      setselectedFolder({ id: CMDB_RECENTLY_ADDED });
    });
  };

  const fetchTrash = () => {
    chrome.runtime.sendMessage(
      { command: CMDB_GET_TRASHED_BOOKMARK },
      (result) => {
        settrash(result);
      }
    );
  };

  const deleteBookmarkFromTrash = (bookmarks: BookmarkProps[]) => {
    chrome.runtime.sendMessage(
      { bookmarks, command: CMDB_DELETE_TRASHED_BOOKMARK },
      (result) => {
        console.log(result);
        if (result) {
          toast.success(CMDB_REMOVED_BOOKMARK_MSG);
          setbookmarksOnView(result);
          setselectedBookmarks([]);
          fetchTrash();
        }
      }
    );
  };

  const restoreBookmarkFromTrash = (bookmarks: BookmarkProps[]) => {
    chrome.runtime.sendMessage(
      { bookmarks, command: CMDB_RESTORE_TRASHED_BOOKMARK },
      (result) => {
        if (result) {
          fetchBookmarks();
          fetchRecentBookmarks();
          setselectedBookmarks([]);
          fetchTrash();
          setbookmarksOnView(result);
          showbookmarksOnView(CMDB_TRASH);
          toast.success(CMDB_RESTORED_BOOKMARK_MSG);
        }
      }
    );
  };

  const deleteBookmarks = () => {
    const currentSelectedfolder = selectedFolder;
    chrome.runtime.sendMessage(
      {
        bookmarks: selectedBookmarks,
        command: CMDB_DELETE_ITEM,
      },
      (res) => {
        if (res === "deleted") {
          toast.success(CMDB_REMOVED_BOOKMARKS_MSG);
          console.log(res);
          fetchBookmarks();
          if (!currentSelectedfolder.index) {
            fetchRecentBookmarks();
          }
          setselectedBookmarks([]);
          fetchTrash();
          return;
        }
      }
    );
  };

  const moveBookmark = (bookmarks: string[], parentId: string) => {
    const currentSelectedfolder = selectedFolder;
    chrome.runtime.sendMessage(
      {
        bookmarks,
        parentId,
        command: CMDB_MOVE_ITEM,
      },
      (res) => {
        fetchBookmarks();
        if (!currentSelectedfolder.index) {
          fetchRecentBookmarks();
        }
        setbookmarksToMove([]);
        setselectedBookmarks([]);
        setshowmovemodal(false);
        toast.success(CMDB_MOVED_BOOKMARK_MSG);
        return;
      }
    );
  };

  const moveBookmarks = () => {
    setshowmovemodal(true);
    const merged: any = [...selectedBookmarks];
    setbookmarksToMove(merged);
  };

  const updateBookmark = (bookmark: BookmarkProps) => {
    const currentSelectedfolder = selectedFolder;
    const { id, title, url } = bookmark;
    chrome.runtime.sendMessage(
      { id, title, url, command: CMDB_UPDATE_ITEM },
      (result) => {
        toast.success(CMDB_UPDATED_BOOKMARK_MSG);
        setshoweditmodal(false);
        setbookmarkToEdit({});
        fetchBookmarks();
        if (!currentSelectedfolder.index) {
          fetchRecentBookmarks();
        }
      }
    );
  };

  const handleEmptyTrash = () => {
    chrome.runtime.sendMessage({ command: CMDB_EMTPY_TRASH }, (response) => {
      settrash(response);
      setbookmarksOnView(response);
      toast.success(CMDB_EMPTIED_TRASH_MSG);
    });
  };

  React.useEffect(() => {
    if (window && bookmarks.length > 0) {
      const currenturl = window.location.href;
      const findBookmark = bookmarks.find(
        (bookmark: BookmarkProps) => bookmark.url === currenturl
      );
      findBookmark ? setisbookmarked(true) : setisbookmarked(false);
    }
  }, [window, bookmarks]);

  React.useEffect(() => {
    showbookmarksOnView(selectedFolder?.id);
    setselectedBookmarks([]);
  }, [selectedFolder]);

  // use effects
  React.useEffect(() => {
    fetchBookmarks();
    fetchRecentBookmarks();
    fetchTrash();
  }, []);

  return (
    <CmdbWrapper>
      <div id="cmdb">
        <div className="cmdb-dropshadow" />
        <div className="cmdb-animated-bg cmdb-show">
          <div className="cmdb-container">
            <CustomToast />
            <TopNav
              handleSearch={handleSearch}
              handleSaveUrl={handleSaveUrl}
              isbookmarked={isbookmarked}
            />
            <div className="cmdb-body">
              <SideNav
                folders={folders}
                selectedFolder={selectedFolder}
                foldersToDisplay={foldersToDisplay}
                setfoldersToDisplay={setfoldersToDisplay}
                currentParent={currentParent}
                setcurrentParent={setcurrentParent}
                setselectedFolder={setselectedFolder}
                trash={trash}
              />
              <Content
                selectedFolder={selectedFolder}
                bookmarksOnView={bookmarksOnView}
                editBookmark={(bookmark: BookmarkProps) => {
                  setshoweditmodal(true);
                  setbookmarkToEdit(bookmark);
                }}
                selectedBookmarks={selectedBookmarks}
                setselectedBookmarks={setselectedBookmarks}
                deleteBookmarks={deleteBookmarks}
                moveBookmarks={moveBookmarks}
                deleteBookmarkFromTrash={deleteBookmarkFromTrash}
                handleEmptyTrash={handleEmptyTrash}
                trash={trash}
                restoreBookmarkFromTrash={restoreBookmarkFromTrash}
              />
            </div>
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
            {/* move modal */}
            {showmovemodal && (
              <MoveBookmarkModal
                folders={folders}
                bookmarks={bookmarksToMove}
                setisopen={(payload) => {
                  setshowmovemodal(payload);
                  setbookmarksToMove([]);
                }}
                submitMoveBookmark={moveBookmark}
              />
            )}
          </div>
        </div>
      </div>
    </CmdbWrapper>
  );
};

export default App;
