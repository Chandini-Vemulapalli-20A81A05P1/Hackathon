import React, { useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RatingList = () => {
    const [avgRating, setAvgRating] = useState(null);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('app-User'))?.token;
        const id = JSON.parse(localStorage.getItem('app-User'))?.Emp_Id;

        if (!token || !id) {
            toast.error("No token or user ID found, please login again.");
            setLoading(false);
            return;
        }

        fetch(`http://localhost:5002/gettingrating?userid=${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to fetch rating data');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data); // Log the data for debugging
                if (data.avgRating !== undefined) {
                    setAvgRating(data.avgRating);
                    setRating(data.avgRating);
                } else {
                    toast.error(data.message || "No rating data available");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching rating:', error);
                toast.error(error.message || "An error occurred while fetching rating.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-300 py-6 sm:py-12">
            <div className="py-3 sm:max-w-xl sm:mx-auto">
                <div className="bg-white min-w-1xl mt-40 flex flex-col rounded-xl shadow-lg p-10 items-center">
                    <h2 className="text-gray-800 text-3xl font-semibold mb-4">Average Rating</h2>
                    <div className="flex flex-wrap justify-center w-3/5">
                        {avgRating !== null ? (
                            <div className="text-xl flex flex-col items-center">
                                <ReactStars
                                    count={5}
                                    value={rating}
                                    size={40}
                                    edit={false}
                                    color2={'#ffd700'}
                                    half={true}
                                    halfIcon={<i className="fas fa-star-half-alt"></i>}
                                />
                                <p className="mt-2">Your Average Rating is: {avgRating}</p>
                            </div>
                        ) : (
                            <div className="text-xl">
                                <p>No rating data available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RatingList;
