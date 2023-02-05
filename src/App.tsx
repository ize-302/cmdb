/*global chrome*/

import React from "react";
import "react-tooltip/dist/react-tooltip.css";
import { Content } from "./components/Content";
import { SideNav } from "./components/SideNav";
import { TopNav } from "./components/TopNav";
import {
  CMDB_RECENTLY_ADDED,
  CMDB_FETCH_BOOKMARKS,
  CMDB_FETCH_RECENT_BOOKMARKS,
  SEARCH_RESULT,
  CMDB_SEARCH,
  CMDB_GET_TRASHED_BOOKMARK,
  CMDB_TRASH,
  CMDB_EMTPY_TRASH,
  CMDB_DELETE_TRASHED_BOOKMARK,
  CMDB_RESTORE_TRASHED_BOOKMARK,
  CMDB_FETCH_BOOKMARS_BY_FOLDER,
  CMDB_REMOVED_BOOKMARK_MSG,
  CMDB_EMPTIED_TRASH_MSG,
} from "./keys";
import toast from "react-hot-toast";
import CustomToast from "./components/CustomToast";
import { BookmarkProps } from "../src/types";
import { CmdbWrapper } from "./components/Style";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  // states
  let [folders, setfolders] = React.useState<any>([]);
  const [recentBookmarks, setrecentBookmarks] = React.useState<BookmarkProps[]>(
    []
  );
  const [selectedFolder, setselectedFolder] = React.useState<any>({});
  const [bookmarksOnView, setbookmarksOnView] = React.useState<any>([]);
  const [currentParent, setcurrentParent] = React.useState<any>(null);
  const [selectedBookmarks, setselectedBookmarks] = React.useState<any[]>([]);
  const [trash, settrash] = React.useState([]);
  const [showMain, setshowMain] = React.useState(true);
  const [searchinput, setsearchinput] = React.useState("");

  // Extract folders
  let newFolders: any[] = [];
  const separateFolderFromBookmarks = (node: {
    children: any[];
    url: string;
  }) => {
    if (node?.children) {
      newFolders.push(node);
      const modified_folders: object[] = [];
      // iterate over folders
      newFolders.map((folder: { parentId: string; id: string }) => {
        // check if current folder has nested folders
        const hasFolders = newFolders?.find(
          (child: { parentId: string }) => child.parentId === folder.id
        );
        modified_folders.push({
          ...folder,
          hasFolders: hasFolders ? true : false,
        });
      });
      setfolders([...modified_folders]);
      node.children.forEach((child) => separateFolderFromBookmarks(child));
    }
  };

  const fetchBookmarks = () => {
    chrome.runtime.sendMessage(CMDB_FETCH_BOOKMARKS, (result) => {
      separateFolderFromBookmarks(result);
    });
  };

  const handleSearch = (str: string) => {
    if (str === "") {
      setselectedFolder({ id: CMDB_RECENTLY_ADDED });
    } else {
      chrome.runtime.sendMessage(
        { string: str, command: CMDB_SEARCH },
        (result) => {
          setselectedFolder({ id: SEARCH_RESULT, title: "Search result" });
          setbookmarksOnView(result.filter((item: any) => item.url));
          setshowMain(true);
        }
      );
    }
  };

  // used for when a folder is clicked,
  // fetch the nodes relating to that folder and filter out non bookmarks
  const getBoomarksByFolder = (folder: any) => {
    setselectedBookmarks([]);
    setsearchinput("");
    if (folder.id === CMDB_RECENTLY_ADDED) {
      fetchRecentBookmarks();
    } else if (folder.id === CMDB_TRASH) {
      fetchTrash();
    } else {
      chrome.runtime.sendMessage(
        { id: folder.id, command: CMDB_FETCH_BOOKMARS_BY_FOLDER },
        (response) => {
          const filter = response[0].children.filter((item: any) => item.url);
          setbookmarksOnView(filter);
        }
      );
    }
  };

  const fetchRecentBookmarks = () => {
    chrome.runtime.sendMessage(CMDB_FETCH_RECENT_BOOKMARKS, (result) => {
      setrecentBookmarks(result);
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
        if (result) {
          toast.success(CMDB_REMOVED_BOOKMARK_MSG);
          fetchTrash();
          setbookmarksOnView(result);
          setselectedBookmarks([]);
        }
      }
    );
  };

  const restoreBookmarkFromTrash = (bookmarks: BookmarkProps[]) => {
    chrome.runtime.sendMessage(
      { bookmarks, command: CMDB_RESTORE_TRASHED_BOOKMARK, folders },
      (result) => {
        if (result) {
          toast.success("Restored");
          setselectedBookmarks([]);
          fetchTrash();
          setbookmarksOnView(result);
        }
      }
    );
  };

  const handleEmptyTrash = () => {
    chrome.runtime.sendMessage({ command: CMDB_EMTPY_TRASH }, (response) => {
      toast.success(CMDB_EMPTIED_TRASH_MSG);
      settrash(response);
      setbookmarksOnView(response);
    });
  };

  React.useEffect(() => {
    if (selectedFolder.id === CMDB_RECENTLY_ADDED) {
      setbookmarksOnView(recentBookmarks);
    } else if (selectedFolder.id === CMDB_TRASH) {
      setbookmarksOnView(trash || []);
    }
  }, [selectedFolder]);

  React.useEffect(() => {
    handleSearch(searchinput);
  }, [searchinput]);

  // use effects
  React.useEffect(() => {
    fetchBookmarks();
    fetchRecentBookmarks();
    fetchTrash();
  }, []);

  React.useEffect(() => {
    setselectedFolder({ id: CMDB_RECENTLY_ADDED });
  }, [recentBookmarks]);

  return (
    <CmdbWrapper>
      <div id="cmdb">
        <div className="cmdb-dropshadow" />
        <div className="cmdb-animated-bg cmdb-show">
          <div className="cmdb-container">
            <CustomToast />
            <TopNav
              searchinput={searchinput}
              setsearchinput={setsearchinput}
              getBoomarksByFolder={getBoomarksByFolder}
              fetchTrash={fetchTrash}
              selectedFolder={selectedFolder}
              folders={folders}
            />
            <div
              className="cmdb-body"
              onContextMenu={(e) => {
                e.preventDefault();
              }}
            >
              <SideNav
                folders={folders}
                selectedFolder={selectedFolder}
                currentParent={currentParent}
                setcurrentParent={setcurrentParent}
                setselectedFolder={(val) => {
                  setselectedFolder(val);
                  getBoomarksByFolder(val);
                }}
                trash={trash}
                showMain={showMain}
                setshowMain={setshowMain}
                fetchBookmarks={fetchBookmarks}
              />
              <Content
                folders={folders}
                selectedFolder={selectedFolder}
                bookmarksOnView={bookmarksOnView}
                selectedBookmarks={selectedBookmarks}
                setselectedBookmarks={setselectedBookmarks}
                deleteBookmarkFromTrash={deleteBookmarkFromTrash}
                handleEmptyTrash={handleEmptyTrash}
                trash={trash}
                restoreBookmarkFromTrash={restoreBookmarkFromTrash}
                getBoomarksByFolder={getBoomarksByFolder}
                currentParent={currentParent}
                fetchBookmarks={fetchBookmarks}
                setcurrentParent={setcurrentParent}
                setselectedFolder={setselectedFolder}
                fetchTrash={fetchTrash}
              />
            </div>
          </div>
        </div>
      </div>
    </CmdbWrapper>
  );
};

export default App;
