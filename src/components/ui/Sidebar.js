import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/" className="block hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        </li>
        <li>
          <Link to="/classes" className="block hover:bg-gray-700 p-2 rounded">Classes</Link>
        </li>
        <li>
          <Link to="/teachers" className="block hover:bg-gray-700 p-2 rounded">Teachers</Link>
        </li>
        <li>
          <Link to="/students" className="block hover:bg-gray-700 p-2 rounded">Students</Link>
        </li>
        <li>
          <Link to="/financial-analytics" className="block hover:bg-gray-700 p-2 rounded">Financial Analytics</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;