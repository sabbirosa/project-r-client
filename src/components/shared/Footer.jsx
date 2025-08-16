import { Link } from "react-router";
import Logo from "./Logo";

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-all duration-200 border-t border-gray-700 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <Logo />
              <p className="text-gray-300 dark:text-gray-400 max-w-md mt-6 text-sm leading-relaxed font-medium">
                Connecting blood donors with those in need. Join our community and help save lives 
                through safe and efficient blood donation across Bangladesh.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-gray-100 dark:text-gray-200 tracking-wider uppercase mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300 transition-all duration-200 font-medium hover:translate-x-1 inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/donation-requests" className="text-gray-300 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300 transition-all duration-200 font-medium hover:translate-x-1 inline-block">
                    Blood Requests
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-300 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300 transition-all duration-200 font-medium hover:translate-x-1 inline-block">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300 transition-all duration-200 font-medium hover:translate-x-1 inline-block">
                    Join as Donor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-gray-100 dark:text-gray-200 tracking-wider uppercase mb-6">
                Contact
              </h3>
              <ul className="space-y-3 text-gray-300 dark:text-gray-400">
                <li className="font-medium">
                  Emergency: <span className="text-red-400 dark:text-red-300 font-semibold">+880-123-456-789</span>
                </li>
                <li className="font-medium">
                  Email: <span className="text-red-400 dark:text-red-300 font-semibold">info@projectr.com</span>
                </li>
                <li className="font-medium">Address: Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 dark:border-gray-800">
            <p className="text-center text-gray-400 dark:text-gray-500 font-medium">
              © {new Date().getFullYear()} Project R. All rights reserved. Saving lives together.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer