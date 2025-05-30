import { StoryEvent, Choice } from "../types/game";

export const MOCK_STORIES: StoryEvent[] = [
  {
    id: "start_1",
    stageNumber: 1,
    content: "어두운 돌방에서 깨어난 당신은 고대의 먼지 냄새가 가득한 공기를 맡습니다. 머리가 지끈거리며 기억이 희미하게 떠오릅니다. 어떻게 이곳에 왔을까요? 마지막으로 기억나는 것은... 무엇이었죠? 의식? 전투? 자세한 기억이 떠오르지 않습니다. 앞에는 낡은 나무문이 있고, 깜빡이는 횃불이 벽에 그림자를 드리우고 있습니다. 어떻게 하시겠습니까?",
    type: "이야기",
    choices: [
      { id: 1, text: "방을 자세히 살펴본다" },
      { id: 2, text: "자신의 상태와 소지품을 확인한다" },
      { id: 3, text: "문으로 다가가 열어본다" },
    ]
  },
  {
    id: "story_2a",
    stageNumber: 2,
    content: "방을 자세히 살펴보니 벽에는 이상한 문양들이 새겨져 있습니다. 구석에는 먼지 쌓인 상자가 하나 있고, 바닥에는 최근에 누군가 지나간 듯한 자국이 있습니다. 멀리 벽의 틈새에서 미세한 바람이 불어오는데, 숨겨진 통로가 있을지도 모르겠습니다.",
    type: "이야기",
    choices: [
      { id: 1, text: "벽의 이상한 문양을 조사한다" },
      { id: 2, text: "구석의 상자를 확인한다" },
      { id: 3, text: "벽의 틈새를 조사한다" },
      { id: 4, text: "문으로 돌아가 나가본다" }
    ]
  },
  {
    id: "combat_3",
    stageNumber: 3,
    content: "문으로 다가가자 바닥이 흔들립니다. 갑자기 바닥의 일부가 무너지며 어둠 속에서 해골 병사가 나타납니다. 그것의 눈구멍에서는 파란 빛이 새어나오고, 녹슨 검을 들고 있습니다. 문으로 가는 길을 막아서는 해골 병사와 맞서 싸워야 할 것 같습니다.",
    type: "전투",
    enemyId: "skeleton_guard",
    choices: [
      { id: 1, text: "주력 기술로 공격한다" },
      { id: 2, text: "회피하며 약점을 찾는다" },
      { id: 3, text: "대화를 시도해본다" },
      { id: 4, text: "주변의 물건을 무기로 활용한다" }
    ]
  }
];

export const MOCK_ENEMIES = {
  "skeleton_guard": {
    id: "skeleton_guard",
    name: "해골 병사",
    level: 1,
    health: 30,
    damage: 5,
    description: "고대의 갑옷을 입은 되살아난 해골, 눈구멍에서 신비한 빛이 새어나옵니다.",
    loot: [
      {
        id: "rusty_sword",
        name: "녹슨 검",
        description: "오래된 검이지만, 아직도 꽤 날카롭습니다.",
        type: "무기",
        effects: { strength: 2 },
        value: 5
      }
    ],
    gold: 15,
    experience: 20
  }
};