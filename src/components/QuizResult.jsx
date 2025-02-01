import React from "react";
import { QuizSolution } from "./QuizSolution";

export const QuizResult = ({
  score,
  totalQuestions,
  questions,
  onRetry,
  onHome,
}) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
        <p className="text-xl">
          Your score: {score} out of {totalQuestions}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Detailed Solutions</h3>
        {questions.map((question, index) => (
          <QuizSolution key={index} question={question} />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
        <button
          onClick={onHome}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};
