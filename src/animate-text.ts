import { Canvas, animationFrameWrapper, insertElement, isStr, removeElement } from 'simon-js-tool'
import type { IAnimateText } from './types'

export function animateText(options: IAnimateText, callback?: () => void) {
  const { width: w, height: h, text, infinity, container = 'body' } = options
  const { clientWidth, clientHeight } = document.documentElement
  const width = w || clientWidth
  const height = h || clientHeight
  const { canvas, ctx } = new Canvas(width, height)
  ctx.fillStyle = '#fff'
  const bgColors = Array.from({ length: 400 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    step: Math.random() * 2.5 + 0.5,
  }))
  const colors: { x: number; y: number; rx: number; ry: number; stepX: number; stepY: number }[] = []

  const sendText = (text: string, fontSize = 100, stepV = 40) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = `bold ${fontSize}px 微软雅黑`
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2)
    const imageData = ctx.getImageData(0, 0, width, height).data
    let index = 0
    const bl = 4
    let useIndex = 0
    for (let i = 0; i < imageData.length; i += 4) {
      const x = index % width
      const y = Math.ceil(index / width)
      if (x % bl === 0 && y % bl === 0 && imageData[i] === 255 && imageData[i + 1] === 255 && imageData[i + 2] === 255) {
        const item = colors[useIndex]
        const rx = item?.x || Math.floor(Math.random() * fontSize) + width / 2 - fontSize / 2
        const ry = item?.y || Math.floor(Math.random() * fontSize) + height / 2 - fontSize / 2
        colors[useIndex] = {
          x,
          y,
          rx,
          ry,
          stepX: Math.abs(rx - x) / stepV,
          stepY: Math.abs(ry - y) / stepV,

        }
        useIndex++
      }
      index++
    }
    if (useIndex < colors.length)
      colors.splice(useIndex, colors.length - useIndex)
  }
  const render = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    colors.forEach((v) => {
      if (v.rx > v.x) {
        v.rx -= v.stepX
        if (v.rx < v.x)
          v.rx = v.x
      }
      else if (v.rx < v.x) {
        v.rx += v.stepX
        if (v.rx > v.x)
          v.rx = v.x
      }
      if (v.ry > v.y) {
        v.ry -= v.stepY
        if (v.ry < v.y)
          v.ry = v.y
      }
      else if (v.ry < v.y) {
        v.ry += v.stepY
        if (v.ry > v.y)
          v.ry = v.y
      }
      ctx.rect(v.rx, v.ry, 3, 3)
    })
    bgColors.forEach((v) => {
      v.y = v.y > height ? 0 : (v.y + v.step)
      ctx.rect(v.x, v.y, 3, 3)
    })
    ctx.fill()
  }

  const awaitSendText = async (text: string, fontSize: number, stepV: number, delta = 2000) => {
    return new Promise((resolve) => {
      sendText(text, fontSize, stepV)
      colors.sort(() => Math.random() - 0.5)
      animationFrameWrapper(() => resolve(null), delta + (stepV > 40 ? 1000 : 0), true)
    })
  }

  const run: () => void = async () => {
    if (isStr(text)) {
      await awaitSendText(text, 100, 100)
      return infinity ? run() : callback?.()
    }
    for (let i = 0; i < text.length; i++)
      await awaitSendText(text[i], 100, i === 0 ? 100 : 40, i === text.length - 1 ? 1000 : 2000)

    return infinity ? run() : callback?.()
  }
  run()
  canvas.style.background = '#000'
  animationFrameWrapper(render, 0)
  insertElement(container, canvas)
  return () => removeElement(canvas)
}
