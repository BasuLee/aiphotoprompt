import { useState } from 'react';
import copy from 'clipboard-copy';
import { useTranslation } from 'next-i18next';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({ text, className, size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation('common');

  const handleCopy = async () => {
    try {
      await copy(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'rounded-md border border-gray-300 hover:bg-gray-50 transition-colors',
        sizeClasses[size],
        copied && 'bg-green-50 border-green-300 text-green-700',
        className
      )}
    >
      {copied ? t('prompt.copied') : t('prompt.copy')}
    </button>
  );
}