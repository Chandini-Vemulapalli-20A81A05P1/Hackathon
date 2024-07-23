import React from 'react';
import ReactStars from 'react-stars';

const Showrating = ({ rating, review }) => {
  return (
    <div className="m-10 sm:mx-auto">
      <div className="bg-gray-200  flex flex-col  rounded-xl shadow-lg mt-4 p-4">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center bg-gray-100">
            <ReactStars
              count={5}
              size={40}
              value={rating}
              edit={false}
            />
            <span className="ml-2 text-gray-700">{rating}</span>
          </div>
          <p className="text-gray-500">{review}</p>
        </div>
      </div>
    </div>
  );
};

export default Showrating;
