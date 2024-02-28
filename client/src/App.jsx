import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import AppLayout from "./layouts/AppLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout/>}>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<Signup/>}/>

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
