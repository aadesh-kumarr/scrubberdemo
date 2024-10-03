
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
    quantity: Number;
    rate: Number;
    amountReceived: Number; 
    balanceAmount: number;
    category:  String;
    unit:  String;
    size: Number;
    total: Number;
    last_balance: Number;
  }

  export interface Paymenttype{
    customer_id:String,
    date: Date,
    payment:Number
  
  }