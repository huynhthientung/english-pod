import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Coffee, Heart, X } from 'lucide-react';

export default function Footer() {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <>
            <footer className="mt-0 py-4 border-t border-zinc-200/50 dark:border-zinc-700/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left transition-colors max-w-4xl mx-auto px-4 lg:px-6">

                <div className="text-sm text-zinc-500 dark:text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} EnglishPod. All rights reserved.</p>
                    <p className="mt-1 flex items-center justify-center md:justify-start gap-1">
                        Made with <Heart size={12} className="text-red-500 fill-red-500" /> by Huynh Thien Tung
                    </p>
                </div>

                <button
                    onClick={() => setShowDialog(true)}
                    className="group flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Coffee size={18} className="transition-transform group-hover:rotate-12" />
                    <span>Buy me a coffee</span>
                </button>

            </footer>

            {/* Dialog - Using Portal to render at body level */}
            {showDialog && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowDialog(false)}
                >
                    <div
                        className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDialog(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <X size={20} className="text-zinc-500" />
                        </button>

                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                <Coffee size={24} className="text-yellow-500" />
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                    Support Me
                                </h3>
                            </div>

                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Scan the QR code to support via MoMo
                            </p>

                            <div className="flex justify-center">
                                <img
                                    src="./momo.jpg"
                                    alt="MoMo QR Code"
                                    className="w-64 h-64 rounded-xl shadow-lg object-cover"
                                />
                            </div>

                            <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                Thank you for your support! ❤️
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
