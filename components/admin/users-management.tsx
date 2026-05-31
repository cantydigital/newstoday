"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  adjustUserCreditsAction,
  fetchPrUserTransactions,
  fetchPrUsers,
} from "@/app/admin/dashboard/actions"
import type { CreditTransaction, PrUser } from "@/lib/credits"
import { format } from "date-fns"
import { Coins, Minus, Plus, RefreshCw, Search } from "lucide-react"

export default function UsersManagement() {
  const [users, setUsers] = useState<PrUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  // Quick-grant form
  const [newEmail, setNewEmail] = useState("")
  const [newDelta, setNewDelta] = useState<number>(1)
  const [newNote, setNewNote] = useState("")
  const [granting, setGranting] = useState(false)

  // Per-row adjustment state
  const [adjusting, setAdjusting] = useState<string | null>(null)

  // History dialog
  const [historyFor, setHistoryFor] = useState<PrUser | null>(null)
  const [history, setHistory] = useState<CreditTransaction[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPrUsers()
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q)
    )
  }, [users, query])

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail.trim()) return
    setGranting(true)
    setError(null)
    try {
      await adjustUserCreditsAction(
        newEmail.trim(),
        newDelta,
        newNote.trim() || undefined
      )
      setNewEmail("")
      setNewDelta(1)
      setNewNote("")
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to adjust credits")
    } finally {
      setGranting(false)
    }
  }

  const adjustRow = async (user: PrUser, delta: number) => {
    setAdjusting(user.id)
    setError(null)
    try {
      await adjustUserCreditsAction(user.email, delta)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to adjust credits")
    } finally {
      setAdjusting(null)
    }
  }

  const openHistory = async (user: PrUser) => {
    setHistoryFor(user)
    setHistory([])
    setHistoryLoading(true)
    try {
      const tx = await fetchPrUserTransactions(user.email)
      setHistory(tx)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load history")
    } finally {
      setHistoryLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick grant card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Grant or Adjust Credits
          </CardTitle>
          <CardDescription>
            Manually add or remove press release credits for a user. The user is
            keyed by email and will be created automatically if they don't
            exist yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleGrant}
            className="grid gap-4 md:grid-cols-[2fr_1fr_2fr_auto] md:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="grant-email">Email</Label>
              <Input
                id="grant-email"
                type="email"
                placeholder="user@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-delta">
                Credits (use negative to revoke)
              </Label>
              <Input
                id="grant-delta"
                type="number"
                value={newDelta}
                onChange={(e) => setNewDelta(parseInt(e.target.value || "0", 10))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-note">Note (optional)</Label>
              <Input
                id="grant-note"
                placeholder="e.g. comp credit, refund, etc."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={granting || newDelta === 0}>
              {granting ? "Saving…" : "Apply"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>
              All users with a credit history. Created automatically on Stripe
              purchase or admin grant.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search email or name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              {users.length === 0
                ? "No users yet. They'll appear here after the first Stripe purchase or admin grant."
                : "No users match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Credits</TableHead>
                    <TableHead className="text-right">Purchased</TableHead>
                    <TableHead className="text-right">Used</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.name || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={u.credits > 0 ? "default" : "secondary"}
                          className="font-mono"
                        >
                          {u.credits}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {u.total_purchased}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {u.total_used}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {format(new Date(u.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={adjusting === u.id}
                            onClick={() => adjustRow(u, -1)}
                            title="Remove 1 credit"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={adjusting === u.id}
                            onClick={() => adjustRow(u, 1)}
                            title="Add 1 credit"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
                            onClick={() => openHistory(u)}
                          >
                            History
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History dialog */}
      <Dialog
        open={historyFor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setHistoryFor(null)
            setHistory([])
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Credit history</DialogTitle>
            <DialogDescription>
              {historyFor?.email} — current balance:{" "}
              <strong>{historyFor?.credits ?? 0}</strong>
            </DialogDescription>
          </DialogHeader>

          {historyLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No transactions yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(tx.created_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {tx.reason.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          tx.amount > 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {tx.reference ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryFor(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
