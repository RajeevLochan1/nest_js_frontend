import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const UpdateBookmark = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });

//   const { title, description, link } = formData;

  const [linkError, setLinkError] = useState<string | null>(null); // State for link validation error

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    if (field === "link") {
      if (value.trim() === "") {
        setLinkError(null);
      } else if (!validateUrl(value)) {
        setLinkError("Please enter a valid URL.");
      } else {
        setLinkError(null);
      }
    }
  };

  const validateUrl = (url: string) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleUpdateBookmark = async () => {
    try {
      if (!validateUrl(formData.link)) {
        setLinkError("Please enter a valid URL.");
        return;
      }

      const response = await axios.patch(
        "http://localhost:4000/bookmarks/" + id,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/home");
    } catch (error: any) {
      console.error("Error updating bookmark:", error);
      toast.warning(error?.response?.data?.message[0]);
    }
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/bookmarks/" + id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const { title, description, link } = response.data;
        setFormData({ title, description, link });
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div>
      <Dialog open={true} fullWidth>
        <DialogContent>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Bookmark Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Link"
                value={formData.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                error={linkError !== null}
                helperText={linkError}
              />
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateBookmark}
          >
            Update
          </Button>
          <Button variant="contained" onClick={() => navigate("/home")}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateBookmark;
