'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  // In a real app, this would come from authentication context
  const [userId, setUserId] = useState<string | null>(null); // Placeholder - no user initially

  const handleLogin = () => {
    // In a real app, this would trigger the authentication flow
    setUserId('user123'); // Placeholder user ID
  };

  const handleLogout = () => {
    // In a real app, this would trigger the logout flow
    setUserId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          <nav>
            {userId ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome!</span>
                <Link
                  href="/tasks"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  My Tasks
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Manage Your Tasks Efficiently
          </h2>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            A simple and elegant task management application built with Next.js and FastAPI.
          </p>

          <div className="mt-10">
            {userId ? (
              <Link
                href="/create-task"
                className="inline-block px-8 py-4 bg-green-500 text-white text-lg font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                Create New Task
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                className="inline-block px-8 py-4 bg-blue-500 text-white text-lg font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Create Tasks</h3>
              <p className="mt-2 text-gray-500">
                Easily create new tasks with titles and descriptions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
              <p className="mt-2 text-gray-500">
                Mark tasks as complete and track your productivity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900">Stay Organized</h3>
              <p className="mt-2 text-gray-500">
                Filter and organize tasks by status to stay on top of your work.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
