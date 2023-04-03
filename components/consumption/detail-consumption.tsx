import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const ConsumptionDetails = ({ consumption }) => {
  const [open, setOpen] = useState<boolean>(true);

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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      <div className="overflow-hidden bg-lightGreen shadow">
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-lg font-semibold leading-6 text-white mt-5">
                                Consumption
                                <p className="mt-1 max-w-2xl text-sm text-white font-medium">
                                  Detail of Consumption
                                </p>
                              </Dialog.Title>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6 text-white"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-hidden bg-white shadow sm:rounded-lg pb-4">
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-2 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Transaction Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.transactionNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Amount
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.amount}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel In Liters
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelInLiters}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Type
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelType}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Plate Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {`${consumption?.plateCode}${consumption?.plateRegion}${consumption?.plateNumber}`}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Paid At
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(consumption.paidAt),
                                    "MMM-dd-yyyy"
                                  )}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Debit Account Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.debitAccountNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Credit Account Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.creditAccountNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Station Id
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelStationId}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Station Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelStationRegion}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Station Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelStationName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Station Zone
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelStationZone}
                                </dd>
                              </div>

                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Station Woreda
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelStationWoreda}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Fuel Station Kebele
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.fuelStationKebele}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Last Kilo Meter
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.lastKiloMeter}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Reason Type Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.reasonTypeName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Reason Type Code
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.reasonTypeCode}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  First Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.firstName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Middle Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.middleName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Last Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.lastName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.mobileNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Source Id
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.sourceId}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Company Id
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {consumption?.companyId}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConsumptionDetails;
