"use client"

import { useEffect, useRef } from "react"
import type { ImpactAssessment } from "@/lib/api"

interface ImpactVisualizationProps {
  impact: ImpactAssessment
}

export function ImpactVisualization({ impact }: ImpactVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set crossOrigin to avoid CORS issues
    const img = new Image()
    img.crossOrigin = "anonymous"

    // Rest of the code remains the same
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up dimensions
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 20

    // Draw background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#f1f5f9" // slate-100
    ctx.fill()

    // Draw impact score gauge
    const startAngle = Math.PI
    const endAngle = 2 * Math.PI
    const scoreAngle = startAngle + (endAngle - startAngle) * (impact.score / 100)

    // Background track
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 10, startAngle, endAngle)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#e2e8f0" // slate-200
    ctx.stroke()

    // Score indicator
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 10, startAngle, scoreAngle)
    ctx.lineWidth = 20

    // Color based on impact level
    let gradientColor
    if (impact.level === "high") {
      gradientColor = "#ef4444" // red-500
    } else if (impact.level === "medium") {
      gradientColor = "#f59e0b" // amber-500
    } else {
      gradientColor = "#10b981" // emerald-500
    }

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#f97316") // orange-500
    gradient.addColorStop(1, gradientColor)

    ctx.strokeStyle = gradient
    ctx.stroke()

    // Draw center text
    ctx.fillStyle = "#0f172a" // slate-900
    ctx.font = "bold 32px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(impact.score.toString(), centerX, centerY - 10)

    // Draw level text
    ctx.font = "16px Inter, sans-serif"
    ctx.fillText(impact.level.toUpperCase(), centerX, centerY + 20)

    // Draw factor points
    const factorCount = impact.factors.length
    const angleStep = (2 * Math.PI) / factorCount

    impact.factors.forEach((factor, index) => {
      const angle = index * angleStep
      const factorRadius = (radius - 40) * (factor.value / 100)

      const x = centerX + factorRadius * Math.cos(angle)
      const y = centerY + factorRadius * Math.sin(angle)

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, 2 * Math.PI)
      ctx.fillStyle = "#f97316" // orange-500
      ctx.fill()

      // Draw line from center
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = "#cbd5e1" // slate-300
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw factor name
      const labelX = centerX + (radius + 15) * Math.cos(angle)
      const labelY = centerY + (radius + 15) * Math.sin(angle)

      ctx.font = "12px Inter, sans-serif"
      ctx.fillStyle = "#64748b" // slate-500
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Adjust text position based on angle
      if (angle < Math.PI / 2 || angle > (3 * Math.PI) / 2) {
        ctx.textAlign = "left"
      } else {
        ctx.textAlign = "right"
      }

      ctx.fillText(factor.name, labelX, labelY)
    })
  }, [impact])

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width={300} height={300} className="w-full max-w-[300px] h-auto" />
    </div>
  )
}
