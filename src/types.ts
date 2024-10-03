
export interface Customerstype {
    _id: string;
    name: string;
    contact: string;
    address: string;
    state: string;
    balanceAmount: number;
    creation_date: String,
  }
  
  
  
  export interface Orderstype{
    _id: string;
    customer_id: String;
    date: Date,
    quantity: number;
    rate: number;
    amountReceived: number; 
    balanceAmount: number;
    category:  String;
    unit:  String;
    size: number;
    total: number;
    last_balance: number;
  }

  export interface Paymenttype{
    customer_id:String,
    date: Date,
    payment:number
  
  }