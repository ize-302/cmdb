import * as React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { FolderIcon, BookmarkIcon } from "@heroicons/react/24/outline";

interface SideNavProps {
  folders: any[];
  setselectedFolder: (payload: any) => void;
  selectedFolder: any;
  foldersToDisplay: any[];
  setfoldersToDisplay: (payload: any) => void;
  setcurrentParent: (payload: any) => void;
  currentParent: any;
}

export const SideNav: React.FC<SideNavProps> = ({
  folders,
  setselectedFolder,
  selectedFolder,
  foldersToDisplay,
  setfoldersToDisplay,
  currentParent,
  setcurrentParent,
}) => {
  const fetchFoldersToDisplay = (id: string) => {
    return folders?.filter((folder) => folder.parentId === id);
  };

  const findParent = (id: string) => {
    return folders.find((folder) => folder.id === id);
  };

  const handleFolderNavigation = (clickedfolder: any) => {
    setselectedFolder(clickedfolder);
    if (clickedfolder?.hasChildren) {
      const getFoldersToDisplay = fetchFoldersToDisplay(clickedfolder?.id);
      setcurrentParent(clickedfolder);
      setfoldersToDisplay(getFoldersToDisplay);
    }
  };

  const handleGoback = () => {
    const getFoldersToDisplay = fetchFoldersToDisplay(currentParent?.parentId);
    // get parent
    const parent = findParent(getFoldersToDisplay[0]?.parentId);
    setcurrentParent(parent);
    setfoldersToDisplay(getFoldersToDisplay);
  };

  React.useEffect(() => {
    if (folders) {
      const getFoldersToDisplay = fetchFoldersToDisplay("0");
      setfoldersToDisplay(getFoldersToDisplay);
      // get parent
      const parent = findParent("0");
      setcurrentParent(parent);
    }
  }, [folders]);

  return (
    <div className="ext-sidenav">
      {currentParent?.id !== "0" ? (
        <div className="ext-go-back" onClick={() => handleGoback()}>
          <ChevronLeftIcon />
          {currentParent?.title}
        </div>
      ) : (
        <div className="greetings">Good afternnon</div>
      )}
      <div className="ext-sidenav-list">
        {foldersToDisplay?.map(
          (folder: any, index: React.Key | null | undefined) => (
            <div key={index}>
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
                className="ext-sidenav-item"
                onClick={() => folder && handleFolderNavigation(folder)}
              >
                {currentParent?.id === "0" ? <BookmarkIcon /> : <FolderIcon />}
                {folder.title}
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );
};
