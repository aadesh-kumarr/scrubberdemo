"use client";
import { useState, useEffect } from "react";
import BillCard from "@/components/ui/manual/billcard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CommingSoon from "@/components/ui/manual/comingsoon";
import type { Customerstype, Orderstype, Paymenttype } from "@/types";
import authorisation from "@/lib/authorization";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import Calendar from "@/components/ui/manual/calenders";

const CustomerComponent: React.FC = () => {
  const user = useCurrentUser();
  const Router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [paymentdata, setPaymentdata] = useState<Paymenttype | null>(null);
  const [customer, setCustomer] = useState<Customerstype | null>(null);
  const [customers, setCustomers] = useState<Customerstype[]>([]);
  const [orders, setOrders] = useState<Orderstype[]>([]);
  const [paymentInput, setPaymentInput] = useState({
    payment: "",
    customer_id: "",
    date: new Date().toISOString(),
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!user) Router.push("/");

    if (user && !authorisation(user?.email as string)) {
      Router.push("/");
    }
  }, [user, Router]);

  const fetchOrders = async (customerId: string) => {
    try {
      const response = await fetch(`/api/orders/?id=${customerId}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/add_customer`);
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (id && customers.length > 0) {
      const foundCustomer = customers.find((cust) => cust._id === id) || null;
      setCustomer(foundCustomer);

      if (foundCustomer) {
        fetchOrders(foundCustomer._id);
        setPaymentInput((prev) => ({
          ...prev,
          customer_id: foundCustomer._id,
        }));
      }
    }
  }, [id, customers]);

  useEffect(() => {
    const fetchPayment = async (customerId: string) => {
      try {
        const response = await fetch(`/api/add_payment/?id=${customerId}`);
        const data = await response.json();
        setPaymentdata(data.payments);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    };
    if (id) fetchPayment(id);
  }, [id]);

  const handlePaymentSubmit = async () => {
    if (!paymentInput.payment) {
      setErrorMessage("Please enter a payment amount.");
      return;
    }
    setErrorMessage("");

    try {
      const res = await fetch("/api/add_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentInput }),
      });

      if (!res.ok) throw new Error("Failed to submit payment");

      // Handle success response
    } catch (error) {
      console.error("Error submitting payment:", error);
      setErrorMessage("Error submitting payment.");
    }

    const updated_balance =
      (customer?.balanceAmount ?? 0) - (Number(paymentInput?.payment) ?? 0);
    console.log(
      updated_balance,
      customer?.balanceAmount,
      Number(paymentInput?.payment)
    );
    try {
      const res = await fetch(`/api/add_payment?id=${customer?._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updated_balance }),
      });

      if (!res.ok) {
        throw new Error("Failed to update balance");
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  if (!customer) {
    return <div>No customer</div>;
  }

  return (
    <div className="overflow-y-scroll no-scrollbar">
      <div className="flex flex-col bg-gradient-radial from-slate-800 bg-black p-4 m-4 rounded text-white">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <p>{customer.name}</p>
            <p>{customer.creation_date}</p>
          </div>
          <p>Address: {customer.address || "No address provided"}</p>
          <p>{customer.contact || "+91 xxx xxx xxxx"}</p>
          <p className="mx-auto text-center bg-zinc-200 text-black p-2 rounded-xl font-bold">
            Balance: {customer.balanceAmount}
          </p>

          <div className="w-full">
            <Link href={`/Add_bill?id=${customer._id}`}>
              <p className="mx-auto text-center bg-zinc-800 p-2 rounded-xl hover:text-black hover:bg-zinc-200 cursor-pointer">
                Add-bill
              </p>
            </Link>

            <div className="flex gap-2">
              <input
                type="text"
                className="bg-zinc-800 mt-2 w-full p-2 rounded-xl"
                placeholder="Payment"
                value={paymentInput.payment}
                onChange={(e) =>
                  setPaymentInput((prev) => ({
                    ...prev,
                    payment: e.target.value,
                  }))
                }
              />
              <button
                className="p-2 bg-slate-100 text-zinc-800 rounded-xl mt-2"
                onClick={handlePaymentSubmit}
              >
                Submit
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>

      <div className="my-2">
        <h1 className="text-2xl text-white mx-auto text-center bg-black p-2">
          Payments
        </h1>
        <Calendar array={paymentdata as unknown  as Paymenttype[]} />
      </div>

      <h1 className="text-2xl text-white mx-auto text-center bg-black p-2">
        Previous Bills
      </h1>

      <div className="m-3">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((order) => (
              <BillCard
                key={order._id}
                date={new Date(order.date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                customerName={customer.name}
                quantity={Number(order.quantity)}
                unit={String(order.unit)}
                rate={Number(order.rate)}
                billamount={Number(order.total)}
                lastBalance={Number(order.last_balance)}
                amount={Number(order.amountReceived)}
                balanceAmount={Number(order.balanceAmount)}
              />
            ))
        ) : (
          <CommingSoon />
        )}
      </div>
    </div>
  );
};

export default function CustomerDetail() {
  return <CustomerComponent />;
}
