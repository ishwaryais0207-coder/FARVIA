import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  DollarSign, 
  Truck, 
  Search, 
  Check, 
  X 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KycFarmer {
  id: string;
  name: string;
  phone: string;
  district: string;
  farmSizeAcres: number;
  aadhaarKycStatus: 'Verified' | 'Pending Verification' | 'Rejected';
  landRecordVerified: boolean;
  pattaChittaNumber: string;
}

const INITIAL_FARMERS: KycFarmer[] = [
  {
    id: 'f-1',
    name: 'Murugan Palanisamy',
    phone: '+91 98421 55678',
    district: 'Madurai (Melur)',
    farmSizeAcres: 4.5,
    aadhaarKycStatus: 'Verified',
    landRecordVerified: true,
    pattaChittaNumber: 'TN-MDU-2024-8841',
  },
  {
    id: 'f-2',
    name: 'Kandasamy Thevar',
    phone: '+91 97892 33412',
    district: 'Dindigul (Oddanchatram)',
    farmSizeAcres: 6.0,
    aadhaarKycStatus: 'Pending Verification',
    landRecordVerified: false,
    pattaChittaNumber: 'TN-DGL-2025-1029',
  },
  {
    id: 'f-3',
    name: 'Selvi Meenakshi Sundaram',
    phone: '+91 94432 77890',
    district: 'Salem (Attur)',
    farmSizeAcres: 3.2,
    aadhaarKycStatus: 'Verified',
    landRecordVerified: true,
    pattaChittaNumber: 'TN-SLM-2024-5512',
  },
  {
    id: 'f-4',
    name: 'Ramasamy Veerappan',
    phone: '+91 96231 99011',
    district: 'Trichy (Lalgudi)',
    farmSizeAcres: 5.0,
    aadhaarKycStatus: 'Pending Verification',
    landRecordVerified: false,
    pattaChittaNumber: 'TN-TRY-2025-4421',
  },
];

export const AdminDashboard: React.FC = () => {
  const { products, orders, requirements } = useApp();
  const [farmers, setFarmers] = useState<KycFarmer[]>(INITIAL_FARMERS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleVerifyFarmer = (farmerId: string) => {
    setFarmers(prev =>
      prev.map(f =>
        f.id === farmerId
          ? { ...f, aadhaarKycStatus: 'Verified', landRecordVerified: true }
          : f
      )
    );
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleRejectFarmer = (farmerId: string) => {
    setFarmers(prev =>
      prev.map(f =>
        f.id === farmerId
          ? { ...f, aadhaarKycStatus: 'Rejected', landRecordVerified: false }
          : f
      )
    );
  };

  const filteredFarmers = farmers.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Platform Governance & Trust Supervision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            FARVIA Administrator Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Supervise Tamil Nadu agricultural transactions, verify grassroots farmer land Patta/Chitta credentials, audit AI price recommendations, and ensure zero middleman compliance.
          </p>
        </div>
      </div>

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Total Active Listings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{products.length} Batches</span>
          <span className="text-[10px] text-emerald-700 font-bold">100% Direct from Farm Gates</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Buyer Purchase Inquiries</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{requirements.length} Active Posts</span>
          <span className="text-[10px] text-slate-400">Hotels, canteens & supermarkets</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Fulfilled Deliveries</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{orders.length} Orders</span>
          <span className="text-[10px] text-emerald-700 font-bold">Zero commission leaks</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 block">Pending Farmer Verifications</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {farmers.filter(f => f.aadhaarKycStatus === 'Pending Verification').length} Farmers
          </span>
          <span className="text-[10px] text-slate-400">Land record validation queue</span>
        </div>
      </div>

      {/* Farmer KYC Verification Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Farmer KYC & Patta/Chitta Land Verification Queue
            </h2>
            <p className="text-xs text-slate-500">
              Only authentic rural cultivators are granted the 'Verified Farmer' trust seal on the direct marketplace
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search farmer or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Farmer Name</th>
                <th className="py-3 px-3">District / Taluk</th>
                <th className="py-3 px-3">Land Size</th>
                <th className="py-3 px-3">Patta/Chitta No.</th>
                <th className="py-3 px-3">KYC Status</th>
                <th className="py-3 px-3 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredFarmers.map(farmer => (
                <tr key={farmer.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-900 block">{farmer.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{farmer.phone}</span>
                  </td>
                  <td className="py-3.5 px-3">{farmer.district}</td>
                  <td className="py-3.5 px-3">{farmer.farmSizeAcres} Acres</td>
                  <td className="py-3.5 px-3 font-mono text-[11px]">{farmer.pattaChittaNumber}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      farmer.aadhaarKycStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-900'
                        : farmer.aadhaarKycStatus === 'Rejected'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {farmer.aadhaarKycStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {farmer.aadhaarKycStatus === 'Pending Verification' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleVerifyFarmer(farmer.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve KYC</span>
                        </button>
                        <button
                          onClick={() => handleRejectFarmer(farmer.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-2.5 py-1.5 rounded-xl text-xs transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-semibold text-[11px]">
                        Reviewed & Verified
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
