import React from "react";
import Menu from "./Menu";
import { MenuChildren } from "./SideNav";
import {
  FolderIcon,
  BookmarkIcon,
  TrashIcon,
  ClockIcon,
  FolderPlusIcon,
  EllipsisVerticalIcon,
  DevicePhoneMobileIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { CMDB_TRASH, CMDB_RECENTLY_ADDED } from "../keys";

interface FolderItemProps {
  folder: any;
  selectedFolder: any;
  handleFolderNavigation: (payload: object) => void;
  onDragEnter: (e: any) => void;
  trash?: any;
  createFolder?: (payload: object) => void;
  isCurrentParent?: boolean;
  renameFolder?: (payload: object) => void;
  moveFolder?: (payload: object) => void;
  deleteFolder?: (payload: object) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  selectedFolder,
  handleFolderNavigation,
  onDragEnter,
  trash,
  createFolder,
  isCurrentParent = false,
  renameFolder,
  moveFolder,
  deleteFolder,
}) => {
  const [isopen, setisopen] = React.useState(false);

  const handleIconType = () => {
    if (isCurrentParent) {
      return <ArrowUturnRightIcon opacity={0.4} width="14" />;
    } else {
      if (["1", "2"].includes(folder.id)) {
        return <BookmarkIcon opacity={0.4} width="14" />;
      } else if (folder.id === "3") {
        return <DevicePhoneMobileIcon opacity={0.4} width="14" />;
      } else if (folder.id === CMDB_TRASH) {
        return <TrashIcon opacity={0.4} width="14" />;
      } else if (folder.id === CMDB_RECENTLY_ADDED) {
        return <ClockIcon opacity={0.4} width="14" />;
      } else {
        return <FolderIcon opacity={0.4} width="14" />;
      }
    }
  };

  return (
    <>
      <div
        onDragEnter={(e) => onDragEnter(e)}
        onDragCapture={() => {}}
        onDragExit={() => {}}
        onDragLeave={() => {}}
        onContextMenu={(e) => {
          e.preventDefault();
          if (
            e.button === 2 &&
            ![CMDB_RECENTLY_ADDED, CMDB_TRASH, "1", "2", "3"].includes(
              folder.id
            )
          ) {
            if (!folder.hasFolders) {
              setisopen(true);
              handleFolderNavigation(folder);
            } else {
              setisopen(true);
            }
          } else if (["1", "2", "3"].includes(folder.id)) {
            handleFolderNavigation(folder);
            createFolder && createFolder(folder);
          }
        }}
      >
        <input
          type="radio"
          name="items"
          checked={folder.id === selectedFolder.id}
          id={folder.id}
          value={folder.id}
          readOnly
        />
        <label
          htmlFor={folder.title}
          className="cmdb-sidenav-item"
          id={folder.id}
          onClick={(e) => {
            if (e.type === "click") {
              folder && handleFolderNavigation(folder);
            }
          }}
        >
          <span className="cmdb-sidenav-item_title_wrapper">
            <span>{handleIconType()}</span>
            <span className="cmdb-sidenav-item_title">
              {folder.title}
              {folder.id === CMDB_TRASH && trash?.length > 0 && (
                <span className="cmdb-trash-dot" />
              )}
            </span>
          </span>

          {/* for current parent folder */}
          {isCurrentParent && (
            <>
              {["1", "2", "3"].includes(folder.id) ? (
                <button
                  onClick={() => {
                    createFolder && createFolder(folder);
                  }}
                >
                  <FolderPlusIcon color="white" width="17" />
                </button>
              ) : (
                <button
                  className="cmdb-list-item_kebab"
                  onClick={() => {
                    setisopen(!isopen);
                    handleFolderNavigation(folder);
                  }}
                >
                  <EllipsisVerticalIcon color="white" width="14" />
                </button>
              )}
            </>
          )}

          {/* for regular folders */}
          {!isCurrentParent && (
            <>
              {["1", "2", "3"].includes(folder.id) && (
                <>
                  {folder.hasFolders ? (
                    <button
                      className="cmdb-list-item_kebab"
                      onClick={() => folder && handleFolderNavigation(folder)}
                    >
                      <ArrowUturnRightIcon color="white" width="12" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        createFolder && createFolder(folder);
                      }}
                    >
                      <FolderPlusIcon color="white" width="17" />
                    </button>
                  )}
                </>
              )}

              {/* current parent folder's children (regular) */}
              {![CMDB_TRASH, CMDB_RECENTLY_ADDED, "1", "2", "3"].includes(
                folder.id
              ) && (
                <>
                  {folder.hasFolders ? (
                    <button
                      className="cmdb-list-item_kebab"
                      onClick={() => folder && handleFolderNavigation(folder)}
                    >
                      <ArrowUturnRightIcon color="white" width="12" />
                    </button>
                  ) : (
                    <button
                      className="cmdb-list-item_kebab"
                      onClick={() => {
                        setisopen(!isopen);
                        handleFolderNavigation(folder);
                      }}
                    >
                      <EllipsisVerticalIcon color="white" width="14" />
                    </button>
                  )}
                </>
              )}
            </>
          )}

          {isopen && (
            <Menu setisopen={setisopen}>
              <MenuChildren
                setisopen={setisopen}
                createFolder={() => createFolder && createFolder(folder)}
                renameFolder={() => renameFolder && renameFolder(folder)}
                moveFolder={() => moveFolder && moveFolder(folder)}
                deleteFolder={() => deleteFolder && deleteFolder(folder)}
              />
            </Menu>
          )}
        </label>
      </div>
    </>
  );
};

export default FolderItem;
