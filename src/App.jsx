import React, { useState, useEffect } from "react";
import { Brain, Home } from "lucide-react";
import { QuizCard } from "./components/QuizCard";
import { QuizQuestion } from "./components/QuizQuestion";
import { QuizResult } from "./components/QuizResult";

function App() {
  const [quizData, setQuizData] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const response = await fetch("https://testline-quiz-backend.onrender.com/api/data");
      const data = await response.json();
      setQuizData(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch quiz data");
      setLoading(false);
    }
  };

  // Transform API question format while preserving correct answer information
  const transformedQuestions = quizData?.questions?.map((q) => ({
    id: q.id,
    description: q.description,
    question: q.description, // Added for compatibility with QuizQuestion component
    options: q.options.map((opt) => opt.description),
    detailed_solution: q.detailed_solution,
    correctAnswer: q.options.findIndex((opt) => opt.is_correct),
    originalQuestion: q, // Keep original question data for results
  }));

  const transformedQuiz = quizData && {
    id: quizData.id,
    title: quizData.title,
    description: quizData.description,
    questions: transformedQuestions,
  };

  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

    if (timeLeft === 0) {
      handleAnswer(-1);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  const handleStartQuiz = (quizId) => {
    setActiveQuiz(quizId);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestion < transformedQuiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Calculate score based on correct answers
      const score = newAnswers.reduce((acc, curr, idx) => {
        return curr === transformedQuiz.questions[idx].correctAnswer
          ? acc + 1
          : acc;
      }, 0);

      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
  };

  const handleHome = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!activeQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
              <Brain size={48} className="text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Quiz Application
            </h1>
            <p className="text-xl text-gray-600">
              Test your knowledge with our interactive quizzes!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedQuiz && (
              <QuizCard
                key={transformedQuiz.id}
                quiz={transformedQuiz}
                onStart={handleStartQuiz}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const quiz = transformedQuiz;
  const question = quiz.questions[currentQuestion];

  if (showResult) {
    const score = userAnswers.reduce((acc, curr, idx) => {
      return curr === quiz.questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);

    return (
      <QuizResult
        score={score}
        totalQuestions={quiz.questions.length}
        questions={quiz.questions.map((q) => q.originalQuestion)} // Pass original questions for detailed solutions
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {quiz.title}
              </h1>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
            <button
              onClick={handleHome}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Home size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
              <span className="text-indigo-600 font-semibold">
                Time: {timeLeft}s
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quiz.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <QuizQuestion
            question={question}
            selectedAnswer={null}
            onAnswer={handleAnswer}
          />

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() =>
                currentQuestion > 0 && setCurrentQuestion((prev) => prev - 1)
              }
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {quiz.questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentQuestion ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleHome}
              className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
            >
              Quit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
