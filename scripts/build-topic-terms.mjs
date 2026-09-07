import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pinyin } from 'pinyin-pro';

const topicTerms = {
  food: [
    ['蘋果', 'ping4 gwo2', 'preschool'], ['香蕉', 'hoeng1 ziu1', 'preschool'], ['橙', 'caang2', 'preschool'], ['西瓜', 'sai1 gwaa1', 'preschool'], ['葡萄', 'pou4 tou4', 'junior'],
    ['草莓', 'cou2 mui4', 'junior'], ['麵包', 'min6 baau1', 'preschool'], ['白飯', 'baak6 faan6', 'preschool'], ['雞蛋', 'gai1 daan2', 'preschool'], ['牛奶', 'ngau4 naai5', 'preschool'],
    ['魚', 'jyu2', 'preschool'], ['菜', 'coi3', 'preschool'], ['湯', 'tong1', 'preschool'], ['餅乾', 'beng2 gon1', 'junior'], ['雪糕', 'syut3 gou1', 'preschool'],
  ],
  emotion: [
    ['開心', 'hoi1 sam1', 'preschool'], ['高興', 'gou1 hing3', 'preschool'], ['快樂', 'faai3 lok6', 'preschool'], ['傷心', 'soeng1 sam1', 'preschool'], ['難過', 'naan4 gwo3', 'junior'],
    ['生氣', 'saang1 hei3', 'junior'], ['害怕', 'hoi6 paa3', 'junior'], ['驚喜', 'ging1 hei2', 'junior'], ['緊張', 'gan2 zoeng1', 'junior'], ['放心', 'fong3 sam1', 'junior'],
    ['滿意', 'mun5 ji3', 'junior'], ['驕傲', 'giu1 ngou6', 'senior'], ['友善', 'jau5 sin6', 'junior'], ['勇敢', 'jung5 gam2', 'junior'], ['感動', 'gam2 dung6', 'senior'],
  ],
  animal: [
    ['小狗', 'siu2 gau2', 'preschool'], ['小貓', 'siu2 maau1', 'preschool'], ['兔仔', 'tou3 zai2', 'preschool'], ['金魚', 'gam1 jyu2', 'preschool'], ['烏龜', 'wu1 gwai1', 'preschool'],
    ['獅子', 'si1 zi2', 'preschool'], ['老虎', 'lou5 fu2', 'preschool'], ['大象', 'daai6 zoeng6', 'preschool'], ['熊貓', 'hung4 maau1', 'junior'], ['猴子', 'hau4 zi2', 'junior'],
    ['企鵝', 'kei5 ngo4', 'junior'], ['蝴蝶', 'wu4 dip6', 'junior'], ['蜜蜂', 'mat6 fung1', 'junior'], ['青蛙', 'ceng1 waa1', 'junior'], ['海豚', 'hoi2 tyun4', 'junior'],
  ],
  color: [
    ['紅色', 'hung4 sik1', 'preschool'], ['橙色', 'caang2 sik1', 'preschool'], ['黃色', 'wong4 sik1', 'preschool'], ['綠色', 'luk6 sik1', 'preschool'], ['藍色', 'laam4 sik1', 'preschool'],
    ['紫色', 'zi2 sik1', 'preschool'], ['粉紅色', 'fan2 hung4 sik1', 'preschool'], ['白色', 'baak6 sik1', 'preschool'], ['黑色', 'hak1 sik1', 'preschool'], ['灰色', 'fui1 sik1', 'junior'],
    ['啡色', 'fe1 sik1', 'junior'], ['彩色', 'coi2 sik1', 'junior'], ['金色', 'gam1 sik1', 'junior'], ['銀色', 'ngan4 sik1', 'junior'], ['深藍色', 'sam1 laam4 sik1', 'junior'],
  ],
  body: [
    ['頭', 'tau4', 'preschool'], ['頭髮', 'tau4 faat3', 'preschool'], ['眼睛', 'ngaan5 zing1', 'preschool'], ['耳朵', 'ji5 do2', 'preschool'], ['鼻子', 'bei6 zi2', 'preschool'],
    ['嘴巴', 'zeoi2 baa1', 'preschool'], ['牙齒', 'ngaa4 ci2', 'junior'], ['舌頭', 'sit6 tau4', 'junior'], ['頸', 'geng2', 'junior'], ['肩膀', 'gin1 bong2', 'junior'],
    ['手', 'sau2', 'preschool'], ['手指', 'sau2 zi2', 'preschool'], ['肚子', 'tou5 zi2', 'preschool'], ['腳', 'goek3', 'preschool'], ['膝蓋', 'sat1 goi3', 'senior'],
  ],
  nature: [
    ['太陽', 'taai3 joeng4', 'preschool'], ['月亮', 'jyut6 loeng6', 'preschool'], ['星星', 'sing1 sing1', 'preschool'], ['天空', 'tin1 hung1', 'preschool'], ['白雲', 'baak6 wan4', 'preschool'],
    ['雨水', 'jyu5 seoi2', 'preschool'], ['彩虹', 'coi2 hung4', 'preschool'], ['花朵', 'faa1 do2', 'preschool'], ['樹木', 'syu6 muk6', 'preschool'], ['草地', 'cou2 dei6', 'preschool'],
    ['河流', 'ho4 lau4', 'junior'], ['海洋', 'hoi2 joeng4', 'junior'], ['山峰', 'saan1 fung1', 'junior'], ['石頭', 'sek6 tau4', 'preschool'], ['泥土', 'nai4 tou2', 'preschool'],
  ],
  school: [
    ['學校', 'hok6 haau6', 'preschool'], ['老師', 'lou5 si1', 'preschool'], ['同學', 'tung4 hok6', 'preschool'], ['課室', 'fo3 sat1', 'preschool'], ['書本', 'syu1 bun2', 'preschool'],
    ['鉛筆', 'jyun4 bat1', 'preschool'], ['橡皮', 'zoeng6 pei4', 'preschool'], ['尺子', 'cek3 zi2', 'preschool'], ['功課', 'gung1 fo3', 'junior'], ['閱讀', 'jyut6 duk6', 'junior'],
    ['寫字', 'se2 zi6', 'preschool'], ['數學', 'sou3 hok6', 'junior'], ['音樂', 'jam1 ngok6', 'junior'], ['圖畫', 'tou4 waa2', 'preschool'], ['休息', 'jau1 sik1', 'preschool'],
  ],
  family: [
    ['爸爸', 'baa4 baa1', 'preschool'], ['媽媽', 'maa4 maa1', 'preschool'], ['哥哥', 'go4 go1', 'preschool'], ['姐姐', 'ze4 ze1', 'preschool'], ['弟弟', 'dai6 dai2', 'preschool'],
    ['妹妹', 'mui6 mui2', 'preschool'], ['祖父', 'zou2 fu6', 'junior'], ['祖母', 'zou2 mou5', 'junior'], ['外公', 'ngoi6 gung1', 'junior'], ['外婆', 'ngoi6 po4', 'junior'],
    ['家人', 'gaa1 jan4', 'preschool'], ['屋企', 'uk1 kei2', 'preschool'], ['親人', 'can1 jan4', 'junior'], ['嬰兒', 'jing1 ji4', 'junior'], ['家庭', 'gaa1 ting4', 'junior'],
  ],
  action: [
    ['走路', 'zau2 lou6', 'preschool'], ['跑步', 'paau5 bou6', 'preschool'], ['跳高', 'tiu3 gou1', 'junior'], ['坐下', 'co5 haa6', 'preschool'], ['站立', 'zaam6 lap6', 'junior'],
    ['睡覺', 'seoi6 gaau3', 'preschool'], ['起床', 'hei2 cong4', 'preschool'], ['洗手', 'sai2 sau2', 'preschool'], ['刷牙', 'caat3 ngaa4', 'preschool'], ['食飯', 'sik6 faan6', 'preschool'],
    ['飲水', 'jam2 seoi2', 'preschool'], ['唱歌', 'coeng3 go1', 'preschool'], ['跳舞', 'tiu3 mou5', 'preschool'], ['幫助', 'bong1 zo6', 'junior'], ['擁抱', 'jung2 pou5', 'junior'],
  ],
  object: [
    ['車', 'ce1', 'preschool'], ['雨傘', 'jyu5 saan3', 'preschool'], ['水杯', 'seoi2 bui1', 'preschool'], ['電話', 'din6 waa2', 'preschool'], ['時鐘', 'si4 zung1', 'preschool'],
    ['電腦', 'din6 nou5', 'junior'], ['電視', 'din6 si6', 'preschool'], ['門', 'mun4', 'preschool'], ['窗', 'coeng1', 'preschool'], ['床', 'cong4', 'preschool'],
    ['書桌', 'syu1 zoek3', 'junior'], ['椅子', 'ji2 zi2', 'preschool'], ['衣服', 'ji1 fuk6', 'preschool'], ['鞋子', 'haai4 zi2', 'preschool'], ['玩具', 'waan2 geoi6', 'preschool'],
  ],
  other: [
    ['時間', 'si4 gaan3', 'junior'], ['今天', 'gam1 tin1', 'preschool'], ['明天', 'ming4 tin1', 'preschool'], ['昨天', 'zok6 tin1', 'preschool'], ['早晨', 'zou2 san4', 'preschool'],
    ['晚上', 'maan5 soeng6', 'preschool'], ['生日', 'saang1 jat6', 'preschool'], ['節日', 'zit3 jat6', 'junior'], ['香港', 'hoeng1 gong2', 'preschool'], ['中國', 'zung1 gwok3', 'junior'],
    ['地球', 'dei6 kau4', 'junior'], ['世界', 'sai3 gaai3', 'junior'], ['語言', 'jyu5 jin4', 'senior'], ['故事', 'gu3 si6', 'preschool'], ['答案', 'daap3 on3', 'junior'],
  ],
};

const terms = Object.entries(topicTerms).flatMap(([category, entries]) => entries.map(([term, jyutping, level]) => ({
  term,
  jyutping,
  pinyin: pinyin(term, { toneType: 'symbol' }),
  level,
  category,
})));

if (terms.length !== 165 || Object.values(topicTerms).some((entries) => entries.length < 15)) {
  throw new Error('主題字詞數量不符合每類至少 15 個的要求。');
}

await writeFile(resolve(import.meta.dirname, '../client/src/data/terms.json'), `${JSON.stringify(terms, null, 2)}\n`, 'utf8');
console.log(`已建立 ${terms.length} 個主題字詞。`);
