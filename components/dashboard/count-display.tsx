const DisplayCount = ({ totalCountSum }) => {
  return (
    <>
      {/* <div> */}
      <dl className="mt-3 mx-auto grid grid-cols-1 gap-x-6 gap-y-15 sm:grid-cols-1 sm:gap-y-16 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
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
            </dd>
          </div>
        ))}
      </dl>
      {/* </div> */}
    </>
  );
};

export default DisplayCount;
