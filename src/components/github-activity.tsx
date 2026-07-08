const CONTRIBUTION_API = "https://github-contributions-api.deno.dev";

interface Day {
  date: string;
  count: number;
  color: string;
  level: number;
}

async function getContributions(username: string): Promise<Day[] | null> {
  try {
    const res = await fetch(`${CONTRIBUTION_API}/${username}.json`, {
      cache: "force-cache",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.contributions as Day[];
  } catch {
    return null;
  }
}

export default async function GitHubActivity({ username }: { username: string }) {
  const days = await getContributions(username);

  if (!days || days.length === 0) {
    return (
      <div className="border border-border rounded-xl p-4 bg-card text-center text-sm text-muted-foreground">
        Could not load GitHub activity for{" "}
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          @{username}
        </a>
      </div>
    );
  }

  const weeks: Day[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const totalContributions = days.reduce((sum, d) => sum + d.count, 0);
  const currentStreak = (() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) streak++;
      else break;
    }
    return streak;
  })();

  const visibleWeeks = weeks.slice(-53);

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        <span>{totalContributions.toLocaleString()} contributions in the last year</span>
        <span>{currentStreak} day streak</span>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-[3px] min-w-[750px]">
          {visibleWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className="rounded-[3px]"
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: day.color || "#1b1f230f",
                  }}
                  title={day.date ? `${day.count} contributions on ${day.date}` : ""}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Less</span>
          {["#1b1f230f", "#0e4429", "#006d32", "#26a641", "#39d353"].map((color) => (
            <div key={color} className="rounded-[3px]" style={{ width: 10, height: 10, backgroundColor: color }} />
          ))}
          <span>More</span>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          @{username}
        </a>
      </div>
    </div>
  );
}
