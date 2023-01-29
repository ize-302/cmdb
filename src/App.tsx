/*global chrome*/

import React from "react";
import "react-tooltip/dist/react-tooltip.css";
import "./styles/main.scss";
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
  CMDB_CREATE_BOOKMARK,
  CMDB_SEARCH,
  CMDB_DELETE_BOOKMARK,
  CMDB_UPDATE_BOOKMARK,
  CMDB_MOVE_BOOKMARK,
  CMDB_REMOVED_BOOKMARK_MSG,
  CMDB_SAVED_BOOKMARK_MSG,
  CMDB_UPDATED_BOOKMARK_MSG,
  CMDB_REMOVED_BOOKMARKS_MSG,
  CMDB_MOVED_BOOKMARK_MSG,
} from "./keys";
import EditBookmarkModal from "./components/EditBookmarkModal";
import toast from "react-hot-toast";
import CustomToast from "./components/CustomToast";
import { BookmarkProps } from "../src/types";
import MoveBookmarkModal from "./components/MoveBookmarkModal";

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
  const [selectedBookmarks, setselectedBookmarks] = React.useState<string[]>(
    []
  );

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
    setfolders(folders);
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
    } else {
      const filteredBookmarks = bookmarks.filter(
        (bookmark: { parentId: string }) =>
          parseInt(bookmark.parentId) === parseInt(selectedFolder?.id)
      );
      setbookmarksOnView(filteredBookmarks);
    }
  };

  const handleNestingFolders = () => {
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
  };

  const handleSaveUrl = async () => {
    const url = window.location.href;
    if (!isbookmarked) {
      const parentId = currentParent.title ? currentParent?.id : null;
      const command = CMDB_CREATE_BOOKMARK;
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
      deleteBookmark(findBookmark);
    }
  };

  const fetchBookmarks = () => {
    chrome.runtime.sendMessage(CMDB_FETCH_BOOKMARKS, (result) => {
      separateFolderFromBookmarks(result);
      handleNestingFolders();
    });
  };

  const fetchRecentBookmarks = () => {
    chrome.runtime.sendMessage(CMDB_FETCH_RECENT_BOOKMARKS, (result) => {
      setrecentBookmarks(result);
      setselectedFolder({ id: CMDB_RECENTLY_ADDED });
    });
  };

  const deleteBookmark = (bookmark: BookmarkProps) => {
    console.log(bookmark);
    const currentSelectedfolder = selectedFolder;
    chrome.runtime.sendMessage(
      { id: bookmark.id, command: CMDB_DELETE_BOOKMARK },
      (result) => {
        fetchBookmarks();
        toast.success(CMDB_REMOVED_BOOKMARK_MSG);
        if (!currentSelectedfolder.index) {
          fetchRecentBookmarks();
        }
      }
    );
  };

  const deleteMultipleBookmarks = () => {
    const currentSelectedfolder = selectedFolder;
    for (let i = 0; i <= selectedBookmarks.length; i++) {
      chrome.runtime.sendMessage({
        id: selectedBookmarks[i],
        command: CMDB_DELETE_BOOKMARK,
      });
      if (i === selectedBookmarks.length - 1) {
        fetchBookmarks();
        if (!currentSelectedfolder.index) {
          fetchRecentBookmarks();
        }
        setselectedBookmarks([]);
        toast.success(CMDB_REMOVED_BOOKMARKS_MSG);
        return;
      }
    }
  };

  const moveBookmark = (bookmarks: string[], parentId: string) => {
    console.log(bookmarks);
    const currentSelectedfolder = selectedFolder;
    for (let i = 0; i <= bookmarks.length; i++) {
      chrome.runtime.sendMessage({
        id: bookmarks[i],
        parentId,
        command: CMDB_MOVE_BOOKMARK,
      });
      if (i === bookmarks.length - 1) {
        fetchBookmarks();
        if (!currentSelectedfolder.index) {
          fetchRecentBookmarks();
        }
        setbookmarksToMove([]);
        setshowmovemodal(false);
        toast.success(CMDB_MOVED_BOOKMARK_MSG);
        return;
      }
    }
  };

  const moveMultipleBookmakrs = () => {
    setshowmovemodal(true);
    const merged: any = [...selectedBookmarks];
    setbookmarksToMove(merged);
  };

  const updateBookmark = (bookmark: BookmarkProps) => {
    const currentSelectedfolder = selectedFolder;
    const { id, title, url } = bookmark;
    chrome.runtime.sendMessage(
      { id, title, url, command: CMDB_UPDATE_BOOKMARK },
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
  }, []);

  return (
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
              CMDB_RECENTLY_ADDED={CMDB_RECENTLY_ADDED}
            />
            <Content
              selectedFolder={selectedFolder}
              bookmarksOnView={bookmarksOnView}
              deleteBookmark={deleteBookmark}
              editBookmark={(bookmark: BookmarkProps) => {
                setshoweditmodal(true);
                setbookmarkToEdit(bookmark);
              }}
              moveBookmark={(bookmark: BookmarkProps) => {
                setshowmovemodal(true);
                const merged: any = [...bookmarksToMove, bookmark.id];
                setbookmarksToMove(merged);
              }}
              selectedBookmarks={selectedBookmarks}
              setselectedBookmarks={setselectedBookmarks}
              deleteMultipleBookmarks={deleteMultipleBookmarks}
              moveMultipleBookmakrs={moveMultipleBookmakrs}
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
  );
};

export default App;
