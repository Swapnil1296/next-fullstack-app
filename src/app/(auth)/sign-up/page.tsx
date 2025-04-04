'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Loader, Loader2 } from 'lucide-react';

const signUp = () => {
    const [username, setUserName] = useState('');
    const [usernameMessage, setUserNameMessage] = useState('');
    const [isCheckingUserName, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const debounced = useDebounceCallback(setUserName, 500);
    const router = useRouter();
    // zod implemenation
    const form = useForm < z.infer < typeof signUpSchema >> ({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUserNameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);

                    if (response.data.message) {

                        setUserNameMessage(response.data.message);
                    }

                } catch (error) {
                    console.error("error checking username", error?.response?.data?.message);
                    setUserNameMessage(error?.response?.data?.message)
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUserNameUnique();
    }, [username]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/sign-up', data);
            toast.success("Success", {
                description: response.data?.message,
                position: "top-right",
                style: {
                    backgroundColor: "#f0f9ff",
                    border: "1px solid #bae6fd"
                },
                className: "font-medium",
                descriptionClassName: "text-sky-700",
                titleClassName: "text-sky-900 font-bold"
            });
            router.replace(`verify/${data.username}`);
            setIsSubmitting(false)
        } catch (error) {
            console.error("error submitting data", error);
            toast.error("Error", {
                description: error.response?.data?.message || "Failed to register",
                position: "top-right",
                style: {
                    backgroundColor: "#fef2f2",
                    color: "#b91c1c",
                    border: "1px solid #fecaca"
                }
            });
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-900 via-pink-700 to-sky-950 font-sans '>
            <div className='border-1 border-amber-950 sm:w-2/4  h-3/4 max-h-screen p-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-500 rounded shadow-lg space-y-3'>
                <div>
                    <span className='font-bold text-2xl text-teal-900'>Ready to have some fun with this magic message application. </span>
                </div>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-10">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {usernameMessage && <p className={`text-sm ${usernameMessage == "username is unique" ? 'text to-blue-500' : 'text-red-800'}`}>{usernameMessage}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your Email" {...field}
                                        />
                                    </FormControl>

                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="Enter your Passord" {...field}

                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' variant={'submit'} disabled={isSubmitting || isCheckingUserName}>{isSubmitting || isCheckingUserName ? <Loader2 className="animate-spin" /> : 'Signup'}</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default signUp