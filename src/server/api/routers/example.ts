import { error } from "console";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
const QRCode = require('qrcode');



export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),


  generateQRCode: publicProcedure
  .input(z.object({ text: z.string() }))
  .query(({ input }: { input: { text: string } }) => {
    return new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(input.text, (error: Error | null, source: string) => {
        if (error) reject("Error occurred");

        // Resolve with the QR code image source
        resolve(source);
      });
    });
  })
})