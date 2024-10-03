import { NextResponse } from "next/server";
import { Orders } from "../../(models)/Customers";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); // Use 'id' here to match the query param in your URL
    if (!id) {
      return NextResponse.json(
        { message: "No id provided" },
        { status: 400 } // Bad Request
      );
    }

    // Fetch orders by id (assuming id represents customer_id)
    const orders = await Orders.find({ customer_id: id }); // Assuming you're storing orders by customer_id

    if (!orders.length) {
      return NextResponse.json(
        { message: "No orders found for this customer" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { orders }, // Return the orders
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);

    // Return an error response with error details
    return NextResponse.json(
      {
        message: "Error Occurred",
        error: error.message,
      },
      { status: 500 } // Internal Server Error
    );
  }
}
