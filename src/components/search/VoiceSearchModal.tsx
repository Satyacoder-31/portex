'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  Languages,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Search,
  Volume2,
} from 'lucide-react';
import { usePortex } from '@/lib/store/portexStore';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery?: (query: string) => void;
}

export default function VoiceSearchModal({ isOpen, onClose, onSelectQuery }: VoiceSearchModalProps) {
  const router = useRouter();
  const { addRecentSearch, showToast } = usePortex();

  // Permission state: 'PROMPT' | 'REQUESTING' | 'GRANTED' | 'DENIED'
  const [permissionState, setPermissionState] = useState<'PROMPT' | 'REQUESTING' | 'GRANTED' | 'DENIED'>('PROMPT');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [showTroubleshoot, setShowTroubleshoot] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Check microphone permissions & speech recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }

      // Check browser permissions query if available
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'microphone' as any })
          .then(status => {
            if (status.state === 'granted') {
              setPermissionState('GRANTED');
              localStorage.setItem('portex_mic_permission', 'GRANTED');
            } else if (status.state === 'denied') {
              setPermissionState('DENIED');
            } else {
              const saved = localStorage.getItem('portex_mic_permission');
              if (saved === 'GRANTED') {
                setPermissionState('GRANTED');
              } else {
                setPermissionState('PROMPT');
              }
            }

            status.onchange = () => {
              if (status.state === 'granted') {
                setPermissionState('GRANTED');
                localStorage.setItem('portex_mic_permission', 'GRANTED');
              } else if (status.state === 'denied') {
                setPermissionState('DENIED');
              }
            };
          })
          .catch(() => {
            const saved = localStorage.getItem('portex_mic_permission');
            if (saved === 'GRANTED') setPermissionState('GRANTED');
          });
      } else {
        const saved = localStorage.getItem('portex_mic_permission');
        if (saved === 'GRANTED') setPermissionState('GRANTED');
      }
    }
  }, []);

  // When modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setManualInput('');
      setErrorMsg(null);
      setShowTroubleshoot(false);

      if (permissionState === 'GRANTED') {
        startListeningSession();
      }
    } else {
      stopListeningSession();
    }

    return () => {
      stopListeningSession();
    };
  }, [isOpen, permissionState, selectedLanguage]);

  // Request microphone permission directly
  const handleRequestPermission = async () => {
    setPermissionState('REQUESTING');
    setErrorMsg(null);

    try {
      // 1. Try requesting browser audio stream first
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        activeStreamRef.current = stream;

        localStorage.setItem('portex_mic_permission', 'GRANTED');
        setPermissionState('GRANTED');
        showToast('Microphone access enabled!');
        startSpeechRecognition();
        return;
      }

      // 2. If getUserMedia is not directly supported, try native SpeechRecognition
      localStorage.setItem('portex_mic_permission', 'GRANTED');
      setPermissionState('GRANTED');
      startSpeechRecognition();
    } catch (err: any) {
      console.warn('Microphone permission error:', err);
      setPermissionState('DENIED');
      setErrorMsg('Microphone access is currently blocked in your browser for this page.');
    }
  };

  const startListeningSession = () => {
    startSpeechRecognition();
  };

  const stopListeningSession = () => {
    stopSpeechRecognition();
    if (activeStreamRef.current) {
      try {
        activeStreamRef.current.getTracks().forEach(t => t.stop());
      } catch {
        // ignore
      }
      activeStreamRef.current = null;
    }
  };

  const startSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setIsListening(true);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        setManualInput(text);

        if (event.results[current].isFinal) {
          handleSearchSuccess(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          setPermissionState('DENIED');
          setErrorMsg('Microphone access is blocked in your browser address bar.');
        } else if (event.error === 'no-speech') {
          setErrorMsg('No speech detected. Tap the mic and speak again.');
        } else {
          setErrorMsg('Listening timed out. Tap mic to retry or choose a query below.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('SpeechRecognition start error:', e);
      setIsListening(false);
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSearchSuccess = (queryText: string) => {
    const clean = queryText.trim().replace(/[.?]$/, '');
    if (!clean) return;

    addRecentSearch(clean);
    showToast(`Voice Search: "${clean}"`);

    stopListeningSession();
    onClose();

    if (onSelectQuery) {
      onSelectQuery(clean);
    } else {
      router.push(`/marketplace?q=${encodeURIComponent(clean)}`);
    }
  };

  const handleResetPermission = () => {
    localStorage.removeItem('portex_mic_permission');
    setPermissionState('PROMPT');
    setErrorMsg(null);
    setShowTroubleshoot(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0e0e13] rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden p-6 space-y-5 text-center text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          aria-label="Close Voice Search"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SCREEN 1: PERMISSION REQUEST PROMPT */}
        {(permissionState === 'PROMPT' || permissionState === 'REQUESTING') && (
          <div className="py-2 space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-lg shadow-amber-500/20">
              <Mic className="w-8 h-8 animate-pulse text-amber-400" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Microphone Permission</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Enable Voice Search
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Portex uses your microphone to transcribe your spoken search queries into product and cargo searches in real time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleRequestPermission}
                disabled={permissionState === 'REQUESTING'}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black rounded-xl text-xs font-black shadow-lg shadow-amber-500/30 transition-transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4 text-black" />
                <span>{permissionState === 'REQUESTING' ? 'Requesting Access...' : 'Allow Microphone Access'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPermissionState('GRANTED')}
                className="w-full sm:w-auto px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold border border-zinc-800"
              >
                Skip to Voice Mode
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: PERMISSION BLOCKED / DENIED (WITH INSTANT UNBLOCK GUIDE & FALLBACK SEARCH) */}
        {permissionState === 'DENIED' && (
          <div className="py-2 space-y-4 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 flex-shrink-0">
                <MicOff className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-amber-300">
                  Microphone is Blocked in Browser Settings
                </h4>
                <p className="text-[11px] text-amber-200/70">
                  Your browser address bar has microphone permissions toggled off for this site.
                </p>
              </div>
            </div>

            {/* Step-by-Step Instructions Card */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-2.5">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>How to Allow Microphone in 10 seconds:</span>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 text-[11px]">
                <li>
                  Look at the <strong>top address bar</strong> of your browser (next to the URL).
                </li>
                <li>
                  Click the <strong>🔒 Lock icon</strong> or <strong>Tune/Sliders icon</strong>.
                </li>
                <li>
                  Find <strong>Microphone</strong> and switch it to <strong>"Allow"</strong>.
                </li>
                <li>
                  Tap <strong>"Retry Microphone"</strong> below to start speaking!
                </li>
              </ol>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Microphone</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPermission}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold"
                >
                  Reset Settings
                </button>
              </div>
            </div>

            {/* Instant Fallback Query Input */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Or Search Directly by Typing:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={e => setManualInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchSuccess(manualInput)}
                  placeholder="e.g. MacBook Pro, Tata Ace, Courier..."
                  className="flex-1 p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleSearchSuccess(manualInput)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-xl text-xs font-black"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: ACTIVE VOICE SEARCH INTERFACE */}
        {permissionState === 'GRANTED' && (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Portex Voice Search</span>
              </div>

              <h3 className="text-xl font-black text-white">
                {isListening ? 'Listening to your voice...' : 'Tap Mic to Speak'}
              </h3>

              <p className="text-xs text-zinc-400 mt-0.5">
                Speak any item, vehicle, or cargo requirement in English or Hindi
              </p>
            </div>

            {/* Animated Mic Button */}
            <div className="relative flex items-center justify-center py-2">
              {isListening && (
                <>
                  <span className="absolute w-36 h-36 rounded-full bg-amber-500/20 animate-ping" />
                  <span className="absolute w-28 h-28 rounded-full bg-amber-500/30 animate-pulse" />
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopSpeechRecognition();
                  } else {
                    startSpeechRecognition();
                  }
                }}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-black scale-110 shadow-amber-500/40 ring-4 ring-amber-300/40'
                    : 'bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black shadow-amber-500/30'
                }`}
              >
                {isListening ? <Mic className="w-9 h-9 animate-bounce text-black" /> : <Mic className="w-9 h-9 text-black" />}
              </button>
            </div>

            {/* Transcript Display */}
            <div className="min-h-[48px] flex items-center justify-center px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white text-sm font-semibold">
              {transcript ? (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">"{transcript}"</span>
                  <button
                    type="button"
                    onClick={() => handleSearchSuccess(transcript)}
                    className="px-2.5 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black rounded-lg shadow flex items-center gap-1"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3 text-black" />
                  </button>
                </div>
              ) : (
                <span className="text-zinc-500 text-xs italic">
                  {isListening ? 'Speak now... (e.g. "MacBook Pro" or "Tata Ace")' : errorMsg || 'Microphone is ready. Tap to speak.'}
                </span>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-center gap-2 text-xs">
              <Languages className="w-4 h-4 text-zinc-400" />
              <span className="text-zinc-400 font-medium">Language:</span>
              <button
                type="button"
                onClick={() => setSelectedLanguage('en-IN')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedLanguage === 'en-IN'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                English (India)
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('hi-IN')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedLanguage === 'hi-IN'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-black shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                हिंदी (Hindi)
              </button>
            </div>
          </div>
        )}

        {/* Quick Search Suggestions (Always accessible at the bottom) */}
        <div className="pt-2 border-t border-zinc-800 text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Tap to search instantly:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Apple MacBook Pro',
              'Tata Ace Mini Truck',
              '2-Wheeler Express Courier',
              '3-Wheeler Auto Tempo',
              'Electronics',
              'Office Furniture',
            ].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setTranscript(item);
                  setTimeout(() => handleSearchSuccess(item), 300);
                }}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 hover:text-amber-300 text-zinc-300 rounded-xl text-xs font-medium border border-zinc-800 hover:border-amber-500/40 transition-colors cursor-pointer"
              >
                🎤 {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
