import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      const vendorId = localStorage.getItem('vendorId');
      if (!vendorId) {
        setError('Vendor ID not found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://31.97.206.144:6098/api/vendor/get-surveys/${vendorId}`
        );
        if (res.data.success && res.data.data.length > 0) {
          setSurveys(res.data.data);
          // Initialize showOptions array based on number of questions in first survey
          setShowOptions(Array(res.data.data[0].questions.length).fill(false));
        } else {
          setSurveys([]);
        }
      } catch (err) {
        setError('Failed to load surveys.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const toggleOptions = (index) => {
    const newShowOptions = [...showOptions];
    newShowOptions[index] = !newShowOptions[index];
    setShowOptions(newShowOptions);
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading surveys...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (surveys.length === 0) {
    return <p className="text-center text-gray-600 mt-10">No surveys available.</p>;
  }

  // For simplicity, show only first survey's questions and options
  const survey = surveys[0];

  return (
    <div className="survey-list-container p-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">Survey Questions</h2>

      <div className="survey-item p-6 border border-gray-300 rounded-xl shadow-xl bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Survey</h3>

        <ul className="space-y-6">
          {survey.questions.map((question, idx) => (
            <li key={question._id || idx} className="mb-4">
              <div className="flex justify-between items-center">
                <strong className="block text-xl font-medium mb-2 text-gray-700">
                  Q{idx + 1}: {question.questionText}
                </strong>
                <button
                  onClick={() => toggleOptions(idx)}
                  className="text-2xl text-blue-500 hover:text-blue-700 focus:outline-none"
                  aria-label={showOptions[idx] ? 'Collapse options' : 'Expand options'}
                >
                  {showOptions[idx] ? <IoIosRemove /> : <IoIosAdd />}
                </button>
              </div>

              {showOptions[idx] && (
                <ul className="space-y-2 pl-6 mt-2">
                  {question.options.map((option, oIdx) => (
                    <li
                      key={oIdx}
                      className="text-lg text-gray-700 flex items-center space-x-2"
                    >
                      <span>{oIdx + 1}.</span>
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SurveyList;
