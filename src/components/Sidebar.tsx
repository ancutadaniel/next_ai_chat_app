import React from "react";

const Sidebar = () => {
  return (
    // The 'flex-shrink-0' class prevents the sidebar from shrinking
    <div className="bg-gray-800 text-white w-64 p-4 flex-shrink-0">
      <h1 className="text-xl font-bold mb-4">AI Chat</h1>
      {/* This list will eventually hold the user's chat history */}
      <ul>
        <li className="mb-2">
          <a href="#" className="hover:bg-gray-700 rounded-md p-2 block">
            Chat History 1
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="hover:bg-gray-700 rounded-md p-2 block">
            Chat History 2
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
