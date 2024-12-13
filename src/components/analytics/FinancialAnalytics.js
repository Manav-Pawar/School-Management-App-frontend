import React, { useState, useEffect } from 'react';
import { getFinancialAnalytics } from '../../servicers/api'

const FinancialAnalytics = () => {
  const [viewType, setViewType] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleViewTypeChange = (e) => {
    setViewType(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  // Define fetchData outside of useEffect
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getFinancialAnalytics(viewType, year, month);
      setFinancialData(response.data);
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError('Error fetching financial data. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData inside useEffect
  }, [viewType, year, month]); // Call fetchData whenever these parameters change

  const years = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Financial Analytics</h2>
      <div className="flex items-center mb-4">
        <label htmlFor="viewType" className="mr-2">
          View Type:
        </label>
        <select
          id="viewType"
          value={viewType}
          onChange={handleViewTypeChange}
          className="px-3 py-2 border rounded-md mr-4"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {viewType === 'monthly' && (
          <>
            <label htmlFor="month" className="mr-2">
              Month:
            </label>
            <select
              id="month"
              value={month}
              onChange={handleMonthChange}
              className="px-3 py-2 border rounded-md mr-4"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="year" className="mr-2">
          Year:
        </label>
        <select
          id="year"
          value={year}
          onChange={handleYearChange}
          className="px-3 py-2 border rounded-md mr-4"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={fetchData} // Call fetchData on button click
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {isLoading ? 'Fetching...' : 'Get Data'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {financialData && (
        <div>
          <h3 className="text-xl font-bold mb-2">Financial Summary</h3>
          <p>Total Salary Expense: ${financialData.expenses}</p>
          <p>Total Fees Income: ${financialData.income}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialAnalytics;