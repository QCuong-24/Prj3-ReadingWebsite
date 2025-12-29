import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { Home, Plus, LogIn, UserPlus, User, BookOpen, LogOut, Bell, Shield, Trash2 } from "lucide-react";
import { getNotifications, markNotificationAsRead, deleteNotification } from "../services/user.api";
import { Notification } from "../types/user.types";
import { EventSourcePolyfill } from 'event-source-polyfill';

export const Header = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [guestOpen, setGuestOpen] = useState(false);

  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const isManager = user?.roles.includes("MANAGER") ;

  const isAdmin = user?.roles.includes("ADMIN");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target as Node)) {
        setGuestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications(user.userId)
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error("Failed to fetch notifications:", err));

      // Set up Server-Sent Events for real-time notifications
      const token = localStorage.getItem("token");
      const eventSource = new EventSourcePolyfill(`http://localhost:8080/api/notifications/stream/${user.userId}`,{
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      eventSource.addEventListener("notification", (event: any) => {
        const notification = JSON.parse(event.data);
        setNotifications((prev) => [notification, ...prev]);
      }) as unknown as EventSource;

      eventSource.addEventListener("read", (event: any) => {
        const notification = JSON.parse(event.data);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
      });

      eventSource.onerror = (error: any) => {
        console.error("EventSource error:", error);
      };

      eventSourceRef.current = eventSource;

      return () => {
        eventSource.close();
      };
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    if (!user) return;

    try {
      // 1. Call the API
      await markNotificationAsRead(user.userId, notificationId);

      // 2. Update local state immediately for a responsive UI
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (!user) return;

    try {
      // 1. Call the API
      await deleteNotification(user.userId, notificationId);

      // 2. Update local state immediately for a responsive UI
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true; // "all"
  });

  return (
    <header className="bg-deep-space-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold hover:text-ocean-blue-200">
          Reading Page
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-ocean-blue-200" title="Home">
            <Home size={20} />
          </Link>

          {user && (
            <Link to="/shelf" className="hover:text-ocean-blue-200" title="My Shelf">
              <BookOpen size={20} className="transform translate-y-[1px]" />
            </Link>
          )}

          {user && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="hover:text-ocean-blue-200 relative flex items-center"
                title="Notifications"
              >
                <Bell size={20} />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center border border-deep-space-blue-700">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-8 w-80 bg-white text-black rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200">
                  {/* Tab Navigation */}
                  <div className="flex border-b text-sm font-medium">
                    {(["all", "unread", "read"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 capitalize transition-colors ${
                          activeTab === tab 
                            ? "text-ocean-blue-600 border-b-2 border-ocean-blue-600" 
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p>No {activeTab !== "all" ? activeTab : ""} notifications</p>
                      </div>
                    ) : (
                      filteredNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                          className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                            n.isRead ? "bg-white" : "bg-blue-50/50"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <p className={`text-sm leading-tight ${n.isRead ? "text-gray-600" : "font-bold text-gray-900"}`}>
                                {n.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                <span className={`h-1.5 w-1.5 rounded-full ${n.isRead ? "bg-gray-300" : "bg-blue-500"}`}></span>
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            {/* Nút xóa thông báo */}
                            <button
                              onClick={() => handleDeleteNotification(n.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer Action (Optional) */}
                  {notifications.some(n => !n.isRead) && (
                    <button 
                      className="w-full py-2 text-xs text-ocean-blue-600 hover:bg-ocean-blue-50 font-semibold border-t"
                      onClick={() => {
                        // Logic to mark all as read could go here
                      }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>

              <div
                className="relative group cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-ocean-blue-300 object-cover transition-transform group-hover:scale-105"
                />

                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-12
                    px-3 py-1 rounded-lg text-white text-xs font-medium
                    opacity-0 group-hover:opacity-100
                    translate-y-2 group-hover:translate-y-0
                    transition-all duration-300 ease-out
                    bg-ocean-blue-600/80 backdrop-blur-md shadow-lg
                    border border-ocean-blue-300/40
                    whitespace-nowrap pointer-events-none
                  "
                >
                  Personal
                </div>
              </div>

              <span className="font-medium">{user.username}</span>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 top-14 w-56 bg-white text-black rounded shadow-lg z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs mt-1 text-ocean-blue-600 font-semibold">
                      Role: {user.roles.join(", ")}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    <User size={16} /> Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"// text-ocean-blue-600 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <Shield size={16} /> Edit authority
                    </Link>
                  )}

                  {isManager && (
                    <Link
                      to="/novel/add"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"// text-ocean-blue-600 font-medium"
                      onClick={() => setOpen(false)}
                    >
                      <Plus size={16} /> Add Novel
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logoutUser();
                      navigate("/");
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative" ref={guestDropdownRef}>
              <button
                onClick={() => setGuestOpen(!guestOpen)}
                className="flex items-center gap-2 hover:text-ocean-blue-200 transition-colors h-10 px-2"
                title="Account"
              >
                <User size={20} className="transform translate-y-[1px]" />
                <span className="text-sm font-medium">Account</span>
              </button>

              {/* Guest Dropdown Menu */}
              {guestOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white text-black rounded-lg shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="p-2 flex flex-col">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
                      onClick={() => setGuestOpen(false)}
                    >
                      <LogIn size={18} className="text-ocean-blue-600" />
                      Login
                    </Link>
                    
                    <div className="h-[1px] bg-gray-100 my-1"></div>

                    <Link
                      to="/register"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium"
                      onClick={() => setGuestOpen(false)}
                    >
                      <UserPlus size={18} className="text-ocean-blue-600" />
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};