import { Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { getSession, signOut, useSession } from "next-auth/react";

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
import { Bars3Icon } from "@heroicons/react/24/solid";

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
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useRouter();

  const router = useRouter();
  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace("/auth/sign-in");
      } else {
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <p className="px-10">Loading ...</p>;
  }

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
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-initial">
          <Image
            className="h-20 w-auto"
            src={"/logos/ethio-logo.svg"}
            alt="Ethiotelecom logo"
            width={400}
            height={200}
            priority
          />
        </div>
        <div className="sm:flex-auto"></div>
        <div className="sm:mt-0 sm:ml-16 mr-5 sm:flex-none">
          <Image
            className="h-20 w-auto"
            src={"/logos/telebirr-logo.svg"}
            alt="TExA Logo"
            width={250}
            height={90}
          />
        </div>
      </div>
      {/* <div className="min-h-full"> */}
      <Disclosure as="nav" className="bg-lightGreen">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-[95%] px-2 sm:px-4 lg:px-8 mt-1">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center px-2 lg:px-0">
                  <div className="flex-shrink-0"></div>
                  <div className="hidden lg:ml-6 lg:block">
                    <div className="flex space-x-4">
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
                  </div>
                </div>
                <div className="flex flex-1 justify-center px-4 lg:ml-6 lg:justify-end">
                  <div className="w-full max-w-lg lg:max-w-xl">
                    {pathname !== "/" &&
                      pathname !== "/auth/change-password" && (
                        <>
                          <label htmlFor="search" className="sr-only">
                            Search
                          </label>
                          <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <MagnifyingGlassIcon
                                className="h-5 w-5 text-gray-400"
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
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-4 lg:block">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="flex-shrink-0 rounded-full bg-gray-50 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <FaUserCircle className="h-8 w-8 rounded-full text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {session?.user?.firstName}
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {session?.user?.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link href={"/"}>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-lightBlue hover:text-white"
                    >
                      Your Profile
                    </Disclosure.Button>
                  </Link>
                  <Link href={"/auth/change-password"}>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-lightBlue hover:text-white"
                    >
                      Change Password
                    </Disclosure.Button>
                  </Link>
                  <Disclosure.Button className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-lightBlue hover:text-white">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        signOut();
                      }}
                    >
                      Sign out
                    </button>
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <main className="flex-1 pb-10 flex-col lg:pl-16">
        {/* <div className="mt-1"> */}
        <div className="sm:block">{children}</div>
        {/* </div> */}
      </main>
    </>
  );
};
export default NavBar;
