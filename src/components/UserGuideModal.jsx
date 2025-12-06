import { X, BookOpen, Headphones, Mic, Repeat, FileText } from 'lucide-react';

const UserGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                    <X size={24} />
                </button>

                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">How to Learn Efficiently</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">Maximize your English mastery with this simple workflow.</p>
                </div>

                <div className="space-y-6">
                    <GuideStep
                        icon={<Headphones size={20} />}
                        title="1. Active Listening"
                        desc="Listen to the full episode without looking at the transcript. Focus on understanding the main ideas and context."
                        color="text-blue-500"
                        bg="bg-blue-50 dark:bg-blue-500/10"
                    />

                    <GuideStep
                        icon={<FileText size={20} />}
                        title="2. Transcript Review"
                        desc="Read the transcript while listening. Note any words or phrases you didn't catch during the first listen."
                        color="text-emerald-500"
                        bg="bg-emerald-50 dark:bg-emerald-500/10"
                    />

                    <GuideStep
                        icon={<BookOpen size={20} />}
                        title="3. Vocabulary Study"
                        desc="Review the Key and Supplementary Vocabulary sections below the transcript. Understanding these nuances is key to fluency."
                        color="text-amber-500"
                        bg="bg-amber-50 dark:bg-amber-500/10"
                    />

                    <GuideStep
                        icon={<Repeat size={20} />}
                        title="4. Shadowing Technique"
                        desc="Listen again and repeat after the speakers immediately. Mimic their speed, intonation, and emotion. This builds muscle memory."
                        color="text-purple-500"
                        bg="bg-purple-50 dark:bg-purple-500/10"
                    />

                    <GuideStep
                        icon={<Mic size={20} />}
                        title="5. Summary & Usage"
                        desc="Try to summarize the episode in your own words, incorporating the new vocabulary you just learned."
                        color="text-rose-500"
                        bg="bg-rose-50 dark:bg-rose-500/10"
                    />
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Got it, let's start!
                    </button>
                </div>
            </div>
        </div>
    );
};

const GuideStep = ({ icon, title, desc, color, bg }) => (
    <div className="flex gap-4 items-start p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700/50 transition-colors bg-white/50 dark:bg-zinc-900/30">
        <div className={`flex-shrink-0 p-3 rounded-lg ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default UserGuideModal;
