import React from "react";

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  showResult,
}) {
  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {question.question}
      </h2>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = showResult && index === question.correctAnswer;
          const isWrong =
            showResult && isSelected && index !== question.correctAnswer;

          return (
            <button
              key={index}
              onClick={() => !showResult && onAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg transition-all ${
                isSelected
                  ? "bg-indigo-100 border-indigo-500"
                  : "bg-white hover:bg-gray-50"
              } ${
                isCorrect
                  ? "bg-green-100 border-green-500"
                  : isWrong
                  ? "bg-red-100 border-red-500"
                  : ""
              } border-2`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
