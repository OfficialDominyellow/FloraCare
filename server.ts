import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// JSON Schema for structured plant analysis
const plantCareResponseSchema = {
  type: Type.OBJECT,
  properties: {
    isPlant: {
      type: Type.BOOLEAN,
      description: 'True if the image contains a plant, flower, tree, succulent, or fungi. False if it is not plant related.',
    },
    commonNameKo: {
      type: Type.STRING,
      description: 'Common name of the plant in Korean (e.g. 몬스테라 델리시오사, 산세베리아)',
    },
    commonNameEn: {
      type: Type.STRING,
      description: 'Common name in English (e.g. Swiss Cheese Plant, Snake Plant)',
    },
    scientificName: {
      type: Type.STRING,
      description: 'Botanical Latin binomial name (e.g. Monstera deliciosa)',
    },
    family: {
      type: Type.STRING,
      description: 'Botanical plant family (e.g. 천남성과 (Araceae))',
    },
    confidence: {
      type: Type.INTEGER,
      description: 'Identification confidence percentage from 0 to 100',
    },
    difficultyLevel: {
      type: Type.STRING,
      description: 'Care difficulty: "매우 쉬움 (초보자 추천)" | "쉬움" | "보통" | "어려움 (숙련자용)"',
    },
    airPurifyingEffect: {
      type: Type.INTEGER,
      description: 'Air purifying score from 1 (low) to 5 (excellent)',
    },
    summary: {
      type: Type.STRING,
      description: 'A warm, informative 2-3 sentence overview of this plant, its native habitat, and distinctive features.',
    },
    healthStatus: {
      type: Type.STRING,
      description: '"건강함" | "주의 필요" | "병충해/과습 의심" | "알 수 없음"',
    },
    diagnosis: {
      type: Type.OBJECT,
      description: 'Health diagnosis, pest evaluation, or leaf issue findings',
      properties: {
        hasIssue: { type: Type.BOOLEAN },
        issueTitle: { type: Type.STRING, description: 'Short title of condition e.g. 과습 초기 증상, 잎마름, 깍지벌레 등' },
        severity: { type: Type.STRING, description: '"경미" | "보통" | "심각"' },
        symptoms: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Visible symptoms in the photo',
        },
        cause: { type: Type.STRING, description: 'Likely root cause' },
        treatments: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Step-by-step action items to treat the plant',
        },
        preventions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Preventative measures to keep it healthy',
        },
      },
    },
    careGuide: {
      type: Type.OBJECT,
      properties: {
        light: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING, description: 'e.g. 양지 / 반양지 / 반음지 / 음지' },
            description: { type: Type.STRING, description: 'Detailed sunlight guidance, window positioning, burning warning' },
            idealHours: { type: Type.STRING, description: 'e.g. 하루 4~6시간 간접광' },
          },
          required: ['level', 'description', 'idealHours'],
        },
        watering: {
          type: Type.OBJECT,
          properties: {
            frequencyDaysSummer: { type: Type.INTEGER, description: 'Average summer watering cycle in days' },
            frequencyDaysWinter: { type: Type.INTEGER, description: 'Average winter watering cycle in days' },
            method: { type: Type.STRING, description: 'How to water (e.g. 화분 밑으로 물이 빠져나올 때까지 흠뻑 주기)' },
            soilCheckTip: { type: Type.STRING, description: 'How to check soil dryness before watering' },
            overwaterSigns: { type: Type.STRING, description: 'Signs of overwatering (e.g. 잎이 무르고 갈색 반점)' },
            underwaterSigns: { type: Type.STRING, description: 'Signs of underwatering (e.g. 잎 처짐, 마른 잎 끝)' },
          },
          required: ['frequencyDaysSummer', 'frequencyDaysWinter', 'method', 'soilCheckTip', 'overwaterSigns', 'underwaterSigns'],
        },
        temperature: {
          type: Type.OBJECT,
          properties: {
            idealRange: { type: Type.STRING, description: 'e.g. 18°C ~ 26°C' },
            minSurvivalC: { type: Type.INTEGER, description: 'Minimum temperature before cold damage in Celsius' },
            winterAdvice: { type: Type.STRING, description: 'Tips for surviving cold Korean winters and heating drafts' },
          },
          required: ['idealRange', 'minSurvivalC', 'winterAdvice'],
        },
        humidity: {
          type: Type.OBJECT,
          properties: {
            idealPercent: { type: Type.STRING, description: 'e.g. 50% ~ 70%' },
            tips: { type: Type.STRING, description: 'Humidity advice (misting, humidifier, pebble tray)' },
          },
          required: ['idealPercent', 'tips'],
        },
        soilAndPotting: {
          type: Type.OBJECT,
          properties: {
            soilMix: { type: Type.STRING, description: 'Optimal potting soil mix e.g. 배양토 60% + 펄라이트/마사토 40%' },
            potType: { type: Type.STRING, description: 'Recommended pot material (e.g. 통기성 좋은 토분, 슬릿분)' },
            repottingIntervalMonths: { type: Type.INTEGER, description: 'Repotting cycle in months (e.g. 12~24개월)' },
            repottingTips: { type: Type.STRING, description: 'How and when to repot safely' },
          },
          required: ['soilMix', 'potType', 'repottingIntervalMonths', 'repottingTips'],
        },
        fertilizer: {
          type: Type.OBJECT,
          properties: {
            frequency: { type: Type.STRING, description: 'e.g. 봄~가을 성장기에 2~4주에 1회 액비 희석 시비' },
            season: { type: Type.STRING, description: 'e.g. 봄, 초여름 (겨울철 휴면기에는 중단)' },
            tips: { type: Type.STRING, description: 'Advice on preventing root burn from overfertilizing' },
          },
          required: ['frequency', 'season', 'tips'],
        },
        toxicity: {
          type: Type.OBJECT,
          properties: {
            safeForPets: { type: Type.BOOLEAN, description: 'True if safe for dogs and cats, false if toxic' },
            safeForChildren: { type: Type.BOOLEAN, description: 'True if safe for young children' },
            details: { type: Type.STRING, description: 'Toxicity symptoms (calcium oxalate crystals, vomiting, etc.) or pet-friendly reassurance' },
          },
          required: ['safeForPets', 'safeForChildren', 'details'],
        },
        propagation: {
          type: Type.OBJECT,
          properties: {
            methods: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'e.g. 물꽂이, 삽목, 포기나누기' },
            bestSeason: { type: Type.STRING, description: 'e.g. 봄 ~ 초여름' },
            instructions: { type: Type.STRING, description: 'Step-by-step instructions for propagating' },
          },
          required: ['methods', 'bestSeason', 'instructions'],
        },
        pruning: { type: Type.STRING, description: 'Pruning guidance, deadheading, leaf cleaning' },
        funFacts: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '2-3 interesting botanical or cultural facts about this plant',
        },
      },
      required: ['light', 'watering', 'temperature', 'humidity', 'soilAndPotting', 'fertilizer', 'toxicity', 'propagation', 'pruning', 'funFacts'],
    },
  },
  required: ['isPlant', 'commonNameKo', 'commonNameEn', 'scientificName', 'family', 'confidence', 'difficultyLevel', 'airPurifyingEffect', 'summary', 'healthStatus', 'careGuide'],
};

// API: Identify plant from uploaded photo using gemini-4-argon with fallback
app.post('/api/plant/identify', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg', isDiagnostic = false } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Clean base64 string
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;

    const systemPrompt = `You are a world-class master botanist, taxonomist, and plant pathologist (식물 병리 전문의).
Analyze the provided photo in detail.
1. Identify the plant with high scientific accuracy (Korean common name, English common name, Latin scientific binomial, botanical family).
2. Assess the overall health status of the plant in the photo: check for yellow leaves, brown spots, drooping, pests (aphids, mealybugs, spider mites), root rot signs, sunburn, or nutrient deficiencies.
3. If this is a diagnosis request (${isDiagnostic ? 'YES, prioritize plant doctor mode' : 'NO, general identify but still note issues'}), provide detailed diagnosis, cause, severity, treatments, and prevention.
4. Provide comprehensive, practical care instructions in Korean that a home gardener can follow immediately.
5. If the photo does NOT contain any plant, flora, tree, succulent, or flower, set "isPlant": false and fill minimal fallback fields with warning.`;

    const promptText = isDiagnostic
      ? '이 식물의 상태와 건강 문제를 정밀 진단하고, 식물 종류 식별과 함께 단계별 치료 처방전 및 맞춤 관리 가이드를 작성해주세요.'
      : '이 사진 속 식물을 정확히 식별하고, 초보자도 쉽게 따라 할 수 있는 상세한 맞춤형 케어 가이드와 건강 상태를 분석해주세요.';

    // Try primary model gemini-4-argon first as mandated
    let responseText: string | undefined;
    let modelUsed = 'gemini-4-argon';

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Data,
                },
              },
              { text: promptText },
            ],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: plantCareResponseSchema,
        },
      });
      responseText = response.text;
    } catch (argonError: any) {
      console.warn('gemini-4-argon call failed, falling back to gemini-3.8-flash:', argonError?.message || argonError);
      modelUsed = 'gemini-3.8-flash';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Data,
                },
              },
              { text: promptText },
            ],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: plantCareResponseSchema,
        },
      });
      responseText = fallbackResponse.text;
    }

    if (!responseText) {
      throw new Error('No response text returned from Gemini API.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json({
      success: true,
      modelUsed,
      data: parsedData,
    });
  } catch (err: any) {
    console.error('Error in /api/plant/identify:', err);
    return res.status(500).json({
      error: '식물 분석 중 오류가 발생했습니다.',
      message: err?.message || '알 수 없는 서버 오류',
    });
  }
});

// API: Multi-turn Chatbot using Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      modelPreference = 'gemini-3.8-flash',
      plantContext = null,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Determine target model based on user preference or task complexity
    let targetModel = modelPreference;
    if (!['gemini-4-argon', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'].includes(targetModel)) {
      targetModel = 'gemini-3.8-flash';
    }

    let systemInstruction = `당신은 대한민국 최고의 식물학자이자 따뜻한 가드닝 닥터 '초록닥터 (FloraBot)'입니다.
역할:
1. 식물 집사들의 고민(물주기, 잎 갈변, 과습, 병충해, 영양제, 분갈이, 수형 가꾸기)을 친절하고 명쾌하게 상담해줍니다.
2. 답변은 읽기 쉽게 구조화(이모지, 핵심 요약, 실행 단계 1-2-3, 주의점)하여 제공합니다.
3. 위험할 수 있는 민간요법(과다한 쌀뜨물/우유 주기 등)은 과학적 원리로 교정해주고, 식물에 안전한 대안을 제시합니다.
4. 한국의 사계절 기후(여름 장마철 습도, 겨울철 베란다 냉해 및 건조한 실내 난방)를 고려한 실전 팁을 제공합니다.`;

    if (plantContext) {
      systemInstruction += `\n\n[현재 상담 중인 식물 정보]
- 국명: ${plantContext.commonNameKo || '정보 없음'} (${plantContext.commonNameEn || ''})
- 학명: ${plantContext.scientificName || '정보 없음'}
- 과명: ${plantContext.family || '정보 없음'}
- 현재 건강 상태: ${plantContext.healthStatus || '정보 없음'}
- 물주기 권장: 여름 ${plantContext.careGuide?.watering?.frequencyDaysSummer || 7}일, 겨울 ${plantContext.careGuide?.watering?.frequencyDaysWinter || 14}일
- 햇빛: ${plantContext.careGuide?.light?.level || ''} (${plantContext.careGuide?.light?.idealHours || ''})
위 식물의 특성을 우선적으로 염두에 두고 상담을 진행하세요.`;
    }

    // Format chat contents for @google/genai
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let replyText = '';
    let modelUsed = targetModel;

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      replyText = response.text || '';
    } catch (err: any) {
      console.warn(`Model ${targetModel} failed, trying fallback to gemini-3.8-flash:`, err?.message || err);
      modelUsed = 'gemini-3.8-flash';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      replyText = fallbackResponse.text || '';
    }

    return res.json({
      reply: replyText,
      modelUsed,
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: '챗봇 응답 생성 중 오류가 발생했습니다.',
      message: err?.message || '알 수 없는 서버 오류',
    });
  }
});

// API: Watering Calculator
app.post('/api/watering/calculate', async (req, res) => {
  try {
    const {
      plantName,
      potType = 'terracotta', // terracotta, plastic, ceramic
      potDiameterCm = 15,
      season = 'spring', // spring, summer, fall, winter
      indoorTempC = 22,
      lightCondition = 'bright_indirect', // direct, bright_indirect, medium, low
    } = req.body;

    const prompt = `식물 이름: ${plantName || '일반 관엽식물'}
화분 재질: ${potType} (terracotta=토분, plastic=플라스틱/슬릿분, ceramic=도자기/유약분)
화분 지름: ${potDiameterCm}cm
현재 계절: ${season}
실내 온도: ${indoorTempC}°C
채광 상태: ${lightCondition}

위 조건에 따른 맞춤형 물주기 주기와 흙 상태 확인법, 계절 맞춤 주의사항을 계산하여 다음 JSON 형식으로 반환하세요.
반환 스키마:
{
  "cycleDays": number (추천 물주기 일수, e.g. 7),
  "cycleRange": string (e.g. "6 ~ 8일마다"),
  "soilCheckDepth": string (e.g. "겉흙 3cm 마르면"),
  "waterVolumeTip": string (e.g. "화분 밑으로 물이 흘러나올 때까지 약 400~500ml 흠뻑"),
  "advice": string (2-3문장의 맞춤 조언),
  "warnings": [string, string]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: '당신은 정밀한 원예 물주기 계산기 엔진입니다. 항상 신뢰할 수 있는 JSON만 출력하세요.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error in /api/watering/calculate:', err);
    return res.status(500).json({
      error: '물주기 계산 중 오류가 발생했습니다.',
      message: err?.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'FloraCare AI' });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 FloraCare server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
