'use client';

import { useState, useEffect, useCallback } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import type { ChatMessage } from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import VoiceProfileModal from './components/VoiceProfileModal';
import type { VoiceProfile } from './components/VoiceProfileModal';
import WelcomeScreen from './components/WelcomeScreen';
import VoiceLearning from './components/VoiceLearning';
import LimitReached from './components/LimitReached';

const MAX_MESSAGES_PER_DAY = 5;

// Pre-scripted opening messages (avoid cold-start API call)
function getOpeningMessages(hasVoice: boolean): ChatMessage[] {
  if (hasVoice) {
    return [
      {
        role: 'assistant',
        content:
          "welcome back! your voice is still saved from last time. ready to write some messages?\n\njust paste a linkedin profile and i'll get to work.",
        timestamp: Date.now(),
      },
    ];
  }
  return [
    {
      role: 'assistant',
      content:
        "hey! i'm genuine. i help you write linkedin messages that actually sound like you, not like ai.\n\nbefore i can do that, i need to learn how you talk. can you paste me 3-5 linkedin messages or DMs you've sent before? just copy paste them one at a time.\n\npick ones where you felt like yourself — not ones where you were trying to sound professional.",
      timestamp: Date.now(),
    },
  ];
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [voiceExamples, setVoiceExamples] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messagesGeneratedToday, setMessagesGeneratedToday] = useState(0);
  const [selectedTone, setSelectedTone] = useState('');

  const messagesRemaining = MAX_MESSAGES_PER_DAY - messagesGeneratedToday;

  // Load persisted data on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('genuine_voice_profile');
      const savedExamples = localStorage.getItem('genuine_voice_examples');
      const savedCount = localStorage.getItem('genuine_messages_today');
      const savedDate = localStorage.getItem('genuine_last_reset_date');

      if (savedProfile) setVoiceProfile(JSON.parse(savedProfile));
      if (savedExamples) setVoiceExamples(JSON.parse(savedExamples));

      // Reset daily count if new day
      const today = new Date().toDateString();
      if (savedDate !== today) {
        localStorage.setItem('genuine_last_reset_date', today);
        localStorage.setItem('genuine_messages_today', '0');
        setMessagesGeneratedToday(0);
      } else if (savedCount) {
        setMessagesGeneratedToday(parseInt(savedCount, 10));
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    // For returning users (voice already saved), show opening message immediately
    if (voiceProfile) {
      setMessages(getOpeningMessages(true));
    }
    // For new users, VoiceLearning renders. Opening message fires via the effect below.
  }, [voiceProfile]);

  // When voice profile is first created (after VoiceLearning), kick off the chat
  useEffect(() => {
    if (hasStarted && voiceProfile && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "got it — i've got a solid read on how you talk now.\n\njust paste a linkedin profile and i'll write something in your voice.",
          timestamp: Date.now(),
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceProfile, hasStarted]);

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setHasStarted(false);
  }, []);

  const handleResetLimit = useCallback(() => {
    setMessagesGeneratedToday(0);
    try {
      localStorage.setItem('genuine_messages_today', '0');
    } catch {}
  }, []);

  const handleClearVoice = useCallback(() => {
    setVoiceProfile(null);
    setVoiceExamples([]);
    try {
      localStorage.removeItem('genuine_voice_profile');
      localStorage.removeItem('genuine_voice_examples');
    } catch {}
    setShowModal(false);
  }, []);

  const analyzeAndSaveVoice = useCallback(async (examples: string[]) => {
    if (examples.length === 0) return;
    try {
      const res = await fetch('/api/analyze-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examples }),
      });
      if (res.ok) {
        const profile = await res.json();
        const fullProfile: VoiceProfile = { ...profile, examples };
        setVoiceProfile(fullProfile);
        try {
          localStorage.setItem('genuine_voice_profile', JSON.stringify(fullProfile));
        } catch {}
      }
    } catch (err) {
      console.error('Voice analysis error:', err);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      // Collect voice examples during the learning phase (before voice is saved)
      // Use a length heuristic to distinguish examples from short responses
      if (!voiceProfile && content.length > 25) {
        const newExamples = [...voiceExamples, content];
        setVoiceExamples(newExamples);
        try {
          localStorage.setItem('genuine_voice_examples', JSON.stringify(newExamples));
        } catch {}
      }

      setIsLoading(true);

      // Add empty placeholder for streaming
      const placeholder: ChatMessage = {
        role: 'assistant',
        content: '',
        timestamp: Date.now() + 1,
      };
      const messagesWithPlaceholder = [...newMessages, placeholder];
      setMessages(messagesWithPlaceholder);

      try {
        // Trim to last 20 messages to control token costs
        const trimmedMessages = newMessages.slice(-20).map((m) => ({ role: m.role, content: m.content }));

        // Strip raw examples from profile before sending — the JSON summary is enough
        const profileForApi = voiceProfile
          ? (({ examples: _e, ...rest }) => rest)(voiceProfile as VoiceProfile & { examples?: string[] })
          : null;

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: trimmedMessages,
            voiceProfile: profileForApi,
            messagesRemaining,
            tone: selectedTone || undefined,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error('API request failed');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullContent += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: fullContent,
                  };
                  return updated;
                });
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseErr) {
              if (parseErr instanceof SyntaxError) continue; // JSON parse error — ignore
              throw parseErr; // re-throw real errors
            }
          }
        }

        // If nothing was streamed, something went wrong
        if (!fullContent) {
          throw new Error('Empty response from API');
        }

        // Check for voice ready signal
        if (fullContent.includes('%%VOICE_READY%%') && !voiceProfile) {
          // Strip signal from displayed content
          const cleanContent = fullContent.replace('%%VOICE_READY%%', '').trimEnd();
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: cleanContent,
            };
            return updated;
          });

          // Trigger voice analysis with collected examples
          const currentExamples = [...voiceExamples, ...(content.length > 25 ? [content] : [])];
          if (currentExamples.length > 0) {
            analyzeAndSaveVoice(currentExamples);
          }
        }

        // Track message generation (code block = LinkedIn message generated)
        if (fullContent.includes('```') && voiceProfile) {
          const newCount = messagesGeneratedToday + 1;
          setMessagesGeneratedToday(newCount);
          try {
            localStorage.setItem('genuine_messages_today', newCount.toString());
          } catch {}
        }
      } catch (err) {
        console.error('Send error:', err);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: 'hmm, something went wrong — try again?',
          };
          return updated;
        });
      }

      setIsLoading(false);
    },
    [messages, voiceProfile, voiceExamples, isLoading, messagesRemaining, messagesGeneratedToday, analyzeAndSaveVoice]
  );

  // Full-screen layout
  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', backgroundColor: '#FFFFFF', overflow: 'hidden' }}
    >
      {/* Header always visible */}
      <ChatHeader
        voiceProfile={voiceProfile}
        onClearChat={handleClearChat}
        onShowVoice={() => setShowModal(true)}
      />

      {/* Chat area */}
      {!hasStarted ? (
        <WelcomeScreen voiceProfile={voiceProfile} onStart={handleStart} />
      ) : hasStarted && !voiceProfile ? (
        // Cinematic voice learning — shown to new users before chat
        <VoiceLearning onComplete={analyzeAndSaveVoice} />
      ) : messagesRemaining <= 0 ? (
        // MVP testing limit reached
        <LimitReached onReset={handleResetLimit} />
      ) : (
        <ChatMessages messages={messages} isLoading={isLoading} />
      )}

      {/* Input only shown in chat mode (when voice exists and limit not hit) */}
      {hasStarted && voiceProfile && messagesRemaining > 0 && (
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
          messagesRemaining={messagesRemaining}
          tone={selectedTone}
          onToneChange={setSelectedTone}
        />
      )}

      {/* Voice profile modal */}
      {showModal && (
        <VoiceProfileModal
          voiceProfile={voiceProfile}
          voiceExamples={voiceExamples}
          onClose={() => setShowModal(false)}
          onClearVoice={handleClearVoice}
          onBulkAnalyze={analyzeAndSaveVoice}
        />
      )}
    </div>
  );
}
