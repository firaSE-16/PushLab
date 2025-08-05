import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';

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


      return project 
    }),
});
