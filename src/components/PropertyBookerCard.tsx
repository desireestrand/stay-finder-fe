"use client";

import { BookingDates } from "@/types/booking"
import type { Property } from "@/types/property"
import { useState } from "react"
import BookingPicker from "./BookingPicker"

type PropertyBookerCard = {
    property: Property
}

export default function PropertyBookerCard({}: PropertyBookerCard) {
    const [bookingDates, setBookingDates] = useState<BookingDates>()

    return (
        <div className= "block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
            <BookingPicker initialDates={bookingDates} selectDates={setBookingDates}/>
        </div>
    )
}