import React from "react";
import { ArrowRight } from "lucide-react";

export function QuizCard({ quiz, onStart }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
      <p className="text-gray-600 mb-4">{quiz.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        {quiz.questions.length} questions
      </p>
      <button
        onClick={() => onStart(quiz.id)}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
      >
        Start Quiz
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
