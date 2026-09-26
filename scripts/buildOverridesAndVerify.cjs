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
