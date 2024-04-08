import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import AppLayout from "./layouts/AppLayout";
import Library, { libraryLoader } from "./views/Library";
import ErrorBoundary from "./views/ErrorBoundary";
import Book, { bookLoader } from "./views/Book";
import Profile from "./views/Profile";
import Review from "./views/Review";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout/>}>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<Signup/>}/>
      <Route path="library" element={<Library/>} loader={libraryLoader}/>
      <Route path="library/book/:bookId" element={<Book/>} loader={bookLoader}/>
      <Route path="profile" element={<Profile/>} />
      <Route path="review" element={<Review/>} />

    </Route>
  )
)

const App = () => {

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
