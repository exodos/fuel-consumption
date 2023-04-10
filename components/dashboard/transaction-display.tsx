import { AiOutlineTransaction } from "react-icons/ai";
import { Icons } from "../layout/icons";

const DisplayTransaction = ({
  allTransaction,
  totalTransactionBySource,
  totalPaymentBySource,
}) => {
  return (
    <>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allTransaction?.map((item: any, i: any) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-1 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-lightBlue p-3">
                  <Icons rows={item.icon} />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-2 sm:pb-1">
                <p className="text-2xl font-semibold text-lightBlue">
                  {item.data}
                </p>
              </dd>
              <div className="text-sm ml-16">
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {item.via}
                </span>
              </div>
            </div>
          ))}
          {totalTransactionBySource?.map((item: any, i: any) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-1 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-lightBlue p-3">
                  <Icons rows={item.icon} />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-2 sm:pb-1">
                <p className="text-2xl font-semibold text-lightBlue">
                  {item.data}
                </p>
              </dd>
              <div className="text-sm ml-16">
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {item.via}
                </span>
              </div>
            </div>
          ))}
          {totalPaymentBySource?.map((item: any, i: any) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-1 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-lightBlue p-3">
                  <Icons rows={item.icon} />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-2 sm:pb-1">
                <p className="text-2xl font-semibold text-lightBlue">
                  {item.data}
                </p>
              </dd>
              <div className="text-sm ml-16">
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {item.via}
                </span>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
};

export default DisplayTransaction;
