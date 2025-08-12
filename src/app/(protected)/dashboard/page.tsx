"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "~/_components/ask-question-card";
import useProject from "~/hooks/use-project";
import MettingCard from "~/_components/meeting-card";
import ArchiveButton from "~/_components/archive-button";
import InviteButton from "~/_components/invite-button";

const DashboardPage = () => {
  const { user } = useUser();
    const { projectId, project } = useProject();
  

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
          <InviteButton/>
          <ArchiveButton/>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <div className="sm:col-span-3 min-w-0">
            <AskQuestionCard projectId={projectId}/>
          </div>
          <div className="sm:col-span-2 min-w-0">
            <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
              <MettingCard/>
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