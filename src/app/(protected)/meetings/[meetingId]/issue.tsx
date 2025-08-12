'use client'
import { api, type RouterOutputs } from '~/trpc/react'
import { VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'

type Props = {
  meetingId: string
}

const IssuesList = ({ meetingId }: Props) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({ meetingId }, {
    refetchInterval: 4000
  })

  if (isLoading || !meeting) return <div>Loading...</div>

  return (
    <div className='p-8'>
      <div className='mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:max-w-7xl'>
        <div className='flex items-center gap-x-8'>
          <div className='rounded-full border bg-white p-3'>
            <VideoIcon className='h-6 w-6' />
          </div>
          <h1>
            <div className='text-sm leading-6 text-gray-600'>
              Meeting on {meeting.createAt.toLocaleDateString()}
            </div>
            <div className='mt-1 text-base font-semibold leading-6 text-gray-900'>
              {meeting.name}
            </div>
          </h1>
        </div>
      </div>

      <div className='mt-8'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {meeting.issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  )
}

function IssueCard({
  issue
}: {
  issue: NonNullable<RouterOutputs["project"]["getMeetingById"]>["issues"][number]
}) {
  const [open, setOpen] = useState(false)
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{issue.gist}</DialogTitle>
            <DialogDescription>
              Created on {issue.createAt.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              {issue.headline}
            </p>
            <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 p-4">
              <span className="text-sm text-gray-600">
                {issue.start} - {issue.end}
              </span>
               <h1>
                {issue.gist}
                </h1> 
              <p className="font-medium italic leading-relaxed text-gray-900">
                {issue.summary}
              </p>
            </blockquote>
          </div>
        </DialogContent>
      </Dialog>

      <Card className='relative hover:shadow-md transition-shadow'>
        <CardHeader>
          <CardTitle className='text-xl'>
            {issue.gist}
          </CardTitle>
          <div className='border-b'></div>
          <CardDescription>
            {issue.headline}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='outline' onClick={() => setOpen(true)}>
            View Details
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default IssuesList