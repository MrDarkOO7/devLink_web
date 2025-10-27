import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import { Provider } from "react-redux";
import store from "./redux/appStore";
import Feed from "./components/Feed";
import Signup from "./components/Signup";
import Connections from "./components/Connections";
import ProfilePage from "./components/ProfilePage";
import RequestsPage from "./components/RequestsPage";
import ChatPage from "./components/chat/ChatPage";

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
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:id" element={<ChatPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
