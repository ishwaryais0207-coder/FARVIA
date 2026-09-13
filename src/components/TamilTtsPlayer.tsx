import React, { useState, useEffect } from 'react';
import { tamilTts, TamilTtsState, TamilVoiceInfo } from '../utils/tamilTtsService';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Radio, 
  SlidersHorizontal,
  CheckCircle2,
  Play,
  Pause
} from 'lucide-react';

interface TamilTtsPlayerProps {
  tamilConfirmationText: string;
  englishMeaning?: string;
  autoTrigger?: boolean;
  intentLabel?: string;
  onFinishedSpeaking?: () => void;
}

export const TamilTtsPlayer: React.FC<TamilTtsPlayerProps> = ({
  tamilConfirmationText,
  englishMeaning,
  autoTrigger = true,
  intentLabel = 'குரல் உறுதிப்படுத்தல் (Spoken Confirmation)',
  onFinishedSpeaking,
}) => {
  const [ttsState, setTtsState] = useState<TamilTtsState>(tamilTts.getState());
  const [voiceInfo, setVoiceInfo] = useState<TamilVoiceInfo>(tamilTts.getVoiceInfo());
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [showSpeedControls, setShowSpeedControls] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = tamilTts.subscribe((newState) => {
      setTtsState(newState);
    });

    setVoiceInfo(tamilTts.getVoiceInfo());

    // Trigger spoken confirmation automatically when new text is received
    if (autoTrigger && tamilConfirmationText) {
      tamilTts.speakTamil(tamilConfirmationText, englishMeaning, {
        rate: speechRate,
        onEnd: onFinishedSpeaking,
      });
    }

    return () => {
      unsubscribe();
    };
  }, [tamilConfirmationText, englishMeaning]);

  const handleReplay = () => {
    tamilTts.speakTamil(tamilConfirmationText, englishMeaning, {
      rate: speechRate,
      onEnd: onFinishedSpeaking,
    });
  };

  const handleTogglePlayPause = () => {
    if (ttsState.isSpeaking) {
      if (ttsState.isPaused) {
        tamilTts.resume();
      } else {
        tamilTts.pause();
      }
    } else {
      handleReplay();
    }
  };

  const handleStop = () => {
    tamilTts.stop();
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    tamilTts.setRate(newRate);
    if (ttsState.isSpeaking) {
      // Re-trigger with new rate
      tamilTts.speakTamil(tamilConfirmationText, englishMeaning, {
        rate: newRate,
        playChimeFirst: false,
      });
    }
  };

  return (
    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-900/90 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl overflow-hidden relative animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar with Voice Status */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
            ttsState.isSpeaking 
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 animate-pulse' 
              : 'bg-white/10 text-emerald-400'
          }`}>
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {intentLabel}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Tamil TTS
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {voiceInfo.hasNativeTamilVoice 
                ? `குரல்: ${voiceInfo.voiceName} (ta-IN)` 
                : 'உடனடி தமிழ் ஒலி உறுதிப்படுத்தல் (Active)'}
            </p>
          </div>
        </div>

        {/* Live Audio Visualizer Animation */}
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-1 h-5 px-2 py-1 bg-black/30 rounded-lg border border-white/5">
            {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((heightMultiplier, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  ttsState.isSpeaking && !ttsState.isPaused
                    ? 'bg-gradient-to-t from-emerald-500 to-teal-200 animate-pulse'
                    : 'bg-white/20'
                }`}
                style={{
                  height: ttsState.isSpeaking && !ttsState.isPaused 
                    ? `${Math.max(4, heightMultiplier * 18)}px` 
                    : '4px',
                  animationDelay: `${i * 120}ms`,
                  animationDuration: '350ms',
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setShowSpeedControls(!showSpeedControls)}
            title="Speech Settings"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Speed Controls Drawer */}
      {showSpeedControls && (
        <div className="mb-3 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px] animate-in fade-in">
          <span className="text-slate-300 font-medium">பேசும் வேகம் (Speech Rate):</span>
          <div className="flex items-center gap-1.5">
            {[
              { rate: 0.8, label: '0.8x மெதுவாக' },
              { rate: 0.95, label: '1.0x இயல்பாக' },
              { rate: 1.2, label: '1.2x வேகமாக' },
            ].map(item => (
              <button
                key={item.rate}
                onClick={() => handleRateChange(item.rate)}
                className={`px-2 py-1 rounded-lg font-semibold transition ${
                  Math.abs(speechRate - item.rate) < 0.05
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tamil Spoken Confirmation Main Text */}
      <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-left relative">
        <span className="text-[10px] font-bold text-amber-300 block mb-1 uppercase tracking-wider flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
          {ttsState.isSpeaking ? '📢 ஒலித்துக் கொண்டிருக்கிறது (Speaking):' : '✅ தமிழ் உறுதிப்படுத்தல் உரை:'}
        </span>
        
        <p className="text-sm font-semibold text-emerald-50 leading-relaxed font-sans tracking-wide">
          "{tamilConfirmationText}"
        </p>

        {englishMeaning && (
          <p className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-300 font-normal leading-normal italic">
            Meaning: {englishMeaning}
          </p>
        )}
      </div>

      {/* Playback Control Action Buttons */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            onClick={handleTogglePlayPause}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
              ttsState.isSpeaking && !ttsState.isPaused
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {ttsState.isSpeaking && !ttsState.isPaused ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>நிறுத்து (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{ttsState.isPaused ? 'தொடர் (Resume)' : 'மீண்டும் கேள் (Play)'}</span>
              </>
            )}
          </button>

          {/* Replay */}
          <button
            onClick={handleReplay}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition active:scale-95"
            title="Replay Spoken Confirmation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
            <span>மீண்டும் (Replay)</span>
          </button>

          {/* Stop / Silence */}
          {ttsState.isSpeaking && (
            <button
              onClick={handleStop}
              className="px-2 py-1.5 rounded-xl text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 flex items-center gap-1 transition"
              title="Stop Speech"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>அமைதி</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>குரல் சரிபார்க்கப்பட்டது</span>
        </div>
      </div>
    </div>
  );
};
