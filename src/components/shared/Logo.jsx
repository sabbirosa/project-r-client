import { FaTint } from "react-icons/fa";
import { Link } from "react-router";

function Logo() {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center space-x-3 group transition-all duration-200 hover:scale-105">
        <div className="bg-red-600 p-2.5 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:bg-red-700">
          <FaTint className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Project<span className="text-red-600 dark:text-red-400">R</span>
        </span>
      </Link>
    </div>
  );
}

export default Logo;
