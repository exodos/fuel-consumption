import { AiOutlineTransaction } from "react-icons/ai";
import { Icons } from "../layout/icons";

const DisplayCount = ({ totalCountSum }) => {
  return (
    <>
      {/* <dl className="mt-3 mx-auto grid grid-cols-1 gap-x-6 gap-y-15 sm:grid-cols-1 sm:gap-y-16 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
        {totalCountSum?.map((item: any, i: any) => (
          <div
            key={i}
            className="border bg-white border-gray-300 rounded-xl p-6"
          >
            <dt className="text-gray-500 text-center">{item.name}</dt>
            <dd className="mt-5 text-lg text-center">
              <span className="text-gray-500 text-4xl ordinal slashed-zero tabular-nums font-semibold">
                {item.data}
              </span>
            </dd>          </div>
        ))}
      </dl> */}
      <div>
        {/* <h3 className="text-base font-semibold leading-6 text-gray-900">
          Last 30 days
        </h3> */}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {totalCountSum?.map((item: any, i: any) => (
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
                  {/* <span className="ml-2 text-sm font-medium text-gray-500">
                    {item.via}
                  </span> */}
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

export default DisplayCount;
