"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useAccount } from "wagmi";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

const generalMenuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
];

const connectedMenuLinks: HeaderMenuLink[] = [
  {
    label: "New Payroll",
    href: "/new-payroll",
  },
  {
    label: "Add New Recipient",
    href: "/add-recipient",
  },
  {
    label: "View Transactions",
    href: "/view-transactions",
  },
  {
    label: "View Recipients",
    href: "/view-recipients",
  },
  // Add any other proposed links here, e.g.:
  // {
  //   label: "Treasury Overview",
  //   href: "/treasury",
  // },
];

export const HeaderMenuLinks = ({ isConnected }: { isConnected: boolean }) => {
  const pathname = usePathname();
  const menuLinks = [...generalMenuLinks, ...(isConnected ? connectedMenuLinks : [])];

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;
  const { isConnected } = useAccount();

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent">
            <Bars3Icon className="h-1/2" />
          </summary>
          <ul
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-sm bg-base-100 rounded-box w-52"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks isConnected={isConnected} />
          </ul>
        </details>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SalArcy logo" className="cursor-pointer" fill src="/SalArcy-logo.jpg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">SalArcy</span>
            <span className="text-xs"></span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks isConnected={isConnected} />
        </ul>
      </div>
      <div className="navbar-end grow mr-4">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};