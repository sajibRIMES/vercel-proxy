// // File: app/api/trans-river-data-timely/route.js
// import { NextResponse } from "next/server";
// import { getTransboundaryRiverDataTimely } from "@/utils/getStationData";

// // Prevent prerendering during build time
// export const dynamic = 'force-dynamic';

// export async function GET(request) {
//   // Extract query parameters from the URL
//   const { searchParams } = new URL(request.url);
//   const stationCode = searchParams.get("stationCode");
//   const startDate = searchParams.get("startDate");
//   const endDate = searchParams.get("endDate");

//   // Validate parameters
//   if (!stationCode || !startDate || !endDate) {
//     return NextResponse.json(
//       { error: "Missing required parameters: stationCode, startDate, endDate" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Call the function with the extracted parameters
//     const data = await getTransboundaryRiverDataTimely(stationCode, startDate, endDate);

//     // Return the data as a JSON response
//     return NextResponse.json(data);
//   } catch (error) {
//     // Handle errors
//     console.error("Error fetching transboundary river data:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch transboundary river data" },
//       { status: 500 }
//     );
//   }
// }


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