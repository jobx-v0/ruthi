// Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component for routing
import JobCard from './JobCards';
import Candidates from './Candidates';
// Define Sidebar component
const SidebarinRe = () => {
    const [isHovered, setIsHovered] = useState(false); // State to manage hover status

    return (
        <div 
            style={{
                width: isHovered ? '350px' : '80px', // Change width based on hover status
                height: '100vh',
                backgroundColor: '#f3f4f6',
                padding: '20px',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
                transition: 'width 0.3s', // Smooth transition for width change
            }}
            onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
        >
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px' }}>
                    <Link to="/JobCards" style={{
                        textDecoration: 'none',
                        color: '#1f2937',
                        fontWeight: 'bold',
                        padding: '10px',
                        display: 'block',
                        borderRadius: '5px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        {/* Show text based on sidebar width */}
                        {isHovered && <span>Job Card</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/Candidates" style={{
                        textDecoration: 'none',
                        color: '#1f2937',
                        fontWeight: 'bold',
                        padding: '10px',
                        display: 'block',
                        borderRadius: '5px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        {/* Show text based on sidebar width */}
                        {isHovered && <span>Candidates</span>}
                    </Link>
                </li>
                {/* Add other links or sections as needed */}
            </ul>
        </div>
    );
};

export default SidebarinRe;
