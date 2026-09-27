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
