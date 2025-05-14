import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)

    // Get the Vercel signature from the headers
    const signature = request.headers.get("x-vercel-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    // Verify the signature
    const secret = process.env.VERCEL_WEBHOOK_SECRET

    if (!secret) {
      console.error("VERCEL_WEBHOOK_SECRET is not set")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const hmac = crypto.createHmac("sha1", secret)
    hmac.update(rawBody)
    const calculatedSignature = hmac.digest("hex")

    if (calculatedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Extract the event type
    const eventType = body.type || "unknown"

    // Generate a unique ID for the event
    const eventId = crypto.randomUUID()

    // Store the event in the database
    const { error } = await supabase.from("vercel_webhook_events").insert({
      id: eventId,
      event_type: eventType,
      payload: body,
      created_at: new Date().toISOString(),
      processed: false,
      read: false,
    })

    if (error) {
      console.error("Error storing Vercel webhook event:", error)
      // Continue processing even if there's a database error
    }

    // Process the event based on its type
    switch (eventType) {
      case "deployment.created":
        await processDeploymentCreated(body, eventId)
        break
      case "deployment.ready":
        await processDeploymentReady(body, eventId)
        break
      case "deployment.error":
        await processDeploymentError(body, eventId)
        break
      case "deployment.canceled":
        await processDeploymentCanceled(body, eventId)
        break
      default:
        console.log(`Received unhandled Vercel event type: ${eventType}`)
    }

    return NextResponse.json({ success: true, eventId })
  } catch (error) {
    console.error("Error processing Vercel webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function processDeploymentCreated(payload: any, eventId: string) {
  try {
    const { data, error } = await supabase.from("vercel_deployments").insert({
      id: payload.id || `dep_${Date.now()}`,
      event_id: eventId,
      project_id: payload.project?.id,
      project_name: payload.project?.name,
      url: payload.url,
      creator: payload.creator?.email || payload.creator?.username,
      branch: payload.meta?.branch,
      commit_message: payload.meta?.commitMessage,
      commit_sha: payload.meta?.commitSha,
      status: "building",
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error storing Vercel deployment:", error)
    }
  } catch (error) {
    console.error("Error processing deployment.created event:", error)
  }
}

async function processDeploymentReady(payload: any, eventId: string) {
  try {
    // First, check if the deployment exists
    const { data: existingDeployment } = await supabase
      .from("vercel_deployments")
      .select("*")
      .eq("id", payload.id)
      .single()

    if (existingDeployment) {
      // Update the existing deployment
      const { error } = await supabase
        .from("vercel_deployments")
        .update({
          status: "ready",
          url: payload.url,
          ready_at: new Date().toISOString(),
          build_time: payload.buildingAt ? Date.now() - new Date(payload.buildingAt).getTime() : null,
        })
        .eq("id", payload.id)

      if (error) {
        console.error("Error updating Vercel deployment:", error)
      }
    } else {
      // Create a new deployment record
      const { error } = await supabase.from("vercel_deployments").insert({
        id: payload.id || `dep_${Date.now()}`,
        event_id: eventId,
        project_id: payload.project?.id,
        project_name: payload.project?.name,
        url: payload.url,
        creator: payload.creator?.email || payload.creator?.username,
        branch: payload.meta?.branch,
        commit_message: payload.meta?.commitMessage,
        commit_sha: payload.meta?.commitSha,
        status: "ready",
        created_at: payload.createdAt || new Date().toISOString(),
        ready_at: new Date().toISOString(),
        build_time: payload.buildingAt ? Date.now() - new Date(payload.buildingAt).getTime() : null,
      })

      if (error) {
        console.error("Error storing Vercel deployment:", error)
      }
    }
  } catch (error) {
    console.error("Error processing deployment.ready event:", error)
  }
}

async function processDeploymentError(payload: any, eventId: string) {
  try {
    // First, check if the deployment exists
    const { data: existingDeployment } = await supabase
      .from("vercel_deployments")
      .select("*")
      .eq("id", payload.id)
      .single()

    if (existingDeployment) {
      // Update the existing deployment
      const { error } = await supabase
        .from("vercel_deployments")
        .update({
          status: "error",
          error_message: payload.error?.message || "Unknown error",
          error_code: payload.error?.code,
          error_at: new Date().toISOString(),
        })
        .eq("id", payload.id)

      if (error) {
        console.error("Error updating Vercel deployment:", error)
      }
    } else {
      // Create a new deployment record
      const { error } = await supabase.from("vercel_deployments").insert({
        id: payload.id || `dep_${Date.now()}`,
        event_id: eventId,
        project_id: payload.project?.id,
        project_name: payload.project?.name,
        url: payload.url,
        creator: payload.creator?.email || payload.creator?.username,
        branch: payload.meta?.branch,
        commit_message: payload.meta?.commitMessage,
        commit_sha: payload.meta?.commitSha,
        status: "error",
        created_at: payload.createdAt || new Date().toISOString(),
        error_message: payload.error?.message || "Unknown error",
        error_code: payload.error?.code,
        error_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error storing Vercel deployment:", error)
      }
    }
  } catch (error) {
    console.error("Error processing deployment.error event:", error)
  }
}

async function processDeploymentCanceled(payload: any, eventId: string) {
  try {
    // First, check if the deployment exists
    const { data: existingDeployment } = await supabase
      .from("vercel_deployments")
      .select("*")
      .eq("id", payload.id)
      .single()

    if (existingDeployment) {
      // Update the existing deployment
      const { error } = await supabase
        .from("vercel_deployments")
        .update({
          status: "canceled",
          canceled_at: new Date().toISOString(),
        })
        .eq("id", payload.id)

      if (error) {
        console.error("Error updating Vercel deployment:", error)
      }
    } else {
      // Create a new deployment record
      const { error } = await supabase.from("vercel_deployments").insert({
        id: payload.id || `dep_${Date.now()}`,
        event_id: eventId,
        project_id: payload.project?.id,
        project_name: payload.project?.name,
        url: payload.url,
        creator: payload.creator?.email || payload.creator?.username,
        branch: payload.meta?.branch,
        commit_message: payload.meta?.commitMessage,
        commit_sha: payload.meta?.commitSha,
        status: "canceled",
        created_at: payload.createdAt || new Date().toISOString(),
        canceled_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error storing Vercel deployment:", error)
      }
    }
  } catch (error) {
    console.error("Error processing deployment.canceled event:", error)
  }
}
