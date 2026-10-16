import React, { useState, useEffect } from 'react';
import { SavedPlant, PlantAnalysisResult } from './types';
import { SAMPLE_PLANTS } from './data/samplePlants';
import { Header } from './components/Header';
import { PlantIdentifier } from './components/PlantIdentifier';
import { MyGarden } from './components/MyGarden';
import { WateringCalculator } from './components/WateringCalculator';
import { PlantChatDrawer } from './components/PlantChatDrawer';
import { PlantResultCard } from './components/PlantResultCard';
import {
  MessageCircle,
  Sprout,
  Heart,
  Droplets,
  HelpCircle,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'identify' | 'garden' | 'calculator'>('identify');
  const [savedPlants, setSavedPlants] = useState<SavedPlant[]>(() => {
    try {
      const stored = localStorage.getItem('floracare_my_garden');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse saved plants from localStorage', e);
    }
    // Seed with 1 friendly sample plant so the garden doesn't look barren on first visit
    return [
      {
        id: 'seed-monstera',
        nickname: '우리집 몬스테라 🌱',
        plantData: SAMPLE_PLANTS[0].mockResult,
        imageUrl: SAMPLE_PLANTS[0].thumbnailUrl,
        location: '거실 창가',
        lastWateredDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdDate: new Date().toISOString(),
      },
    ];
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPlantContext, setChatPlantContext] = useState<PlantAnalysisResult | null>(null);

  // Modal for inspecting an existing saved plant in detail
  const [inspectPlant, setInspectPlant] = useState<SavedPlant | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('floracare_my_garden', JSON.stringify(savedPlants));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedPlants]);

  // Add plant to garden
  const handleSaveToGarden = (plantData: Omit<SavedPlant, 'id' | 'createdDate'>) => {
    const newPlant: SavedPlant = {
      ...plantData,
      id: `plant-${Date.now()}`,
      createdDate: new Date().toISOString(),
    };
    setSavedPlants((prev) => [newPlant, ...prev]);
  };

  // Water plant action (updates last watered date to now)
  const handleWaterPlant = (id: string) => {
    setSavedPlants((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, lastWateredDate: new Date().toISOString() } : p
      )
    );
  };

  // Delete plant from garden
  const handleDeletePlant = (id: string) => {
    setSavedPlants((prev) => prev.filter((p) => p.id !== id));
    if (inspectPlant?.id === id) {
      setInspectPlant(null);
    }
  };

  // Open chatbot with specific plant context
  const handleOpenChatWithPlant = (plant: PlantAnalysisResult) => {
    setChatPlantContext(plant);
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-stone-800">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setInspectPlant(null);
        }}
        gardenCount={savedPlants.length}
        openChat={() => setIsChatOpen(true)}
        isChatOpen={isChatOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {activeTab === 'identify' && (
          <PlantIdentifier
            onSaveToGarden={handleSaveToGarden}
            savedPlantNames={savedPlants.map((p) => p.plantData.commonNameKo)}
            onOpenChatWithPlant={handleOpenChatWithPlant}
          />
        )}

        {activeTab === 'garden' && (
          <MyGarden
            plants={savedPlants}
            onWaterPlant={handleWaterPlant}
            onDeletePlant={handleDeletePlant}
            onSelectPlant={(plant) => setInspectPlant(plant)}
            onGoToIdentify={() => {
              setActiveTab('identify');
              setInspectPlant(null);
            }}
          />
        )}

        {activeTab === 'calculator' && <WateringCalculator />}
      </main>

      {/* Modal for viewing saved plant details */}
      {inspectPlant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button
              onClick={() => setInspectPlant(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <PlantResultCard
              result={inspectPlant.plantData}
              imageUrl={inspectPlant.imageUrl}
              onSaveToGarden={() => {}}
              isSaved={true}
              onAskChatbot={handleOpenChatWithPlant}
              onReset={() => setInspectPlant(null)}
            />
          </div>
        </div>
      )}

      {/* Multi-turn Chatbot Drawer */}
      <PlantChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPlantContext={chatPlantContext}
        onClearPlantContext={() => setChatPlantContext(null)}
      />

      {/* Floating Chat Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-4 py-3.5 rounded-2xl shadow-xl shadow-emerald-700/30 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 group active:scale-95"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-emerald-200" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-medium text-emerald-100">식물 상담 챗봇</p>
            <p className="text-xs font-bold leading-tight">초록닥터에게 질문하기</p>
          </div>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white/70 py-8 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-stone-700 font-semibold">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>FloraCare - AI 식물 도감 & 가드닝 닥터</span>
          </div>
          <p>
            Powered by Google Gemini 4 Argon & Gemini 3.8 Flash • 식물 식별, 병리 진단 및 맞춤 케어
          </p>
          <p className="text-stone-400 text-[11px]">
            ※ 식물 관리 권장안은 일반적인 생육 환경을 기준으로 제공되오며 실내 채광과 통풍 상태에 따라 유동적으로 조절해 주세요.
          </p>
        </div>
      </footer>
    </div>
  );
}
