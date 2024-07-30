import axios from 'axios';
import React, { useState } from 'react';
import ReactStars from 'react-stars';
import { toast } from 'react-toastify';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [empId, setEmpId] = useState(''); // Add state for Employee ID

  const handleSubmit = () => {
    axios.post('http://localhost:5002/rating_insert', { rating, review, Emp_Id: empId }) // Include Emp_Id in the request payload
      .then(response => {
        toast.success('Rating submitted successfully');
      })
      .catch(error => {
        toast.error('Error submitting rating');
      });
  };

  return (
    <div className="bg-gray-300 flex flex-col justify-center" style={{ backgroundImage: 'url(https://img.freepik.com/premium-vector/abstract-modern-background-with-soft-blue-gradient-color-gradient-lowpoly-element_8221-1294.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', height: '700px' }}>
      <div className="py-3 sm:mx-auto m-10">
        <div className="bg-white flex flex-col rounded-xl shadow-lg">
          <div className="px-12 py-5">
            <h2 className="text-gray-800 text-3xl font-semibold">Your opinion matters to us!</h2>
          </div>
          <div className="bg-gray-200 w-full flex flex-col items-center">
            <div className="flex flex-col items-center py-6 space-y-3">
              <span className="text-lg text-gray-800">How was the quality of the work?</span>
              <div className="flex space-x-3 items-center">
                <ReactStars
                  count={5} // Number of stars
                  size={40} // Size of the stars
                  half={true} // Allow half stars
                  value={rating}
                  onChange={(rate) => setRating(rate)} // Initial value (set to 0 or any default)
                  edit={true} // Allow editing
                />
              </div>
            </div>
            <div className="w-3/4 flex flex-col">
              <textarea
                rows="3"
                className="p-4 text-gray-500 rounded-xl resize-none"
                placeholder="Leave a message, if you want"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              ></textarea>
              <input
                type="text"
                className="p-2 my-4 text-gray-500 rounded-xl"
                placeholder="Enter Employee ID"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
              >
                Rate now
              </button>
            </div>
          </div>
          <div className="h-20 flex items-center justify-center">
            <a href="#" className="text-gray-600">Maybe later</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
