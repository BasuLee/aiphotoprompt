import { useState } from 'react';
import copy from 'clipboard-copy';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copy(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors',
        copied && 'bg-green-50 border-green-300 text-green-700',
        className
      )}
    >
      {copied ? '已复制' : '复制'}
    </button>
  );
}