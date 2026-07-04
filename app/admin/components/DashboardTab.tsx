import { Database } from "lucide-react";

export default function DashboardTab({ 
  status, 
  isStatusError, 
  data 
}: { 
  status: string, 
  isStatusError: boolean, 
  data: any[] 
}) {
  return (
    <div className="max-w-5xl">
      <h1 className="text-[23px] font-normal text-[#1d2327] mb-4">Dashboard</h1>

      <div className="bg-white border border-[#c3c4c7] shadow-sm mb-6">
        <div className="px-4 py-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
          <h2 className="font-semibold text-[14px] text-[#1d2327] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#8c8f94]" />
            Firestore Connection Test
          </h2>
        </div>
        
        <div className="p-4">
          <div className={`mb-4 p-3 border-l-4 ${isStatusError ? 'border-[#d63638] bg-red-50' : 'border-[#00a32a] bg-green-50'}`}>
            <p className="text-[13px]">{status}</p>
          </div>

          <h3 className="text-[14px] font-semibold mb-2">Raw Document Data</h3>
          {data.length === 0 ? (
            <p className="text-[#8c8f94] text-[13px] italic">No data found or loading...</p>
          ) : (
            <pre className="bg-[#f0f0f1] p-4 text-[13px] border border-[#c3c4c7] overflow-auto max-h-[400px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
