import { MdEmail } from "react-icons/md";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";
import SignInError from "./signin-error";

const SignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const validate = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().required("Password Is Required"),
  });
  return (
    <>
      <div className="h-screen">
        <div className="flex h-screen">
          <div className="relative hidden lg:block bg-lightGreen lg:w-2/4 ">
            <div className="mt-32 pt-20 px-20 items-center justify-center">
              <Image
                src={"/logos/Car-01.png"}
                alt="Fuel Tracking Pic"
                className="h-200 w-auto"
                width={750}
                height={250}
                priority
              />
            </div>
          </div>
          <div className="relative lg:w-2/4">
            <div className="mt-10">
              <div className="sm:flex sm:ml-5 sm:items-center">
                <div className="sm:flex-initial sm:ml-8">
                  <Image
                    className="h-20 w-auto"
                    src={"/logos/ethio-logo.svg"}
                    alt="Ethiotelecom logo"
                    width={0}
                    height={0}
                  />
                </div>
                <div className="sm:flex-auto">
                  {/* <Image
                  className="h-8 w-auto"
                  src="/logos/TeleBirr Logos.svg"
                  alt="Ethiotelecom logo"
                  width={200}
                  height={90}
                /> */}
                </div>

                <div className="sm:mt-0 sm:mr-8 sm:flex-none">
                  <Image
                    className="h-16 w-auto"
                    src={"/logos/telebirr-logo.svg"}
                    alt="TeleBirr logo"
                    width={350}
                    height={120}
                  />
                </div>
              </div>
            </div>
            <div className="flex py-10 px-10 sm:px-9 lg:flex-none lg:px-40 xl:px-44">
              <div className="mt-10 mx-10">
                <div className="mt-1">
                  <h1 className="text-lightGreen font-bold text-3xl">
                    Fuel Consumption Tracking System
                  </h1>
                </div>
              </div>
            </div>
            <div className="mt-2 justify-center items-center mx-48">
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validate}
                onSubmit={async (values, { setSubmitting }) => {
                  const res = await signIn("credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                    callbackUrl: `${window.location.origin}`,
                  });

                  if (res?.error) {
                    setError(res.error);
                  } else {
                    setError(null);
                  }
                  if (res.url) router.push(res.url);
                  setSubmitting(false);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="hidden text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MdEmail
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <Field
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-gray-300 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                          placeholder="Email Address"
                        />
                        <div className="text-red-600  text-sm italic mt-1">
                          <ErrorMessage name="email" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="password"
                        className="hidden text-sm font-medium text-gray-700"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <RiLockPasswordLine
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <Field
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md  border-gray-300 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                          placeholder="Passwords"
                        />
                        <div className="text-red-600  text-sm italic mt-1">
                          <ErrorMessage name="password" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={csrfToken}
                      />
                      <div className="text-red-400 text-md text-center rounded p-1">
                        {error && <SignInError error={error} />}
                      </div>
                    </div>
                    <div className="pt-1">
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-3xl border border-transparent bg-lightGreen py-4 px-2 text-base font-semibold text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-darkGrayHv focus:ring-offset-2"
                      >
                        {formik.isSubmitting ? "Please wait..." : "Sign In"}
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: CtxOrReq) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default SignIn;
