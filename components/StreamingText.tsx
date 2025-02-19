// StreamingText.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingTextProps {
  text: string;
  speaker: string;
  className?: string;
  onComplete?: () => void;
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  speaker,
  className = '',
  onComplete,
}) => {
  const [streamedText, setStreamedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const streamText = useCallback(async () => {
    if (speaker === 'Sam') {
      const words = text.split(' ');
      let currentText = '';

      for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? '' : ' ') + words[i];
        setStreamedText(currentText);
        await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms delay per word
      }
    } else {
      // Display text immediately for other speakers
      setStreamedText(text);
    }

    setIsComplete(true);
    onComplete?.();
  }, [text, speaker, onComplete]);

  useEffect(() => {
    setIsComplete(false);
    setStreamedText('');
    streamText();
  }, [streamText]); // Simplified dependency array

  return (
    <div className={`relative ${!isComplete ? 'streaming' : ''}`}>
      <ReactMarkdown className={`${className} ${!isComplete ? 'animate-text' : ''}`}>
        {streamedText}
      </ReactMarkdown>
      {!isComplete && speaker === 'Sam' && (
        <div className="absolute bottom-0 right-0 w-1 h-4 bg-blue-500 animate-pulse" />
      )}
    </div>
  );
};