import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSection = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = JSON.parse(localStorage.getItem('app-User'))?.token;
      const id = JSON.parse(localStorage.getItem('app-User'))?.Emp_Id;

      if (!token || !id) {
        toast.error("No token or user ID found, please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5002/employee_fetch1?userid=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log("Fetched data:", data.requests[0]);
        setUserData(data.requests[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error(error.message || "An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center py-4">No user data available.</div>;
  }

  return (
    <div className="min-h-screen  bg-gray-300 py-6 sm:py-12">
      <div className="sm:max-w-xl sm:mx-auto">
        <div className="bg-white shadow-lg mt-40 rounded-lg p-10 h-100vh">
          <div className="flex items-center ">
            <img
              src="https://avatar.iran.liara.run/public/boy?username=${userdata.UserName}" // Replace with actual avatar URL if available
              alt="user-avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
            />
            <div className="ml-4">
              <h2 className="text-4xl font-semibold text-gray-900">{userData.FirstName} {userData.LastName}</h2>
              <p className="text-xl text-gray-700"><b>Username</b>: {userData.UserName}</p>
              <p className="text-xl text-gray-700"><b>Phone</b>: {userData.PhoneNumber}</p>
              <p className="text-xl text-gray-700"><b>Gender</b>: {userData.Gender}</p>
              <p className="text-xl text-gray-700"><b>Age</b>: {userData.Age}</p>
              <p className="text-xl text-gray-700"><b>Department</b>: {userData.Department}</p>
              <p className="text-xl text-gray-700"><b>Role</b>: {userData.Role}</p>
              <p className="text-xl text-gray-700"><b>Supervisor</b>: {userData.Supervisor || 'N/A'}</p>
              <p className="text-xl text-gray-700"><b>Joined</b>: {new Date(userData.CreatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileSection;
