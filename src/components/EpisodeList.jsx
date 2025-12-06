import { useState, useMemo } from 'react';
import classNames from 'classnames';
import { Search, PlayCircle } from 'lucide-react';

const EpisodeList = ({ episodes, currentId, onSelect }) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return episodes;
        const lower = search.toLowerCase();
        return episodes.filter(ep =>
            ep.title.toLowerCase().includes(lower) ||
            ep.original_title.toString().toLowerCase().includes(lower)
        );
    }, [episodes, search]);

    // Virtualization would be good here but simpler implementation first
    return (
        <div className="flex flex-col flex-1 min-h-0 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/50">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search episodes..."
                        className="w-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {filtered.map((ep) => (
                    <div
                        key={ep.id}
                        onClick={() => onSelect(ep.id)}
                        className={classNames(
                            "p-4 cursor-pointer border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/40 transition-colors flex items-center gap-3 group",
                            {
                                "bg-indigo-50 dark:bg-zinc-800/60 border-l-4 border-l-indigo-500": ep.id === currentId,
                                "border-l-4 border-l-transparent": ep.id !== currentId
                            }
                        )}
                    >
                        <div className={classNames(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                            ep.id === currentId ? "bg-indigo-600 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        )}>
                            {ep.id === currentId ? <PlayCircle size={20} /> : <span className="text-xs font-bold font-mono">{ep.id}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className={classNames("text-sm font-medium truncate transition-colors", ep.id === currentId ? "text-indigo-700 dark:text-indigo-200" : "text-zinc-700 dark:text-zinc-300")}>
                                {ep.title}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 truncate">
                                {ep.level}
                            </p>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-zinc-500 text-sm">
                        No episodes found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EpisodeList;
