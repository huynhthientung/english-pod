import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const AudioPlayer = ({ episode }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);

    // Reset state when episode changes
    useEffect(() => {
        setIsPlaying(false);
        setProgress(0);
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(error => {
                        console.log("Autoplay prevented:", error);
                        setIsPlaying(false);
                    });
            }
        }
    }, [episode.id]);

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setDuration(dur);
        setProgress((current / dur) * 100);
    };

    const handleSeek = (e) => {
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const duration = audioRef.current.duration;
        audioRef.current.currentTime = (clickX / width) * duration;
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-4">
            <audio
                ref={audioRef}
                src={episode.mp3}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Progress Bar */}
            <div className="w-full group cursor-pointer" onClick={handleSeek}>
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 group-hover:from-indigo-400 group-hover:to-cyan-300 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                {/* Helper time */}
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono w-12">
                    {formatTime(audioRef.current?.currentTime)}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    <button className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors" onClick={() => { audioRef.current.currentTime -= 10 }}>
                        <SkipBack size={20} />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="p-3 bg-indigo-600 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30 dark:shadow-white/10"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors" onClick={() => { audioRef.current.currentTime += 10 }}>
                        <SkipForward size={20} />
                    </button>
                </div>

                {/* Volume / Duration */}
                <div className="flex items-center gap-2 w-12 justify-end">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
