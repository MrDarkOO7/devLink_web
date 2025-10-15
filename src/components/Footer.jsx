import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-auto">
      <footer className="footer bg-base-300 text-base-content px-6 py-8 shadow-inner">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <aside>
            <h2 className="text-2xl font-bold text-primary mb-2">DevLink</h2>
            <p className="text-sm text-base-content/70">
              Connecting developers through shared skills, passions, and
              collaboration.
            </p>
            <p className="mt-4 text-xs text-base-content/50">
              © {new Date().getFullYear()} DevLink. All rights reserved.
            </p>
          </aside>

          <nav>
            <h3 className="text-sm font-semibold text-base-content uppercase mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-primary transition" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition"
                  to="/connections"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link className="hover:text-primary transition" to="/requests">
                  Connection Requests
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-base-content uppercase mb-3">
              Get Involved
            </h3>
            <p className="text-sm text-base-content/70 mb-3">
              Have feedback or ideas? We'd love to hear from you.
            </p>
            <a
              href="mailto:m.waleedapsacian@gmail.com"
              className="btn btn-sm btn-outline btn-primary w-fit"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
