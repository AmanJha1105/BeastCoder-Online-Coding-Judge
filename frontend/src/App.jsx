import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Question from "./components/Question";
import AddQuestion from "./components/AddQuestion";
import QuestionDescription from "./components/QuestionDescription";

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
          <Route path="/question/:quesID" element={<QuestionDescription/>}/>
        </Routes>
    </>
  )
}

export default App;
