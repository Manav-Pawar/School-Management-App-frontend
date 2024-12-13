import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addStudent, getClasses, updateStudent, getStudent } from '../../../src/servicers/api';
const AddStudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [studentData, setStudentData] = useState({
    name: '',
    gender: '',
    dob: '',
    contact: '',
    feesPaid: 0,
    class: '',
  });
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStudentData = async () => {
      if (id) {
        try {
          const response = await getStudent(id);
          const formattedDate = new Date(response.data.dob).toISOString().split('T')[0];
          setStudentData({
            ...response.data,
            dob: formattedDate,
            class: response.data.class?._id || '',
          });
        } catch (err) {
          setErrors({ fetchStudent: 'Error fetching student data' });
        }
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await getClasses();
        setClasses(response.data.classes);
      } catch (err) {
        setErrors({ fetchClasses: 'Error fetching classes' });
      }
    };

    fetchStudentData();
    fetchClasses();
  }, [id]);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!studentData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!studentData.gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    if (!studentData.dob) {
      newErrors.dob = 'Date of birth is required';
      isValid = false;
    }

    if (!studentData.contact.trim() || !/^[0-9]{10}$/.test(studentData.contact)) {
      newErrors.contact = 'Valid contact number is required';
      isValid = false;
    }

    if (studentData.feesPaid < 0) {
      newErrors.feesPaid = 'Fees paid cannot be negative';
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
        await updateStudent(id, studentData);
      } else {
        await addStudent(studentData);
      }
      navigate('/students');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Error saving student' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Student' : 'Add Student'}</h2>
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
            value={studentData.name}
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
            value={studentData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
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
            value={studentData.dob}
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
            value={studentData.contact}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.contact && <p className="text-red-500">{errors.contact}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="feesPaid" className="block mb-2">
            Fees Paid
          </label>
          <input
            type="number"
            id="feesPaid"
            name="feesPaid"
            value={studentData.feesPaid}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.feesPaid && <p className="text-red-500">{errors.feesPaid}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="class" className="block mb-2">
            Class
          </label>
          <select
            id="class"
            name="class"
            value={studentData.class}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {isLoading ? 'Saving...' : 'Save Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;