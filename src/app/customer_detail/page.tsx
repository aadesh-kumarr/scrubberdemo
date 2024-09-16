"use client"
import { useState, useEffect } from "react";
import BillCard from "@/components/ui/manual/billcard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CommingSoon from "@/components/ui/manual/comingsoon";
import type { Customerstype, Orderstype } from "@/types"; // Add Orderstype if it exists
import authorisation from "@/lib/authorization";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Props {
  customers: Customerstype[];
}

const CustomerComponent: React.FC<Props> = () => {
  const user = useCurrentUser();
  const Router = useRouter();

  useEffect(() => {
    if (!user) {
      Router.push("/");
    }

    if (user && !authorisation(user?.email as string)) {
      Router.push("/")
    }
  }, [user, Router]);

  const [customer, setCustomer] = useState<Customerstype | null>(null);
  const [customers, setCustomers] = useState<Customerstype[]>([]);
  const [orders, setOrders] = useState<Orderstype[]>([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch orders for the given customer_id
  const fetchOrders = async (customerId: string) => {
    try {
      const response = await fetch(`/api/orders/?customer_id=${customerId}`);
      const data = await response.json();
      setOrders(data.orders); // Corrected this line to set data.orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch customers data from API
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/add_customer`);
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchData();
  }, []);

  useEffect(() => {
    // Find customer after data is fetched
    if (id && Array.isArray(customers)) {
      const foundCustomer = customers.find((cust) => cust._id === id) || null;
      setCustomer(foundCustomer);
      if (foundCustomer) {
        fetchOrders(foundCustomer._id); // Fetch orders for the found customer
      }
    }
  }, [id, customers]); // Removed fetchOrders from dependency array

  if (!customer) {
    console.log(customers);
    console.log(id);
    return <div>No customer </div>;
  }

  return (
    <div className="overflow-y-scroll no-scrollbar">
      <div className="flex flex-col bg-gradient-radial from-slate-800 bg-black p-4 m-4 rounded text-white content-between">
        <div className="flex flex-col gap-5 flex-1">
          <div className="flex justify-between">
            <p> {customer.name}</p>
            <p> {customer.creation_date}</p>
          </div>
          <p>Address: {customer.address || "No address provided"}</p>
          <p>{customer.contact || "+91 xxx xxx xxxx"}</p>

          <p className="mx-auto text-center bg-zinc-200 text-black p-2 rounded-xl font-bold">
            Balance: {customer.balanceAmount}
          </p>
          <Link href={`/Add_bill?id=${customer._id}`} >
            <p className="mx-auto text-center bg-zinc-800 p-2 rounded-xl hover:text-black hover:bg-zinc-200 cursor-pointer">
              Add-bill
            </p>
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-white mx-auto text-center text-white bg-black p-2">
        Previous Bills
      </h1>

      <div className="m-3">
      {orders.length > 0 ? (
  orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort orders by date in descending order
    .map(order => 
      <BillCard 
        key={order._id}
        date={new Date(order.date).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
        customerName={customer.name}
        quantity={Number(order.quantity)} 
        unit={String(order.unit)} 
        rate={Number(order.rate)} 
        billamount={Number(order.total)} 
        lastBalance={Number(order.last_balance)}
        amount={Number(order.amountReceived)} // Display the amount received
        balanceAmount={Number(order.balanceAmount)} // Display the balance amount from the order
      />
          ) 
        ) : (
          <p><CommingSoon /></p>
        )}
      </div>
    </div>
  );
};

export default function CustomerDetail({ customers }: Props) {
  return <CustomerComponent customers={customers} />;
}
