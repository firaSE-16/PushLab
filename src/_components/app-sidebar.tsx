'use client'

import { Bot, Box, Container, CreditCard, LayoutDashboard, Plus, Presentation } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import useProject from '~/hooks/use-project'

const items = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Q/A', url: '/qa', icon: Bot },
  { title: 'Meetings', url: '/meetings', icon: Presentation },
  { title: 'Billing', url: '/billing', icon: CreditCard }
]


const AppSidebar = () => {

    const {projects,projectId,project,setProjectId} = useProject()
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
            <div className='flex gap-2 text-2xl font-bold'>
                <Box className='text-[#337ce1] w-8 h-8' />
                PushLab
                </div>

      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>


            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={clsx(
                      'flex list-none items-center gap-2 p-2 rounded hover:bg-primary/20',
                      pathname === item.url && 'bg-primary text-white'
                    )}
                  >
                    <item.icon/>
                  <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
            
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
            <SidebarGroupLabel>YourProjects</SidebarGroupLabel>
        
        <SidebarGroupContent>
            <SidebarMenu>
                {
                    projects?.map(project=>{
                        return(
                            <SidebarMenuItem key={project.name}>
                                <SidebarMenuButton asChild>
                                                       <div onClick={()=>{setProjectId(project.id)}}>

                                    <div className={clsx(`rounded-sm border size-6 flex items-center justify-center text-sm text-primary`,project.id===projectId?'bg-primary text-white':"bg-white text-primary")
                                       
                                    }>
                                        {project.name.charAt(0).toUpperCase()}

                                    </div>
                                    <span>{project.name}</span>

                                   </div>
                                </SidebarMenuButton>


                            </SidebarMenuItem>



                        )
                    })
                }

            </SidebarMenu>
                
            <div className='h-2'> </div>

            <SidebarMenuItem className='list-none'>
<Link href='/create'>
                <Button size='sm' variant={'outline'} className='w-fit'>
                <Plus/>    Create Project

                </Button>
</Link>
            </SidebarMenuItem>

        </SidebarGroupContent>
            
        
        </SidebarGroup>


      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
