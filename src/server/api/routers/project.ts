import { pollCommits } from '~/lib/github';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import { indexGithubRepo } from '~/lib/github-loader';

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        projectName: z.string(),
        repoUrl: z.string().url(),
        githubToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
        
      const project = await ctx.db.project.create({
        data:{
            repoUrl:input.repoUrl,
            name: input.projectName,
            UserToProject:{
                create:{
                    userId: ctx.user.userId!
                }
            }
        }
      })

      await indexGithubRepo(project.id,input.repoUrl,input.githubToken)


      await pollCommits(project.id)
      return project 
    }),
    getProjects: protectedProcedure.query(async({ctx})=>{
        return await ctx.db.project.findMany({
            where:{
                UserToProject:{
                    some:{
                        userId: ctx.user.userId!
                    }
                }

            },
    
        })
    }),
    getCommits:protectedProcedure.input(z.object({
      projectId:z.string()
    })).query(async({ctx,input})=>{
      pollCommits(input.projectId).then().catch(console.error)
      return await ctx.db.commits.findMany({
        where:{
          projectId:input.projectId
        }
      })
    })
});
