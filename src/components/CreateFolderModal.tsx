import * as React from "react";

interface CreateFolderModalProps {
  setisopen: (value: boolean) => void;
  submit: (folder: string, title: string) => void;
  folders: any[];
  defaultSelectedFolder: any;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  setisopen,
  submit,
  folders,
  defaultSelectedFolder,
}) => {
  const wrapperRef = React.useRef(null);
  const [title, settitle] = React.useState("");
  const [selectedFolderId, setselectedFolderId] = React.useState(
    defaultSelectedFolder.id
  );

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">Create Folder</div>
        <form>
          <label className="cmdb-label">Folder name</label>
          <input
            className="cmdb-input"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
          <label className="cmdb-label">Select parent folder</label>
          <select
            value={selectedFolderId}
            className="cmdb-select"
            onChange={(e) => setselectedFolderId(e.target.value)}
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
          <button
            onClick={() => submit(selectedFolderId, title)}
            className="cmdb-primary"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
