import { resend } from '@/lib/resend';

import { ApiResponse } from '@/types/ApiResponse';
import VerificationEmail from '../../emails/VerificationEmail';

export async function sendVerification(email:string, username:string,verifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev>',
            to: 'swapnillandage79@gmail.com',
            subject: 'Verification email',
            react: VerificationEmail({username,otp:verifyCode}),
          });
    return {
        success:true, message:'verification email sent successfully'
    }   
} catch (emailError) {
    console.error('error sending verification email', emailError);
    return {
        success:false, message:'Failed to send verification email'
    }
}

}