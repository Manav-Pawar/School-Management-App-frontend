import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import {
  getStudents,
  deleteStudent,
  assignStudentToClass,
  unassignStudentFromClass,
  getClasses,
} from '../../../src/servicers/api'; // Corrected import path

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const fetchClasses = async () => {
    try {
      const response = await getClasses();
      setClasses(response.data.classes);
    } catch (err) {
      setError('Error fetching classes');
    }
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await getStudents(page, limit, filter, sortBy);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Error fetching students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [page, limit, filter, sortBy]);

  const handleDelete = (studentId) => {
    setSelectedStudentId(studentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteStudent(selectedStudentId);
      // Optimistically update the UI by removing the student from the list.
      setStudents(students.filter((s) => s._id !== selectedStudentId));

      // Adjust the current page if the last student on the page was deleted.
      if (students.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        // Otherwise, re-fetch the students to update the list.
        fetchStudents();
      }
    } catch (err) {
      setError('Error deleting student');
    } finally {
      setShowDeleteModal(false);
      setSelectedStudentId(null);
    }
  };

  const handleAssignClass = async (studentId, classId) => {
    try {
      await assignStudentToClass(studentId, classId);
      // Optimistically update the student's class in the state
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s._id === studentId
            ? {
                ...s,
                class: {
                  _id: classId,
                  name: classes.find((c) => c._id === classId)?.name || '',
                },
              }
            : s
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Error assigning student to class');
    }
  };

  const handleUnassignClass = async (studentId) => {
    try {
      await unassignStudentFromClass(studentId);
      // Optimistically update the student's class in the state
      setStudents((prevStudents) =>
        prevStudents.map((s) => (s._id === studentId ? { ...s, class: null } : s))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Error unassigning student from class');
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
        <h2 className="text-2xl font-bold">Students</h2>
        <Link
          to="/students/add"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Add Student
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
        <p>Loading students...</p>
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
                  Name {sortBy === 'name' && <span className="text-xs">▲</span>}{' '}
                  {sortBy === '-name' && <span className="text-xs">▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('gender')}
                >
                  Gender{' '}
                  {sortBy === 'gender' && <span className="text-xs">▲</span>}
                  {sortBy === '-gender' && <span className="text-xs">▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('contact')}
                >
                  Contact{' '}
                  {sortBy === 'contact' && <span className="text-xs">▲</span>}
                  {sortBy === '-contact' && <span className="text-xs">▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('feesPaid')}
                >
                  Fees Paid{' '}
                  {sortBy === 'feesPaid' && <span className="text-xs">▲</span>}
                  {sortBy === '-feesPaid' && <span className="text-xs">▼</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Class
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((s) => (
                <tr key={s._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{s.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${s.feesPaid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {s.class ? (
                      <>
                        {s.class.name}
                        <button
                          onClick={() => handleUnassignClass(s._id)}
                          className="ml-2 text-red-600 hover:text-red-800 text-xs"
                        >
                          (Unassign)
                        </button>
                      </>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => handleAssignClass(s._id, e.target.value)}
                      >
                        <option value="">Assign Class</option>
                        {classes.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/students/edit/${s._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(s._id)}
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

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this student?</p>
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

export default StudentsTable;