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
  RECENTLY_ADDED: string;
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
  RECENTLY_ADDED,
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
    <div className="cmdb-app-sidenav">
      {currentParent?.id !== "0" ? (
        <div className="cmdb-app-go-back" onClick={() => handleGoback()}>
          <ChevronLeftIcon width="14" />
          {currentParent?.title}
        </div>
      ) : (
        <div className="greetings">{displayGreeting()}</div>
      )}
      <div className="cmdb-app-sidenav-list">
        {currentParent?.id === "0" && (
          <div>
            <input
              type="radio"
              name="items"
              checked={selectedFolder?.id === RECENTLY_ADDED}
              id={RECENTLY_ADDED}
              value={RECENTLY_ADDED}
              readOnly
            />
            <label
              htmlFor="Recently added"
              className="cmdb-app-sidenav-item"
              onClick={() =>
                handleFolderNavigation({
                  children: [],
                  hasBookmarks: true,
                  id: RECENTLY_ADDED,
                  parentId: "0",
                  title: "Recently added",
                })
              }
            >
              {currentParent?.id === "0" ? (
                <BookmarkIcon opacity={0.4} width="14" />
              ) : (
                <FolderIcon opacity={0.4} width="14" />
              )}
              Recently added
            </label>
          </div>
        )}
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
                className="cmdb-app-sidenav-item"
                onClick={() => folder && handleFolderNavigation(folder)}
              >
                {currentParent?.id === "0" ? (
                  <BookmarkIcon opacity={0.4} width="14" />
                ) : (
                  <FolderIcon opacity={0.4} width="14" />
                )}
                {folder.title}
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );
};
