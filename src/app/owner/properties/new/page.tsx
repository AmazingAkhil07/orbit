'use client';

import { useState } from 'react';
import { Building2, MapPin, BedDouble, DollarSign, Wifi, Image as ImageIcon, Eye, ChevronRight, ChevronLeft, Save, FileCheck, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    type: 'Boys PG',
    description: '',
    // Step 2: Location
    address: '',
    city: '',
    pincode: '',
    // Step 3: Rooms
    totalRooms: '',
    priceRange: '',
    // Step 4: Amenities
    amenities: [] as string[],
    // Step 5: Media
    images: [] as string[],
    // Step 6: Documents
    aadharCard: null as File | null,
    propertyProof: null as File | null,
  });

  const steps = [
    { id: 1, label: 'Basic Info', icon: Building2 },
    { id: 2, label: 'Location', icon: MapPin },
    { id: 3, label: 'Rooms', icon: BedDouble },
    { id: 4, label: 'Amenities', icon: Wifi },
    { id: 5, label: 'Media', icon: ImageIcon },
    { id: 6, label: 'Documents', icon: FileCheck },
    { id: 7, label: 'Review', icon: Eye },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.length > 3 && formData.description.length > 10;
      case 2:
        return formData.address.length > 5 && formData.city.length > 2 && formData.pincode.length >= 6;
      case 3:
        return formData.totalRooms !== '' && formData.priceRange !== '';
      case 4:
        return true; // Optional
      case 5:
        return true; // Optional for now
      case 6:
        // Require documents for verification
        // For demo purposes, we'll assume they are "uploaded" if the user clicks the button
        // In a real app, check formData.aadharCard !== null
        return true; 
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(Math.min(7, currentStep + 1));
    }
  };

  const handleSubmit = () => {
    // API call to submit property with status 'PENDING_VERIFICATION'
    alert("Property submitted for verification! An admin will visit for physical inspection.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add New Property</h1>
          <p className="text-zinc-400 mt-1">Follow the steps to list your PG or Hostel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/owner/properties"
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between relative min-w-[600px]">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-800 -z-10" />
          
          {/* Active Progress Bar */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-10"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const canNavigate = step.id < currentStep; // Only allow navigating back

            return (
              <button
                key={step.id}
                onClick={() => canNavigate && setCurrentStep(step.id)}
                disabled={!canNavigate && !isCurrent}
                className={`flex flex-col items-center gap-2 group ${
                  isCurrent ? 'text-emerald-400' : 
                  isCompleted ? 'text-emerald-500 cursor-pointer' : 'text-zinc-500 cursor-not-allowed'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-black ${
                  isCurrent ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-110' : 
                  isCompleted ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-700'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Property Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Sunny Villa PG" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Property Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                >
                  <option>Boys PG</option>
                  <option>Girls PG</option>
                  <option>Co-ed PG</option>
                  <option>Flat/Apartment</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-zinc-300">Description <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property..." 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Location Details</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Address <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address, Area, City" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">City <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Pincode <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Room Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Total Rooms <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.totalRooms}
                  onChange={(e) => handleInputChange('totalRooms', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Starting Price (₹/month) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white" 
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['WiFi', 'AC', 'Food', 'Laundry', 'Power Backup', 'CCTV', 'Security', 'Gym', 'Parking'].map((amenity) => (
                <label key={amenity} className="flex items-center gap-3 p-4 rounded-xl bg-black/30 border border-white/5 cursor-pointer hover:bg-black/50 transition-all">
                  <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 bg-zinc-900" />
                  <span className="text-zinc-300">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Property Photos</h2>
            <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-zinc-400 group-hover:text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Click to upload images</h3>
              <p className="text-zinc-500 text-sm max-w-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Verification Documents</h2>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-200/80">
                To ensure safety and trust, we require physical verification of your property. 
                Please upload the following documents to initiate the process. An admin will visit your property within 48 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Aadhar Card (Front & Back)</label>
                <div className="border border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-zinc-500 transition-all cursor-pointer bg-black/30">
                  <FileCheck className="w-8 h-8 text-zinc-500 mb-2" />
                  <span className="text-sm text-emerald-400">Upload Aadhar</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Property Ownership Proof</label>
                <div className="border border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-zinc-500 transition-all cursor-pointer bg-black/30">
                  <FileCheck className="w-8 h-8 text-zinc-500 mb-2" />
                  <span className="text-sm text-emerald-400">Upload Electricity Bill / Deed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Submit?</h2>
              <p className="text-zinc-400 max-w-md mx-auto">
                Your property <span className="text-white font-medium">{formData.name}</span> is ready for verification. 
                Once submitted, our team will contact you for the physical inspection.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-white/5 space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Property Name</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Location</span>
                <span className="text-white">{formData.city}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">Rooms</span>
                <span className="text-white">{formData.totalRooms}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Price</span>
                <span className="text-white">₹{formData.priceRange}/mo</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
            currentStep === 1 
              ? 'opacity-0 pointer-events-none' 
              : 'bg-zinc-800 text-white hover:bg-zinc-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep === 7 ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Submit for Verification
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isStepValid(currentStep)}
            className={`px-8 py-3 font-bold rounded-xl transition-all flex items-center gap-2 ${
              isStepValid(currentStep)
                ? 'bg-emerald-500 hover:bg-emerald-600 text-black hover:scale-105 active:scale-95'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
