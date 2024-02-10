function Progress({ numQuestions, index, answer, points, maxPoints }) {
  return (
    <div className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Questions {index + 1}/{numQuestions}
      </p>
      <p>
        {points}/{maxPoints} Points
      </p>
    </div>
  );
}

export default Progress;
