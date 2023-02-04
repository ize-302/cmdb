import React from "react";
import Menu from "./Menu";
import { MenuChildren } from "./SideNav";
import {
  FolderIcon,
  BookmarkIcon,
  TrashIcon,
  ClockIcon,
  FolderPlusIcon,
  ArrowRightIcon,
  FolderArrowDownIcon,
  EllipsisVerticalIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { CMDB_TRASH, CMDB_RECENTLY_ADDED } from "../keys";

interface FolderItemProps {
  folder: any;
  selectedFolder: any;
  handleFolderNavigation: (payload: object) => void;
  onDragEnter: (e: any) => void;
  trash?: any;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  selectedFolder,
  handleFolderNavigation,
  onDragEnter,
  trash,
}) => {
  const [isopen, setisopen] = React.useState(false);

  const handleIconType = () => {
    if (["1", "2"].includes(folder.id)) {
      return <FolderIcon opacity={0.4} width="14" />;
    } else if (folder.id === "3") {
      return <DevicePhoneMobileIcon opacity={0.4} width="14" />;
    } else if (folder.id === CMDB_TRASH) {
      return <TrashIcon opacity={0.4} width="14" />;
    } else if (folder.id === CMDB_RECENTLY_ADDED) {
      return <ClockIcon opacity={0.4} width="14" />;
    } else {
      return <BookmarkIcon opacity={0.4} width="14" />;
    }
  };

  return (
    <>
      <div
        onDragEnter={(e) => onDragEnter(e)}
        onDragCapture={() => console.log("capture")}
        onDragExit={() => console.log("exit")}
        onDragLeave={() => console.log("leave")}
        onContextMenu={(e) => {
          e.preventDefault();
          if (
            e.button === 2 &&
            ![CMDB_RECENTLY_ADDED, CMDB_TRASH].includes(folder.id)
          ) {
            if (!folder.hasFolders) {
              setisopen(true);
              handleFolderNavigation(folder);
            }
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
                <span className="dot" />
              )}
            </span>
          </span>
          {folder.id !== CMDB_TRASH && (
            <>
              {folder.hasFolders ? (
                <span
                  className="cmdb-list-item_kebab"
                  onClick={() => folder && handleFolderNavigation(folder)}
                >
                  <ArrowRightIcon color="white" width="14" />
                </span>
              ) : (
                <>
                  {folder.id !== CMDB_RECENTLY_ADDED && (
                    <span
                      className="cmdb-list-item_kebab"
                      onClick={() => {
                        setisopen(!isopen);
                        handleFolderNavigation(folder);
                      }}
                    >
                      <EllipsisVerticalIcon color="white" width="18" />
                    </span>
                  )}
                </>
              )}
            </>
          )}
          {isopen && (
            <Menu setisopen={setisopen}>
              <MenuChildren setisopen={setisopen} />
            </Menu>
          )}
        </label>
      </div>
    </>
  );
};

export default FolderItem;
