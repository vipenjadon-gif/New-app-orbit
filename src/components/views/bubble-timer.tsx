me={`relative z-10 flex items-center gap-1.5 px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === "break" ? "text-white" : "text-muted-foreground"
            }`}
          >
            <Coffee size={14} /> Break
          </button>
        </div>
      </div>

      {/* Bubble timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative" style={{ width: size + 80, height: size + 80 }}>
          {/* Glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full gradient-accent opacity-25 blur-3xl"
            animate={
              state === "running"
                ? { scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }
                : { scale: 1, opacity: 0.2 }
            }
            transition={
              state === "running"
                ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />
          <motion.div
            className="absolute rounded-full glass-card"
            style={{
              inset: 20,
            }}
            animate={
              state === "running"
                ? { boxShadow: ["0 0 60px var(--glow), inset 0 1px 0 rgba(255,255,255,0.08)", "0 0 100px var(--glow), inset 0 1px 0 rgba(255,255,255,0.12)", "0 0 60px var(--glow), inset 0 1px 0 rgba(255,255,255,0.08)"] }
                : {}
            }
            transition={
              state === "running"
                ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.4 }
            }
          />

          {/* SVG progress ring */}
          <svg
            width={size + 80}
            height={size + 80}
            viewBox={`0 0 ${size + 80} ${size + 80}`}
            className="absolute inset-0 -rotate-90"
            style={{ transform: "rotate(-90deg)" }}
          >
            <defs>
              <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-1)" />
                <stop offset="100%" stopColor="var(--accent-2)" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx={(size + 80) / 2}
              cy={(size + 80) / 2}
              r={radius + 22}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={stroke}
            />
            {/* Progress */}
            <motion.circle
              cx={(size + 80) / 2}
              cy={(size + 80) / 2}
              r={radius + 22}
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 8px var(--glow))" }}
            />
            {/* Bubble dots around */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * 2 * Math.PI;
              const dotR = radius + 8;
              const cx = (size + 80) / 2 + Math.cos(angle) * dotR;
              const cy = (size + 80) / 2 + Math.sin(angle) * dotR;
              const lit = i / 60 <= progress;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={lit ? 2.4 : 1.4}
                  fill={lit ? "url(#ring-gradient)" : "rgba(255,255,255,0.1)"}
                  opacity={lit ? 0.9 : 0.4}
                />
              );
            })}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Inner concentric glow rings (only visible when running) */}
            <AnimatePresence>
              {state === "running" && (
                <>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute rounded-full border border-primary/15"
                    style={{ width: size * 0.7, height: size * 0.7 }}
                    transition={{
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" },
                      opacity: { duration: 0.4 },
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute rounded-full border border-primary/10"
                    style={{ width: size * 0.5, height: size * 0.5 }}
                    transition={{
                      scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatType: "reverse", delay: 0.3 },
                      opacity: { duration: 0.4 },
                    }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Floating bubble accents inside the timer */}
            <AnimatePresence>
              {state === "running" &&
                Array.from({ length: 5 }).map((_, i) => {
                  const angle = (i / 5) * Math.PI * 2;
                  const r = 80 + Math.sin(i) * 12;
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full gradient-accent"
                      style={{
                        width: 6 + (i % 2) * 3,
                        height: 6 + (i % 2) * 3,
                        x: Math.cos(angle) * r,
                        y: Math.sin(angle) * r,
                        opacity: 0.4,
                      }}
                      animate={{
                        y: [Math.sin(angle) * r, Math.sin(angle) * r - 14, Math.sin(angle) * r],
                        opacity: [0.2, 0.6, 0.2],
                      }}
                      transition={{
                        duration: 2.5 + i * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                      }}
                    />
                  );
                })}
            </AnimatePresence>

            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 relative z-10">
              {state === "done" ? (
                <span className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-primary" /> Complete
                </span>
              ) : mode === "focus" ? (
                "Focus Session"
              ) : (
                "Break Time"
              )}
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={Math.floor(remaining / 60) + ":" + Math.floor(remaining % 60)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="text-5xl sm:text-6xl font-bold tabular-nums tracking-tight relative z-10"
              >
                {formatClock(remaining)}
              </motion.div>
            </AnimatePresence>
            <span className="text-xs text-muted-foreground mt-3 relative z-10">
              {formatMinutes(Math.round(duration / 60))} · {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full glass glass-hover flex items-center justify-center"
            aria-label="Reset timer"
          >
            <RotateCcw size={18} />
          </button>

          {state === "running" ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePause}
              className="w-20 h-20 rounded-full gradient-accent glow-accent flex items-center justify-center text-white"
              aria-label="Pause"
            >
              <Pause size={28} fill="currentColor" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="w-20 h-20 rounded-full gradient-accent glow-accent flex items-center justify-center text-white"
              aria-label="Start"
            >
              <Play size={28} fill="currentColor" className="ml-1" />
            </motion.button>
          )}

          <button
            onClick={handleSkip}
            disabled={state === "idle"}
            className="w-12 h-12 rounded-full glass glass-hover flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Skip to end"
            title="Mark session complete now"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Configure button row */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowConfig((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-full glass glass-hover text-foreground/70 flex items-center gap-1.5"
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${showConfig ? "rotate-180" : ""}`}
            />
            {showConfig ? "Hide" : "Configure"} session
          </button>
        </div>

        <AnimatePresence>
          {state === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 px-5 py-2.5 rounded-2xl glass-strong flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full gradient-accent flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
              <span className="text-sm">
                {mode === "focus"
                  ? "Session saved! Great work."
                  : "Break complete. Ready to focus?"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Presets */}
      <div className="px-1">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2 text-center">
          {mode === "focus" ? "Focus Duration" : "Break Duration"}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(mode === "focus" ? PRESETS : BREAK_PRESETS).map((p) => {
            const sec = p.minutes * 60;
            const active = duration === sec && state === "idle";
            return (
              <button
                key={p.label}
                onClick={() => setDurationAndRemaining(p.minutes * 60)}
                disabled={state === "running"}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50 ${
                  active
                    ? "gradient-accent text-white glow-soft"
                    : "glass glass-hover text-foreground/80"
                }`}
              >
                {p.label} · {p.minutes}m
              </button>
            );
          })}
        </div>
      </div>

      {/* Session configuration */}
      <AnimatePresence>
        {showConfig && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="glass-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Track this session</h3>
                <span className="text-[10px] text-muted-foreground">
                  Saved to your history
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SelectField label="Level">
                  <select
                    value={selectedLevel}
                    onChange={(e) => {
                      const lvl = e.target.value;
                      setSelectedLevel(lvl);
                      const nextPapers = SYLLABUS.find((l) => l.id === lvl)?.papers ?? [];
                      setSelectedPaper(nextPapers[0]?.id ?? "");
                      setSelectedChapter(nextPapers[0]?.chapters[0]?.id ?? "");
                    }}
                    className="bg-transparent text-sm w-full outline-none cursor-pointer"
                  >
                    {levels.map((l) => (
                      <option key={l.id} value={l.id} className="bg-background text-foreground">
                        {l.name}
                      </option>
                    ))}
                  </select>
                </SelectField>

                <SelectField label="Paper">
                  <select
                    value={selectedPaper}
                    onChange={(e) => {
                      const p = e.target.value;
                      setSelectedPaper(p);
                      const nextChapters =
                        papers.find((pp) => pp.id === p)?.chapters ?? [];
                      setSelectedChapter(nextChapters[0]?.id ?? "");
                    }}
                    className="bg-transparent text-sm w-full outline-none cursor-pointer"
                  >
                    {papers.map((p) => (
                      <option key={p.id} value={p.id} className="bg-background text-foreground">
                        {p.code} · {p.name}
                      </option>
                    ))}
                  </select>
                </SelectField>

                <SelectField label="Chapter">
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="bg-transparent text-sm w-full outline-none cursor-pointer"
                  >
                    {chapters.map((c) => (
                      <option key={c.id} value={c.id} className="bg-background text-foreground">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </SelectField>
              </div>

              {/* Chapter topics preview */}
              {(() => {
                const ch = chapters.find((c) => c.id === selectedChapter);
                if (!ch) return null;
                return (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {ch.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded-full glass text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip */}
      <div className="glass rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
          <Brain size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium mb-0.5">Pomodoro tip</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Study in 25-minute focused sprints, then take a 5-minute break. After 4 rounds, take a longer 15-30 minute break to recharge.
          </p>
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-2xl glass">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}
