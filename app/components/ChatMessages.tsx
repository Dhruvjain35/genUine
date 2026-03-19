'use client';

import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showTypingIndicator =
    isLoading &&
    (messages.length === 0 ||
      messages[messages.length - 1]?.role !== 'assistant' ||
      messages[messages.length - 1]?.content === '');

  const lastAssistantIsStreaming =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === 'assistant' &&
    messages[messages.length - 1]?.content !== '';

  return (
    <div
      className="flex-1 overflow-y-auto py-4"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Messages */}
      {messages.map((msg, i) => {
        const isLast = i === messages.length - 1;
        const streaming = isLast && lastAssistantIsStreaming && msg.role === 'assistant';
        return (
          <ChatBubble
            key={msg.timestamp + i}
            role={msg.role}
            content={msg.content}
            isStreaming={streaming}
          />
        );
      })}

      {/* Typing indicator (before assistant starts responding) */}
      {showTypingIndicator && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} style={{ height: '8px' }} />
    </div>
  );
}
