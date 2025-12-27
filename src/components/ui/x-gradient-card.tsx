import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyProps {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  isVerified?: boolean;
  timestamp: string;
}

interface XCardProps {
  link?: string;
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string[];
  isVerified?: boolean;
  timestamp: string;
  reply?: ReplyProps;
  className?: string;
}

function XCard({
  link = "#",
  authorName,
  authorHandle,
  authorImage,
  content,
  isVerified = false,
  timestamp,
  reply,
  className,
}: XCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block w-full max-w-lg mx-auto group",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary/30 border border-border/50 p-[1px] transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative rounded-2xl bg-card/80 backdrop-blur-sm p-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-border/50">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground truncate">
                    {authorName}
                  </span>
                  {isVerified && (
                    <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
                  )}
                  <span className="text-muted-foreground text-sm">
                    @{authorHandle}
                  </span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-muted-foreground"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-3 space-y-1">
            {content.map((item, index) => (
              <p
                key={index}
                className="text-sm text-foreground/90 leading-relaxed"
              >
                {item}
              </p>
            ))}
            <p className="text-xs text-muted-foreground pt-2">{timestamp}</p>
          </div>

          {/* Reply */}
          {reply && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-border/50">
                    <img
                      src={reply.authorImage}
                      alt={reply.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">
                      {reply.authorName}
                    </span>
                    {reply.isVerified && (
                      <BadgeCheck className="w-3.5 h-3.5 text-primary fill-primary/20" />
                    )}
                    <span className="text-muted-foreground text-xs">
                      @{reply.authorHandle}
                    </span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-muted-foreground text-xs">
                      {reply.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-1">
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export { XCard, type XCardProps, type ReplyProps };
