import React from "react";
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  return (
    <Disclosure as="nav" className="bg-blue-900 shadow-lg text-white">
      {({ open }) => (
        <>
          <div className="mx-auto px-6 sm:px-10 lg:px-16">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo Section */}
              <div className="flex flex-1 items-center justify-start">
                {/* <img
                  src="https://cdn-icons-png.flaticon.com/512/1146/1146884.png"
                  alt="News Logo"
                  className="h-12 w-12 mr-3"
                /> */}
                <h1 className="text-2xl font-extrabold text-white p-4 tracking-wide">NewsHub</h1>
              </div>

             


               
              
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;