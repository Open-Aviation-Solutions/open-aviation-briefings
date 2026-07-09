// Give a downloaded PDF a name that identifies its lesson, so notes from
// different lessons don't collide as identical "02-pre-flight-briefing-notes.pdf"
// files. Combines the lesson-slug path segment with the file name, e.g.
//   /brief-slides/<course>/19-crosswind-circuits/02-pre-flight-briefing-notes.pdf
//   → 19-crosswind-circuits-02-pre-flight-briefing-notes.pdf
// Using the last two segments keeps it correct whether or not the path carries
// the site base prefix (SlideEmbed passes an unprefixed path; markdown links
// include the base).
export function pdfDownloadName(pdfPath) {
  return pdfPath.split('/').slice(-2).join('-')
}
