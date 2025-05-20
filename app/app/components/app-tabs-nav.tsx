// app/app/components/app-tabs-nav.tsx

// Since there's no existing code and the update suggests either adapting this component
// for horizontal header navigation or removing it if redundant, I'll create a basic
// component structure that can be adapted for horizontal navigation.  This provides
// a starting point for future modification.  If it's truly redundant, it can be easily
// removed.

import type React from "react"

interface AppTabsNavProps {
  tabs: {
    label: string
    href: string
  }[]
}

const AppTabsNav: React.FC<AppTabsNavProps> = ({ tabs }) => {
  return (
    <nav>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.label}>
            <a href={tab.href}>{tab.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default AppTabsNav
