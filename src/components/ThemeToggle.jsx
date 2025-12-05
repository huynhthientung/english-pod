import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import classNames from 'classnames';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
            {['light', 'system', 'dark'].map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={classNames(
                        "p-1.5 rounded-full transition-all duration-200",
                        theme === t
                            ? "bg-white dark:bg-zinc-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    )}
                    title={`Switch to ${t} theme`}
                >
                    {t === 'light' && <Sun size={14} />}
                    {t === 'dark' && <Moon size={14} />}
                    {t === 'system' && <Laptop size={14} />}
                </button>
            ))}
        </div>
    );
}
