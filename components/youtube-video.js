class YoutubeVideo extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('video-id')
    const start = this.getAttribute('start')
    const params = start ? `?start=${start}` : ''
    this.innerHTML = `<iframe
      style="width:100%;aspect-ratio:16/9;border:0"
      src="https://www.youtube-nocookie.com/embed/${id}${params}"
      allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
      allowfullscreen></iframe>`
  }
}
customElements.define('youtube-video', YoutubeVideo)
