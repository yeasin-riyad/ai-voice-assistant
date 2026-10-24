
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LumoraWidget from "./LumoraWidge";

const ProtectedLayout = ({ user, setUser }) => {
  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Outlet />
      <LumoraWidget/>
      <Footer user={user}/>
    </>
  );
};

export default ProtectedLayout;
