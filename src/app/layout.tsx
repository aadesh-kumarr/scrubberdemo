import { Metadata } from "next";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Link from "next/link";
import Customers_Name from "@/components/ui/manual/customersection"; // Adjust the import path as needed
import { Inter } from "next/font/google";
import "./globals.css";
import authorisation from "@/lib/authorization";
import { Customerstype } from "@/types"; // Adjust the import path as needed

import { IoMdAddCircleOutline } from "react-icons/io";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lostronaunt",
  description: "LOSTRONAUNT PERSONAL USE APP",
};

interface RootLayoutProps {
  children: React.ReactNode;
  customers?: Customerstype[];
}

export default async function RootLayout({
  children,
  customers = [],
}: RootLayoutProps) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-zinc-900">
        <SessionProvider session={session}>
          <>
            <div className="w-full bg-black text-white flex py-2 my-4">
              <div className="text-white flex justify-between w-full">
                {authorisation(session?.user?.email as string) && (
                  <Link
                    href="/add_customer"
                    className="cursor-pointer text-2xl content-center flex align-middle pl-4"
                  >
                    <IoMdAddCircleOutline />
                  </Link>
                )}
                <p className="rounded text-xl mx-auto">
                  <Link href="/">Lostronaunt</Link>
                </p>
              </div>
            </div>
            <div className="z-10">
            {authorisation(session?.user?.email as string) && (
              <Customers_Name customers={customers} />
            )}
            </div>
            {children}
          </>
        </SessionProvider>
      </body>
    </html>
  );
}
