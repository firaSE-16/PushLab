'use client'

import IssuesList from "./issue"

export default function MeetingDetailPage({
  params,
}: {
  params: { meetingId: string }
}) {
  return (
    <div>
      <IssuesList meetingId={params.meetingId} />
    </div>
  )
}