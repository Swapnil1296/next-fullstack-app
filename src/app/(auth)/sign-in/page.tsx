'use client';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const page = () => {
  const [username, setUserName] = useState('');
  const [usernameMessage, setUserNameMessage] = useState('');
  const [isCheckingUserName, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [debouncedUsername, setValue] = useDebounceValue(username, 500);
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
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUserNameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
          setUserNameMessage(response.data.message);

        } catch (error) {
          console.error("error checking username", error);
          setUserNameMessage(error?.response)
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUserNameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data) => {
    isSubmitting(true);
    try {
      const response = await axios.post < ApiResponse > ('/api/sign-up');
      toast("Success", {
        description: response.data?.message,

      });
      router.replace(`verify/${username}`);
      setIsSubmitting(false)
    } catch (error) {
      console.error("error submitting data", error);

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      setUserName(e.target.value)
                    }}
                  />
                </FormControl>
                <FormDescription>{username} this will be your username </FormDescription>
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
          <Button type='submit' disabled={isSubmitting}>{isSubmitting ? <Loader /> : 'Signup'}</Button>
        </form>
      </Form>
    </div>
  )
}

export default page