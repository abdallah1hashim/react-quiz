import Option from "./Option";

function Questions({ question }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Option question={question} />
    </div>
  );
}

export default Questions;
