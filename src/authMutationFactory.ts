export default function<T>(payloadFunction:(root:any, args: any, ctx: any) => Promise<T>)
{
    return async function(root, args, ctx):Promise<T> {
        const userContext = await ctx.user;
        if(!userContext) {
            throw new Error("Unauthorized");
        }
        return payloadFunction(root, args, ctx);
    }
}