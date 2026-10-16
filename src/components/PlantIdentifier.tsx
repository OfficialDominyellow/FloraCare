import React, { useState, useRef } from 'react';
import {
  PlantAnalysisResult,
  SavedPlant,
} from '../types';
import { SAMPLE_PLANTS, SamplePlant } from '../data/samplePlants';
import { PlantResultCard } from './PlantResultCard';
import {
  Upload,
  Camera,
  Sparkles,
  Stethoscope,
  Leaf,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface PlantIdentifierProps {
  onSaveToGarden: (plant: Omit<SavedPlant, 'id' | 'createdDate'>) => void;
  savedPlantNames: string[];
  onOpenChatWithPlant: (plant: PlantAnalysisResult) => void;
}

export const PlantIdentifier: React.FC<PlantIdentifierProps> = ({
  onSaveToGarden,
  savedPlantNames,
  onOpenChatWithPlant,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantAnalysisResult | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일(JPG, PNG, WEBP 등)만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('이미지 크기는 15MB 이하만 지원됩니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setActiveSampleId(null);
      setError(null);
      setResult(null);
      analyzeImage(base64, file.type, isDiagnosticMode);
    };
    reader.readAsDataURL(file);
  };

  // Analyze plant photo via backend Gemini API
  const analyzeImage = async (
    base64Image: string,
    mimeType: string,
    isDiagnostic: boolean
  ) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('이미지 특성 및 엽록소 패턴 분석 중...');

    try {
      setTimeout(() => {
        setLoadingStep('Gemini 4 Argon AI가 식물 종 및 병리 증상 대조 중...');
      }, 1500);

      setTimeout(() => {
        setLoadingStep('맞춤형 사계절 물주기 & 케어 가이드 생성 중...');
      }, 3500);

      const response = await fetch('/api/plant/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          mimeType,
          isDiagnostic,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || '식물 분석에 실패했습니다.');
      }

      if (!data.data.isPlant) {
        setError('식물 사진이 인식되지 않았습니다. 선명한 잎, 줄기, 꽃 사진을 업로드해 주세요.');
        setIsLoading(false);
        return;
      }

      setResult(data.data);
    } catch (err: any) {
      console.error('Plant identification error:', err);
      setError(err?.message || '식물 분석 서버 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Select a preset sample plant
  const handleSelectSample = (sample: SamplePlant) => {
    setActiveSampleId(sample.id);
    setSelectedImage(sample.thumbnailUrl);
    setError(null);
    setResult(sample.mockResult);
    if (sample.isDiagnosticTest) {
      setIsDiagnosticMode(true);
    }
  };

  const resetAll = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setActiveSampleId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Intro */}
      {!result && !isLoading && (
        <div className="text-center max-w-3xl mx-auto pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Gemini 4 Argon 초정밀 비전 & 식물 병리학 AI 탑재
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            사진 한 장으로 알아보는<br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 bg-clip-text text-transparent">
              반려식물 맞춤 케어 & 닥터 진단
            </span>
          </h1>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            이름을 모르는 식물의 품종부터 물주기 주기, 햇빛, 적정 온도, 분갈이 레시피,
            그리고 잎 갈변/병충해 원인까지 전문 식물학자 수준의 정밀 가이드를 제공합니다.
          </p>
        </div>
      )}

      {/* Main Upload / Interaction Zone (Visible when no result yet) */}
      {!result && !isLoading && (
        <div className="max-w-2xl mx-auto">
          {/* Mode Selector */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl mb-5 border border-stone-200">
            <button
              onClick={() => setIsDiagnosticMode(false)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                !isDiagnosticMode
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>식물 식별 & 케어 가이드</span>
            </button>
            <button
              onClick={() => setIsDiagnosticMode(true)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isDiagnosticMode
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>식물 닥터 병충해 진단</span>
              <span className="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded-md ml-1">
                SOS
              </span>
            </button>
          </div>

          {/* Upload Card */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group relative overflow-hidden ${
              isDiagnosticMode
                ? 'border-amber-300 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50/60'
                : 'border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200 shadow-sm bg-white">
              {isDiagnosticMode ? (
                <Stethoscope className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
              ) : (
                <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
              {isDiagnosticMode
                ? '아픈 식물 사진을 업로드하거나 촬영하세요'
                : '식물 사진을 업로드하거나 촬영하세요'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              {isDiagnosticMode
                ? '잎의 이상 부위(노란 잎, 반점, 해충)가 선명하게 보이도록 찍어주시면 정확도가 높아집니다.'
                : '잎과 꽃, 전체 수형이 잘 담긴 사진을 드래그하거나 클릭하여 선택하세요.'}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 group-hover:bg-emerald-500 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              사진 파일 선택
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">분석 알림</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Preset Sample Plants Shelf */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-bold text-stone-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                샘플 사진으로 1초 만에 바로 체험하기
              </h3>
              <span className="text-[11px] text-stone-400">클릭 즉시 결과 확인</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_PLANTS.map((sample) => {
                const isSelected = activeSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`text-left rounded-2xl overflow-hidden border p-2 bg-white transition-all hover:scale-102 hover:shadow-md ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2">
                      <img
                        src={sample.thumbnailUrl}
                        alt={sample.nameKo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {sample.isDiagnosticTest && (
                        <span className="absolute top-1.5 left-1.5 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          진단 샘플
                        </span>
                      )}
                    </div>
                    <div className="px-1">
                      <p className="font-bold text-stone-900 text-xs truncate">
                        {sample.nameKo}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium truncate">
                        {sample.tag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading Animation State */}
      {isLoading && (
        <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-lg">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
            <div className="absolute inset-2 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Leaf className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-stone-900 mb-2">
            AI 식물 정밀 분석 진행 중
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            {loadingStep || '식물학 지식 데이터베이스와 대조하고 있습니다...'}
          </p>

          <div className="mt-6 bg-stone-100 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-2/3 animate-pulse" />
          </div>

          <p className="text-[11px] text-stone-400 mt-4">
            Gemini 4 Argon 비전 모델이 잎맥, 모양, 건강 상태를 종합 진단합니다.
          </p>
        </div>
      )}

      {/* Results View */}
      {result && selectedImage && (
        <PlantResultCard
          result={result}
          imageUrl={selectedImage}
          onSaveToGarden={onSaveToGarden}
          isSaved={savedPlantNames.includes(result.commonNameKo)}
          onAskChatbot={onOpenChatWithPlant}
          onReset={resetAll}
        />
      )}
    </div>
  );
};
