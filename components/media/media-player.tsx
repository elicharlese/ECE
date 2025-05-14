"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { MediaItem } from "@/types/media"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
} from "lucide-react"
import { formatTime } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface MediaPlayerProps {
  media: MediaItem
  autoPlay?: boolean
  onEnded?: () => void
  className?: string
}

export function MediaPlayer({ media, autoPlay = false, onEnded, className }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)

  const playerRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isVideo = media.type === "video"
  const isAudio = media.type === "audio"

  // Initialize player
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = volume

      if (autoPlay) {
        try {
          playerRef.current.play().catch((error) => {
            console.log("Autoplay prevented:", error)
          })
        } catch (error) {
          console.log("Autoplay error:", error)
        }
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [autoPlay, volume])

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Auto-hide controls for video
  useEffect(() => {
    if (!isVideo) return

    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }

      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseenter", handleMouseMove)
      container.addEventListener("mouseleave", () => {
        if (isPlaying) setShowControls(false)
      })
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseenter", handleMouseMove)
        container.removeEventListener("mouseleave", () => {
          if (isPlaying) setShowControls(false)
        })
      }
    }
  }, [isVideo, isPlaying])

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause()
      } else {
        playerRef.current.play().catch((error) => {
          console.log("Play prevented:", error)
        })
      }
    }
  }

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      setCurrentTime(playerRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration)
      setIsLoading(false)
    }
  }

  const handleSeek = (value: number[]) => {
    if (playerRef.current) {
      const newTime = value[0]
      playerRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)

    if (playerRef.current) {
      playerRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.volume = volume || 1
        setIsMuted(false)
      } else {
        playerRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const skipForward = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = Math.min(playerRef.current.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = Math.max(playerRef.current.currentTime - 10, 0)
    }
  }

  const handlePlaybackRateChange = (increase: boolean) => {
    if (playerRef.current) {
      const currentRate = playerRef.current.playbackRate
      const newRate = increase ? Math.min(currentRate + 0.25, 2) : Math.max(currentRate - 0.25, 0.5)

      playerRef.current.playbackRate = newRate
    }
  }

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />
    if (volume < 0.5) return <Volume1 />
    return <Volume2 />
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black rounded-md",
        isVideo ? "aspect-video" : "h-24",
        isFullscreen && "fixed inset-0 z-50",
        className,
      )}
      onDoubleClick={isVideo ? toggleFullscreen : undefined}
    >
      {isVideo ? (
        <video
          ref={playerRef as React.RefObject<HTMLVideoElement>}
          src={media.url}
          poster={media.thumbnailUrl}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false)
            if (onEnded) onEnded()
          }}
          onClick={togglePlay}
        />
      ) : (
        <div className="flex items-center h-full p-4 bg-muted/20">
          <div className="w-16 h-16 mr-4 flex-shrink-0">
            <img
              src={media.thumbnailUrl || `/placeholder.svg?height=200&width=200&query=audio%20${media.title}`}
              alt={media.title}
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-medium line-clamp-1">{media.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{media.creatorName}</p>

            <audio
              ref={playerRef as React.RefObject<HTMLAudioElement>}
              src={media.url}
              className="hidden"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                setIsPlaying(false)
                if (onEnded) onEnded()
              }}
            />

            <div className="flex items-center mt-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipBackward}>
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 mx-1" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={skipForward}>
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="ml-2 text-xs text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video controls overlay */}
      {isVideo && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300",
            showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress bar */}
            <Slider
              value={[currentTime]}
              min={0}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={skipBackward}>
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={skipForward}>
                  <SkipForward className="h-4 w-4" />
                </Button>

                <div className="text-xs text-white ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white"
                  onClick={() => handlePlaybackRateChange(false)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white"
                  onClick={() => handlePlaybackRateChange(true)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>

                <div className="flex items-center ml-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleMute}>
                    {getVolumeIcon()}
                  </Button>

                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-20 mx-2"
                  />
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  )
}
