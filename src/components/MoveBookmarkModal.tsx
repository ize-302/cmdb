import * as React from "react";
import { useOutsideAlerter } from "./Menu";
import { BookmarkProps } from "../types";

interface MoveBookmarkModalProps {
  folders: any;
  bookmarks: string[];
  setisopen: (payload: boolean) => void;
  submitMoveBookmark: (bookmarks: string[], selectedFolder: string) => void;
}

const MoveBookmarkModal: React.FC<MoveBookmarkModalProps> = ({
  folders,
  bookmarks,
  setisopen,
  submitMoveBookmark,
}) => {
  const wrapperRef = React.useRef(null);
  const [selectedFolder, setselectedFolder] = React.useState("");
  // useOutsideAlerter(wrapperRef, setisopen);

  const handleSubmit = () => {
    submitMoveBookmark(bookmarks, selectedFolder);
  };

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">
          Move bookmark {bookmarks.length > 1 && `(${bookmarks.length})`}
        </div>
        <form>
          <label className="cmdb-label">Select destination folder</label>
          <select
            value={selectedFolder}
            className="cmdb-select"
            onChange={(e) => setselectedFolder(e.target.value)}
          >
            <option>Select folder</option>
            {folders
              .filter((folder: any) => folder.title)
              .map((folder: any) => (
                <option value={folder.id} key={folder.id}>
                  {folder?.title}
                </option>
              ))}
          </select>
        </form>
        <div className="cmdb-modal-footer">
          <button onClick={() => setisopen(false)} className="cmdb-secondary">
            Cancel
          </button>
          <button onClick={() => handleSubmit()} className="cmdb-primary">
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveBookmarkModal;
