import { useLazyQuery } from "@apollo/client";
import { gql } from "apollo-server-micro";
import format from "date-fns/format";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiShow } from "react-icons/bi";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import ConsumptionDetails from "./detail-consumption";

const FeedConsumption = gql`
  query FeedConsumption($consumptionByIdId: Int!) {
    consumptionById(id: $consumptionByIdId) {
      id
      transactionNumber
      amount
      fuelInLiters
      fuelType
      plateCode
      plateRegion
      plateNumber
      paidAt
      debitAccountNumber
      creditAccountNumber
      fuelStationId
      fuelStationRegion
      fuelStationName
      fuelStationZone
      fuelStationWoreda
      fuelStationKebele
      lastKiloMeter
      reasonTypeName
      reasonTypeCode
      firstName
      middleName
      lastName
      mobileNumber
      sourceId
      companyId
      createdAt
      updatedAt
    }
  }
`;

const ListConsumption = ({ consumptionData }) => {
  const router = useRouter();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);

  // const { pathname } = useRouter();

  const handlePaginate = (page: any) => {
    const path = router.pathname;
    const query = router.query;
    query.page = page.selected + 1;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const [
    ConsumptionData,
    {
      loading: feedConsumptionLoading,
      error: feedConsumptionError,
      data: feedConsumptionData,
    },
  ] = useLazyQuery(FeedConsumption);

  const handleDetails = async (id: any) => {
    const consumptionD = await ConsumptionData({
      variables: {
        consumptionByIdId: id,
      },
    });

    console.log(consumptionD?.data);

    if (consumptionD?.data?.consumptionById) {
      setShowDetailModal((prev) => !prev);
      setDetailtList(consumptionD?.data?.consumptionById);
    }
  };

  return (
    <>
      <div className="px-1 sm:px-2 lg:px-4">
        <div className="mt-20 flex flex-col">
          {/* <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8"> */}
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-3xl">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Transaction Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fuel In Liters
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fuel Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Plate Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Paid At
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Debit Account Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Credit Account Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fuel Station Region
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Fuel Station Name
                    </th>
                    {/* <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        First Name
                      </th> */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Mobile Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Company Id
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Updated At
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Detail</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {consumptionData?.consumptions.length > 0 &&
                    consumptionData?.consumptions.map((item: any, i: any) => (
                      <tr key={i}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {i + 1}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.transactionNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.amount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.fuelInLiters.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.fuelType}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {`${item.plateCode}${item.plateRegion}${item.plateNumber}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(item.paidAt), "MMM-dd-yyyy")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.debitAccountNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.creditAccountNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.fuelStationRegion}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.fuelStationName}
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.firstName}
                          </td> */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.mobileNumber}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.companyId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(item.createdAt), "MMM-dd-yyyy")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(item.updatedAt), "MMM-dd-yyyy")}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <>
                            <button
                              onClick={() => {
                                handleDetails(item.id);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              data-tip
                              data-type="success"
                              data-for="showDetails"
                            >
                              <BiShow
                                className="flex-shrink-0 h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </button>
                            <ReactTooltip
                              id="showDetails"
                              place="top"
                              effect="solid"
                            >
                              Show Details
                            </ReactTooltip>
                          </>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className="mt-5 flex align-middle py-1 md:px-6 lg:px-8 flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            {consumptionData?.consumptions.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={consumptionData.curPage - 1}
                pageCount={consumptionData.maxPage}
                onPageChange={handlePaginate}
                containerClassName={
                  "border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-6"
                }
                pageClassName={
                  "border-transparent text-gray-700 hover:text-gray-900 hover:border-black border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                }
                previousLinkClassName={
                  "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                nextLinkClassName={
                  "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                activeClassName={
                  "border-t-2 border-lightBlue text-deepGreen font-semibold"
                }
              />
            )}
          </div>
        </div>
      </div>

      {showDetailModal ? <ConsumptionDetails consumption={detailList} /> : null}
    </>
  );
};

export default ListConsumption;
