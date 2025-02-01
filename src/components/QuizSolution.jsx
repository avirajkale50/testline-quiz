import React from "react";

export const QuizSolution = ({ question }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
      <h3 className="font-medium text-lg mb-2">{question.description}</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Correct Answer:</p>
        <p className="font-medium text-green-600">
          {question.options.find((opt) => opt.is_correct)?.description}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Detailed Solution:</p>
        <p className="text-gray-800">{question.detailed_solution}</p>
      </div>
    </div>
  );
};
