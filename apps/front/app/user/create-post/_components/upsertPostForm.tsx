"use client";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";

const UpsertPostForm = () => {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input name="title" placeholder="Title of your post" />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          name="content"
          placeholder="Your post content goes here..."
          rows={6}
        />

        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files)
                setImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {!!imageUrl && (
            <Image src={imageUrl} alt="Thumbnail" width={250} height={250} />
          )}
        </div>

        <div>
          <Label htmlFor="tags">Tags (Add comma to separated)</Label>
          <Input
            name="tags"
            placeholder="Enter tags (add comma to separated)"
          />
        </div>

        <div>
          <input type="checkbox" name="published" />
          <Label htmlFor="published">Publish now?</Label>
        </div>

        <SubmitButton>Save</SubmitButton>
      </div>
    </form>
  );
};

export default UpsertPostForm;
