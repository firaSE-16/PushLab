"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "~/app/_components/ask-question-card";

const DashboardPage = () => {
  const { user } = useUser();

  return (
    <div className="relative w-full px-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-y-4 py-4">
        <div className="w-fit rounded-md bg-primary text-white px-4 py-3">
          Connected to GitHub
        </div>

        <div className="h-4 w-full sm:hidden"></div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Team Members</span>
          <button className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 transition">
            Invite
          </button>
          <button className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 transition">
            Archive
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="sm:col-span-3 min-w-0">
            <AskQuestionCard />
          </div>
          <div className="sm:col-span-2 min-w-0">
            <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="font-semibold text-gray-800">Meeting Card</h2>
              <p className="text-sm text-gray-600 mt-2">Details go here...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8" />

      {/* Commit Timeline */}
      <CommitLog />
    </div>
  );
};

export default DashboardPage;