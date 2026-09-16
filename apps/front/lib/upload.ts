import { createClient } from "@supabase/supabase-js";

export async function uploadThumbnail(image: File) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const data = await supabase.storage
    .from("thumbnail-bucket-for-new-post")
    .upload(`${Date.now()}_${image.name}`, image);
  
  // console.log({data})

  if (!data.data?.path) throw new Error("Failed to upload this image");

  const urlData = await supabase.storage
    .from("thumbnail-bucket-for-new-post")
    .getPublicUrl(data.data?.path);

  return urlData.data.publicUrl;
}
