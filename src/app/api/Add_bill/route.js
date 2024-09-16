import { NextResponse } from "next/server"; // Ensure NextResponse is imported
import Customers from"../../(models)/Customers"
import { Orders } from "../../(models)/Customers";


export async function POST(req){
    console.log("post request received")
    try{
        const body =await req.json();
        const orderdata =body.formdata;
        console.log(orderdata)

        await Orders.create(orderdata);
        console.log("order submitted");
        return NextResponse.json(
            {message: "Order submitted successfully"},
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




export async function GET(request) {
  try {
    // Get URL and extract query parameters
    const url = new URL(request.url);
    const _id = url.searchParams.get('_id'); // Extract _id from query params

    if (_id) {
      // Fetch specific customer by _id
      const customer = await Customers.findById(_id);

      if (!customer) {
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 } // HTTP status for not found
        );
      }

      // Return the single customer
      return NextResponse.json(
        { customer }, // Wrap customer in an object
        { status: 200 } // HTTP status for OK
      );
    } else {
      // Fetch all customers if no _id is provided
      const customers = await Customers.find();

      // Return all customers
      return NextResponse.json(
        { customers }, // Wrap customers in an object
        { status: 200 } // HTTP status for OK
      );
    }
  } catch (error) {
    console.error("Error fetching customers:", error);

    // Return an error response with error details
    return NextResponse.json(
      {
        message: "Error Occurred",
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
    const { lastBalance } = body;
    
    if (typeof lastBalance === 'undefined') {
      return NextResponse.json({ message: "lastBalance is required" }, { status: 400 });
    }
    
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
