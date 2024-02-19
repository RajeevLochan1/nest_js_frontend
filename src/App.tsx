import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./components/SignInPage";
import { Toaster } from "sonner";
import HomePage from "./components/Home/Home";
import AddBookmark from "./components/Bookmark/AddBookmark";
import UpdateBookmark from "./components/Bookmark/UpdateBookmark";

function App() {
  return (
    <div>
      <Toaster position="bottom-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/addbookmark" element={<AddBookmark />} />
          <Route path="/editbookmark/:id" element={<UpdateBookmark />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
