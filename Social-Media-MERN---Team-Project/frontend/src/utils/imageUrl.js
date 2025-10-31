export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9000';
  return `${backendUrl}${imagePath}`;
};
