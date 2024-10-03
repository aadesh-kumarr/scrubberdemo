import { Calendar } from "@/components/ui/calendar payments"
import React from "react"
const [date, setDate] = React.useState<Date | undefined>(new Date())

export default function PaymentCalender(){

    
    return (
        <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        />
    )
}
