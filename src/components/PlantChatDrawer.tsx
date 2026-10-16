import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PlantAnalysisResult } from '../types';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Leaf,
  Cpu,
  CornerDownLeft,
} from 'lucide-react';

interface PlantChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlantContext: PlantAnalysisResult | null;
  onClearPlantContext?: () => void;
}

export const PlantChatDrawer: React.FC<PlantChatDrawerProps> = ({
  isOpen,
  onClose,
  currentPlantContext,
  onClearPlantContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '안녕하세요! 저는 식물 전문의이자 당신의 가드닝 파트너 **초록닥터(FloraBot)**입니다. 🌱\n\n키우시는 식물의 물주기, 잎 갈변, 병충해 증상, 분갈이 방법 등 궁금한 점을 편하게 물어보세요!',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'
  >('gemini-3.8-flash');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // When plant context is passed, optionally seed an contextual greeting
  useEffect(() => {
    if (currentPlantContext) {
      const plantGreeting: ChatMessage = {
        id: `context-${Date.now()}`,
        role: 'assistant',
        content: `**${currentPlantContext.commonNameKo}**(${currentPlantContext.scientificName})에 대한 상담을 시작합니다.\n\n건강 상태: **${currentPlantContext.healthStatus}**\n이 식물의 물주기 주기나 관리법, 병충해 대처에 대해 어떤 점이 궁금하신가요?`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, plantGreeting]);
    }
  }, [currentPlantContext]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation payload
      const payload = {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        modelPreference: selectedModel,
        plantContext: currentPlantContext,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || '챗봇 응답을 받지 못했습니다.');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || '죄송합니다. 답변을 생성하지 못했습니다.',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ 오류가 발생했습니다: ${err?.message || '잠시 후 다시 시도해 주세요.'}`,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: '대화가 초기화되었습니다. 식물에 대해 무엇이든 편하게 물어보세요! 🌿',
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  const quickQuestions = [
    '잎 끝이 노랗게 타들어가요, 원인이 뭘까요?',
    '장마철 과습 예방법 알려주세요',
    '초보자가 키우기 쉬운 실내 공기정화 식물은?',
    '화분에 작은 날파리(뿌리파리)가 생겼어요',
    '줄기 잘라서 물꽂이하는 방법',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-stone-200">
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">초록닥터 (FloraBot)</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  식물 전문의
                </span>
              </div>
              <p className="text-xs text-stone-300">다중 턴 식물 상담 및 병충해 솔루션</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="대화 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar */}
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-medium">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI 엔진:</span>
          </div>

          <div className="flex gap-1">
            {[
              { id: 'gemini-4-argon', label: 'Argon (정밀)', hint: '심화 추론' },
              { id: 'gemini-3.8-flash', label: 'Flash (표준)', hint: '일반 상담' },
              { id: 'gemini-3.1-flash-lite', label: 'Lite (고속)', hint: '빠른 Q&A' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  selectedModel === m.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
                title={m.hint}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plant Context Banner if active */}
        {currentPlantContext && (
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 truncate">
              <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                상담 대상: <strong>{currentPlantContext.commonNameKo}</strong> ({currentPlantContext.healthStatus})
              </span>
            </div>
            {onClearPlantContext && (
              <button
                onClick={onClearPlantContext}
                className="text-[11px] text-emerald-700 hover:text-emerald-900 underline shrink-0 ml-2"
              >
                해제
              </button>
            )}
          </div>
        )}

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-stone-800 rounded-tl-xs border border-stone-200 shadow-xs'
                  }`}
                >
                  {/* Message body with basic markdown line formatting */}
                  <div className="space-y-1.5 whitespace-pre-wrap break-words">
                    {m.content}
                  </div>

                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-emerald-200' : 'text-stone-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {m.modelUsed && (
                      <span className="font-mono opacity-80">{m.modelUsed}</span>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 border border-stone-200 shadow-xs text-xs text-stone-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>초록닥터가 식물학적 답변을 생각하고 있습니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-stone-100 overflow-x-auto flex gap-1.5 shrink-0">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] text-stone-600 border border-stone-200 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 bg-white border-t border-stone-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="식물에 관한 궁금한 점을 입력하세요..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
              title="전송"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
