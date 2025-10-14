import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Body from "./components/Body";
import { Provider } from "react-redux";
import store from "./redux/appStore";
import Feed from "./components/Feed";
import Signup from "./components/Signup";
import Connections from "./components/Connections";
import Requests from "./components/Requests";

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
