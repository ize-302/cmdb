/*global chrome*/

import React from "react";
import "./styles/App.scss";
import { Content } from "./components/Content";
import { SideNav } from "./components/SideNav";
import { TopNav } from "./components/TopNav";
// import cheerio from "cheerio";
// import axios from "axios";

interface AppProps {
  bookmarkdata: any;
  recentbookmardata: any;
}

const App: React.FC<AppProps> = ({ bookmarkdata, recentbookmardata }) => {
  // states
  const RECENTLY_ADDED = "recently_added";
  const SEARCH_RESULT = "search_result";
  let [folders, setfolders] = React.useState<any>([]);
  let [bookmarks, setbookmarks] = React.useState<any>([]);
  const [selectedFolder, setselectedFolder] = React.useState<any>({
    id: RECENTLY_ADDED,
  });
  const [bookmarksOnView, setbookmarksOnView] = React.useState<any>([]);
  const [foldersToDisplay, setfoldersToDisplay] = React.useState<any>(null);
  const [currentParent, setcurrentParent] = React.useState<any>(null);

  // ALL methods
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
    chrome.runtime.sendMessage(str, (result) => {
      setselectedFolder({ id: SEARCH_RESULT, title: "Search result" });
      setbookmarksOnView(result);
    });
  };

  const showbookmarksOnView = (id: string) => {
    if (id === "0") {
      setbookmarksOnView(bookmarks);
    } else if (id === RECENTLY_ADDED) {
      setbookmarksOnView(recentbookmardata);
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
      console.log(folders);
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
    // const url = window.location.href;
    // const parentId = currentParent?.id;
    // try {
    //   axios.get(url).then((response) => {
    //     var $ = cheerio.load(response.data);
    //     var title = $("title").text();
    //     console.log(url, title, parentId);
    //     chrome.runtime.sendMessage({ title, url }, (response) => {
    //       //
    //     });
    //   });
    // } catch (error) {
    //   console.log("outer", error);
    // }
  };

  React.useEffect(() => {
    showbookmarksOnView(selectedFolder?.id);
    console.log(selectedFolder);
  }, [selectedFolder]);

  // use effects
  React.useEffect(() => {
    separateFolderFromBookmarks(bookmarkdata);
    handleNestingFolders();
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
              RECENTLY_ADDED={RECENTLY_ADDED}
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
