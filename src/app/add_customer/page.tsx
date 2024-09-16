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
import authorisation from "@/lib/authorization";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Home() {
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

  const [cursor, setCursor] = useState(false);
  const [name, setName] = useState("");
  const [dropDown, setDropDown] = useState("");
  const [state, setState] = useState("Select state");
  const [formError, setFormError] = useState("");

  const initdata = {
    name: "",
    contact: "",
    state: "",
    address: "",
    balanceAmount: 0,
    creation_date: Date() ,
  };

  const [formdata, setFormdata] = useState(initdata);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formdata)
    // Continue with form submission logic
    try {
      const res = await fetch("/api/add_customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formdata }), // No need to wrap formdata in another object
      
      });        

      if (!res.ok) {
        throw new Error(res.statusText + " error");
      } else {

        setFormdata(initdata);
        Router.refresh();
      }

    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleCursor = () => {
    setCursor(!cursor);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    handleChange(event);
  };

  return (
    <div className="flex justify-between flex-col items-center">
      <div className="text-white">
        The Customer name is {name}.
        <span
          className={`w-1 h-4 border-white border-2 text-white animation ${
            cursor ? "" : "hidden"
          }`}
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-conic border border-slate-950 from-slate-800 to-black p-5 mx-3 my-4 rounded text-white w-4/5 flex flex-col gap-2"
      >
        <Input
          type="text"
          placeholder="Customer name"
          name="name"
          value={formdata.name}
          onChange={handleNameChange}
          onFocus={handleCursor}
          onBlur={handleCursor}
          required
        />
        <Input
          type="text"
          placeholder="Contact number"
          name="contact"
          value={formdata.contact}
          onChange={handleChange}
          required
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex align-center items-center border rounded gap-1 pl-3 p-1">
            {state}
            <MdArrowDropDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="overflow-scroll h-40">
              <DropdownMenuLabel>Select state</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chhattisgarh",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jammu and Kashmir",
                "Goa",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttarakhand",
                "Uttar Pradesh",
                "West Bengal",
                "Andaman and Nicobar Islands",
                "Chandigarh",
                "Dadra and Nagar Haveli",
                "Daman and Diu",
                "Delhi",
                "Lakshadweep",
                "Puducherry",
              ].map((stateOption) => (
                <DropdownMenuItem
                  key={stateOption}
                  onClick={() => {
                    setState(stateOption);
                    setFormdata((prev) => ({ ...prev, state: stateOption }));
                  }}
                >
                  {stateOption}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Input
          type="text"
          placeholder="Enter address"
          name="address"
          value={formdata.address}
          onChange={handleChange}
          required={true}
        />
       
        <Button
          type="submit"
          variant={"outline"}
          className="text-zinc-800 hover:text-black"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
