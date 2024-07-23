import React, { useEffect, useState } from 'react';
import Showrating from './Shorting'; // Import the Showrating component

const RatingList = () => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    // Fetch ratings data from backend
    fetch('http://localhost:5000/ratings_fetch')
      .then(response => response.json())
      .then(data => setRatings(data))
      .catch(error => console.error('Error fetching ratings:', error));
  }, []);

  return (
    <div className=" bg-gray-300 py-6  sm:py-12"  style={{ backgroundImage: 'url(https://i.makeagif.com/media/12-04-2018/IxHq7M.gif)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="py-3 sm:max-w-xl sm:mx-auto">
        <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg p-6 items-center ">
          <h2 className="text-gray-800 text-3xl font-semibold mb-4">Ratings</h2>
          <div className="flex flex-wrap justify-center w-3/5 ">
            {ratings.map((rating) => (
              <Showrating
                key={rating.Task_Id} // Unique key for each rating
                rating={rating.Rating}
                review={rating.Review}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingList;
