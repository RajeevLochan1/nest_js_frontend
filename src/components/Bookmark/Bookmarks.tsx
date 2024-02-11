import React, { useState, useEffect } from "react";
import axios from "axios";
import BookmarkModal from "./BookmarkModal";
import "./Bookmarks.css";

interface Bookmark {
  id: string;
  title: string;
  description: string;
  link: string;
}

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get<Bookmark[]>(
          "http://localhost:4000/bookmarks",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setBookmarks(response.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, []);

  const handleAddBookmark = async (bookmark: Bookmark) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/bookmarks",
        bookmark,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setBookmarks([...bookmarks, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  const handleEditBookmark = async (bookmark: Bookmark) => {
    try {
      await axios.patch(
        `http://localhost:4000/bookmarks/${bookmark.id}`,
        bookmark,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const updatedBookmarks = bookmarks.map((b) =>
        b.id === bookmark.id ? bookmark : b
      );
      setBookmarks(updatedBookmarks);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing bookmark:", error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      await axios.delete(`http://localhost:4000/bookmarks/${bookmarkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const updatedBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  const handlePreviewBookmark = (bookmark: Bookmark) => {
    setSelectedBookmark(bookmark);
    setIsModalOpen(true);
  };

  return (
    <div className="bookmarks-container">
      <h2>Bookmarks</h2>
      <button className="save-button" onClick={() => setIsModalOpen(true)}>
        Add Bookmark
      </button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookmarks.map((bookmark) => (
            <tr key={bookmark.id}>
              <td>{bookmark.title}</td>
              <td>
                <a
                  href={bookmark.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bookmark.link}
                </a>
              </td>
              <td>
                <button onClick={() => handlePreviewBookmark(bookmark)}>
                  Update
                </button>
                <button onClick={() => handleDeleteBookmark(bookmark.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <BookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={selectedBookmark ? handleEditBookmark : handleAddBookmark}
        onDelete={handleDeleteBookmark}
        bookmark={selectedBookmark}
      />
    </div>
  );
};

export default Bookmarks;