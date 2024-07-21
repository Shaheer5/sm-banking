"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.action";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        state: data.state!,
        postalCode: data.postalCode!,
        dateOfBirth: data.dateOfBirth!,
        ssn: data.ssn!,
      };
      // Sign up with Appwrite & create plain link token
      if (type === "sign-up") {
        const newUser = await signUp(userData);

        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href={"/"} className="flex cursor-pointer items-center gap-1">
          <Image
            src={"/icons/logo.svg"}
            width={34}
            height={34}
            alt="horizon-logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:ga-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
      <div className="flex flex-col gap-4">
        <PlaidLink user={user} variant="primary" />
      </div>
      ) : (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput
                    name="firstName"
                    control={form.control}
                    label="First Name"
                    placeholder="Enter your First Name"
                  />
                  <CustomInput
                    name="lastName"
                    control={form.control}
                    label="Last Name"
                    placeholder="Enter your Last Name"
                  />
                </div>
                <CustomInput
                  name="address1"
                  control={form.control}
                  label="Address 1"
                  placeholder="Enter your Specific Address"
                />
                <CustomInput
                  name="city"
                  control={form.control}
                  label="City"
                  placeholder="Enter your City"
                />
                <div className="flex gap-4">
                  <CustomInput
                    name="state"
                    control={form.control}
                    label="State"
                    placeholder="Example: NY"
                  />
                  <CustomInput
                    name="postalCode"
                    control={form.control}
                    label="Postal Code"
                    placeholder="Example: 11101"
                  />
                </div>
                <div className="flex gap-4">
                  <CustomInput
                    name="dateOfBirth"
                    control={form.control}
                    label="Date of Birth"
                    placeholder="YYYY-MM-DD"
                  />
                  <CustomInput
                    name="ssn"
                    control={form.control}
                    label="SSN(Social Security Number)"
                    placeholder="123412"
                  />
                </div>
              </>
            )}
            <div className="space-y-8">
              <CustomInput
                name="email"
                control={form.control}
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                name="password"
                control={form.control}
                label="Password"
                placeholder="Enter your Password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "sign-in"}
            className="form-link"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </footer>
      </>
      )}
    </section>
  );
};

export default AuthForm;
