import Customers from "../../(models)/Customers";
import { NextResponse } from "next/server";

// POST request handler to create a new customer
export async function POST(req) {
  console.log("POST request received");
  try {
    // Parse the request body to get the form data
    const body = await req.json();
    const userdata = body.formdata;
    console.log(userdata)
    
    // Insert the new customer into the database
    await Customers.create(userdata);
    
    console.log("Customer creation successful");
    return NextResponse.json(
      { message: "Customer Added Successfully" },
      { status: 201 } // HTTP status for created
    );
  } catch (error) {
    console.error("Customer creation failed:", error);
    
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

// GET request handler to fetch all customers
export async function GET() {
  try {
    // Fetch all customers from the database
    const customers = await Customers.find()
    
    console.log("Customers fetched successfully");
    
    // Return the list of customers in JSON format
    return NextResponse.json(
      { customers }, // Wrap customers in an object
      { status: 200 } // HTTP status for OK
    );
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

