import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass, getTeachers, updateClass, getClass } from '../../../src/servicers/api';
const AddClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [classData, setClassData] = useState({
    name: '',
    year: '',
    teacher: '',
    studentFees: 0,
    studentLimit: 30,
  });
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await getTeachers();
        setTeachers(response.data.teachers);
      } catch (err) {
        setErrors({ fetchTeachers: 'Error fetching teachers' });
      }
    };

    const fetchClassData = async () => {
      if (id) {
        try {
          const response = await getClass(id);
          setClassData(response.data);
        } catch (err) {
          setErrors({ fetchClass: 'Error fetching class data' });
        }
      }
    };

    fetchTeachers();
    fetchClassData();
  }, [id]);

  const handleChange = (e) => {
    setClassData({ ...classData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!classData.name.trim()) {
      newErrors.name = 'Class name is required';
      isValid = false;
    }

    if (!classData.year) {
      newErrors.year = 'Year is required';
      isValid = false;
    }

    if (classData.studentFees < 0) {
      newErrors.studentFees = 'Student fees cannot be negative';
      isValid = false;
    }

    if (classData.studentLimit < 1) {
      newErrors.studentLimit = 'Student limit must be at least 1';
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
        await updateClass(id, classData);
      } else {
        await addClass(classData);
      }
      navigate('/classes');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Error saving class' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Class' : 'Add Class'}</h2>
      {errors.submit && <p className="text-red-500">{errors.submit}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Class Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={classData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block mb-2">
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={classData.year}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.year && <p className="text-red-500">{errors.year}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="teacher" className="block mb-2">
            Teacher
          </label>
          <select
            id="teacher"
            name="teacher"
            value={classData.teacher}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="studentFees" className="block mb-2">
            Student Fees
          </label>
          <input
            type="number"
            id="studentFees"
            name="studentFees"
            value={classData.studentFees}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.studentFees && <p className="text-red-500">{errors.studentFees}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="studentLimit" className="block mb-2">
            Student Limit
          </label>
          <input
            type="number"
            id="studentLimit"
            name="studentLimit"
            value={classData.studentLimit}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.studentLimit && <p className="text-red-500">{errors.studentLimit}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {isLoading ? 'Saving...' : 'Save Class'}
        </button>
      </form>
    </div>
  );
};

export default AddClassForm;