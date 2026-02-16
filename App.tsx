
import React, { useState, useRef } from 'react';
import { extractItineraryData } from './services/geminiService';
import { ItineraryData } from './types';
import Itinerary from './components/Itinerary';
import Editor from './components/Editor';
// Added AlertCircle to the imports
import { Upload, Download, FileText, Code, Share2, Loader2, Sparkles, CheckCircle, ArrowRight, Plane, Home, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ItineraryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'itinerary' | 'editor'>('itinerary');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      try {
        const extracted = await extractItineraryData(base64, file.type);
        setData(extracted);
        setView('itinerary');
      } catch (err: any) {
        console.error("Extraction Error details:", err);
        // Provide more context if it looks like an API key issue
        if (err.message?.includes('API_KEY') || err.status === 401 || err.status === 403) {
          setError("API Configuration Error: Please check your Netlify environment variables (API_KEY).");
        } else {
          setError("Failed to extract data. Please ensure the file is a clear airline e-ticket and the API key is valid.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const goHome = () => {
    setData(null);
    setError(null);
    setView('itinerary');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JS-Lanka-Itinerary-${data.pnr || 'UNNAMED'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadHtml = () => {
    const element = document.getElementById('itinerary-document');
    if (!element) return;
    
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');
    const tailwind = `<script src="https://cdn.tailwindcss.com"></script>`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>JS Lanka Travels Itinerary - ${data?.pnr}</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          ${tailwind}
          <style>${styles}</style>
        </head>
        <body class="bg-gray-100 p-8">
          ${element.outerHTML}
        </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JS-Lanka-Itinerary-${data?.pnr || 'UNNAMED'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-[#0B3D91] text-white py-4 px-6 sticky top-0 z-50 shadow-lg no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
            <div className="bg-white p-1.5 rounded-lg">
              <Sparkles className="text-[#0B3D91]" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-bold text-lg leading-tight">JS LANKA TRAVELS</span>
              <span className="text-[10px] text-white/70 tracking-widest uppercase">Luxury AI Itinerary</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {data && (
              <>
                <div className="flex bg-white/10 rounded-lg p-1">
                  <button 
                    onClick={() => setView('itinerary')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'itinerary' ? 'bg-[#FF7A00] text-white shadow-md' : 'text-white/70 hover:text-white'}`}
                  >
                    View
                  </button>
                  <button 
                    onClick={() => setView('editor')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'editor' ? 'bg-[#FF7A00] text-white shadow-md' : 'text-white/70 hover:text-white'}`}
                  >
                    Edit
                  </button>
                </div>
                <div className="h-6 w-px bg-white/20"></div>
                <button 
                  onClick={goHome}
                  className="flex items-center gap-2 text-xs font-bold hover:text-[#FF7A00] transition-colors"
                >
                  <Home size={16} /> New Upload
                </button>
              </>
            )}
          </div>

          {!data && !isLoading && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#FF7A00] hover:bg-[#e66e00] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Upload size={18} /> Upload Ticket
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="application/pdf,image/*" 
          onChange={handleFileUpload} 
        />

        {!data && !isLoading && (
          <div className="max-w-4xl mx-auto mt-12 text-center animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#EAF2FF] rounded-full blur-3xl opacity-50"></div>
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FF7A00]/10 rounded-full blur-3xl opacity-50"></div>

               <div className="relative z-10">
                <div className="w-24 h-24 bg-[#EAF2FF] rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-12 group-hover:rotate-0 transition-transform">
                  <FileText className="text-[#0B3D91]" size={48} />
                </div>
                <h1 className="text-4xl md:text-5xl font-poppins font-bold text-[#0B3D91] mb-6">
                  Transform Tickets into <span className="text-[#FF7A00]">Luxury Itineraries</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                  Our AI engine extracts complex flight details from your e-ticket PDFs and generates a premium, agency-branded travel document for your clients in seconds.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full md:w-auto bg-[#0B3D91] hover:bg-[#082d6b] text-white px-8 py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-3 transition-all"
                  >
                    <Upload size={20} /> Select Ticket PDF
                  </button>
                  <div className="text-gray-400 font-medium px-4">or</div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B3D91]">
                      <CheckCircle size={16} className="text-[#FF7A00]" /> 100% Accuracy
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B3D91]">
                      <CheckCircle size={16} className="text-[#FF7A00]" /> Branding Applied
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium animate-pulse">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  </div>
                )}
               </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Upload', desc: 'Securely upload your airline e-ticket PDF or image.', icon: Upload },
                { title: 'Analyze', desc: 'AI extracts flight numbers, PNR, baggage and class info.', icon: Sparkles },
                { title: 'Export', desc: 'Generate luxury HTML, PDF, or JSON documents.', icon: ArrowRight }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center p-6">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-[#FF7A00]">
                    <step.icon size={24} />
                  </div>
                  <h4 className="font-poppins font-bold text-[#0B3D91] mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-[#0B3D91]/95 z-[100] flex flex-col items-center justify-center text-white p-6">
            <div className="relative">
              <Loader2 className="animate-spin text-[#FF7A00]" size={64} />
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <Plane size={24} />
              </div>
            </div>
            <h2 className="text-3xl font-poppins font-bold mt-8 mb-2">Analyzing Flight Details</h2>
            <p className="text-white/60 font-medium">Extracting passenger information and segment data...</p>
            <div className="mt-12 flex gap-2">
              <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce"></span>
            </div>
          </div>
        )}

        {data && !isLoading && (
          <div className="animate-fadeIn">
            {/* Control Bar for Desktop */}
            <div className="no-print max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                 <button 
                   onClick={goHome}
                   className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
                   title="Back to Home"
                 >
                   <Home size={20} />
                 </button>
                 <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                   <h2 className="text-xl font-poppins font-bold text-[#0B3D91]">
                     {view === 'itinerary' ? 'Luxury Preview' : 'Edit Itinerary'}
                   </h2>
                   {data.pnr && <span className="px-2 py-0.5 bg-[#EAF2FF] text-[#0B3D91] rounded text-[10px] font-bold uppercase">PNR: {data.pnr}</span>}
                 </div>
               </div>

               <div className="flex flex-wrap gap-3">
                 <button 
                  onClick={handlePrint} 
                  className="bg-[#0B3D91] hover:bg-[#082d6b] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                 >
                   <Download size={16} /> Save as PDF
                 </button>
                 <button 
                  onClick={downloadHtml} 
                  className="bg-white hover:bg-gray-50 text-[#0B3D91] border border-[#0B3D91]/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                 >
                   <Code size={16} /> HTML
                 </button>
                 <button 
                  onClick={downloadJson} 
                  className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                 >
                   <FileText size={16} /> JSON
                 </button>
               </div>
            </div>

            {view === 'itinerary' ? (
              <Itinerary data={data} />
            ) : (
              <div className="max-w-4xl mx-auto">
                <Editor data={data} onChange={setData} />
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setView('itinerary')}
                    className="bg-[#FF7A00] hover:bg-[#e66e00] text-white px-10 py-3 rounded-xl font-bold shadow-xl transition-all flex items-center gap-2"
                  >
                    View Updated Itinerary <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Sticky Mobile Actions */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50 flex gap-2 no-print">
               <button 
                 onClick={goHome}
                 className="bg-white text-[#0B3D91] px-4 py-3 rounded-full font-bold shadow-2xl border border-gray-100"
               >
                 <Home size={18} />
               </button>
               <button 
                 onClick={handlePrint}
                 className="bg-[#0B3D91] text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
               >
                 <Download size={18} /> PDF
               </button>
               <button 
                 onClick={() => setView(view === 'itinerary' ? 'editor' : 'itinerary')}
                 className="bg-[#FF7A00] text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
               >
                 {view === 'itinerary' ? 'Edit' : 'View'}
               </button>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-gray-100 bg-white no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">© {new Date().getFullYear()} JS Lanka Travels and Tours (Pvt) Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-[#0B3D91] font-bold">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-[#0B3D91] font-bold">Terms of Service</a>
            <a href="#" className="text-xs text-gray-400 hover:text-[#0B3D91] font-bold">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
