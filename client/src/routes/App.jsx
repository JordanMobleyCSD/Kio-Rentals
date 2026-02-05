import { Routes, Route } from "react-router-dom";
import Layout from "../ui/Layout.jsx";
import Home from "../views/Home.jsx";
import Search from "../views/Search.jsx";
import CarDetails from "../views/CarDetails.jsx";
import Login from "../views/Login.jsx";
import Signup from "../views/Signup.jsx";
import Trips from "../views/Trips.jsx";
import HostDashboard from "../views/HostDashboard.jsx";
import NotFound from "../views/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/host" element={<HostDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
