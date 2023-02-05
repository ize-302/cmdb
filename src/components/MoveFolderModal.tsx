import * as React from "react";

interface MoveFolderModalProps {
  folders: any;
  setisopen: (payload: boolean) => void;
  submitMoveFolder: (folder: any) => void;
  folderToMove: any;
}

const MoveFolderModal: React.FC<MoveFolderModalProps> = ({
  folders,
  setisopen,
  submitMoveFolder,
  folderToMove,
}) => {
  const wrapperRef = React.useRef(null);
  const [destinationFolder, setdestinationFolder] = React.useState<any>({});
  // useOutsideAlerter(wrapperRef, setisopen);

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">
          Move <b style={{ color: "#fff" }}>{folderToMove.title}</b> Folder
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitMoveFolder(destinationFolder);
          }}
        >
          <label className="cmdb-label">Select destination folder</label>
          <select
            value={destinationFolder.id}
            className="cmdb-select"
            onChange={(e) => {
              const findFolder = folders.find(
                (folder: any) => folder.id === e.target.value
              );
              setdestinationFolder(findFolder);
            }}
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
              Move
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoveFolderModal;
