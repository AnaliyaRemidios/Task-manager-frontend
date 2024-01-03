// import "./App.css";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import TaskList from "./pages/TaskList";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <TaskList></TaskList> */}
        {/* <Login></Login> */}
        <ToastContainer position="top-center" />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/signin" element={<Login />} />

          <Route path="/tasklist" element={<TaskList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
