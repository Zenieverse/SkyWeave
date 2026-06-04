/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  HeartPulse, 
  CheckCircle, 
  Play, 
  HelpCircle, 
  Plus, 
  Activity, 
  ShieldAlert, 
  Database,
  ArrowRight,
  TrendingUp,
  Sliders,
  Calendar
} from 'lucide-react';
import { Course, LedgerEntry } from '../types';

interface EduTelehealthProps {
  courses: Course[];
  onCompleteCourse: (courseId: string) => void;
  onAddTransaction: (desc: string, amount: number, type: 'earn' | 'spend' | 'transfer' | 'reward', isOffline: boolean) => void;
  networkStatus: string;
}

interface MedicalCase {
  id: string;
  name: string;
  age: number;
  condition: string;
  triage: 'red' | 'amber' | 'green';
  isSynced: boolean;
  notes: string;
}

export default function EduTelehealth({ 
  courses, 
  onCompleteCourse, 
  onAddTransaction,
  networkStatus 
}: EduTelehealthProps) {
  const [activeSubTab, setActiveSubTab] = useState<'education' | 'telehealth'>('education');
  
  // Education Academy States
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [currentQuizAnswer, setCurrentQuizAnswer] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [streakCount, setStreakCount] = useState<number>(6);

  // Telehealth clinic record forms
  const [medicalCases, setMedicalCases] = useState<MedicalCase[]>([
    { id: 'case-1', name: 'Nawaz Kebe', age: 24, condition: 'Prenatal Routine check (6 months)', triage: 'green', isSynced: true, notes: 'Fetal heart tone clear. Iron levels tracked and stable.' },
    { id: 'case-2', name: 'Zola Finch', age: 4, condition: 'High fever and abdominal pains', triage: 'red', isSynced: false, notes: 'Suspected respiratory infection. Local fluids provided. Ready for physical drone synchronization.' }
  ]);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [patientTriage, setPatientTriage] = useState<'red' | 'amber' | 'green'>('green');
  const [patientNotes, setPatientNotes] = useState('');

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuizAnswer === null) return;

    const quizItem = selectedCourse.quizzes[0];
    const isCorrect = currentQuizAnswer === quizItem.correctAnswer;
    setQuizSuccess(isCorrect);

    if (isCorrect) {
      setCompletedQuizzes(prev => ({ ...prev, [selectedCourse.id]: true }));
      onCompleteCourse(selectedCourse.id);
      // Award Credits in SkyPay Ledger
      onAddTransaction(
        `Academic Award: Completed ${selectedCourse.title} handbook`,
        selectedCourse.rewardCredits,
        'reward',
        networkStatus === 'offline'
      );
      // Increment student streak
      setStreakCount(prev => prev + 1);
    }
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientCondition) return;

    const newCase: MedicalCase = {
      id: `case-${Date.now()}`,
      name: patientName,
      age: Number(patientAge),
      condition: patientCondition,
      triage: patientTriage,
      isSynced: networkStatus !== 'offline',
      notes: patientNotes
    };

    setMedicalCases(prev => [newCase, ...prev]);
    setPatientName('');
    setPatientAge('');
    setPatientCondition('');
    setPatientNotes('');

    // Trigger ledger reward for healthcare worker synchronization reporting
    onAddTransaction(
      `Symptom report registered: case #${newCase.id.slice(-4)}`,
      8,
      'earn',
      networkStatus === 'offline'
    );
  };

  return (
    <div className="space-y-6" id="edu-telehealth-module">
      
      {/* Dynamic Sub Tab Selector */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setActiveSubTab('education')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'education' 
              ? 'border-indigo-500 text-indigo-600 dark:text-white' 
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
          }`}
          id="btn-subtab-edu"
        >
          Education Ecosystem
        </button>
        <button
          onClick={() => setActiveSubTab('telehealth')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeSubTab === 'telehealth' 
              ? 'border-indigo-500 text-indigo-600 dark:text-white' 
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800'
          }`}
          id="btn-subtab-tele"
        >
          Telehealth & Diagnostics Clinic
        </button>
      </div>

      {activeSubTab === 'education' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="edu-view">
          
          {/* Courses Index Deck & Streak Panel */}
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase tracking-wider block opacity-85">Daily Learning Streak</span>
                  <span className="text-xl font-bold font-sans">🔥 {streakCount} Days Active</span>
                </div>
                <Award className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-bounce" />
              </div>
              <p className="text-[11px] opacity-90 mt-2">Finish today’s quiz to claim credit tokens and extend your streak reward!</p>
            </div>

            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest block mb-3">Courses Catalogue</span>
              <div className="space-y-2">
                {courses.map(course => {
                  const isCurSelected = selectedCourse.id === course.id;
                  const isDone = completedQuizzes[course.id] || course.completed;

                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourse(course);
                        setCurrentQuizAnswer(null);
                        setQuizSuccess(null);
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        isCurSelected 
                          ? 'border-zinc-950 dark:border-white bg-zinc-50 dark:bg-zinc-800' 
                          : 'border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900'
                      }`}
                      id={`course-btn-${course.id}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{course.title}</span>
                        {isDone && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-1" />}
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-zinc-400 mt-1.5 font-mono">
                        <span>{course.category}</span>
                        <span className="text-indigo-500 font-bold">+{course.rewardCredits} Credits</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Course View and Interactive Testing Form */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Active Classroom Lesson</span>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mt-1">{selectedCourse.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{selectedCourse.description}</p>
            </div>

            {/* Offline-friendly Slides list */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block">Handbooks Outline</span>
              {selectedCourse.lessons.map((lesson, idx) => (
                <div key={idx} className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-xl flex gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-400">{idx + 1}.</span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">{lesson}</p>
                </div>
              ))}
            </div>

            {/* Assessment quiz segment */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-3">Course Mastery Quiz</span>
              {completedQuizzes[selectedCourse.id] || selectedCourse.completed ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white">Assessment complete!</p>
                      <p className="text-[10px] text-zinc-400">Awarded credits transferred to SkyPay digital ledger.</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-zinc-800 text-emerald-600 rounded-md shadow-xs flex items-center gap-1">
                    Certified
                  </span>
                </div>
              ) : (
                <form onSubmit={handleQuizSubmit} className="space-y-4" id="form-course-assessment">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{selectedCourse.quizzes[0].question}</p>
                  <div className="space-y-2">
                    {selectedCourse.quizzes[0].options.map((opt, idx) => (
                      <label 
                        key={idx} 
                        className={`block text-xs p-3 rounded-lg border cursor-pointer transition-all ${
                          currentQuizAnswer === idx 
                            ? 'border-indigo-500 bg-indigo-50/30' 
                            : 'border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950'
                        }`}
                      >
                        <input
                          type="radio"
                          name="quiz"
                          className="mr-2"
                          checked={currentQuizAnswer === idx}
                          onChange={() => setCurrentQuizAnswer(idx)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>

                  {quizSuccess === false && (
                    <p className="text-xs text-rose-500 font-semibold">Incorrect option. Review lessons and try again.</p>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:bg-zinc-800"
                      id="btn-quiz-submit"
                    >
                      Submit Answer
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="telehealth-view">
          
          {/* Diagnostic registration case recorder form */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs h-fit space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Register Telehealth Profile</h3>
              <p className="text-xs text-zinc-400 mt-1">Submit pediatric symptom indicators fully offline. Sync occurs via autonomous drone schedules.</p>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4" id="form-telehealth-patient">
              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Patient Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ama Okafor"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="input-patient-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Patient Age (Years)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="26"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="input-patient-age"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Triage urgency</label>
                  <select 
                    value={patientTriage}
                    onChange={(e) => setPatientTriage(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                    id="select-triage-urgency"
                  >
                    <option value="green">Routine Care (Green)</option>
                    <option value="amber">Urgent Care (Amber)</option>
                    <option value="red">Immediate Emergency (Red)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Primary Condition / Symptoms</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Mild colic, nutrition guide"
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="input-patient-condition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wide mb-1">Clinical Treatment Log notes</label>
                <textarea 
                  rows={2}
                  placeholder="Dose administered, temperatures cataloged..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  id="textarea-patient-notes"
                />
              </div>

              <button
                type="submit"
                className="w-full text-xs font-semibold py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800"
                id="submit-patient-record"
              >
                Log Encrypted Profile
              </button>
            </form>
          </div>

          {/* Electronic Health Records checklist & WHO vaccination tracking lists */}
          <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Active Patient Records Ledger</span>
              <p className="text-xs text-zinc-400 mt-1">Secure local clinical storage. Red/Amber records trigger autonomous route overrides during drone syncing.</p>
            </div>

            <div className="space-y-3">
              {medicalCases.map(med => (
                <div key={med.id} className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        med.triage === 'red' ? 'bg-rose-500' : med.triage === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} title={`Triage priority: ${med.triage}`} />
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">{med.name} • {med.age} Yrs</h4>
                    </div>
                    <p className="text-xs text-zinc-650 dark:text-zinc-300 font-medium">Condition: {med.condition}</p>
                    <p className="text-[10px] text-zinc-400 italic font-mono uppercase tracking-wide">Notes: {med.notes}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 font-mono">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium ${
                      med.isSynced 
                        ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400' 
                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 animate-pulse'
                    }`}>
                      {med.isSynced ? 'SYNCHRONIZED' : 'QUEUED (OFFLINE)'}
                    </span>
                    <span className="text-[8px] text-zinc-400">PID: #{med.id.slice(-4).toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Offline Maternal checklist */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
              <h4 className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest">WHO Maternal Risk Checklists</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="p-3 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-orange-50/30">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">Maternal Red Flags</span>
                  <p className="text-[10px] text-zinc-450 leading-relaxed">Visual headache, blurred vision, swelling hands. Prompt immediate drone-sync reporting or referral transport.</p>
                </div>
                <div className="p-3 border border-zinc-150 dark:border-zinc-800 rounded-xl bg-indigo-50/20">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 block mb-1">Sanitation & Water</span>
                  <p className="text-[10px] text-zinc-450 leading-relaxed font-mono">Formula check: 1L water + boiling peak 5 minutes + sterile cooling basins. Stores 24 hours.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
