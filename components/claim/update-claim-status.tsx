import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import NotificationContext from "@/store/notification-context";

const UpdateClaimStatus = gql`
  mutation UpdateClaimStatus(
    $updateClaimStatusId: String!
    $input: ClaimStatusUpdateInput!
  ) {
    updateClaimStatus(id: $updateClaimStatusId, input: $input) {
      id
      accidentRecords {
        id
        bodilyInjury
        propertyInjury
        createdAt
        updatedAt
      }
    }
  }
`;

const UpdateClaimStatusModal = ({ accidentRecord, href }) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);
  const [formValues, setFormValues] = useState(null);

  const [updateClaimStatus, { data, error, loading }] =
    useMutation(UpdateClaimStatus);
  if (error) {
    console.log(error);
  }

  const accidentSubTypeOptions = [
    { value: "SlightBodilyInjury", label: "Slight Bodily Injury" },
    { value: "SaviorBodilyInjury", label: "Savior Bodily Injury" },
    { value: "Death", label: "Death" },
  ];

  const initialValues = {
    bodilyInjury: "",
    propertyInjury: "",
  };

  const validate = Yup.object().shape(
    {
      bodilyInjury: Yup.string().when("propertyInjury", {
        is: (propertyInjury) => !propertyInjury || propertyInjury.length === 0,
        then: Yup.string().required("Bodily injury is required."),
        otherwise: Yup.string(),
      }),
      propertyInjury: Yup.string().when("bodilyInjury", {
        is: (bodilyInjury) => !bodilyInjury || bodilyInjury.length === 0,
        then: Yup.string().required("Property Injury Amount is required."),
        otherwise: Yup.string(),
      }),
    },
    [["bodilyInjury", "propertyInjury"]]
  );

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const bodilyInjuryInput =
      values.bodilyInjury !== "" ? values.bodilyInjury : null;
    const propertyInjuryInput = values.propertyInjury
      ? values.propertyInjury
      : 0;
    const input = {
      accidentRecords: {
        bodilyInjury: bodilyInjuryInput,
        propertyInjury: propertyInjuryInput,
      },
    };

    await updateClaimStatus({
      variables: {
        updateClaimStatusId: accidentRecord,
        input,
      },
      onError: (error) => {
        setOpen(false);
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        setOpen(false);
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully Updated Claim Data",
          status: "success",
        });
      },
      update: (cache, { data }) => {
        const cacheId = cache.identify(data.message);
        cache.modify({
          fields: {
            messages: (existinFieldData, { toReference }) => {
              return [...existinFieldData, toReference(cacheId)];
            },
          },
        });
      },
    }).then(() => router.push(href));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <Formik
                    initialValues={formValues || initialValues}
                    validationSchema={validate}
                    onSubmit={onSubmit}
                    enableReinitialize={true}
                  >
                    <Form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-lightGreen px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-lg font-semibold text-white mt-10">
                                Create Accident Record
                              </Dialog.Title>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-50 hover:text-gray-800"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-white">
                              Please enter detail of accident record
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-4">
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="bodilyInjury"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Bodily Injury
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                as="select"
                                name="bodilyInjury"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option disabled value="">
                                  Select Bodily Injury?
                                </option>
                                {accidentSubTypeOptions.map((option: any) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Field>
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="bodilyInjury" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="propertyInjury"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Property Injury Amount
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="number"
                                step="any"
                                name="propertyInjury"
                                placeholder="Enter Property Injury Amount?"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="propertyInjury" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-lightGreen py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-depGreen focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UpdateClaimStatusModal;
