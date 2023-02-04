import * as React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  FolderIcon,
  BookmarkIcon,
  TrashIcon,
  ClockIcon,
  FolderPlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/solid";
import { BookmarkProps } from "../types";
import {
  CMDB_TRASH,
  CMDB_RECENTLY_ADDED,
  CMDB_CREATE_BOOKMARK,
  CMDB_FOLDER_CREATED_MSG,
} from "../keys";
import Menu from "./Menu";
import FolderItem from "./FolderItem";
import CreateFolderModal from "./CreateFolderModal";
import toast from "react-hot-toast";
interface SideNavProps {
  folders: any[];
  setselectedFolder: (payload: any) => void;
  selectedFolder: any;
  foldersToDisplay: any[];
  setfoldersToDisplay: (payload: any) => void;
  setcurrentParent: (payload: any) => void;
  currentParent: any;
  trash: BookmarkProps[];
  showMain: boolean;
  setshowMain: (value: boolean) => void;
  getFoldersByFolder: (payload: string) => void;
  fetchBookmarks: () => void;
}

const displayGreeting = () => {
  const myDate = new Date();
  const hrs = myDate.getHours();
  let greet;

  if (hrs < 12) greet = "Good Morning";
  else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon";
  else if (hrs >= 17 && hrs <= 24) greet = "Good Evening";
  return greet;
};

export const SideNav: React.FC<SideNavProps> = ({
  folders,
  setselectedFolder,
  selectedFolder,
  foldersToDisplay,
  setfoldersToDisplay,
  currentParent,
  setcurrentParent,
  trash,
  showMain,
  setshowMain,
  getFoldersByFolder,
  fetchBookmarks,
}) => {
  const dragOverItem = React.useRef();
  const [mainFolders, setmainFolders]: any[] = React.useState([]);
  const [isopen, setisopen] = React.useState(false);
  const [showcreatefoldermodal, setshowcreatefoldermodal] =
    React.useState(false);

  const fetchFoldersToDisplay = (id: string) => {
    return folders?.filter((folder) => folder.parentId === id);
  };

  const findParent = (id: string) => {
    return folders.find((folder) => folder.id === id);
  };

  const handleFolderNavigation = (clickedfolder: any) => {
    setselectedFolder(clickedfolder);
    if (clickedfolder?.hasFolders) {
      setshowMain(false);
      const getFoldersToDisplay = fetchFoldersToDisplay(clickedfolder?.id);
      setcurrentParent(clickedfolder);
      setfoldersToDisplay(getFoldersToDisplay);
    }
  };

  const handleGoback = () => {
    // find parent siblings
    const parentAndSiblings = folders.filter(
      (folder) => folder.parentId === currentParent.parentId
    );
    // find the grand parent
    const grandparent = folders.find(
      (folder) => folder.id === currentParent.parentId
    );
    // console.log({ currentParent, parentAndSiblings, grandparent });
    if (
      ["1", "2", "3"].includes(currentParent.id) ||
      ["0"].includes(grandparent.id)
    ) {
      setshowMain(true);
      setselectedFolder({ id: CMDB_RECENTLY_ADDED });
    } else {
      setcurrentParent(grandparent);
      setfoldersToDisplay(parentAndSiblings);
      setshowMain(false);
    }
  };

  const dragEnter = (e: any, position: any) => {
    dragOverItem.current = position;
    console.log(e.target);
  };

  const handleCreateFolder = (folderId: string, title: string) => {
    chrome.runtime.sendMessage(
      { title, command: CMDB_CREATE_BOOKMARK, parentId: folderId },
      (response) => {
        toast.success(CMDB_FOLDER_CREATED_MSG);
        setshowcreatefoldermodal(false);
        getFoldersByFolder(folderId);
        fetchBookmarks();
        // setselectedFolder(response);
        // setbookmarksOnView([]);
        setcurrentParent(selectedFolder);
        if (["1", "2", "3"].includes(selectedFolder.id)) {
          setshowMain(false);
        }
      }
    );
  };

  React.useEffect(() => {
    if (folders) {
      const getFoldersToDisplay = fetchFoldersToDisplay("0");
      setmainFolders(getFoldersToDisplay);
    }
  }, [folders]);

  return (
    <>
      <div className="cmdb-sidenav">
        {showMain ? (
          <>
            <div className="cmdb-sidenav_greetings">{displayGreeting()}</div>
            <div className="cmdb-sidenav-items">
              {/* recently added */}
              <FolderItem
                folder={{
                  id: CMDB_RECENTLY_ADDED,
                  parentId: "",
                  title: "Recently added",
                }}
                selectedFolder={selectedFolder}
                handleFolderNavigation={handleFolderNavigation}
                onDragEnter={(e) => {}}
                createFolder={() => setshowcreatefoldermodal(true)}
              />
              {/* menus */}
              {mainFolders?.map(
                (folder: any, index: React.Key | null | undefined) => (
                  <FolderItem
                    key={index}
                    folder={folder}
                    selectedFolder={selectedFolder}
                    handleFolderNavigation={handleFolderNavigation}
                    onDragEnter={(e) => dragEnter(e, index)}
                    createFolder={() => setshowcreatefoldermodal(true)}
                  />
                )
              )}
              {/* trash */}
              <br />
              <FolderItem
                folder={{
                  id: CMDB_TRASH,
                  parentId: "",
                  title: "Trash",
                }}
                selectedFolder={selectedFolder}
                handleFolderNavigation={handleFolderNavigation}
                onDragEnter={() => {}}
                trash={trash}
                createFolder={() => setshowcreatefoldermodal(true)}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className="cmdb-sidenav_go-back"
              onClick={() => handleGoback()}
            >
              <ChevronLeftIcon width="14" />
              Go back
            </div>
            <div className="cmdb-sidenav-items">
              <>
                <FolderItem
                  folder={currentParent}
                  selectedFolder={selectedFolder}
                  handleFolderNavigation={handleFolderNavigation}
                  onDragEnter={(e) => {}}
                  createFolder={() => setshowcreatefoldermodal(true)}
                  isCurrentParent
                />
                {isopen && (
                  <Menu setisopen={setisopen}>
                    <MenuChildren
                      setisopen={setisopen}
                      createFolder={() => {
                        setshowcreatefoldermodal(true);
                      }}
                    />
                  </Menu>
                )}
              </>
              {/* subs */}
              {foldersToDisplay?.map(
                (folder: any, index: React.Key | null | undefined) => (
                  <div style={{ marginLeft: "5px" }} key={index}>
                    <FolderItem
                      folder={folder}
                      selectedFolder={selectedFolder}
                      handleFolderNavigation={handleFolderNavigation}
                      onDragEnter={(e) => dragEnter(e, index)}
                      createFolder={() => setshowcreatefoldermodal(true)}
                    />
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
      {/* create folder modal */}
      {showcreatefoldermodal && (
        <CreateFolderModal
          defaultSelectedFolder={selectedFolder}
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
    </>
  );
};

interface MenuChildrenProps {
  setisopen: (payload: boolean) => void;
  createFolder: () => void;
}

export const MenuChildren: React.FC<MenuChildrenProps> = ({
  setisopen,
  createFolder,
}) => {
  return (
    <>
      <li
        className="cmdb-menu-item"
        onClick={() => {
          createFolder();
          setisopen(false);
        }}
      >
        Add a folder
      </li>
      <li
        className="cmdb-menu-item"
        onClick={() => {
          setisopen(false);
        }}
      >
        Rename
      </li>

      <li
        className="cmdb-menu-item"
        onClick={() => {
          setisopen(false);
        }}
      >
        Move
      </li>

      <li
        className="cmdb-menu-item delete"
        onClick={() => {
          setisopen(false);
        }}
      >
        Delete
      </li>
    </>
  );
};
