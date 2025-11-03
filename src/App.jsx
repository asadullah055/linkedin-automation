/* import LinkedInPostForm from "./components/LinkedInPostForm"

function App() {


  return (
    <div className="w-full  bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex justify-center items-center py-10">
      <LinkedInPostForm />
    </div>



  )
}

export default App
 */
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import LinkedInForm from "./pages/LinkedInForm";
import LinkedInPostForm from "./components/LinkedInPostForm";
import SuccessPage from "./pages/SuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LinkedInPostForm />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;