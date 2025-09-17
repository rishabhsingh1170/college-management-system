import React from "react";
import error from "../assets/error.jpeg";

function NotFound() {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <img
        src={error}
        alt="404 Page Not Found..."
        width={300}
        height={300}
      />
    </div>
  );
}

export default NotFound;
