import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileUpdatePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    githubUsername: '',
    linkedinUsername: '',
    skills: '',
    education: '',
    image: null
  });

  const{user}= useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(()=>{
   setFormData({...user})
  },[user])

  const {username} = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = new FormData();
    for (const key in formData) {
      userData.append(key, formData[key]);
    }
    try {
      const res = await axios.put(`http://localhost:5000/api/update/${username}`, userData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        fullName: '',
        location: '',
        githubUsername: '',
        linkedinUsername: '',
        skills: '',
        education: '',
        image: null
      });
      toast.success("Profile Updated Successfully.")
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <>
    {user?.username===username && <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-1/2 bg-gray-100 p-8 rounded-lg shadow-lg" encType="multipart/form-data">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Your Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} placeholder='full name' onChange={handleChange} className="form-input mt-1 block w-full" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input type="text" name="location" value={formData.location} placeholder='Your Location'onChange={handleChange} className="form-input mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Github Username</label>
          <input type="text" name="githubUsername" value={formData.githubUsername} placeholder='Your Github Username'onChange={handleChange} className="form-input mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">LinkedIn Username</label>
          <input type="text" name="linkedinUsername" value={formData.linkedinUsername} placeholder='Your LinkedIn Username'onChange={handleChange} className="form-input mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Skills</label>
          <input type="text" name="skills" value={formData.skills} placeholder='Your Skills' onChange={handleChange} className="form-input mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Education</label>
          <input type="text" name="education" value={formData.education} placeholder='Add Your Education' onChange={handleChange} className="form-input mt-1 block w-full" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Photo</label>
          <input type="file" name="image" onChange={handleImageChange} className="form-input mt-1 block w-full" />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save
        </button>
      </form>
    </div>}
    {user?.username!==username &&
      navigate(`/profile/${username}`)
    }
    </>
  );
};

export default ProfileUpdatePage;
