'use client';
import Timer from '@/components/Timer';
import TaskList from '@/components/TaskList';
import SoundMixer from '@/components/SoundMixer';
import PrayerTimes from '@/components/PrayerTimes';

export default function Home() {
  return (
    <div className="min-h-screen bg-zen-bg text-zen-text p-4 md:p-8 font-sans selection:bg-zen-primary/30 flex flex-col">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide text-white">
            Zen Focus Space
          </h1>
          <p className="text-zen-muted text-sm mt-1">
            Reclaim your concentration
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zen-primary to-zen-secondary animate-pulse-slow"></div>
      </header>

      <main className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full items-start">

        {/* Column 1: Timer */}
        <section className="flex flex-col">
          <Timer />
        </section>

        {/* Column 2: Tasks */}
        <section className="flex flex-col min-h-[300px]">
          <TaskList />
        </section>

        {/* Column 3: Sounds */}
        <section className="flex flex-col">
          <SoundMixer />
        </section>

        {/* Column 4: Prayer */}
        <section className="flex flex-col">
          <div className="flex-1 min-h-[300px]">
            <PrayerTimes />
          </div>
        </section>

      </main>

      <footer className="max-w-6xl mx-auto mt-12 text-center text-zen-muted text-xs w-full">
        <p>© {new Date().getFullYear()} Zen Focus Space. Stay productive.</p>
      </footer>
    </div>
  );
}
