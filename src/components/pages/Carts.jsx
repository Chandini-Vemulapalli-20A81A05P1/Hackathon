import axios from 'axios';
import React, { useEffect, useState } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5002/tasks');
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Error fetching tasks.');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await axios.post(`http://localhost:5002/tasks/${taskId}/complete`);
      console.log(response.data); // Confirm the backend response
      setTasks(prevTasks => prevTasks.map(task =>
        task.Task_Id === taskId ? { ...task, Task_Status: 'Waiting For Approval' } : task
      ));
      console.log(`Task ${taskId} marked as complete.`);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error updating task.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-gray-200 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div key={task.Task_Id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{task.Task_Name}</h3>
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {task.Task_Description}</p>
            <p className="text-gray-700 mb-2"><strong>Assigned By:</strong> {task.Assigned_By}</p>
            <p className="text-gray-700 mb-2"><strong>Assigned To:</strong> {task.Assigned_TO}</p>
            <p className="text-gray-700 mb-2"><strong>Start Date:</strong> {new Date(task.Start_Date).toLocaleString()}</p>
            <p className="text-gray-700 mb-2"><strong>Due Hours:</strong> {task.Due_Hours}</p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> {task.Task_Status}</p>
            <button 
              className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-700"
              onClick={() => handleCompleteTask(task.Task_Id)}
              disabled={task.Task_Status === 'Approved' }
            >
              {task.Task_Status === 'Approved' ? 'Approved' : 'Complete Task'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
