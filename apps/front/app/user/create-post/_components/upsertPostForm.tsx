"use client";

import { useState } from "react";
import Image from "next/image";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { PostFormState } from "@/lib/types/formState";
import { Cancel01Icon, CloudUploadIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import TagsInput from "./tagsInput";

type Props = {
  state: PostFormState;
  formAction: (payload: FormData) => void;
};

const UpsertPostForm = ({ state, formAction }: Props) => {
  const [imageUrl, setImageUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [existingThumbnailRemoved, setExistingThumbnailRemoved] =
    useState(false);

  const previousThumbnailUrl = existingThumbnailRemoved
    ? undefined
    : state?.data?.previousThumbnailUrl;

  const displayedThumbnail = imageUrl || previousThumbnailUrl;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const clearThumbnail = () => {
    setImageUrl("");
    setFileName("");
    setExistingThumbnailRemoved(true);
  };

  return (
    <Card className="mx-auto w-full max-w-6xl">
      <CardContent className="p-4 sm:p-6">
        <form
          key={state?.data ? JSON.stringify(state.data) : "initial"}
          action={formAction}
          className="space-y-6"
        >
          <input hidden name="postId" defaultValue={state?.data?.postId} />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Title of your post"
              defaultValue={state?.data?.title}
            />
            {!!state?.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Your post content goes here..."
              rows={8}
              defaultValue={state?.data?.content}
            />
            {!!state?.errors?.content && (
              <p className="text-sm text-destructive">{state.errors.content}</p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail</Label>

            {displayedThumbnail ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={displayedThumbnail}
                  alt="Thumbnail preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={clearThumbnail}
                  aria-label="Remove thumbnail"
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                </button>
                {fileName && (
                  <div className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs text-white">
                    {fileName}
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="thumbnail"
                className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center transition-colors hover:bg-accent/50"
              >
                <HugeiconsIcon
                  icon={CloudUploadIcon}
                  className="size-6 text-muted-foreground"
                />
                <div>
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or WEBP
                  </p>
                </div>
              </label>
            )}

            <Input
              id="thumbnail"
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="sr-only"
            />

            {/* Signals to the server action that the existing thumbnail should be cleared */}
            {existingThumbnailRemoved && !imageUrl && (
              <input type="hidden" name="removeThumbnail" value="true" />
            )}

            {!!state?.errors?.thumbnail && (
              <p className="text-sm text-destructive">
                {state.errors.thumbnail}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <TagsInput
              name="tags"
              initialTags={state?.data?.tags}
              error={state?.errors?.tags?.[0]}
            />
          </div>

          {/* Publish toggle */}
          <div className="flex items-start gap-3 rounded-lg border p-3">
            <Checkbox
              name="published"
              className="mt-0.5"
              defaultChecked={state?.data?.published === "on"}
            />
            <label htmlFor={undefined} className="grid cursor-pointer gap-1">
              <span className="text-sm font-medium leading-none">
                Publish now
              </span>
              <span className="text-xs text-muted-foreground">
                Leave unchecked to save this post as a draft
              </span>
            </label>
          </div>
          {!!state?.errors?.published && (
            <p className="text-sm text-destructive">{state.errors.published}</p>
          )}

          <SubmitButton className="w-full sm:w-auto">Save</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpsertPostForm;
