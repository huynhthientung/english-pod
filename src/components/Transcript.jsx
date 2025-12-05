import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Transcript = ({ episode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isVisible && episode.transcript_id) {
            setLoading(true);
            setError(false);
            // Ensure path matches what fetch_transcripts.js saved
            const url = `./transcripts/${episode.transcript_id}.html?v=${Date.now()}`; // Add cache bust just in case

            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error("Transcript missing");
                    return res.text();
                })
                .then(html => {
                    // Basic cleanup if needed. The archive.org HTML might be full page.
                    // We want to remove html, head, body tags if they exist and just keep inner content.
                    // But doing simple replace is risky. Let's just render it and use CSS to contain it.
                    setContent(html);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError(true);
                    setLoading(false);
                });
        }
    }, [isVisible, episode.transcript_id]);

    // Clean html content to avoid double body/head tags
    const sanitizedContent = content
        .replace(/<!DOCTYPE html>/i, '')
        .replace(/<html[^>]*>/i, '')
        .replace(/<\/html>/i, '')
        .replace(/<head>[\s\S]*?<\/head>/i, '') // Remove head entirely
        .replace(/<body[^>]*>/i, '<div class="transcript-body">')
        .replace(/<\/body>/i, '</div>');

    return (
        <div className="glass-card rounded-2xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Transcript / Notes</h3>
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 transition-colors text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200"
                >
                    {isVisible ? <><EyeOff size={16} /> Hide</> : <><Eye size={16} /> Show</>}
                </button>
            </div>

            {isVisible && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    {loading && (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
                            Could not load transcript for this episode.
                        </div>
                    )}

                    {!loading && !error && (
                        <div
                            className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 transcript-content"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                    )}
                </div>
            )}

            {!isVisible && (
                <div className="text-center py-12 text-zinc-500 dark:text-zinc-500">
                    <p>Click "Show" to view the transcript and vocabulary notes.</p>
                </div>
            )}
        </div>
    );
};

export default Transcript;
