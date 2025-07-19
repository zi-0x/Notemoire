import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ email: "", name: "", password: "", cpassword: "" });
  const { setIsAuthenticated } = props;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (credentials.password !== credentials.cpassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/Createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: credentials.name,
          EmailID: credentials.email,
          Password: credentials.password
        })
      });

      const json = await response.json();
      console.log(json);

      if (json.success) {
        localStorage.setItem('token', json.authToken);  // Store token
        setIsAuthenticated(true);                        // Update login status
        alert("Signup successful");
        navigate("/");                                   // Redirect to home
      } else {
        alert("User with that email already exists!");
      }
    } catch (error) {
      alert("Signup failed. Please try again later.");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className='mt-2'>
        <h2>Create your account and get started!</h2>
      </div>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={credentials.email}
              id="email"
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Enter Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={credentials.name}
              id="name"
              onChange={onChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              id="password"
              onChange={onChange}
              required
              minLength={5}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              name="cpassword"
              value={credentials.cpassword}
              id="cpassword"
              onChange={onChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        <button
          type="button"
          className="btn btn-link p-1 pt-3"
          onClick={() => navigate('/login')}
        >
          Already have an account? Login here!
        </button>
      </div>
    </>
  );
};

export default Signup;
