import React, { useState } from "react";

interface Bookmark {
  id: string;
  title: string;
  description: string;
  link: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark | null;
  onSave: (bookmark: Bookmark) => void;
  onDelete: (bookmarkId: string) => void;
}

const BookmarkModal: React.FC<Props> = ({
  isOpen,
  onClose,
  bookmark,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState<string>(bookmark ? bookmark.title : "");
  const [description, setDescription] = useState<string>(
    bookmark ? bookmark.description : ""
  );
  const [link, setLink] = useState<string>(bookmark ? bookmark.link : "");

  const handleSave = () => {
    onSave({ id: bookmark ? bookmark.id : "", title, description, link });
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{bookmark ? "Edit Bookmark" : "Add Bookmark"}</h2>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Link:</label>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button onClick={handleSave}>{bookmark ? "Update" : "Save"}</button>
        {bookmark && (
          <button onClick={() => onDelete(bookmark.id)}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default BookmarkModal;
