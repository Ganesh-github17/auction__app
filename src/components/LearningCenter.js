import React, { useState } from 'react';

function LearningCenter() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      questionText: 'What is an English Auction?',
      answerOptions: [
        { answerText: 'Prices decrease until someone bids', isCorrect: false },
        { answerText: 'Prices increase as buyers bid', isCorrect: true },
        { answerText: 'Buyers submit secret bids', isCorrect: false },
        { answerText: 'Sellers compete for lowest price', isCorrect: false },
      ],
    },
    {
      questionText: 'In a Dutch Auction, what happens to the price?',
      answerOptions: [
        { answerText: 'It starts low and increases', isCorrect: false },
        { answerText: 'It stays the same', isCorrect: false },
        { answerText: 'It starts high and decreases', isCorrect: true },
        { answerText: 'It is randomly determined', isCorrect: false },
      ],
    },
    {
      questionText: 'What is a Sealed-Bid Auction?',
      answerOptions: [
        { answerText: 'Bids are visible to everyone', isCorrect: false },
        { answerText: 'Only the highest bid is shown', isCorrect: false },
        { answerText: 'Bids are submitted secretly', isCorrect: true },
        { answerText: 'There is no bidding involved', isCorrect: false },
      ],
    },
  ];

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
  };

  return (
    <div className="learning-center">
      <h2>Auction Learning Center</h2>
      
      <div className="learning-content">
        <h3>Learn About Auctions</h3>
        <p>
          Welcome to our Learning Center! Here you can learn about different types of auctions
          and test your knowledge with our quiz.
        </p>
        
        <div className="auction-types-info">
          <h4>Common Auction Types:</h4>
          <ul>
            <li><strong>English Auction:</strong> The traditional auction where prices increase as buyers bid.</li>
            <li><strong>Dutch Auction:</strong> Starts with a high price that decreases until someone makes a bid.</li>
            <li><strong>Sealed-Bid Auction:</strong> Buyers submit secret bids, and the highest bid wins.</li>
          </ul>
        </div>
      </div>

      <div className="quiz-section">
        <h3>Test Your Knowledge</h3>
        {showScore ? (
          <div className="score-section">
            <h4>Quiz Complete!</h4>
            <p>You scored {score} out of {questions.length}</p>
            <button onClick={resetQuiz}>Try Again</button>
          </div>
        ) : (
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">{questions[currentQuestion].questionText}</div>
            <div className="answer-options">
              {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answerOption.isCorrect)}
                >
                  {answerOption.answerText}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningCenter;