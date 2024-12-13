import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import { getTeachers, deleteTeacher } from '../../../src/servicers/api';
const TeachersTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await getTeachers(page, limit, filter, sortBy);
      setTeachers(response.data.teachers);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error fetching teachers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, limit, filter, sortBy]);

  const handleDelete = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTeacher(selectedTeacherId);
      // setTeachers(teachers.filter((t) => t._id !== selectedTeacherId));
      if (teachers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTeachers();
      }
    } catch (err) {
      setError('Error deleting teacher');
    } finally {
      setShowDeleteModal(false);
      setSelectedTeacherId(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1); // Reset to first page when limit changes
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (field) => {
    const newSortBy = sortBy === field ? `-${field}` : field;
    setSortBy(newSortBy);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Teachers</h2>
        <Link
          to="/teachers/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Teacher
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading ? (
        <p>Loading teachers...</p>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('name')}
                >
                  Name {sortBy === 'name' && <span className='text-xs'>▲</span>} {sortBy === '-name' && <span className='text-xs'>▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('gender')}
                >
                  Gender {sortBy === 'gender' && <span className='text-xs'>▲</span>} {sortBy === '-gender' && <span className='text-xs'>▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('contact')}
                >
                  Contact {sortBy === 'contact' && <span className='text-xs'>▲</span>} {sortBy === '-contact' && <span className='text-xs'>▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('salary')}
                >
                  Salary {sortBy === 'salary' && <span className='text-xs'>▲</span>} {sortBy === '-salary' && <span className='text-xs'>▼</span>}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((t) => (
                <tr key={t._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{t.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{t.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{t.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${t.salary}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/teachers/edit/${t._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <label htmlFor="limit" className="mr-2">
                Show:
              </label>
              <select
                id="limit"
                value={limit}
                onChange={handleLimitChange}
                className="px-3 py-2 border rounded-md"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <p>Are you sure you want to delete this teacher?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeachersTable;