import React from "react";

function NotFound() {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <img
        src="./error.jpeg"
        alt="404 Page Not Found..."
        width={300}
        height={300}
      />
    </div>
  );
}

export default NotFound;
