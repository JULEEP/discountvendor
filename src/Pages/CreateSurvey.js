import React, { useState } from 'react';
import axios from 'axios';

const CreateSurvey = () => {
  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      question: '',
      options: ['', '', '', ''],
    }))
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle question text change
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  // Handle option text change
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Handle next question click
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // API call to create survey
  const submitSurvey = async (formattedQuestions, vendorId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await axios.post(
        'http://31.97.206.144:6098/api/vendor/create-survey',
        {
          vendorId,
          questions: formattedQuestions,
        }
      );

      if (response.data.success) {
        setSuccessMessage('Survey created successfully!');
        // Optionally reset form or navigate away
        // reset form:
        setQuestions(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            question: '',
            options: ['', '', '', ''],
          }))
        );
        setCurrentQuestionIndex(0);
      } else {
        setError(response.data.message || 'Failed to create survey.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle submit survey
  const handleSubmit = (e) => {
    e.preventDefault();

    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      setError('Vendor ID not found. Please login again.');
      return;
    }

    // Format questions to match API expected structure
    const formattedQuestions = questions.map((q) => ({
      questionText: q.question.trim(),
      options: q.options.map((opt) => opt.trim()),
    }));

    // Validate before submit
    for (const q of formattedQuestions) {
      if (!q.questionText) {
        setError('Please fill out all question texts.');
        return;
      }
      if (q.options.some((opt) => !opt)) {
        setError('Please fill out all options for each question.');
        return;
      }
    }

    submitSurvey(formattedQuestions, vendorId);
  };

  return (
    <div className="survey-form-container max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Create Survey
      </h2>

      {/* Instruction Note */}
      <div
        className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
        role="alert"
      >
        <p className="font-bold">Note:</p>
        <p>
          This survey will be presented to users who will answer by selecting one option per
          question. Please carefully write each question along with four clear and distinct options.
          Use the Next and Previous buttons to navigate through the questions while creating the
          survey. After completing all questions, click "Submit Survey" to save it. Once saved,
          users will be able to see the survey and respond by choosing their preferred options.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="question-section mb-6">
          <label className="block text-xl text-gray-700 mb-2">{`Question ${currentQuestionIndex + 1}`}</label>
          <input
            type="text"
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Enter question text"
            value={questions[currentQuestionIndex].question}
            onChange={(e) =>
              handleQuestionChange(currentQuestionIndex, e.target.value)
            }
            disabled={loading}
          />
          <div className="options mt-4">
            {questions[currentQuestionIndex].options.map((option, oIdx) => (
              <div key={oIdx} className="flex items-center space-x-3 mt-4">
                <input
                  type="text"
                  className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  placeholder={`Option ${oIdx + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(currentQuestionIndex, oIdx, e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          {currentQuestionIndex > 0 && (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md focus:outline-none"
              disabled={loading}
            >
              Previous
            </button>
          )}

          <div>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={`px-6 py-3 rounded-md focus:outline-none ${
                  loading
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Survey'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSurvey;
