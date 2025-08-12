"use client"
import { Info } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { useRefetch } from '~/hooks/use-refetch';
import { api } from '~/trpc/react';

type FormInput ={
    repoUrl: string;
    projectName: string;
    githubToken?: string;
}



const page = () => {
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();
    const checkCredits = api.project.checkCredits.useMutation()



    const {register, handleSubmit,reset}=useForm<FormInput>()


    const enoughCredits = checkCredits?.data?.userCredits ? checkCredits.data.fileCount <= checkCredits.data.userCredits:true

    function onsubmit(data: FormInput){

        if(!!checkCredits.data){

            
                    createProject.mutate({
                        repoUrl: data.repoUrl,
                        projectName: data.projectName,
                        githubToken: data.githubToken
                    }, {
                        onSuccess: () => {
                            toast.success('Project created successfully');
                            refetch()
                            reset();
                        },
                        onError: () => {
                            toast.error('Error creating project');
                            console.error('Error creating project:');
                        }
                    });
        
        
        
        } else {
            checkCredits.mutate({
                githubUrl:data.repoUrl,
                githubToken:data.githubToken

            })
        }

        
        return true;
    }

    
  return (
    <div className='flex items-center gap-12 h-full justify-center'>

        <img src='/github-mark.svg' className='h-56 w-auto'/>

        <div>
            <div>
                <h1 className='font-semibold text-2xl'>
                    Link your Github Repository
                </h1>
                <p className='text-sm text-muted-foreground'>
                    Enter the URL of your repository to link it 
                </p>

            </div>
            <div className='h-4'></div>
        </div>
        <form onSubmit={handleSubmit(onsubmit)}>

            <input {...register('projectName',{required:true})}
            
            placeholder='ProjectName'
            required
            />
            <div className='h-2'></div>
            <input {...register('repoUrl',{required:true})}
            
            placeholder='Github'
            type='url'
            required
            />
           <div className='h-2'></div>
            <input {...register('githubToken',{required:false})}
            placeholder='Github Token (Optional)'
            
            />
            {!!checkCredits.data&&(
                <>
                <div className='mt-4 bg-orange-50 px-4 py-2 rounded-md boder border-orange-200 text-orange-700'>
                    <div className='flex items-center gap-2'>
                        <Info className='size-4'/>
                        <p className='text-sm'>
                Your will be charged <strong>{checkCredits.data?.fileCount}
                </strong> credits for this repository.
                        </p>

                    </div>
                    <p className='text-sm text-blue-600 ml-6'>You have<strong>{checkCredits.data?.userCredits}</strong> credits remaining.</p>

                </div>
                </>
            )}
            <div className='h-2'></div>
            <Button type='submit' disabled={createProject.isPending||!!checkCredits.isPending ||!enoughCredits}>
                {!!checkCredits.data? 'Create Project':'check Credits'}
                Create Project
            </Button>
        </form>

      
    </div>

  )
}

export default page
