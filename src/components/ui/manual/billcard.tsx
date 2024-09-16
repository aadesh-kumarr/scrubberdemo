interface BillCardProps {
  date: string;
  customerName: string;
  quantity: number;
  unit: string;
  rate: number;
  billamount: number;
  lastBalance: number;
  amount: number; // Represents the amount paid
  balanceAmount: number;
}

export default function BillCard({
  date,
  customerName,
  quantity,
  unit,
  rate,
  billamount,
  lastBalance,
  amount, // Amount paid
}: BillCardProps) {
  return (
    <div className="flex flex-col bill-card bg-gradient-radial from-black bg-slate-800 text-white m-2 mx-1 rounded p-2 border border-slate-900">
      <div className="flex flex-row justify-between mb-4">
        <p>{date || "Date - dd/mm/yyyy"}</p>
        <p>{customerName || "Customer name"}</p>
      </div>

      <div className="flex mx-auto flex-row text-center w-1/2 p-4 rounded justify-center text-zinc-200">
        <div className="text-left pl-3">
          <p>Quantity: </p>
          <p>Rate: </p>
          <p>Bill Amount: </p>
          <p>Last Balance:</p>
        </div>
        <div className="">
          <p>{quantity} {unit}</p>
          <p>{rate}</p>
          <p>{billamount}</p>
          <p> {lastBalance}</p>
        </div>
      </div>
      <div className="ml-auto flex flex-col mt-4">
        <p className="">Total: {billamount+lastBalance}</p>
          <p>Amount paid:{amount} </p>
      </div>
      <hr />

      <p className="ml-auto">Balance: {billamount + lastBalance - amount }</p>
    </div>
  );
}
