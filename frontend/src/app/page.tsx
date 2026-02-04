/**
 * Home page - Dynamic entry point for the Todo application.
 * Always shows the Todo Add screen, with authentication handled as needed.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/components/TaskList";
import { TaskForm } from "@/components/TaskForm";
import { authApi } from "@/lib/api";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  CheckSquare,
  LogOut,
  ListTodo,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
      logout();
      router.refresh();
    } catch {
      authApi.logout();
      logout();
      router.refresh();
    }
  };

  const handleTaskCreated = (_task: Task) => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  // Always show the task dashboard, but adjust behavior based on auth status
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-end items-end">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-primary rounded-full">
              <LogOut className="h-4 w-4 text-white hover:text-primary" />
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">My Tasks</h2>
            </div>
            <p className="text-muted-foreground">
              Manage your personal todo list
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <TaskList key={refreshTrigger} />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
