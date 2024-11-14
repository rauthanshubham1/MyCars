import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';

const AllCars = () => {
    const [cars, setCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCars, setFilteredCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const token = Cookies.get('token');

    useEffect(() => {
        const fetchCars = async () => {
            try {

                const response = await fetch(`${process.env.REACT_APP_API_URL}/allCars`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                });

                if (response.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!response.ok) throw new Error('Failed to fetch cars');

                const data = await response.json();
                setCars(data);
                setFilteredCars(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching cars:', err);
                setLoading(false);
            }
        };

        fetchCars();
    }, [navigate]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = cars.filter(
            car => car.title.toLowerCase().includes(query) ||
                car.description.toLowerCase().includes(query) ||
                car.tags.toLowerCase().includes(query)
        );
        setFilteredCars(filtered);
    }, [searchQuery, cars]);

    const handleCarClick = (carId) => {
        navigate(`/cardetails/${carId}`);
    };

    if (loading) return <div className="text-center"><Spinner animation="border" /></div>;

    return (
        <div className="container mt-6">
            <h2 className="text-center mb-4">All Cars</h2>

            <div className="d-flex mb-4">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search Cars"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="row">
                {filteredCars.length === 0 ? (
                    <div className="col-12 text-center">No cars found</div>
                ) : (
                    filteredCars.map((car) => (
                        <div key={car._id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={car.images[0]} alt={`car-${car._id}`} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{car.title}</h5>
                                    <p className="card-text">{car.description}</p>
                                    <button className="btn btn-primary" onClick={() => handleCarClick(car._id)}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllCars;
