export function extractHostname(url) {
  let hostname;

  // Find and remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  // Find and remove port number
  hostname = hostname.split(":")[0];

  // Find and remove ? and #
  hostname = hostname.split("?")[0];
  hostname = hostname.split("#")[0];

  return hostname;
}

export function slugify(string) {
  return string
    .toString()
    .replace(/(^[A-Z])/, ([first]) => first.toLowerCase())
    .replace(/([A-Z])/g, ([letter]) => `-${letter.toLowerCase()}`)
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w]+/g, "") // Remove all non-word chars
    .replace(/\+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
