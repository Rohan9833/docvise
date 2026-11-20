export const notFound = (req, res) => res.status(404).json({ message: 'Not found.' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Request is too large.' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: 'Please check the highlighted fields.' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid identifier.' });
  console.error('[error]', err.message); // never log request bodies (personal data)
  return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
}
