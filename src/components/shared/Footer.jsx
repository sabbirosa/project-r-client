import { Link } from "react-router";
import Logo from "./Logo";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <Logo theme={"light"} />
              <p className="text-gray-300 max-w-md">
                Connecting blood donors with those in need. Join our community and help save lives 
                through safe and efficient blood donation.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/donation-requests" className="text-gray-300 hover:text-white transition-colors">
                    Blood Requests
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                    Join as Donor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>Emergency: +880-123-456-789</li>
                <li>Email: info@projectr.com</li>
                <li>Address: Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-400">
              © {
                new Date().getFullYear()
              } Project R. All rights reserved. Saving lives together.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer