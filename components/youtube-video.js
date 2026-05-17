class YoutubeVideo extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('video-id')
    const start = this.getAttribute('start')
    const params = start ? `?start=${start}` : ''
    const width = this.getAttribute('width') ?? "100%"
    const shorts = this.hasAttribute('shorts')
    const aspectRatio = shorts ? '9/16' : '16/9'
    this.innerHTML = `<iframe
      style="width:${width};aspect-ratio:${aspectRatio};border:0"
      src="https://www.youtube-nocookie.com/embed/${id}${params}"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
      allowfullscreen></iframe>`
  }
}
customElements.define('youtube-video', YoutubeVideo)
