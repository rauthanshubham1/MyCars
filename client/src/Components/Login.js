import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        console.log("this is token: ", token);
        if (token) {
            navigate('/allcars');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                const expires = new Date(Date.now() + 86400000).toUTCString();
                document.cookie = `token=${data.token}; expires=${expires}; path=/; HttpOnly, SameSite=Strict`;

                alert('Login successful!');

                window.location.reload();
                navigate('/allcars');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            alert('An error occurred during login');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 custom-login-container">
            <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
                <h3 className="text-center mb-3">Login</h3>
                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            name="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="off"
                            name="password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
