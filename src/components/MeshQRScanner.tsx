/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  QrCode, 
  RefreshCw, 
  CheckCircle, 
  X, 
  FileCode, 
  Terminal, 
  Sparkles, 
  Plus, 
  Volume2, 
  VolumeX,
  AlertCircle,
  Cpu,
  Bookmark
} from 'lucide-react';
import { MeshNode } from '../types';

interface MeshQRScannerProps {
  onRegisterNode: (node: MeshNode) => void;
  onClose: () => void;
  existingNodes: MeshNode[];
}

export default function MeshQRScanner({ 
  onRegisterNode, 
  onClose, 
  existingNodes 
}: MeshQRScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'file' | '模拟' | 'presets'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  
  // Custom manual state for input injection
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState<'solar' | 'satellite_uplink' | 'drone_repeater' | 'community_server'>('solar');
  const [customBattery, setCustomBattery] = useState(100);
  const [customSignal, setCustomSignal] = useState(90);
  
  // Results
  const [decodedNode, setDecodedNode] = useState<any | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const playSuccessBeep = () => {
    if (!audioFeedback) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Crisp retro synth double beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1); // High D6 note
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio feedback context blocked or unready', e);
    }
  };

  const startCameraStream = async () => {
    setCameraError(null);
    setCameraActive(true);
    setDecodedNode(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError("Your web client lacks media device interfaces. Falling back to neural simulator stream.");
      }
    } catch (err: any) {
      console.warn("webcam startup error", err);
      setCameraError("Camera capture access denied or node offline. Simulating passive spectrum network scans.");
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Triggering visual simulation phase
  const runDecryptionSimulation = (
    name: string, 
    type: 'solar' | 'satellite_uplink' | 'drone_repeater' | 'community_server', 
    battery: number, 
    signal: number, 
    bandwidth: number
  ) => {
    setIsScanning(true);
    setDecodedNode(null);
    setScanStatus("Acquiring signal phase carrier...");
    
    setTimeout(() => {
      setScanStatus("Decrypting RSA-2048 public cert credentials...");
      setTimeout(() => {
        setScanStatus("Filtering decentralized mesh multipath echoes...");
        setTimeout(() => {
          setIsScanning(false);
          setScanStatus("");
          playSuccessBeep();
          
          setDecodedNode({
            id: `qr-${type.slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
            name: name || "Discovered Repeater Node",
            type: type,
            battery: battery,
            signal: signal,
            bandwidth: bandwidth,
            activeUsers: Math.floor(Math.random() * 5),
            locX: Math.floor(20 + Math.random() * 60),
            locY: Math.floor(20 + Math.random() * 60),
            lastSync: "Scanned & Verified Now"
          });
        }, 800);
      }, 700);
    }, 650);
  };

  const handleRegisterNode = () => {
    if (!decodedNode) return;
    
    const newNode: MeshNode = {
      id: decodedNode.id,
      name: decodedNode.name,
      status: 'online',
      type: decodedNode.type,
      battery: decodedNode.battery,
      signal: decodedNode.signal,
      activeUsers: decodedNode.activeUsers || 0,
      bandwidth: decodedNode.bandwidth || 25,
      locX: decodedNode.locX,
      locY: decodedNode.locY,
      lastSync: 'QR Certificate Bound'
    };

    onRegisterNode(newNode);
    setDecodedNode(null);
    stopCameraStream();
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fallbackName = file.name.split('.')[0].replace(/[-_]+/g, ' ').toUpperCase();
      runDecryptionSimulation(fallbackName, 'solar', 98, 90, 40);
    }
  };

  return (
    <div className="space-y-4 text-zinc-900 dark:text-white" id="mesh-qr-component-container">
      {/* Keyframe scanner effects */}
      <style>{`
        @keyframes qr-scanner-laser {
          0% { top: 4%; opacity: 0.5; }
          50% { top: 96%; opacity: 1; }
          100% { top: 4%; opacity: 0.5; }
        }
        .scanner-laser-line {
          animation: qr-scanner-laser 2s infinite linear;
        }
      `}</style>

      {/* Header section */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
            <QrCode className="w-5 h-5 animate-[pulse_1.8s_infinite]" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">QR Hardware Ingestion</h3>
            <p className="text-[10px] text-zinc-400">Validate digital signatures over high-frequency local links</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio toggle button */}
          <button 
            type="button"
            onClick={() => setAudioFeedback(!audioFeedback)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850"
            title={audioFeedback ? "Mute beep alerts" : "Enable confirmation alerts"}
          >
            {audioFeedback ? <Volume2 className="w-3.5 h-3.5 text-indigo-505" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
          
          <button 
            type="button" 
            onClick={() => { stopCameraStream(); onClose(); }}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Switchers */}
      <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl text-[10px] font-bold uppercase tracking-wider">
        <button 
          onClick={() => { setActiveTab('camera'); startCameraStream(); }}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'camera' 
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/40 dark:border-zinc-800/40' 
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          <Camera className="w-3 h-3" />
          Live Camera
        </button>

        <button 
          onClick={() => { setActiveTab('file'); stopCameraStream(); }}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'file' 
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/40 dark:border-zinc-800/40' 
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          <FileCode className="w-3 h-3" />
          Key Decrypter
        </button>

        <button 
          onClick={() => { setActiveTab('presets'); stopCameraStream(); }}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'presets' 
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/40 dark:border-zinc-800/40' 
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          Presets
        </button>

        <button 
          onClick={() => { setActiveTab('模拟'); stopCameraStream(); }}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === '模拟' 
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs border border-zinc-200/40 dark:border-zinc-800/40' 
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
          }`}
        >
          <Terminal className="w-3 h-3" />
          Custom Seed
        </button>
      </div>

      {/* Main Workspace Frame */}
      {activeTab === 'camera' && (
        <div className="space-y-4">
          <div className="relative aspect-video rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden shadow-inner">
            {/* Ambient Corner crosshair borders */}
            <div className="absolute top-2.5 left-2.5 w-4.5 h-4.5 border-t-2 border-l-2 border-indigo-500 pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 border-t-2 border-r-2 border-indigo-500 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-4.5 h-4.5 border-b-2 border-l-2 border-indigo-500 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-4.5 h-4.5 border-b-2 border-r-2 border-indigo-500 pointer-events-none" />

            {cameraActive ? (
              <div className="w-full h-full relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover dark:opacity-85"
                />
                
                {/* Simulated scan overlay target box */}
                <div className="absolute inset-x-8 inset-y-6 md:inset-x-12 md:inset-y-9 border border-indigo-400/40 bg-indigo-500/[0.03] rounded-lg pointer-events-none flex items-center justify-center">
                  <div className="text-[9px] uppercase font-mono tracking-widest text-indigo-400 font-bold bg-zinc-950/80 px-2 py-0.5 rounded shadow">
                    Align QR Token
                  </div>
                </div>

                <div className="absolute bottom-2 inset-x-2 flex justify-between gap-1.5">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-1 bg-zinc-900/90 text-emerald-400 backdrop-blur border border-zinc-800 rounded-md">
                    🔴 Live Stream Feed Active
                  </span>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      stopCameraStream();
                      // Auto-scan a random node when taking static capture as fallback
                      runDecryptionSimulation('Cam Swarm Repeater', 'solar', 92, 85, 30);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 border border-indigo-500/30 text-white rounded-lg px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider hover:scale-103 transition-all cursor-pointer"
                  >
                    Trigger Capture Scan
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-5 text-zinc-500 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-zinc-650 dark:text-zinc-550 animate-pulse" />
                <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-550">Webcam Ingestion Suspended</p>
                <p className="text-[9px] text-zinc-500 max-w-[210px] leading-relaxed mx-auto">Click "Launch Feed" to stream physical QR hardware codes from device cameras.</p>
                
                <button
                  type="button"
                  onClick={startCameraStream}
                  className="mt-2.5 text-[9px] font-bold uppercase tracking-widest px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all border border-indigo-500/30"
                >
                  Launch Camera Feed
                </button>
              </div>
            )}

            {/* Sweep Laser animation overlay */}
            {(cameraActive || isScanning) && (
              <div className="absolute inset-x-0 h-[1.5px] bg-indigo-400 shadow-[0_0_9px_#818cf8] scanner-laser-line pointer-events-none" />
            )}

            {/* Active Decoder Loader Layer */}
            {isScanning && (
              <div className="absolute inset-0 bg-zinc-900/92 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10 transition-all">
                <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin mb-3" />
                <p className="text-[10px] font-mono text-indigo-400 antialiased tracking-wide font-bold">{scanStatus}</p>
                <span className="text-[8px] text-zinc-500 mt-1 uppercase tracking-widest block font-mono">DPI Network Encryption Shield Active</span>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="p-2 px-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-850 rounded-lg text-[9px] font-mono text-zinc-500 leading-relaxed flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                <strong>System Guidance:</strong> {cameraError} (You can also upload images or select from high-efficiency presets to register new nodes seamlessly!)
              </span>
            </div>
          )}

          {/* Fallback fast calibration manual scanning trigger from camera UI */}
          {!cameraActive && (
            <div className="p-3 bg-indigo-50/45 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/20 rounded-xl flex items-center justify-between text-[11px]">
              <span className="text-zinc-650 dark:text-zinc-400">Want to simulate a direct instant camera verification scan?</span>
              <button
                type="button"
                onClick={() => {
                  runDecryptionSimulation('Fast Spectral Pod', 'solar', 99, 94, 30);
                }}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-md font-bold uppercase text-[9px] tracking-wider transition-colors"
              >
                Instant Scan
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'file' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-600/60 rounded-xl p-6 text-center bg-zinc-50/40 dark:bg-zinc-950/20 hover:bg-zinc-100/30 transition-all flex flex-col items-center justify-center min-h-[140px] relative">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer" 
            />
            <FileCode className="w-7 h-7 text-zinc-400 dark:text-zinc-600 mb-2.5 animate-bounce" />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Drag & drop or import QR image</span>
            <p className="text-[9.5px] text-zinc-400 mt-1 max-w-[240px] leading-relaxed">
              Accepting exported hardware PNG coefficients containing metadata cryptographic signatures.
            </p>
          </div>

          {isScanning && (
            <div className="py-2.5 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>{scanStatus}</span>
            </div>
          )}
        </div>
      )}

      {/* Hardware Presets for Quick Testing & Realistic Setup */}
      {activeTab === 'presets' && (
        <div className="space-y-2.5">
          <span className="text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-widest block">Available Mesh Field Hardware Certs</span>
          
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => runDecryptionSimulation('Solar Mesh Pod SL-A', 'solar', 100, 95, 20)}
              className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate flex items-center gap-1">
                  Solar Mesh Relay Pod (SL-A18)
                  <span className="text-[8px] bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 px-1 rounded">Solar</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400">2.4GHz Multiplex • Encoded Batt: 100% • RSSI: 95%</span>
              </div>
              <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => runDecryptionSimulation('Community Cache Server CS-D', 'community_server', 100, 89, 50)}
              className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate flex items-center gap-1">
                  Community Cloud Vault (CS-D4)
                  <span className="text-[8px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-1 rounded">Server</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400">54Mbps WAN Proxy • Encoded Batt: 100% • RSSI: 89%</span>
              </div>
              <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => runDecryptionSimulation('Aerial Drone Swarm', 'drone_repeater', 82, 74, 15)}
              className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate flex items-center gap-1">
                  Air Swarm Aerial Repeater (AS-X9)
                  <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-1 rounded">Drone</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400">Sub-GHz Resilient • Encoded Batt: 82% • RSSI: 74%</span>
              </div>
              <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => runDecryptionSimulation('Ground Uplink Station', 'satellite_uplink', 100, 98, 150)}
              className="p-2.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl hover:border-indigo-500 text-left transition-all flex items-center justify-between group"
            >
              <div className="min-w-0">
                <span className="text-xs font-bold text-zinc-900 dark:text-white block truncate flex items-center gap-1">
                  Satellite Ground Hub (SAT-V3)
                  <span className="text-[8px] bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 px-1 rounded">Satellite</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-400">Ka-Band Transceiver • Encoded Batt: 100% • RSSI: 98%</span>
              </div>
              <QrCode className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 shrink-0 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Manual Diagnostic custom seed generator */}
      {activeTab === '模拟' && (
        <div className="space-y-3.5" id="custom-simulation-form-container">
          <div className="space-y-2.5">
            <div>
              <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-1">Grid/Node Custom Name</label>
              <input
                type="text"
                placeholder="e.g. East Valley Repeater"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg focus:outline-hidden focus:border-indigo-500 text-zinc-900 dark:text-zinc-100 font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-1">Relay Category</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-1.8 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-zinc-900 dark:text-zinc-100 font-sans"
                >
                  <option value="solar">Solar-powered Mesh</option>
                  <option value="satellite_uplink">Satellite Ground Station</option>
                  <option value="community_server">Local Cache Server</option>
                  <option value="drone_repeater">Aerial Swarm Link</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-1">RSSI Signal (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={customSignal}
                  onChange={(e) => setCustomSignal(Number(e.target.value))}
                  className="w-full text-xs px-3 py-1.8 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-zinc-900 dark:text-zinc-100 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold font-mono text-zinc-400 uppercase tracking-wider mb-1">Initial Battery (%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={customBattery}
                onChange={(e) => setCustomBattery(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-450 mt-1">
                <span>10% Low Alert</span>
                <span className="font-bold text-indigo-550">{customBattery}% Charged</span>
                <span>100% Full</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const bWidth = customType === 'satellite_uplink' ? 150 : customType === 'community_server' ? 50 : 20;
              runDecryptionSimulation(customName || 'Diagnostic Link Pod', customType, customBattery, customSignal, bWidth);
            }}
            className="w-full text-xs font-bold py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-xs uppercase tracking-wider block"
          >
            Construct & Inject QR Packet Signature
          </button>
        </div>
      )}

      {/* Decoded Results Preview and Registration Activator Button */}
      {decodedNode && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl space-y-3.5 animate-[fadeIn_0.3s_ease-out]" id="decryption-results-block">
          <div className="flex items-center justify-between border-b border-emerald-200/50 dark:border-emerald-900/30 pb-2.5">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 animate-bounce" />
              Ingested Cryptographic Signature Correct
            </span>
            <button 
              onClick={() => setDecodedNode(null)}
              className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[8.5px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">Discovered SSID</span>
              <span className="font-bold text-zinc-950 dark:text-white flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                {decodedNode.name}
              </span>
            </div>
            <div>
              <span className="text-[8.5px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">Transmission Class</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200 capitalize font-bold">
                {decodedNode.type.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-[8.5px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">Internal Batteries</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{decodedNode.battery}% Cells Ready</span>
            </div>
            <div>
              <span className="text-[8.5px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">Validated Signal Level</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{decodedNode.signal}% Channel Stability</span>
            </div>
          </div>

          {/* Alert user if exact ID matches existing node */}
          {existingNodes.some(n => n.name.toLowerCase() === decodedNode.name.toLowerCase()) && (
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 text-[9.5px] text-amber-600 dark:text-amber-400 rounded-lg leading-snug">
              Warning: A node named "{decodedNode.name}" is already registered in the SkyMesh active topology state. Registering it anyway will deploy a high-availability secondary relay.
            </div>
          )}

          <div className="flex gap-2 font-sans pt-1">
            <button
              type="button"
              onClick={() => setDecodedNode(null)}
              className="flex-1 text-xs font-bold py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 bg-white dark:bg-zinc-900 rounded-xl transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleRegisterNode}
              className="flex-2 text-xs font-bold py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Bind Hardware & Register Topology
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
