export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-full rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 rounded bg-muted"></div>
                    <div className="h-6 w-16 rounded-full bg-muted"></div>
                  </div>
                </div>
                <div className="p-6 pt-3 pb-3">
                  <div className="grid gap-2 text-sm">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="h-4 w-20 rounded bg-muted"></div>
                          <div className="h-4 w-24 rounded bg-muted"></div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="p-6 pt-3">
                  <div className="flex w-full items-center justify-between text-sm">
                    <div className="h-4 w-32 rounded bg-muted"></div>
                    <div className="h-4 w-24 rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
