"use client";

import DOMPurify from "isomorphic-dompurify";

type Props = {
  html: string;
  className?: string;
};

export default function SafeHtml({ html, className }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
      className={className}
    />
  );
}
