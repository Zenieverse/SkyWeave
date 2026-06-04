/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  MapPin, 
  Navigation, 
  Battery, 
  Play, 
  CheckCircle, 
  CloudRain, 
  RefreshCw, 
  AlertCircle, 
  Wind, 
  FlameKindling 
} from 'lucide-react';
import { Drone, MeshNode } from '../types';

interface DroneSyncProps {
  drones: Drone[];
  nodes: MeshNode[];
  onSyncComplete: (nodeId: string) => void;
  onUpdateDroneBattery: (droneId: string, battery: number) => void;
}

export default function DroneSync({ drones, nodes, onSyncComplete, onUpdateDroneBattery }: DroneSyncProps) {
  const [selectedDrone, setSelectedDrone] = useState<Drone>(drones[0]);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'System: All autonomous drone tracking receivers online.',
    'System: Swarm calibration complete.'
  ]);
  const [flyProgress, setFlyProgress] = useState<number>(-1);
  const [activeFlightId, setActiveFlightId] = useState<string | null>(null);
  const [isRaining, setIsRaining] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (flyProgress >= 0 && flyProgress < 100 && activeFlightId) {
      interval = setInterval(() => {
        setFlyProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            handleFlightComplete();
            return 100;
          }
          return next;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [flyProgress, activeFlightId]);

  const handleDispatch = (drone: Drone) => {
    if (isRaining) {
      setSyncLogs(prev => [
        `[WARNING] Flight aborted: High precipitation makes route sync hazardous. Wait until weather pattern clears.`,
        ...prev
      ]);
      return;
    }

    if (drone.battery < 20) {
      setSyncLogs(prev => [
        `[WARNING] Cannot dispatch ${drone.name}: Storage cell levels are critically low (${drone.battery}%). Place in solar charging cradle.`,
        ...prev
      ]);
      return;
    }

    setSyncLogs(prev => [
      `[DISPATCH] Launching ${drone.name} carrying ${drone.dataPayloadSize} containing education databases and synchronized transactions ledger...`,
      ...prev
    ]);
    
    setFlyProgress(0);
    setActiveFlightId(drone.id);
  };

  const handleFlightComplete = () => {
    // Find the next offline node to restore coverage
    const offlineNode = nodes.find(n => n.status === 'offline');
    const warningNode = nodes.find(n => n.status === 'warning');
    const targetNodeId = offlineNode?.id || warningNode?.id || 'node-4';
    const targetNode = nodes.find(n => n.id === targetNodeId);

    if (targetNode) {
      onSyncComplete(targetNodeId);
      // Reduce battery of the drone after hard flight
      onUpdateDroneBattery(selectedDrone.id, Math.max(10, selectedDrone.battery - 25));
      setSyncLogs(prev => [
        `[SYNC COMPLETE] ${selectedDrone.name} landed safely at ${targetNode.name}! Synchronized medical forms, downloaded 14 lessons, validated 8 P2P commerce transactions. Node state restored!`,
        ...prev
      ]);
    } else {
      setSyncLogs(prev => [
        `[SYNC COMPLETE] ${selectedDrone.name} completed standard flight survey. No offline nodes require cache restoration at this time.`,
        ...prev
      ]);
    }
    setActiveFlightId(null);
    setFlyProgress(-1);
  };

  const handleToggleWeather = () => {
    setIsRaining(prev => {
      const state = !prev;
      setSyncLogs(logs => [
        `System: Simulated weather pattern updated - ${state ? 'High Precipitation & Windstorm active (Hazardous)' : 'Clear stable skies (Perfect visibility)'}`,
        ...logs
      ]);
      return state;
    });
  };

  return (
    <div className="space-y-6" id="drone-sync-module">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Swarm overview selector */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Plane className="w-4 h-4 text-zinc-500" />
              Autonomous Sync Swarm
            </h3>
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              Count: {drones.length}
            </span>
          </div>

          <div className="space-y-3">
            {drones.map((drone) => {
              const isSelected = selectedDrone.id === drone.id;
              const isCurrentlyFlying = activeFlightId === drone.id;
              
              return (
                <button
                  key={drone.id}
                  onClick={() => !isCurrentlyFlying && setSelectedDrone(drone)}
                  disabled={isCurrentlyFlying}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-zinc-800/80' 
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                  } ${isCurrentlyFlying ? 'opacity-80 cursor-not-allowed' : ''}`}
                  id={`drone-select-${drone.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{drone.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono ${
                      isCurrentlyFlying 
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 animate-pulse' 
                        : drone.battery < 20 
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-400' 
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400'
                    }`}>
                      {isCurrentlyFlying ? 'FLYING' : drone.battery < 20 ? 'CRITICAL POWER' : 'CHARGED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Battery className="w-3.5 h-3.5" /> Battery: {drone.battery}%
                    </span>
                    <span className="flex items-center gap-1 font-mono truncate">
                      <Navigation className="w-3.5 h-3.5" /> Size: {drone.dataPayloadSize}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Autonomous scheduling weather widget */}
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Weather Safety Check</h4>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isRaining ? (
                  <CloudRain className="w-5 h-5 text-rose-500 animate-bounce" />
                ) : (
                  <Wind className="w-5 h-5 text-emerald-500" />
                )}
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {isRaining ? 'Storm Warning' : 'Skies are Clear (Perfect)'}
                  </p>
                  <p className="text-[10px] text-zinc-400">Wind: {isRaining ? '42' : '12'} km/h • Flight Viable</p>
                </div>
              </div>
              <button 
                onClick={handleToggleWeather}
                className={`text-[9px] font-bold px-2 py-1 rounded border transition-colors ${
                  isRaining 
                    ? 'border-rose-200 bg-rose-50 text-rose-700' 
                    : 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
                id="btn-simulate-weather"
              >
                Simulate Storm
              </button>
            </div>
          </div>
        </div>

        {/* Selected Drone Status details and live simulation progress */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Currently Auditing Target</span>
                <span className="text-base font-semibold text-zinc-900 dark:text-white">{selectedDrone.name}</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Task: {selectedDrone.task}</p>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-950 px-2 py-1 rounded border border-zinc-200/50 dark:border-zinc-800/80">
                Data Cap: {selectedDrone.dataPayloadSize}
              </span>
            </div>

            {/* Flight Path Visualization graph */}
            <div>
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-3">Planned Autonomous Sync Path</span>
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/80 rounded-xl relative">
                {selectedDrone.route.map((pt, idx) => (
                  <React.Fragment key={`pt-${idx}`}>
                    <div className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold ${
                        idx === 0 
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
                          : idx === selectedDrone.route.length - 1 
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                            : 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-[10px] font-medium text-zinc-800 dark:text-zinc-200 max-w-[90px] text-center truncate">{pt}</span>
                    </div>
                    {idx < selectedDrone.route.length - 1 && (
                      <div className="h-0.5 grow bg-zinc-200 dark:bg-zinc-800 relative mx-2">
                        {activeFlightId === selectedDrone.id && (
                          <div 
                            className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, (flyProgress - (idx * (100 / (selectedDrone.route.length - 1)))) * (selectedDrone.route.length - 1)))}%` }}
                          />
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Active sync trajectory indicator */}
            {activeFlightId === selectedDrone.id && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1 animate-pulse"><RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> Fetching and transmitting local packets...</span>
                  <span className="font-mono font-medium">{flyProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${flyProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Sycn logs console list */}
            <div>
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-2">Live Sync Telemetry Terminal</span>
              <div className="h-28 bg-zinc-950 p-3 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-400 space-y-1 overflow-y-auto">
                {syncLogs.map((log, lIdx) => (
                  <p 
                    key={`log-${lIdx}`} 
                    className={
                      log.startsWith('[WARNING]') 
                        ? 'text-amber-400' 
                        : log.startsWith('[DISPATCH]') 
                          ? 'text-indigo-400' 
                          : log.startsWith('[SYNC COMPLETE]') 
                            ? 'text-emerald-400' 
                            : 'text-zinc-400'
                    }
                  >
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end">
            <button
              onClick={() => handleDispatch(selectedDrone)}
              disabled={activeFlightId !== null}
              className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-xl hover:bg-zinc-800 disabled:opacity-50 tracking-wider uppercase flex items-center gap-1.5"
              id="btn-dispatch-drone"
            >
              <Navigation className="w-4 h-4" />
              Dispatch Synchronizer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
