import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { LiteClient } from "algoliasearch/lite";
import type { SearchConfig, SearchRecord } from "../lib/search";

type HighlightField = { value: string; matchLevel?: string };

type SearchHit = Pick<
  SearchRecord,
  "objectID" | "url" | "title" | "code" | "name" | "excerpt"
> & {
  _highlightResult?: { title?: HighlightField };
  _snippetResult?: { content?: HighlightField; excerpt?: HighlightField };
};

type Status = "idle" | "loading" | "done" | "error";

// Algolia does not escape record text, so matches are wrapped in plain-text
// markers and turned into <mark> elements here instead of injecting HTML.
const MARK_OPEN = "⁣hl⁣";
const MARK_CLOSE = "⁣/hl⁣";

function highlighted(value: string): ReactNode {
  return value.split(MARK_OPEN).map((part, index) => {
    if (index === 0) {
      return part;
    }
    const [match, ...rest] = part.split(MARK_CLOSE);
    return (
      <span key={index}>
        <mark className="rounded-sm bg-primary-soft text-inherit">{match}</mark>
        {rest.join("")}
      </span>
    );
  });
}

function hitTitle(hit: SearchHit) {
  const title = hit._highlightResult?.title?.value ?? hit.title;
  // Drop the leading "EP73 " — the code is shown on its own.
  return title.startsWith(hit.code) ? title.slice(hit.code.length).trim() : title;
}

function hitSummary(hit: SearchHit) {
  const { content, excerpt } = hit._snippetResult ?? {};
  if (content && content.matchLevel !== "none") {
    return content.value;
  }
  return excerpt?.value ?? hit.excerpt;
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function Search({ appId, searchKey, indexName }: SearchConfig) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const clientRef = useRef<Promise<LiteClient> | null>(null);
  const requestRef = useRef(0);
  const composingRef = useRef(false);
  const listId = useId();

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [active, setActive] = useState(0);

  // The Algolia client is only downloaded once someone actually opens search.
  const getClient = useCallback(() => {
    clientRef.current ??= import("algoliasearch/lite").then(({ liteClient }) =>
      liteClient(appId, searchKey),
    );
    return clientRef.current;
  }, [appId, searchKey]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) {
      return;
    }
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    inputRef.current?.select();
    void getClient().catch(() => {
      clientRef.current = null;
    });
  }, [getClient]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const shortcut =
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing);

      if (shortcut) {
        event.preventDefault();
        open();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const runSearch = useCallback(
    async (text: string) => {
      const request = ++requestRef.current;
      const trimmed = text.trim();

      if (!trimmed) {
        setHits([]);
        setStatus("idle");
        return;
      }

      setStatus("loading");
      try {
        const client = await getClient();
        const { results } = await client.searchForHits<SearchHit>({
          requests: [
            {
              indexName,
              query: trimmed,
              hitsPerPage: 8,
              attributesToRetrieve: ["url", "title", "code", "name", "excerpt"],
              attributesToHighlight: ["title"],
              attributesToSnippet: ["content:30", "excerpt:30"],
              highlightPreTag: MARK_OPEN,
              highlightPostTag: MARK_CLOSE,
            },
          ],
        });

        if (request !== requestRef.current) {
          return;
        }
        setHits(results[0]?.hits ?? []);
        setActive(0);
        setStatus("done");
      } catch {
        if (request !== requestRef.current) {
          return;
        }
        clientRef.current = null;
        setHits([]);
        setStatus("error");
      }
    },
    [getClient, indexName],
  );

  // Debounced; skipped while an IME is composing so half-typed pinyin is not searched.
  useEffect(() => {
    if (composingRef.current) {
      return;
    }
    const timer = window.setTimeout(() => void runSearch(query), 160);
    return () => window.clearTimeout(timer);
  }, [query, runSearch]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || hits.length === 0) {
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + hits.length) % hits.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const hit = hits[active];
      if (hit) {
        window.location.assign(hit.url);
      }
    }
  }

  const trimmed = query.trim();
  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="搜索节目"
        title="搜索节目"
        aria-haspopup="dialog"
        className="flex size-11 cursor-pointer items-center justify-center text-soft transition-colors duration-100 hover:text-ink"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="搜索节目"
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        onClick={(event) => {
          // A click on the dialog element itself is a click on the backdrop.
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden whitespace-normal rounded-2xl border border-line-strong bg-page p-0 text-left text-body shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[70vh] flex-col">
          <div className="flex items-center gap-3 border-b border-line px-4">
            <SearchIcon className="h-5 w-5 shrink-0 text-mute" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={hits.length > 0}
              aria-controls={listId}
              aria-activedescendant={
                hits.length > 0 ? optionId(active) : undefined
              }
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              placeholder="搜索节目标题、话题或 Shownotes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              onCompositionStart={() => {
                composingRef.current = true;
              }}
              onCompositionEnd={(event) => {
                composingRef.current = false;
                void runSearch(event.currentTarget.value);
              }}
              className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-mute"
            />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="shrink-0 cursor-pointer rounded-md border border-line px-2 py-1 font-mono text-xs text-mute transition-colors duration-100 hover:border-line-strong hover:text-ink"
            >
              <span className="sm:hidden">关闭</span>
              <span className="hidden sm:inline">Esc</span>
            </button>
          </div>

          <div
            className="at-scrollbar min-h-0 flex-1 overflow-y-auto"
            aria-live="polite"
          >
            <ul ref={listRef} id={listId} role="listbox" aria-label="搜索结果">
              {hits.map((hit, index) => (
                <li
                  key={hit.objectID}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  onMouseMove={() => setActive(index)}
                  className="border-b border-line last:border-b-0 aria-selected:bg-chip"
                >
                  <a href={hit.url} tabIndex={-1} className="block px-4 py-3">
                    <span className="flex items-baseline gap-2">
                      <span className="shrink-0 font-mono text-xs text-primary">
                        {hit.code}
                      </span>
                      <span className="font-display text-base text-ink">
                        {highlighted(hitTitle(hit))}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-soft">
                      {highlighted(hitSummary(hit))}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {hits.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-mute">
                {status === "error"
                  ? "搜索暂时不可用，请稍后再试"
                  : !trimmed
                    ? "输入关键词，搜索全部节目"
                    : status === "done"
                      ? `没有找到与「${trimmed}」相关的节目`
                      : "搜索中…"}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 text-xs text-mute">
            <span className="hidden sm:inline">↑↓ 选择 · Enter 打开</span>
            <a
              href="https://www.algolia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto transition-colors duration-100 hover:text-ink"
            >
              Search by Algolia
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
