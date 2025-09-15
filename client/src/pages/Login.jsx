import React, { useState } from "react";

function Login() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex flex-col sm:w-xl justify-center gap-4  items-center bg-slate-100 shadow-2xl p-8 border border-gray-400 rounded-lg">
        <h1
          className="text-xl  font-serif font-semibold pb-8
        "
        >
          LOGIN
        </h1>
        <div className="flex justify-around p-8 w-full ">
          <button
            onClick={() => setSelected(0)}
            className={`${
              selected == 0 ? "bg-blue-600 text-white" : ""
            } pl-4 pr-4 p-2 rounded-md shadow-md border border-gray-600`}
          >
            ADMIN
          </button>
          <button
            onClick={() => setSelected(1)}
            className={`${
              selected == 1 ? "bg-blue-600 text-white" : ""
            } pl-4 pr-4 p-2 rounded-md shadow-md border border-gray-600`}
          >
            STUDENT
          </button>
          <button
            onClick={() => setSelected(2)}
            className={`${
              selected == 2 ? "bg-blue-600 text-white" : ""
            } pl-4 pr-4 p-2 rounded-md shadow-md border border-gray-600`}
          >
            FACULTY
          </button>
        </div>
        <div className="flex flex-col w-full p-5 justify-center gap-2  items-center ">
          <label htmlFor="" className="text-sm w-full ">
            USER NAME
          </label>
          <input
            type="text"
            className="pl-2 pr-2 p-2 border-gray-400 rounded-md border w-6/8"
          />
        </div>
        <div className="flex flex-col w-full p-5 justify-center gap-2  items-center ">
          <label htmlFor="" className="text-sm">
            PASSWORD
          </label>
          <input
            type="password"
            className="pl-2 pr-2 p-2 rounded-md border-gray-400 border w-6/8"
          />
        </div>
        <div className="pt-8">
          <button className="pl-4 pr-4 p-2 rounded-md hover:bg-blue-400 hover:text-black bg-blue-700 text-white">
            LOG IN
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
