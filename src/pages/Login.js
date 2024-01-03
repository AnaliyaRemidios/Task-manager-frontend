import React, { useState } from "react";
import {useCookies} from "react-cookie";
import "./Login.css";
import axios from "axios";
const Login = () => {
  const [action, setAction] = useState("Sign In");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const[Cookies,setCookie,removeCookie]=useCookies(null)
  const handleSubmit = async () => {
    try {
      console.log(name, email, password);
      if (action === "Sign Up" && name != "" && email != "" && password != "") {
        await axios.post("http://localhost:5000/signup", {
          name,
          email,
          password,
        }).then(response =>{
          setCookie("Email",email)
          console.log(response.data.message);
      });
        window.location.href = "/tasklist";
        // Handle successful signup
      } else if (action === "Sign In" && email != "" && password != "") {
        await axios.post("http://localhost:5000/signin", { email, password }).then(response =>{
          setCookie("Email",email)
          console.log(response.data.message);
      });
        // Handle successful signin
        window.location.href = "/tasklist";
      }

      //  else {
      //   await axios.post("http://localhost:5000/signin", { email, password });
      //   // Handle successful signin
      // }
    } catch (error) {
      console.error("API Error:", error);
      alert("Sign In error");
      // Handle error
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign In" ? (
          <div></div>
        ) : (
          <div className="input">
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
        )}
        <div className="input">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <br></br>
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        {action === "Sign Up" ? (
          <div></div>
        ) : (
          <div className="forgot-password">
            Forgot Password?<span>click here</span>
          </div>
        )}
        <div className="submit-container">
          <div
            className={action === "Sign In" ? "submit not" : "submit"}
            onClick={() => {
              setAction("Sign Up");
              handleSubmit();
            }}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "submit not" : "submit"}
            onClick={() => {
              setAction("Sign In");
              handleSubmit();
            }}
          >
            Sign In
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
