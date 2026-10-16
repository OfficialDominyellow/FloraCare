import React, { useState } from 'react';
import {
  PlantAnalysisResult,
  SavedPlant,
} from '../types';
import {
  Sun,
  Droplets,
  Thermometer,
  CloudRain,
  Layers,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Scissors,
  BookmarkPlus,
  MessageCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Heart,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';

interface PlantResultCardProps {
  result: PlantAnalysisResult;
  imageUrl: string;
  onSaveToGarden: (plant: Omit<SavedPlant, 'id' | 'createdDate'>) => void;
  isSaved?: boolean;
  onAskChatbot: (plant: PlantAnalysisResult) => void;
  onReset: () => void;
}

export const PlantResultCard: React.FC<PlantResultCardProps> = ({
  result,
  imageUrl,
  onSaveToGarden,
  isSaved = false,
  onAskChatbot,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'care' | 'diagnosis' | 'propagation' | 'facts'>('care');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [nickname, setNickname] = useState(result.commonNameKo || '내 식물');
  const [location, setLocation] = useState('거실 창가');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const { careGuide, diagnosis } = result;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveToGarden({
      nickname: nickname.trim() || result.commonNameKo,
      plantData: result,
      imageUrl,
      location,
      lastWateredDate: new Date().toISOString(),
      notes: '',
    });
    setShowSaveModal(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3000);
  };

  const isHealthy = result.healthStatus === '건강함';
  const hasDiagnosisIssue = diagnosis?.hasIssue;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 shadow-lg shadow-stone-200/40 overflow-hidden transition-all duration-300">
      {/* Toast */}
      {saveSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">‘내 정원’에 식물이 추가되었습니다! 🌱</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8">
        {/* Subtle leaf overlay accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
          {/* Plant Photo */}
          <div className="relative w-full md:w-56 h-60 md:h-56 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-xl bg-stone-800">
            <img
              src={imageUrl}
              alt={result.commonNameKo}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              일치도 {result.confidence}%
            </div>
          </div>

          {/* Plant Title & Badges */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {result.family || '식물과'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-700/60 text-stone-200 border border-white/10">
                난이도: {result.difficultyLevel}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                  isHealthy
                    ? 'bg-teal-500/20 text-teal-300 border-teal-400/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                }`}
              >
                {isHealthy ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                )}
                {result.healthStatus}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {result.commonNameKo}
            </h1>
            <p className="text-emerald-300/90 text-sm font-medium mt-0.5">
              {result.commonNameEn}
            </p>
            <p className="text-stone-300 text-xs italic font-serif mt-1 opacity-80">
              학명: {result.scientificName}
            </p>

            <p className="mt-3 text-stone-200/90 text-sm leading-relaxed max-w-2xl">
              {result.summary}
            </p>

            {/* Quick action buttons */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={isSaved}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                  isSaved
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/40 cursor-default'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold shadow-md hover:shadow-emerald-500/30 active:scale-95'
                }`}
              >
                <BookmarkPlus className="w-4 h-4" />
                {isSaved ? '내 정원에 등록됨' : '내 정원에 등록하기'}
              </button>

              <button
                onClick={() => onAskChatbot(result)}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                초록닥터에게 질문하기
              </button>

              <button
                onClick={onReset}
                className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                새 사진 분석
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plant Doctor Alert Box if diagnosed with an issue */}
      {hasDiagnosisIssue && diagnosis && (
        <div className="bg-amber-50 border-b border-amber-200 p-5 sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  식물 닥터 진단 보고서
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  심각도: {diagnosis.severity}
                </span>
              </div>
              <h2 className="text-lg font-bold text-amber-950 mt-1">
                {diagnosis.issueTitle}
              </h2>
              <p className="text-amber-900/90 text-sm mt-1">
                <strong className="font-semibold text-amber-950">추정 원인: </strong>
                {diagnosis.cause}
              </p>

              {/* Treatments List */}
              {diagnosis.treatments && diagnosis.treatments.length > 0 && (
                <div className="mt-3 bg-white/80 rounded-xl p-3.5 border border-amber-200/70">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    응급 처치 및 회복 솔루션
                  </h4>
                  <ul className="space-y-1.5">
                    {diagnosis.treatments.map((step, i) => (
                      <li key={i} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-stone-200 bg-stone-50/70 px-6 sm:px-8 flex overflow-x-auto gap-2 py-2">
        <button
          onClick={() => setActiveTab('care')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'care'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          🌿 핵심 케어 가이드
        </button>
        {hasDiagnosisIssue && (
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'diagnosis'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            🩺 건강 진단 & 처방
          </button>
        )}
        <button
          onClick={() => setActiveTab('propagation')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'propagation'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          🌱 번식 & 분갈이
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'facts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
          }`}
        >
          💡 식물 상식 & 독성
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {/* TAB: Core Care */}
        {activeTab === 'care' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sunlight */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 hover:border-amber-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">햇빛 & 채광 환경</h3>
                  <span className="text-xs font-semibold text-amber-700">{careGuide.light.level}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                {careGuide.light.description}
              </p>
              <div className="bg-white rounded-xl p-2.5 text-xs text-stone-600 font-medium flex items-center gap-2 border border-stone-200">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>권장 채광 시간: <strong>{careGuide.light.idealHours}</strong></span>
              </div>
            </div>

            {/* Watering */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 hover:border-sky-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">물주기 주기 & 방법</h3>
                  <span className="text-xs font-semibold text-sky-700">
                    여름 {careGuide.watering.frequencyDaysSummer}일 / 겨울 {careGuide.watering.frequencyDaysWinter}일 주기
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                {careGuide.watering.method}
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="bg-white rounded-lg p-2 text-stone-700 border border-stone-200 flex items-start gap-1.5">
                  <span className="text-sky-600 font-bold shrink-0">흙 확인법:</span>
                  <span>{careGuide.watering.soilCheckTip}</span>
                </div>
                <div className="bg-amber-50/80 rounded-lg p-2 text-amber-900 border border-amber-200 flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold shrink-0">과습 증상:</span>
                  <span>{careGuide.watering.overwaterSigns}</span>
                </div>
              </div>
            </div>

            {/* Temperature & Humidity */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">적정 온도 & 겨울나기</h3>
                  <span className="text-xs font-semibold text-emerald-700">
                    생육 온도 {careGuide.temperature.idealRange} (최저 {careGuide.temperature.minSurvivalC}°C)
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                {careGuide.temperature.winterAdvice}
              </p>
              <div className="bg-white rounded-xl p-2.5 text-xs text-stone-600 border border-stone-200 flex items-start gap-2">
                <CloudRain className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">습도 ({careGuide.humidity.idealPercent}): </span>
                  {careGuide.humidity.tips}
                </div>
              </div>
            </div>

            {/* Soil & Repotting */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">토양 배합 & 추천 화분</h3>
                  <span className="text-xs font-semibold text-stone-600">
                    분갈이 주기: 약 {careGuide.soilAndPotting.repottingIntervalMonths}개월
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-3">
                <strong>흙 배합: </strong>{careGuide.soilAndPotting.soilMix}
              </p>
              <div className="bg-white rounded-xl p-2.5 text-xs text-stone-600 border border-stone-200">
                <p><strong>추천 화분: </strong>{careGuide.soilAndPotting.potType}</p>
                <p className="mt-1 text-stone-500">{careGuide.soilAndPotting.repottingTips}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Diagnosis */}
        {activeTab === 'diagnosis' && diagnosis && (
          <div className="space-y-6">
            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-200">
              <h3 className="font-bold text-amber-950 text-base mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                {diagnosis.issueTitle}
              </h3>
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>원인 분석: </strong>{diagnosis.cause}
              </p>
            </div>

            {/* Symptoms */}
            {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
              <div>
                <h4 className="font-bold text-stone-800 text-sm mb-3 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-stone-500" />
                  포착된 주요 증상
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {diagnosis.symptoms.map((s, i) => (
                    <div key={i} className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-step treatment */}
            {diagnosis.treatments && (
              <div>
                <h4 className="font-bold text-stone-800 text-sm mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  단계별 맞춤 치료 처방
                </h4>
                <div className="space-y-2.5">
                  {diagnosis.treatments.map((step, i) => (
                    <div key={i} className="bg-white rounded-xl p-3.5 border border-emerald-100 shadow-xs flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preventions */}
            {diagnosis.preventions && (
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-sm mb-2">재발 방지를 위한 예방 수칙</h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-emerald-800 space-y-1">
                  {diagnosis.preventions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB: Propagation & Fertilizer */}
        {activeTab === 'propagation' && (
          <div className="space-y-6">
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">번식 방법 & 적기</h3>
                  <p className="text-xs text-stone-500">추천 시기: {careGuide.propagation.bestSeason}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {careGuide.propagation.methods.map((method, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200"
                  >
                    🌱 {method}
                  </span>
                ))}
              </div>

              <div className="bg-white rounded-xl p-4 border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p className="font-semibold text-stone-900 mb-1">상세 번식 가이드:</p>
                {careGuide.propagation.instructions}
              </div>

              {careGuide.pruning && (
                <div className="mt-4 pt-4 border-t border-stone-200 text-xs sm:text-sm text-stone-600">
                  <span className="font-semibold text-stone-900">가지치기 팁: </span>
                  {careGuide.pruning}
                </div>
              )}
            </div>

            {/* Fertilizer */}
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                비료 및 영양 공급
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-2">
                <strong>주기: </strong>{careGuide.fertilizer.frequency} ({careGuide.fertilizer.season})
              </p>
              <div className="bg-white rounded-xl p-3 border border-stone-200 text-xs text-stone-600">
                {careGuide.fertilizer.tips}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Facts & Pet Toxicity */}
        {activeTab === 'facts' && (
          <div className="space-y-6">
            {/* Toxicity Box */}
            <div
              className={`rounded-2xl p-6 border ${
                careGuide.toxicity.safeForPets
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {careGuide.toxicity.safeForPets ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-base">
                    {careGuide.toxicity.safeForPets
                      ? '반려동물 안전 (Pet-Friendly) 🐶🐱'
                      : '반려동물 및 영유아 섭취 주의 ⚠️'}
                  </h3>
                  <p className="text-xs opacity-80">
                    {careGuide.toxicity.safeForPets
                      ? '강아지와 고양이에게 무해한 착한 식물입니다.'
                      : '잎이나 수액에 독성이 포함되어 있어 주의가 필요합니다.'}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm mt-3 leading-relaxed opacity-90">
                {careGuide.toxicity.details}
              </p>
            </div>

            {/* Fun Facts */}
            {careGuide.funFacts && careGuide.funFacts.length > 0 && (
              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
                <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  알아두면 재미있는 식물 상식
                </h3>
                <div className="space-y-2.5">
                  {careGuide.funFacts.map((fact, i) => (
                    <div key={i} className="bg-white rounded-xl p-3.5 border border-stone-200 text-xs sm:text-sm text-stone-700 flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold shrink-0">#{i + 1}</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save To My Garden Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-emerald-600" />
              내 정원에 등록하기
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              반려식물을 등록하고 물주기 알림과 케어 기록을 시작하세요.
            </p>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  식물 별명 / 애칭
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="예: 초록이, 거실 몬스테라"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  키우는 위치
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="거실 창가">거실 창가 (밝은 간접광)</option>
                  <option value="베란다 화단">베란다 화단 (직사광선 & 통풍)</option>
                  <option value="침실 협탁">침실 협탁 (은은한 간접광)</option>
                  <option value="서재 / 오피스 책상">서재 / 오피스 책상</option>
                  <option value="주방 선반">주방 선반</option>
                </select>
              </div>

              <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  등록 시 오늘을 마지막 물 준 날로 기록하고,{' '}
                  <strong>{careGuide.watering.frequencyDaysSummer}일 후</strong> 다음 물주기 예정일이 계산됩니다.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/30"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
