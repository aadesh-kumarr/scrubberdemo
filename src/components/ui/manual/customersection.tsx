"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "../input";

import Link from "next/link";
import { FaAddressBook } from "react-icons/fa";
import type { Customerstype } from "@/types";
import {
  useState,
  useEffect,
} from "react";


const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customerstype[]>([]);
  const [filter, setFilter] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customerstype[]>(
    []
  );

  const getTotalBalanceAmount = () => {
    return customers.reduce((total, customer) => total + customer.balanceAmount, 0);
  };

  const marketsum = getTotalBalanceAmount();





  useEffect(() => {
    // fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/add_customer");
        const data = await response.json();
        setCustomers(data.customers);
        setFilteredCustomers(data.customers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // filter data
    const filtered = customers.filter((customer) => {
      return customer.name.toLowerCase().includes(filter.toLowerCase());
    });
    setFilteredCustomers(filtered);
  }, [filter, customers]);

  return (
    <div className="bg-zinc-800 text-white">
<Sheet>
  <SheetTrigger className="absolute top-6 right-4 text-white text-2xl content-center flex align-middle">
    {" "}
    <FaAddressBook />{" "}
  </SheetTrigger>
  <SheetContent className="bg-zinc-800 text-white">
    <SheetHeader>
      <div className="bg-black p-3 rounded-xl shadow-zinc-900 shadow-xl mb-5 mt-4">
        <SheetTitle className="text-white text-xl flex justify-between">
          <div className="">Customers</div>
          <div className="text-sm content-center">{marketsum}</div>
          </SheetTitle>
      </div>
      <div className="flex flex-row m-0  px-2 ">
        <Input
          placeholder="search by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-zinc-700 rounded-full border-zinc-950"
        />

      </div>
      <hr className="w-full py-2 border-zinc-100 " />
      <SheetDescription>
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <Link key={customer._id} href={`/customer_detail?id=${customer._id}`} passHref>
              <div className="p-2 pl-4 bg-zinc-900 mb-1 text-zinc-100 rounded flex justify-between">
                <p className="text-lg">{customer.name}</p>
                <p className="text-lg">{customer.balanceAmount}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="bg-zinc-600 rounded mb-1 px-2 pb-1">No customers found</p>
        )}
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
    </div>
  );
};

export default Customers;
