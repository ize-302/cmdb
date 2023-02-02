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
  CMDB_FETCH_BOOKMARS_BY_FOLDER,
  CMDB_REMOVED_BOOKMARK_MSG,
  CMDB_SAVED_BOOKMARK_MSG,
  CMDB_UPDATED_BOOKMARK_MSG,
  CMDB_REMOVED_BOOKMARKS_MSG,
  CMDB_MOVED_BOOKMARK_MSG,
  CMDB_EMPTIED_TRASH_MSG,
  CMDB_RESTORED_BOOKMARK_MSG,
  CMDB_FOLDER_CREATED_MSG,
} from "./keys";
import EditBookmarkModal from "./components/EditBookmarkModal";
import toast from "react-hot-toast";
import CustomToast from "./components/CustomToast";
import { BookmarkProps } from "../src/types";
import MoveBookmarkModal from "./components/MoveBookmarkModal";
import { CmdbWrapper } from "./components/Style";
import CreateFolderModal from "./components/CreateFolderModal";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  // states
  let [folders, setfolders] = React.useState<any>([]);
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
  const [showMain, setshowMain] = React.useState(true);
  const [showcreatefoldermodal, setshowcreatefoldermodal] =
    React.useState(false);

  // Extract folders
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
      // handle nesting folders
      const temp_nested_folders: object[] = [];
      // iterate over folders
      folders.map((folder: { parentId: string; id: string }) => {
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
      node.children.forEach((child) => separateFolderFromBookmarks(child));
    }
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

  // used for when a folder is clicked,
  // fetch the nodes relating to that folder and filter out non bookmarks
  const getBoomarksByFolder = (folder: any) => {
    if (folder.id === CMDB_RECENTLY_ADDED) {
      fetchRecentBookmarks();
    } else if (folder.id === CMDB_TRASH) {
      fetchTrash();
    } else {
      chrome.runtime.sendMessage(
        { id: folder.id, command: CMDB_FETCH_BOOKMARS_BY_FOLDER },
        (response) => {
          const filter = response.filter((item: any) => item.url);
          setbookmarksOnView(filter);
        }
      );
    }
  };

  const getFoldersByFolder = (folderId: any) => {
    chrome.runtime.sendMessage(
      { id: folderId, command: CMDB_FETCH_BOOKMARS_BY_FOLDER },
      (response) => {
        const filter = response.filter(
          (item: any) => !item.url && item.parentId === folderId
        );
        setfoldersToDisplay(filter);
      }
    );
  };

  // toggle between save and unsafe url
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
        getBoomarksByFolder(selectedFolder);
        // fetchBookmarks();
      } catch (error) {
        console.log("error => ", error);
      }
    } else {
      const currenturl = window.location.href;
      chrome.runtime.sendMessage(
        { string: currenturl, command: CMDB_SEARCH },
        (result) => {
          chrome.runtime.sendMessage(
            { bookmarks: [...result], command: CMDB_DELETE_ITEM },
            (result) => {
              if (result === "deleted") {
                toast.success(CMDB_REMOVED_BOOKMARK_MSG);
                getBoomarksByFolder(selectedFolder);
                fetchTrash();
              }
            }
          );
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
      { bookmarks, command: CMDB_RESTORE_TRASHED_BOOKMARK },
      (result) => {
        if (result) {
          toast.success(CMDB_RESTORED_BOOKMARK_MSG);
          setselectedBookmarks([]);
          fetchTrash();
          setbookmarksOnView(result);
        }
      }
    );
  };

  const deleteBookmarks = () => {
    chrome.runtime.sendMessage(
      {
        bookmarks: selectedBookmarks,
        command: CMDB_DELETE_ITEM,
      },
      (res) => {
        if (res === "deleted") {
          toast.success(CMDB_REMOVED_BOOKMARKS_MSG);
          getBoomarksByFolder(selectedFolder);
          setselectedBookmarks([]);
          fetchTrash();
          return;
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

  const updateBookmark = (bookmark: BookmarkProps) => {
    const { id, title, url } = bookmark;
    chrome.runtime.sendMessage(
      { id, title, url, command: CMDB_UPDATE_ITEM },
      (result) => {
        toast.success(CMDB_UPDATED_BOOKMARK_MSG);
        getBoomarksByFolder(selectedFolder);
        setshoweditmodal(false);
        setbookmarkToEdit({});
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

  const handleCreateFolder = (folderId: string, title: string) => {
    chrome.runtime.sendMessage(
      { title, command: CMDB_CREATE_ITEM, parentId: folderId },
      (response) => {
        toast.success(CMDB_FOLDER_CREATED_MSG);
        setshowcreatefoldermodal(false);
        getFoldersByFolder(folderId);
        fetchBookmarks();
      }
    );
  };

  React.useEffect(() => {
    const currenturl = window.location.href;
    chrome.runtime.sendMessage(
      { string: currenturl, command: CMDB_SEARCH },
      (result) => {
        result.length > 0 ? setisbookmarked(true) : setisbookmarked(false);
      }
    );
  }, [window, handleSaveUrl]);

  React.useEffect(() => {
    if (selectedFolder.id === CMDB_RECENTLY_ADDED) {
      setbookmarksOnView(recentBookmarks);
    } else if (selectedFolder.id === CMDB_TRASH) {
      setbookmarksOnView(trash || []);
    }
  }, [selectedFolder]);

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
              handleSearch={handleSearch}
              handleSaveUrl={handleSaveUrl}
              isbookmarked={isbookmarked}
              selectedFolder={selectedFolder}
            />
            <div className="cmdb-body">
              <SideNav
                folders={folders}
                selectedFolder={selectedFolder}
                foldersToDisplay={foldersToDisplay}
                setfoldersToDisplay={setfoldersToDisplay}
                currentParent={currentParent}
                setcurrentParent={setcurrentParent}
                setselectedFolder={(val) => {
                  setselectedFolder(val);
                  getBoomarksByFolder(val);
                }}
                trash={trash}
                showMain={showMain}
                setshowMain={setshowMain}
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
                createFolder={() => {
                  setshowcreatefoldermodal(true);
                }}
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
                submitMoveBookmark={handleMoveBookmark}
              />
            )}
            {/* create folder modal */}
            {showcreatefoldermodal && (
              <CreateFolderModal
                defaultSelectedFolder={selectedFolder}
                folders={folders}
                setisopen={(payload) => {
                  setshowcreatefoldermodal(payload);
                }}
                submit={(folder, title) => {
                  if (!title) {
                    return toast.error("Folder should have a title");
                  }
                  handleCreateFolder(folder, title);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </CmdbWrapper>
  );
};

export default App;
