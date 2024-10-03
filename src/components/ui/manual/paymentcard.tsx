import React from "react";

export default function PaymentCard(props: {
  date:
    | string;

  amount:
    | number;
}) {
  return (
    <>
      <div
        className="bg-gradient-radial to-black from-slate-900
        text-white w-fit  text-sm p-3 flex gap-2 rounded-full"
      >
        <div className="flex flex-col">
          <p>date</p> <p>{props.date}</p>
        </div>

        <div className="flex flex-col text-right">
        <p>amount</p> <p> {props.amount}</p>
        </div>
      </div>
    </>
  );
}
