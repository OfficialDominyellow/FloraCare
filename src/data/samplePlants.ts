import { PlantAnalysisResult } from '../types';

export interface SamplePlant {
  id: string;
  nameKo: string;
  nameEn: string;
  tag: string;
  isDiagnosticTest?: boolean;
  thumbnailUrl: string;
  description: string;
  mockResult: PlantAnalysisResult;
}

export const SAMPLE_PLANTS: SamplePlant[] = [
  {
    id: 'sample-monstera',
    nameKo: '몬스테라 델리시오사',
    nameEn: 'Monstera Deliciosa',
    tag: '싱그러운 관엽식물',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
    description: '구멍 뚫린 잎이 매력적인 대표 실내 플랜테리어 식물',
    mockResult: {
      isPlant: true,
      commonNameKo: '몬스테라 델리시오사',
      commonNameEn: 'Monstera Deliciosa (Swiss Cheese Plant)',
      scientificName: 'Monstera deliciosa Liebm.',
      family: '천남성과 (Araceae)',
      confidence: 98,
      difficultyLevel: '쉬움 (초보자 추천)',
      airPurifyingEffect: 4,
      summary: '중앙아메리카 열대우림이 원산지로, 성숙할수록 잎에 자연스러운 찢어짐(천공)이 생겨 햇빛과 바람을 효과적으로 통과시킵니다. 생명력이 매우 강하고 인테리어 효과가 뛰어납니다.',
      healthStatus: '건강함',
      diagnosis: {
        hasIssue: false,
        issueTitle: '건강한 성장 상태',
        severity: '경미',
        symptoms: ['잎의 색이 짙고 윤기가 나며 건강한 엽록소를 유지하고 있습니다.'],
        cause: '적절한 간접 채광과 통풍 환경',
        treatments: ['현재 관리 루틴을 그대로 유지하세요.', '잎 표면의 먼지를 부드러운 천으로 닦아주면 광합성에 도움이 됩니다.'],
        preventions: ['에어컨이나 온풍기 직바람을 피하세요.'],
      },
      careGuide: {
        light: {
          level: '반양지 (밝은 간접광)',
          description: '직사광선을 받으면 잎이 탈 수 있으므로, 커튼을 한 번 거친 부드러운 햇빛이 드는 거실 창가나 베란다 안쪽이 가장 이상적입니다.',
          idealHours: '하루 4~6시간 간접광',
        },
        watering: {
          frequencyDaysSummer: 6,
          frequencyDaysWinter: 12,
          method: '화분 밑 배수구로 물이 충분히 흘러나올 때까지 흠뻑 주고, 받침대에 고인 물은 뿌리 호흡을 위해 즉시 버려주세요.',
          soilCheckTip: '손가락 한 마디나 나무젓가락을 흙에 3~4cm 찔러보아 흙이 보송하게 말라있을 때 물을 줍니다.',
          overwaterSigns: '새 잎이 나오지 않고 잎자루가 무르며, 잎 끝이 짙은 갈색이나 검게 변함',
          underwaterSigns: '잎 전체가 아래로 축 늘어지고 힘이 없으며, 잎 끝이 바스락거림',
        },
        temperature: {
          idealRange: '18°C ~ 28°C',
          minSurvivalC: 10,
          winterAdvice: '겨울철에는 최저 12°C 이상 유지되도록 베란다에서 실내로 들여놓고, 찬바람에 노출되지 않도록 하세요.',
        },
        humidity: {
          idealPercent: '60% ~ 75%',
          tips: '열대우림 출신으로 건조한 겨울철에는 분무기로 주변 공기에 미스트를 뿌려주거나 가습기를 틀어주면 잎 끝 갈변을 막을 수 있습니다.',
        },
        soilAndPotting: {
          soilMix: '배양토 60% + 펄라이트/코코피트/바크 40% (배수성이 우수한 통기성 배합)',
          potType: '통기성이 좋은 토분이나 통풍 구멍이 많은 슬릿 화분',
          repottingIntervalMonths: 18,
          repottingTips: '화분 밑으로 뿌리가 삐져나오거나 물마름이 지나치게 빨라지면 봄철(4~5월)에 기존 화분보다 1.3배 큰 화분으로 분갈이하세요.',
        },
        fertilizer: {
          frequency: '성장기(봄~가을) 3주에 1회 관엽용 액체비료 1000배 희석 시비',
          season: '4월 ~ 9월',
          tips: '겨울 휴면기에는 영양제를 주지 마세요. 과다 시비는 뿌리를 상하게 할 수 있습니다.',
        },
        toxicity: {
          safeForPets: false,
          safeForChildren: false,
          details: '잎과 줄기에 옥살산칼슘 결정이 포함되어 있어 반려동물이나 아이가 섭취 시 구강 통증, 침 흘림, 구토를 유발할 수 있으니 손이 닿지 않는 곳에 두세요.',
        },
        propagation: {
          methods: ['공중뿌리(기근) 포함 줄기 물꽂이', '마디 삽목'],
          bestSeason: '5월 ~ 7월 (온도가 높고 성장이 왕성한 초여름)',
          instructions: '기근(공중뿌리)이 달린 줄기 마디 바로 아래를 소독된 칼로 자른 뒤 깨끗한 물에 담가두면 2~3주 내에 튼튼한 하얀 뿌리가 내립니다.',
        },
        pruning: '지나치게 무성해지거나 노화된 아래쪽 잎은 줄기 기부에서 깔끔하게 전정해 주면 통풍이 좋아집니다.',
        funFacts: [
          '몬스테라의 잎 구멍은 거센 열대 비바람에 잎이 찢어지지 않고 빛을 아래 잎까지 골고루 전달하기 위한 진화의 결과입니다.',
          '야생에서는 나무를 타고 올라가며 10미터 이상 자라고, 성숙하면 식용 가능한 옥수수 모양 열매를 맺습니다.',
        ],
      },
    },
  },
  {
    id: 'sample-snake-plant',
    nameKo: '산세베리아 (문샤인/로렌티)',
    nameEn: 'Sansevieria (Snake Plant)',
    tag: '초강력 공기정화',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593482892290-f54927ae1eb6?auto=format&fit=crop&w=800&q=80',
    description: '물주기를 잊어도 살아남는 생명력 끝판왕 밤의 산소공장',
    mockResult: {
      isPlant: true,
      commonNameKo: '산세베리아 로렌티',
      commonNameEn: 'Snake Plant / Mother-in-Law’s Tongue',
      scientificName: 'Dracaena trifasciata (formerly Sansevieria trifasciata)',
      family: '아스파라거스과 (Asparagaceae)',
      confidence: 99,
      difficultyLevel: '매우 쉬움 (초보자 추천)',
      airPurifyingEffect: 5,
      summary: '서아프리카 건조지대 출신으로 밤에 이산화탄소를 흡수하고 산소와 음이온을 방출하는 CAM 식물입니다. 침실에 두기 가장 좋은 대표 반려식물입니다.',
      healthStatus: '건강함',
      diagnosis: {
        hasIssue: false,
        issueTitle: '최상의 건강 상태',
        severity: '경미',
        symptoms: ['잎이 단단하고 꼿꼿하게 서 있으며 노란 테두리 무늬가 선명함'],
        cause: '적절한 건조 주기 유지',
        treatments: ['현재의 건조한 관리 패턴을 유지하세요.'],
        preventions: ['흙이 마르기 전에 절대 물을 주지 마세요.'],
      },
      careGuide: {
        light: {
          level: '반음지 ~ 양지 (적응력 매우 뛰어남)',
          description: '어두운 방에서도 잘 버티지만, 밝은 간접광을 받으면 잎의 무늬가 한층 선명하고 탄탄해집니다.',
          idealHours: '하루 2~6시간 (빛 조건 무관 적응 가능)',
        },
        watering: {
          frequencyDaysSummer: 18,
          frequencyDaysWinter: 35,
          method: '잎에 물이 고이지 않도록 흙 가장자리에 천천히 흠뻑 주고, 겨울철에는 한 달 이상 단수해도 무방합니다.',
          soilCheckTip: '화분 속 흙이 100% 완전히 바짝 마른 것을 확인한 후 며칠 더 있다가 줍니다.',
          overwaterSigns: '잎 밑동이 흐물흐물해지며 악취와 함께 쓰러짐 (무름병)',
          underwaterSigns: '잎 표면에 세로 주름이 깊게 생기며 얇아짐',
        },
        temperature: {
          idealRange: '18°C ~ 27°C',
          minSurvivalC: 7,
          winterAdvice: '추위에 약하므로 겨울에는 반드시 13°C 이상의 따뜻한 실내로 들이고 물을 완전히 굶기듯 관리하세요.',
        },
        humidity: {
          idealPercent: '30% ~ 50% (건조 선호)',
          tips: '습한 환경을 싫어하므로 잎에 직접 분무하지 마시고 건조하게 키우세요.',
        },
        soilAndPotting: {
          soilMix: '다육이 전용토 또는 배양토 30% + 마사토/펄라이트 70% (극상의 배수성)',
          potType: '수분을 빠르게 배출해주는 숨 쉬는 토분',
          repottingIntervalMonths: 36,
          repottingTips: '화분이 비좁아져 플라스틱 화분이 찌그러질 정도가 될 때까지 분갈이를 미루는 편이 오히려 잘 자랍니다.',
        },
        fertilizer: {
          frequency: '봄과 여름에 2달에 1회 아주 엷게 희석한 액비 소량',
          season: '5월 ~ 8월',
          tips: '영양제 욕심을 내지 않아도 충분히 튼튼하게 자라는 다육성 식물입니다.',
        },
        toxicity: {
          safeForPets: false,
          safeForChildren: false,
          details: '사포닌 성분을 함유하고 있어 개나 고양이가 다량 씹을 경우 소화기 자극을 일으킬 수 있습니다.',
        },
        propagation: {
          methods: ['잎꽂이(엽삽)', '새순 포기나누기'],
          bestSeason: '5월 ~ 6월',
          instructions: '잎을 7~10cm로 잘라 며칠 그늘에서 말린 뒤 흙에 꽂거나 물에 담그면 새순이 돋아납니다.',
        },
        pruning: '오래되어 마른 잎만 가위로 밑동을 단정하게 잘라냅니다.',
        funFacts: [
          'NASA 공기정화식물 연구에서 벤젠, 폼알데하이드, 트리클로로에틸렌을 모두 정화하는 대표 챔피언 식물로 선정되었습니다.',
          '노란 테두리가 있는 품종을 잎꽂이하면 유전적 특성상 테두리가 없는 원종 녹색 산세베리아로 돌아가는 신기한 특징이 있습니다.',
        ],
      },
    },
  },
  {
    id: 'sample-sick-monstera',
    nameKo: '과습 증상 몬스테라 (진단 테스트용)',
    nameEn: 'Monstera with Yellow Leaves (Diagnostic Sample)',
    tag: '🚨 건강 진단 샘플',
    isDiagnosticTest: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80',
    description: '하단 잎이 누렇게 변하고 갈색 반점이 생긴 식물 병원 진단 테스트 케이스',
    mockResult: {
      isPlant: true,
      commonNameKo: '몬스테라 델리시오사 (이상 증상 관찰)',
      commonNameEn: 'Monstera Deliciosa with Leaf Chlorosis',
      scientificName: 'Monstera deliciosa Liebm.',
      family: '천남성과 (Araceae)',
      confidence: 96,
      difficultyLevel: '쉬움',
      airPurifyingEffect: 4,
      summary: '잎의 황화(Chlorosis) 현상 및 침수성 갈색 괴사 반점이 관찰됩니다. 전형적인 통풍 부족 및 과습(뿌리 질식) 초기 증상입니다.',
      healthStatus: '주의 필요',
      diagnosis: {
        hasIssue: true,
        issueTitle: '뿌리 과습 및 통풍 부족에 의한 잎 황화 현상 (Chlorosis & Root Stress)',
        severity: '보통',
        symptoms: [
          '아래쪽 오래된 잎부터 노랗게 탈색되며 잎자루 힘이 빠짐',
          '잎 가장자리에 짙은 갈색 테두리와 수침상(물에 젖은 듯한) 반점 형성',
          '화분 겉흙이 며칠째 마르지 않고 축축하게 젖어 있음',
        ],
        cause: '배수 불량, 지나치게 잦은 물주기, 화분 받침대 물 고임 방치로 인한 뿌리 산소 결핍',
        treatments: [
          '즉시 물주기를 중단하고 통풍이 잘되는 그늘진 곳으로 화분을 이동하세요.',
          '선풍기나 서큘레이터를 화분 흙 쪽으로 약하게 틀어 화분 속 수분을 빠르게 날려주세요.',
          '완전히 노랗게 변해 회복이 불가능한 잎은 소독된 가위로 잎자루 기부를 깨끗이 잘라내어 양분 소모를 줄이세요.',
          '만약 흙에서 시큼하고 썩은 냄새가 난다면 화분에서 꺼내 썩은 검은 뿌리를 잘라내고 새 배양토로 긴급 분갈이가 필요합니다.',
        ],
        preventions: [
          '항상 겉흙 3~4cm가 완전히 마른 것을 확인한 후 물을 주세요.',
          '화분 받침대에 고인 물은 10분 내에 반드시 비워주세요.',
          '펄라이트나 마사토 비율을 30% 이상 섞어 배수력을 높여주세요.',
        ],
      },
      careGuide: {
        light: {
          level: '반양지 (직사광선 피하기)',
          description: '치료 중에는 강한 햇빛에 노출되면 스트레스로 더 빨리 마를 수 있으니 은은한 간접광 위치에 두세요.',
          idealHours: '하루 4시간 부드러운 산란광',
        },
        watering: {
          frequencyDaysSummer: 8,
          frequencyDaysWinter: 14,
          method: '현재는 단수 필요. 흙이 완전히 마른 후 잎 상태를 보며 물 양을 절반으로 줄여 공급 시작',
          soilCheckTip: '손가락으로 흙 깊숙이 찔러보아 흙 알갱이가 묻어나지 않을 때까지 대기',
          overwaterSigns: '노란 잎, 무른 줄기, 흙 곰팡이',
          underwaterSigns: '바스락거리는 잎마름',
        },
        temperature: {
          idealRange: '20°C ~ 25°C',
          minSurvivalC: 13,
          winterAdvice: '치료 기간 동안에는 온도 변화가 적은 안정된 실내 환경을 유지하세요.',
        },
        humidity: {
          idealPercent: '50% ~ 60%',
          tips: '과습 상태일 때는 잎에 분무하지 마세요. 곰팡이성 병반이 번질 수 있습니다.',
        },
        soilAndPotting: {
          soilMix: '배양토 50% + 펄라이트 30% + 바크 20% (통기성 극대화 배합)',
          potType: '물 배출이 원활한 통풍 슬릿분 또는 테라코타 토분',
          repottingIntervalMonths: 12,
          repottingTips: '뿌리 손상이 심하면 루팅 파우더(발근제)를 살짝 묻혀 심어주세요.',
        },
        fertilizer: {
          frequency: '식물이 완전히 건강을 회복할 때까지 모든 비료 공급 중단',
          season: '회복 완료 후 봄철부터 재개',
          tips: '아픈 식물에 영양제를 주는 것은 독약을 주는 것과 같습니다. 절대 시비 금지!',
        },
        toxicity: {
          safeForPets: false,
          safeForChildren: false,
          details: '옥살산칼슘 함유, 섭취 주의 필요',
        },
        propagation: {
          methods: ['건강한 마디 물꽂이'],
          bestSeason: '식물 회복 후',
          instructions: '병들지 않은 건강한 줄기 부분만 골라 마디를 소독하여 물꽂이 시도 가능',
        },
        pruning: '노랗게 변한 병든 잎은 아까워하지 말고 즉시 기부에서 절단하세요.',
        funFacts: [
          '식물의 잎이 노래지는 것은 뿌리가 숨을 쉬지 못해 질소와 마그네슘을 위로 올려보내지 못하고 있다는 SOS 신호입니다.',
        ],
      },
    },
  },
  {
    id: 'sample-peace-lily',
    nameKo: '스파티필룸 (Peace Lily)',
    nameEn: 'Peace Lily',
    tag: '우아한 흰 꽃 & 쉬운 신호',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80',
    description: '물이 필요하면 잎을 숙여 알려주는 가장 솔직하고 착한 반려식물',
    mockResult: {
      isPlant: true,
      commonNameKo: '스파티필룸 (스파트필름)',
      commonNameEn: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      family: '천남성과 (Araceae)',
      confidence: 97,
      difficultyLevel: '쉬움 (초보자 추천)',
      airPurifyingEffect: 5,
      summary: '순백의 포엽(불염포)이 평화로운 느낌을 주는 대표적인 실내 공기정화 식물입니다. 반음지에서도 꽃을 피우며, 물이 부족하면 잎을 드라마틱하게 축 늘어뜨려 신호를 보냅니다.',
      healthStatus: '건강함',
      diagnosis: {
        hasIssue: false,
        issueTitle: '건강한 생육 상태',
        severity: '경미',
        symptoms: ['잎이 생기있게 뻗어있고 짙은 에메랄드 광택 유지'],
        cause: '적절한 수분 공급 및 반음지 환경',
        treatments: ['잎이 살짝 고개를 숙이기 시작할 때 물을 흠뻑 주세요.'],
        preventions: ['수돗물 속 염소 성분에 잎끝이 탈 수 있으니 하루 받아둔 미온수를 주세요.'],
      },
      careGuide: {
        light: {
          level: '반음지 ~ 밝은 그늘',
          description: '강한 햇빛을 매우 싫어합니다. 직사광선을 쬐면 잎이 누렇게 타버리므로, 빛이 은은하게 들어오는 방이나 거실 안쪽이 최적입니다.',
          idealHours: '하루 2~4시간 간접 산란광',
        },
        watering: {
          frequencyDaysSummer: 4,
          frequencyDaysWinter: 8,
          method: '물을 좋아하므로 잎이 힘을 잃고 살짝 처질 때 화분 밑으로 물이 콸콸 나올 때까지 흠뻑 주세요.',
          soilCheckTip: '손가락으로 흙을 만져보아 겉흙이 보송하게 말랐을 때',
          overwaterSigns: '잎 끝이 시커멓게 썩어 들어가고 줄기 밑동이 물러짐',
          underwaterSigns: '식물 전체가 마치 죽은 것처럼 바닥으로 축 늘어짐 (물 주면 2시간 만에 부활)',
        },
        temperature: {
          idealRange: '18°C ~ 25°C',
          minSurvivalC: 12,
          winterAdvice: '추위에 약하므로 겨울철 외풍이 드는 창가나 현관문 근처를 피하세요.',
        },
        humidity: {
          idealPercent: '60% ~ 80% (다습 선호)',
          tips: '공중 습도를 매우 좋아합니다. 건조한 날에는 잎 주변에 자주 분무해 주세요.',
        },
        soilAndPotting: {
          soilMix: '보습력과 배수성을 겸비한 배양토 70% + 펄라이트 30%',
          potType: '뿌리가 왕성하게 자라므로 깊이감 있는 도자기나 플라스틱 화분',
          repottingIntervalMonths: 12,
          repottingTips: '1~2년에 한 번 봄에 포기나누기를 겸해 분갈이하면 여러 개의 화분으로 늘릴 수 있습니다.',
        },
        fertilizer: {
          frequency: '봄과 여름철 개화기 동안 3주에 1회 액비',
          season: '4월 ~ 8월',
          tips: '비료가 과하면 잎 끝이 갈색으로 탈 수 있으니 정량의 1/2로 묽게 타서 주세요.',
        },
        toxicity: {
          safeForPets: false,
          safeForChildren: false,
          details: '불용성 옥살산염 함유. 반려동물이 잎을 뜯어먹지 못하도록 높은 선반에 배치하세요.',
        },
        propagation: {
          methods: ['포기나누기 (분주)', '수경재배'],
          bestSeason: '봄 (분갈이 철)',
          instructions: '화분에서 식물을 꺼내 뿌리를 살살 털어낸 후 칼이나 가위로 뿌리가 붙은 줄기 덩어리를 2~3개로 나누어 심습니다.',
        },
        pruning: '하얗던 꽃이 초록색으로 변하고 시들면 꽃대 밑동을 잘라주면 새 꽃대가 더 빨리 올라옵니다.',
        funFacts: [
          '흰색 꽃처럼 보이는 것은 사실 꽃잎이 아니라 꽃을 보호하는 변형된 잎인 \'불염포(Spathe)\'이고, 가운데 방망이처럼 생긴 것이 진짜 작은 꽃들의 모임입니다.',
          'NASA 클린 에어 연구에서 알코올, 아세톤, 벤젠 등 5대 실내 독성 가스를 모두 정화하는 만능 정화 식물로 꼽혔습니다.',
        ],
      },
    },
  },
];
