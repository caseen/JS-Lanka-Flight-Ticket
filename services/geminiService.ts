
import { GoogleGenAI, Type } from "@google/genai";
import { ItineraryData } from "../types";

export const extractItineraryData = async (base64Data: string, mimeType: string): Promise<ItineraryData> => {
  // Always initialize fresh to pick up the latest environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Extract flight information from this airline e-ticket for JS LANKA TRAVELS AND TOURS (PVT) LTD.
    Return ONLY a valid JSON object matching the requested schema.
    
    CRITICAL FORMATTING RULES:
    1. Dates: ALL dates (issueDate, departureDate, arrivalDate) MUST be "DAY, DD MMM YYYY" (e.g., WED, 18 FEB 2026).
    2. Passenger Types: Map to ADT, CHD, or INF.
    3. Passengers: Separate Title (MR/MRS/etc) from Name.
    4. Completeness: Extract PNR, Ticket Numbers, and all flight segments.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { 
            inlineData: { 
              data: base64Data.includes(',') ? base64Data.split(',')[1] : base64Data, 
              mimeType 
            } 
          },
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
                },
                required: ["name", "title"]
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
                  status: { type: Type.STRING }
                }
              }
            },
            status: { type: Type.STRING }
          },
          required: ["passengers", "segments"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model.");
    }

    try {
      return JSON.parse(text) as ItineraryData;
    } catch (parseError) {
      console.error("JSON Parsing failed. Raw text:", text);
      throw new Error("Failed to parse itinerary data.");
    }
  } catch (apiError: any) {
    console.error("Gemini API Error:", apiError);
    throw apiError;
  }
};
