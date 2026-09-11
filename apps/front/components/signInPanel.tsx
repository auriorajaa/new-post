import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

type Props = {
  className?: string;
};

const SignInPanel = ({ className }: Props) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/auth/signin" />}
      >
        Sign in
      </Button>
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href="/auth/signup" />}
      >
        Sign up
      </Button>
    </div>
  );
};

export default SignInPanel;
