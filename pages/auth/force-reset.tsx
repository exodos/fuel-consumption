import { MdPassword } from "react-icons/md";
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as Yup from "yup";
import { useContext, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { gql } from "apollo-server-micro";
import { useMutation } from "@apollo/client";
import NotificationContext from "@/store/notification-context";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { initializeApollo } from "@/lib/apollo";
import { verifyPassword } from "@/lib/auth";
import SiteHeader from "@/components/layout/header";

const ChangeUserPassword = gql`
  mutation ChangeUserPassword(
    $changeUserPasswordId: String!
    $currentPassword: String!
    $password: String!
  ) {
    changeUserPassword(
      id: $changeUserPasswordId
      currentPassword: $currentPassword
      password: $password
    ) {
      id
    }
  }
`;

const UsersByID = gql`
  query UsersByID($userId: String!) {
    usersByID(userId: $userId) {
      id
      password
    }
  }
`;

const dev = process.env.NEXTAUTH_URL != "production";
const rechaptcha_key = dev
  ? process.env.NEXT_PUBLIC_LOCAL_RECHAPTCHA_SITE_KEY
  : process.env.NEXT_PUBLIC_PRODUCTION_RECHAPTCHA_SITE_KEY;

const ForceResetPassword = ({
  data,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const captchaRef = useRef(null);
  const [userPassword, setUserPassword] = useState(data.usersByID.password);
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);

  const [changeUserPassword] = useMutation(ChangeUserPassword);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validate = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Please Enter Old Password")
      .test("isOldPasswordValid", "OldPassword Incorrect", function (value) {
        if (!value) return true;
        return verifyPassword(value, userPassword);
      }),
    newPassword: Yup.string()
      .required("Please Enter New Password")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/,
        "Must Contain 12 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .notOneOf(
        [Yup.ref("currentPassword"), null],
        "Old Password and new password must be different"
      ),
    confirmPassword: Yup.string()
      .required("Please Enter Confirm Password")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const onSubmit = async (values: FormikValues) => {
    await changeUserPassword({
      variables: {
        changeUserPasswordId: userId,
        currentPassword: values.currentPassword,
        password: values.newPassword,
      },
      onError: (error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: data.message || "Successfully Reset User Password",
          status: "success",
        });
        // signOut();
      },
    }).then(() => {
      signOut(), router.push("/");
    });
  };

  const onReCAPTCHAChange = (captchaCode) => {
    if (!captchaCode) {
      return;
    }
    captchaRef.current.execute();

    // captchaRef.current.reset();
  };

  return (
    <>
      <SiteHeader
        title={"Fuel Tracking Change User Password Page"}
        content={"Fuel Tracking Change User Password Page"}
      />
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
                    width={350}
                    height={120}
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
                  <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    You must change your password
                  </h2>
                </div>
              </div>
            </div>
            <div className="mt-2 justify-center items-center mx-40">
              <Formik
                initialValues={initialValues}
                validationSchema={validate}
                onSubmit={onSubmit}
              >
                <Form className="space-y-0">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="hidden text-sm font-medium text-gray-700"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MdPassword
                          className="h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        name="currentPassword"
                        type="password"
                        className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                        placeholder="Enter Current Password"
                        autoComplete="off"
                      />
                      <div className="text-red-600  text-sm italic mt-1">
                        <ErrorMessage name="currentPassword" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label
                      htmlFor="newPassword"
                      className="hidden text-sm font-medium text-gray-700"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <RiLockPasswordLine
                          className="h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        name="newPassword"
                        type="password"
                        className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                        placeholder="New Password"
                        autoComplete="off"
                      />
                      <div className="text-red-600  text-sm italic mt-1">
                        <ErrorMessage name="newPassword" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label
                      htmlFor="confirmPassword"
                      className="hidden text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <RiLockPasswordLine
                          className="h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <Field
                        name="confirmPassword"
                        type="password"
                        className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                        placeholder="Confirm Password"
                        autoComplete="off"
                      />
                      <div className="text-red-600  text-sm italic mt-1">
                        <ErrorMessage name="confirmPassword" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="relative pt-3 pb-2">
                      <ReCAPTCHA
                        ref={captchaRef}
                        size="normal"
                        sitekey={rechaptcha_key}
                        onChange={onReCAPTCHAChange}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-3xl border border-transparent bg-lightGreen py-3 px-2 text-base font-semibold text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-darkGrayHv focus:ring-offset-2"
                    >
                      Reset
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  }

  const userId = session.user.id;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: UsersByID,
    variables: {
      userId,
    },
  });

  return {
    props: {
      session,
      data,
      userId: userId,
    },
  };
};

export default ForceResetPassword;
