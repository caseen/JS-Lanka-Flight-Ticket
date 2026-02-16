
export interface Passenger {
  name: string;
  title: string; // MR, MRS, MISS, MSTR
  type: string; // ADT, CHD, INF
  ticketNumber?: string; // Optional per-passenger ticket number
}

export interface FlightSegment {
  airlineName: string;
  airlineCode: string;
  flightNumber: string;
  airlineReference: string;
  departureAirportCode: string;
  departureCity: string;
  arrivalAirportCode: string;
  arrivalCity: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  departureTerminal: string;
  arrivalTerminal: string;
  cabinClass: string;
  baggage: string;
  duration: string;
  status: 'CONFIRMED' | 'UPCOMING' | 'COMPLETED';
}

export interface ItineraryData {
  agency: string;
  pnr: string;
  ticketNumber: string;
  issueDate: string;
  passengers: Passenger[];
  segments: FlightSegment[];
  status: string;
}

export const AGENCY_DETAILS = {
  name: "JS LANKA TRAVELS AND TOURS (PVT) LTD",
  tagline: "", // Tagline removed as requested
  addresses: [
    { label: "Colombo", value: "422, Janajaya City Complex, Rajagiriya" },
    { label: "Puttalam", value: "D37, Main Bus Stand Complex, Kurunegala Road, Puttalam" }
  ],
  phones: ["0773 678 688", "0774 578 688"],
  email: "jslankatours@gmail.com",
  website: "www.jslankatours.com", // Updated website address format
  footer: "" 
};

export const COLORS = {
  primary: "#0B3D91",
  secondary: "#EAF2FF",
  accent: "#FF7A00",
  text: "#1A1A1A"
};
