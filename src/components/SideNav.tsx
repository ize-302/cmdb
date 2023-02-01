import * as React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  FolderIcon,
  BookmarkIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { BookmarkProps } from "../types";
import { CMDB_TRASH, CMDB_RECENTLY_ADDED } from "../keys";

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
}) => {
  const dragOverItem = React.useRef();
  const [mainFolders, setmainFolders]: any[] = React.useState([]);

  const fetchFoldersToDisplay = (id: string) => {
    return folders?.filter((folder) => folder.parentId === id);
  };

  const findParent = (id: string) => {
    return folders.find((folder) => folder.id === id);
  };

  const handleFolderNavigation = (clickedfolder: any) => {
    setselectedFolder(clickedfolder);
    if (clickedfolder?.hasChildren) {
      setshowMain(false);
      const getFoldersToDisplay = fetchFoldersToDisplay(clickedfolder?.id);
      setcurrentParent(clickedfolder);
      setfoldersToDisplay(getFoldersToDisplay);
    }
  };

  const handleGoback = () => {
    const parent = findParent(selectedFolder?.parentId);
    // find parent siblings
    const parentAndSiblings = folders.filter(
      (folder) => folder.parentId === parent.parentId
    );
    // find the grand parent
    const grandparent = folders.find((folder) => folder.id === parent.parentId);
    // console.log({ currentParent, parentAndSiblings, grandparent });
    if (
      ["1", "2", "3"].includes(currentParent.id) ||
      ["0"].includes(grandparent.id)
    ) {
      setshowMain(true);
    } else {
      setcurrentParent(grandparent);
      setfoldersToDisplay(parentAndSiblings);
      setshowMain(false);
    }
  };

  React.useEffect(() => {
    if (folders) {
      const getFoldersToDisplay = fetchFoldersToDisplay("0");
      setmainFolders(getFoldersToDisplay);
    }
  }, [folders]);

  const dragEnter = (e: any, position: any) => {
    dragOverItem.current = position;
    console.log(e.target);
  };

  return (
    <div className="cmdb-sidenav">
      {showMain ? (
        <>
          <div className="cmdb-sidenav_greetings">{displayGreeting()}</div>
          <div className="cmdb-sidenav-items">
            {/* recently added */}
            <div>
              <input
                type="radio"
                name="items"
                checked={selectedFolder?.id === CMDB_RECENTLY_ADDED}
                id={CMDB_RECENTLY_ADDED}
                value={CMDB_RECENTLY_ADDED}
                readOnly
              />
              <label
                htmlFor="Recently added"
                className="cmdb-sidenav-item"
                onClick={() =>
                  handleFolderNavigation({
                    children: [],
                    hasBookmarks: true,
                    id: CMDB_RECENTLY_ADDED,
                    parentId: "",
                    title: "Recently added",
                  })
                }
              >
                <ClockIcon opacity={0.4} width="14" />
                Recently added
              </label>
            </div>
            {/* menus */}
            {mainFolders?.map(
              (folder: any, index: React.Key | null | undefined) => (
                <div
                  key={index}
                  onDragEnter={(e) => dragEnter(e, index)}
                  onDragCapture={() => console.log("capture")}
                  onDragExit={() => console.log("exit")}
                  onDragLeave={() => console.log("leave")}
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
                    onClick={() => folder && handleFolderNavigation(folder)}
                    id={folder.id}
                  >
                    <BookmarkIcon opacity={0.4} width="14" />

                    {folder.title}
                  </label>
                </div>
              )
            )}
            {/* trash */}
            <br />
            <div>
              <input
                type="radio"
                name="items"
                checked={selectedFolder?.id === CMDB_TRASH}
                id={CMDB_TRASH}
                value={CMDB_TRASH}
                readOnly
              />
              <label
                htmlFor="Trash"
                className="cmdb-sidenav-item"
                onClick={() =>
                  handleFolderNavigation({
                    children: [],
                    hasBookmarks: true,
                    id: CMDB_TRASH,
                    parentId: "",
                    title: "Trash",
                  })
                }
              >
                <TrashIcon opacity={0.4} width="14" />
                Trash {trash?.length > 0 && <span className="dot" />}
              </label>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="cmdb-sidenav_go-back" onClick={() => handleGoback()}>
            <ChevronLeftIcon width="14" />
            Go back
          </div>
          <div className="cmdb-sidenav-items">
            <div className="cmdb-currentfolder-name">
              in: {currentParent?.title}
            </div>
            {/* subs */}
            {foldersToDisplay?.map(
              (folder: any, index: React.Key | null | undefined) => (
                <div
                  key={index}
                  onDragEnter={(e) => dragEnter(e, index)}
                  onDragCapture={() => console.log("capture")}
                  onDragExit={() => console.log("exit")}
                  onDragLeave={() => console.log("leave")}
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
                    onClick={() => folder && handleFolderNavigation(folder)}
                    id={folder.id}
                  >
                    <FolderIcon opacity={0.4} width="14" />
                    {folder.title}
                  </label>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
    // <div className="cmdb-sidenav">
    //   {currentParent?.id !== "0" ? (
    //     <div className="cmdb-sidenav_go-back" onClick={() => handleGoback()}>
    //       <ChevronLeftIcon width="14" />
    //       Go back
    //     </div>
    //   ) : (
    //     <div className="cmdb-sidenav_greetings">{displayGreeting()}</div>
    //   )}
    //   <div className="cmdb-sidenav-items">
    //     {currentParent?.id === "0" && (
    //       <div>
    //         <input
    //           type="radio"
    //           name="items"
    //           checked={selectedFolder?.id === CMDB_RECENTLY_ADDED}
    //           id={CMDB_RECENTLY_ADDED}
    //           value={CMDB_RECENTLY_ADDED}
    //           readOnly
    //         />
    //         <label
    //           htmlFor="Recently added"
    //           className="cmdb-sidenav-item"
    //           onClick={() =>
    //             handleFolderNavigation({
    //               children: [],
    //               hasBookmarks: true,
    //               id: CMDB_RECENTLY_ADDED,
    //               parentId: "",
    //               title: "Recently added",
    //             })
    //           }
    //         >
    //           <ClockIcon opacity={0.4} width="14" />
    //           Recently added
    //         </label>
    //       </div>
    //     )}
    //     {currentParent?.id !== "0" && (
    //       <div className="cmdb-currentfolder-name">
    //         in: {currentParent?.title}
    //       </div>
    //     )}
    //     {foldersToDisplay?.map(
    //       (folder: any, index: React.Key | null | undefined) => (
    //         <div
    //           key={index}
    //           onDragEnter={(e) => dragEnter(e, index)}
    //           onDragCapture={() => console.log("capture")}
    //           onDragExit={() => console.log("exit")}
    //           onDragLeave={() => console.log("leave")}
    //         >
    //           <input
    //             type="radio"
    //             name="items"
    //             checked={folder.id === selectedFolder.id}
    //             id={folder.id}
    //             value={folder.id}
    //             readOnly
    //           />
    //           <label
    //             htmlFor={folder.title}
    //             className="cmdb-sidenav-item"
    //             onClick={() => folder && handleFolderNavigation(folder)}
    //             id={folder.id}
    //           >
    //             {currentParent?.id === "0" ? (
    //               <BookmarkIcon opacity={0.4} width="14" />
    //             ) : (
    //               <FolderIcon opacity={0.4} width="14" />
    //             )}
    //             {folder.title}
    //           </label>
    //         </div>
    //       )
    //     )}

    //     <br />
    //     {currentParent?.id === "0" && (
    //       <div>
    //         <input
    //           type="radio"
    //           name="items"
    //           checked={selectedFolder?.id === CMDB_TRASH}
    //           id={CMDB_TRASH}
    //           value={CMDB_TRASH}
    //           readOnly
    //         />
    //         <label
    //           htmlFor="Trash"
    //           className="cmdb-sidenav-item"
    //           onClick={() =>
    //             handleFolderNavigation({
    //               children: [],
    //               hasBookmarks: true,
    //               id: CMDB_TRASH,
    //               parentId: "",
    //               title: "Trash",
    //             })
    //           }
    //         >
    //           <TrashIcon opacity={0.4} width="14" />
    //           Trash {trash?.length > 0 && <span className="dot" />}
    //         </label>
    //       </div>
    //     )}
    //   </div>
    // </div>
  );
};
