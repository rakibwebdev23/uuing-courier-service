import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import logo from "../assets/icons/logo.svg";
import UserAvatar from "@/ui/UserAvatar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  logOut,
  useCurrentUser,
  loadUserFromToken,
} from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Load user from token on initial render
  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  const currentUser = useAppSelector(useCurrentUser);
  console.log("user: ", currentUser);
  const isLoggedIn = Boolean(currentUser);
  const userRole = currentUser?.role;

  const handleLogout = () => {
    dispatch(logOut());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLinkClick = () => setIsOpen(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg py-3 px-3 md:px-10 xl:px-0">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={handleLinkClick}>
              <img
                src={logo}
                alt="Company Logo"
                className="h-10 drop-shadow-md"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 mx-auto text-[#EF6820]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:bg-gray-100 px-3 py-2 rounded-md text-xl font-normal ${
                  isActive(link.path) ? "font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="border border-[#EF6820] text-[#EF6820] hover:bg-gray-100 hover:text-black px-5 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#EF6820] text-white px-5 py-2 rounded-md text-base font-medium hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Popover>
                <PopoverTrigger aria-label="User menu">
                  <UserAvatar userName={currentUser?.name || "User"} />
                </PopoverTrigger>
                <PopoverContent
                  className="xl:mr-40 lg:mr-10 md:mr-10 mt-3 bg-white border border-gray-200 shadow-md rounded-lg w-52 p-3"
                  align="end"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="px-4 py-2">
                      <p className="font-medium">Name: {currentUser?.name}</p>
                      <p className="text-sm text-gray-600">Role: {userRole}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Profile
                    </Link>

                    {(userRole === "marchant" || userRole === "admin") && (
                      <Link
                        to="/merchant-dashboard"
                        className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Merchant Dashboard
                      </Link>
                    )}

                    {userRole === "admin" && (
                      <Link
                        to="/admin-dashboard"
                        className="text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="text-red-500 hover:bg-gray-100 w-full px-4 py-2 text-sm font-medium rounded-md"
                    >
                      Log Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? "bg-gray-100 text-[#EF6820]"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  {(userRole === "marchant" || userRole === "admin") && (
                    <Link
                      to="/merchant-dashboard"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                      Merchant Dashboard
                    </Link>
                  )}

                  {userRole === "admin" && (
                    <Link
                      to="/admin-dashboard"
                      onClick={handleLinkClick}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-md text-base font-medium text-center text-white bg-[#EF6820] hover:bg-orange-600"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
