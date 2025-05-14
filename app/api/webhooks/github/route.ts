import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase-server"

// This is a server-side route that receives GitHub webhook events
export async function POST(request: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await request.text()
    let body: any

    try {
      body = JSON.parse(rawBody)
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
    }

    // Get the GitHub signature from the request headers
    const signature = request.headers.get("x-hub-signature-256")
    const event = request.headers.get("x-github-event")
    const delivery = request.headers.get("x-github-delivery")

    if (!signature || !event || !delivery) {
      console.warn("Webhook request missing required headers", {
        hasSignature: !!signature,
        hasEvent: !!event,
        hasDelivery: !!delivery,
      })
      return NextResponse.json({ error: "Missing required headers" }, { status: 400 })
    }

    // Verify the webhook signature
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("GITHUB_WEBHOOK_SECRET is not set")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify the signature using constant-time comparison to prevent timing attacks
    const hmac = crypto.createHmac("sha256", webhookSecret)
    const digest = "sha256=" + hmac.update(rawBody).digest("hex")

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      console.warn("Invalid webhook signature received")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    console.log(`Processing GitHub webhook: ${event} (${delivery})`)

    // Process the webhook event based on the event type
    const eventData = {
      id: delivery,
      event_type: event,
      repository: body.repository?.full_name || "unknown",
      sender: body.sender?.login || "unknown",
      payload: body,
      created_at: new Date().toISOString(),
      processed: false,
    }

    // Store the event in the database
    if (supabase) {
      const { error } = await supabase.from("github_webhook_events").insert([eventData])

      if (error) {
        console.error("Error storing webhook event:", error)
        // Continue processing even if DB storage fails
      } else {
        console.log(`Stored GitHub webhook event: ${delivery}`)
      }
    }

    // Process different event types
    try {
      switch (event) {
        case "ping":
          // Handle ping event (sent when webhook is first configured)
          console.log("Received ping event from GitHub")
          break
        case "push":
          await handlePushEvent(body)
          break
        case "pull_request":
          await handlePullRequestEvent(body)
          break
        case "issues":
          await handleIssueEvent(body)
          break
        case "workflow_run":
          await handleWorkflowRunEvent(body)
          break
        case "star":
          await handleStarEvent(body)
          break
        case "fork":
          await handleForkEvent(body)
          break
        case "release":
          await handleReleaseEvent(body)
          break
        default:
          console.log(`Unhandled GitHub event type: ${event}`)
      }

      // Mark the event as processed in the database
      if (supabase) {
        await supabase
          .from("github_webhook_events")
          .update({ processed: true, processed_at: new Date().toISOString() })
          .eq("id", delivery)
      }
    } catch (error) {
      console.error(`Error processing ${event} event:`, error)
      // We still return 200 to GitHub to prevent retries
      // But we mark the event as failed in our database
      if (supabase) {
        await supabase
          .from("github_webhook_events")
          .update({
            processed: true,
            error: error instanceof Error ? error.message : String(error),
            processed_at: new Date().toISOString(),
          })
          .eq("id", delivery)
      }
    }

    // Always return success to GitHub to prevent retries
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handler functions for different event types
async function handlePushEvent(payload: any) {
  const repository = payload.repository.full_name
  const branch = payload.ref.replace("refs/heads/", "")
  const commits = payload.commits || []

  console.log(`Received push event for ${repository} on branch ${branch} with ${commits.length} commits`)

  // Example: Store commit information
  if (supabase && commits.length > 0) {
    try {
      const commitData = commits.map((commit: any) => ({
        id: commit.id,
        repository: repository,
        branch: branch,
        message: commit.message,
        author: commit.author.name,
        author_email: commit.author.email,
        url: commit.url,
        timestamp: commit.timestamp,
        added_files: commit.added?.length || 0,
        removed_files: commit.removed?.length || 0,
        modified_files: commit.modified?.length || 0,
      }))

      const { error } = await supabase.from("github_commits").insert(commitData)

      if (error) {
        console.error("Error storing commit data:", error)
      } else {
        console.log(`Stored ${commits.length} commits for ${repository}`)
      }
    } catch (error) {
      console.error("Error processing commit data:", error)
    }
  }
}

async function handlePullRequestEvent(payload: any) {
  const repository = payload.repository.full_name
  const action = payload.action
  const prNumber = payload.pull_request.number
  const prTitle = payload.pull_request.title
  const prState = payload.pull_request.state
  const prUrl = payload.pull_request.html_url
  const author = payload.pull_request.user.login
  const merged = payload.pull_request.merged || false
  const draft = payload.pull_request.draft || false

  console.log(`Received PR ${action} event for ${repository}#${prNumber}: ${prTitle}`)

  // Store PR information
  if (supabase) {
    try {
      const prData = {
        id: `${repository}-${prNumber}`,
        repository: repository,
        number: prNumber,
        title: prTitle,
        state: prState,
        url: prUrl,
        author: author,
        action: action,
        merged: merged,
        draft: draft,
        created_at: payload.pull_request.created_at,
        updated_at: new Date().toISOString(),
        closed_at: payload.pull_request.closed_at,
        merged_at: payload.pull_request.merged_at,
        additions: payload.pull_request.additions,
        deletions: payload.pull_request.deletions,
        changed_files: payload.pull_request.changed_files,
      }

      const { error } = await supabase.from("github_pull_requests").upsert([prData], {
        onConflict: "id",
      })

      if (error) {
        console.error("Error storing PR data:", error)
      } else {
        console.log(`Stored PR data for ${repository}#${prNumber}`)
      }
    } catch (error) {
      console.error("Error processing PR data:", error)
    }
  }
}

async function handleIssueEvent(payload: any) {
  const repository = payload.repository.full_name
  const action = payload.action
  const issueNumber = payload.issue.number
  const issueTitle = payload.issue.title
  const issueState = payload.issue.state
  const issueUrl = payload.issue.html_url
  const author = payload.issue.user.login
  const labels = payload.issue.labels || []

  console.log(`Received issue ${action} event for ${repository}#${issueNumber}: ${issueTitle}`)

  // Store issue information
  if (supabase) {
    try {
      const issueData = {
        id: `${repository}-${issueNumber}`,
        repository: repository,
        number: issueNumber,
        title: issueTitle,
        state: issueState,
        url: issueUrl,
        author: author,
        action: action,
        labels: labels.map((l: any) => l.name).join(", "),
        created_at: payload.issue.created_at,
        updated_at: new Date().toISOString(),
        closed_at: payload.issue.closed_at,
      }

      const { error } = await supabase.from("github_issues").upsert([issueData], {
        onConflict: "id",
      })

      if (error) {
        console.error("Error storing issue data:", error)
      } else {
        console.log(`Stored issue data for ${repository}#${issueNumber}`)
      }
    } catch (error) {
      console.error("Error processing issue data:", error)
    }
  }
}

async function handleWorkflowRunEvent(payload: any) {
  const repository = payload.repository.full_name
  const workflowName = payload.workflow_run.name
  const workflowStatus = payload.workflow_run.status
  const workflowConclusion = payload.workflow_run.conclusion
  const workflowUrl = payload.workflow_run.html_url
  const branch = payload.workflow_run.head_branch

  console.log(
    `Received workflow run event for ${repository}: ${workflowName} (${workflowStatus}/${workflowConclusion})`,
  )

  // Store workflow run information
  if (supabase) {
    try {
      const workflowData = {
        id: payload.workflow_run.id.toString(),
        repository: repository,
        name: workflowName,
        status: workflowStatus,
        conclusion: workflowConclusion,
        url: workflowUrl,
        branch: branch,
        created_at: payload.workflow_run.created_at,
        updated_at: new Date().toISOString(),
        run_started_at: payload.workflow_run.run_started_at,
        run_attempt: payload.workflow_run.run_attempt,
        run_number: payload.workflow_run.run_number,
      }

      const { error } = await supabase.from("github_workflow_runs").upsert([workflowData], {
        onConflict: "id",
      })

      if (error) {
        console.error("Error storing workflow run data:", error)
      } else {
        console.log(`Stored workflow run data for ${repository}: ${workflowName}`)
      }
    } catch (error) {
      console.error("Error processing workflow run data:", error)
    }
  }
}

async function handleStarEvent(payload: any) {
  const repository = payload.repository.full_name
  const action = payload.action // 'created' or 'deleted'
  const sender = payload.sender.login

  console.log(`Received star ${action} event for ${repository} by ${sender}`)

  if (supabase) {
    try {
      const starData = {
        id: `${repository}-${sender}-${Date.now()}`,
        repository: repository,
        user: sender,
        action: action,
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("github_stars").insert([starData])

      if (error) {
        console.error("Error storing star data:", error)
      } else {
        console.log(`Stored star ${action} for ${repository} by ${sender}`)
      }
    } catch (error) {
      console.error("Error processing star data:", error)
    }
  }
}

async function handleForkEvent(payload: any) {
  const repository = payload.repository.full_name
  const forkee = payload.forkee.full_name
  const sender = payload.sender.login

  console.log(`Received fork event for ${repository} by ${sender} to ${forkee}`)

  if (supabase) {
    try {
      const forkData = {
        id: `${repository}-${forkee}`,
        parent_repository: repository,
        forked_repository: forkee,
        user: sender,
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("github_forks").insert([forkData])

      if (error) {
        console.error("Error storing fork data:", error)
      } else {
        console.log(`Stored fork data for ${repository} to ${forkee}`)
      }
    } catch (error) {
      console.error("Error processing fork data:", error)
    }
  }
}

async function handleReleaseEvent(payload: any) {
  const repository = payload.repository.full_name
  const action = payload.action // 'published', 'created', 'edited', etc.
  const release = payload.release
  const tag = release.tag_name
  const name = release.name
  const draft = release.draft
  const prerelease = release.prerelease

  console.log(`Received release ${action} event for ${repository}: ${tag}`)

  if (supabase) {
    try {
      const releaseData = {
        id: `${repository}-${tag}`,
        repository: repository,
        tag: tag,
        name: name,
        action: action,
        draft: draft,
        prerelease: prerelease,
        url: release.html_url,
        author: release.author.login,
        created_at: release.created_at,
        published_at: release.published_at,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("github_releases").upsert([releaseData], {
        onConflict: "id",
      })

      if (error) {
        console.error("Error storing release data:", error)
      } else {
        console.log(`Stored release data for ${repository}: ${tag}`)
      }
    } catch (error) {
      console.error("Error processing release data:", error)
    }
  }
}
