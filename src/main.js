import 'modern-normalize'
import './styles.scss'

import { createWorker } from 'tesseract.js'

const video = document.querySelector('video')
const textEl = document.querySelector('[data-text]')

const setup = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })

  video.srcObject = stream

  video.addEventListener('playing', async () => {
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    document.addEventListener('keypress', async (e) => {
      if (e.key !== ' ') return
      canvas.getContext('2d').drawImage(video, 0, 0, video.width, video.height)
      const {
        data: { text },
      } = await worker.recognize(canvas)

      speechSynthesis.speak(
        new SpeechSynthesisUtterance(text.replace(/\s/g, ' '))
      )

      textEl.textContent = text
    })
  })
}

setup()
