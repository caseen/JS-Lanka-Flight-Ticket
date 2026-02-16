
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryData } from "../types";

export const extractItineraryData = async (base64Data: string, mimeType: string): Promise<ItineraryData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are a world-class AI travel document generator for JS LANKA TRAVELS AND TOURS (PVT) LTD.
    Analyze the uploaded e-ticket and extract flight information with 100% accuracy.
    Organize the data into the specified JSON format.
    
    Agency Name: JS LANKA TRAVELS AND TOURS (PVT) LTD
    
    Extraction Requirements:
    - Date Format: ALL DATES (issueDate, departureDate, arrivalDate) MUST be formatted as: DAY, DD MMM YYYY (e.g., SUN, 18 FEB 2026). Ensure the day and month are in uppercase.
    - Multiple Passengers: Extract Name, Title (MR/MRS/etc), Type (MUST BE ONE OF: ADT, CHD, INF), and their specific Ticket Number.
    - Passenger Type Logic: Identify if the passenger is an Adult (ADT), Child (CHD), or Infant (INF). This is usually written next to the name or in a "Type" column.
    - Ticket Info: PNR, Main Ticket Number, Issue Date.
    - Flight Segments: Airline, Flight Number, Airline Reference, Departure/Arrival Airport Codes and Cities, Dates, Times, Terminals, Cabin Class, Baggage, Duration.
    
    IMPORTANT: Look closely for (ADT), (CHD), or (INF) tags. Map them correctly to the "type" field. 
    Ensure titles (MR, MRS, MISS, MSTR) are separated from the names.
    If any field is missing, leave it as an empty string. Sort segments chronologically.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data.split(',')[1] || base64Data, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          agency: { type: Type.STRING },
          pnr: { type: Type.STRING },
          ticketNumber: { type: Type.STRING },
          issueDate: { type: Type.STRING },
          passengers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                ticketNumber: { type: Type.STRING }
              }
            }
          },
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                airlineName: { type: Type.STRING },
                flightNumber: { type: Type.STRING },
                airlineReference: { type: Type.STRING },
                departureAirportCode: { type: Type.STRING },
                departureCity: { type: Type.STRING },
                arrivalAirportCode: { type: Type.STRING },
                arrivalCity: { type: Type.STRING },
                departureDate: { type: Type.STRING },
                departureTime: { type: Type.STRING },
                arrivalDate: { type: Type.STRING },
                arrivalTime: { type: Type.STRING },
                departureTerminal: { type: Type.STRING },
                arrivalTerminal: { type: Type.STRING },
                cabinClass: { type: Type.STRING },
                baggage: { type: Type.STRING },
                duration: { type: Type.STRING },
                status: { type: Type.STRING, description: "CONFIRMED, UPCOMING, or COMPLETED" }
              }
            }
          },
          status: { type: Type.STRING }
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as ItineraryData;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Could not extract data from the document.");
  }
};
