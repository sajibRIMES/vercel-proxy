// File: app/api/station-data-timely/[stationCode]/[startDate]/[endDate]/route.js
import { NextResponse } from "next/server";
import { getTransboundaryRiverDataTimely } from "@/utils/getStationData";

// Prevent prerendering during build time
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  // Extract parameters from URL slugs
  const { stationCode, startDate, endDate } = params;

  try {
    // Validate parameters (optional but recommended)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!stationCode || !dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: "Invalid parameters: stationCode, startDate, and endDate are required in format YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Call the function with the extracted parameters
    const data = await getTransboundaryRiverDataTimely(stationCode, startDate, endDate);

    // Return the data as a JSON response
    return NextResponse.json(data);
  } catch (error) {
    // Handle errors
    console.error("Error fetching transboundary river data:", error);
    return NextResponse.json(
      { error: "Failed to fetch transboundary river data" },
      { status: 500 }
    );
  }
}