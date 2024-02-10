function Option({ question, answer, dispatch }) {
  return (
      <div className="options">
        {question.options.map((option, index) => (
          <button
            disabled={answer !== null}
            className={`btn btn-option ${answer === index ? "answer" : ""} 
            ${
              answer !== null &&
              (+index === +question.correctOption ? "correct" : "wrong")
            }
            `}
            key={option}
            onClick={() => dispatch({ type: "answer", payload: index })}
          >
            {option}
          </button>
        ))}
      </div>
   
  );
}

export default Option;
