// Side-view aeroplane physics demo — illustrates how pitch attitude affects
// airspeed (the secondary effect of the elevator). Ported from AeroDemo.vue
// in the recreational_pilot_license_slides Slidev project.

const G          = 0.25
const MASS       = 1.0
const T_MAX      = 0.168
const LIFT_K     = 0.134
const CL0        = 0.3
const CL_ALPHA   = 2.5
const ALPHA_STALL = 0.26
const DRAG_K     = 0.025
const K_INDUCED  = 0.003
const K_ELEV     = 0.00012
const M_CG       = 0.000042
const K_DAMP     = 0.06
const I_MOMENT   = 0.8
const SPEED_SCALE = 35

const SCENE_H  = 400
const GROUND_Y = SCENE_H - 30

function hash(n) {
  return (((n * 1664525 + 1013904223) & 0x7FFFFFFF) / 0x7FFFFFFF)
}

function drawBackground(ctx, offX, offY, visW) {
  const grad = ctx.createLinearGradient(0, offY, 0, offY + SCENE_H)
  grad.addColorStop(0,   '#1a3a5c')
  grad.addColorStop(0.5, '#4a90c4')
  grad.addColorStop(1,   '#c8e8f5')
  ctx.fillStyle = grad
  ctx.fillRect(offX, offY - 10, visW, SCENE_H + 20)
}

function drawGround(ctx, offX, visW) {
  ctx.fillStyle = '#4a7c3f'
  ctx.fillRect(offX, GROUND_Y, visW, SCENE_H - GROUND_Y + 10)
  ctx.strokeStyle = '#3a6a30'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(offX, GROUND_Y)
  ctx.lineTo(offX + visW, GROUND_Y)
  ctx.stroke()
}

function drawClouds(ctx, offX, visW) {
  ctx.fillStyle = 'rgba(255,255,255,0.82)'
  const TILE = 520
  const t0   = Math.floor(offX / TILE) - 1
  const t1   = Math.ceil((offX + visW) / TILE) + 1
  for (let t = t0; t <= t1; t++) {
    const cx = t * TILE + hash(t)         * TILE * 0.7 + 60
    const cy = 22      + hash(t * 7 + 1)  * 70
    const r  = 16      + hash(t * 13 + 2) * 22
    ctx.beginPath(); ctx.ellipse(cx,           cy,           r * 1.5,  r * 0.75, 0, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(cx - r * 0.9, cy + r * 0.3, r * 0.9,  r * 0.6,  0, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(cx + r * 0.9, cy + r * 0.2, r * 0.85, r * 0.6,  0, 0, Math.PI * 2); ctx.fill()
  }
}

function drawPlane(ctx, x, y, angle, elevatorPct) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-angle)

  ctx.fillStyle = '#d0d0d0'
  ctx.beginPath()
  ctx.moveTo(-36, -7); ctx.lineTo(36, -7)
  ctx.quadraticCurveTo(38, -7, 38, -5)
  ctx.lineTo(38, 5); ctx.quadraticCurveTo(38, 7, 36, 7)
  ctx.lineTo(-36, 7); ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#e63946'
  ctx.beginPath()
  ctx.moveTo(36, -5); ctx.lineTo(52, 0); ctx.lineTo(36, 5)
  ctx.closePath(); ctx.fill()

  ctx.fillStyle = '#a8a8a8'
  ctx.beginPath()
  ctx.moveTo(-36, -7); ctx.lineTo(-36, -24); ctx.lineTo(-20, -7)
  ctx.closePath(); ctx.fill()

  ctx.save()
  ctx.translate(-22, 5)
  ctx.rotate((elevatorPct / 100) * 0.4)
  ctx.fillStyle = '#b8b8b8'
  ctx.fillRect(-20, -2, 20, 4)
  ctx.restore()

  ctx.fillStyle = '#a8d8f0'
  ctx.fillRect(10, -7, 20, 8)

  ctx.strokeStyle = '#444'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(52, -13)
  ctx.lineTo(52, 13)
  ctx.stroke()
  ctx.fillStyle = '#666'
  ctx.beginPath(); ctx.arc(52, 0, 4, 0, Math.PI * 2); ctx.fill()

  ctx.restore()
}

const GAUGE_START = 150 * Math.PI / 180
const GAUGE_SWEEP = 240 * Math.PI / 180
const GAUGE_MAX   = 150

function drawSpeedGauge(ctx, cw, ch, speed) {
  const R  = Math.min(ch * 0.2, 65)
  const cx = R + 15
  const cy = R + 20

  const frac      = Math.min(Math.max(speed, 0), GAUGE_MAX) / GAUGE_MAX
  const needleAng = GAUGE_START + GAUGE_SWEEP * frac
  const endAng    = GAUGE_START + GAUGE_SWEEP
  const trackR    = R * 0.78
  const trackW    = R * 0.13

  ctx.save()

  ctx.fillStyle = 'rgba(10,10,20,0.78)'
  ctx.beginPath(); ctx.arc(cx, cy, R + 6, 0, Math.PI * 2); ctx.fill()

  ctx.strokeStyle = '#2a2a3a'; ctx.lineWidth = trackW; ctx.lineCap = 'butt'
  ctx.beginPath(); ctx.arc(cx, cy, trackR, GAUGE_START, endAng, false); ctx.stroke()

  if (frac > 0) {
    ctx.strokeStyle = `hsl(${Math.round((1 - frac) * 120)},90%,55%)`
    ctx.lineWidth = trackW; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.arc(cx, cy, trackR, GAUGE_START, needleAng, false); ctx.stroke()
  }

  ctx.lineCap = 'butt'
  for (let i = 0; i <= 6; i++) {
    const tf      = i / 6
    const ang     = GAUGE_START + GAUGE_SWEEP * tf
    const isMajor = i % 2 === 0
    ctx.strokeStyle = '#bbb'; ctx.lineWidth = isMajor ? 1.5 : 1
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(ang) * (isMajor ? R * 0.67 : R * 0.74),
               cy + Math.sin(ang) * (isMajor ? R * 0.67 : R * 0.74))
    ctx.lineTo(cx + Math.cos(ang) * R * 0.87, cy + Math.sin(ang) * R * 0.87)
    ctx.stroke()
    if (isMajor) {
      ctx.fillStyle = '#ddd'
      ctx.font = `${Math.round(R * 0.18)}px monospace`
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(String(Math.round(tf * GAUGE_MAX)),
        cx + Math.cos(ang) * R * 0.52, cy + Math.sin(ang) * R * 0.52)
    }
  }

  ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2; ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - Math.cos(needleAng) * R * 0.12, cy - Math.sin(needleAng) * R * 0.12)
  ctx.lineTo(cx + Math.cos(needleAng) * R * 0.73, cy + Math.sin(needleAng) * R * 0.73)
  ctx.stroke()

  ctx.fillStyle = '#999'
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.07, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle = '#aaa'; ctx.font = `${Math.round(R * 0.15)}px monospace`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('kts', cx, cy + R * 0.44)

  ctx.restore()
}

class SecondaryEffectElevator extends HTMLElement {
  constructor() {
    super()
    this._throttlePct = 60
    this._elevatorPct = 10
    this._state       = { x: 80, y: SCENE_H * 0.5, vx: 2.8, vy: 0, angle: 0.07, omega: 0 }
    this._smoothedV   = 2.8
    this._speedKts    = 0
    this._rafId       = null
  }

  connectedCallback() {
    const height = this.getAttribute('height') || '320px'

    this.innerHTML = `
      <div style="position:relative;width:100%;height:${height};overflow:hidden;user-select:none">
        <canvas style="width:100%;height:100%;display:block"></canvas>
        <div style="position:absolute;bottom:10px;right:12px;display:flex;flex-direction:row;align-items:flex-end;gap:10px;pointer-events:all">
          <div style="background:rgba(0,0,0,0.65);color:#fff;padding:8px 10px;border-radius:8px;font-family:monospace;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:3px;white-space:nowrap">
            <span style="color:#aaa;font-size:11px">100%</span>
            <input data-throttle type="range" min="0" max="100" step="1" value="60"
              style="writing-mode:vertical-lr;direction:rtl;height:80px;accent-color:#e63946;cursor:pointer" />
            <span style="color:#aaa;font-size:11px">0%</span>
            <strong data-throttle-readout style="margin-top:2px">60%</strong>
            <span>Throttle</span>
          </div>
          <div style="background:rgba(0,0,0,0.65);color:#fff;padding:8px 12px;border-radius:8px;font-family:monospace;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:4px;white-space:nowrap">
            <span style="color:#aaa">↑ Push</span>
            <input data-elevator type="range" min="-100" max="100" step="1" value="10"
              style="writing-mode:vertical-lr;height:90px;accent-color:#4ea8de;cursor:pointer" />
            <span style="color:#aaa">Pull ↓</span>
            <strong data-elevator-readout style="margin-top:2px">+10</strong>
          </div>
        </div>
      </div>
    `

    this._canvas           = this.querySelector('canvas')
    const throttle         = this.querySelector('[data-throttle]')
    const elevator         = this.querySelector('[data-elevator]')
    const throttleReadout  = this.querySelector('[data-throttle-readout]')
    const elevatorReadout  = this.querySelector('[data-elevator-readout]')

    throttle.addEventListener('input', () => {
      this._throttlePct = Number(throttle.value)
      throttleReadout.textContent = `${this._throttlePct}%`
    })

    elevator.addEventListener('input', () => {
      this._elevatorPct = Number(elevator.value)
      elevatorReadout.textContent = (this._elevatorPct > 0 ? '+' : '') + this._elevatorPct
    })

    elevator.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowDown') {
        ev.preventDefault()
        this._elevatorPct = Math.min(100, this._elevatorPct + 4)
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault()
        this._elevatorPct = Math.max(-100, this._elevatorPct - 4)
      } else {
        return
      }
      elevator.value = this._elevatorPct
      elevatorReadout.textContent = (this._elevatorPct > 0 ? '+' : '') + this._elevatorPct
    })

    const ctx = this._canvas.getContext('2d')
    const loop = () => {
      this._canvas.width  = this._canvas.offsetWidth
      this._canvas.height = this._canvas.offsetHeight
      this._tick()
      this._render(ctx, this._canvas.width, this._canvas.height)
      this._rafId = requestAnimationFrame(loop)
    }
    this._rafId = requestAnimationFrame(loop)
  }

  disconnectedCallback() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
  }

  _tick() {
    const s = this._state
    const v = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
    const DT = 0.25

    if (v < 0.1) {
      s.vx += (T_MAX * (this._throttlePct / 100) * Math.cos(s.angle)) * DT
      s.vy += (T_MAX * (this._throttlePct / 100) * (-Math.sin(s.angle)) + G) * DT
      s.x  += s.vx
      s.y  += s.vy
      return
    }

    const velAngle = Math.atan2(-s.vy, s.vx)
    const alpha    = s.angle - velAngle
    const q        = 0.5 * v * v

    let CL = CL0 + CL_ALPHA * alpha
    if (alpha > ALPHA_STALL) {
      const CL_at_stall = CL0 + CL_ALPHA * ALPHA_STALL
      CL = CL_at_stall - 6.0 * (alpha - ALPHA_STALL)
    }
    CL = Math.max(0, Math.min(1.8, CL))

    const liftMag = q * CL * LIFT_K
    const liftFx  = liftMag * ( s.vy / v)
    const liftFy  = liftMag * (-s.vx / v)

    const thrust = T_MAX * (this._throttlePct / 100)
    const thrFx  = thrust *  Math.cos(s.angle)
    const thrFy  = thrust * -Math.sin(s.angle)

    const dragMag = q * (DRAG_K + K_INDUCED * CL * CL)
    const dragFx  = -dragMag * (s.vx / v)
    const dragFy  = -dragMag * (s.vy / v)

    s.vx += (liftFx + thrFx + dragFx) / MASS * DT
    s.vy += ((liftFy + thrFy + dragFy) / MASS + G) * DT
    s.x  += s.vx
    s.y  += s.vy

    const elev = this._elevatorPct / 100
    s.omega += (elev * K_ELEV * q - M_CG - K_DAMP * s.omega) / I_MOMENT
    s.angle += s.omega
    s.angle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, s.angle))

    this._smoothedV += (Math.max(0, s.vx) - this._smoothedV) * 0.04
    this._speedKts = Math.round(this._smoothedV * SPEED_SCALE)

    if (s.y > GROUND_Y + 10) {
      this._state = { x: 80, y: SCENE_H * 0.5, vx: 2.8, vy: 0, angle: 0.07, omega: 0 }
      this._smoothedV = 2.8
      this._speedKts  = 0
    }

    if (s.y < -500) { s.y = -500; s.vy = Math.max(0, s.vy) }
  }

  _render(ctx, cw, ch) {
    const scale = ch / SCENE_H
    const visW  = cw / scale

    const offX = Math.max(0, this._state.x - visW * 0.4)
    const offY = Math.max(-(SCENE_H * 0.5), Math.min(this._state.y - SCENE_H * 0.4, 0))

    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(-offX, -offY)

    drawBackground(ctx, offX, offY, visW)
    drawClouds(ctx, offX, visW)
    drawGround(ctx, offX, visW)
    drawPlane(ctx, this._state.x, this._state.y, this._state.angle, this._elevatorPct)

    ctx.restore()

    drawSpeedGauge(ctx, cw, ch, this._speedKts)
  }
}

customElements.define('secondary-effect-elevator', SecondaryEffectElevator)
