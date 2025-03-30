    import dbConnect from "@/lib/dbConnect";
    import UserModel from "@/model/User.model";
    import { sendVerification } from "@/helpers/sendVerificationEmails";
    import bcrypt from "bcrypt";



    export async function POST(request: Request) {

        
        await dbConnect();
        console.log("sign up called");
        try {
            const { username, email, password } = await request.json();
            const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
            if (typeof password !== "string") {
                return Response.json(
                  { success: false, message: "Password must be a string" },
                  { status: 400 }
                );
              }
            if (existingUserVerifiedByUsername) {
            return Response.json({success:false,message:"username is already taken"},{status:400}) 
            }

            const existingUserByEmail = await UserModel.findOne({ email })
            const verifyCode = Math.floor(Math.random() * 1000000).toString();

            if (existingUserByEmail) {
                if (existingUserByEmail.isVerified) {
                    return Response.json({ success: false, message: "user already exist with this email" }, { status: 400 });   
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                    await existingUserByEmail.save();

                }
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);

                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages:[]
                });
               
                await newUser.save();
            }
            //send verification email
            const emailRespone = await sendVerification(email, username, verifyCode);
            if (!emailRespone.success) {
                return Response.json({ success: false, message: emailRespone.message }, { status: 500 }); 
            }
            return Response.json({ success: true, message: "User registered successfully. Please check your email for verification." },{ status: 201});
        } catch (error) {
            console.error("error registering user=>", error); 
            return Response.json({ success: false, message:"error registering user"},{status: 500})
        }
    }