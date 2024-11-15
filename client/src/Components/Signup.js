import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [slowServerMessage, setSlowServerMessage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/allcars');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSlowServerMessage(false);

        // Show slow server message if response takes too long
        const slowServerTimeout = setTimeout(() => {
            setSlowServerMessage(true);
        }, 5000); // 5 seconds delay

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            clearTimeout(slowServerTimeout);

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful!');
                navigate('/allcars');
            } else {
                alert(data.message || 'Signup failed');
            }
        } catch (err) {
            alert('An error occurred during signup');
        } finally {
            setLoading(false);
            setSlowServerMessage(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 custom-signup-container">
            <div className="card p-4 shadow-sm" style={{ width: '400px' }}>
                <h3 className="text-center mb-3">Sign Up</h3>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                {loading && (
                    <div className="text-center mt-3 text-secondary">
                        {slowServerMessage
                            ? 'The server is slow due to inactivity. Please wait...'
                            : 'Processing your request...'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
