import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { FaClipboardList } from 'react-icons/fa';

const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState([]);
  const [hasSurveys, setHasSurveys] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      const vendorId = localStorage.getItem('vendorId');
      if (!vendorId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://api.redemly.com/api/vendor/get-surveys/${vendorId}`
        );
        
        console.log('Survey API Response:', res.data);
        
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setSurveys(res.data.data);
          // Initialize showOptions array based on number of questions in first survey
          if (res.data.data[0]?.questions?.length > 0) {
            setShowOptions(Array(res.data.data[0].questions.length).fill(false));
          }
          setHasSurveys(true);
        } else {
          setSurveys([]);
          setHasSurveys(false);
        }
      } catch (err) {
        console.error('Survey fetch error:', err);
        // If error is 404 or "No surveys found", handle gracefully
        if (err.response?.status === 404 || err.response?.data?.message?.includes('No surveys')) {
          setSurveys([]);
          setHasSurveys(false);
        }
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-blue-600">Loading surveys...</p>
          <p className="text-gray-500 mt-2">Fetching your survey data</p>
        </div>
      </div>
    );
  }

  // No surveys available
  if (!hasSurveys) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <FaClipboardList className="text-5xl text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            No Surveys Available
          </h2>
          
          <p className="text-gray-600 text-lg mb-6">
            There are currently no surveys assigned to your vendor account.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-semibold text-yellow-800 mb-2">What this means:</h3>
              <ul className="text-sm text-yellow-700 text-left space-y-1">
                <li>• No active surveys have been assigned to your account yet</li>
                <li>• Surveys are typically created by administrators</li>
                <li>• Check back later for new surveys</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Contact your administrator for survey assignments</li>
                <li>• Complete your profile if not already done</li>
                <li>• Make sure all documents are uploaded</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Display surveys if available
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Survey Questions
          </h1>
          <p className="text-gray-600 mt-2">Review and answer your assigned surveys</p>
        </div>

        {surveys.map((survey, surveyIndex) => (
          <div key={survey._id || surveyIndex} className="mb-8">
            {/* Survey Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Survey Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{survey.title || `Survey #${surveyIndex + 1}`}</h2>
                    <p className="text-blue-100 mt-1">
                      Total Questions: {survey.questions?.length || 0}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="inline-flex items-center px-4 py-2 bg-blue-800 bg-opacity-50 rounded-full text-sm font-medium">
                      <FaClipboardList className="mr-2" />
                      Active Survey
                    </span>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="p-6">
                <div className="space-y-6">
                  {survey.questions?.map((question, idx) => (
                    <div 
                      key={question._id || idx} 
                      className="border border-gray-300 rounded-xl p-5 hover:border-blue-400 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                              {idx + 1}
                            </span>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {question.questionText}
                              </h3>
                              {question.description && (
                                <p className="text-gray-600 text-sm mb-3">
                                  {question.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleOptions(idx)}
                          className="ml-4 p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                          aria-label={showOptions[idx] ? 'Collapse options' : 'Expand options'}
                        >
                          {showOptions[idx] ? 
                            <IoIosRemove className="text-2xl" /> : 
                            <IoIosAdd className="text-2xl" />
                          }
                        </button>
                      </div>

                      {/* Options */}
                      {showOptions[idx] && question.options && question.options.length > 0 && (
                        <div className="mt-4 pl-11">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-3">Options:</h4>
                            <ul className="space-y-2">
                              {question.options.map((option, oIdx) => (
                                <li
                                  key={oIdx}
                                  className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition"
                                >
                                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                                    {oIdx + 1}
                                  </span>
                                  <span className="text-gray-700">{option}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* No options message */}
                      {showOptions[idx] && (!question.options || question.options.length === 0) && (
                        <div className="mt-4 pl-11">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-700">No options available for this question.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Survey Info Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Survey ID</p>
                      <p className="font-mono text-sm text-gray-800 truncate">
                        {survey._id || 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Questions Count</p>
                      <p className="text-xl font-bold text-blue-600">
                        {survey.questions?.length || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Status</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* No Questions Warning */}
        {surveys.length > 0 && surveys.every(s => !s.questions || s.questions.length === 0) && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Questions Found</h3>
            <p className="text-yellow-700">
              This survey doesn't contain any questions yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyList;