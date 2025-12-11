import React, { useState, useEffect } from "react";
import axios from "axios";

const SubmittedSurveys = () => {
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to fetch user info by id, returns a map of userId -> userName
  const fetchUsers = async (userIds) => {
    try {
      // Dummy example: replace with your actual user API endpoint
      const map = {};
      userIds.forEach((id) => {
        map[id] = `User ${id.slice(-4)}`;
      });
      return map;
    } catch {
      return {};
    }
  };

  useEffect(() => {
    const fetchSubmittedSurveys = async () => {
      setLoading(true);
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        setError("Vendor ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://31.97.206.144:6098/api/vendor/get-surveys/${vendorId}`
        );

        if (res.data.success && res.data.data.length > 0) {
          const survey = res.data.data[0];
          setQuestions(survey.questions || []);

          const surveyResponses = survey.responses || [];

          const userIds = [
            ...new Set(surveyResponses.map((resp) => resp.userId)),
          ];

          const userMap = await fetchUsers(userIds);
          setUsersMap(userMap);

          setResponses(surveyResponses);
        } else {
          setError("No survey data found.");
        }
      } catch (err) {
        setError("Failed to fetch submitted surveys.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmittedSurveys();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading submissions...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 mt-10">
        Error: {error}
      </p>
    );
  }

  if (responses.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-10">No submissions available.</p>
    );
  }

  return (
    <div className="submitted-surveys-container p-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Submitted Surveys
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-xl">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left text-gray-700">User</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Question ID</th>
              {questions.map((q, idx) => (
                <th
                  key={idx}
                  className="py-3 px-4 border-b text-left text-gray-700 whitespace-nowrap"
                >
                  Q{idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => {
              // Map answers by questionIndex for quick access
              const answersMap = {};
              resp.answers.forEach((ans) => {
                answersMap[ans.questionIndex] = ans.selectedOptionIndex;
              });

              // Get first answer's question _id to show last 4 chars as "Question ID"
              const firstAnswerId =
                resp.answers.length > 0 ? resp.answers[0]._id : null;
              const questionIdDisplay = firstAnswerId
                ? firstAnswerId.slice(-4)
                : "N/A";

              return (
                <tr key={resp._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-gray-800">
                    {usersMap[resp.userId] || resp.userId}
                  </td>
                  <td className="py-2 px-4 border-b text-gray-800">{questionIdDisplay}</td>
                  {questions.map((q, qIdx) => {
                    const selectedIdx = answersMap[qIdx];
                    const answerText =
                      selectedIdx !== undefined && q.options && q.options[selectedIdx]
                        ? q.options[selectedIdx]
                        : <span className="italic text-gray-400">Not Answered</span>;

                    return (
                      <td key={qIdx} className="py-2 px-4 border-b text-gray-700">
                        {answerText}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmittedSurveys;
