import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Problems from "./components/Problems";
import Header from "./components/Header";
const App=()=> {

  return (
    <>
        <Header/>

        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/user" element={<Problems/>}/>
        </Routes>
    </>
  )
}

export default App;
