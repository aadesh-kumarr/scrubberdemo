"use client";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdArrowDropDown } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import type { Customerstype, Orderstype } from "@/types";
import { Orders } from "../(models)/Customers";

interface Props {
  customers: Customerstype[];
  Orders: Orderstype[];
}

function Add_bill() {
  const Router = useRouter();
  const [dropDown, setDropDown] = useState(""); // unit dropdown
  const [categoryDropDown, setCategoryDropDown] = useState(""); // category dropdown (CHANGE)
  const [sizeDropDown, setSizeDropDown] = useState(""); // size dropdown (CHANGE)
  const [totalAmount, setTotalAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rate, setRate] = useState(1);
  const [customerlastbalance, handlecustomerlastbalance] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0); // track amount received (CHANGE)
  const [formError, setFormError] = useState("");
  const [customer, setCustomer] = useState<Customerstype | null>(null);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/Add_bill?_id=${id}`);
        const data = await response.json();
  
        setCustomer(data.customer);
  
        // Update formdata with the correct last_balance from the fetched customer data
        if (data.customer) {
          setFormdata((prev) => ({
            ...prev,
            last_balance: data.customer.balanceAmount, // Set the correct last_balance here
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const initdata = {
    customer_id: id,
    date: Date(),
    quantity: 1,
    rate: 1,
    amountReceived: 0, // amount received while taking this order
    balanceAmount: 0, // balance of this order
    category: "", // ss or gi
    unit: "", // pack or carton
    size: 0, // 6 or 12
    total: 0, // order total


    last_balance: customerlastbalance,// balance of customer at that time 
    
    // not working
    
  };

  const [formdata, setFormdata] = useState(initdata);
  const customerBalance = customer?.balanceAmount || 0;

  const handleBalanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const received = parseFloat(event.target.value);
    const newBalance = totalAmount - received; // Calculate balance for the current order
    setAmountReceived(received);
  
    // Correcting the balance update to include the previous customer balance:
    const updatedBalance = newBalance + customerBalance; // Total balance with previous customer's balance
    
    setBalanceAmount(newBalance); // Setting balance for this specific order
    setFormdata((prev) => ({
      ...prev,
      amountReceived: received,
      balanceAmount: updatedBalance, // Update form data with the correct total balance
    }));
  };

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rt = parseFloat(event.target.value);
    const newTotal = quantity * rt;
    setRate(rt);
    setTotalAmount(newTotal); // Update total amount
    setFormdata((prev) => ({
      ...prev,
      rate: rt,
      total: newTotal, // Set order total
    }));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const qty = parseFloat(event.target.value);
    const newTotal = qty * rate;
    setQuantity(qty);
    setTotalAmount(newTotal); // Update total amount
    setFormdata((prev) => ({
      ...prev,
      quantity: qty,
      total: newTotal, // Set order total
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dropDown) {
      setFormError("Please select a unit.");
      return;
    }

    if (!categoryDropDown) {
      setFormError("Please select a category.");
      return;
    }

    if (!sizeDropDown) {
      setFormError("Please select a size.");
      return;
    }


    try {
      handlecustomerlastbalance(customerBalance); // Update state with the new last balance
      const res = await fetch("/api/Add_bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formdata: {
            ...formdata,
            // Include updated last balance
          },
        }),
      });

      if (!res.ok) {
        throw new Error(res.statusText + " error");
      } 
      



    // Update customer balance if customer is not null
    if (customer) {
      const customerUpdateRes = await fetch(`/api/Add_bill/?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _Id: customer._id, // assuming you have `id` as the customer ID
          lastBalance: totalBalance
        }),
      });

      if (!customerUpdateRes.ok) {
        throw new Error(customerUpdateRes.statusText + " error");
      }
      Router.refresh();
      Router.push(`/customer_detail?id=${id}`);
    }

      else {
        setFormdata(initdata);

      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // Total balance calculation: includes customer balance + this order's balance
  const totalBalance = balanceAmount + customerBalance;

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-radial from-black to-slate-800 border border-slate-950 p-5 my-4 rounded text-white w-4/5 flex flex-col gap-2"
      >
        <div className="mb-2">
          <div className="flex justify-between">
            <p>Name: {customer?.name || "Unknown"}</p>
            <p>Old balance: {customerBalance}</p>
          </div>
          <p>Contact: {customer?.contact || "+91 xxxxxx xxx"}</p>
          <div className="w-full bg-zinc-900 min-h-20 mt-2"></div>
        </div>
        <hr className="bg-white mb-2" />

        <div className="flex gap-1">
          <Input
            type="number"
            placeholder="Enter quantity"
            name="quantity"
            required={true}
            onChange={handleQuantityChange}
          />
        </div>
        <div className="flex text-sm justify-between gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-44 flex align-center items-center border rounded gap-1 px-1">
              {dropDown || "Select unit"}
              <MdArrowDropDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select unit</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["Carton", "Pack"].map((unitOption) => (
                <DropdownMenuItem
                  key={unitOption}
                  onClick={() => {
                    setDropDown(unitOption);
                    setFormdata((prev) => ({ ...prev, unit: unitOption }));
                    setFormError("");
                  }}
                >
                  {unitOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-44 flex align-center items-center border rounded gap-1 px-1">
              {categoryDropDown || "Select category"}
              <MdArrowDropDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["SS", "GI"].map((categoryOption) => (
                <DropdownMenuItem
                  key={categoryOption}
                  onClick={() => {
                    setCategoryDropDown(categoryOption);
                    setFormdata((prev) => ({
                      ...prev,
                      category: categoryOption,
                    }));
                    setFormError("");
                  }}
                >
                  {categoryOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="w-44 flex align-center items-center border rounded gap-1 px-1">
              {sizeDropDown || "Select size"}
              <MdArrowDropDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select size</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[ "6", "12"].map((sizeOption) => (
                <DropdownMenuItem
                  key={sizeOption}
                  onClick={() => {
                    setSizeDropDown(sizeOption);
                    setFormdata((prev) => ({
                      ...prev,
                      size: parseInt(sizeOption),
                    }));
                    setFormError("");
                  }}
                >
                  {sizeOption}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {formError && <p style={{ color: "red" }}>{formError}</p>}
        </div>

        <Input
          type="number"
          placeholder="Rate per unit"
          name="rate"
          onChange={handleRateChange}
          required={true}
        />

        <label className="flex justify-center">
          Total amount: {totalAmount}
        </label>

        <Input
          type="number"
          placeholder="Amount received"
          name="amountReceived"
          onChange={handleBalanceChange}
          required={true}
        />

        <label className="flex justify-center">
          Balance amount: {balanceAmount}
        </label>

        <label className="flex justify-center">
          Total balance: {totalBalance}
        </label>

        <button
          type="submit"
          className="bg-zinc-200 text-zinc-950 text-center p-2 rounded font-bold hover:bg-zinc-800 hover:text-white"
        >
          Create Bill
        </button>
      </form>
    </div>
  );
}

export default Add_bill;
