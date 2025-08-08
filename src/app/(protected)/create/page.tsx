"use client"
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



    const {register, handleSubmit,reset}=useForm<FormInput>()

    function onsubmit(data: FormInput){
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
            <div className='h-2'></div>
            <Button type='submit' disabled={createProject.isPending}>
                Create Project
            </Button>
        </form>

      
    </div>

  )
}

export default page
