'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Clock, Play, Pause, RotateCcw, ChevronDown } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const TIMER_OPTIONS = [
    { label: 'No Timer', value: 0 },
    { label: '15 Minutes', value: 15 * 60 },
    { label: '30 Minutes', value: 30 * 60 },
    { label: '45 Minutes', value: 45 * 60 },
    { label: '1 Hour', value: 60 * 60 },
];

export default function MasterAudio() {
    const {
        masterVolume,
        setMasterVolume,
        activeSounds,
        playAll,
        stopAll,
        resetAll,
        timerDuration,
        setTimerDuration,
        timeLeft
    } = useAudio();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAnyPlaying = Object.values(activeSounds).some(s => s.isPlaying);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const selectedOption = TIMER_OPTIONS.find(opt => opt.value === timerDuration) || TIMER_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="max-w-[1600px] mx-auto w-full mb-8 grid grid-cols-1 md:flex md:flex-wrap items-stretch md:items-center gap-3 md:gap-4 animate-in fade-in slide-in-from-top-4 duration-700 relative z-50">
            {/* Master Volume */}
            <div className="bg-zen-card/80 backdrop-blur-md border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 group hover:border-white/10 transition-all flex-1 md:flex-initial md:min-w-[320px]">
                <Volume2 className="text-zen-muted group-hover:text-purple-400 transition-colors" size={20} />
                <span className="text-sm font-medium text-zen-muted min-w-[60px]">Master</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="flex-1 md:w-32 h-1.5 bg-zen-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                    style={{
                        background: `linear-gradient(to right, #a855f7 ${masterVolume * 100}%, #1a1c23 ${masterVolume * 100}%)`
                    }}
                />
                <span className="text-xs font-mono text-zen-muted w-10 text-right">
                    {Math.round(masterVolume * 100)}%
                </span>
            </div>

            {/* Timer Dropdown */}
            <div className="bg-zen-card/80 backdrop-blur-md border border-white/5 px-6 py-3 rounded-2xl flex items-center justify-between md:justify-start gap-4 group hover:border-white/10 transition-all flex-1 md:flex-initial md:min-w-[280px] relative z-[60]">
                <div className="flex items-center gap-4">
                    <Clock className="text-zen-muted group-hover:text-blue-400 transition-colors" size={20} />
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="bg-zen-bg text-sm text-white px-4 py-2 rounded-xl border border-white/10 hover:border-purple-500/50 focus:outline-none transition-all flex items-center justify-between gap-3 min-w-[150px]"
                        >
                            <span>{selectedOption.label}</span>
                            <ChevronDown size={14} className={`text-zen-muted transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-[#16181d] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-[999] animate-in fade-in zoom-in-95 duration-200">
                                <ul className="py-1 bg-[#16181d] opacity-100">
                                    {TIMER_OPTIONS.map((opt) => (
                                        <li
                                            key={opt.value}
                                            onClick={() => {
                                                setTimerDuration(opt.value);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${timerDuration === opt.value
                                                ? 'bg-purple-500 text-white'
                                                : 'text-zen-muted hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {opt.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                {timeLeft > 0 && (
                    <span className="text-xs font-mono text-blue-400 animate-pulse">
                        {formatTime(timeLeft)}
                    </span>
                )}
            </div>

            {/* Action Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-3 md:contents relative z-10">
                {/* Play/Pause All Button */}
                <button
                    onClick={isAnyPlaying ? stopAll : playAll}
                    className={`bg-gradient-to-r ${isAnyPlaying ? 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500' : 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'} text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all active:scale-95 shadow-lg shadow-purple-900/20 flex-1 md:flex-initial`}
                >
                    {isAnyPlaying ? (
                        <>
                            <Pause size={18} fill="currentColor" />
                            Pause All
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            Play All
                        </>
                    )}
                </button>

                {/* Reset Button */}
                <button
                    onClick={resetAll}
                    className="bg-zen-card/80 backdrop-blur-md border border-white/5 hover:bg-white/5 hover:border-white/10 text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all active:scale-95 flex-1 md:flex-initial"
                >
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>
        </div>
    );
}
