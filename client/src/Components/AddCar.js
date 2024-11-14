import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';

const AllCars = () => {
    const [carData, setCarData] = useState({
        title: '',
        description: '',
        tags: '',
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const token = Cookies.get('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const onDrop = (acceptedFiles) => {
        setError('');
        if (acceptedFiles.length + carData.images.length > 10) {
            setError('You can only upload up to 10 images.');
            return;
        }

        const validFiles = acceptedFiles.filter(file => {
            const isValid = file.type.startsWith('image/');
            if (!isValid) {
                setError(`File ${file.name} is not a valid image`);
            }
            return isValid;
        });

        setCarData(prevData => ({
            ...prevData,
            images: [...prevData.images, ...validFiles]
        }));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        maxFiles: 10
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRemoveImage = (index) => {
        setCarData(prevData => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            navigate('/login');
            return;
        }

        if (carData.images.length === 0) {
            setError('Please upload at least one image');
            return;
        }

        const formData = new FormData();

        carData.images.forEach((file) => {
            formData.append('image', file);
        });

        formData.append('title', carData.title);
        formData.append('description', carData.description);
        formData.append('tags', carData.tags);

        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/addCar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Add the token to Authorization header
                },
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to upload images');
            }

            const data = await response.json();
            console.log('Success:', data);

            setCarData({
                title: '',
                description: '',
                tags: '',
                images: []
            });
            setLoading(false);
            alert('Car added successfully!');

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Error uploading images');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center mb-3">Add a New Car</h2>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="shadow-sm p-3 rounded bg-light">
                <div className="mb-3">
                    <label htmlFor="title" className="form-label fs-6">Car Title</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        value={carData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-6">Description</label>
                    <textarea
                        className="form-control form-control-sm"
                        id="description"
                        name="description"
                        value={carData.description}
                        onChange={handleChange}
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="tags" className="form-label fs-6">Tags</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        id="tags"
                        name="tags"
                        value={carData.tags}
                        onChange={handleChange}
                        placeholder="e.g. SUV, luxury, sports"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fs-6">Images (Up to 10)</label>
                    <div
                        {...getRootProps()}
                        className={`dropzone p-2 border border-dashed rounded bg-light shadow-sm ${isDragActive ? 'border-primary' : ''
                            }`}
                    >
                        <input {...getInputProps()} />
                        <p className="text-center text-muted fs-6">
                            {isDragActive
                                ? "Drop the images here..."
                                : "Drag & drop images here, or click to select images"}
                        </p>
                        <p className="text-center text-muted small">
                            Supported formats: JPEG, PNG, GIF, WebP
                        </p>
                    </div>

                    <div className="mt-3">
                        {carData.images && carData.images.length > 0 && (
                            <div className="row">
                                {carData.images.map((image, index) => (
                                    <div key={index} className="col-3 mb-2 position-relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`car-image-${index}`}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ maxHeight: '150px', width: 'auto' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                            onClick={() => handleRemoveImage(index)}
                                            style={{ zIndex: 10 }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="d-flex justify-content-between">
                    <button
                        type="submit"
                        className="btn btn-primary btn-sm px-3 py-1"
                        disabled={loading || carData.images.length === 0}
                    >
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            'Submit'
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm px-3 py-1"
                        onClick={() => {
                            setCarData({ title: '', description: '', tags: '', images: [] });
                            setError('');
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AllCars;