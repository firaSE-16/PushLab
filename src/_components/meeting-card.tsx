'use client'

import React, { useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Presentation, Upload, Loader2 } from 'lucide-react'
import { Card } from '~/components/ui/card'
import { UploadButton } from '~/lib/uploadthing'
import { toast } from 'sonner'
import { api } from '~/trpc/react'
import useProject from '~/hooks/use-project'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const MeetingCard = () => {

  const processMeeting=useMutation({
    mutationFn:async(data:{meetingUrl:string,meetingId:string,projectId:string})=>{
      const {meetingUrl,meetingId,projectId}=data
      const response= await axios.post(`/api/process-meeting`,{meetingUrl,meetingId,projectId})
      
      
      
      return response.data
    }
  })


      const [isUploading, setIsUploading] = useState(false)
      const [progress, setProgress] = useState(0)
      const [error, setError] = useState<string | null>(null)
      const {project,projectId}=useProject()
      const uploadMeeting = api.project.uploadMeeting.useMutation()


  return (
    <Card className="col-span-2 flex flex-col items-center justify-center p-10">
      {!isUploading ? (
        <>
          <Presentation className="h-10 w-10 animate-bounce text-indigo-600" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting with PushLab.
            <br />
            Powered by AI.
          </p>

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          <div className="mt-6">
            <UploadButton
              endpoint="audioUploader"
              appearance={{
                button: "ut-ready:bg-indigo-600 ut-uploading:cursor-not-allowed bg-indigo-500 text-white px-4 py-2 rounded-lg after:bg-indigo-700",
                allowedContent: "hidden",
              }}
              onUploadBegin={() => {
                setIsUploading(true)
                setProgress(0)
                setError(null)
              }}
              onUploadProgress={(p) => {
                setProgress(p)
              }}
              onClientUploadComplete={async (res) => {
                if(!project) return
                const downloadURl= res[0]?.ufsUrl
                

                  const response =  uploadMeeting.mutateAsync({
                    projectId:projectId,
                    meetingUrl:downloadURl!,
                    name:res[0]!.name
                  })

                  const responseProcess= processMeeting.mutateAsync({meetingUrl:downloadURl!,meetingId:(await response).id,projectId:project.id})
                
                setIsUploading(false)
                toast.success("Upload completed successfully!")
              }}
              onUploadError={(error) => {
                setIsUploading(false)
                setError(`Upload failed: ${error.message}`)
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textColor: '#6b7280',
                pathColor: '#4f46e5',
                trailColor: '#e5e7eb',
              })}
            />
          </div>
          <p className="text-sm text-gray-500 text-center">
            {progress === 0
              ? 'Starting upload...'
              : progress === 100
              ? 'Finalizing upload...'
              : 'Uploading your meeting...'}
          </p>
        </div>
      )}
    </Card>)
}

export default MeetingCard