import React, { useState } from 'react';
import {
  Droplets,
  Sun,
  Thermometer,
  Layers,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

export const WateringCalculator: React.FC = () => {
  const [plantType, setPlantType] = useState('foliage'); // foliage, succulent, moisture_lover, arid, herb
  const [potType, setPotType] = useState<'terracotta' | 'plastic' | 'ceramic'>('terracotta');
  const [potDiameter, setPotDiameter] = useState(15);
  const [season, setSeason] = useState('spring'); // spring, summer, monsoon, fall, winter
  const [tempC, setTempC] = useState(22);
  const [light, setLight] = useState('bright_indirect'); // direct, bright_indirect, medium, low
  const [isAiCalculating, setIsAiCalculating] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<any | null>(null);

  // Compute calculated base watering days
  const calculateCycle = () => {
    // Base days by plant type
    let baseDays = 7;
    let plantNameLabel = '일반 관엽식물 (몬스테라, 야자류 등)';
    if (plantType === 'succulent') {
      baseDays = 21;
      plantNameLabel = '다육식물 및 선인장';
    } else if (plantType === 'moisture_lover') {
      baseDays = 4;
      plantNameLabel = '습성 식물 (스파티필룸, 고사리류 등)';
    } else if (plantType === 'arid') {
      baseDays = 18;
      plantNameLabel = '건조 적응형 (산세베리아, 금전수)';
    } else if (plantType === 'herb') {
      baseDays = 5;
      plantNameLabel = '허브류 (로즈마리, 바질)';
    }

    // Modifier by pot type
    // Terracotta evaporates fast (-15%), Plastic is normal (0%), Ceramic holds water (+25%)
    let potMod = 1.0;
    if (potType === 'terracotta') potMod = 0.85;
    if (potType === 'ceramic') potMod = 1.25;

    // Modifier by pot size: bigger pots dry slower
    // 10cm -> 0.8x, 15cm -> 1.0x, 25cm -> 1.3x, 35cm -> 1.6x
    const sizeMod = 0.7 + (potDiameter / 15) * 0.3;

    // Modifier by season
    let seasonMod = 1.0;
    if (season === 'summer') seasonMod = 0.75; // hotter, dries faster
    if (season === 'monsoon') seasonMod = 1.6; // high humidity, very slow dry
    if (season === 'fall') seasonMod = 1.05;
    if (season === 'winter') seasonMod = 1.5; // dormancy, low evap

    // Modifier by temp
    let tempMod = 1.0;
    if (tempC >= 27) tempMod = 0.85;
    if (tempC <= 18) tempMod = 1.3;

    // Modifier by light
    let lightMod = 1.0;
    if (light === 'direct') lightMod = 0.8;
    if (light === 'low') lightMod = 1.4;

    const finalDays = Math.max(2, Math.round(baseDays * potMod * sizeMod * seasonMod * tempMod * lightMod));
    const rangeMin = Math.max(1, finalDays - 1);
    const rangeMax = finalDays + 1;

    let waterVolumeMl = Math.round(potDiameter * potDiameter * 1.5);

    return {
      finalDays,
      range: `${rangeMin} ~ ${rangeMax}일마다`,
      plantNameLabel,
      waterVolumeMl: `${waterVolumeMl} ~ ${Math.round(waterVolumeMl * 1.3)}ml`,
      soilCheckDepth: potDiameter > 20 ? '겉흙 4~5cm' : '겉흙 2~3cm',
    };
  };

  const cycleInfo = calculateCycle();

  // Call AI for deep customized watering diagnosis
  const handleRequestAiAdvice = async () => {
    setIsAiCalculating(true);
    try {
      const response = await fetch('/api/watering/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantName: cycleInfo.plantNameLabel,
          potType,
          potDiameterCm: potDiameter,
          season,
          indoorTempC: tempC,
          lightCondition: light,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setAiAdvice(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiCalculating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-3 border border-sky-200">
          <Droplets className="w-3.5 h-3.5 text-sky-600" />
          스마트 화분 수분 증발율 공식 적용
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          맞춤형 식물 물주기 계산기
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          화분 재질, 크기, 실내 온도와 채광에 따라 수분이 마르는 속도가 완전히 달라집니다.
          우리 집 환경에 딱 맞는 정확한 주기를 계산해 보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-6">
          {/* Plant Type Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              1. 식물 종류
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'foliage', label: '관엽식물 (몬스테라/야자)', icon: '🌿' },
                { id: 'moisture_lover', label: '습성식물 (스파티필룸/고사리)', icon: '💧' },
                { id: 'succulent', label: '다육이 & 선인장', icon: '🌵' },
                { id: 'arid', label: '건조형 (산세베리아/금전수)', icon: '🪴' },
                { id: 'herb', label: '허브류 (로즈마리/바질)', icon: '🌱' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPlantType(item.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all ${
                    plantType === item.id
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                  }`}
                >
                  <span className="text-base mr-1">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pot Material */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              2. 화분 재질 (수분 배출력)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'terracotta', label: '토분 / 테라코타', sub: '통기성 최고, 물마름 빠름' },
                { id: 'plastic', label: '플라스틱 / 슬릿분', sub: '표준 통기성' },
                { id: 'ceramic', label: '도자기 / 유약분', sub: '통기성 낮음, 물마름 느림' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPotType(p.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    potType === p.id
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-500/20 font-bold'
                      : 'border-stone-200 text-stone-700 hover:border-stone-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className="text-[10px] text-stone-500 mt-0.5">{p.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pot Diameter Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-800 mb-2">
              <span>3. 화분 지름 (화분 윗면 크기)</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {potDiameter} cm
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              step="1"
              value={potDiameter}
              onChange={(e) => setPotDiameter(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>소형 (8~12cm)</span>
              <span>중형 (15~20cm)</span>
              <span>대형 (25~35cm)</span>
            </div>
          </div>

          {/* Season Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              4. 계절 및 날씨 환경
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'spring', label: '봄 (성장기)' },
                { id: 'summer', label: '한여름 (고온)' },
                { id: 'monsoon', label: '장마철 (고습)' },
                { id: 'fall', label: '가을' },
                { id: 'winter', label: '겨울 (난방/휴면)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeason(s.id)}
                  className={`py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                    season === s.id
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature & Sunlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-stone-800 mb-2">
                <span>실내 온도</span>
                <span className="text-emerald-700">{tempC}°C</span>
              </div>
              <input
                type="range"
                min="12"
                max="32"
                value={tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                채광 상태
              </label>
              <select
                value={light}
                onChange={(e) => setLight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="direct">직사광선 (창가 바로 앞)</option>
                <option value="bright_indirect">밝은 간접광 (커튼 투과광)</option>
                <option value="medium">중간 밝기 (거실 안쪽)</option>
                <option value="low">낮은 조도 (북향 / 방 안쪽)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculation Result Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/80 px-2.5 py-1 rounded-md border border-emerald-700">
                추천 물주기 주기
              </span>

              <div className="mt-4 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {cycleInfo.range}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                선택하신 {cycleInfo.plantNameLabel} 기준
              </p>

              {/* Specs */}
              <div className="mt-6 space-y-2.5 text-xs border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-stone-200">
                  <span className="text-emerald-300 font-medium">물 주는 양 권장:</span>
                  <span className="font-bold text-white">약 {cycleInfo.waterVolumeMl}</span>
                </div>
                <div className="flex items-center justify-between text-stone-200">
                  <span className="text-emerald-300 font-medium">흙 마름 확인 기준:</span>
                  <span className="font-bold text-white">{cycleInfo.soilCheckDepth} 마르면</span>
                </div>
                <div className="flex items-center justify-between text-stone-200">
                  <span className="text-emerald-300 font-medium">급수 방식:</span>
                  <span className="font-bold text-white">화분 밑으로 흐를 때까지 흠뻑</span>
                </div>
              </div>

              {/* AI Deep advice trigger */}
              <button
                onClick={handleRequestAiAdvice}
                disabled={isAiCalculating}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-emerald-900" />
                {isAiCalculating ? 'AI 원예학 분석 중...' : 'Gemini AI 맞춤 원예 처방 받기'}
              </button>
            </div>
          </div>

          {/* AI Custom Advice Box */}
          {aiAdvice && (
            <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm animate-in fade-in duration-300">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Gemini AI 원예학 맞춤 조언
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {aiAdvice.advice}
              </p>
              {aiAdvice.warnings && aiAdvice.warnings.length > 0 && (
                <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold mb-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    주의할 점:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {aiAdvice.warnings.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Quick Tip */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p leading-relaxed>
              <strong>골든 룰:</strong> 달력 날짜에 맞춰 기계적으로 물을 주기보다,
              손가락이나 나무젓가락을 화분 흙에 찔러보아 흙이 보송하게 말라 있는지
              확인한 후 주는 것이 과습을 방지하는 최고의 방법입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
