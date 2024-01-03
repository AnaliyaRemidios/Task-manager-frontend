import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./TaskList.css";
import Login from "./Login";
const TaskList = () => {
  // const TaskList = async (username, password) => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/tasks", {
  //       username,
  //       password,
  //     });
  //     const { token } = response.data;
  //     console.log("Sign-in successful! Token:", token);
  //   } catch (error) {
  //     console.error(
  //       "Error during sign-in:",
  //       error.response?.data?.error || "Unknown error"
  //     );
  //   }
  // };
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("low");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [Cookies, setCookie, removeCookie] = useCookies(null);

  const getData = async () => {
    try {
      if (Cookies.Email != null) {
        const response = await fetch(
          `http://localhost:5000/tasklist/${Cookies.Email}`
        );
        const json = await response.json();
        console.log(json);
        var fetchedTasks = [];
        var newId = 1;
        json.forEach((value) => {
          fetchedTasks.push({
            id: newId,
            name: value.task,
            priority: value.priority,
            completed: value.status,
          });
          newId++;
        });
        setTasks(fetchedTasks);
      }
    } catch (err) {
      console.log("error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const addTask = () => {
    const task = {
      id: tasks.length + 1,
      name: newTask,
      priority,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const updateTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id, name) => {
    setTasks(tasks.filter((task) => task.id !== id));
    handleDelete(name);
  };

  const markAsCompleted = (id, name) => {
    updateTask(id, { completed: true });
    handleUpdateStatus(name);
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) =>
      filterPriority ? task.priority === filterPriority : true
    );

  const handleLogout = () => {
    removeCookie("Email");
    window.location.href = "/";
  };

  const handlePostTask = async () => {
    const task = {
      name: newTask,
      priority: priority,
      completed: false,
    };
    try {
      const response = await fetch(
        `http://localhost:5000/tasklist/${Cookies.Email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(task),
        }
      );
      if (response.ok) {
        console.log("Data successfully posted to the server!");
      } else {
        console.error("Failed to post data to the server");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateStatus = async (name) => {
    try {
      const response = await fetch(
        `http://localhost:5000/tasklist/${Cookies.Email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: "true", name }),
        }
      );
      if (response.ok) {
        console.log("Status updated successfully!");
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (task) => {
    try {
      const response = await fetch(`http://localhost:5000/tasklist/${task}/${Cookies.Email}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("task deleted successfully!");
      } else {
        console.error("Failed to delete task.");
      }
    } catch (err) {
      console.log("error");
    }
  };

  const handleButton = () => {
    addTask();
    handlePostTask();
  };

  return (
    <div>
      <div className="tab">
        <label className="search">
          Search Task:
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <label>
          Filter Priority:
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <div className="logout">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="task">
        <h1>Add Your Task</h1>
      </div>
      <form className="container1">
        <label className="add">
          Task Name:
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </label>

        <label>
          Priority:
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <button type="button" className="button" onClick={handleButton}>
          Add Task
        </button>
      </form>

      <table border={1}>
        <thead>
          <tr>
            <th colSpan="3">Task Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td colSpan="3">{task.name} </td>
              <td>{task.priority}</td>
              <td> {task.completed ? "Completed" : "Not Completed"} </td>

              <td>
                {" "}
                <button onClick={() => deleteTask(task.id, task.name)}>
                  Delete
                </button>
              </td>
              {!task.completed && (
                <td>
                  {" "}
                  <button onClick={() => markAsCompleted(task.id, task.name)}>
                    Mark as Completed
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
// - Priority: {task.priority}
