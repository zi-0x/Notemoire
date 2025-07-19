import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { showAlert } = props;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                EmailID: credentials.email,
                Password: credentials.password
            })
        });

        const json = await response.json();
        console.log(json);

        // if login was successful
        if (json.success) {
            localStorage.setItem('token', json.authToken);
            props.setIsAuthenticated(true);

            props.showAlert("Login successful", "success");
            navigate("/")
        } else {
            alert("Invalid credentials")
        }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className='mt-2'>
                <h2>Login to access your notes!</h2>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={credentials.email}
                            id="email"
                            aria-describedby="emailHelp"
                            onChange={onChange}
                        />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
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
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>

                    <div className="mt-3">
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={() => navigate('/signup')}
                        >
                            Don't have an account? Sign up here
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
