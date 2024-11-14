import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CarDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedCar, setUpdatedCar] = useState({ title: '', description: '', tags: '' });
    const [loading, setLoading] = useState(true);

    const token = Cookies.get('token');

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {

                const response = await fetch(`${process.env.REACT_APP_API_URL}/carDetails/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to fetch car details');
                const data = await response.json();
                setCar(data);
                setUpdatedCar({ title: data.title, description: data.description, tags: data.tags });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching car details:', error);
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [id]);

    if (loading) return <div>Loading car details...</div>;
    if (!car) return <div>Car not found</div>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCar((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateClick = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/carDetails/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify(updatedCar)
            });

            if (!response.ok) throw new Error('Failed to update car');
            const data = await response.json();
            setCar(data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating car:', error);
        }
    };

    const handleDelete = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/carDetails/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to delete car');
            navigate(-1);
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{car.title}</h2>
            <div className="row mb-4">
                {car.images.map((image, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <img src={image} alt={`car-image-${index}`} className="img-fluid rounded" />
                    </div>
                ))}
            </div>

            <div className="row">
                <div className="col-md-8">
                    {isEditing ? (
                        <div>
                            <h5>Update Car Details</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={updatedCar.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={updatedCar.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tags" className="form-label">Tags</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tags"
                                        name="tags"
                                        value={updatedCar.tags}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </form>
                            <button className="btn btn-success" onClick={handleUpdateClick}>Save Changes</button>
                        </div>
                    ) : (
                        <div>
                            <h5>Description</h5>
                            <p>{car.description}</p>
                            <h5>Tags</h5>
                            <p>{car.tags}</p>
                            <button className="btn btn-primary mt-2" onClick={() => setIsEditing(true)}>
                                Update Car Details
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete Car</button>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
