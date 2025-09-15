import React from "react";
import UserSidebar from "../src/components/SIdebar/UserSidebar";
import { Outlet } from "react-router-dom";
import ProfileUser from "../src/pages/user/Profile";
function UserLayout() {
  return (
    <div className="flex gap-4">
      <UserSidebar />
      <ProfileUser />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
