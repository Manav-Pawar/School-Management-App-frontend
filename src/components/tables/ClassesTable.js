import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import { getClasses, deleteClass } from '../../../src/servicers/api';
const ClassesTable = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await getClasses(page, limit, filter, sortBy);
      setClasses(response.data.classes);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error fetching classes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, limit, filter, sortBy]);

  const handleDelete = (classId) => {
    setSelectedClassId(classId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteClass(selectedClassId);
      setClasses(classes.filter((c) => c._id !== selectedClassId));
      if (classes.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchClasses();
      }
    } catch (err) {
      setError('Error deleting class');
    } finally {
      setShowDeleteModal(false);
      setSelectedClassId(null);
    }
  };

  const handleAddStudent = (classId) => {
    navigate(`/classes/${classId}/add-student`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const handleSortChange = (field) => {
    const newSortBy = sortBy === field ? `-${field}` : field;
    setSortBy(newSortBy);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Classes</h2>
        <Link
          to="/classes/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Class
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by class name..."
          value={filter}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading ? (
        <p>Loading classes...</p>
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
                  onClick={() => handleSortChange('year')}
                >
                  Year {sortBy === 'year' && <span className='text-xs'>▲</span>} {sortBy === '-year' && <span className='text-xs'>▼</span>}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((c) => (
                <tr key={c._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/class/${c._id}`} className="text-blue-600 hover:text-blue-900">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.teacher ? c.teacher.name : 'Not Assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.students.length} / {c.studentLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/classes/edit/${c._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleAddStudent(c._id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Add Student
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
        <p>Are you sure you want to delete this class?</p>
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

export default ClassesTable;