import Main from "./Main";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Questions from "./Questions";

import { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import Progress from "./Progress";
import FinishScreen from "./finishScreen";
import NextButton from "./NextButton";
import Timer from "./Timer";

const SECONDSFORQUIZ = 140;

const intialState = {
  questions: [],
  // loading || error || ready || active || finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: SECONDSFORQUIZ,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "answer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: (state.answer = null),
      };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
        secondsRemaining: SECONDSFORQUIZ,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, intialState);

  const numQuestions = questions.length;

  const maxPoints = questions.reduce((acc, curr) => {
    return (acc += curr.points);
  }, 0);

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch("https://api.npoint.io/0c45b6f573f085465825");
        const { questions } = await res.json();

        dispatch({ type: "dataRecived", payload: questions });
      } catch (error) {
        console.error("Error fetching data:", error);
        dispatch({ type: "dataFailed" });
      }
    }
    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              answer={answer}
              points={points}
              maxPoints={maxPoints}
            />
            <Questions
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
            <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
            {answer !== null && (
              <NextButton
                numQuestions={numQuestions}
                index={index}
                dispatch={dispatch}
              />
            )}
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
