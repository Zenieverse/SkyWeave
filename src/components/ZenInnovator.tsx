/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Upload, 
  Sparkles, 
  Edit2, 
  Check, 
  X, 
  Minimize2, 
  Bookmark, 
  Activity,
  Award
} from 'lucide-react';

export default function ZenInnovator() {
  const [innovatorName, setInnovatorName] = useState<string>(() => {
    return localStorage.getItem('skyweave_zen_name') || 'Zen';
  });
  const [innovatorTitle, setInnovatorTitle] = useState<string>(() => {
    return localStorage.getItem('skyweave_zen_title') || 'Lead Platform Innovator';
  });
  const [innovatorBio, setInnovatorBio] = useState<string>(() => {
    return localStorage.getItem('skyweave_zen_bio') || 'Bridging the global digital equity gap utilizing decentralized solar-repeater mesh. Syncing next-gen seeds telemetry.';
  });
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    return localStorage.getItem('skyweave_zen_image') || null;
  });
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(innovatorName);
  const [tempTitle, setTempTitle] = useState<string>(innovatorTitle);
  const [tempBio, setTempBio] = useState<string>(innovatorBio);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current user profile is modified from developer defaults
  const isModified = innovatorName !== 'Zen' || 
    innovatorTitle !== 'Lead Platform Innovator' || 
    innovatorBio !== 'Bridging the global digital equity gap utilizing decentralized solar-repeater mesh. Syncing next-gen seeds telemetry.' || 
    imageUrl !== null;

  const handleResetToDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInnovatorName('Zen');
    setInnovatorTitle('Lead Platform Innovator');
    setInnovatorBio('Bridging the global digital equity gap utilizing decentralized solar-repeater mesh. Syncing next-gen seeds telemetry.');
    setImageUrl(null);
    setTempName('Zen');
    setTempTitle('Lead Platform Innovator');
    setTempBio('Bridging the global digital equity gap utilizing decentralized solar-repeater mesh. Syncing next-gen seeds telemetry.');
  };

  // Synchronize values to localStorage
  useEffect(() => {
    localStorage.setItem('skyweave_zen_name', innovatorName);
  }, [innovatorName]);

  useEffect(() => {
    localStorage.setItem('skyweave_zen_title', innovatorTitle);
  }, [innovatorTitle]);

  useEffect(() => {
    localStorage.setItem('skyweave_zen_bio', innovatorBio);
  }, [innovatorBio]);

  useEffect(() => {
    if (imageUrl) {
      localStorage.setItem('skyweave_zen_image', imageUrl);
    } else {
      localStorage.removeItem('skyweave_zen_image');
    }
  }, [imageUrl]);

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Form rejection alert: Image required (.png, .jpg, or .webp only).');
      setTimeout(() => setUploadError(null), 5000);
      return;
    }
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveEdits = (e: React.FormEvent) => {
    e.preventDefault();
    setInnovatorName(tempName);
    setInnovatorTitle(tempTitle);
    setInnovatorBio(tempBio);
    setIsEditing(false);
  };

  const handleCancelEdits = () => {
    setTempName(innovatorName);
    setTempTitle(innovatorTitle);
    setTempBio(innovatorBio);
    setIsEditing(false);
  };

  const handleResetImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(null);
  };

  return (
    <div 
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4 relative overflow-hidden flex flex-col justify-between font-sans transition-all duration-300"
      id="zen-innovator-card"
    >
      {/* Background Subtle Gradient Accents for Clean Minimalism */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/40 dark:bg-zinc-850 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

      {/* Form or Profile display segment */}
      {isEditing ? (
        <form onSubmit={handleSaveEdits} className="space-y-3 z-10">
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
            <h4 className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-widest block">Edit Innovator Profile</h4>
            <div className="flex gap-1.5">
              <button 
                type="button" 
                onClick={handleCancelEdits}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-650"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button 
                type="submit"
                className="p-1 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded text-indigo-600 dark:text-indigo-400"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[8px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-0.5">Innovator Name</label>
              <input 
                type="text"
                required
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-805 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-500"
                id="edit-zen-name"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-0.5">Title / Specialization</label>
              <input 
                type="text"
                required
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-805 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-500"
                id="edit-zen-title"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-0.5">Mission Statement</label>
              <textarea 
                rows={2}
                required
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-805 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-indigo-500 resize-none"
                id="edit-zen-bio"
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-3 z-10">
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 max-w-[80%]">
              {/* Profile Avatar bubble */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 select-none shadow-xs flex items-center justify-center relative bg-zinc-50 dark:bg-zinc-950">
                {imageUrl ? (
                  <img src={imageUrl} alt={innovatorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-sans">
                    {innovatorName.trim() ? innovatorName.trim().charAt(0).toUpperCase() : 'Z'}
                  </div>
                )}
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-550" />
                  Featured Innovator
                </span>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1 truncate">
                  {innovatorName}
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Online Sync Verified" />
                </h3>
                <p className="text-[9px] text-zinc-400 italic truncate">{innovatorTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {isModified && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded transition-colors"
                  title="Reset profile data back to developer default values"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => {
                  setTempName(innovatorName);
                  setTempTitle(innovatorTitle);
                  setTempBio(innovatorBio);
                  setIsEditing(true);
                }}
                className="p-1 px-1.5 border border-zinc-250 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-400 hover:text-zinc-650 hover:dark:text-zinc-300 transition-colors"
                id="btn-edit-zen"
                title="Edit Profile Details"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
            "{innovatorBio}"
          </p>
        </div>
      )}

      {uploadError && (
        <div className="mt-2 pt-1 text-[9px] text-center font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-950/40 p-1.5 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* Uploadable / Draggable area */}
      <div className="mt-3.5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 z-10">
        <div 
          onClick={handleContainerClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[96px] ${
            isDragging 
              ? 'border-indigo-550 bg-indigo-50/30 dark:bg-indigo-950/20' 
              : 'border-zinc-200 hover:border-zinc-350 dark:border-zinc-800 hover:dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-950/40'
          }`}
          id="profile-upload-zone"
        >
          {/* Hidden physical Input selector */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="zen-image-file-input"
          />

          {imageUrl ? (
            <div className="relative group w-14 h-14 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <img 
                src={imageUrl} 
                alt="Zen Innovator Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <button
                onClick={handleResetImage}
                className="absolute -top-1 -right-1 bg-zinc-900 text-white rounded-full p-0.5 border border-zinc-200/50 hover:bg-rose-600 transition-colors"
                title="Discard photo"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-1 text-zinc-450 dark:text-zinc-500">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center">
                <Upload className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-[10px] font-medium font-sans">
                <span className="text-indigo-650 dark:text-indigo-400 font-semibold">Click to upload</span> or drag image here
              </p>
              <p className="text-[8px] text-zinc-400 font-mono">PNG, JPG, WEBP (Supports touch/drop)</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest z-10">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-zinc-350" />
          REGISTRY STATUS: LIVE
        </span>
        <span className="bg-zinc-100 dark:bg-zinc-850 text-zinc-500 px-1.5 py-0.5 rounded">
          ECC KEY VERIFIED
        </span>
      </div>
    </div>
  );
}
