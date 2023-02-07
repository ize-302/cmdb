import * as React from "react";
import { useOutsideAlerter } from "../Menu";

interface CreateBookmarkModalProps {
  folders: any;
  setisopen: (payload: boolean) => void;
  submitCreateBookmark: (
    title: string,
    url: string,
    selectedFolderId: string
  ) => void;
  defaultSelectedFolder: any;
}

const CreateBookmarkModal: React.FC<CreateBookmarkModalProps> = ({
  folders,
  setisopen,
  submitCreateBookmark,
  defaultSelectedFolder,
}) => {
  const wrapperRef = React.useRef(null);
  const [selectedFolder, setselectedFolder] = React.useState(
    defaultSelectedFolder
  );
  useOutsideAlerter(wrapperRef, setisopen);
  const [title, settitle] = React.useState("");
  const [url, seturl] = React.useState("");

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">Add new bookmark</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitCreateBookmark(title, url, selectedFolder);
          }}
        >
          <label className="cmdb-label">URL</label>
          <input
            className="cmdb-input"
            value={url}
            onChange={(e) => seturl(e.target.value)}
          />

          <label className="cmdb-label">Name</label>
          <input
            className="cmdb-input"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />

          <label className="cmdb-label">Select parent folder</label>
          <select
            value={selectedFolder.id}
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
          <div className="cmdb-modal-footer">
            <button
              type="button"
              onClick={() => setisopen(false)}
              className="cmdb-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="cmdb-primary">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookmarkModal;
