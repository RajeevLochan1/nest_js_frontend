import React, { useState, useEffect } from "react";
import axios from "axios";
import BookmarkModal from "./BookmarkModal";
// import "./Bookmarks.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Divider } from "@mui/material";
import { Chip } from "@mui/material";
import { Stack } from "@mui/material";
import { Card } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import moment from "moment";
interface Bookmark {
  id: string;
  title: string;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [link, setLink] = useState<string>("");

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
        // Sort bookmarks based on createdAt
        const sortedBookmarks = response.data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setBookmarks(sortedBookmarks);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      await axios.delete(`http://localhost:4000/bookmarks/${bookmarkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const updatedBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
      setBookmarks(updatedBookmarks);
      toast.success("Bookmark deleted successfully");
    } catch (error) {
      toast.error("Failed to delete bookmark");
      console.error("Error deleting bookmark:", error);
    }
  };

  return (
    <Box
      sx={{
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        rowGap: "10px",
        // maxWidth: '1032px',
        padding: "1rem",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h3"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        BookMarks
      </Typography>
      <Divider
        sx={{ height: "1px" }}
        color="#9ca3af"
        style={{ width: "100%" }}
      ></Divider>
      <span>
        <Link to={"/addbookmark"}>
          <Button
            style={{
              float: "right",
              width: "136px",
              backgroundColor: "blanchedalmond",
              color: "brown",
            }}
            // onClick={() => setIsModalOpen(true)}
          >
            Add Bookmark
          </Button>
        </Link>
      </span>
      <Grid
        container
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gridGap: "1.5rem",
          " @media(max-width:479px)": { gridGap: "1rem" },
        }}
      >
        {bookmarks.length > 0 ? (
          <>
            {bookmarks.map((item) => (
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "10px",
                  backgroundColor: "rgb(255, 255, 255)",
                  border: "1px solid rgba(36, 28, 21, 0.15)",
                  height: "auto",
                  padding: "16px",
                  // width: '100%',
                }}
              >
                <Typography>Title:{item.title}</Typography>
                <Typography>
                  {item.description
                    ? `Description:${item.description}`
                    : "No description"}
                </Typography>
                <Typography>Link:<a href={item.link} target="_blank" style={{textDecoration:"none", color:"black"}}>{item.link}</a></Typography>
                <Typography>
                  Created Time:{moment(item.createdAt).format("LLL")}
                </Typography>
                <Typography>
                  Updated Time:{moment(item.updatedAt).format("LLL")}
                </Typography>
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    style={{ width: "0", color: "red" }}
                    onClick={() => handleDeleteBookmark(item.id)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Link to={`/editbookmark/${item.id}`}>
                    <Button
                      style={{ width: "0" }}
                      // onClick={() => handleEditBookmark(item)}
                    >
                      <BorderColorIcon />
                    </Button>
                  </Link>
                </Grid>
              </Card>
            ))}
          </>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            No Bookmarks found
          </div>
        )}
      </Grid>
      <Dialog open={isModalOpen} fullWidth>
        <DialogContent>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Bookmark Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success">
            Yes
          </Button>
          <Button variant="contained" onClick={() => setIsModalOpen(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookmarks;
