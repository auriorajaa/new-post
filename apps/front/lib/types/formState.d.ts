export type SignUpFormState =
  | {
      error?: Partial<{
        name: string[];
        email: string[];
        password: string[];
      }>;
      message?: string;
    }
  | undefined;
