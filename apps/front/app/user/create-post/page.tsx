import CreatePostContainer from "./_components/createPostContainer";

const CreatePostPage = () => {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write and publish a new article, or save it as a draft.
        </p>
      </div>

      <CreatePostContainer />
    </main>
  );
};

export default CreatePostPage;
