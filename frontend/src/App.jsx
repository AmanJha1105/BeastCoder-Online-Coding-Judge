import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Question from "./components/Question";
import AddQuestion from "./components/AddQuestion";
import QuestionDescription from "./components/QuestionDescription";
import AllSubmissions from "./components/AllSubmissions";
import PublishSolution from "./components/PublishSolution";
import Solutions from "./components/Solutions";

const App=()=> {

  return (
    <>
        <Header/>

        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/user" element={<Welcome/>}/>
          <Route path="/allquestion" element={<Question/>}/>
          <Route path="/add" element={<AddQuestion/>}/>
          <Route path="/allsubmissions" element={<AllSubmissions/>}/>
          <Route path="/pubhlishSolution/:submissionID" element={<PublishSolution/>}/>
          <Route path="/solutions/:quesID" element={<Solutions/>}/>
          <Route path="/question/:quesID" element={<QuestionDescription/>}/>
        </Routes>
    </>
  )
}

export default App;
