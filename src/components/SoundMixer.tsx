import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Flame, Waves, Wind, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Sound } from '@/types';

// Using local public sound files for reliability
const AVAILABLE_SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', src: '/sounds/rain.ogg', icon: <CloudRain size={20} /> },
    { id: 'fire', name: 'Fireplace', src: '/sounds/fire.ogg', icon: <Flame size={20} /> },
    { id: 'stream', name: 'River', src: '/sounds/stream.ogg', icon: <Waves size={20} /> },
    { id: 'wind', name: 'Wind', src: '/sounds/wind.ogg', icon: <Wind size={20} /> },
];

const AudioController = ({
    sound,
    isPlaying,
    volume
}: {
    sound: Sound;
    isPlaying: boolean;
    volume: number;
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio object once
        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audioRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sound.src]); // Re-init if src changes (unlikely)

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                // Handle promise to avoid "play request interrupted" errors
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error("Audio play failed:", error);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return null; // Logic only component
};

export default function SoundMixer() {
    const [activeSounds, setActiveSounds] = useState<Record<string, { isPlaying: boolean; volume: number }>>({});

    const toggleSound = (id: string) => {
        setActiveSounds(prev => {
            // Default to playing with 50% volume if starting
            if (!prev[id]) {
                return { ...prev, [id]: { isPlaying: true, volume: 0.5 } };
            }
            return { ...prev, [id]: { ...prev[id], isPlaying: !prev[id].isPlaying } };
        });
    };

    const changeVolume = (id: string, value: number) => {
        setActiveSounds(prev => {
            // If changing volume, ensure sound entry exists (even if paused)
            if (!prev[id]) {
                return { ...prev, [id]: { isPlaying: false, volume: value } };
            }
            return { ...prev, [id]: { ...prev[id], volume: value } };
        });
    };

    return (
        <div className="bg-zen-card p-6 rounded-3xl shadow-lg border border-white/5 min-h-[300px] flex flex-col h-full">
            <h2 className="text-xl font-medium mb-6 text-zen-text flex items-center gap-3">
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full"></span>
                Ambient Sounds
            </h2>

            <div className="space-y-3 flex-1">
                {AVAILABLE_SOUNDS.map((sound) => {
                    const state = activeSounds[sound.id] || { isPlaying: false, volume: 0.5 };

                    return (
                        <div key={sound.id} className="group bg-zen-accent/30 p-4 rounded-xl hover:bg-zen-accent/50 transition-all border border-transparent hover:border-white/5">
                            {/* Hidden Audio Controller */}
                            <AudioController
                                sound={sound}
                                isPlaying={state.isPlaying}
                                volume={state.volume}
                            />

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleSound(sound.id)}
                                    className={`p-2 rounded-xl transition-all active:scale-95 ${state.isPlaying
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-zen-card text-zen-muted'
                                        }`}
                                >
                                    {state.isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                                </button>

                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`transition-colors ${state.isPlaying ? 'text-indigo-400' : 'text-zen-muted'}`}>
                                            {sound.icon}
                                        </div>
                                        <span className={`text-sm font-medium ${state.isPlaying ? 'text-white' : 'text-zen-muted'}`}>
                                            {sound.name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={state.volume}
                                            onChange={(e) => changeVolume(sound.id, parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zen-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white transition-opacity"
                                            disabled={!state.isPlaying && !activeSounds[sound.id]}
                                            style={{
                                                background: `linear-gradient(to right, #818cf8 ${state.volume * 100}%, #1a1c23 ${state.volume * 100}%)`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
