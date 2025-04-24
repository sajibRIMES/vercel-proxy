import { NextResponse } from "next/server";
import {getStationData} from "@/utils/getStationData";

// Add this export to prevent prerendering during build time
export const dynamic = 'force-dynamic';

export async function GET(request, context) {
    // Extract station code from the context params
    const { params } = context;
    const { stationCode } = params;

    // Call the function to get station data with the provided station code
    const data = await getStationData(stationCode);

    // Send the data as a JSON response
    return NextResponse.json(data);
}