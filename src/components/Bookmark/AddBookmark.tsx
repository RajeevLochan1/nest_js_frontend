import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface Bookmark {
  id: string;
  title: string;
  description?: string;
  link: string;
}

const AddBookmark = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    title: "",
    description: "",
    link: "",
  });

  const [linkError, setLinkError] = useState<string | null>(null); // State for link validation error

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });

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

  const validateUrl = (url: string): boolean => {
    // Regular expression to validate URL format
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleAddBookmark = async () => {
    if (!validateUrl(values.link)) {
      setLinkError("Please enter a valid URL.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/bookmarks",
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(response.data.message);
      setBookmarks([...bookmarks, response.data]);
      navigate("/home");
    } catch (error: any) {
      toast.warning(error?.response?.data?.message[0]);
      console.error("Error adding bookmark:", error);
    }
  };

  return (
    <div>
      <Dialog open={true} fullWidth>
        <DialogContent>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Bookmark Title"
                value={values.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Description"
                value={values.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} mt={4}>
              <TextField
                fullWidth
                label="Link"
                value={values.link}
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
            onClick={handleAddBookmark}
          >
            Save
          </Button>
          <Button variant="contained" onClick={() => navigate("/home")}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBookmark;
