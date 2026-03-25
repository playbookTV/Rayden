import { MetricsCard, Badge } from "@raydenui/ui";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-grey-900">Dashboard</h1>
        <p className="text-grey-600 mt-1">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricsCard
          variation={1}
          title="Total Revenue"
          value="$45,231.89"
          trend={{
            direction: "up",
            value: "20.1%",
            label: "vs last month",
          }}
        />
        <MetricsCard
          variation={1}
          title="Active Users"
          value="2,350"
          trend={{
            direction: "up",
            value: "10.5%",
            label: "vs last month",
          }}
        />
        <MetricsCard
          variation={1}
          title="Pending Orders"
          value="12"
          trend={{
            direction: "down",
            value: "5.2%",
            label: "vs last month",
          }}
        />
      </div>

      <div className="bg-white rounded-xl border border-grey-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-grey-900">
            Recent Activity
          </h2>
          <Badge color="blue">Last 7 days</Badge>
        </div>
        <div className="space-y-4">
          {[
            { action: "New order placed", time: "2 hours ago", amount: "$250.00" },
            { action: "Payment received", time: "4 hours ago", amount: "$1,200.00" },
            { action: "New user registered", time: "6 hours ago", amount: null },
            { action: "Order shipped", time: "1 day ago", amount: "$89.99" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-grey-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-grey-900">{item.action}</p>
                <p className="text-xs text-grey-500">{item.time}</p>
              </div>
              {item.amount && (
                <span className="text-sm font-medium text-grey-900">
                  {item.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
