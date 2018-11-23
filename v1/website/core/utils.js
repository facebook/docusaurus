function removeDuplicateLeadingSlashes(urlWithLeadingSlash) {
  // replace more than one leading slash to one
  // used when either docsUrl / baseUrl / langPart has colliding leading slashes
  return urlWithLeadingSlash.replace(/^\/+/, '/');
}

export default {
  removeDuplicateLeadingSlashes,
};
