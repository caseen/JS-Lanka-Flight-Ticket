
import React from 'react';
import { ItineraryData, AGENCY_DETAILS, COLORS } from '../types';
import { Plane, Calendar, Clock, MapPin, Phone, Mail, Globe } from 'lucide-react';

interface ItineraryProps {
  data: ItineraryData;
}

const Itinerary: React.FC<ItineraryProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
      case 'UPCOMING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPassengerType = (type?: string) => {
    const t = type?.trim().toUpperCase();
    if (!t || t === '') return 'ADT';
    const validTypes = ['ADT', 'CHD', 'INF'];
    return validTypes.includes(t) ? t : 'ADT';
  };

  const formatTerminal = (terminal?: string) => {
    if (!terminal || terminal.trim() === '') return null;
    const t = terminal.trim();
    // If it already starts with "Terminal", don't add it again
    if (t.toUpperCase().startsWith('TERMINAL')) {
      return t;
    }
    return `Terminal ${t}`;
  };

  return (
    <div id="itinerary-document" className="a4-page flex flex-col overflow-hidden">
      {/* Header Section: All Details on Left, Logo/Tagline Removed */}
      <header className="p-8 border-b-2 border-[#0B3D91] flex flex-row justify-between items-start bg-gradient-to-r from-white to-[#EAF2FF]">
        {/* Left Side: Agency Name and Contact Details */}
        <div className="flex flex-col text-[10px] text-gray-600 gap-1.5 w-full">
          <div className="mb-2">
            <h1 className="text-xl font-poppins font-bold text-[#0B3D91] leading-none uppercase">{AGENCY_DETAILS.name}</h1>
          </div>
          
          <div className="grid grid-cols-1 gap-1">
            {AGENCY_DETAILS.addresses.map((addr, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <MapPin size={11} className="text-[#FF7A00] mt-0.5 shrink-0" /> 
                <span><span className="font-bold text-[#0B3D91]">{addr.label}:</span> {addr.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            <div className="flex items-center gap-2">
              <Phone size={11} className="text-[#FF7A00]" /> 
              <span className="font-medium text-[#1A1A1A]">{AGENCY_DETAILS.phones.join('   |   ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={11} className="text-[#FF7A00]" /> 
              <span className="font-medium text-[#1A1A1A]">{AGENCY_DETAILS.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={11} className="text-[#FF7A00]" /> 
              <span className="font-medium text-[#1A1A1A]">{AGENCY_DETAILS.website}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-poppins font-bold text-[#1A1A1A] mb-1 uppercase tracking-tight">CONFIRMED RESERVATION</h2>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Passenger Flight Information</p>
        </div>

        {/* Summary Card */}
        <section className="bg-[#EAF2FF] border border-[#0B3D91]/10 rounded-xl p-5 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Passenger Name(s)</span>
              <div className="flex flex-col gap-1.5">
                {data.passengers.map((p, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-x-2">
                    <span className="text-sm font-bold text-[#0B3D91] uppercase">
                      {p.title} {p.name} ({getPassengerType(p.type)})
                    </span>
                    {p.ticketNumber && (
                      <span className="text-[9px] font-medium text-gray-500 bg-white/60 border border-[#0B3D91]/10 px-1.5 py-0.5 rounded leading-none">
                        E-TICKET NO: {p.ticketNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Booking Ref (PNR)</span>
              <span className="text-base font-bold text-[#FF7A00] leading-tight">{data.pnr || 'N/A'}</span>
              {data.issueDate && (
                <div className="mt-2 flex flex-col">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Issued Date</span>
                  <span className="text-[10px] font-bold text-[#0B3D91] uppercase">{data.issueDate}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
              <span className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(data.status)}`}>
                {data.status || 'CONFIRMED'}
              </span>
            </div>
          </div>
        </section>

        {/* Flight Segments */}
        <div className="space-y-6">
          {data.segments.map((segment, idx) => (
            <div key={idx} className="flight-card border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#0B3D91] text-white px-5 py-2.5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Plane size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-medium opacity-80 uppercase tracking-tighter leading-none">Segment {idx + 1}</p>
                    <p className="font-bold text-sm tracking-wide">{segment.airlineName} | {segment.flightNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-medium opacity-80 uppercase tracking-tighter leading-none">Cabin Class</p>
                  <p className="font-bold text-sm">{segment.cabinClass || 'Economy'}</p>
                </div>
              </div>

              <div className="p-5 bg-white grid grid-cols-3 gap-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 border-t border-dashed border-gray-200 z-0"></div>
                
                <div className="flex flex-col items-start relative z-10 bg-white">
                  <div className="text-[9px] font-bold text-[#FF7A00] mb-0.5 uppercase">Departure</div>
                  <div className="text-2xl font-bold text-[#0B3D91] leading-none mb-1">{segment.departureAirportCode}</div>
                  <div className="text-xs font-medium text-gray-600 mb-2 truncate max-w-full uppercase">{segment.departureCity}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                    <Calendar size={12} className="text-gray-400" /> {segment.departureDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                    <Clock size={12} className="text-gray-400" /> {segment.departureTime}
                  </div>
                  {segment.departureTerminal && (
                    <div className="mt-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase">
                      {formatTerminal(segment.departureTerminal)}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center justify-center relative z-10 bg-white">
                  <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Duration</div>
                  <div className="px-2 py-0.5 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500 border border-gray-100">
                    {segment.duration || '--h --m'}
                  </div>
                  <Plane size={18} className="text-gray-200 mt-1" />
                </div>

                <div className="flex flex-col items-end relative z-10 bg-white">
                  <div className="text-[9px] font-bold text-[#FF7A00] mb-0.5 uppercase">Arrival</div>
                  <div className="text-2xl font-bold text-[#0B3D91] leading-none mb-1">{segment.arrivalAirportCode}</div>
                  <div className="text-xs font-medium text-gray-600 mb-2 truncate max-w-full uppercase">{segment.arrivalCity}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                    <Calendar size={12} className="text-gray-400" /> {segment.arrivalDate}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                    <Clock size={12} className="text-gray-400" /> {segment.arrivalTime}
                  </div>
                  {segment.arrivalTerminal && (
                    <div className="mt-1.5 px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase">
                      {formatTerminal(segment.arrivalTerminal)}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-row justify-between">
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Flight No</p>
                  <p className="text-xs font-bold text-gray-700">{segment.flightNumber}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Airline Ref</p>
                  <p className="text-xs font-bold text-[#FF7A00]">{segment.airlineReference || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Baggage</p>
                  <p className="text-xs font-bold text-gray-700">{segment.baggage || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Class</p>
                  <p className="text-xs font-bold text-gray-700">{segment.cabinClass || 'Economy'}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase text-right">Booking</p>
                  <p className="text-xs font-bold text-green-600 text-right">Confirmed</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="p-8 bg-[#f8fafc] border-t border-gray-100 no-print">
        <div className="grid grid-cols-3 gap-6 items-start">
          {/* Left Column: Contact */}
          <div className="space-y-1">
            <h4 className="font-poppins font-bold text-[#0B3D91] text-[9px] uppercase tracking-wide">Contact Details</h4>
            <div className="flex items-start gap-1.5 text-[9px] text-gray-500">
              <Phone size={10} className="text-[#FF7A00] mt-0.5 shrink-0" />
              <span>{AGENCY_DETAILS.phones.join('   |   ')}</span>
            </div>
            <div className="flex items-start gap-1.5 text-[9px] text-gray-500">
              <Mail size={10} className="text-[#FF7A00] mt-0.5 shrink-0" />
              <span className="break-all">{AGENCY_DETAILS.email}</span>
            </div>
          </div>

          {/* Middle Column: Addresses */}
          <div className="space-y-1">
            <h4 className="font-poppins font-bold text-[#0B3D91] text-[9px] uppercase tracking-wide">Office Addresses</h4>
            {AGENCY_DETAILS.addresses.map((addr, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[9px] text-gray-500 whitespace-nowrap">
                <MapPin size={10} className="text-[#FF7A00] mt-0.5 shrink-0" />
                <span><span className="font-bold">{addr.label}:</span> {addr.value}</span>
              </div>
            ))}
          </div>

          {/* Right Column: Website */}
          <div className="space-y-1 text-right">
            <h4 className="font-poppins font-bold text-[#0B3D91] text-[9px] uppercase tracking-wide">Website</h4>
            <div className="flex items-center justify-end gap-1.5 text-[9px] text-gray-500">
              <Globe size={10} className="text-[#FF7A00] shrink-0" />
              <span>{AGENCY_DETAILS.website}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Itinerary;
