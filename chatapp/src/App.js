import "./App.css";
import { Button } from "@chakra-ui/react";
import HomePage from "./Pages/HomePage";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
