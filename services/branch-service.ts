"use client"

import type { Branch, BranchComparison } from "@/types/branch"

// Mock data for demonstration
const mockBranches: Branch[] = [
  {
    id: "1",
    name: "main",
    lastCommitId: "abc123",
    lastCommitMessage: "Update README.md",
    lastCommitAuthor: "John Doe",
    lastCommitDate: "2023-05-01T12:00:00Z",
    isDefault: true,
    isProtected: true,
  },
  {
    id: "2",
    name: "develop",
    lastCommitId: "def456",
    lastCommitMessage: "Add new feature",
    lastCommitAuthor: "Jane Smith",
    lastCommitDate: "2023-05-02T14:30:00Z",
    isDefault: false,
    isProtected: true,
    aheadBy: 5,
    behindBy: 2,
  },
  {
    id: "3",
    name: "feature/user-auth",
    lastCommitId: "ghi789",
    lastCommitMessage: "Implement user authentication",
    lastCommitAuthor: "Bob Johnson",
    lastCommitDate: "2023-05-03T09:15:00Z",
    isDefault: false,
    isProtected: false,
    aheadBy: 8,
    behindBy: 10,
  },
]

const mockComparison: BranchComparison = {
  base: mockBranches[0],
  compare: mockBranches[2],
  commits: [
    {
      id: "commit1",
      message: "Implement user login form",
      author: "Bob Johnson",
      date: "2023-05-03T08:00:00Z",
      avatarUrl: "https://github.com/identicons/bobj.png",
    },
    {
      id: "commit2",
      message: "Add authentication middleware",
      author: "Bob Johnson",
      date: "2023-05-03T08:30:00Z",
      avatarUrl: "https://github.com/identicons/bobj.png",
    },
    {
      id: "commit3",
      message: "Implement JWT token handling",
      author: "Bob Johnson",
      date: "2023-05-03T09:15:00Z",
      avatarUrl: "https://github.com/identicons/bobj.png",
    },
  ],
  files: [
    {
      filename: "src/components/LoginForm.tsx",
      status: "added",
      additions: 120,
      deletions: 0,
      changes: 120,
    },
    {
      filename: "src/middleware/auth.ts",
      status: "added",
      additions: 85,
      deletions: 0,
      changes: 85,
    },
    {
      filename: "src/utils/jwt.ts",
      status: "added",
      additions: 45,
      deletions: 0,
      changes: 45,
    },
    {
      filename: "src/pages/login.tsx",
      status: "modified",
      additions: 25,
      deletions: 10,
      changes: 35,
    },
  ],
  stats: {
    commits: 3,
    files: 4,
    additions: 275,
    deletions: 10,
    mergeStatus: "clean",
  },
  diffText: `diff --git a/src/components/LoginForm.tsx b/src/components/LoginForm.tsx
new file mode 100644
index 0000000..f5b8e4f
--- /dev/null
+++ b/src/components/LoginForm.tsx
@@ -0,0 +1,120 @@
+import { useState } from 'react';
+import { Button } from './ui/button';
+import { Input } from './ui/input';
+
+export function LoginForm() {
+  const [email, setEmail] = useState('');
+  const [password, setPassword] = useState('');
+  
+  const handleSubmit = (e) => {
+    e.preventDefault();
+    // Handle login logic
+  };
+  
+  return (
+    <form onSubmit={handleSubmit}>
+      <div className="space-y-4">
+        <div>
+          <label htmlFor="email">Email</label>
+          <Input 
+            id="email"
+            type="email"
+            value={email}
+            onChange={(e) => setEmail(e.target.value)}
+            required
+          />
+        </div>
+        <div>
+          <label htmlFor="password">Password</label>
+          <Input 
+            id="password"
+            type="password"
+            value={password}
+            onChange={(e) => setPassword(e.target.value)}
+            required
+          />
+        </div>
+        <Button type="submit">Log in</Button>
+      </div>
+    </form>
+  );
+}`,
}

export const BranchService = {
  getBranches: async (repositoryId: string): Promise<Branch[]> => {
    // In a real app, this would fetch from an API
    console.log("Fetching branches for repository:", repositoryId)
    return mockBranches
  },

  compareBranches: async (
    repositoryId: string,
    baseBranchName: string,
    compareBranchName: string,
  ): Promise<BranchComparison> => {
    // In a real app, this would fetch from an API
    console.log(`Comparing branches: ${baseBranchName} and ${compareBranchName} in repository ${repositoryId}`)
    return mockComparison
  },
}
