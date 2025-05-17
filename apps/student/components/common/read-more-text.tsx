import { useState, HTMLAttributes } from "react";

interface ReadMoreProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
  maxLength?: number;
  className?: string;
  buttonClassName?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({
  text,
  maxLength = 100,
  className = "",
  buttonClassName = "",
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    return (
      <div className={className} {...props}>
        {text}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      <div className="transition-all duration-300 ease-in-out">
        {isExpanded ? text : `${text.substring(0, maxLength)}... `}
      </div>
      <button
        className={`mt-1 font-semibold text-blue-500 ${buttonClassName}`.trim()}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Show less" : "Read more"}
        type="button"
      >
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
};

export default ReadMore;
