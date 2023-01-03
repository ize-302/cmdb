/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import React from "react";
import "./styles/App.scss";
import { Content } from "./components/Content";
import { SideNav } from "./components/SideNav";
import { TopNav } from "./components/TopNav";

interface AppProps {
  data: any;
}

const App: React.FC<AppProps> = ({ data }) => {
  // states
  let [folders, setfolders] = React.useState<any>([]);
  let [bookmarks, setbookmarks] = React.useState<any>([]);
  const [nestedfolders, setnestedfolders] = React.useState<any>([]);
  const [selectedFolder, setselectedFolder] = React.useState<any>(null);
  const [viewingBookmarks, setviewingBookmarks] = React.useState<any>([]);
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
      // generate favicon for a node
      let favicon =
        "https://s2.googleusercontent.com/s2/favicons?domain_url=" + node.url;
      newBookmarks.push({ ...node, favicon });
      bookmarks = newBookmarks;
    }
    setfolders(folders);
    setbookmarks(bookmarks);
  };

  const deepSearch = (
    object: { [x: string]: any; hasOwnProperty?: any },
    key: string,
    predicate: { (k: any, v: any): boolean; (arg0: any, arg1: any): boolean }
  ) => {
    if (object.hasOwnProperty(key) && predicate(key, object[key]) === true)
      return object;

    for (let i = 0; i < Object.keys(object).length; i++) {
      let value = object[Object.keys(object)[i]];
      if (typeof value === "object" && value != null) {
        let o: any = deepSearch(object[Object.keys(object)[i]], key, predicate);
        if (o != null) return o;
      }
    }
    return null;
  };

  const showViewingBookmarks = (id: string) => {
    if (id === "0") {
      setviewingBookmarks(bookmarks);
    } else {
      const filteredBookmarks = bookmarks.filter(
        (bookmark: { parentId: string }) =>
          parseInt(bookmark.parentId) === parseInt(selectedFolder?.id)
      );
      setviewingBookmarks(filteredBookmarks);
    }
  };

  const handleNestingFolders = () => {
    // console.log(folders);
    const temp_nested_folders: object[] = [];
    // iterate over folders
    folders.forEach((folder: { parentId: string; id: string }) => {
      // check if folder has children
      const hasChildren = folders.find(
        (child: { parentId: any }) => child.parentId === folder.id
      );
      temp_nested_folders.push({
        ...folder,
        hasChildren: hasChildren ? true : false,
      });
    });
    setfolders(temp_nested_folders);
    setselectedFolder(selectedFolder ? selectedFolder : folders?.[0]);
    showViewingBookmarks(selectedFolder?.id);
  };

  // use effects
  React.useEffect(() => {
    separateFolderFromBookmarks(data);
    handleNestingFolders();
  }, []);

  return (
    <div className="App">
      <div className="ext-shadow" />
      <div className="ext-container-border ext-container-show">
        <div className="ext-container">
          <TopNav />
          <div className="ext-body">
            <SideNav
              folders={folders}
              selectedFolder={selectedFolder}
              foldersToDisplay={foldersToDisplay}
              setfoldersToDisplay={setfoldersToDisplay}
              currentParent={currentParent}
              setcurrentParent={setcurrentParent}
              setselectedFolder={setselectedFolder}
            />
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
