import React from 'react';

const Home = () => {
    return (
        <div className="image-container">
            <img
                src="https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Home"
                className="img-fluid w-100"
                style={{
                    objectFit: 'cover', 
                    height: '90vh',     
                    width: '100%',       
                }}
            />
        </div>
    );
};

export default Home;
