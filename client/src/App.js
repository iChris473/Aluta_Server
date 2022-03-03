
import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import { AuthContext } from "./context/AuthContext";
import ChatRoom from "./pages/ChatRoom";
import EditPost from "./pages/EditPost";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";


function App() {
  const {user} = useContext(AuthContext)
  return (
   <Router>
     <Routes>
        <Route exact path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" /> } />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />}/>
        <Route path="/register" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/editpost/:id" element={user ? <EditPost /> : <Navigate to="/login" />} />
        <Route path="/profile/update/:id" element={user ?<EditProfile /> : <Navigate to="/login" />} />
        <Route path="/friend/profile" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/messenger" element={user ? <ChatRoom /> : <Navigate to="/login" />} />
      </Routes>
   </Router>
  );
}

export default App;
