import axios from 'axios';
import React, { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
  const [taskData, setTaskData] = useState({
    taskName: '',
    taskDescription: '',
    assignedBy: '',
    assignedTo: '',
    startDate: '',
    dueHours: '',
    taskStatus: 'Pending',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTaskData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedTaskData = {
      Task_Name: taskData.taskName,
      Task_Description: taskData.taskDescription,
      Assigned_By: taskData.assignedBy,
      Assigned_TO: taskData.assignedTo,
      Start_Date: taskData.startDate,
      Due_Hours: taskData.dueHours,
      Task_Status: taskData.taskStatus,
    };

    try {
      const response = await axios.post('http://localhost:5000/TaskSubmission', formattedTaskData);
      console.log('Server response:', response.data);
      onSubmit(taskData); // Call the onSubmit prop if necessary
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className='h-full flex items-center justify-center '
      style={{ backgroundImage: 'url(https://img.freepik.com/premium-vector/abstract-modern-background-with-soft-blue-gradient-color-gradient-lowpoly-element_8221-1294.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-8 space-y-6 bg-opacity-80 m-3">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="taskName" className="block text-gray-700 font-semibold mb-2">Task Name</label>
            <input
              type="text"
              id="taskName"
              value={taskData.taskName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="taskDescription" className="block text-gray-700 font-semibold mb-2">Task Description</label>
            <textarea
              id="taskDescription"
              value={taskData.taskDescription}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          <div className='flex '>
            <label htmlFor="assignedBy" className="block text-gray-700 font-semibold mb-2">Assigned By:</label>&nbsp;&nbsp;
            <input
              type="text"
              id="assignedBy"
              value={taskData.assignedBy}
              onChange={handleChange}
              className="px-4 py-1 border border-gray-300  w-1.5/5 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="assignedTo" className="block text-gray-700 font-semibold mb-2">Assigned To:</label>&nbsp;&nbsp;
            <input
              type="text"
              id="assignedTo"
              value={taskData.assignedTo}
              onChange={handleChange}
              className="w-1.5/5 px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className='flex'>
            <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">Start Date:</label>&nbsp;&nbsp;
            <input
              type="date"
              id="startDate"
              value={taskData.startDate}
              onChange={handleChange}
              className="w-1.5/5 px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label htmlFor="dueHours" className="block text-gray-700 font-semibold mb-2">Due Hours:</label>&nbsp;&nbsp;
            <input 
              type="number"
              id="dueHours"
              value={taskData.dueHours}
              onChange={handleChange}
              className="w-1.5/5 px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="taskStatus" className="block text-gray-700 font-semibold mb-2">Task Status</label>
            <input 
              type="text"
              id="taskStatus"
              value={taskData.taskStatus}
              onChange={handleChange}
              className="w-1.5/5 px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
