import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import Sidebar from './components/layout/sidebar';
import Dashboard from './pages/dashboard';
import Courses from './pages/courses';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/courses" component={Courses} />
            <Route path="/goals">
              <div className="p-8">
                <h1 className="text-3xl font-bold">Goals - Coming Soon</h1>
              </div>
            </Route>
            <Route path="/planner">
              <div className="p-8">
                <h1 className="text-3xl font-bold">Planner - Coming Soon</h1>
              </div>
            </Route>
            <Route path="/progress">
              <div className="p-8">
                <h1 className="text-3xl font-bold">Progress - Coming Soon</h1>
              </div>
            </Route>
            <Route path="/settings">
              <div className="p-8">
                <h1 className="text-3xl font-bold">Settings - Coming Soon</h1>
              </div>
            </Route>
          </Switch>
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
