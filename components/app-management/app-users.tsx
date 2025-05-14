"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, MoreHorizontal, UserPlus } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "developer" | "viewer"
  status: "active" | "inactive" | "pending"
  lastActive: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "admin",
    status: "active",
    lastActive: "2023-04-15T10:30:00Z",
    avatar: "/javascript-code.png",
  },
  {
    id: "user-2",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "developer",
    status: "active",
    lastActive: "2023-04-14T15:45:00Z",
    avatar: "/stylized-jd-initials.png",
  },
  {
    id: "user-3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "developer",
    status: "active",
    lastActive: "2023-04-13T09:20:00Z",
    avatar: "/abstract-letter-aj.png",
  },
  {
    id: "user-4",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    role: "viewer",
    status: "inactive",
    lastActive: "2023-04-10T11:15:00Z",
    avatar: "/abstract-bw.png",
  },
  {
    id: "user-5",
    name: "Carol Brown",
    email: "carol.brown@example.com",
    role: "viewer",
    status: "pending",
    lastActive: "2023-04-12T14:30:00Z",
    avatar: "/abstract-cb.png",
  },
]

export function AppUsers() {
  const [users] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "developer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getStatusBadgeColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            App Users
          </span>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="mb-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="developers">Developers</TabsTrigger>
              <TabsTrigger value="viewers">Viewers</TabsTrigger>
            </TabsList>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div className="col-span-4">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Last Active</div>
                <div className="col-span-1"></div>
              </div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                    <div className="col-span-4 flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Badge className={getStatusBadgeColor(user.status)}>{user.status}</Badge>
                    </div>
                    <div className="col-span-3 flex items-center text-gray-500">{formatDate(user.lastActive)}</div>
                    <div className="col-span-1 flex items-center justify-end">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center p-4 text-center">
                  <p className="text-sm text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="admins" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Admin users will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="developers" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Developer users will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="viewers" className="m-0">
            <div className="flex h-32 items-center justify-center rounded-md border p-4 text-center">
              <p className="text-sm text-gray-500">Viewer users will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
