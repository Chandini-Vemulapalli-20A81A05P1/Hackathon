import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmployeeDetails = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tasks from the API
    axios.get('http://localhost:5002/employee_fetch')
      .then(response => {
        console.log('Response data:', response.data); // Check the structure here
        // Assuming the response data is an array or contains an array in a specific property
        setTasks(response.data.requests);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setError('Error fetching tasks.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4 bg-blue-100 min-h-screen bg-gray-300 mt-3">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(tasks) && tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md flex items-start space-x-4">
              <div className="h-12 w-12">
                <img
                  src="/images/user-icon.png"
                  alt="User Icon"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{task.Task_Name}</h3>
                <p className="text-gray-700 mb-2"><strong>First Name:</strong> {task.FirstName}</p>
                <p className="text-gray-700 mb-2"><strong>Last Name:</strong> {task.LastName}</p>
                <p className="text-gray-700 mb-2"><strong>Phone Number:</strong> {task.PhoneNumber}</p>
                <p className="text-gray-700 mb-2"><strong>Gender:</strong> {task.Gender}</p>
                <p className="text-gray-700 mb-2"><strong>Age:</strong> {task.Age}</p>
                <p className="text-gray-700 mb-2"><strong>Department:</strong> {task.Department}</p>
                <p className="text-gray-700"><strong>Supervisor:</strong> {task.Supervisor}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
