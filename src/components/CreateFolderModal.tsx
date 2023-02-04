import * as React from "react";

interface CreateFolderModalProps {
  setisopen: (value: boolean) => void;
  submit: (folder: string, title: string) => void;
  folders?: any[];
  defaultSelectedFolder: any;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  setisopen,
  submit,
  defaultSelectedFolder,
}) => {
  const wrapperRef = React.useRef(null);
  const [title, settitle] = React.useState("");

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">
          Create Folder in{" "}
          <b style={{ opacity: 0.7 }}>{defaultSelectedFolder.title}</b>
        </div>
        <form>
          <label className="cmdb-label">Folder name</label>
          <input
            className="cmdb-input"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
        </form>
        <div className="cmdb-modal-footer">
          <button onClick={() => setisopen(false)} className="cmdb-secondary">
            Cancel
          </button>
          <button
            onClick={() => submit(defaultSelectedFolder.id, title)}
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
