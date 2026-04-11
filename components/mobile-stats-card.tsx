export function MobileStatsCard() {
  const stats = [
    { value: "18–22%", label: "Average Weight Loss" },
    { value: "98%",    label: "Success Rate" },
    { value: '2.6%"',     label: "Avg. HbA1C Drop" },
    { value: "6 mo",   label: "Guaranteed Results" },
  ]

  return (
    <div className="md:hidden mx-4 my-8">
      <div className="bg-dark rounded-[1.5rem] px-6 py-8">
        <div className="grid grid-cols-2 gap-y-8 gap-x-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <span className="text-4xl font-bold text-accent tracking-tight leading-none">
                {value}
              </span>
              <span className="text-sm text-accent2 font-medium leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
