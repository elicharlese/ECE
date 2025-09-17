import { ThemeToggle } from '@/components/settings/ThemeToggle'

export default function ProfilePage() {
  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Manage your ECE Trading Cards profile and settings</p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-6 bg-card text-card-foreground">
            <h2 className="text-xl font-semibold mb-3">Portfolio Overview</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Total Cards</span><span className="font-medium">42</span></li>
              <li className="flex justify-between"><span>Portfolio Value</span><span className="font-medium text-accent">1,250 ECE</span></li>
              <li className="flex justify-between"><span>Active Trades</span><span className="font-medium">3</span></li>
            </ul>
          </div>
          <div className="rounded-xl border p-6 bg-card text-card-foreground">
            <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <button className="border rounded-lg px-3 py-2 text-left hover:bg-secondary">Edit Profile</button>
              <button className="border rounded-lg px-3 py-2 text-left hover:bg-secondary">Notification Settings</button>
              <button className="border rounded-lg px-3 py-2 text-left hover:bg-secondary">Security Settings</button>
              <button className="border rounded-lg px-3 py-2 text-left hover:bg-secondary">Subscription Management</button>
            </div>
          </div>

          {/* Appearance / Theme */}
          <div className="rounded-xl border p-6 bg-card text-card-foreground md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Appearance</h2>
            <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme for the ECE platform.</p>
            <ThemeToggle />
          </div>
        </section>
      </div>
    </div>
  )
}
