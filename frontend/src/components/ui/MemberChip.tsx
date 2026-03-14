'use client';

import Link from "next/link";
import { MouseEventHandler } from "react";

interface MemberChipProps {
  href?: string;
  username: string;
  avatar: string;
  status?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  expanded?: boolean;
  controls?: string;
}

export default function MemberChip({
  href = "/profile",
  username,
  avatar,
  status = "Guild Member",
  onClick,
  expanded,
  controls,
}: MemberChipProps) {
  const content = (
    <>
      <div className="member-chip__copy">
        <span className="member-chip__label">{status}</span>
        <span className="member-chip__name">{username}</span>
      </div>
      <div className="avatar avatar--sm member-chip__avatar">{avatar}</div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="member-chip border-glow"
        onClick={onClick}
        aria-haspopup="menu"
        aria-expanded={expanded}
        aria-controls={controls}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className="member-chip border-glow">
      {content}
    </Link>
  );
}
