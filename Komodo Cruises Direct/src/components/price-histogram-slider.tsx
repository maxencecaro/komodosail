import { useMemo, useRef, useCallback, useEffect, useState } from "react";

interface Props {
  prices: number[];
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
}

export function PriceHistogramSlider({ prices, min, max, step = 2, value, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const BUCKETS = 56;
  const buckets = useMemo(() => {
    const arr = new Array(BUCKETS).fill(0);
    const w = (max - min) / BUCKETS;
    for (const p of prices) {
      if (p < min || p > max) continue;
      const i = Math.min(BUCKETS - 1, Math.floor((p - min) / w));
      arr[i]++;
    }
    return arr;
  }, [prices, min, max]);

  const peak = Math.max(...buckets, 1);
  const pct = ((value - min) / (max - min)) * 100;

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(Math.min(max, Math.max(min, snapped)));
    },
    [min, max, step, onChange],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => updateFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, updateFromClientX]);

  const isMaxed = value >= max;

  return (
    <div className="w-full">
      {/* Histogram */}
      <div
        className="relative h-16 flex items-end gap-[2px] px-1 cursor-pointer select-none"
        onPointerDown={(e) => {
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
      >
        {buckets.map((c, i) => {
          const center = ((i + 0.5) / BUCKETS) * 100;
          const active = center <= pct;
          const h = c === 0 ? 4 : 6 + (c / peak) * 52;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-colors ${
                active ? "bg-orange-300" : "bg-muted-foreground/25"
              }`}
              style={{ height: `${h}px` }}
            />
          );
        })}
      </div>

      {/* Track + thumb */}
      <div
        ref={trackRef}
        className="relative h-1 mx-1 mt-1 bg-muted-foreground/20 rounded-full cursor-pointer"
        onPointerDown={(e) => {
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-orange-300 rounded-full"
          style={{ width: `${pct}%` }}
        />
        <button
          type="button"
          aria-label="Budget maximum"
          onPointerDown={(e) => {
            e.stopPropagation();
            setDragging(true);
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-6 rounded-full bg-background border border-border shadow-md hover:scale-110 transition-transform"
          style={{ left: `${pct}%` }}
        />
      </div>

      {/* Custom budget input */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Entrez votre budget</span>
        <div className="flex items-center gap-1 px-4 py-2 rounded-full border border-border bg-card focus-within:border-foreground/40 focus-within:ring-2 focus-within:ring-orange-300/40 transition">
          <span className="text-sm text-muted-foreground">$</span>
          <input
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              const raw = Number(e.target.value);
              if (Number.isNaN(raw)) return;
              const clamped = Math.min(max, Math.max(min, Math.round(raw / step) * step));
              onChange(clamped);
            }}
            className="w-20 bg-transparent text-sm font-medium tabular-nums outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {isMaxed && <span className="text-sm">+</span>}
        </div>
      </div>
    </div>
  );
}
