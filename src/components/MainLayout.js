'use client';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/sidebar/Sidebar';

export default function MainLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on initial load and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Check on mount
    checkIsMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Function to toggle sidebar based on screen size
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile sidebar - only shown when mobileSidebarOpen is true */}
      <div className={`fixed inset-0 z-40 lg:hidden ${mobileSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-gray-900">
          <div className="absolute top-0 right-0 p-2">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Desktop sidebar - controlled by desktopSidebarOpen */}
      <div className={`hidden lg:block transition-all duration-300 overflow-hidden ${
        desktopSidebarOpen ? 'lg:w-64' : 'lg:w-0'
      }`}>
        <div className="h-full w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <button
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">ChatGPT Clone</h1>
          <div className="w-8"></div> {/* Spacer to center title */}
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}