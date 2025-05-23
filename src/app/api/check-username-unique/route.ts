import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    //check if the username is fullfilling the uservalidation schema
    username: usernameValidation
});

export async function GET(request: Request) {

    //this is not needed as per the latest version of next
    // if (request.method !== "GET") {
    //     return Response.json({
    //         success: false,
    //         message: 'method not allowed'
    //     }, { status: 405 })
    // } 
    


    await dbConnect();
    try {
        // localhost:3000/api/cuu?username=swapnil
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        };
        //validate with zod;
        const result = UsernameQuerySchema.safeParse(queryParam);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
              message: usernameErrors?.length > 0 ? usernameErrors.join(','): 'Invalid query parameters'   
            },{status:422}
            )
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });//username should be unique with isVerified true value
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
              message: 'username is already taken'   
            },{status:400}
            )  
        }
        return Response.json({
            success: true,
          message: 'username is unique'   
        },{status:200}
        )  
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message:"Error checking username"
        },
            {status:500}
        )
    }
}