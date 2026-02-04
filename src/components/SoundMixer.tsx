import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Flame, Waves, Wind, Play, Pause, Coffee, Trees, Music, Bird, AlertCircle } from 'lucide-react';
import { Sound } from '@/types';

const AVAILABLE_SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', src: '/sounds/rain.ogg', icon: <CloudRain size={20} /> },
    { id: 'fire', name: 'Fireplace', src: '/sounds/fire.ogg', icon: <Flame size={20} /> },
    { id: 'stream', name: 'River', src: '/sounds/stream.ogg', icon: <Waves size={20} /> },
    { id: 'wind', name: 'Wind', src: '/sounds/wind.ogg', icon: <Wind size={20} /> },
    { id: 'cafe', name: 'Cafe Ambience', src: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg', icon: <Coffee size={20} /> },
    { id: 'forest', name: 'Forest', src: 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg', icon: <Trees size={20} /> },
    { id: 'white-noise', name: 'White Noise', src: 'https://actions.google.com/sounds/v1/ambiences/white_noise.ogg', icon: <Music size={20} /> },
    { id: 'birds', name: 'Morning Birds', src: 'https://actions.google.com/sounds/v1/animals/birds_singing.ogg', icon: <Bird size={20} /> },
];

const AudioController = ({
    sound,
    isPlaying,
    volume,
    onError
}: {
    sound: Sound;
    isPlaying: boolean;
    volume: number;
    onError: (id: string, message: string) => void;
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio();
        // Add crossOrigin to handle potential CORS issues with external URLs
        audio.crossOrigin = "anonymous";
        audio.src = sound.src;
        audio.loop = true;
        // Ensure volume is finite and between 0 and 1
        audio.volume = isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.5;

        audio.addEventListener('error', (e) => {
            const error = audio.error;
            let message = "Unknown error";
            if (error) {
                switch (error.code) {
                    case 1: message = "Load aborted"; break;
                    case 2: message = "Network error"; break;
                    case 3: message = "Decode error"; break;
                    case 4: message = "Source not supported"; break;
                }
            }
            console.error(`Audio error for ${sound.name}:`, message);
            onError(sound.id, message);
        });

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = ""; // Clear source to stop downloads
            audioRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sound.src]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error(`Play failed for ${sound.name}:`, error);
                        onError(sound.id, error.message || "Playback failed");
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, sound.id]); // Fix: sound.id for better reactivity if sources swap

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.5;
        }
    }, [volume]);

    return null;
};

export default function SoundMixer() {
    const [activeSounds, setActiveSounds] = useState<Record<string, { isPlaying: boolean; volume: number; error?: string }>>({});

    const handleError = (id: string, message: string) => {
        setActiveSounds(prev => {
            const current = prev[id] || { isPlaying: false, volume: 0.5 };
            // Avoid infinite loops if error keeps firing
            if (current.error === message) return prev;
            return {
                ...prev,
                [id]: { ...current, isPlaying: false, error: message }
            };
        });
    };

    const toggleSound = (id: string) => {
        setActiveSounds(prev => {
            const current = prev[id] || { isPlaying: false, volume: 0.5 };

            // Default to playing with 50% volume if starting
            if (!prev[id]) {
                return { ...prev, [id]: { isPlaying: true, volume: 0.5 } };
            }
            // If there's an error, try to clear it and re-play
            if (current.error) {
                return { ...prev, [id]: { ...current, isPlaying: true, error: undefined } };
            }
            return { ...prev, [id]: { ...current, isPlaying: !current.isPlaying } };
        });
    };

    const changeVolume = (id: string, value: number) => {
        setActiveSounds(prev => {
            const current = prev[id] || { isPlaying: false, volume: 0.5 };
            return { ...prev, [id]: { ...current, volume: value } };
        });
    };

    return (
        <div className="bg-zen-card p-6 rounded-3xl shadow-lg border border-white/5 min-h-[300px] flex flex-col h-full">
            <h2 className="text-xl font-medium mb-6 text-zen-text flex items-center gap-3">
                <span className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"></span>
                Ambient Sounds
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {AVAILABLE_SOUNDS.map((sound) => {
                    const state = activeSounds[sound.id] || { isPlaying: false, volume: 0.5 };

                    return (
                        <div key={sound.id} className={`group bg-zen-accent/30 p-4 rounded-xl hover:bg-zen-accent/50 transition-all border ${state.error ? 'border-red-500/30' : 'border-transparent hover:border-white/5'}`}>
                            {/* Hidden Audio Controller */}
                            <AudioController
                                sound={sound}
                                isPlaying={state.isPlaying}
                                volume={state.volume}
                                onError={handleError}
                            />

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleSound(sound.id)}
                                    className={`p-2 rounded-xl transition-all active:scale-95 ${state.isPlaying
                                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]'
                                        : state.error
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-zen-card text-zen-muted'
                                        }`}
                                >
                                    {state.isPlaying ? <Pause size={18} strokeWidth={2.5} /> : <Play size={18} strokeWidth={2.5} className="ml-0.5" />}
                                </button>

                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`transition-colors ${state.isPlaying ? 'text-purple-400' : state.error ? 'text-red-400/60' : 'text-zen-muted'}`}>
                                                {sound.icon}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${state.isPlaying ? 'text-white' : state.error ? 'text-red-400' : 'text-zen-muted'}`}>
                                                {sound.name}
                                            </span>
                                        </div>
                                        {state.error && (
                                            <div className="group/error relative">
                                                <AlertCircle size={14} className="text-red-500 cursor-help" />
                                                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-red-900 text-red-100 text-[10px] rounded shadow-xl opacity-0 group-hover/error:opacity-100 pointer-events-none transition-opacity z-50">
                                                    {state.error}
                                                </div>
                                            </div>
                                        )}
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
                                            disabled={!!state.error}
                                            style={{
                                                background: state.error
                                                    ? '#450a0a'
                                                    : `linear-gradient(to right, #a855f7 ${state.volume * 100}%, #1a1c23 ${state.volume * 100}%)`
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
