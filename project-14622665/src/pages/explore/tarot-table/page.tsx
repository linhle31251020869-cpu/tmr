import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tarotThemes, tarotCards } from '@/mocks/mysticData';
import { useAuth } from '@/context/AuthContext';
import { saveResult } from '@/lib/mysticStore';
import { trackEvent } from '@/lib/tracking';
import ExploreDisclaimer from '@/components/feature/ExploreDisclaimer';
import ExploreNext from '@/components/feature/ExploreNext';

type Theme = (typeof tarotThemes)[number];
type Card = (typeof tarotCards)[number];

function buildTopicInterpretation(themeData: Theme | undefined, card: Card, isReversed: boolean) {
  const core = isReversed ? card.reversed : card.upright;
  if (!themeData) return core;
  return `Đối với chủ đề “${themeData.label}” mà bạn đang nắm giữ, ${core}`;
}

function buildPersonalAdvice(themeData: Theme | undefined, answers: string[], card: Card) {
  const filled = (answers || []).map((a) => a.trim()).filter(Boolean);
  if (filled.length === 0) return card.advice;
  return `Dựa trên ${filled.length} điều bạn vừa chia sẻ khi kết nối năng lượng về “${themeData?.label || ''}”, ${card.advice}`;
}

function shuffleDeck<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Deterministic hash để giữ kết quả nhất quán: cùng lá bài + cùng phiên xào => cùng hướng lá bài.
function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

export default function TarotTable() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [energyAnswers, setEnergyAnswers] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleId, setShuffleId] = useState(0);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const themeData = tarotThemes.find((t) => t.id === selectedTheme);
  const selectedCardData = tarotCards.find((c) => c.id === selectedCard);

  const selectTheme = (id: string) => {
    setSelectedTheme(id);
    const questions = tarotThemes.find((t) => t.id === id)?.questions || [];
    setEnergyAnswers(questions.map(() => ''));
    setShowTable(false);
    setShuffled(false);
    setSelectedCard(null);
    setIsReversed(false);
    setShowResult(false);
    setSavedMsg(null);
    setSaved(false);
    setDeck([]);
    setIsShuffling(false);
  };

  const allAnswered =
    themeData && themeData.questions.every((_, i) => energyAnswers[i]?.trim());
  const readyToDraw = Boolean(allAnswered);

  const goDraw = () => {
    setShowTable(true);
    setShuffled(false);
    setSelectedCard(null);
    setIsReversed(false);
    setShowResult(false);
    setDeck([]);
    setIsShuffling(false);
  };

  const handleShuffle = () => {
    setSelectedCard(null);
    setIsReversed(false);
    setShowResult(false);
    setIsShuffling(true);
    setShuffled(false);
    setDeck([]);
    setTimeout(() => {
      setDeck(shuffleDeck([...tarotCards]));
      setShuffleId((n) => n + 1);
      setShuffled(true);
      setIsShuffling(false);
    }, 1300);
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCard(cardId);
    setIsReversed(hashCode(`${cardId}:${shuffleId}:${selectedTheme}`) % 2 === 0);
    setSaved(false);
    setShowResult(true);
    const drewCard = tarotCards.find((c) => c.id === cardId);
    void trackEvent('tarot_viewed', { theme: selectedTheme, card: drewCard?.name }, user?.id);
  };

  const goBackToTable = () => {
    setSelectedCard(null);
    setIsReversed(false);
    setShowResult(false);
  };

  const reset = () => {
    setSelectedTheme(null);
    setEnergyAnswers([]);
    setShowTable(false);
    setShuffled(false);
    setSelectedCard(null);
    setIsReversed(false);
    setShowResult(false);
    setSavedMsg(null);
    setSaved(false);
    setDeck([]);
    setIsShuffling(false);
  };

  const handleSave = async (): Promise<boolean> => {
    if (!user) {
      navigate('/auth', { state: { redirect: '/explore/tarot-table' } });
      return false;
    }
    if (!selectedCardData) return false;
    setSaving(true);
    setSavedMsg(null);
    const { error } = await saveResult(user.id, 'tarot', {
      theme: themeData?.label || '',
      cardName: selectedCardData.name,
      number: selectedCardData.number,
      image: selectedCardData.image,
      keywords: selectedCardData.keywords || [],
      meaning: isReversed ? selectedCardData.reversed : selectedCardData.upright,
      isReversed,
    });
    setSaving(false);
    if (error) {
      setSavedMsg('Có lỗi khi lưu. Vui lòng thử lại.');
      return false;
    }
    setSaved(true);
    setSavedMsg('Đã lưu lá bài vào Hành Trình của bạn!');
    return true;
  };

  const stepIndex = !selectedTheme ? 1 : !showTable ? 2 : !showResult ? 3 : 4;
  const steps = ['Chọn chủ đề', 'Kết nối năng lượng', 'Bốc bài', 'Luận giải'];

  return (
    <div className="min-h-screen bg-mystic-gradient pt-20">
      {/* Header */}
      <section className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 star-bg">
        <div className="absolute inset-0 bg-mystic-radial" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4 text-mystic-purple-300">
            <Link to={{ pathname: '/', state: { scrollTo: 'discovery' } }} className="text-sm hover:text-white transition-colors">
              Khám Phá
            </Link>
            <span className="text-mystic-purple-600">/</span>
            <span className="text-sm text-mystic-gold-400">Tarot Table</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="mystic-heading text-3xl md:text-5xl font-bold text-glow-gold">
                Tarot Table
              </h1>
              <p className="mystic-subheading text-sm md:text-base italic text-mystic-purple-300 mt-2">
                Tarot, nhưng theo cách của bạn. Chọn điều bạn đang muốn hiểu, rút một lá bài và khám phá những góc nhìn mới về cảm xúc, suy nghĩ và hành trình của chính mình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step Indicator */}
      <section className="relative px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto relative z-10 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
          {steps.map((label, i) => {
            const n = i + 1;
            const active = n === stepIndex;
            const done = n < stepIndex;
            return (
              <div key={label} className="flex items-center gap-2 md:gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    active ? 'text-mystic-gold-400' : done ? 'text-mystic-purple-300' : 'text-mystic-purple-600'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                      active
                        ? 'border-mystic-gold-500 bg-mystic-gold-500/15'
                        : done
                          ? 'border-mystic-purple-400 text-mystic-purple-300'
                          : 'border-mystic-purple-700/50'
                    }`}
                  >
                    {done ? <i className="ri-check-line" /> : n}
                  </span>
                  <span className="text-xs whitespace-nowrap">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-4 md:w-8 h-px bg-mystic-purple-700/50" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 1: Theme Selection */}
      {!selectedTheme && (
        <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20 step-fade-in">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="max-w-3xl mx-auto mb-8">
              <ExploreDisclaimer />
            </div>
            <div className="text-center mb-8">
              <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400 mb-2">
                Hôm nay, điều gì đang ở trong tâm trí bạn?
              </h2>
              <p className="mystic-text text-sm opacity-60">
                Chọn một chủ đề để bắt đầu hành trình khám phá.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {tarotThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  className="mystic-card rounded-xl p-4 text-center group hover:border-mystic-gold-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-3 border border-mystic-purple-700/30 group-hover:scale-[1.03] group-hover:border-mystic-gold-500/40 transition-all duration-300">
                    <img
                      src={theme.image}
                      alt={theme.label}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618]/50 to-transparent" />
                  </div>
                  <h3 className="mystic-heading text-base md:text-lg font-bold text-white mb-1">{theme.label}</h3>
                  <p className="mystic-text text-xs opacity-60">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Connect Energy */}
      {selectedTheme && !showTable && themeData && (
        <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20 step-fade-in">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-mystic-purple-300/60 uppercase tracking-wider">Chủ Đề</span>
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400">
                  {themeData.label}
                </h2>
              </div>
              <button onClick={reset} className="mystic-btn-outline text-xs py-2 px-4">
                <i className="ri-arrow-left-line" /> Đổi Chủ Đề
              </button>
            </div>

            <div className="mystic-card rounded-2xl p-6 md:p-8 mb-6">
              <div className="mb-5">
                <h3 className="mystic-heading text-base font-bold text-white">Kết Nối Năng Lượng</h3>
                <p className="mystic-text text-xs opacity-60">
                  Trước khi bốc bài, hãy trả lời vài điều để lá bài hiểu đúng nơi bạn đang đứng.
                </p>
              </div>

              <div className="space-y-4">
                {themeData.questions.map((question, i) => (
                  <div key={i} className="bg-mystic-purple-950/40 border border-mystic-purple-800/30 rounded-xl p-4">
                    <label className="mystic-heading text-sm text-mystic-purple-200 mb-2 block">
                      {i + 1}. {question}
                    </label>
                    <textarea
                      value={energyAnswers[i] || ''}
                      onChange={(e) => {
                        const next = [...energyAnswers];
                        next[i] = e.target.value;
                        setEnergyAnswers(next);
                      }}
                      placeholder="Chia sẻ điều gì đó thật lòng..."
                      className="w-full h-20 bg-mystic-purple-900/30 border border-mystic-purple-700/30 rounded-xl p-3 text-sm text-mystic-purple-200 placeholder:text-mystic-purple-500/50 focus:outline-none focus:border-mystic-gold-500/40 resize-none"
                      maxLength={500}
                    />
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={goDraw}
                  disabled={!readyToDraw}
                  className="mystic-btn-gold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {readyToDraw ? 'Bạn đã sẵn sàng để bốc bài' : 'Hoàn thành để sẵn sàng bốc bài'}
                </button>
                {!readyToDraw && (
                  <p className="mystic-text text-xs opacity-50 mt-3">
                    Hãy trả lời từng câu hỏi trên để lá bài luận giải đúng theo bạn.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Card Table */}
      {selectedTheme && showTable && !showResult && (
        <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20 step-fade-in">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs text-mystic-purple-300/60 uppercase tracking-wider">Chủ Đề</span>
                <h2 className="mystic-heading text-lg font-bold text-mystic-gold-400">
                  {themeData?.label}
                </h2>
              </div>
              <button onClick={reset} className="mystic-btn-outline text-xs py-2 px-4">
                <i className="ri-arrow-left-line" /> Đổi Chủ Đề
              </button>
            </div>

            {!shuffled && !isShuffling ? (
              <div className="text-center py-16">
                <div className="mb-8">
                  <div className="w-32 h-48 md:w-40 md:h-60 rounded-xl card-back-minimal border border-mystic-gold-500/30 mx-auto glow-purple" />
                </div>
                <p className="mystic-text text-sm mb-6 opacity-70">
                  Nhắm mắt lại. Hít một hơi thật sâu. Khi bạn sẵn sàng, hãy xào bài và chọn một lá.
                </p>
                <button onClick={handleShuffle} className="mystic-btn-gold text-sm">
                  Xào Bài
                </button>
              </div>
            ) : isShuffling ? (
              <div className="text-center py-16">
                <div className="relative flex items-center justify-center h-64 mb-8">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="shuffle-card absolute w-28 h-44 md:w-32 md:h-48 rounded-xl card-back-minimal border border-mystic-gold-500/30"
                      style={{ animationDelay: `${i * 0.11}s`, zIndex: i }}
                    />
                  ))}
                </div>
                <p className="mystic-text text-sm opacity-70">
                  <i className="ri-restart-line animate-spin inline-block mr-2 text-mystic-gold-400" />
                  Đang xáo trộn những lá bài...
                </p>
              </div>
            ) : (
              <div className="deck-ready">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-8">
                  {deck.map((card, i) => (
                    <button
                      key={`${card.id}-${shuffleId}`}
                      onClick={() => handleSelectCard(card.id)}
                      style={{ animationDelay: `${i * 0.06}s` }}
                      className="card-reveal group relative aspect-[2/3] rounded-xl overflow-hidden border border-mystic-purple-700/30 hover:border-mystic-gold-500/40 transition-all duration-300 cursor-pointer glow-purple hover:glow-gold"
                    >
                      <div className="absolute inset-0 card-back-minimal" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <button onClick={handleShuffle} className="mystic-btn-outline text-xs py-2 px-4">
                    Xào Lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 4: Result */}
      {showResult && selectedCardData && (
        <section className="relative py-8 md:py-12 px-6 md:px-12 lg:px-20 step-fade-in">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mystic-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Card Image */}
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <div className="card-flip-in h-full w-full">
                    <img
                      src={selectedCardData.image}
                      alt={selectedCardData.name}
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full object-cover ${isReversed ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0618]/80 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0618] to-transparent md:hidden" />
                </div>

                {/* Result Content */}
                <div className="p-6 md:p-8">
                  <div className="mb-2">
                    <span className="text-xs text-mystic-purple-300/60 uppercase tracking-wider">Lá Bài Của Bạn</span>
                  </div>

                  {/* Part 1: Card Name */}
                  <div className="flex items-center gap-3 flex-wrap mb-5">
                    <h2 className="mystic-heading text-2xl font-bold text-mystic-gold-400">
                      {selectedCardData.name}
                    </h2>
                    {isReversed && (
                      <span className="px-3 py-1 rounded-full bg-mystic-gold-500/10 border border-mystic-gold-500/40 text-xs text-mystic-gold-300 whitespace-nowrap">
                        (Lá bài ngược)
                      </span>
                    )}
                  </div>

                  {/* Part 2: Keywords */}
                  {selectedCardData.keywords && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {selectedCardData.keywords.map((k: string) => (
                        <span key={k} className="px-3 py-1.5 rounded-full bg-mystic-purple-900/50 border border-mystic-purple-700/30 text-xs text-mystic-purple-200">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mystic-divider mb-5" />

                  {/* Part 3: Topic Interpretation */}
                  <div className="mb-5">
                    <h3 className="mystic-heading text-xs text-mystic-gold-300 tracking-[0.2em] uppercase mb-2">
                      Diễn Giải Theo Chủ Đề
                    </h3>
                    <p className="mystic-text text-sm opacity-80">
                      {buildTopicInterpretation(themeData, selectedCardData, isReversed)}
                    </p>
                  </div>

                  {/* Part 4: Personal Advice */}
                  <div className="mb-6 bg-mystic-gold-500/10 border border-mystic-gold-500/20 rounded-xl p-4">
                    <h3 className="mystic-heading text-xs text-mystic-gold-300 tracking-[0.2em] uppercase mb-2">
                      Lời Khuyên Dành Riêng Cho Bạn
                    </h3>
                    <p className="mystic-text text-sm opacity-80">
                      {buildPersonalAdvice(themeData, energyAnswers, selectedCardData)}
                    </p>
                  </div>

                  {savedMsg && (
                    <div className="mb-5 bg-mystic-gold-500/10 border border-mystic-gold-500/30 rounded-lg px-4 py-3 text-sm text-mystic-gold-300">
                      {savedMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={goBackToTable} className="mystic-btn-outline text-xs py-2 px-4 justify-center">
                      <i className="ri-arrow-left-line" /> Bốc Lại
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="mystic-btn-primary text-xs py-2 px-4 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <i className="ri-loader-4-line animate-spin" /> Đang Lưu...
                        </>
                      ) : (
                        <>
                          {user ? 'Lưu Vào Hành Trình' : 'Đăng Nhập Để Lưu'}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-center pt-3">
                    <ExploreNext
                      nextPath="/my-profile"
                      nextLabel="Mystic Profile"
                      saved={saved}
                      saving={saving}
                      onSave={handleSave}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}