import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useContext, useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import { useRouter } from "next/router";
import Papa from "papaparse";
import { baseUrl } from "@/lib/config";
import NotificationContext from "@/store/notification-context";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import SiteHeader from "@/components/layout/header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { isEmpty, isNull } from "lodash";
import { BsArrowDownCircleFill } from "react-icons/bs";

const ImportInsuranceInsured = ({
  branchId,
  insuredId,
  pageURL,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const notificationCtx = useContext(NotificationContext);
  let slicedValue = null;
  const size = 10;
  const router = useRouter();
  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;

  const initialValues = {
    firstName: "",
    lastName: "",
    occupation: "",
    region: "",
    city: "",
    subCity: "",
    wereda: "",
    kebelle: "",
    houseNumber: "",
    mobileNumber: "",
    policyStartDate: "",
    policyIssuedConditions: "",
    personsEntitledToUse: "",
    vehicleFile: "",
  };

  const validate = Yup.object().shape({
    firstName: Yup.string().required("First Name Is Required"),
    lastName: Yup.string().required("First Name Is Required"),
    region: Yup.string().required("Region Is Required"),
    city: Yup.string().required("City Is Required"),
    subCity: Yup.string().required("SubCity Name Is Required"),
    wereda: Yup.string().required("Wereda Is Required"),
    kebelle: Yup.string().required("Kebelle Is Required"),
    houseNumber: Yup.string().required("HouseNumber Is Required"),
    mobileNumber: Yup.string()
      .matches(phoneRegExp, "Phone Number Is Not Valid")
      .required("Phone Number Is Required"),
    policyStartDate: Yup.date().required("Policy Start Date Is Required"),
    policyIssuedConditions: Yup.string().required(
      "Policy Issued Conditions Is Required"
    ),
    personsEntitledToUse: Yup.string().required(
      "Persons Entitled To Use/Drive Is Required"
    ),
  });

  const handleChange = (event: any) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        setParsedData(results.data);
        setTableRows(rowsArray[0]);
        setValues(valuesArray);
      },
    });
  };

  slicedValue = values.slice(0, size);

  const hasDuplicate = (arrayObj, colName) => {
    var hash = Object.create(null);
    return arrayObj.some((arr) => {
      return (
        arr[colName] && (hash[arr[colName]] || !(hash[arr[colName]] = true))
      );
    });
  };

  const onSubmit = async (values: any) => {
    // values.preventDefault();
    const fullPlateDuplicate = hasDuplicate(parsedData, "plateNumber");
    const chassisNumberDuplicate = hasDuplicate(parsedData, "chassisNumber");
    const engineNumberDuplicate = hasDuplicate(parsedData, "engineNumber");
    const input = {
      insuredId: insuredId,
      branchId: branchId,
      policyStartDate: new Date(values.policyStartDate),
      policyIssuedConditions: values.policyIssuedConditions,
      personsEntitledToUse: values.personsEntitledToUse,
      vehicles: [...parsedData],
    };

    if (fullPlateDuplicate || chassisNumberDuplicate || engineNumberDuplicate) {
      notificationCtx.showNotification({
        title: "Error!",
        message:
          "Plate, Chassis Or Engine Number Must Be Unique!! Please Check The Excel And Upload Again",
        status: "error",
      });
    } else {
      try {
        notificationCtx.showNotification({
          title: "Import Vehicle",
          message: "Importing Vehicle",
          status: "pending",
        });
        await fetch(baseUrl + `/api/import/insurance-import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            response.json().then((data) => {
              notificationCtx.showNotification({
                title: "Error", //           message: data.message || "Something Went Wrong",
                status: "error",
              });
            });
          })
          .then((data) => {
            notificationCtx.showNotification({
              title: "Success!",
              message: "Successfully Added Vehicle",
              // message: data.message,
              status: "success",
            });
          })
          .catch((error) => {
            notificationCtx.showNotification({
              title: "Error!",
              message: error.message || "Something Went Wrong",
              status: "error",
            });
          });
        await router.push(pageURL);
      } catch (error) {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      }
    }
  };
  const downloadSample = () => {
    let filePath: string = baseUrl + `/csv/sample-template.csv`;
    axios
      .get(`${filePath}`, {
        responseType: "blob",
      })
      .then((res) => {
        let filename: string[] | string = filePath.replace(/^.*[\\\/]/, "");
        filename = filename.split(".");
        filename = filename[filename.length - 2];
        let fileExtension;
        fileExtension = filePath.split(".");
        fileExtension = fileExtension[fileExtension.length - 1];
        fileDownload(res.data, `${filename}.${fileExtension}`);
      });
  };

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Create Insurance From Excel Import Page"}
        content={
          "Third Party Insurance Create Insurance From Excel Import Page"
        }
      />
      <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-20">
          <h3 className="text-lg font-semibold text-gray-700 px-4 pt-3">
            Create Insurance From Excel
          </h3>
          <p className="text-base font-medium text-gray-500 px-4">
            Please create policy and insured and import vehicle
          </p>
          <div className="container px-2 py-2 mx-auto">
            <div className="pt-5">
              <div className="flex justify-center">
                <button
                  onClick={() => downloadSample()}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium  text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <BsArrowDownCircleFill
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Sample Template
                </button>
              </div>
            </div>
          </div>
          <div className="container px-2 py-5 mx-auto">
            <Formik
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={onSubmit}
            >
              {({ handleSubmit, values, setValues }) => (
                <Form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-5 md:gap-6">
                      <div className="mt-5 md:mt-0 md:col-span-5">
                        <div className="grid grid-cols-5 gap-4">
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              First Name
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="firstName"
                              placeholder="Enter First Name"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="firstName" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Last Name
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="lastName"
                              placeholder="Enter Last Name"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="policyIssuedConditions" />
                            </div>
                          </div>
                          <div className="col-span-4 sm:col-span-1">
                            <label
                              htmlFor="occupation"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Occupation
                            </label>
                            <Field
                              type="text"
                              name="occupation"
                              placeholder="Enter Occupation"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="region"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Region
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="region"
                              placeholder="Enter Region"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="region" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              City
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="city"
                              placeholder="Enter City"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="city" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="subCity"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              SubCity
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="subCity"
                              placeholder="Enter SubCity"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="subCity" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="wereda"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Wereda
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="wereda"
                              placeholder="Enter Wereda"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="wereda" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="kebelle"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Kebelle
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="kebelle"
                              placeholder="Enter Kebelle"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="kebelle" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="houseNumber"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              House Number
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="houseNumber"
                              placeholder="Enter House Number"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="houseNumber" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="mobileNumber"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Mobile Number
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="mobileNumber"
                              placeholder="Enter Mobile Number"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="mobileNumber" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow px-4 py-1 sm:rounded-lg sm:p-4">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                      <div className="mt-5 md:mt-0 md:col-span-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="policyStartDate"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Policy Start Date
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="date"
                              name="policyStartDate"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="policyStartDate" />
                            </div>
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="policyIssuedConditions"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Policy Issued Conditions
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="text"
                              name="policyIssuedConditions"
                              placeholder="Enter Policy Issued Conditions"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="policyIssuedConditions" />
                            </div>
                          </div>
                          <div className="col-span-4 sm:col-span-1">
                            <label
                              htmlFor="personsEntitledToUse"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Persons Entitled To Use/Drive
                            </label>
                            <Field
                              type="text"
                              name="personsEntitledToUse"
                              placeholder="Enter Persons Entitled To Use/Drive"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="personsEntitledToUse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-5">
                    <div className="flex justify-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="sr-only">Choose File</span>
                        <Field
                          type="file"
                          name="vehicleFile"
                          accept={".csv"}
                          onChange={(e) => handleChange(e)}
                          className="block w-full text-sm text-deepGreen file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lightGreen file:text-white hover:file:bg-deepGreen"
                        />
                        {/* <div className="text-eRed text-sm italic mt-2">
                        <ErrorMessage name="vehicleFile" />
                      </div> */}
                      </label>
                    </div>
                  </div>

                  <div className="px-1 sm:px-2 lg:px-4">
                    <div className="mt-8 flex flex-col">
                      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  {tableRows.map((rows, index) => {
                                    return (
                                      <th
                                        key={index}
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                      >
                                        {rows}
                                      </th>
                                    );
                                  })}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {slicedValue.map((value, index) => {
                                  return (
                                    <tr key={index}>
                                      {value.map((val, i) => {
                                        return (
                                          <td
                                            key={i}
                                            className="whitespace-nowrap px-5 py-4 text-sm text-gray-500"
                                          >
                                            {val}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-center">
                      {parsedData.length > 0 && (
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightBlue hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Continue
                        </button>
                      )}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/sign-in",
      },
    };
  } else if (session.user.adminRestPassword) {
    return {
      redirect: {
        destination: "/user/force-reset",
        permanent: false,
      },
    };
  }

  const userRole = session?.user?.memberships?.role;
  const pageURL = userRole === "INSURER" ? "insured" : "branch";
  const branchId = session.user.memberships.branchId;
  const { query } = context;
  const insuredId = query.insured;
  if (isEmpty(insuredId) || isNull(insuredId)) {
    return {
      redirect: {
        destination: `${pageURL}/vehicle`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      branchId: branchId,
      insuredId: insuredId,
      pageURL: pageURL,
    },
  };
};

export default ImportInsuranceInsured;
