import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassAnalytics } from '../../servicers/api'; // Corrected import path
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ClassAnalytics = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await getClassAnalytics(id);
        setClassData(response.data);
      } catch (err) {
        setError('Error fetching class analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassAnalytics();
  }, [id]);

  const genderData = classData && [
    { name: 'Male', value: classData.genderDistribution.male },
    { name: 'Female', value: classData.genderDistribution.female },
  ];

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading class analytics...</p>
      ) : (
        classData && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Class Analytics: {classData.class.name}
            </h2>
            <p>Year: {classData.class.year}</p>
            <p>Teacher: {classData.class.teacher.name}</p>
            <h3 className="text-xl font-bold mt-4 mb-2">Students</h3>
            <ul>
              {classData.class.students.map((student) => (
                <li key={student._id}>{student.name}</li>
              ))}
            </ul>
            <h3 className="text-xl font-bold mt-4 mb-2">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      )}
    </div>
  );
};

export default ClassAnalytics;