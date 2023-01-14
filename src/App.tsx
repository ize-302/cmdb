/*global chrome*/

import React from "react";
import "./styles/App.scss";
import { Content } from "./components/Content";
import { SideNav } from "./components/SideNav";
import { TopNav } from "./components/TopNav";
import cheerio from "cheerio";
import axios from "axios";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  // keys
  const CMDB_RECENTLY_ADDED = "CMDB_RECENTLY_ADDED";
  const CMDB_FETCH_BOOKMARKS = "CMDB_FETCH_BOOKMARKS";
  const CMDB_FETCH_RECENT_BOOKMARKS = "CMDB_FETCH_RECENT_BOOKMARKS";
  const SEARCH_RESULT = "search_result";
  const CMDB_CREATE_BOOKMARK = "CMDB_CREATE_BOOKMARK";
  const CMDB_SEARCH = "CMDB_SEARCH";

  // states
  let [folders, setfolders] = React.useState<any>([]);
  let [bookmarks, setbookmarks] = React.useState<any>([]);
  const [recentBookmarks, setrecentBookmarks] = React.useState<any>([]);
  const [selectedFolder, setselectedFolder] = React.useState<any>({});
  const [bookmarksOnView, setbookmarksOnView] = React.useState<any>([]);
  const [foldersToDisplay, setfoldersToDisplay] = React.useState<any>(null);
  const [currentParent, setcurrentParent] = React.useState<any>(null);

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
        (child: { parentId: any }) => child.parentId === folder.id
      );
      temp_nested_folders.push({
        ...folder,
        // hasChildren: hasChildren ? true : false,
      });
    });
    setfolders([...temp_nested_folders]);
    setselectedFolder(selectedFolder ? selectedFolder : folders?.[0]);
    showbookmarksOnView(selectedFolder?.id);
  };

  const handleSaveUrl = () => {
    const url = window.location.href;
    const parentId = currentParent?.id;
    const command = CMDB_CREATE_BOOKMARK;
    try {
      axios.get(url).then((response) => {
        var $ = cheerio.load(response.data);
        var title = $("title").text();
        chrome.runtime.sendMessage({ title, url, command }, (response) => {});
        fetchBookmarks();
        fetchRecentBookmarks();
      });
    } catch (error) {
      console.log("outer", error);
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
      setselectedFolder({ id: CMDB_RECENTLY_ADDED });
      setrecentBookmarks(result);
    });
  };

  React.useEffect(() => {
    showbookmarksOnView(selectedFolder?.id);
  }, [selectedFolder]);

  // use effects
  React.useEffect(() => {
    fetchBookmarks();
    fetchRecentBookmarks();
  }, []);

  return (
    <div id="cmdb-app-space">
      <div className="cmdb-app-shadow" />
      <div className="cmdb-app-container-border cmdb-app-container-show">
        <div className="cmdb-app-container">
          <TopNav handleSearch={handleSearch} handleSaveUrl={handleSaveUrl} />
          <div className="cmdb-app-body">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
