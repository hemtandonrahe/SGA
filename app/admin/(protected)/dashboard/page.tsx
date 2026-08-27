import Link from "next/link";
import { isDbConfigured } from "@/lib/integrations/config";
import { getWaitlistMetrics } from "@/lib/db/queries/metrics";
import { getTopViewedPosts } from "@/lib/db/queries/blog";
import { SetupNotice } from "@/components/ui/SetupNotice";
import { MetricCard } from "@/components/admin/MetricCard";
import { BarList } from "@/components/admin/BarList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const roleLabels: Record<string, string> = { player: "Players", facility: "Facilities", partner: "Partners" };
const statusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  invited: "Invited",
  archived: "Archived",
};

export default async function AdminDashboardPage() {
  if (!isDbConfigured()) {
    return (
      <SetupNotice title="No database connected yet">
        Add <code className="rounded bg-bg-elevated-2 px-1.5 py-0.5 text-accent">DATABASE_URL</code> to see
        real metrics here.
      </SetupNotice>
    );
  }

  const [metrics, topPosts] = await Promise.all([getWaitlistMetrics(), getTopViewedPosts(5)]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted">Waitlist and content performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Total signups" value={String(metrics.total)} />
        <MetricCard
          label="Conversion rate"
          value={`${Math.round(metrics.conversionRate * 100)}%`}
          hint="Qualified + invited ÷ total"
        />
        <MetricCard
          label="Players"
          value={String(metrics.byRole.find((r) => r.role === "player")?.total ?? 0)}
          hint={`${metrics.byRole.find((r) => r.role === "facility")?.total ?? 0} facilities · ${
            metrics.byRole.find((r) => r.role === "partner")?.total ?? 0
          } partners`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By audience</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={metrics.byRole.map((r) => ({ label: roleLabels[r.role] ?? r.role, value: r.total }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By status</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={metrics.byStatus.map((s) => ({
                label: statusLabels[s.status] ?? s.status,
                value: s.total,
              }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top regions</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.byLocation.map((l) => ({ label: l.location!, value: l.total }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top sources</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList items={metrics.bySource.map((s) => ({ label: s.source!, value: s.total }))} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most-read blog posts</CardTitle>
        </CardHeader>
        <CardContent>
          {topPosts.length === 0 ? (
            <p className="text-sm text-text-muted">No published posts yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {topPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between text-sm">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-text-primary hover:text-accent">
                    {post.title}
                  </Link>
                  <span className="text-text-muted">{post.viewCount} views</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
