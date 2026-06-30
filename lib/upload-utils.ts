/**
 * Upload a file to Supabase storage via the CMS upload API
 * Returns the public URL of the uploaded file
 */
export async function uploadFileToSupabase(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cms/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Upload failed:', error);
      return null;
    }

    const result = await response.json();
    return result.url;
  } catch (err) {
    console.error('Upload error:', err);
    return null;
  }
}

/**
 * Upload a file and return both the URL and a preview data URL
 * Useful when you want to show preview immediately while uploading
 */
export async function uploadFileWithPreview(file: File): Promise<{ url: string | null; preview: string }> {
  // Create preview immediately
  const preview = await readFileAsDataURL(file);
  
  // Upload in background
  const url = await uploadFileToSupabase(file);
  
  return { url, preview };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
