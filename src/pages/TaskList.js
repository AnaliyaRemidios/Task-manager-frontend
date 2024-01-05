import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TaskList.css";

const TaskList = () => {
  const history = useNavigate();
  useEffect(() => {
    const userEmail = localStorage.getItem("Email");
    if (!userEmail) {
      history("/");
    }
  }, [history]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("low");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const userEmail = localStorage.getItem("Email");

  const getData = async () => {
    try {
      if (userEmail != null) {
        const response = await axios.get(
          `http://localhost:5000/tasklist/${userEmail}`
        );
        const json = response.data;
        console.log(json);
        var fetchedTasks = [];

        json.forEach((value) => {
          var taskCompleted = false;
          if (value.status === "true") {
            taskCompleted = true;
          }
          fetchedTasks.push({
            id: value.id,
            name: value.task,
            priority: value.priority,
            completed: taskCompleted,
          });
        });
        setTasks(fetchedTasks);
      }
      if (userEmail === "") {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    getData();
    console.log("useeffect");
  }, []);

  const updateTask = (id, updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    handleDelete(id);
  };

  const markAsCompleted = (id) => {
    updateTask(id, { completed: true });
    handleUpdateStatus(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("Email");
    window.location.href = "/";
  };

  const handlePostTask = async () => {
    const task = {
      name: newTask,
      priority: priority,
      completed: false,
    };
    try {
      const response = await axios.post(
        `http://localhost:5000/tasklist/${userEmail}`,
        task,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Data successfully posted to the server!");
        getData();
      } else {
        console.error("Failed to post data to the server");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/tasklist/${userEmail}`,
        {
          completed: true,
          id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Status updated successfully!");
      } else {
        console.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/tasklist/${userEmail}/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("task deleted successfully!");
      } else {
        console.error("Failed to delete task.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const searchTask = async () => {
    const response = await axios.get(
      `http://localhost:5000/tasklist/${userEmail}/search?task=${searchTerm}&priority=${filterPriority}`
    );

    const json = response.data;
    console.log(json);
    var fetchedTasks = [];

    json.forEach((value) => {
      var taskCompleted = false;
      if (value.status === "true") {
        taskCompleted = true;
      }
      fetchedTasks.push({
        id: value.id,
        name: value.task,
        priority: value.priority,
        completed: taskCompleted,
      });
    });

    setTasks(fetchedTasks);
  };

  const handleButton = () => {
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
        <button onClick={searchTask}>Search</button>
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
          {tasks.map((task) => (
            <tr key={task.id}>
              <td colSpan="3">{task.name} </td>
              <td>{task.priority}</td>
              <td> {task.completed ? "Completed" : "Not Completed"} </td>
              <td>
                {" "}
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
              {!task.completed && (
                <td>
                  {" "}
                  <button onClick={() => markAsCompleted(task.id)}>
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
