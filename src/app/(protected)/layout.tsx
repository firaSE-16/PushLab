import { UserButton } from '@clerk/nextjs';
import React from 'react';
import { SidebarProvider } from '~/components/ui/sidebar';
import AppSidebar from '../../_components/app-sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <main className="flex-1 m-2 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4 w-full">
            <div className="ml-auto" />
            <UserButton />
          </div>

          {/* Spacer */}
          <div className="h-4" />

          {/* Scrollable Vertical Content Only */}
          <div className="border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll overflow-x-hidden p-4 h-[calc(100vh-6rem)] w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;