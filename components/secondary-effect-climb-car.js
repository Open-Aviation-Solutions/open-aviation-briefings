// Car-on-hill physics demo — illustrates how a constant throttle setting
// produces different speeds on level ground vs. uphill. Ported from
// HillClimbDemo.vue in the recreational_pilot_license_slides Slidev project.
//
// matter-js is loaded from a CDN at first use (no build step in this repo).

const MATTER_CDN = 'https://esm.sh/matter-js@0.20.0'

const F_DRIVE_MAX = 0.004
const WR          = 12
const SCENE_H     = 400
const FLAT_Y      = 300
const HILLTOP_Y   = 230
const TRANS_R     = 110

function buildGeometry(SCENE_W, hillGradient = 1) {
  const FLAT_W    = Math.round(SCENE_W * 0.42)
  const HILLTOP_X = Math.round(SCENE_W * 0.71)
  const hilltopY  = Math.round(FLAT_Y - (FLAT_Y - HILLTOP_Y) * hillGradient)

  const rampAngle = Math.atan2(FLAT_Y - hilltopY, HILLTOP_X - FLAT_W)
  const RAMP_DX   = Math.cos(rampAngle)
  const RAMP_DY   = -Math.sin(rampAngle)

  const transR = Math.min(TRANS_R, Math.floor((HILLTOP_X - FLAT_W - 4) / (2 * RAMP_DX)))

  const T1       = { x: FLAT_W,                  y: FLAT_Y }
  const T1_START = { x: T1.x - transR,           y: T1.y }
  const T1_END   = { x: T1.x + transR * RAMP_DX, y: T1.y + transR * RAMP_DY }
  const T2       = { x: HILLTOP_X,               y: hilltopY }
  const T2_START = { x: T2.x - transR * RAMP_DX, y: T2.y - transR * RAMP_DY }
  const T2_END   = { x: T2.x + transR,           y: T2.y }

  return { FLAT_W, HILLTOP_X, hilltopY, T1, T1_START, T1_END, T2, T2_START, T2_END }
}

function sampleBezier(p0, ctrl, p2, n) {
  const pts = []
  for (let i = 1; i <= n; i++) {
    const t = i / n, mt = 1 - t
    pts.push({
      x: mt * mt * p0.x + 2 * t * mt * ctrl.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * t * mt * ctrl.y + t * t * p2.y,
    })
  }
  return pts
}

function getSurfacePoints(geo, SCENE_W) {
  const { T1_START, T1, T1_END, T2_START, T2, T2_END, hilltopY } = geo
  return [
    { x: 0,       y: FLAT_Y },
    T1_START,
    ...sampleBezier(T1_START, T1, T1_END, 20),
    T2_START,
    ...sampleBezier(T2_START, T2, T2_END, 20),
    { x: SCENE_W, y: hilltopY },
  ]
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawTerrain(ctx, geo, SCENE_W) {
  const { T1, T1_START, T1_END, T2, T2_START, T2_END, hilltopY } = geo

  const sky = ctx.createLinearGradient(0, 0, 0, SCENE_H)
  sky.addColorStop(0, '#87CEEB')
  sky.addColorStop(1, '#d0eeff')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, SCENE_W, SCENE_H)

  ctx.fillStyle = '#5a8a3c'
  ctx.beginPath()
  ctx.moveTo(0, SCENE_H)
  ctx.lineTo(0, FLAT_Y)
  ctx.lineTo(T1_START.x, T1_START.y)
  ctx.quadraticCurveTo(T1.x, T1.y, T1_END.x, T1_END.y)
  ctx.lineTo(T2_START.x, T2_START.y)
  ctx.quadraticCurveTo(T2.x, T2.y, T2_END.x, T2_END.y)
  ctx.lineTo(SCENE_W, hilltopY)
  ctx.lineTo(SCENE_W, SCENE_H)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#777'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(0, FLAT_Y)
  ctx.lineTo(T1_START.x, T1_START.y)
  ctx.quadraticCurveTo(T1.x, T1.y, T1_END.x, T1_END.y)
  ctx.lineTo(T2_START.x, T2_START.y)
  ctx.quadraticCurveTo(T2.x, T2.y, T2_END.x, T2_END.y)
  ctx.lineTo(SCENE_W, hilltopY)
  ctx.stroke()
}

function drawWheel(ctx, body) {
  ctx.save()
  ctx.translate(body.position.x, body.position.y)
  ctx.rotate(body.angle)

  ctx.fillStyle = '#222'
  ctx.beginPath(); ctx.arc(0, 0, WR, 0, Math.PI * 2); ctx.fill()

  ctx.strokeStyle = '#888'
  ctx.lineWidth = 2.5
  ctx.beginPath(); ctx.moveTo(-(WR - 2), 0); ctx.lineTo(WR - 2, 0); ctx.stroke()

  ctx.fillStyle = '#ccc'
  ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill()

  ctx.restore()
}

function drawChassis(ctx, body) {
  ctx.save()
  ctx.translate(body.position.x, body.position.y)
  ctx.rotate(body.angle)

  ctx.fillStyle = '#e63946'
  drawRoundedRect(ctx, -30, -14, 60, 22, 5)
  ctx.fill()

  ctx.fillStyle = '#a8d8f0'
  ctx.fillRect(-14, -14, 28, 10)

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

  ctx.fillStyle = 'rgba(10, 10, 20, 0.78)'
  ctx.beginPath(); ctx.arc(cx, cy, R + 6, 0, Math.PI * 2); ctx.fill()

  ctx.strokeStyle = '#2a2a3a'
  ctx.lineWidth   = trackW
  ctx.lineCap     = 'butt'
  ctx.beginPath(); ctx.arc(cx, cy, trackR, GAUGE_START, endAng, false); ctx.stroke()

  if (frac > 0) {
    ctx.strokeStyle = `hsl(${Math.round((1 - frac) * 120)}, 90%, 55%)`
    ctx.lineWidth   = trackW
    ctx.lineCap     = 'round'
    ctx.beginPath(); ctx.arc(cx, cy, trackR, GAUGE_START, needleAng, false); ctx.stroke()
  }

  ctx.lineCap = 'butt'
  for (let i = 0; i <= 6; i++) {
    const tf      = i / 6
    const ang     = GAUGE_START + GAUGE_SWEEP * tf
    const isMajor = i % 2 === 0
    ctx.strokeStyle = '#bbb'
    ctx.lineWidth   = isMajor ? 1.5 : 1
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(ang) * (isMajor ? R * 0.67 : R * 0.74),
               cy + Math.sin(ang) * (isMajor ? R * 0.67 : R * 0.74))
    ctx.lineTo(cx + Math.cos(ang) * R * 0.87, cy + Math.sin(ang) * R * 0.87)
    ctx.stroke()

    if (isMajor) {
      ctx.fillStyle    = '#ddd'
      ctx.font         = `${Math.round(R * 0.18)}px monospace`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      const lr = R * 0.52
      ctx.fillText(String(Math.round(tf * GAUGE_MAX)),
                   cx + Math.cos(ang) * lr, cy + Math.sin(ang) * lr)
    }
  }

  ctx.strokeStyle = '#ff4444'
  ctx.lineWidth   = 2
  ctx.lineCap     = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - Math.cos(needleAng) * R * 0.12, cy - Math.sin(needleAng) * R * 0.12)
  ctx.lineTo(cx + Math.cos(needleAng) * R * 0.73, cy + Math.sin(needleAng) * R * 0.73)
  ctx.stroke()

  ctx.fillStyle = '#999'
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.07, 0, Math.PI * 2); ctx.fill()

  ctx.fillStyle    = '#aaa'
  ctx.font         = `${Math.round(R * 0.15)}px monospace`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('kts', cx, cy + R * 0.44)

  ctx.restore()
}

class SecondaryEffectClimbCar extends HTMLElement {
  constructor() {
    super()
    this._throttlePct  = 50
    this._speedKmh     = 0
    this._stallTimer   = 0
    this._rafId        = null
    this._engine       = null
    this._runner       = null
    this._car          = null
    this._wheelA       = null
    this._wheelB       = null
    this._Matter       = null
    this._resizeObs    = null
    this._SCENE_W      = 900
    this._geo          = null
    this._hillGradient = 1
  }

  connectedCallback() {
    const height = this.getAttribute('height') || '320px'
    this._hillGradient = parseFloat(this.getAttribute('hill-gradient') || '1')

    this.innerHTML = `
      <div style="position:relative;width:100%;height:${height};overflow:hidden">
        <canvas style="width:100%;height:100%;display:block"></canvas>
        <div style="position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,0.6);color:#fff;padding:8px 10px;border-radius:8px;font-family:monospace;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:3px;white-space:nowrap">
          <span style="color:#aaa;font-size:11px">100%</span>
          <input type="range" min="0" max="100" step="1" value="50"
            style="writing-mode:vertical-lr;direction:rtl;height:80px;accent-color:#e63946;cursor:pointer" />
          <span style="color:#aaa;font-size:11px">0%</span>
          <strong data-throttle-readout style="margin-top:2px">50%</strong>
          <span>Throttle</span>
        </div>
      </div>
    `

    this._canvas   = this.querySelector('canvas')
    this._slider   = this.querySelector('input[type=range]')
    this._readout  = this.querySelector('[data-throttle-readout]')

    this._slider.addEventListener('input', () => {
      this._throttlePct = Number(this._slider.value)
      this._readout.textContent = `${this._throttlePct}%`
    })

    this._init()
  }

  disconnectedCallback() {
    if (this._resizeObs) { this._resizeObs.disconnect(); this._resizeObs = null }
    if (this._runner && this._Matter) this._Matter.Runner.stop(this._runner)
    if (this._rafId) cancelAnimationFrame(this._rafId)
    if (this._engine && this._Matter) this._Matter.Engine.clear(this._engine)
  }

  async _init() {
    if (!this._canvas || this._canvas.offsetWidth === 0) {
      this._resizeObs = new ResizeObserver(() => {
        if (this._canvas?.offsetWidth > 0) {
          this._resizeObs.disconnect()
          this._resizeObs = null
          this._init()
        }
      })
      this._resizeObs.observe(this._canvas)
      return
    }

    this._SCENE_W = Math.ceil(this._canvas.offsetWidth * SCENE_H / this._canvas.offsetHeight)
    this._geo = buildGeometry(this._SCENE_W, this._hillGradient)

    this._Matter = await import(MATTER_CDN)
    const M = this._Matter.default ?? this._Matter
    this._Matter = M
    const { Engine, Runner, Events, Body, Bodies, Constraint, World } = M

    this._engine = Engine.create({ gravity: { x: 0, y: 1 } })
    this._runner = Runner.create()

    const thick = 40
    const pts   = getSurfacePoints(this._geo, this._SCENE_W)
    const terrainBodies = []
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i], p2 = pts[i + 1]
      const dx = p2.x - p1.x, dy = p2.y - p1.y
      const len = Math.hypot(dx, dy)
      const ang = Math.atan2(dy, dx)
      const cx  = (p1.x + p2.x) / 2 + (thick / 2) * (-Math.sin(ang))
      const cy  = (p1.y + p2.y) / 2 + (thick / 2) *  Math.cos(ang)
      terrainBodies.push(Bodies.rectangle(cx, cy, len, thick, {
        isStatic: true, friction: 0.1, restitution: 0, angle: ang, label: 'terrain',
      }))
    }

    const group = Body.nextGroup(true)
    const sx = 60, wy = FLAT_Y - WR

    this._car = Bodies.rectangle(sx, wy - WR - 2, 56, 16, {
      collisionFilter: { group },
      chamfer: { radius: 4 },
      frictionAir: 0.06,
      density: 0.002,
      label: 'chassis',
    })
    this._wheelA = Bodies.circle(sx - 18, wy, WR, {
      collisionFilter: { group },
      friction: 0.8, frictionAir: 0.01, restitution: 0, label: 'wheelA',
    })
    this._wheelB = Bodies.circle(sx + 18, wy, WR, {
      collisionFilter: { group },
      friction: 0.8, frictionAir: 0.01, restitution: 0, label: 'wheelB',
    })

    const axelA = Constraint.create({
      bodyA: this._car, pointA: { x: -18, y: WR + 2 }, bodyB: this._wheelA, stiffness: 1, length: 0,
    })
    const axelB = Constraint.create({
      bodyA: this._car, pointA: { x:  18, y: WR + 2 }, bodyB: this._wheelB, stiffness: 1, length: 0,
    })

    World.add(this._engine.world, [...terrainBodies, this._car, this._wheelA, this._wheelB, axelA, axelB])

    Runner.run(this._runner, this._engine)

    Events.on(this._engine, 'beforeUpdate', () => {
      const force = F_DRIVE_MAX * (this._throttlePct / 100)
      Body.applyForce(this._car, this._car.position, { x: force, y: 0 })

      const vx = this._car.velocity.x
      this._speedKmh = Math.max(0, Math.round(vx * 28))

      if (this._car.position.x > this._SCENE_W - 40) {
        this._resetCar()
        this._stallTimer = 0
        return
      }
      if (vx < 0.08) this._stallTimer += this._engine.timing.delta
      else            this._stallTimer = 0
      if (this._stallTimer > 2500) { this._resetCar(); this._stallTimer = 0 }
    })

    const ctx = this._canvas.getContext('2d')
    const loop = () => {
      this._canvas.width  = this._canvas.offsetWidth
      this._canvas.height = this._canvas.offsetHeight
      this._render(ctx, this._canvas.width, this._canvas.height)
      this._rafId = requestAnimationFrame(loop)
    }
    this._rafId = requestAnimationFrame(loop)
  }

  _resetCar() {
    const M = this._Matter
    const sx = 60, wy = FLAT_Y - WR
    const reset = (body, x, y) => {
      M.Body.setPosition(body, { x, y })
      M.Body.setVelocity(body, { x: 0, y: 0 })
      M.Body.setAngle(body, 0)
      M.Body.setAngularVelocity(body, 0)
    }
    reset(this._car,    sx,      wy - WR - 2)
    reset(this._wheelA, sx - 18, wy)
    reset(this._wheelB, sx + 18, wy)
  }

  _render(ctx, cw, ch) {
    const scale = ch / SCENE_H
    const visW  = cw / scale
    const offX  = Math.max(0, Math.min(this._car.position.x - visW * 0.35, this._SCENE_W - visW))

    ctx.save()
    ctx.scale(scale, scale)
    ctx.translate(-offX, 0)
    drawTerrain(ctx, this._geo, this._SCENE_W)
    drawWheel(ctx, this._wheelA)
    drawWheel(ctx, this._wheelB)
    drawChassis(ctx, this._car)
    ctx.restore()

    drawSpeedGauge(ctx, cw, ch, this._speedKmh)
  }
}

customElements.define('secondary-effect-climb-car', SecondaryEffectClimbCar)
