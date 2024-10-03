import { NextResponse } from "next/server"; // Ensure NextResponse is imported
import Customers from"../../(models)/Customers"
import { Orders,Payment } from "../../(models)/Customers";


export async function POST(req){
    console.log("post request received")
    try{
        const body =await req.json();
        const paymentData =body.paymentInput;

        await Payment.create(paymentData);
        console.log("Payment submitted");
        return NextResponse.json(
            {message: "Payment submitted successfully"},
            {status:201}
        );
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {message: "Error submitting order"},
            {status:500}
            );
            }

}





export async function GET(req) {
  try {
    // Get URL and extract query parameters
    const url = new URL(req.url);
    const customer_id = url.searchParams.get('id'); // Extract customer_id from query params
    console.log(customer_id)
    if (customer_id) {
      // Fetch all payments associated with the specific customer_id
      const payments = await Payment.find({customer_id}); // Query all payments by customer_id
      if (payments.length === 0) {
        return NextResponse.json(
          { message: "No payments found for this customer" },
          { status: 404 } // HTTP status for not found
        );
      }

      // Return all payments associated with the customer_id
      return NextResponse.json(
        { payments }, // Wrap payments in an object
        { status: 200 } // HTTP status for OK
      );
    } else {
      return NextResponse.json(
        { message: "customer_id is required" },
        { status: 400 } // HTTP status for bad request
      );
    }
  } catch (error) {
    console.error("Error fetching payments:", error);

    // Return an error response with error details
    return NextResponse.json(
      {
        message: "Error occurred",
        error: error.message, // Include the specific error message
      },
      { status: 500 } // HTTP status for internal server error
    );
  }
}





export async function PATCH(req) {
  try {
    console.log("PATCH request received");

    // Parse the URL to get the _id parameter
    const url = new URL(req.url);
    const _id = url.searchParams.get('id');
    console.log(_id)
    
    if (!_id) {
      return NextResponse.json({ message: "Customer ID is missing" }, { status: 400 });
    }
    
    // Parse the body to get the lastBalance
    const body = await req.json();
    const lastBalance = body.updated_balance;
    console.log(lastBalance)
    

    
    // Fetch the existing customer data to update
    const customer = await Customers.findById(_id);
    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }
    
    // Update the customer with the new last balance
    customer.balanceAmount = lastBalance;
    
    // Save the updated customer data
    const updatedCustomer = await customer.save();
    console.log(customer)

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ message: "Error Occurred" }, { status: 500 });
  }
}
