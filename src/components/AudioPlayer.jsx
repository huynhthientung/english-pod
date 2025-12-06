import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, ArrowRightCircle, FastForward, Rewind } from 'lucide-react';

const AudioPlayer = ({ episode, onNext, onPrev, hasNext, hasPrev }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Feature States
    const [autoPlayNext, setAutoPlayNext] = useState(true);
    const [isLooping, setIsLooping] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Initial load effects
    useEffect(() => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.playbackRate = playbackRate;

            // Try autoplay if enabled (though usually blocked by browsers on first load, works on navigation)
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }
        }
    }, [episode.id]);

    // Volume & Mute effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Playback Speed effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setCurrentTime(current);
        setDuration(dur);
        if (dur) setProgress((current / dur) * 100);
    };

    const handleSeek = (e) => {
        if (!audioRef.current) return;
        const width = e.currentTarget.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const duration = audioRef.current.duration;
        const newTime = (clickX / width) * duration;
        audioRef.current.currentTime = newTime;
        setProgress((newTime / duration) * 100);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        if (isLooping) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPlaying(true);
        } else if (autoPlayNext && hasNext) {
            onNext();
        }
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
                onEnded={handleEnded}
            />

            {/* Progress Bar */}
            <div className="w-full group cursor-pointer" onClick={handleSeek}>
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700/50 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 group-hover:from-indigo-400 group-hover:to-cyan-300 transition-all duration-100 absolute top-0 left-0"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Time Display (Left on desktop) */}
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono hidden md:block w-24">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                {/* Main Controls */}
                <div className="flex items-center gap-4 lg:gap-6">
                    {/* Skip Buttons */}
                    <button
                        className="text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-2"
                        onClick={() => { audioRef.current.currentTime -= 10 }}
                        title="-10s"
                    >
                        <Rewind size={20} />
                    </button>

                    {/* Prev Episode */}
                    <button
                        className={`text-zinc-400 transition-colors p-2 ${hasPrev ? 'hover:text-indigo-600 dark:hover:text-white' : 'opacity-30 cursor-not-allowed'}`}
                        onClick={onPrev}
                        disabled={!hasPrev}
                        title="Previous Episode"
                    >
                        <SkipBack size={24} />
                    </button>

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        className="p-4 bg-indigo-600 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform shadow-lg shadow-indigo-500/30 dark:shadow-white/10"
                    >
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                    </button>

                    {/* Next Episode */}
                    <button
                        className={`text-zinc-400 transition-colors p-2 ${hasNext ? 'hover:text-indigo-600 dark:hover:text-white' : 'opacity-30 cursor-not-allowed'}`}
                        onClick={onNext}
                        disabled={!hasNext}
                        title="Next Episode"
                    >
                        <SkipForward size={24} />
                    </button>

                    {/* Skip Forward */}
                    <button
                        className="text-zinc-400 hover:text-indigo-600 dark:hover:text-white transition-colors p-2"
                        onClick={() => { audioRef.current.currentTime += 10 }}
                        title="+10s"
                    >
                        <FastForward size={20} />
                    </button>
                </div>

                {/* Right Side: Volume & Modes */}
                <div className="flex items-center gap-4">
                    {/* Loop Toggle */}
                    <button
                        onClick={() => setIsLooping(!isLooping)}
                        className={`p-2 rounded-lg transition-colors ${isLooping ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        title="Loop Episode"
                    >
                        <Repeat size={18} />
                    </button>

                    {/* Autoplay Toggle */}
                    <button
                        onClick={() => setAutoPlayNext(!autoPlayNext)}
                        className={`p-2 rounded-lg transition-colors ${autoPlayNext ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        title="Autoplay Next"
                    >
                        <ArrowRightCircle size={18} className={autoPlayNext ? "" : "opacity-50"} />
                    </button>

                    {/* Playback Speed */}
                    <button
                        onClick={() => {
                            const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                            const idx = speeds.indexOf(playbackRate);
                            setPlaybackRate(speeds[(idx + 1) % speeds.length]);
                        }}
                        className="w-12 text-xs font-bold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-700/50 rounded px-1 py-0.5 hover:border-indigo-500 dark:hover:border-indigo-400"
                        title="Playback Speed"
                    >
                        {playbackRate}x
                    </button>

                    {/* Volume Control */}
                    <div className="hidden md:flex items-center gap-2 group">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-in-out">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => {
                                    setVolume(parseFloat(e.target.value));
                                    setIsMuted(false);
                                }}
                                className="w-20 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Time Display (Visible only on small screens) */}
            <div className="md:hidden flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono px-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default AudioPlayer;
