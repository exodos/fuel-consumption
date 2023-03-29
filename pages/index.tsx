import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import SiteHeader from "../components/layout/header";

const Home = (
  props
) => {
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Admin Dashboard Page"}
        content={"Third Party Insurance Admin Dashboard Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </div>
        {/* <ListCertificate certificateData={data.feedCertificate} /> */}
      </div>
    </>
  );
};



export default Home;
