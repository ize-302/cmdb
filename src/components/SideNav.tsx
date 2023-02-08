import * as React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { BookmarkProps } from "../types";
import {
  CMDB_TRASH,
  CMDB_RECENTLY_ADDED,
  CMDB_CREATE_BOOKMARK,
  CMDB_FOLDER_CREATED_MSG,
  CMDB_UPDATE_ITEM,
  CMDB_MOVE_ITEM,
  CMDB_FETCH_BOOKMARS_BY_FOLDER,
  CMDB_DELETE_BOOKMARK,
} from "../keys";
import FolderItem from "./FolderItem";
import CreateFolderModal from "./modals/CreateFolderModal";
import toast from "react-hot-toast";
import RenameFolderModal from "./modals/RenameFolderModal";
import MoveFolderModal from "./modals/MoveFolderModal";

interface SideNavProps {
  folders: any[];
  setselectedFolder: (payload: any) => void;
  selectedFolder: any;
  setcurrentParent: (payload: any) => void;
  currentParent: any;
  trash: BookmarkProps[];
  showMain: boolean;
  setshowMain: (value: boolean) => void;
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
  currentParent,
  setcurrentParent,
  trash,
  showMain,
  setshowMain,
  fetchBookmarks,
}) => {
  const dragOverItem = React.useRef();
  const [mainFolders, setmainFolders]: any[] = React.useState([]);
  const [showcreatefoldermodal, setshowcreatefoldermodal] =
    React.useState(false);
  const [showrenamefoldermodal, setshowrenamefoldermodal] =
    React.useState(false);
  const [showmovefoldermodal, setshowmovefoldermodal] = React.useState(false);
  const [foldersToDisplay, setfoldersToDisplay] = React.useState<any>([]);

  const fetchFoldersToDisplay = (id: string) => {
    return folders?.filter((folder) => folder.parentId === id);
  };

  const findParent = (id: string) => {
    return folders.find((folder) => folder.id === id);
  };

  const getFoldersByFolder = (folderId: any) => {
    chrome.runtime.sendMessage(
      { id: folderId, command: CMDB_FETCH_BOOKMARS_BY_FOLDER },
      (response) => {
        // filter out not folders, also filter out not children by folderid
        const filtered = response[0].children.filter(
          (item: any) => item.parentId === folderId && !item.url
        );
        // iterate over folders to modify
        const modified_folders: any[] = [];
        filtered.forEach((folder: any) => {
          const hasFolders = folder.children?.some((child: any) => !child.url);
          modified_folders.push({
            ...folder,
            hasFolders: hasFolders ? true : false,
          });
        });
        setfoldersToDisplay(modified_folders);
      }
    );
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
        setcurrentParent(selectedFolder);
        if (["1", "2", "3"].includes(selectedFolder.id)) {
          setshowMain(false);
        }
      }
    );
  };

  const handleRenameFolder = (folderId: string, title: string) => {
    chrome.runtime.sendMessage(
      {
        id: folderId,
        title,
        command: CMDB_UPDATE_ITEM,
      },
      (result) => {
        if (result) {
          setshowrenamefoldermodal(false);
          toast.success("Folder renamed");
          getFoldersByFolder(currentParent.id);
          fetchBookmarks();
          if (currentParent.id === selectedFolder.id) {
            setcurrentParent(result);
          }
          setselectedFolder(result);
        }
      }
    );
  };

  const handleMoveFolder = (destinationFolder: any) => {
    chrome.runtime.sendMessage(
      {
        bookmarks: [selectedFolder],
        parentId: destinationFolder.id,
        command: CMDB_MOVE_ITEM,
      },
      (res) => {
        if (res) {
          toast.success(`Folder moved to ${destinationFolder.title}`);
          setshowmovefoldermodal(false);
          fetchBookmarks();
          getFoldersByFolder(currentParent.id);
          setselectedFolder(currentParent);
          handleFolderNavigation(currentParent);
        }
      }
    );
  };

  const handleDeleteFolder = () => {
    chrome.runtime.sendMessage(
      { id: selectedFolder.id, command: CMDB_FETCH_BOOKMARS_BY_FOLDER },
      (response) => {
        if (response[0].children.length > 0) {
          toast.error(`${selectedFolder.title} folder contains items`);
        } else {
          chrome.runtime.sendMessage(
            {
              bookmarks: [selectedFolder],
              command: CMDB_DELETE_BOOKMARK,
            },
            (res) => {
              if (res === "deleted") {
                toast.success("Folder has been deleted");
                fetchBookmarks();
                getFoldersByFolder(currentParent.id);
                setselectedFolder(currentParent);
                handleFolderNavigation(currentParent);

                const getFoldersToDisplay = fetchFoldersToDisplay(
                  currentParent.id
                );
                if (getFoldersToDisplay.length <= 1) {
                  if (["1", "2", "3"].includes(currentParent.id)) {
                    setshowMain(true);
                    setselectedFolder(currentParent);
                  } else {
                    handleGoback();
                    getFoldersByFolder(currentParent.parentId);
                  }
                }
              }
            }
          );
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
                  renameFolder={() => setshowrenamefoldermodal(true)}
                  moveFolder={() => setshowmovefoldermodal(true)}
                  deleteFolder={() => handleDeleteFolder()}
                />
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
                      renameFolder={() => setshowrenamefoldermodal(true)}
                      moveFolder={() => setshowmovefoldermodal(true)}
                      deleteFolder={() => handleDeleteFolder()}
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
      {/* rename folder modal */}
      {showrenamefoldermodal && (
        <RenameFolderModal
          defaultSelectedFolder={selectedFolder}
          setisopen={(payload) => {
            setshowrenamefoldermodal(payload);
          }}
          submit={(folder, title) => {
            if (!title) {
              return toast.error("Folder should have a title");
            }
            handleRenameFolder(folder, title);
          }}
        />
      )}
      {/* move folder modal */}
      {showmovefoldermodal && (
        <MoveFolderModal
          folderToMove={selectedFolder}
          folders={folders}
          setisopen={(payload) => {
            setshowmovefoldermodal(payload);
          }}
          submitMoveFolder={handleMoveFolder}
        />
      )}
    </>
  );
};

interface MenuChildrenProps {
  setisopen: (payload: boolean) => void;
  createFolder: () => void;
  renameFolder: () => void;
  moveFolder: () => void;
  deleteFolder: () => void;
}

export const MenuChildren: React.FC<MenuChildrenProps> = ({
  setisopen,
  createFolder,
  renameFolder,
  moveFolder,
  deleteFolder,
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
          renameFolder();
          setisopen(false);
        }}
      >
        Rename
      </li>

      <li
        className="cmdb-menu-item"
        onClick={() => {
          moveFolder();
          setisopen(false);
        }}
      >
        Move
      </li>

      <li
        className="cmdb-menu-item delete"
        onClick={() => {
          deleteFolder();
          setisopen(false);
        }}
      >
        Delete
      </li>
    </>
  );
};
