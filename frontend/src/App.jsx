import { Route, Routes, useLocation } from "react-router-dom";
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
import SubmissionPage from "./pages/SubmissionPage";
import LeaderBoardPage from "./pages/LeaderBoardPage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage";
import ProfileUpdatePage from "./pages/ProfileUpatePage";
import Submissions from "./components/Submissions";
import Discussions from "./components/Discussions";
import SolutionCard from "./components/SolutionCard";

const App=()=> {

  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    if (currentPath !== '/login' && currentPath !== '/logout') {
      localStorage.setItem('lastVisitedPage', currentPath);
    }
  }, [location]);

  
  return (
    <>
        <Header/>

        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/allquestion" element={<Question/>}/>
          <Route path="/add" element={<AddQuestion/>}/>
          <Route path="/allsubmissions" element={<AllSubmissions/>}/>
          <Route path="/pubhlishSolution/:submissionID" element={<PublishSolution/>}/>
          <Route path="/solutions/:quesID" element={<Solutions/>}/>
          <Route path="/question/:quesID" element={<QuestionDescription/>}/>
          <Route path="/submissions/:submissionID" element={<SubmissionPage/>}/>
          <Route path="/leaderboard" element={<LeaderBoardPage/>}/>
          <Route path="/profile/:username" element={<ProfilePage/>}/>
          <Route path="/editprofile/:username" element={<ProfileUpdatePage/>}/>
          <Route path="/question/:titleslug/submissions" element={<Submissions/>}/>
          <Route path="/question/:titleslug/discuss" element={<Discussions/>}/>
          <Route path="/question/:titleslug/solutions" element={<Solutions/>}/>
          <Route path="/question/:titleslug/solutions/:solutionID" element={<SolutionCard/>}/>
        </Routes>
        <Toaster />
    </>
  )
}

export default App;
