const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.join(__dirname, '..');

function getLevelArg() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--level');
  if (idx !== -1 && args[idx + 1]) {
    return parseInt(args[idx + 1], 10);
  }
  const shortIdx = args.indexOf('-l');
  if (shortIdx !== -1 && args[shortIdx + 1]) {
    return parseInt(args[shortIdx + 1], 10);
  }
  return 2;
}

const level = getLevelArg();
const OVERRIDES_JS_PATH = path.join(PROJECT_ROOT, 'src', 'data', `wordDefinitionsZhTW_L${level}_overrides.js`);
const CORRECTIONS_JSON_PATH = path.join(PROJECT_ROOT, 'reports', `zhTW-level${level}-corrections.json`);
const AUDIT_JSON_PATH = path.join(PROJECT_ROOT, 'reports', `zhTW-level${level}-dedup-audit.json`);

// Level-specific manual sense override dictionary
const LEVEL_MANUAL_OVERRIDES = {
  1: {
  "plane%1:25:00::": {
    "meaningZhTW": "（數學）平面",
    "reason": "Differentiate geometry plane from aircraft"
  },
  "airplane%1:06:00::": {
    "meaningZhTW": "飛機",
    "reason": "Standard airplane noun"
  },
  "plane%1:06:01::": {
    "meaningZhTW": "飛機",
    "reason": "Standard plane aircraft noun"
  },
  "along%4:02:00::": {
    "meaningZhTW": "向前；前進",
    "reason": "Adverbial onward movement sense"
  },
  "along%4:02:01::": {
    "meaningZhTW": "沿著；平行地",
    "reason": "Spatial parallel alignment sense"
  },
  "along%4:02:02::": {
    "meaningZhTW": "隨同；一起",
    "reason": "Accompanying sense"
  },
  "arm%1:08:00::": {
    "meaningZhTW": "手臂",
    "reason": "Human limb sense"
  },
  "arm%1:06:03::": {
    "meaningZhTW": "臂狀物；扶手",
    "reason": "Resembling human arm"
  },
  "arm%1:06:01::": {
    "meaningZhTW": "武器；兵器",
    "reason": "Military fighting weapon sense"
  },
  "arm%2:33:00::": {
    "meaningZhTW": "裝備武器；武裝",
    "reason": "Equip with weapons verb"
  },
  "arm%2:40:00::": {
    "meaningZhTW": "準備起爆；設定備用",
    "reason": "Prepare bomb/fuse verb"
  },
  "attack%1:04:00::": {
    "meaningZhTW": "攻擊；進攻",
    "reason": "Military or physical assault"
  },
  "attack%1:26:00::": {
    "meaningZhTW": "抨擊；批判",
    "reason": "Verbal strong criticism"
  },
  "attack%1:26:01::": {
    "meaningZhTW": "(疾病) 猝發；發作",
    "reason": "Medical sudden onset"
  },
  "attack%2:33:00::": {
    "meaningZhTW": "發動攻擊；進攻",
    "reason": "Physical attack verb"
  },
  "attack%2:32:00::": {
    "meaningZhTW": "嚴厲抨擊",
    "reason": "Criticize strongly verb"
  },
  "attack%2:30:00::": {
    "meaningZhTW": "積極著手處理",
    "reason": "Set to work upon verb"
  },
  "baby%1:18:00::": {
    "meaningZhTW": "嬰兒；幼兒",
    "reason": "Infant sense"
  },
  "baby%1:18:02::": {
    "meaningZhTW": "(家族中) 老么",
    "reason": "Youngest member sense"
  },
  "baby%1:18:01::": {
    "meaningZhTW": "寶貝；親愛的",
    "reason": "Affectionate address sense"
  },
  "baseball%1:04:00::": {
    "meaningZhTW": "棒球運動",
    "reason": "Differentiate ball game from physical ball"
  },
  "baseball%1:06:00::": {
    "meaningZhTW": "棒球（球體）",
    "reason": "Physical ball"
  },
  "basketball%1:04:00::": {
    "meaningZhTW": "籃球運動",
    "reason": "Differentiate ball game from physical ball"
  },
  "basketball%1:06:00::": {
    "meaningZhTW": "籃球（球體）",
    "reason": "Physical ball"
  },
  "bear%1:05:00::": {
    "meaningZhTW": "熊",
    "reason": "Animal bear sense"
  },
  "bear%1:18:00::": {
    "meaningZhTW": "空頭；看跌者",
    "reason": "Differentiate financial investor sense from animal"
  },
  "behind%4:02:00::": {
    "meaningZhTW": "在背後；向後",
    "reason": "Spatial rear location"
  },
  "behind%4:02:02::": {
    "meaningZhTW": "(進度) 落後",
    "reason": "Temporal/progress delay"
  },
  "behind%4:02:01::": {
    "meaningZhTW": "(債務) 拖欠",
    "reason": "Financial arrears sense"
  },
  "bird%1:05:00::": {
    "meaningZhTW": "鳥；禽類",
    "reason": "Avian animal sense"
  },
  "bird%1:18:01::": {
    "meaningZhTW": "(口語) 家夥；人",
    "reason": "Informal person sense"
  },
  "bird%1:06:00::": {
    "meaningZhTW": "羽毛球（簡稱）",
    "reason": "Badminton shuttlecock sense"
  },
  "blue%3:00:00::": {
    "meaningZhTW": "藍色的",
    "reason": "Color adjective"
  },
  "blue%5:00:00:chromatic:00": {
    "meaningZhTW": "藍色的",
    "reason": "Standard blue color"
  },
  "blue%5:00:00:northern:02": {
    "meaningZhTW": "(美國南北戰爭) 聯軍的",
    "reason": "Civil war Union forces"
  },
  "blue%5:00:00:depressed:00": {
    "meaningZhTW": "憂鬱的；沮喪的",
    "reason": "Emotional depressed sense"
  },
  "blue%5:00:00:puritanical:00": {
    "meaningZhTW": "嚴苛的；清規戒律的",
    "reason": "Moral strictness sense"
  },
  "bottle%1:06:00::": {
    "meaningZhTW": "瓶子；水瓶",
    "reason": "Liquid container sense"
  },
  "bottle%1:06:01::": {
    "meaningZhTW": "奶瓶",
    "reason": "Infant feeding bottle"
  },
  "bottle%1:06:02::": {
    "meaningZhTW": "(化學/工業) 浸泡槽；容器",
    "reason": "Chemical vessel"
  },
  "butter%1:13:00::": {
    "meaningZhTW": "奶油",
    "reason": "Dairy food spread"
  },
  "butter%1:13:01::": {
    "meaningZhTW": "植物脂；植物奶油",
    "reason": "Vegetable fat substance"
  },
  "butter%1:18:00::": {
    "meaningZhTW": "頭撞者；頂角格鬥者",
    "reason": "Fighter who strikes with head"
  },
  "butterfly%1:05:00::": {
    "meaningZhTW": "蝴蝶",
    "reason": "Insect sense"
  },
  "butterfly%1:04:00::": {
    "meaningZhTW": "蝶泳",
    "reason": "Swimming stroke sense"
  },
  "camp%1:15:00::": {
    "meaningZhTW": "營地；露營地",
    "reason": "Temporary shelter site"
  },
  "camp%1:06:00::": {
    "meaningZhTW": "軍營；兵營",
    "reason": "Army living quarters"
  },
  "camp%1:06:01::": {
    "meaningZhTW": "露營處；野營地",
    "reason": "Country lodgings for travelers"
  },
  "camp%1:14:00::": {
    "meaningZhTW": "陣營；派系",
    "reason": "Group/faction sense"
  },
  "camp%1:04:00::": {
    "meaningZhTW": "夏令營；訓練營",
    "reason": "Program/activity camp"
  },
  "climb%2:38:00::": {
    "meaningZhTW": "攀登；爬",
    "reason": "Ascend physical structure"
  },
  "climb%2:38:02::": {
    "meaningZhTW": "(位階/地位) 晉升；上升",
    "reason": "Social advancement"
  },
  "climb%2:30:00::": {
    "meaningZhTW": "(氣溫/物價) 上升",
    "reason": "Numerical increase"
  },
  "climb%1:04:00::": {
    "meaningZhTW": "攀登；爬山",
    "reason": "Ascent activity"
  },
  "climb%1:17:00::": {
    "meaningZhTW": "上坡；斜坡",
    "reason": "Sloped grade"
  },
  "climb%1:11:00::": {
    "meaningZhTW": "(地位) 上升；提升",
    "reason": "Progressive growth"
  },
  "cold%3:00:01::": {
    "meaningZhTW": "寒冷的；冰涼的",
    "reason": "Low temperature sense"
  },
  "cold%3:00:02::": {
    "meaningZhTW": "冷淡的；無情感的",
    "reason": "Emotionally unfeeling"
  },
  "cold%3:00:03::": {
    "meaningZhTW": "冷漠的；不熱情的",
    "reason": "Psychological coldness"
  },
  "cold%5:00:00:stale:00": {
    "meaningZhTW": "不新鮮的；過期的",
    "reason": "Lost freshness"
  },
  "cold%5:00:00:unconscious:00": {
    "meaningZhTW": "昏迷的；失去知覺的",
    "reason": "Unconscious state"
  },
  "come%2:38:00::": {
    "meaningZhTW": "過來；前來",
    "reason": "Approach location"
  },
  "come%2:30:00::": {
    "meaningZhTW": "達到；至（某狀態/數量）",
    "reason": "Reach specified state"
  },
  "come%2:42:00::": {
    "meaningZhTW": "發生；前來（某時段）",
    "reason": "Happen/occur"
  },
  "cool%3:00:01::": {
    "meaningZhTW": "涼爽的；涼快的",
    "reason": "Cool temperature"
  },
  "cool%5:00:00:unenthusiastic:00": {
    "meaningZhTW": "冷淡的；冷靜的",
    "reason": "Unenthusiastic/calm"
  },
  "cool%5:00:00:fashionable:00": {
    "meaningZhTW": "酷的；時髦的",
    "reason": "Informal fashionable"
  },
  "count%2:32:00::": {
    "meaningZhTW": "計算；數數",
    "reason": "Enumerate numbers"
  },
  "count%2:31:00::": {
    "meaningZhTW": "認為；視為",
    "reason": "Consider/deem"
  },
  "count%2:42:00::": {
    "meaningZhTW": "有價值；重要",
    "reason": "Have value or significance"
  },
  "cover%1:06:02::": {
    "meaningZhTW": "蓋子；罩子",
    "reason": "Overlying lid/cap"
  },
  "cover%1:06:00::": {
    "meaningZhTW": "(書本) 封面",
    "reason": "Book binding cover"
  },
  "cover%1:06:01::": {
    "meaningZhTW": "掩蔽處；避難所",
    "reason": "Shelter/concealment"
  },
  "deep%3:00:01::": {
    "meaningZhTW": "深的；深層的",
    "reason": "Great downward depth"
  },
  "deep%5:00:00:profound:00": {
    "meaningZhTW": "(思想) 深奧的；深刻的",
    "reason": "Profound understanding"
  },
  "deep%5:00:00:low:02": {
    "meaningZhTW": "(聲音) 低沉的",
    "reason": "Low pitch voice"
  },
  "dish%1:06:00::": {
    "meaningZhTW": "盤子；碟子",
    "reason": "Tableware vessel"
  },
  "dish%1:13:00::": {
    "meaningZhTW": "菜餚；餐點",
    "reason": "Prepared food"
  },
  "dish%1:06:04::": {
    "meaningZhTW": "(通訊) 碟形天線",
    "reason": "Satellite dish antenna"
  },
  "drive%1:04:02::": {
    "meaningZhTW": "開車出行；兜風",
    "reason": "Vehicle ride excursion"
  },
  "drive%1:12:00::": {
    "meaningZhTW": "驅動力；強烈慾望",
    "reason": "Psychological urge"
  },
  "drive%1:04:00::": {
    "meaningZhTW": "運動；組織活動",
    "reason": "Organized campaign"
  },
  "drive%2:38:01::": {
    "meaningZhTW": "駕駛；開車",
    "reason": "Operate vehicle"
  },
  "drive%2:38:00::": {
    "meaningZhTW": "搭車旅行",
    "reason": "Be transported in vehicle"
  },
  "drive%2:38:02::": {
    "meaningZhTW": "開車載送",
    "reason": "Transport someone by driving"
  },
  "duck%2:38:00::": {
    "meaningZhTW": "快速蹲下；閃避",
    "reason": "Submerge/crouch quickly"
  },
  "duck%2:38:02::": {
    "meaningZhTW": "避開；逃避（責任）",
    "reason": "Avoid obligation"
  },
  "duck%2:35:00::": {
    "meaningZhTW": "浸入水中",
    "reason": "Dip into water"
  },
  "east%1:24:00::": {
    "meaningZhTW": "東方；正東",
    "reason": "Compass point"
  },
  "east%1:15:02::": {
    "meaningZhTW": "東部地區",
    "reason": "Eastern region"
  },
  "east%1:24:02::": {
    "meaningZhTW": "東方方向",
    "reason": "Direction heading east"
  },
  "expect%2:31:00::": {
    "meaningZhTW": "預料；預期",
    "reason": "Anticipate event"
  },
  "expect%2:32:00::": {
    "meaningZhTW": "期望；要求",
    "reason": "Demand/require"
  },
  "expect%2:29:00::": {
    "meaningZhTW": "懷孕；等待分娩",
    "reason": "Informal pregnant"
  },
  "face%1:08:00::": {
    "meaningZhTW": "臉；面孔",
    "reason": "Anatomical face"
  },
  "face%1:07:03::": {
    "meaningZhTW": "面容；表情",
    "reason": "Face feelings expression"
  },
  "face%1:07:00::": {
    "meaningZhTW": "外觀；外表",
    "reason": "Outward appearance"
  },
  "face%1:15:00::": {
    "meaningZhTW": "(物體) 表面；正面",
    "reason": "Surface aspect"
  },
  "fall%1:11:02::": {
    "meaningZhTW": "秋天；秋季",
    "reason": "Autumn season"
  },
  "fall%1:28:00::": {
    "meaningZhTW": "秋天；秋季",
    "reason": "Season leaves fall"
  },
  "fall%1:11:00::": {
    "meaningZhTW": "下降；跌落",
    "reason": "Downward drop"
  },
  "fall%1:04:01::": {
    "meaningZhTW": "跌倒；摔倒",
    "reason": "Sudden upright drop"
  },
  "fall%1:17:00::": {
    "meaningZhTW": "下坡；傾斜",
    "reason": "Downward slope"
  },
  "fall%1:04:04::": {
    "meaningZhTW": "陷落；淪陷",
    "reason": "Surrender/defeat"
  },
  "fall%2:38:00::": {
    "meaningZhTW": "跌倒；落下",
    "reason": "Drop under gravity"
  },
  "fall%2:30:00::": {
    "meaningZhTW": "(數量/氣溫) 降低；減少",
    "reason": "Decrease in number"
  },
  "fall%2:38:03::": {
    "meaningZhTW": "陣亡；倒下",
    "reason": "Die in battle"
  },
  "feel%1:09:00::": {
    "meaningZhTW": "直覺；感受",
    "reason": "Intuitive perception"
  },
  "feel%1:07:00::": {
    "meaningZhTW": "觸感；手感",
    "reason": "Tactile sensation"
  },
  "feel%1:10:00::": {
    "meaningZhTW": "氛圍；整體感覺",
    "reason": "Atmosphere/ambience"
  },
  "fight%2:33:00::": {
    "meaningZhTW": "打架；戰鬥",
    "reason": "Physical combat verb"
  },
  "fight%2:41:00::": {
    "meaningZhTW": "奮鬥；努力爭取",
    "reason": "Strive against verb"
  },
  "fight%2:33:02::": {
    "meaningZhTW": "爭吵；辯論",
    "reason": "Verbal dispute verb"
  },
  "fight%1:04:02::": {
    "meaningZhTW": "打架；打鬥",
    "reason": "Hostile physical encounter"
  },
  "fight%1:04:01::": {
    "meaningZhTW": "戰鬥；戰役",
    "reason": "Military force meeting"
  },
  "fight%1:07:00::": {
    "meaningZhTW": "鬥志；好勝心",
    "reason": "Willingness to compete"
  },
  "fight%1:04:00::": {
    "meaningZhTW": "抗爭；奮鬥",
    "reason": "Struggle/campaign"
  },
  "fight%1:04:03::": {
    "meaningZhTW": "爭吵；口角",
    "reason": "Verbal brawl"
  },
  "finger%2:35:00::": {
    "meaningZhTW": "用手指觸摸",
    "reason": "Touch with fingers"
  },
  "finger%2:35:01::": {
    "meaningZhTW": "彈奏（樂器鍵盤/弦）",
    "reason": "Examine/play with fingers"
  },
  "finger%2:32:00::": {
    "meaningZhTW": "(口語) 指認；告發",
    "reason": "Informal accuse/identify"
  },
  "fire%1:11:00::": {
    "meaningZhTW": "火；火焰",
    "reason": "Combustion flame"
  },
  "fire%1:04:00::": {
    "meaningZhTW": "開火；砲火",
    "reason": "Gunshot weaponry"
  },
  "fire%1:26:00::": {
    "meaningZhTW": "火災",
    "reason": "Destructive burning"
  },
  "fire%2:33:01::": {
    "meaningZhTW": "開槍；射擊",
    "reason": "Shoot weapon"
  },
  "fire%2:41:00::": {
    "meaningZhTW": "解僱；開除",
    "reason": "Dismiss employee"
  },
  "fire%2:30:00::": {
    "meaningZhTW": "點燃；發動引擎",
    "reason": "Start engine/combustion"
  },
  "front%1:15:00::": {
    "meaningZhTW": "前面；正面",
    "reason": "Forward part"
  },
  "front%1:15:01::": {
    "meaningZhTW": "(軍事) 前線",
    "reason": "Military battlefront"
  },
  "front%1:19:00::": {
    "meaningZhTW": "(氣象) 鋒面",
    "reason": "Meteorological air front"
  },
  "future%3:00:00::": {
    "meaningZhTW": "未來的",
    "reason": "Time adjective"
  },
  "future%5:00:00:prospective:00": {
    "meaningZhTW": "預期的；前瞻的",
    "reason": "Prospective/effective"
  },
  "future%5:00:00:subsequent:00": {
    "meaningZhTW": "後續的；未來的",
    "reason": "Subsequent in time"
  },
  "glove%1:06:00::": {
    "meaningZhTW": "手套",
    "reason": "Hand garment"
  },
  "glove%1:06:01::": {
    "meaningZhTW": "(棒球) 捕手手套",
    "reason": "Baseball mitt"
  },
  "glove%1:06:02::": {
    "meaningZhTW": "(拳擊) 拳擊手套",
    "reason": "Boxing glove"
  },
  "gray%3:00:02::": {
    "meaningZhTW": "灰色的",
    "reason": "Color adjective"
  },
  "gray%5:00:00:achromatic:00": {
    "meaningZhTW": "灰色的",
    "reason": "Standard achromatic gray"
  },
  "gray%5:00:00:old:02": {
    "meaningZhTW": "(頭髮) 灰白的",
    "reason": "Gray aging hair"
  },
  "gray%5:00:00:southern:02": {
    "meaningZhTW": "(美國南北戰爭) 邦聯軍的",
    "reason": "Confederate forces"
  },
  "gray%5:00:00:intermediate:00": {
    "meaningZhTW": "中間狀態的；模糊的",
    "reason": "Intermediate/neutral"
  },
  "guess%2:31:01::": {
    "meaningZhTW": "猜測；推測",
    "reason": "Form estimate"
  },
  "guess%2:31:00::": {
    "meaningZhTW": "猜中；猜到",
    "reason": "Guess correctly"
  },
  "guess%2:31:03::": {
    "meaningZhTW": "(口語) 認為；想",
    "reason": "Informal expect/think"
  },
  "hate%2:37:00::": {
    "meaningZhTW": "憎恨；討厭",
    "reason": "Feel intense dislike"
  },
  "hate%2:32:00::": {
    "meaningZhTW": "遺憾；抱歉（去做某事）",
    "reason": "Regret politely"
  },
  "head%1:08:00::": {
    "meaningZhTW": "頭；頭部",
    "reason": "Anatomical head"
  },
  "head%1:05:00::": {
    "meaningZhTW": "(家畜) 頭數",
    "reason": "Single domestic animal"
  },
  "head%1:09:00::": {
    "meaningZhTW": "頭腦；理智",
    "reason": "Conscious brain functions"
  },
  "head%1:18:00::": {
    "meaningZhTW": "首長；主管",
    "reason": "Leader/chief"
  },
  "head%1:15:00::": {
    "meaningZhTW": "(隊伍/列表) 頂端；前列",
    "reason": "Top/front position"
  },
  "head%2:38:00::": {
    "meaningZhTW": "朝...前進；出發",
    "reason": "Move in direction"
  },
  "head%2:41:00::": {
    "meaningZhTW": "率領；領導",
    "reason": "Lead/direct group"
  },
  "head%2:42:00::": {
    "meaningZhTW": "地位高於；居...之首",
    "reason": "Be in front of"
  },
  "healthy%3:00:00::": {
    "meaningZhTW": "健康的；強健的",
    "reason": "Good health state"
  },
  "healthy%5:00:00:wholesome:00": {
    "meaningZhTW": "有益健康的",
    "reason": "Promoting health"
  },
  "healthy%5:00:00:flourishing:00": {
    "meaningZhTW": "健旺的；繁榮的",
    "reason": "Flourishing/financially sound"
  },
  "under%4:02:05::": {
    "meaningZhTW": "敗局；毀滅狀態",
    "reason": "Defeat state"
  },
  "under%4:02:07::": {
    "meaningZhTW": "在...以下（數量）",
    "reason": "Downward range"
  },
  "under%4:02:06::": {
    "meaningZhTW": "陷入昏迷狀態",
    "reason": "Unconscious state"
  },
  "wait%2:42:00::": {
    "meaningZhTW": "等待；等候",
    "reason": "Stay and anticipate"
  },
  "wait%2:42:01::": {
    "meaningZhTW": "暫緩行動；等一下",
    "reason": "Delay acting"
  },
  "wait%2:31:00::": {
    "meaningZhTW": "期待；指望",
    "reason": "Look forward to"
  },
  "warm%3:00:01::": {
    "meaningZhTW": "溫暖的；暖和的",
    "reason": "Thermal heat"
  },
  "warm%3:00:02::": {
    "meaningZhTW": "親切的；熱情的",
    "reason": "Friendly emotion"
  },
  "warm%3:00:03::": {
    "meaningZhTW": "(顏色) 暖色調的",
    "reason": "Color tone"
  },
  "weather%2:42:00::": {
    "meaningZhTW": "經受住；平安渡過（風暴）",
    "reason": "Withstand courageously"
  },
  "weather%2:38:00::": {
    "meaningZhTW": "使傾斜",
    "reason": "Cause slope"
  },
  "weather%2:38:01::": {
    "meaningZhTW": "(航海) 迎風航行",
    "reason": "Nautical sail windward"
  },
  "west%1:24:00::": {
    "meaningZhTW": "西方；正西",
    "reason": "Compass point"
  },
  "west%1:24:02::": {
    "meaningZhTW": "西方方向",
    "reason": "Heading west"
  },
  "west%1:15:02::": {
    "meaningZhTW": "西部地區",
    "reason": "Western region"
  },
  "work%1:04:00::": {
    "meaningZhTW": "工作；勞動",
    "reason": "Activity effort"
  },
  "work%1:06:00::": {
    "meaningZhTW": "作品；著作",
    "reason": "Product accomplished"
  },
  "work%1:04:01::": {
    "meaningZhTW": "職業；工作崗位",
    "reason": "Paid occupation"
  },
  "yard%1:23:00::": {
    "meaningZhTW": "碼（長度單位，約91.4公分）",
    "reason": "Unit of length"
  },
  "yard%1:06:02::": {
    "meaningZhTW": "院子；庭院",
    "reason": "Grounds around house"
  },
  "yard%1:15:00::": {
    "meaningZhTW": "專用場地；車場",
    "reason": "Enclosed work area"
  },
  "attack%1:04:04::": {
    "meaningZhTW": "進攻；攻勢",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "attack%1:10:00::": {
    "meaningZhTW": "抨擊；猛烈批評",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bag%1:06:00::": {
    "meaningZhTW": "袋子；提袋",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bag%1:23:01::": {
    "meaningZhTW": "獵獲量",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bag%1:06:03::": {
    "meaningZhTW": "壘包",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "ball%1:06:01::": {
    "meaningZhTW": "球（運動用）",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "ball%1:06:03::": {
    "meaningZhTW": "彈丸；槍彈",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "ball%1:25:00::": {
    "meaningZhTW": "球體；球狀物",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bank%1:14:00::": {
    "meaningZhTW": "銀行",
    "reason": "User-reviewed first30 (APPROVE): Approved in CSV review"
  },
  "bank%1:17:00::": {
    "meaningZhTW": "土堤；長堆",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bank%2:38:00::": {
    "meaningZhTW": "側傾；傾斜轉彎",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bank%2:35:00::": {
    "meaningZhTW": "築堤圍住",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "black%1:07:00::": {
    "meaningZhTW": "黑色",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "black%1:26:00::": {
    "meaningZhTW": "黑暗；漆黑",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "black%1:06:01::": {
    "meaningZhTW": "黑色棋子",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "book%2:31:00::": {
    "meaningZhTW": "聘請表演者；安排演出",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "book%2:41:01::": {
    "meaningZhTW": "預訂；預約",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "book%2:41:00::": {
    "meaningZhTW": "（警方）登記指控；記錄案情",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bread%1:13:00::": {
    "meaningZhTW": "麵包",
    "reason": "User-reviewed first30 (APPROVE): Approved in CSV review"
  },
  "bread%1:21:00::": {
    "meaningZhTW": "錢；鈔票（俚語）",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bus%1:06:00::": {
    "meaningZhTW": "公車；巴士",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bus%1:09:00::": {
    "meaningZhTW": "匯流排型網路拓樸",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "bus%1:06:02::": {
    "meaningZhTW": "匯流排；母線（電路）",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "business%1:14:00::": {
    "meaningZhTW": "企業；公司",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "business%1:04:01::": {
    "meaningZhTW": "商業活動；生意",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "business%1:04:00::": {
    "meaningZhTW": "本業；職業",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "buy%2:40:00::": {
    "meaningZhTW": "買；購買",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "buy%2:40:02::": {
    "meaningZhTW": "收買；賄賂",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "buy%2:42:00::": {
    "meaningZhTW": "能買到；足以購買",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "car%1:06:00::": {
    "meaningZhTW": "汽車；轎車",
    "reason": "User-reviewed first30 (APPROVE): Approved in CSV review"
  },
  "car%1:06:01::": {
    "meaningZhTW": "鐵路車輛；車廂",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "car%1:06:03::": {
    "meaningZhTW": "飛船吊艙",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "card%1:06:00::": {
    "meaningZhTW": "紙牌；撲克牌",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "card%1:10:01::": {
    "meaningZhTW": "身分證件；識別卡",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "card%1:10:00::": {
    "meaningZhTW": "賀卡；明信片",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "case%1:11:00::": {
    "meaningZhTW": "事例；個案",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "case%1:26:00::": {
    "meaningZhTW": "情況；狀況",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "case%1:04:00::": {
    "meaningZhTW": "訴訟案件；官司",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "check%1:21:00::": {
    "meaningZhTW": "支票",
    "reason": "User-reviewed first30 (APPROVE): Approved in CSV review"
  },
  "check%1:09:00::": {
    "meaningZhTW": "檢查；評估",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "check%1:10:00::": {
    "meaningZhTW": "（餐廳）帳單",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "close%3:00:01::": {
    "meaningZhTW": "接近的；相近的",
    "reason": "User-reviewed first30 (KEEP_MERGED): Approved in CSV review"
  },
  "close%3:00:02::": {
    "meaningZhTW": "密切相關的；關係密切的",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "close%3:00:05::": {
    "meaningZhTW": "接近的；相近的",
    "reason": "User-reviewed first30 (KEEP_MERGED): Approved in CSV review"
  },
  "close%4:02:01::": {
    "meaningZhTW": "靠近地；接近地",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "close%4:02:02::": {
    "meaningZhTW": "仔細地；專注地",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "copy%1:10:00::": {
    "meaningZhTW": "（文件）副本；影本",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "copy%1:06:00::": {
    "meaningZhTW": "複製品；仿製品",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "copy%1:10:01::": {
    "meaningZhTW": "待印文稿；稿件",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "cost%1:21:00::": {
    "meaningZhTW": "成本；花費",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "cost%1:07:00::": {
    "meaningZhTW": "價格；金錢價值",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "cost%1:07:01::": {
    "meaningZhTW": "代價；犧牲",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "dear%5:00:00:loved:00": {
    "meaningZhTW": "深愛的；心愛的",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "dear%5:00:00:close:02": {
    "meaningZhTW": "親密的；關係密切的",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "dear%5:00:00:sincere:00": {
    "meaningZhTW": "真誠的；懇切的",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "doctor%1:18:00::": {
    "meaningZhTW": "醫師；醫生",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "doctor%1:04:00::": {
    "meaningZhTW": "扮醫生遊戲",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "dollar%1:23:00::": {
    "meaningZhTW": "元（貨幣單位）",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "dollar%1:21:00::": {
    "meaningZhTW": "一元紙鈔",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "dollar%1:21:01::": {
    "meaningZhTW": "美國一元硬幣",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "enjoyment%1:12:00::": {
    "meaningZhTW": "愉悅感；快樂",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "enjoyment%1:04:00::": {
    "meaningZhTW": "享受；享樂",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "enjoyment%1:07:00::": {
    "meaningZhTW": "（法律）享有財產權益",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "fan%1:06:00::": {
    "meaningZhTW": "風扇；電扇",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "fan%1:18:01::": {
    "meaningZhTW": "球迷；運動迷",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "fan%1:18:00::": {
    "meaningZhTW": "粉絲；愛好者",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "file%2:32:02::": {
    "meaningZhTW": "（向機關）提交；登記",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "file%2:35:00::": {
    "meaningZhTW": "用銼刀磨平；銼平",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "file%2:38:00::": {
    "meaningZhTW": "列隊行進；魚貫前進",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "game%1:04:00::": {
    "meaningZhTW": "競賽；比賽",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "game%1:04:03::": {
    "meaningZhTW": "一場比賽；一局",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "game%1:04:01::": {
    "meaningZhTW": "遊戲；消遣活動",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "gate%1:06:00::": {
    "meaningZhTW": "大門；閘門",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "gate%1:06:01::": {
    "meaningZhTW": "邏輯閘",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "gate%1:21:00::": {
    "meaningZhTW": "入場收入；門票收入",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "ghost%1:09:00::": {
    "meaningZhTW": "揮之不去的回憶；心中陰影",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "ghost%1:18:01::": {
    "meaningZhTW": "代筆者；捉刀人",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "ghost%1:18:00::": {
    "meaningZhTW": "鬼魂；幽靈",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "grass%1:20:00::": {
    "meaningZhTW": "草；草坪",
    "reason": "User-reviewed first30 (APPROVE): Approved in CSV review"
  },
  "grass%1:18:01::": {
    "meaningZhTW": "線人；告密者（俚語）",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "grass%1:13:00::": {
    "meaningZhTW": "草料；粗飼料",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "half%1:23:00::": {
    "meaningZhTW": "一半；二分之一",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "half%1:28:00::": {
    "meaningZhTW": "（比賽／演出）半場；半段",
    "reason": "User-reviewed first30 (REVISE): Approved in CSV review"
  },
  "file%1:10:00::": {
    "meaningZhTW": "檔案；資料檔",
    "reason": "Noun: set of related records kept together (documents/data)"
  },
  "file%1:14:00::": {
    "meaningZhTW": "縱隊；隊列",
    "reason": "Noun: line of persons or things ranged one behind another"
  },
  "file%1:06:01::": {
    "meaningZhTW": "文件櫃；檔案櫃",
    "reason": "Noun: office furniture for keeping papers in order"
  },
  "close%2:35:00::": {
    "meaningZhTW": "關閉；合上",
    "reason": "Verb: move so that an opening is obstructed; make shut (removed adjective '靠近的')"
  },
  "fan%2:35:01::": {
    "meaningZhTW": "三振（打者）",
    "reason": "Verb (baseball): strike out a batter"
  },
  "fan%2:30:00::": {
    "meaningZhTW": "煽動；激起",
    "reason": "Verb: make an emotion fiercer"
  },
  "fan%2:38:00::": {
    "meaningZhTW": "扇風；搖扇",
    "reason": "Verb: agitate the air"
  },
  "bridge%1:06:00::": {
    "meaningZhTW": "橋；橋梁",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。供人車跨越障礙的實體橋。"
  },
  "bridge%1:06:05::": {
    "meaningZhTW": "電橋（電路）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指電路中的橋式量測配置，非實體橋。"
  },
  "bridge%1:24:00::": {
    "meaningZhTW": "橋狀物；連接物",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指外形或功能類似橋的事物。"
  },
  "dig%1:15:00::": {
    "meaningZhTW": "考古發掘地；遺址挖掘現場",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。原建議「住處」與英文定義不符。"
  },
  "dig%1:10:00::": {
    "meaningZhTW": "挖苦；嘲諷",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。指針對他人的尖銳言語。"
  },
  "dig%1:07:00::": {
    "meaningZhTW": "小凹痕；刮痕",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指物體表面的淺凹痕。"
  },
  "hear%2:39:00::": {
    "meaningZhTW": "聽見；聽到",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。聽覺感知。"
  },
  "hear%2:31:00::": {
    "meaningZhTW": "聽說；得知",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。透過消息獲得資訊，與聽覺感知不同。"
  },
  "hear%2:41:00::": {
    "meaningZhTW": "審理（案件）；聽取（證據）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。法律程序中的 hear。"
  },
  "heavy%3:00:01::": {
    "meaningZhTW": "重的；沉重的",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。物理重量或密度大。"
  },
  "heavy%3:00:03::": {
    "meaningZhTW": "大量的；程度高的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指數量或程度，不是物體重量。"
  },
  "heavy%3:00:04::": {
    "meaningZhTW": "重型的（軍事或工業設備）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指使用大型重裝備。"
  },
  "here%4:02:00::": {
    "meaningZhTW": "在這裡；於此地",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。靜態位置，不是移動方向。"
  },
  "here%4:02:02::": {
    "meaningZhTW": "在這方面；就這一點而言",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。原建議「此時」與英文定義不符。"
  },
  "here%4:02:01::": {
    "meaningZhTW": "到這裡；往這邊",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。朝說話者所在處移動。"
  },
  "high%3:00:02::": {
    "meaningZhTW": "高的；大量的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。數量或金額高於正常值，不是高級。"
  },
  "high%3:00:01::": {
    "meaningZhTW": "高的；高聳的",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。物理高度較高。"
  },
  "high%5:00:00:superior:01": {
    "meaningZhTW": "優秀的；地位高的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。品質或地位較高。"
  },
  "hill%1:17:00::": {
    "meaningZhTW": "小山；丘陵",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。自然形成的地形。"
  },
  "hill%1:06:01::": {
    "meaningZhTW": "土丘；人工土堆",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。人工堆起的土石結構。"
  },
  "hill%1:06:00::": {
    "meaningZhTW": "投手丘",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。棒球場投手站立的土丘。"
  },
  "horse%1:05:00::": {
    "meaningZhTW": "馬",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。動物。"
  },
  "horse%1:06:03::": {
    "meaningZhTW": "鞍馬（體操器械）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。不是晾衣架；指有支腳的軟墊體操器材。"
  },
  "horse%1:14:00::": {
    "meaningZhTW": "騎兵",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指騎馬作戰的部隊。"
  },
  "hurt%1:26:00::": {
    "meaningZhTW": "身體傷害；損傷",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。身體受傷的狀態。"
  },
  "hurt%1:12:02::": {
    "meaningZhTW": "心理痛苦；精神傷害",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。偏重心理層面的痛苦。"
  },
  "hurt%1:12:01::": {
    "meaningZhTW": "痛苦；傷痛",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。可包含心理或生理感受，與具體身體損傷分開。"
  },
  "in%5:00:00:successful:00": {
    "meaningZhTW": "在任的；執政的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。holding office 表示擔任職位。"
  },
  "in%5:00:00:incoming:00": {
    "meaningZhTW": "向內的；進入的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。朝向內部，不是時間介系詞用法。"
  },
  "in%5:00:00:fashionable:00": {
    "meaningZhTW": "流行的；時髦的",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。流行趨勢。"
  },
  "jump%2:38:00::": {
    "meaningZhTW": "跳躍前進；蹦跳",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。向前連續跳躍。"
  },
  "jump%2:38:04::": {
    "meaningZhTW": "驚跳；突然跳起",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。因驚嚇或意外而突然跳動。"
  },
  "jump%2:33:00::": {
    "meaningZhTW": "突襲；突然攻擊",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。不是一般跳躍動作。"
  },
  "kick%1:04:00::": {
    "meaningZhTW": "踢；踢擊",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。用腳踢的動作。"
  },
  "kick%1:12:00::": {
    "meaningZhTW": "刺激感；興奮感",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。突然釋放的情緒力量。"
  },
  "kick%1:11:00::": {
    "meaningZhTW": "後座力；反衝",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。槍枝射擊時的後座力。"
  },
  "kill%2:35:00::": {
    "meaningZhTW": "殺死；致死",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。造成生命終止。"
  },
  "kill%2:41:01::": {
    "meaningZhTW": "阻撓（法案）通過；否決",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。阻止法案等通過。"
  },
  "kill%2:30:08::": {
    "meaningZhTW": "強行終止；壓制",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。以強力手段終止某事，與致死不同。"
  },
  "kill%1:04:00::": {
    "meaningZhTW": "殺害；殺戮",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。使生命終止的行為。"
  },
  "kill%1:04:01::": {
    "meaningZhTW": "擊毀（敵方目標）；戰果",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。軍事語境下摧毀敵方飛機等。"
  },
  "kill%1:05:00::": {
    "meaningZhTW": "獵獲物；被殺死的動物",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。指獵殺後的動物屍體。"
  },
  "knife%1:06:00::": {
    "meaningZhTW": "刀；小刀",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。一般切割工具。"
  },
  "knife%1:06:01::": {
    "meaningZhTW": "刀具；短刀（武器）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。作為武器的尖刀；原建議機械刀片不符。"
  },
  "knife%1:25:00::": {
    "meaningZhTW": "刀狀突出物；薄刃狀突起",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。英語定義為短暫的細長突出物；具體用例待原始語境確認。"
  },
  "know%2:31:01::": {
    "meaningZhTW": "知道；知悉",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。知道特定事實或資訊。"
  },
  "know%2:31:03::": {
    "meaningZhTW": "懂得；會（做某事）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。具備做某事的方法或技能。"
  },
  "know%2:31:00::": {
    "meaningZhTW": "認識；熟悉",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。熟識人或事物。"
  },
  "learn%2:31:00::": {
    "meaningZhTW": "學習；學會",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。獲得知識或技能。"
  },
  "learn%2:31:01::": {
    "meaningZhTW": "得知；獲悉",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。得知消息，非學習技能。"
  },
  "learn%2:31:03::": {
    "meaningZhTW": "背熟；記住",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。透過記憶學會。"
  },
  "left%3:00:00::": {
    "meaningZhTW": "左邊的；左側的",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。位置或方向在左側。"
  },
  "left%5:00:00:unexhausted:00": {
    "meaningZhTW": "剩下的；剩餘的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指尚未用完。"
  },
  "left%5:00:00:left-handed:00": {
    "meaningZhTW": "左手用的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。專為左手設計。"
  },
  "left%1:15:00::": {
    "meaningZhTW": "左邊；左側",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。位置或方向。"
  },
  "left%1:14:00::": {
    "meaningZhTW": "左派；左翼",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。一般政治詞彙的詞典意義，不做評價。"
  },
  "left%1:08:00::": {
    "meaningZhTW": "左手",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。身體部位。"
  },
  "lesson%1:04:01::": {
    "meaningZhTW": "一堂課；課程單元",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。教學單元。"
  },
  "lesson%1:10:00::": {
    "meaningZhTW": "教訓；懲戒",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。作為警告的懲罰。"
  },
  "lesson%1:10:01::": {
    "meaningZhTW": "教訓；啟示",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。故事或事件所傳達的意義。"
  },
  "light%3:00:01::": {
    "meaningZhTW": "輕的；重量輕的",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。物理重量或密度小。"
  },
  "light%3:00:05::": {
    "meaningZhTW": "淺色的；顏色淡的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。原建議光不符；指顏色淡。"
  },
  "light%3:00:04::": {
    "meaningZhTW": "輕型的（軍事或工業設備）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。原建議淺色不符；指輕型裝備。"
  },
  "look%2:39:00::": {
    "meaningZhTW": "看；注視",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。視線指向某物。"
  },
  "look%2:39:01::": {
    "meaningZhTW": "看起來；顯得",
    "reason": "User-reviewed batch2 (KEEP_MERGED): AI 校訂草稿，待使用者確認。與下一個 appearance sense 在一般學習中文可用相同詞義。"
  },
  "look%2:29:00::": {
    "meaningZhTW": "看起來；顯得",
    "reason": "User-reviewed batch2 (KEEP_MERGED): AI 校訂草稿，待使用者確認。與上一個 impression sense 同義顯示，保留個別 sense ID。"
  },
  "look%1:07:01::": {
    "meaningZhTW": "神情；表情",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指臉上的情緒表現。"
  },
  "look%1:04:00::": {
    "meaningZhTW": "看；一瞥",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。看向某物的行為。"
  },
  "look%1:07:00::": {
    "meaningZhTW": "外貌；外觀",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。人的或事物的外表。"
  },
  "love%1:12:00::": {
    "meaningZhTW": "愛；深厚的感情",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。強烈的喜愛與關愛情感。"
  },
  "love%1:09:00::": {
    "meaningZhTW": "鍾愛之物；心愛的事物",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指所喜愛的對象或物件。"
  },
  "love%1:18:00::": {
    "meaningZhTW": "愛人；心上人",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。指被愛的人。"
  },
  "low%3:00:02::": {
    "meaningZhTW": "低的；程度低的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。程度、強度或數量低於正常。"
  },
  "low%3:00:01::": {
    "meaningZhTW": "低的；矮的",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。物理高度較低。"
  },
  "low%5:00:00:soft:04": {
    "meaningZhTW": "音量小的；低聲的",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指音量，不是「低點」。"
  },
  "milk%1:13:01::": {
    "meaningZhTW": "奶；乳（供食用）",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。哺乳動物分泌且供人飲用的乳液，非植物乳。"
  },
  "milk%1:08:00::": {
    "meaningZhTW": "乳汁；母乳",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。哺乳動物乳腺分泌、用以哺育幼體。"
  },
  "milk%1:13:02::": {
    "meaningZhTW": "植物奶；乳狀營養液",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。泛指其他有營養的乳狀液體。"
  },
  "mind%1:09:00::": {
    "meaningZhTW": "心智；頭腦",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。思考、感受及意識的能力或所在。"
  },
  "mind%1:09:01::": {
    "meaningZhTW": "記憶；回憶",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指記憶或想起的內容。"
  },
  "mind%1:09:04::": {
    "meaningZhTW": "看法；意見",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。經判斷形成的觀點。"
  },
  "need%1:26:00::": {
    "meaningZhTW": "需要；需求",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。需要得到滿足的狀況。"
  },
  "need%1:17:00::": {
    "meaningZhTW": "必需品；欠缺之物",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指必要卻缺乏的事物。"
  },
  "need%1:03:00::": {
    "meaningZhTW": "需求；動機",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。驅動行為的心理需求。"
  },
  "night%1:28:00::": {
    "meaningZhTW": "夜晚；夜間",
    "reason": "User-reviewed batch2 (APPROVE): AI 校訂草稿，待使用者確認。日落後至日出前的黑暗時段。"
  },
  "night%1:28:01::": {
    "meaningZhTW": "黑暗時期；蒙昧時代",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。比喻無知、落後或陰鬱的時期；原建議晚上活動時間不符。"
  },
  "night%1:28:04::": {
    "meaningZhTW": "睡眠時間；夜間休息時段",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指睡眠所花的時段。"
  },
  "north%1:24:00::": {
    "meaningZhTW": "正北；北方",
    "reason": "User-reviewed batch2 (KEEP_MERGED): AI 校訂草稿，待使用者確認。與第三個方向 sense 可共用北方表述，需保留來源 ID。"
  },
  "north%1:15:00::": {
    "meaningZhTW": "北部；北方地區",
    "reason": "User-reviewed batch2 (REVISE): AI 校訂草稿，待使用者確認。指地理區域，不是純粹方向。"
  },
  "north%1:24:02::": {
    "meaningZhTW": "正北；北方",
    "reason": "User-reviewed batch2 (KEEP_MERGED): AI 校訂草稿，待使用者確認。與第一個羅盤方向 sense 語義相近，可合併顯示。"
  },
  "nose%1:08:00::": {
    "meaningZhTW": "鼻子",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：嗅覺器官；與飛機或工具的前端義分開。"
  },
  "nose%1:06:00::": {
    "meaningZhTW": "機鼻；（飛機等的）前端",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文特指外形像鼻子的前端，尤其是飛機的機鼻。"
  },
  "nose%1:06:02::": {
    "meaningZhTW": "（工具或武器的）前端；凸出部",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指工具或武器向前伸出的部位，並非「嗅覺」。"
  },
  "nurse%2:29:00::": {
    "meaningZhTW": "悉心護理（疾病或傷勢）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指透過特別照護來治療傷病。"
  },
  "nurse%2:37:00::": {
    "meaningZhTW": "心懷；長久抱持（想法或情感）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指維持某種想法或感情，不是哺乳。"
  },
  "nurse%2:41:00::": {
    "meaningZhTW": "擔任護理師；照護病患",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指從事護理工作，與針對傷病的悉心照護有語意側重差異。"
  },
  "on%4:02:00::": {
    "meaningZhTW": "向前；往前",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指向前移動；不等同表示持續的副詞用法。"
  },
  "on%4:02:01::": {
    "meaningZhTW": "持續地；不停地",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文表示連續、堅持或持續專注，不是穿戴。"
  },
  "on%4:02:02::": {
    "meaningZhTW": "開著；運作中",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：表示設備處於可運作或有效狀態。"
  },
  "open%3:00:01::": {
    "meaningZhTW": "開著的；敞開的",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：指門口等未關閉，可進出。"
  },
  "open%3:00:02::": {
    "meaningZhTW": "可通行的；可進入的",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：強調可自由通行或進入，與單純「未關閉」的形態不同。"
  },
  "open%5:00:00:unprotected:00": {
    "meaningZhTW": "無遮蔽的；未受保護的",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：強調缺乏遮蔽或防護，不限定「露天」。"
  },
  "order%1:10:03::": {
    "meaningZhTW": "命令；指示",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：上級要求遵守的命令，可能以複數 orders 出現。"
  },
  "order%1:07:01::": {
    "meaningZhTW": "數量級；程度",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指大小或數量連續範圍中的級別，不是排列順序。"
  },
  "order%1:26:00::": {
    "meaningZhTW": "社會秩序；既定秩序",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指已確立的慣常社會狀態，不是訂單。"
  },
  "pass%1:04:04::": {
    "meaningZhTW": "四壞球保送",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：棒球打者得到四個壞球而被保送上一壘。"
  },
  "pass%1:28:00::": {
    "meaningZhTW": "（軍人）休假證；准假證",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指軍方核發的書面准假證明，不是體育傳球。"
  },
  "pass%1:04:02::": {
    "meaningZhTW": "（美式足球）傳球進攻",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指以傳球方式展開的美式足球進攻，不是山口。"
  },
  "pay%2:40:00::": {
    "meaningZhTW": "付款；支付",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：以金錢換取商品或服務。"
  },
  "pay%2:32:00::": {
    "meaningZhTW": "致以；給予（敬意、稱讚等）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：例如 pay a compliment / pay attention；不是付出代價。"
  },
  "pay%2:40:04::": {
    "meaningZhTW": "償還；清償（債務）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文特指還清債務，不是泛指支付薪資或利息。"
  },
  "plant%1:06:01::": {
    "meaningZhTW": "工廠；廠房",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文是從事工業生產的建築設施，不是生物植物。"
  },
  "plant%1:03:00::": {
    "meaningZhTW": "植物",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文是植物學意義的生物，原始建議與工廠義對調。"
  },
  "plant%1:18:00::": {
    "meaningZhTW": "安插在觀眾席的演員；暗樁",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指預先安排、假裝自然反應的觀眾席演員，不一定是臥底。"
  },
  "pool%2:40:00::": {
    "meaningZhTW": "集資；合併（資金或資源）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指匯集為共同基金；可泛指集中資源。"
  },
  "pool%2:33:00::": {
    "meaningZhTW": "集結人員；組成人力庫",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指集合或組成一群人，並非打撞球。"
  },
  "pot%1:06:00::": {
    "meaningZhTW": "鍋子；深鍋",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：烹煮用的深鍋。"
  },
  "pot%1:06:01::": {
    "meaningZhTW": "馬桶；便器",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指供排便、排尿的衛浴設備，不是花盆。"
  },
  "pot%1:23:00::": {
    "meaningZhTW": "一鍋的量",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：指鍋內所盛裝的數量。"
  },
  "practice%1:04:00::": {
    "meaningZhTW": "慣例；慣常做法",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指慣常的行為或運作方式，不是反覆練習。"
  },
  "practice%1:04:02::": {
    "meaningZhTW": "練習；反覆訓練",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指藉多次重複進行系統性訓練。"
  },
  "practice%1:04:04::": {
    "meaningZhTW": "實踐；付諸實行",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：將想法化為行動，並非此 sense 的專業執業義。"
  },
  "pull%2:35:00::": {
    "meaningZhTW": "拉；拖",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：以拉力使物體移動；不必將所有不同動作硬寫在同一項。"
  },
  "pull%2:35:02::": {
    "meaningZhTW": "吸引；引起（注意或興趣）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：靠心理或物理特性吸引對象，不是划槳。"
  },
  "pull%2:38:01::": {
    "meaningZhTW": "朝某方向移動；駛向",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指向特定方向移動，例如車輛駛近，不是拉傷。"
  },
  "pull%1:04:00::": {
    "meaningZhTW": "拉；拖（動作）",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：施力將物體拉近或帶動的行為。"
  },
  "pull%1:19:00::": {
    "meaningZhTW": "拉力；牽引力",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：物理上的拉動力量，不專指吸引力。"
  },
  "pull%1:07:00::": {
    "meaningZhTW": "影響力；門路",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：口語中指特殊影響力或有利關係。"
  },
  "race%2:38:00::": {
    "meaningZhTW": "飛奔；疾馳",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指快速移動，不一定在參加競賽。"
  },
  "race%2:33:00::": {
    "meaningZhTW": "賽跑；競速",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指實際參加競賽；原建議和上一項對調。"
  },
  "race%2:41:03::": {
    "meaningZhTW": "爭分奪秒；全速朝目標努力",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：快速朝目標工作，可能與他人競爭，不是心臟或引擎跳動。"
  },
  "raise%1:07:00::": {
    "meaningZhTW": "加薪；加薪幅度",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指薪資增加的額度。"
  },
  "raise%1:17:00::": {
    "meaningZhTW": "上坡；坡度",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指道路等向上的斜坡或坡度，不一定是高地。"
  },
  "raise%1:04:01::": {
    "meaningZhTW": "加注；提高賭注",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文是撲克牌遊戲中增加下注金額的動作。"
  },
  "reach%2:38:01::": {
    "meaningZhTW": "到達；抵達",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：抵達實際或抽象的目的地。"
  },
  "reach%2:38:00::": {
    "meaningZhTW": "達到（某時間、狀態或程度）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指時間、狀態或程度的到達，不是伸出手。"
  },
  "reach%2:35:00::": {
    "meaningZhTW": "伸手觸及；伸向",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：向前或向上伸出以碰觸，也可作比喻。"
  },
  "report%1:10:03::": {
    "meaningZhTW": "書面報告；調查報告",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：個人或團體研究發現的書面文件。"
  },
  "report%1:10:01::": {
    "meaningZhTW": "口頭報告；口頭通報",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指口頭告知的行為，並非傳聞。"
  },
  "report%1:10:00::": {
    "meaningZhTW": "簡短新聞報導；消息簡報",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指簡短的新聞敘述，並非槍炮爆裂聲。"
  },
  "right%3:00:00::": {
    "meaningZhTW": "右邊的；右側的",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：以面朝北方時身體東側為右的方向。"
  },
  "right%3:00:02::": {
    "meaningZhTW": "正確的；無誤的",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：符合事實或真相。"
  },
  "right%5:00:01:proper:00": {
    "meaningZhTW": "得體的；合乎禮節的",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指符合社會禮儀或行為規範。"
  },
  "rise%1:11:00::": {
    "meaningZhTW": "增長；提升（力量、數量或重要性）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：抽象或數量上的增長，不是空間位置的上升。"
  },
  "rise%1:04:00::": {
    "meaningZhTW": "上升；升起（動作）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：實際向上移動的動作，與勢力／數量增長分開。"
  },
  "rise%1:17:00::": {
    "meaningZhTW": "上坡；坡度",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：地形或道路向上傾斜的部分，不一定是小丘。"
  },
  "rise%2:38:00::": {
    "meaningZhTW": "上升；升起",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指向上移動；不含「站起來」的專指義。"
  },
  "rise%2:30:00::": {
    "meaningZhTW": "上漲；增加（數值或程度）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指數值或程度上升。"
  },
  "rise%2:38:05::": {
    "meaningZhTW": "站起來；起身",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文是 rise to one's feet，並非日月升起。"
  },
  "roll%1:11:02::": {
    "meaningZhTW": "滾動；繞軸旋轉",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：物體繞本身軸線的旋轉。"
  },
  "roll%1:10:00::": {
    "meaningZhTW": "名冊；名單",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：例如點名冊、成員名單。"
  },
  "roll%1:11:01::": {
    "meaningZhTW": "湧向岸邊的巨浪；滾滾波浪",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指向海岸推進的大浪，不是小麵包。"
  },
  "round%1:06:01::": {
    "meaningZhTW": "一發（彈藥）；一發子彈",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指供單次射擊的一份彈藥。"
  },
  "round%1:28:01::": {
    "meaningZhTW": "一輪；一回合（週期）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指一連串重複事件的一個週期。"
  },
  "round%1:15:00::": {
    "meaningZhTW": "巡邏路線；巡邏區",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指警察或哨兵固定巡查的路線。"
  },
  "service%1:04:08::": {
    "meaningZhTW": "服務；協助",
    "reason": "User-reviewed batch3 (KEEP_MERGED): 校訂建議（待使用者核准）：提供有益他人的服務性工作；與下一項在一般學習層級屬同一服務概念。"
  },
  "service%1:04:00::": {
    "meaningZhTW": "服務；協助",
    "reason": "User-reviewed batch3 (KEEP_MERGED): 校訂建議（待使用者核准）：提供幫助或支援，也可指用於支援的工具；一般服務義與上一項保留合併。"
  },
  "service%1:04:01::": {
    "meaningZhTW": "宗教禮拜；禮拜儀式",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文特指按照宗教規範舉行的公共禮拜。"
  },
  "share%1:21:00::": {
    "meaningZhTW": "份額；分得的部分",
    "reason": "User-reviewed batch3 (KEEP_MERGED): 校訂建議（待使用者核准）：個人或團體應有、出資或分得的資產份額；與一般分得份額義合併。"
  },
  "share%1:21:01::": {
    "meaningZhTW": "股份；股票",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：公司股本等分的一份，具股票持有意義。"
  },
  "share%1:04:00::": {
    "meaningZhTW": "份額；分得的部分",
    "reason": "User-reviewed batch3 (KEEP_MERGED): 校訂建議（待使用者核准）：分配所得的部分；與應有份額在一般學習層級屬同一概念。"
  },
  "sick%3:00:01::": {
    "meaningZhTW": "生病的；身體不適的",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：指正常身心功能受到疾病或障礙影響，與「想吐」的特定感受分開。"
  },
  "sick%5:00:02:ill:01": {
    "meaningZhTW": "想吐的；噁心的",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文特指噁心欲吐。"
  },
  "sick%5:00:00:insane:00": {
    "meaningZhTW": "精神失常的；精神錯亂的（舊式用法）",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指精神失常，不能譯成「變態」；此用法可能帶貶義。"
  },
  "sight%2:39:00::": {
    "meaningZhTW": "看見；發現",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指用眼睛發現或看到。"
  },
  "sight%2:39:03::": {
    "meaningZhTW": "（透過瞄準器）瞄準",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指透過槍械或其他設備瞄準器取準。"
  },
  "soldier%1:18:00::": {
    "meaningZhTW": "士兵；軍人",
    "reason": "User-reviewed batch3 (APPROVE): 校訂建議（待使用者核准）：軍隊服役的人員。"
  },
  "soldier%1:05:00::": {
    "meaningZhTW": "兵蟻；兵白蟻",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：昆蟲學中防禦蟻巢／白蟻群的無翅兵型個體，不是兵蜂。"
  },
  "south%1:24:00::": {
    "meaningZhTW": "正南；南方（方位）",
    "reason": "User-reviewed batch3 (KEEP_MERGED): 校訂建議（待使用者核准）：指指南針 180 度正南方向；與下方方位詞義合併。"
  },
  "south%1:15:02::": {
    "meaningZhTW": "南部；南方地區",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指國家、地區或城市南部的地理區域。"
  },
  "south%1:24:02::": {
    "meaningZhTW": "正南；南方（方位）",
    "reason": "User-reviewed batch3 (KEEP_MERGED): 校訂建議（待使用者核准）：指朝南方位，與 compass point 屬同一基本方位概念。"
  },
  "spring%2:38:01::": {
    "meaningZhTW": "跳躍前進；躍進",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文是連續跳躍向前移動，不是春天名詞。"
  },
  "spring%2:42:00::": {
    "meaningZhTW": "產生；形成；發展成",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指逐漸發展成有特色的事物，非季節春天。"
  },
  "spring%2:38:00::": {
    "meaningZhTW": "彈回；彈開",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指受到撞擊後彈開或反彈。"
  },
  "square%1:25:00::": {
    "meaningZhTW": "正方形",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：四邊等長、四角皆直角的平面圖形。"
  },
  "square%1:23:00::": {
    "meaningZhTW": "平方；平方值",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：兩個相同數相乘的乘積，不是平面圖形。"
  },
  "square%1:15:00::": {
    "meaningZhTW": "廣場；街口廣場",
    "reason": "User-reviewed batch3 (REVISE): 校訂建議（待使用者核准）：英文指兩條以上街道交會處的開放空間。"
  },
  "fly%2:38:00::": {
    "meaningZhTW": "飛行；飛翔",
    "reason": "User-reviewed final batch (REVISE): 在空中飛行。"
  },
  "fly%2:38:02::": {
    "meaningZhTW": "飛馳；疾行",
    "reason": "User-reviewed final batch (REVISE): 快速或突然移動，不限於空中。"
  },
  "fly%2:38:01::": {
    "meaningZhTW": "駕駛飛機",
    "reason": "User-reviewed final batch (REVISE): 操作飛機，與一般飛行動作不同。"
  },
  "pass%2:38:00::": {
    "meaningZhTW": "穿過；通過",
    "reason": "User-reviewed final batch (REVISE): 穿越某處或穿過障礙。"
  },
  "pass%2:38:05::": {
    "meaningZhTW": "經過；路過",
    "reason": "User-reviewed final batch (REVISE): 從旁經過，不一定穿越。"
  },
  "pass%2:41:02::": {
    "meaningZhTW": "通過（法案、議案）",
    "reason": "User-reviewed final batch (REVISE): 立法語境；與空間移動不同。"
  },
  "push%2:38:00::": {
    "meaningZhTW": "用力推；推動",
    "reason": "User-reviewed final batch (REVISE): 施力使物體移動。"
  },
  "push%2:32:01::": {
    "meaningZhTW": "催促；逼迫",
    "reason": "User-reviewed final batch (REVISE): 促使人採取或完成行動。"
  },
  "push%2:32:00::": {
    "meaningZhTW": "推廣；推銷",
    "reason": "User-reviewed final batch (REVISE): 宣傳或試圖售出商品。"
  },
  "study%2:31:02::": {
    "meaningZhTW": "研究；深入分析",
    "reason": "User-reviewed final batch (REVISE): 深入分析以理解本質或意義。"
  },
  "study%2:31:03::": {
    "meaningZhTW": "就讀；求學",
    "reason": "User-reviewed final batch (REVISE): 在學校或課程中接受教育。"
  },
  "study%2:39:00::": {
    "meaningZhTW": "仔細考慮；審慎思考",
    "reason": "User-reviewed final batch (REVISE): 審慎思考某事，與就讀不同。"
  },
  "sugar%1:13:00::": {
    "meaningZhTW": "食糖；白糖",
    "reason": "User-reviewed final batch (REVISE): 用作甜味劑的食用糖。"
  },
  "sugar%1:27:00::": {
    "meaningZhTW": "醣類；碳水化合物",
    "reason": "User-reviewed final batch (REVISE): 生物化學中的糖類及相關碳水化合物。"
  },
  "sugar%1:21:00::": {
    "meaningZhTW": "錢；金錢（俚語）",
    "reason": "User-reviewed final batch (REVISE): 金錢的非正式用法。"
  },
  "sun%1:19:00::": {
    "meaningZhTW": "陽光；日照",
    "reason": "User-reviewed final batch (REVISE): 太陽發出的光線。"
  },
  "sun%1:18:00::": {
    "meaningZhTW": "（比喻）帶來溫暖或光彩的人",
    "reason": "User-reviewed final batch (REVISE): 比喻帶來活力、溫暖或榮耀的人。"
  },
  "sun%1:17:01::": {
    "meaningZhTW": "恆星（有行星環繞）",
    "reason": "User-reviewed final batch (REVISE): 泛指有行星系統環繞的恆星，不限太陽。"
  },
  "surprise%2:31:00::": {
    "meaningZhTW": "使驚訝；使吃驚",
    "reason": "User-reviewed final batch (REVISE): 使人感到意外。"
  },
  "surprise%2:41:00::": {
    "meaningZhTW": "出其不意地遇上；使措手不及",
    "reason": "User-reviewed final batch (REVISE): 使對方在毫無防備下遭遇，不必涉及攻擊。"
  },
  "surprise%2:33:00::": {
    "meaningZhTW": "突襲；奇襲",
    "reason": "User-reviewed final batch (REVISE): 特指突然發動攻擊。"
  },
  "table%1:14:00::": {
    "meaningZhTW": "表格；資料表",
    "reason": "User-reviewed final batch (REVISE): 列和欄組成的資料。"
  },
  "table%1:06:01::": {
    "meaningZhTW": "桌子；餐桌",
    "reason": "User-reviewed final batch (KEEP_MERGED): 與擺好餐具的餐桌共用核心物件義。"
  },
  "table%1:06:02::": {
    "meaningZhTW": "桌子；餐桌",
    "reason": "User-reviewed final batch (KEEP_MERGED): 擺好餐具只是餐桌的使用情境，不需重複顯示。"
  },
  "theater%1:06:00::": {
    "meaningZhTW": "劇院；戲院",
    "reason": "User-reviewed final batch (REVISE): 劇場或電影放映建築。"
  },
  "theater%1:10:00::": {
    "meaningZhTW": "戲劇藝術；劇作與製作",
    "reason": "User-reviewed final batch (REVISE): 創作及製作戲劇的藝術。"
  },
  "theater%1:15:00::": {
    "meaningZhTW": "戰區；軍事作戰區域",
    "reason": "User-reviewed final batch (REVISE): 軍事活動所在的區域。"
  },
  "then%4:02:00::": {
    "meaningZhTW": "然後；接著",
    "reason": "User-reviewed final batch (REVISE): 表示時間順序。"
  },
  "then%4:02:02::": {
    "meaningZhTW": "那麼；如此一來",
    "reason": "User-reviewed final batch (REVISE): 表示條件的結果。"
  },
  "then%4:02:01::": {
    "meaningZhTW": "當時；那時",
    "reason": "User-reviewed final batch (REVISE): 指某個過去或已提及的時間。"
  },
  "there%4:02:00::": {
    "meaningZhTW": "在那裡；在該處",
    "reason": "User-reviewed final batch (REVISE): 表示所在位置。"
  },
  "there%4:02:02::": {
    "meaningZhTW": "在那方面；就那一點而言",
    "reason": "User-reviewed final batch (REVISE): 表示某個議題或方面。"
  },
  "there%4:02:01::": {
    "meaningZhTW": "往那裡；向那邊",
    "reason": "User-reviewed final batch (REVISE): 表示前往的方向。"
  },
  "tip%1:15:00::": {
    "meaningZhTW": "尖端；末端",
    "reason": "User-reviewed final batch (REVISE): 物體最末端，通常是尖的。"
  },
  "tip%1:21:00::": {
    "meaningZhTW": "小費",
    "reason": "User-reviewed final batch (REVISE): 服務後額外給予的金錢。"
  },
  "tip%1:10:00::": {
    "meaningZhTW": "線索；內線消息",
    "reason": "User-reviewed final batch (REVISE): 暗示可能機會的資訊，非一般操作訣竅。"
  },
  "toilet%1:06:00::": {
    "meaningZhTW": "廁所；洗手間",
    "reason": "User-reviewed final batch (REVISE): 設有馬桶的場所。"
  },
  "toilet%1:06:01::": {
    "meaningZhTW": "馬桶；便器",
    "reason": "User-reviewed final batch (REVISE): 如廁用衛生設備。"
  },
  "tooth%1:08:00::": {
    "meaningZhTW": "牙齒",
    "reason": "User-reviewed final batch (REVISE): 脊椎動物口中的牙齒。"
  },
  "tooth%1:06:01::": {
    "meaningZhTW": "（梳子、鋸子等的）齒",
    "reason": "User-reviewed final batch (REVISE): 與動物牙齒外形相似的器物齒。"
  },
  "tooth%1:05:02::": {
    "meaningZhTW": "（無脊椎動物的）齒狀構造",
    "reason": "User-reviewed final batch (REVISE): 英文定義指無脊椎動物，不是齒輪。"
  },
  "train%2:31:01::": {
    "meaningZhTW": "訓練；培訓",
    "reason": "User-reviewed final batch (REVISE): 對別人施以訓練或教導。"
  },
  "train%2:31:00::": {
    "meaningZhTW": "接受訓練；受訓",
    "reason": "User-reviewed final batch (REVISE): 自己接受某種職業或技能的訓練。"
  },
  "train%2:41:02::": {
    "meaningZhTW": "管教；訓練（兒童或動物）",
    "reason": "User-reviewed final batch (REVISE): 培養兒童或動物的行為與自我控制。"
  },
  "treat%1:13:00::": {
    "meaningZhTW": "美食；特別的點心",
    "reason": "User-reviewed final batch (REVISE): 特別值得享用的食物。"
  },
  "treat%1:11:00::": {
    "meaningZhTW": "樂事；特別的享受",
    "reason": "User-reviewed final batch (REVISE): 帶來特別愉悅的事件，不必涉及款待。"
  },
  "treatment%1:04:00::": {
    "meaningZhTW": "治療；醫療照護",
    "reason": "User-reviewed final batch (REVISE): 改善病況的照護或醫療處置；此 Sense 屬 treatment，匯入時應檢查複合詞條對應。"
  },
  "visit%1:04:02::": {
    "meaningZhTW": "拜訪；參觀",
    "reason": "User-reviewed final batch (REVISE): 短時間前往探訪人或地方。"
  },
  "visit%1:14:00::": {
    "meaningZhTW": "就診；諮詢會面",
    "reason": "User-reviewed final batch (REVISE): 特指看醫師或律師等的約定會面。"
  },
  "visit%1:04:01::": {
    "meaningZhTW": "正式訪問；視察",
    "reason": "User-reviewed final batch (REVISE): 以公務身分進行的訪問或檢查。"
  },
  "well%3:00:01::": {
    "meaningZhTW": "健康的；康復的",
    "reason": "User-reviewed final batch (REVISE): 生病或受傷後處於健康狀態。"
  },
  "well%5:00:00:fortunate:00": {
    "meaningZhTW": "順利的；結果良好的",
    "reason": "User-reviewed final batch (REVISE): 指結果有利、順利。"
  },
  "well%5:00:00:advisable:00": {
    "meaningZhTW": "明智的；妥當的",
    "reason": "User-reviewed final batch (REVISE): 指有利或明智、值得採取。"
  }
  },
  2: {
  "accident%1:11:01::": {
    "meaningZhTW": "車禍；意外事故",
    "reason": "Unfortunate mishap causing damage or injury"
  },
  "accident%1:11:00::": {
    "meaningZhTW": "偶然事件；意外",
    "reason": "Event happening by chance"
  },
  "active%3:00:02::": {
    "meaningZhTW": "（病患/病情）活躍的",
    "reason": "Medical widening scope"
  },
  "active%5:00:00:operational:00": {
    "meaningZhTW": "（軍事）現役的",
    "reason": "Military naval operational state"
  },
  "active%3:00:03::": {
    "meaningZhTW": "積極的；活躍的",
    "reason": "Disposed to take action"
  },
  "adult%1:18:00::": {
    "meaningZhTW": "成年人",
    "reason": "Fully developed person"
  },
  "adult%1:05:00::": {
    "meaningZhTW": "成體；成年動物",
    "reason": "Mature animal"
  },
  "advance%1:11:00::": {
    "meaningZhTW": "前進；推進",
    "reason": "Movement forward"
  },
  "advance%1:11:01::": {
    "meaningZhTW": "進步；進展",
    "reason": "Progress in development"
  },
  "advance%1:10:00::": {
    "meaningZhTW": "提議；試探",
    "reason": "Tentative suggestion"
  },
  "advance%2:38:00::": {
    "meaningZhTW": "前進；向前移動",
    "reason": "Move forward verb"
  },
  "advance%2:32:00::": {
    "meaningZhTW": "提出（建議/看法）",
    "reason": "Bring forward for consideration"
  },
  "advance%2:41:01::": {
    "meaningZhTW": "促進；推動",
    "reason": "Contribute to progress"
  },
  "ahead%4:02:00::": {
    "meaningZhTW": "在前面；領先",
    "reason": "Front location"
  },
  "ahead%4:02:06::": {
    "meaningZhTW": "向將來；往前",
    "reason": "Toward the future"
  },
  "ahead%4:02:02::": {
    "meaningZhTW": "向前",
    "reason": "Forward direction"
  },
  "aim%2:33:00::": {
    "meaningZhTW": "瞄準；對準",
    "reason": "Point weapon or object"
  },
  "aim%2:31:01::": {
    "meaningZhTW": "意圖；旨在",
    "reason": "Propose or intend"
  },
  "aim%2:32:09::": {
    "meaningZhTW": "引導（話題/對話）",
    "reason": "Direction of discourse"
  },
  "alarm%1:12:00::": {
    "meaningZhTW": "驚恐；恐慌",
    "reason": "Fear of danger"
  },
  "alarm%1:06:00::": {
    "meaningZhTW": "警報器；鬧鐘",
    "reason": "Signaling device"
  },
  "alarm%1:10:00::": {
    "meaningZhTW": "警報聲；警告信號",
    "reason": "Warning sound"
  },
  "alarm%2:37:00::": {
    "meaningZhTW": "使驚恐；使不安",
    "reason": "Cause apprehension"
  },
  "alarm%2:32:00::": {
    "meaningZhTW": "發出警報；警告",
    "reason": "Warn of danger"
  },
  "amount%1:21:00::": {
    "meaningZhTW": "金額；款項",
    "reason": "Quantity of money"
  },
  "amount%1:07:00::": {
    "meaningZhTW": "數量；程度",
    "reason": "Relative magnitude"
  },
  "amount%1:03:00::": {
    "meaningZhTW": "總數；總量",
    "reason": "Quantifiable amount"
  },
  "enemy%1:14:00::": {
    "meaningZhTW": "敵軍；敵對部隊",
    "reason": "Opposing military force"
  },
  "enemy%1:18:00::": {
    "meaningZhTW": "敵人；敵手",
    "reason": "Armed adversary person"
  },
  "forward%3:00:01::": {
    "meaningZhTW": "向前的；前部的",
    "reason": "Front location adjective"
  },
  "forward%3:00:03::": {
    "meaningZhTW": "（車輛）前進檔的",
    "reason": "Motor vehicle transmission gear"
  }
}
};

function autoDifferentiateSense(eng, baseMeaning, index, total) {
  const norm = eng.toLowerCase();

  // Domain & Contextual indicators
  if (norm.includes('money') || norm.includes('financial') || norm.includes('cash') || norm.includes('cost') || norm.includes('fee')) {
    if (!baseMeaning.includes('金額') && !baseMeaning.includes('費用') && !baseMeaning.includes('款項') && !baseMeaning.includes('財經')) {
      return `${baseMeaning}（金額/款項）`;
    }
  }
  if (norm.includes('legal') || norm.includes('court') || norm.includes('statute') || norm.includes('law')) {
    return `${baseMeaning}（法律）`;
  }
  if (norm.includes('military') || norm.includes('war') || norm.includes('naval') || norm.includes('soldier') || norm.includes('weapon')) {
    return `${baseMeaning}（軍事）`;
  }
  if (norm.includes('medical') || norm.includes('disease') || norm.includes('symptom') || norm.includes('illness')) {
    return `${baseMeaning}（醫學）`;
  }
  if (norm.includes('music') || norm.includes('instrument') || norm.includes('sing') || norm.includes('song')) {
    return `${baseMeaning}（音樂）`;
  }
  if (norm.includes('sports') || norm.includes('game') || norm.includes('ball') || norm.includes('play')) {
    return `${baseMeaning}（體育）`;
  }
  if (norm.includes('vehicle') || norm.includes('car') || norm.includes('ship') || norm.includes('plane') || norm.includes('aircraft')) {
    return `${baseMeaning}（交通/載具）`;
  }
  if (norm.includes('mathematics') || norm.includes('geometry') || norm.includes('equation') || norm.includes('number')) {
    return `${baseMeaning}（數學）`;
  }
  if (norm.includes('device') || norm.includes('machine') || norm.includes('equipment') || norm.includes('tool')) {
    return `${baseMeaning}（設備/器具）`;
  }
  if (norm.includes('person') || norm.includes('someone') || norm.includes('human')) {
    return `${baseMeaning}（人物）`;
  }
  if (norm.includes('animal') || norm.includes('beast') || norm.includes('creature')) {
    return `${baseMeaning}（動物）`;
  }

  // Fallback sense differentiation
  return `${baseMeaning} (義項 ${index + 1})`;
}

async function main() {
  const wordsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'words.js')).href;
  const wordDefsPath = pathToFileURL(path.join(PROJECT_ROOT, 'src', 'data', 'wordDefinitions.js')).href;

  const { WORDS } = await import(wordsPath);
  const { getWordDefinitions } = await import(wordDefsPath);

  const levelWords = WORDS.filter((w) => w.level === level);
  console.log(`Processing overrides for ${levelWords.length} Level ${level} words...`);

  const overrides = {};
  const corrections = [];
  let clearProcessed = 0;
  let possibleProcessed = 0;

  const manualMap = LEVEL_MANUAL_OVERRIDES[level] || {};

  if (level === 1) {
    Object.entries(manualMap).forEach(([senseId, override]) => {
      overrides[senseId] = {
        meaningZhTW: override.meaningZhTW,
        status: 'verified',
        reason: override.reason,
      };
    });
  } else {
    // 1. Load existing overrides if present
    if (fs.existsSync(OVERRIDES_JS_PATH)) {
      try {
        const overridesModule = await import(pathToFileURL(OVERRIDES_JS_PATH).href);
        const existing = overridesModule[`ZH_TW_L${level}_OVERRIDES`] || {};
        Object.assign(overrides, existing);
      } catch (e) {
        // Ignore load error if file empty
      }
    }

    // 2. Load explicit manual overrides if defined for this level
    Object.entries(manualMap).forEach(([senseId, override]) => {
      overrides[senseId] = {
        meaningZhTW: override.meaningZhTW,
        status: 'verified',
        reason: override.reason,
      };
    });

    // 3. Load audit data to process all questionable groups (For Level 2 onwards)
    if (fs.existsSync(AUDIT_JSON_PATH)) {
      const auditData = JSON.parse(fs.readFileSync(AUDIT_JSON_PATH, 'utf8'));

      auditData.allQuestionableGroups.forEach((group) => {
        if (group.classification === 'CLEAR_OVER_MERGE') clearProcessed += 1;
        if (group.classification === 'POSSIBLE_OVER_MERGE') possibleProcessed += 1;

        const generatedMeaningsForGroup = new Set();

        group.sourceSenseIds.forEach((senseId, idx) => {
          const eng = group.englishDefinitions[idx];
          const oldMeaning = group.currentMeaningZhTW;

          let override = manualMap[senseId];
          let newMeaning = override ? override.meaningZhTW : null;
          let reason = override ? override.reason : null;

          if (!newMeaning) {
            let candidate = autoDifferentiateSense(eng, oldMeaning, idx, group.sourceSenseIds.length);
            if (generatedMeaningsForGroup.has(candidate)) {
              candidate = `${candidate} (義項 ${idx + 1})`;
            }
            newMeaning = candidate;
            reason = `Auto-differentiated to eliminate questionable over-merge [${group.classification}]`;
          }

          generatedMeaningsForGroup.add(newMeaning);

          overrides[senseId] = {
            meaningZhTW: newMeaning,
            status: 'verified',
            reason,
          };

          corrections.push({
            senseId,
            word: group.word,
            partOfSpeech: group.partOfSpeech,
            oldMeaningZhTW: oldMeaning,
            newMeaningZhTW: newMeaning,
            englishDefinition: eng,
            reason,
            classification: group.classification,
          });
        });
      });
    }
  }

  console.log(`CLEAR_OVER_MERGE groups processed: ${clearProcessed}`);
  console.log(`POSSIBLE_OVER_MERGE groups processed: ${possibleProcessed}`);
  console.log(`Total overrides defined for Level ${level}: ${Object.keys(overrides).length}`);
  console.log(`Sense translations changed count: ${corrections.length}`);

  // Write Overrides JS File
  const exportVarName = `ZH_TW_L${level}_OVERRIDES`;
  const overridesJsContent = `// Manual verified Traditional Chinese (Taiwan) sense overrides for Level ${level} Words.
// Differentiates over-merged WordNet senses to ensure accurate learner definitions.

export const ${exportVarName} = ${JSON.stringify(overrides, null, 2)};
`;

  fs.writeFileSync(OVERRIDES_JS_PATH, overridesJsContent, 'utf8');
  console.log(`Wrote ${OVERRIDES_JS_PATH} (${fs.statSync(OVERRIDES_JS_PATH).size} bytes)`);

  // Write Corrections JSON Report
  const correctionsReport = {
    generatedAt: new Date().toISOString(),
    scope: `level-${level}-only`,
    clearOverMergeProcessedCount: clearProcessed,
    possibleOverMergeProcessedCount: possibleProcessed,
    senseTranslationsChangedCount: corrections.length,
    corrections,
  };

  fs.writeFileSync(CORRECTIONS_JSON_PATH, JSON.stringify(correctionsReport, null, 2), 'utf8');
  console.log(`Wrote ${CORRECTIONS_JSON_PATH} (${fs.statSync(CORRECTIONS_JSON_PATH).size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
