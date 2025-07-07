import { FaTint } from "react-icons/fa";
import { Link } from "react-router";

function Logo({theme = "dark"}) {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-red-600 p-2 rounded-full">
          <FaTint className="h-6 w-6 text-white" />
        </div>
        <span className={
            theme === "dark"
                ? "text-xl font-bold text-gray-900"
                : "text-xl font-bold text-gray-100"
        }>
          Project<span className="text-red-600">R</span>
        </span>
      </Link>
    </div>
  );
}

export default Logo;
