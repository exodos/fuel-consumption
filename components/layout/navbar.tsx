import { Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import {
  Bars3CenterLeftIcon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { FaGasPump, FaHome, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import MyLink from "./my-link";
import { useRouter } from "next/router";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  children: ReactNode;
};

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const navigation = [
  { name: "Dashboard", href: "/", icon: FaHome, current: true },
  {
    name: "Consumption",
    href: "/consumption",
    icon: FaGasPump,
    current: false,
  },
];

const NavBar = ({ children }: Props) => {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dayTime, setDayTime] = useState("");
  const { pathname } = useRouter();
  const [search, setSearch] = useState("");

  const router = useRouter();

  const handleSearch = (search) => {
    const path = router.pathname;
    const query = router.query;
    query.search = search;
    router.push({
      pathname: path,
      query: query,
    });
    // }
  };

  return (
    <>
      {/* <div className="min-h-full"> */}

      <div className="fixed left-0 top-0 h-full w-1/2" aria-hidden="true" />
      <div className="fixed right-0 top-0 h-full w-1/2" aria-hidden="true" />
      <div className="relative flex min-h-full flex-col">
        <Disclosure as="nav" className="flex-shrink-0 bg-lightGreen">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-[90%] px-2 sm:px-4 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  {/* Logo section */}
                  <div className="flex items-center px-1 lg:px-0 xl:w-64">
                    {/* <div className="flex-1"> */}
                    <div className="flex-shrink-0">
                      <Image
                        className="h-20 w-auto"
                        // className="h-16 w-auto"
                        src={"/logos/ethio-logo.svg"}
                        alt="TeleBirr Logo"
                        width={400}
                        height={200}
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex items-center px-2 lg:px-0 xl:w-64 ">
                    <div className="flex-shrink">
                      <Image
                        className="h-16 w-auto"
                        src={"/logos/telebirr-logo.svg"}
                        alt="TeleBirr Logo"
                        width={400}
                        height={200}
                        priority
                      />
                    </div>
                  </div>

                  {/* Search section */}
                  <div className="flex flex-1 justify-center lg:justify-end">
                    <div className="w-full px-2 lg:px-6">
                      {pathname !== "/" && (
                        <>
                          <label htmlFor="search" className="sr-only">
                            Search consumption
                          </label>
                          <div className="relative text-indigo-200 focus-within:text-gray-400">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              id="search"
                              name="search"
                              className="block w-full border-transparent rounded-2xl bg-gray-100 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-0 focus:placeholder:text-gray-400 sm:text-sm sm:leading-6"
                              placeholder="Enter your keywords ..."
                              type="search"
                              onChange={(e) => {
                                // setSearch(e.currentTarget.value);
                                handleSearch(e.currentTarget.value);
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-400 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3CenterLeftIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  {/* Links section */}
                  <div className="hidden lg:block lg:w-80">
                    <div className="flex items-center justify-end">
                      <div className="flex">
                        {navigation.map((item) => (
                          <div key={item.name}>
                            <Link href={item.href} passHref legacyBehavior>
                              <a
                                key={item.name}
                                className={classNames(
                                  item.href == pathname
                                    ? "bg-lightBlue text-white"
                                    : "text-black hover:text-white",
                                  "block rounded-md px-3 py-2 text-base font-medium"
                                )}
                              >
                                {item.name}
                              </a>
                            </Link>
                          </div>
                        ))}
                      </div>
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-4 flex-shrink-0">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-deepGreen">
                            {" "}
                            <span className="sr-only">Open user menu</span>
                            <FaUserCircle className="h-8 w-8 rounded-full text-white" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {/* {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))} */}
                            <Menu.Item>
                              {({ active }) => (
                                <MyLink href={"/"}>
                                  <a
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Your Profile
                                  </a>
                                </MyLink>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <MyLink href={"/auth/change-password"}>
                                  <a
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    Change Password
                                  </a>
                                </MyLink>
                                // </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    signOut();
                                  }}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-5 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Logout
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="lg:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link href={item.href}>
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className={classNames(
                            item.href === pathname
                              ? "bg-lightBlue text-white"
                              : "text-black hover:bg-deepBlue hover:text-white",
                            "block rounded-md px-3 py-2 text-base font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Disclosure.Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="border-t border-indigo-800 pb-3 pt-4">
                  <div className="space-y-1 px-2">
                    <Link href={"/"}>
                      <Disclosure.Button
                        as="a"
                        href="#"
                        className="block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
                      >
                        Your Profile
                      </Disclosure.Button>
                    </Link>
                    <Link href={"/auth/change-password"}>
                      <Disclosure.Button
                        as="a"
                        href="#"
                        className="block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-deepBlue hover:text-indigo-100"
                      >
                        Change Password
                      </Disclosure.Button>
                    </Link>
                    <Disclosure.Button className="block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          signOut();
                        }}
                      >
                        Logout
                      </button>
                    </Disclosure.Button>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* <div className="mt-1"> */}
        <main className="flex-1 pb-10 flex-col lg:pl-28">
          {/* <div className="mt-1"> */}
          <div className="sm:block">{children}</div>
          {/* </div> */}
        </main>
        {/* </div> */}
      </div>
    </>
  );
};
export default NavBar;
