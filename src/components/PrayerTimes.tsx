'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Search, Loader2 } from 'lucide-react';

interface PrayerTimesData {
    timings: {
        Fajr: string;
        Dhuhr: string;
        Asr: string;
        Maghrib: string;
        Isha: string;
        [key: string]: string;
    };
    date: {
        readable: string;
        hijri: {
            date: string;
            month: {
                en: string;
            };
            weekday: {
                en: string;
            };
        };
    };
}

export default function PrayerTimes() {
    const [loading, setLoading] = useState(false);
    const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
    const [error, setError] = useState('');
    const [city, setCity] = useState('Jakarta');
    const [country, setCountry] = useState('Indonesia');
    const [searchCity, setSearchCity] = useState('Jakarta');

    const fetchPrayerTimes = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(
                `https://api.aladhan.com/v1/timingsByCity?city=${searchCity}&country=${country}&method=2`
            );
            const data = await response.json();

            if (data.code === 200) {
                setPrayerData(data.data);
                setCity(searchCity); // Update display city only on success
            } else {
                setError('Location not found');
            }
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchCity, country]);

    useEffect(() => {
        fetchPrayerTimes();
    }, [fetchPrayerTimes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchPrayerTimes();
    };

    const prayers = [
        { name: 'Fajr', icon: <Moon size={18} className="text-zen-primary" /> },
        { name: 'Dhuhr', icon: <Sun size={18} className="text-yellow-400" /> },
        { name: 'Asr', icon: <Sun size={18} className="text-orange-400" /> },
        { name: 'Maghrib', icon: <Moon size={18} className="text-zen-secondary" /> },
        { name: 'Isha', icon: <Moon size={18} className="text-zen-accent" /> },
    ];

    return (
        <div className="bg-zen-card p-6 rounded-3xl shadow-lg border border-zen-accent/10 flex flex-col relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-zen-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-zen-text flex items-center gap-2">
                    <span className="w-1.5 h-6 rounded-full bg-zen-secondary"></span>
                    Prayer Times
                </h2>
                <div className="text-xs text-zen-muted text-right">
                    {prayerData?.date.hijri.weekday.en}, {prayerData?.date.readable}
                </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSubmit} className="relative mb-6 space-y-2">
                <div className="relative">
                    <input
                        type="text"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        placeholder="City..."
                        className="w-full bg-zen-bg rounded-xl py-2 pl-9 pr-4 text-zen-text text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/30 transition-all border border-transparent focus:border-zen-primary/20"
                    />
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zen-muted" />
                </div>
                <div className="relative flex gap-2">
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country..."
                        className="w-full bg-zen-bg rounded-xl py-2 pl-3 pr-10 text-zen-text text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/30 transition-all border border-transparent focus:border-zen-primary/20"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-zen-card hover:bg-zen-primary/20 text-zen-muted hover:text-zen-primary rounded-xl transition-colors shrink-0"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    </button>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl text-center">
                    {error}
                </div>
            )}

            {/* Prayer List */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                {prayers.map((prayer) => (
                    <div
                        key={prayer.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-zen-bg/50 border border-transparent hover:border-zen-accent/10 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zen-card group-hover:bg-zen-bg transition-colors">
                                {prayer.icon}
                            </div>
                            <span className="text-zen-text font-medium">{prayer.name}</span>
                        </div>
                        <span className="text-zen-highlight font-mono font-medium text-lg">
                            {prayerData?.timings[prayer.name] || '--:--'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-zen-muted">
                    Location: <span className="text-zen-primary font-medium">{city}, {country}</span>
                </p>
            </div>
        </div>
    );
}
