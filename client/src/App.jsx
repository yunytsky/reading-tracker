import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import AppLayout from "./layouts/AppLayout";
import Library from "./views/Library";
import ErrorBoundary from "./views/ErrorBoundary";
import Book, { bookLoader } from "./views/Book";
import Profile from "./views/Profile";
import Review from "./views/Review";
import BooksStats from "./components/charts/BooksStats";
import GenreStats from "./components/charts/GenreStats";
import ProtectedRoute from "./components/ProtectedRoute";
import Main from "./views/Main";
import AccountVerification from "./views/AccountVerification";
import ResetPasswordVerification from "./views/ResetPasswordVerification";
import ResetPasswordInitial from "./views/ResetPasswordInitial";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout/>}>
      <Route index element={<Main/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<Signup/>}/>
      <Route path="account-verification" element={<AccountVerification/>}/>
      <Route path="reset-password" element={<ResetPasswordInitial/>}/>
      <Route path="reset-password-verification" element={<ResetPasswordVerification/>}/>

      <Route element={<ProtectedRoute/>}>
        <Route path="library" element={<Library/>}/>
        <Route path="library/book/:bookId" element={<Book/>} loader={bookLoader}/>
        <Route path="profile" element={<Profile/>} />
        <Route path="review" element={<Review/>} >
          <Route path="books-stats" element={<BooksStats/>}/>
          <Route path="genre-stats" element={<GenreStats/>}/>
        </Route>
      </Route>
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
