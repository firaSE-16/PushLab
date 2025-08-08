import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import useProject from '~/hooks/use-project';
import { api } from '~/trpc/react';
import ReactMarkdown from 'react-markdown';

const CommitLog = () => {
  const { projectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  return (
    <ul className="space-y-10">
      {commits?.map((commit, commitIdx) => (
        <li key={commitIdx} className="relative flex gap-x-4 min-w-0">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={commit.CommitAuthorAvatar}
              alt={commit.commitAuthorName}
              className="h-10 w-10 rounded-full border border-gray-200 shadow-sm object-cover"
            />
            {/* Timeline line */}
            <div
              className={clsx(
                'w-px bg-gray-300 flex-1',
                commitIdx === commits.length - 1 ? 'hidden' : ''
              )}
            />
          </div>

          {/* Commit content */}
          <div className="flex flex-col flex-1 min-w-0">
            {/* Author + Link */}
            <div className="flex items-center text-sm text-gray-600 gap-x-2 min-w-0">
              <Link
                href={`${project?.repoUrl}/commit/${commit.commitHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
              >
                {commit.commitAuthorName}
              </Link>
              <span className="text-gray-500">committed</span>
              <ExternalLink className="size-4 text-gray-400" />
            </div>

            {/* Commit message */}
            <h3 className="mt-1 font-medium text-base text-gray-800 leading-snug break-words">
              {commit.commitMessage}
            </h3>

            {/* AI Summary */}
            {commit.Summary && (
              <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm shadow-sm hover:shadow-md transition-shadow overflow-auto max-w-full">
                <div className="prose prose-sm max-w-none text-gray-700 break-words whitespace-pre-wrap">
                  <ReactMarkdown>{commit.Summary}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommitLog;
