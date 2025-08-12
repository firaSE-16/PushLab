"use client"
import { divider } from '@uiw/react-md-editor'
import Link from 'next/link'
import React, { useState } from 'react'
import { toast } from 'sonner'
import MeetingCard from '~/_components/meeting-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'
import { useRefetch } from '~/hooks/use-refetch'
import { api } from '~/trpc/react'




const MeetingPage = () => {
    const refetch = useRefetch()
    const {project,projectId} = useProject()
    const [isLoading,setIsLoading] = useState(false)
    const deleteMeeting=api.project.deleteMeeting.useMutation()
    const {data:meetings} = api.project.getMeeting.useQuery({
        projectId:projectId
    },{
        refetchInterval:4000
    }) 


  return (
    <>
    <MeetingCard/>
    <div className='h-6'></div>
    <h1 className='text-xl font-semibold'>Meetings</h1>

    {meetings && meetings.length ===0 && <div>No meetins found</div>}
    {isLoading && <div>Loading...</div>}
    <ul className='divide-y divide-gray-200'>
        {
            meetings?.map(meeting=>(
                <li key={meeting.id} className='flex items-center justify-between py-5 gap-x-6'>
                    <div>
                        <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                                <Link href={`/meetings/${meeting.id}`} className='text-sm font-semibold'>
                                {meeting.name}
                                </Link>
                                {meeting.status==="PROCESSING"&&(
                                    <Badge className='bg-yellow-500 text-white'>
                                        Processing...
                                    </Badge>
                                )}

                            </div>

                        </div>

                        <div className='flex items-center text-xs text-gray-500 gap-x-2'>
                            <p className='whitespace=nowrap'>
                                {meeting.createAt.toLocaleDateString()}

                            </p>

                            <p className='truncate'>
                                {meeting.issues.length}

                            </p>

                        </div>



                    </div>

<div className='flex items-center flex-none gap-x-4'>

    <Link href={`/meetings/${meeting.id}`} >
    <Button size='sm' variant='outline'>

    View Meeting
    </Button>
    </Link>
    <Button size='sm' disabled={deleteMeeting.isPending} variant='destructive' onClick={()=>deleteMeeting.mutate({meetingId:meeting.id},{
        onSuccess:()=>{
            toast.success("Meeting deleted successfully")
            refetch()
        }
    })}>
Delete Meeting
    </Button>

</div>
                </li>
            ))
        }

    </ul>
      
    </>
  )
}

export default MeetingPage
