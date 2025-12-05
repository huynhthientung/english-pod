import { Coffee, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-0 py-4 border-t border-zinc-200/50 dark:border-zinc-700/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left transition-colors max-w-4xl mx-auto px-4 lg:px-6">

            <div className="text-sm text-zinc-500 dark:text-zinc-500">
                <p>&copy; {new Date().getFullYear()} EnglishPod Modern. All rights reserved.</p>
                <p className="mt-1 flex items-center justify-center md:justify-start gap-1">
                    Made with <Heart size={12} className="text-red-500 fill-red-500" /> by TungHT
                </p>
            </div>

            <a
                href="https://www.buymeacoffee.com/tunght"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
                <Coffee size={18} className="transition-transform group-hover:rotate-12" />
                <span>Buy me a coffee</span>
            </a>

        </footer>
    );
}
