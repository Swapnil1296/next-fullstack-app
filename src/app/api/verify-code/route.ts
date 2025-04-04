import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from 'zod'
import { verifySchema } from "@/schemas/verifySchema";
import { usernameValidation } from "@/schemas/signUpSchema";

const verifyQuerySchema = z.object({
    verificationCode: verifySchema
});
const UsernameQuerySchema = z.object({
    //check if the username is fullfilling the uservalidation schema
    username: usernameValidation
});
export async function POST(request: Request) {

    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const validateUsername = UsernameQuerySchema.safeParse(decodedUsername);
        if (!validateUsername.success) {
            const usernameErrors = validateUsername.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters'
            }, { status: 400 }
            )
        }
        const validateCode = verifyQuerySchema.safeParse({ verificationCode: code });
        if (!validateCode.success) {
            const codeErrors = validateCode.error.format().verificationCode?._errors || [];
            return Response.json({
                success: false,
                message: codeErrors?.length > 0 ? codeErrors.join(',') : 'Invalid verification code'
            }, { status: 400 })
        }
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 500 }
            )
        }
        const isCodeValide = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodeValide && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified"
            },
                { status: 200 }
            )
        } else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "verification code has expired please signup again for new code"
            },
                { status: 400 }
            )   
        } else {
            return Response.json({
                success: false,
                message: "verification code is not correct"
            },
                { status: 400 }
            )    
        }

    } catch (error) {
        console.error("Error verifying user ", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            { status: 500 }
        )
    }

}