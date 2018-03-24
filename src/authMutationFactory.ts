export default function(payloadFunction){
    return async function(root, args, ctx) {
        const userContext = await ctx.user;
        if(!userContext) {
            throw new Error("Unauthorized");
        }
        return payloadFunction(root, args, ctx);
    }
}