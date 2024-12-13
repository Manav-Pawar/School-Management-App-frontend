import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addTeacher, updateTeacher, getTeacher } from '../../servicers/api'; // Corrected import path

const AddTeacherForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teacherData, setTeacherData] = useState({
    name: '',
    gender: '',
    dob: '',
    contact: '',
    salary: 0,
    email: '', // Added email field
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (id) {
        try {
          const response = await getTeacher(id);
          const formattedDate = new Date(response.data.dob)
            .toISOString()
            .split('T')[0];
          setTeacherData({ ...response.data, dob: formattedDate });
        } catch (err) {
          setErrors({ fetchTeacher: 'Error fetching teacher data' });
        }
      }
    };

    fetchTeacherData();
  }, [id]);

  const handleChange = (e) => {
    // Make sure to update the email in teacherData as well
    setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!teacherData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!teacherData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!teacherData.dob) {
      newErrors.dob = 'Date of birth is required';
      isValid = false;
    }

    if (!teacherData.contact.trim() || !/^[0-9]{10}$/.test(teacherData.contact)) {
      newErrors.contact = 'Valid contact number is required';
      isValid = false;
    }

    if (teacherData.salary < 0) {
      newErrors.salary = 'Salary cannot be negative';
      isValid = false;
    }

    // Email validation (required and format)
    if (!teacherData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (id) {
        await updateTeacher(id, teacherData);
      } else {
        await addTeacher(teacherData);
      }
      navigate('/teachers');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Error saving teacher' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Teacher' : 'Add Teacher'}</h2>
      {errors.submit && <p className="text-red-500">{errors.submit}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={teacherData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="gender" className="block mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={teacherData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500">{errors.gender}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="dob" className="block mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={teacherData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.dob && <p className="text-red-500">{errors.dob}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block mb-2">
            Contact
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={teacherData.contact}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.contact && <p className="text-red-500">{errors.contact}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="salary" className="block mb-2">
            Salary
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={teacherData.salary}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.salary && <p className="text-red-500">{errors.salary}</p>}
        </div>
        {/* Email Field */}
        <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={teacherData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {isLoading ? 'Saving...' : 'Save Teacher'}
        </button>
      </form>
    </div>
  );
};

export default AddTeacherForm;