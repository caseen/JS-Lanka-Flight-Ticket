
import React from 'react';
import { ItineraryData, Passenger, FlightSegment } from '../types';
import { Trash2, Plus, User, Plane, AlertCircle, Hash } from 'lucide-react';

interface EditorProps {
  data: ItineraryData;
  onChange: (newData: ItineraryData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const handleGeneralChange = (field: keyof ItineraryData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updatePassenger = (idx: number, field: keyof Passenger, value: string) => {
    const newPassengers = [...data.passengers];
    newPassengers[idx] = { ...newPassengers[idx], [field]: value };
    onChange({ ...data, passengers: newPassengers });
  };

  const addPassenger = () => {
    onChange({
      ...data,
      passengers: [...data.passengers, { name: '', title: 'MR', type: 'ADT', ticketNumber: '' }]
    });
  };

  const removePassenger = (idx: number) => {
    onChange({
      ...data,
      passengers: data.passengers.filter((_, i) => i !== idx)
    });
  };

  const updateSegment = (idx: number, field: keyof FlightSegment, value: string) => {
    const newSegments = [...data.segments];
    newSegments[idx] = { ...newSegments[idx], [field]: value };
    onChange({ ...data, segments: newSegments });
  };

  const addSegment = () => {
    onChange({
      ...data,
      segments: [...data.segments, {
        airlineName: '', airlineCode: '', flightNumber: '', airlineReference: '',
        departureAirportCode: '', departureCity: '',
        arrivalAirportCode: '', arrivalCity: '',
        departureDate: '', departureTime: '',
        arrivalDate: '', arrivalTime: '',
        departureTerminal: '', arrivalTerminal: '', cabinClass: 'Economy', baggage: '',
        duration: '', status: 'CONFIRMED'
      }]
    });
  };

  const removeSegment = (idx: number) => {
    onChange({
      ...data,
      segments: data.segments.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-8 border border-gray-200">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
        <AlertCircle className="text-[#FF7A00]" size={20} />
        <h3 className="text-xl font-poppins font-bold text-[#0B3D91]">Edit Itinerary Details</h3>
      </div>

      {/* Booking Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PNR / Reference</label>
          <input 
            type="text" 
            value={data.pnr} 
            onChange={(e) => handleGeneralChange('pnr', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-lg p-2 focus:border-[#0B3D91] focus:ring-0 transition-colors font-bold text-[#0B3D91]"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">General Ticket No</label>
          <input 
            type="text" 
            value={data.ticketNumber} 
            onChange={(e) => handleGeneralChange('ticketNumber', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-lg p-2 focus:border-[#0B3D91] outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Issue Date</label>
          <input 
            type="text" 
            value={data.issueDate} 
            onChange={(e) => handleGeneralChange('issueDate', e.target.value)}
            className="w-full border-2 border-gray-100 rounded-lg p-2 focus:border-[#0B3D91] outline-none"
          />
        </div>
      </div>

      {/* Passengers */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[#0B3D91]" />
            <h4 className="font-poppins font-bold text-[#0B3D91]">Passengers</h4>
          </div>
          <button onClick={addPassenger} className="flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:text-[#0B3D91] transition-colors">
            <Plus size={14} /> Add Passenger
          </button>
        </div>
        <div className="space-y-3">
          {data.passengers.map((p, idx) => (
            <div key={idx} className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex gap-3 items-center">
                <input 
                  placeholder="Title"
                  className="w-16 border border-gray-200 rounded p-1.5 text-xs font-bold uppercase"
                  value={p.title}
                  onChange={(e) => updatePassenger(idx, 'title', e.target.value)}
                />
                <input 
                  placeholder="Full Name"
                  className="flex-1 border border-gray-200 rounded p-1.5 text-xs font-bold"
                  value={p.name}
                  onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                />
                <select 
                  className="w-24 border border-gray-200 rounded p-1.5 text-xs font-bold"
                  value={p.type}
                  onChange={(e) => updatePassenger(idx, 'type', e.target.value)}
                >
                  <option value="ADT">Adult</option>
                  <option value="CHD">Child</option>
                  <option value="INF">Infant</option>
                </select>
                <button onClick={() => removePassenger(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <Hash size={14} className="text-gray-400" />
                <input 
                  placeholder="Individual Ticket Number"
                  className="flex-1 border border-gray-200 rounded p-1 text-[10px] font-medium"
                  value={p.ticketNumber || ''}
                  onChange={(e) => updatePassenger(idx, 'ticketNumber', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segments */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane size={18} className="text-[#0B3D91]" />
            <h4 className="font-poppins font-bold text-[#0B3D91]">Flight Segments</h4>
          </div>
          <button onClick={addSegment} className="flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:text-[#0B3D91] transition-colors">
            <Plus size={14} /> Add Segment
          </button>
        </div>
        <div className="space-y-6">
          {data.segments.map((s, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Segment {idx + 1}</span>
                <button onClick={() => removeSegment(idx)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Airline</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.airlineName} onChange={(e) => updateSegment(idx, 'airlineName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Flight #</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.flightNumber} onChange={(e) => updateSegment(idx, 'flightNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Airline Ref</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.airlineReference} onChange={(e) => updateSegment(idx, 'airlineReference', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Dep Airport</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.departureAirportCode} onChange={(e) => updateSegment(idx, 'departureAirportCode', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Arr Airport</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.arrivalAirportCode} onChange={(e) => updateSegment(idx, 'arrivalAirportCode', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Dep Date</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.departureDate} onChange={(e) => updateSegment(idx, 'departureDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Dep Time</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.departureTime} onChange={(e) => updateSegment(idx, 'departureTime', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Arr Date</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.arrivalDate} onChange={(e) => updateSegment(idx, 'arrivalDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Arr Time</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.arrivalTime} onChange={(e) => updateSegment(idx, 'arrivalTime', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Dep Terminal</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.departureTerminal} onChange={(e) => updateSegment(idx, 'departureTerminal', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Arr Terminal</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.arrivalTerminal} onChange={(e) => updateSegment(idx, 'arrivalTerminal', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Baggage</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.baggage} onChange={(e) => updateSegment(idx, 'baggage', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Class</label>
                  <input className="w-full border border-gray-200 rounded p-1.5 text-xs font-medium" value={s.cabinClass} onChange={(e) => updateSegment(idx, 'cabinClass', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
