import React, { use } from 'react';
import { api } from '~/trpc/react';
import {useLocalStorage} from'usehooks-ts'
import { se } from 'date-fns/locale';




const useProject = ()=>{
    const {data:projects} = api.project.getProjects.useQuery()
    const [projectId, setProjectId] = useLocalStorage('projectId', '');
    const project = projects?.find(project=>project.id ===projectId)
    return {
        projects,
        project,
        projectId,
        setProjectId,
    }

}

export default useProject;