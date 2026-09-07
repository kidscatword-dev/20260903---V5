/** 固定音檔：每個字詞均有香港粵語與普通話兩種預先製作讀音。 */
const topicAudio: Record<string, { cantonese: string; mandarin: string }> = {
  "蘋果": {
    "cantonese": "/manus-storage/word-001_91c97847.mp3",
    "mandarin": "/manus-storage/word-001_1620f51c.mp3"
  },
  "香蕉": {
    "cantonese": "/manus-storage/word-002_289d0718.mp3",
    "mandarin": "/manus-storage/word-002_621cc485.mp3"
  },
  "橙": {
    "cantonese": "/manus-storage/word-003_fd0ced68.mp3",
    "mandarin": "/manus-storage/word-003_d02a1c6e.mp3"
  },
  "西瓜": {
    "cantonese": "/manus-storage/word-004_fee6da15.mp3",
    "mandarin": "/manus-storage/word-004_30f47a10.mp3"
  },
  "葡萄": {
    "cantonese": "/manus-storage/word-005_32c13176.mp3",
    "mandarin": "/manus-storage/word-005_0b72f3cf.mp3"
  },
  "草莓": {
    "cantonese": "/manus-storage/cantonese-si6-do1-be1-lei4_138b8489.wav",
    "mandarin": "/manus-storage/word-006_35b5b183.mp3"
  },
  "菠蘿": {
    "cantonese": "/manus-storage/word-007_2cbc3c28.mp3",
    "mandarin": "/manus-storage/word-007_e47d77f6.mp3"
  },
  "梨": {
    "cantonese": "/manus-storage/word-008_ba57996e.mp3",
    "mandarin": "/manus-storage/word-008_2fe4696f.mp3"
  },
  "桃": {
    "cantonese": "/manus-storage/word-012_c42a5c62.mp3",
    "mandarin": "/manus-storage/word-012_431b2b0a.mp3"
  },
  "牛奶": {
    "cantonese": "/manus-storage/word-016_d2d91d2d.mp3",
    "mandarin": "/manus-storage/word-016_1d38a9cd.mp3"
  },
  "水": {
    "cantonese": "/manus-storage/graded-001_05c3544c.mp3",
    "mandarin": "/manus-storage/graded-001_34841eef.mp3"
  },
  "飯": {
    "cantonese": "/manus-storage/graded-002_faa48c94.mp3",
    "mandarin": "/manus-storage/graded-002_226ef8f1.mp3"
  },
  "粥": {
    "cantonese": "/manus-storage/word-020_1895f2a5.mp3",
    "mandarin": "/manus-storage/word-020_fa2e1cfc.mp3"
  },
  "湯": {
    "cantonese": "/manus-storage/word-021_2f2f7399.mp3",
    "mandarin": "/manus-storage/word-021_9b06413c.mp3"
  },
  "麵包": {
    "cantonese": "/manus-storage/word-018_95664ce9.mp3",
    "mandarin": "/manus-storage/word-018_0e5337a8.mp3"
  },
  "雞蛋": {
    "cantonese": "/manus-storage/word-022_cc79a24a.mp3",
    "mandarin": "/manus-storage/word-022_6d2f2dc7.mp3"
  },
  "魚": {
    "cantonese": "/manus-storage/word-023_2516be79.mp3",
    "mandarin": "/manus-storage/word-023_6d252793.mp3"
  },
  "菜": {
    "cantonese": "/manus-storage/word-024_4243a768.mp3",
    "mandarin": "/manus-storage/word-024_38ad2b12.mp3"
  },
  "肉": {
    "cantonese": "/manus-storage/graded-003_5392a302.mp3",
    "mandarin": "/manus-storage/graded-003_9f4e0ebd.mp3"
  },
  "糖": {
    "cantonese": "/manus-storage/graded-004_1b3bba94.mp3",
    "mandarin": "/manus-storage/graded-004_24204e6b.mp3"
  },
  "餅乾": {
    "cantonese": "/manus-storage/word-028_21f6330f.mp3",
    "mandarin": "/manus-storage/word-028_dafc1b79.mp3"
  },
  "冰淇淋": {
    "cantonese": "/manus-storage/cantonese-syut3-gou1-corrected_621f6824.wav",
    "mandarin": "/manus-storage/mandarin-ice-cream_22c0a218.wav"
  },
  "巧克力": {
    "cantonese": "/manus-storage/word-030_60bcf4a2.mp3",
    "mandarin": "/manus-storage/mandarin-chocolate_c3e7ddb5.wav"
  },
  "果汁": {
    "cantonese": "/manus-storage/graded-005_7eb93665.mp3",
    "mandarin": "/manus-storage/graded-005_a93ad1f8.mp3"
  },
  "豆漿": {
    "cantonese": "/manus-storage/word-017_2a85c817.mp3",
    "mandarin": "/manus-storage/word-017_b5e9bce6.mp3"
  },
  "芝士": {
    "cantonese": "/manus-storage/graded-006_7cb74b6d.mp3",
    "mandarin": "/manus-storage/graded-006_2679415e.mp3"
  },
  "薯條": {
    "cantonese": "/manus-storage/graded-007_8e29f331.mp3",
    "mandarin": "/manus-storage/graded-007_100422a9.mp3"
  },
  "番茄": {
    "cantonese": "/manus-storage/word-025_06d84459.mp3",
    "mandarin": "/manus-storage/word-025_62419dcb.mp3"
  },
  "玉米": {
    "cantonese": "/manus-storage/word-027_b6153944.mp3",
    "mandarin": "/manus-storage/word-027_0213fcaa.mp3"
  },
  "蛋糕": {
    "cantonese": "/manus-storage/graded-008_845789d4.mp3",
    "mandarin": "/manus-storage/graded-008_839f7149.mp3"
  },
  "開心": {
    "cantonese": "/manus-storage/word-031_2bc6abd8.mp3",
    "mandarin": "/manus-storage/word-031_b03cac94.mp3"
  },
  "高興": {
    "cantonese": "/manus-storage/word-032_71c15274.mp3",
    "mandarin": "/manus-storage/word-032_db88bd6b.mp3"
  },
  "快樂": {
    "cantonese": "/manus-storage/word-033_0711accb.mp3",
    "mandarin": "/manus-storage/word-033_df0e79e9.mp3"
  },
  "傷心": {
    "cantonese": "/manus-storage/word-034_bf033030.mp3",
    "mandarin": "/manus-storage/word-034_86a74c3c.mp3"
  },
  "難過": {
    "cantonese": "/manus-storage/word-035_9b3610fc.mp3",
    "mandarin": "/manus-storage/word-035_5c99b2a4.mp3"
  },
  "生氣": {
    "cantonese": "/manus-storage/word-036_6dff9352.mp3",
    "mandarin": "/manus-storage/word-036_4867ecdd.mp3"
  },
  "害怕": {
    "cantonese": "/manus-storage/word-037_9014f179.mp3",
    "mandarin": "/manus-storage/word-037_edb34778.mp3"
  },
  "驚喜": {
    "cantonese": "/manus-storage/word-038_82728d64.mp3",
    "mandarin": "/manus-storage/word-038_7045f44a.mp3"
  },
  "緊張": {
    "cantonese": "/manus-storage/word-039_6b057031.mp3",
    "mandarin": "/manus-storage/word-039_a003a5b5.mp3"
  },
  "放心": {
    "cantonese": "/manus-storage/word-040_90a19203.mp3",
    "mandarin": "/manus-storage/word-040_5f56b813.mp3"
  },
  "想念": {
    "cantonese": "/manus-storage/graded-009_f467ac11.mp3",
    "mandarin": "/manus-storage/graded-009_b6ef6dfa.mp3"
  },
  "喜歡": {
    "cantonese": "/manus-storage/graded-010_70ba1055.mp3",
    "mandarin": "/manus-storage/graded-010_096e63bf.mp3"
  },
  "討厭": {
    "cantonese": "/manus-storage/graded-011_06ec240e.mp3",
    "mandarin": "/manus-storage/graded-011_b274dc20.mp3"
  },
  "愛": {
    "cantonese": "/manus-storage/graded-012_48d1060a.mp3",
    "mandarin": "/manus-storage/graded-012_ec04c50c.mp3"
  },
  "哭": {
    "cantonese": "/manus-storage/graded-013_c91ee979.mp3",
    "mandarin": "/manus-storage/graded-013_183be0f8.mp3"
  },
  "笑": {
    "cantonese": "/manus-storage/graded-014_710ca8ab.mp3",
    "mandarin": "/manus-storage/graded-014_61a6b0b0.mp3"
  },
  "友善": {
    "cantonese": "/manus-storage/word-043_bc8849bc.mp3",
    "mandarin": "/manus-storage/word-043_58362f63.mp3"
  },
  "勇敢": {
    "cantonese": "/manus-storage/word-044_77ed59fd.mp3",
    "mandarin": "/manus-storage/word-044_f6964b67.mp3"
  },
  "安心": {
    "cantonese": "/manus-storage/word-403_8f02a132.mp3",
    "mandarin": "/manus-storage/word-403_d93ce002.mp3"
  },
  "擔心": {
    "cantonese": "/manus-storage/graded-015_6c6e4dba.mp3",
    "mandarin": "/manus-storage/graded-015_b2471626.mp3"
  },
  "生悶氣": {
    "cantonese": "/manus-storage/graded-016_5f7011d8.mp3",
    "mandarin": "/manus-storage/graded-016_187f307f.mp3"
  },
  "興奮": {
    "cantonese": "/manus-storage/word-394_c5221aab.mp3",
    "mandarin": "/manus-storage/word-394_c24a1600.mp3"
  },
  "驚訝": {
    "cantonese": "/manus-storage/graded-017_94fd0809.mp3",
    "mandarin": "/manus-storage/graded-017_f9e91df9.mp3"
  },
  "羞羞": {
    "cantonese": "/manus-storage/graded-018_1fc998ba.mp3",
    "mandarin": "/manus-storage/graded-018_b00dd71f.mp3"
  },
  "害羞": {
    "cantonese": "/manus-storage/cantonese-shy_465094b1.wav",
    "mandarin": "/manus-storage/mandarin-shy_021d08d3.wav"
  },
  "滿足": {
    "cantonese": "/manus-storage/graded-020_b0f96e5a.mp3",
    "mandarin": "/manus-storage/graded-020_6c68cf88.mp3"
  },
  "舒服": {
    "cantonese": "/manus-storage/cantonese-syu1-fuk6-comfortable_3bec60f8.wav",
    "mandarin": "/manus-storage/mandarin-shu1fu-comfortable_ee070c5d.wav"
  },
  "飢餓": {
    "cantonese": "/manus-storage/cantonese-hungry_738df427.wav",
    "mandarin": "/manus-storage/mandarin-hungry_256b59cf.wav"
  },
  "口渴": {
    "cantonese": "/manus-storage/graded-023_79ec1ba1.mp3",
    "mandarin": "/manus-storage/graded-023_be22e1da.mp3"
  },
  "累": {
    "cantonese": "/manus-storage/graded-024_c9d154b3.mp3",
    "mandarin": "/manus-storage/graded-024_cc2833e7.mp3"
  },
  "小狗": {
    "cantonese": "/manus-storage/word-061_86a8f071.mp3",
    "mandarin": "/manus-storage/word-061_6c048972.mp3"
  },
  "小貓": {
    "cantonese": "/manus-storage/word-062_b0e5f346.mp3",
    "mandarin": "/manus-storage/word-062_b767c31c.mp3"
  },
  "兔子": {
    "cantonese": "/manus-storage/cantonese-rabbit_7047f153.wav",
    "mandarin": "/manus-storage/mandarin-rabbit_66e18f5d.wav"
  },
  "金魚": {
    "cantonese": "/manus-storage/word-064_27b11b37.mp3",
    "mandarin": "/manus-storage/word-064_de00257f.mp3"
  },
  "烏龜": {
    "cantonese": "/manus-storage/word-065_4421db6e.mp3",
    "mandarin": "/manus-storage/word-065_4d93c048.mp3"
  },
  "獅子": {
    "cantonese": "/manus-storage/word-066_48501a6c.mp3",
    "mandarin": "/manus-storage/word-066_3fa37eff.mp3"
  },
  "老虎": {
    "cantonese": "/manus-storage/word-067_34a5d9e3.mp3",
    "mandarin": "/manus-storage/word-067_df14f66b.mp3"
  },
  "大象": {
    "cantonese": "/manus-storage/word-068_804ad62d.mp3",
    "mandarin": "/manus-storage/word-068_1df1b2fc.mp3"
  },
  "熊貓": {
    "cantonese": "/manus-storage/word-069_204f9bab.mp3",
    "mandarin": "/manus-storage/word-069_71736b9e.mp3"
  },
  "猴子": {
    "cantonese": "/manus-storage/word-070_a6e2cd8b.mp3",
    "mandarin": "/manus-storage/word-070_c2df5f04.mp3"
  },
  "雞": {
    "cantonese": "/manus-storage/word-089_93adcf55.mp3",
    "mandarin": "/manus-storage/word-089_37b41c30.mp3"
  },
  "鴨": {
    "cantonese": "/manus-storage/word-090_3df598b8.mp3",
    "mandarin": "/manus-storage/word-090_96810ea0.mp3"
  },
  "豬": {
    "cantonese": "/manus-storage/graded-025_2b6fdad7.mp3",
    "mandarin": "/manus-storage/graded-025_c88937c0.mp3"
  },
  "牛": {
    "cantonese": "/manus-storage/graded-026_cbd26705.mp3",
    "mandarin": "/manus-storage/graded-026_17e2211a.mp3"
  },
  "羊": {
    "cantonese": "/manus-storage/graded-027_2c654a11.mp3",
    "mandarin": "/manus-storage/graded-027_e1e61691.mp3"
  },
  "馬": {
    "cantonese": "/manus-storage/graded-028_2f19c4f0.mp3",
    "mandarin": "/manus-storage/graded-028_f98dbeeb.mp3"
  },
  "小鳥": {
    "cantonese": "/manus-storage/graded-029_3c339272.mp3",
    "mandarin": "/manus-storage/graded-029_cbea2f63.mp3"
  },
  "蝴蝶": {
    "cantonese": "/manus-storage/word-072_53ee61d0.mp3",
    "mandarin": "/manus-storage/word-072_91e25f39.mp3"
  },
  "蜜蜂": {
    "cantonese": "/manus-storage/word-073_fdb64115.mp3",
    "mandarin": "/manus-storage/word-073_a157d3ba.mp3"
  },
  "青蛙": {
    "cantonese": "/manus-storage/word-074_0edb093c.mp3",
    "mandarin": "/manus-storage/word-074_4386f8ac.mp3"
  },
  "蛇": {
    "cantonese": "/manus-storage/graded-030_3a55eb06.mp3",
    "mandarin": "/manus-storage/graded-030_4445e2c5.mp3"
  },
  "小魚": {
    "cantonese": "/manus-storage/cantonese-little-fish_8f22581b.wav",
    "mandarin": "/manus-storage/mandarin-little-fish_355a9f10.wav"
  },
  "海豚": {
    "cantonese": "/manus-storage/word-075_4ba67201.mp3",
    "mandarin": "/manus-storage/word-075_0f91710c.mp3"
  },
  "企鵝": {
    "cantonese": "/manus-storage/word-071_7542c7ec.mp3",
    "mandarin": "/manus-storage/word-071_97fb1273.mp3"
  },
  "長頸鹿": {
    "cantonese": "/manus-storage/word-076_086662e0.mp3",
    "mandarin": "/manus-storage/word-076_4914c4df.mp3"
  },
  "斑馬": {
    "cantonese": "/manus-storage/word-077_f9319865.mp3",
    "mandarin": "/manus-storage/word-077_cf9caeb1.mp3"
  },
  "河馬": {
    "cantonese": "/manus-storage/word-078_6ff3cca7.mp3",
    "mandarin": "/manus-storage/word-078_a3fae4e6.mp3"
  },
  "松鼠": {
    "cantonese": "/manus-storage/word-081_977e1b65.mp3",
    "mandarin": "/manus-storage/word-081_01ea9d2c.mp3"
  },
  "袋鼠": {
    "cantonese": "/manus-storage/word-080_6b0421db.mp3",
    "mandarin": "/manus-storage/word-080_c44d8f94.mp3"
  },
  "鯨魚": {
    "cantonese": "/manus-storage/word-085_10e3aac2.mp3",
    "mandarin": "/manus-storage/word-085_e3597aaa.mp3"
  },
  "紅色": {
    "cantonese": "/manus-storage/word-091_9321c102.mp3",
    "mandarin": "/manus-storage/word-091_25f0633e.mp3"
  },
  "橙色": {
    "cantonese": "/manus-storage/word-092_13138c19.mp3",
    "mandarin": "/manus-storage/word-092_f251aebb.mp3"
  },
  "黃色": {
    "cantonese": "/manus-storage/word-093_383f6dbb.mp3",
    "mandarin": "/manus-storage/word-093_80762b3e.mp3"
  },
  "綠色": {
    "cantonese": "/manus-storage/word-094_c403641d.mp3",
    "mandarin": "/manus-storage/word-094_1a7d6086.mp3"
  },
  "藍色": {
    "cantonese": "/manus-storage/word-095_a896bf8f.mp3",
    "mandarin": "/manus-storage/word-095_a7688416.mp3"
  },
  "紫色": {
    "cantonese": "/manus-storage/word-096_742f976c.mp3",
    "mandarin": "/manus-storage/word-096_80c25b22.mp3"
  },
  "粉紅色": {
    "cantonese": "/manus-storage/word-097_2260800f.mp3",
    "mandarin": "/manus-storage/word-097_9a0bc65a.mp3"
  },
  "白色": {
    "cantonese": "/manus-storage/word-098_7dc9bfb0.mp3",
    "mandarin": "/manus-storage/word-098_f4873e42.mp3"
  },
  "黑色": {
    "cantonese": "/manus-storage/word-099_47d0bb9d.mp3",
    "mandarin": "/manus-storage/word-099_3de23496.mp3"
  },
  "灰色": {
    "cantonese": "/manus-storage/word-100_623c2945.mp3",
    "mandarin": "/manus-storage/word-100_435cf558.mp3"
  },
  "啡色": {
    "cantonese": "/manus-storage/word-101_f040eb06.mp3",
    "mandarin": "/manus-storage/word-101_5f071fab.mp3"
  },
  "金色": {
    "cantonese": "/manus-storage/word-103_2eac7cf9.mp3",
    "mandarin": "/manus-storage/word-103_8e9655d0.mp3"
  },
  "銀色": {
    "cantonese": "/manus-storage/word-104_f933f3e7.mp3",
    "mandarin": "/manus-storage/word-104_3ec664f3.mp3"
  },
  "彩色": {
    "cantonese": "/manus-storage/word-102_13fbfba4.mp3",
    "mandarin": "/manus-storage/word-102_e6c3d4ea.mp3"
  },
  "深色": {
    "cantonese": "/manus-storage/graded-032_ae155f56.mp3",
    "mandarin": "/manus-storage/graded-032_30558769.mp3"
  },
  "淺色": {
    "cantonese": "/manus-storage/graded-033_208bc778.mp3",
    "mandarin": "/manus-storage/graded-033_0e4ef8a5.mp3"
  },
  "光亮": {
    "cantonese": "/manus-storage/graded-034_05bd14b7.mp3",
    "mandarin": "/manus-storage/graded-034_84f8b85c.mp3"
  },
  "暗色": {
    "cantonese": "/manus-storage/graded-035_6f127d86.mp3",
    "mandarin": "/manus-storage/graded-035_9a207eac.mp3"
  },
  "彩虹色": {
    "cantonese": "/manus-storage/word-119_1546857a.mp3",
    "mandarin": "/manus-storage/word-119_b662226f.mp3"
  },
  "天藍色": {
    "cantonese": "/manus-storage/word-108_0240ad84.mp3",
    "mandarin": "/manus-storage/word-108_23b3443f.mp3"
  },
  "深藍色": {
    "cantonese": "/manus-storage/word-105_5371dc14.mp3",
    "mandarin": "/manus-storage/word-105_08294304.mp3"
  },
  "淺藍色": {
    "cantonese": "/manus-storage/word-107_fab74977.mp3",
    "mandarin": "/manus-storage/word-107_f162474d.mp3"
  },
  "深綠色": {
    "cantonese": "/manus-storage/word-111_8500238f.mp3",
    "mandarin": "/manus-storage/word-111_cbd1f715.mp3"
  },
  "米白色": {
    "cantonese": "/manus-storage/word-112_4340b3e7.mp3",
    "mandarin": "/manus-storage/word-112_7f317d4c.mp3"
  },
  "米色": {
    "cantonese": "/manus-storage/word-113_0ad30f13.mp3",
    "mandarin": "/manus-storage/word-113_6dc15be3.mp3"
  },
  "桃紅色": {
    "cantonese": "/manus-storage/word-116_a1880f33.mp3",
    "mandarin": "/manus-storage/word-116_6d9f1b1d.mp3"
  },
  "土黃色": {
    "cantonese": "/manus-storage/word-117_655b47ca.mp3",
    "mandarin": "/manus-storage/word-117_1e0f9345.mp3"
  },
  "奶油色": {
    "cantonese": "/manus-storage/word-118_72db72fb.mp3",
    "mandarin": "/manus-storage/word-118_e972f9ec.mp3"
  },
  "透明": {
    "cantonese": "/manus-storage/word-120_59465c55.mp3",
    "mandarin": "/manus-storage/word-120_aa6d062c.mp3"
  },
  "花色": {
    "cantonese": "/manus-storage/graded-036_45c905da.mp3",
    "mandarin": "/manus-storage/graded-036_1d16db1f.mp3"
  },
  "頭": {
    "cantonese": "/manus-storage/word-121_9eed3ce9.mp3",
    "mandarin": "/manus-storage/word-121_f68cbd78.mp3"
  },
  "頭髮": {
    "cantonese": "/manus-storage/word-122_e6f88f75.mp3",
    "mandarin": "/manus-storage/word-122_7aabf10e.mp3"
  },
  "眼睛": {
    "cantonese": "/manus-storage/word-123_e1f5d48a.mp3",
    "mandarin": "/manus-storage/word-123_220388c4.mp3"
  },
  "耳朵": {
    "cantonese": "/manus-storage/word-124_6bd31a04.mp3",
    "mandarin": "/manus-storage/word-124_4053959b.mp3"
  },
  "鼻子": {
    "cantonese": "/manus-storage/word-125_6c07de53.mp3",
    "mandarin": "/manus-storage/word-125_ad6edc67.mp3"
  },
  "嘴巴": {
    "cantonese": "/manus-storage/word-126_1be8c5e0.mp3",
    "mandarin": "/manus-storage/word-126_1ad6e2a0.mp3"
  },
  "牙齒": {
    "cantonese": "/manus-storage/word-127_4db169c6.mp3",
    "mandarin": "/manus-storage/word-127_38f716f0.mp3"
  },
  "舌頭": {
    "cantonese": "/manus-storage/word-128_35b07367.mp3",
    "mandarin": "/manus-storage/word-128_be920318.mp3"
  },
  "頸": {
    "cantonese": "/manus-storage/word-129_ab154d85.mp3",
    "mandarin": "/manus-storage/word-129_9be8106f.mp3"
  },
  "肩膀": {
    "cantonese": "/manus-storage/word-130_bd908edf.mp3",
    "mandarin": "/manus-storage/word-130_ccec0372.mp3"
  },
  "手": {
    "cantonese": "/manus-storage/word-131_19abc722.mp3",
    "mandarin": "/manus-storage/word-131_60e733ab.mp3"
  },
  "手指": {
    "cantonese": "/manus-storage/word-132_842f3f04.mp3",
    "mandarin": "/manus-storage/word-132_ebdfe05a.mp3"
  },
  "手掌": {
    "cantonese": "/manus-storage/word-133_16a8fd43.mp3",
    "mandarin": "/manus-storage/word-133_14379178.mp3"
  },
  "手腕": {
    "cantonese": "/manus-storage/word-134_c6a485fe.mp3",
    "mandarin": "/manus-storage/word-134_acbc5d5e.mp3"
  },
  "手臂": {
    "cantonese": "/manus-storage/word-135_105dabae.mp3",
    "mandarin": "/manus-storage/word-135_076d9bac.mp3"
  },
  "肚子": {
    "cantonese": "/manus-storage/word-136_ab64f102.mp3",
    "mandarin": "/manus-storage/word-136_ce793d46.mp3"
  },
  "背部": {
    "cantonese": "/manus-storage/word-137_331b78ae.mp3",
    "mandarin": "/manus-storage/word-137_6f8d425b.mp3"
  },
  "腰": {
    "cantonese": "/manus-storage/word-138_56a54852.mp3",
    "mandarin": "/manus-storage/word-138_7f7bc403.mp3"
  },
  "腳": {
    "cantonese": "/manus-storage/word-140_4f416322.mp3",
    "mandarin": "/manus-storage/word-140_a618129d.mp3"
  },
  "腳趾": {
    "cantonese": "/manus-storage/word-141_323952ae.mp3",
    "mandarin": "/manus-storage/word-141_d0fae580.mp3"
  },
  "膝蓋": {
    "cantonese": "/manus-storage/word-139_53672e5d.mp3",
    "mandarin": "/manus-storage/word-139_d571512b.mp3"
  },
  "心": {
    "cantonese": "/manus-storage/graded-037_2f3bcbaa.mp3",
    "mandarin": "/manus-storage/graded-037_d4585bb7.mp3"
  },
  "臉": {
    "cantonese": "/manus-storage/graded-038_36f92e5d.mp3",
    "mandarin": "/manus-storage/graded-038_9c86ce97.mp3"
  },
  "眉毛": {
    "cantonese": "/manus-storage/word-147_a82b0a10.mp3",
    "mandarin": "/manus-storage/word-147_84e73824.mp3"
  },
  "睫毛": {
    "cantonese": "/manus-storage/word-148_7aed7b54.mp3",
    "mandarin": "/manus-storage/word-148_967b73c0.mp3"
  },
  "指甲": {
    "cantonese": "/manus-storage/word-149_7dc52671.mp3",
    "mandarin": "/manus-storage/word-149_a76f8a5e.mp3"
  },
  "皮膚": {
    "cantonese": "/manus-storage/word-150_eb00a488.mp3",
    "mandarin": "/manus-storage/word-150_a74c2928.mp3"
  },
  "臉頰": {
    "cantonese": "/manus-storage/word-146_01ea9681.mp3",
    "mandarin": "/manus-storage/word-146_56cd9e78.mp3"
  },
  "腦袋": {
    "cantonese": "/manus-storage/word-145_06733541.mp3",
    "mandarin": "/manus-storage/word-145_2320c480.mp3"
  },
  "肺部": {
    "cantonese": "/manus-storage/word-144_40cf2e85.mp3",
    "mandarin": "/manus-storage/word-144_4f1ffa18.mp3"
  },
  "爸爸": {
    "cantonese": "/manus-storage/word-151_2a7ea831.mp3",
    "mandarin": "/manus-storage/word-151_905d5085.mp3"
  },
  "媽媽": {
    "cantonese": "/manus-storage/word-152_701ee3f2.mp3",
    "mandarin": "/manus-storage/word-152_ed7a16c2.mp3"
  },
  "哥哥": {
    "cantonese": "/manus-storage/word-153_2e8d29f6.mp3",
    "mandarin": "/manus-storage/word-153_d28ed189.mp3"
  },
  "姐姐": {
    "cantonese": "/manus-storage/word-154_ba7adf18.mp3",
    "mandarin": "/manus-storage/word-154_b7a9fd74.mp3"
  },
  "弟弟": {
    "cantonese": "/manus-storage/word-155_388b085c.mp3",
    "mandarin": "/manus-storage/word-155_308bb5e1.mp3"
  },
  "妹妹": {
    "cantonese": "/manus-storage/word-156_bac6b0e8.mp3",
    "mandarin": "/manus-storage/word-156_d5f4b672.mp3"
  },
  "祖父": {
    "cantonese": "/manus-storage/word-157_015dc726.mp3",
    "mandarin": "/manus-storage/word-157_94e912c7.mp3"
  },
  "祖母": {
    "cantonese": "/manus-storage/word-158_751b6f89.mp3",
    "mandarin": "/manus-storage/word-158_a17bb5bb.mp3"
  },
  "外公": {
    "cantonese": "/manus-storage/word-159_d26e3fc4.mp3",
    "mandarin": "/manus-storage/word-159_6fc294e6.mp3"
  },
  "外婆": {
    "cantonese": "/manus-storage/word-160_83570e71.mp3",
    "mandarin": "/manus-storage/word-160_765b51b4.mp3"
  },
  "叔叔": {
    "cantonese": "/manus-storage/word-161_55584d68.mp3",
    "mandarin": "/manus-storage/word-161_6dcd9a7a.mp3"
  },
  "阿姨": {
    "cantonese": "/manus-storage/word-162_20128e27.mp3",
    "mandarin": "/manus-storage/word-162_e224be9a.mp3"
  },
  "舅父": {
    "cantonese": "/manus-storage/word-163_d4f66981.mp3",
    "mandarin": "/manus-storage/word-163_3776d1e2.mp3"
  },
  "舅母": {
    "cantonese": "/manus-storage/word-164_72b2e1f0.mp3",
    "mandarin": "/manus-storage/word-164_1f54bf20.mp3"
  },
  "姑媽": {
    "cantonese": "/manus-storage/word-165_9b7a2cf9.mp3",
    "mandarin": "/manus-storage/word-165_cbb644d8.mp3"
  },
  "姑丈": {
    "cantonese": "/manus-storage/word-166_54462a30.mp3",
    "mandarin": "/manus-storage/word-166_81c98f05.mp3"
  },
  "家人": {
    "cantonese": "/manus-storage/word-171_216a72a6.mp3",
    "mandarin": "/manus-storage/word-171_d381ee3d.mp3"
  },
  "家中": {
    "cantonese": "/manus-storage/cantonese-home_ab7d70ca.wav",
    "mandarin": "/manus-storage/mandarin-home_e98d9c15.wav"
  },
  "親人": {
    "cantonese": "/manus-storage/word-173_3128a4c5.mp3",
    "mandarin": "/manus-storage/word-173_14e41d80.mp3"
  },
  "嬰兒": {
    "cantonese": "/manus-storage/word-174_914841f4.mp3",
    "mandarin": "/manus-storage/word-174_fb44ace9.mp3"
  },
  "兒子": {
    "cantonese": "/manus-storage/graded-039_bf895762.mp3",
    "mandarin": "/manus-storage/graded-039_f9f4408c.mp3"
  },
  "女兒": {
    "cantonese": "/manus-storage/graded-040_7e63d539.mp3",
    "mandarin": "/manus-storage/graded-040_a121c7e5.mp3"
  },
  "家庭": {
    "cantonese": "/manus-storage/word-175_a5538b03.mp3",
    "mandarin": "/manus-storage/word-175_c8ed5330.mp3"
  },
  "親戚": {
    "cantonese": "/manus-storage/word-176_db327f05.mp3",
    "mandarin": "/manus-storage/word-176_14501aca.mp3"
  },
  "孫子": {
    "cantonese": "/manus-storage/word-179_4da5f3c2.mp3",
    "mandarin": "/manus-storage/word-179_714b6fac.mp3"
  },
  "孫女": {
    "cantonese": "/manus-storage/word-180_05af97df.mp3",
    "mandarin": "/manus-storage/word-180_4969fe7a.mp3"
  },
  "表哥": {
    "cantonese": "/manus-storage/word-167_bec9d87d.mp3",
    "mandarin": "/manus-storage/word-167_b922aaaa.mp3"
  },
  "表姐": {
    "cantonese": "/manus-storage/word-168_8250a2d4.mp3",
    "mandarin": "/manus-storage/word-168_cc5d9571.mp3"
  },
  "堂哥": {
    "cantonese": "/manus-storage/word-169_3d61eee3.mp3",
    "mandarin": "/manus-storage/word-169_1d335b43.mp3"
  },
  "堂姐": {
    "cantonese": "/manus-storage/word-170_3da80449.mp3",
    "mandarin": "/manus-storage/word-170_c9280c70.mp3"
  },
  "杯": {
    "cantonese": "/manus-storage/graded-041_63181b13.mp3",
    "mandarin": "/manus-storage/graded-041_e811abc6.mp3"
  },
  "碗": {
    "cantonese": "/manus-storage/graded-042_1e3206b5.mp3",
    "mandarin": "/manus-storage/graded-042_66aecae2.mp3"
  },
  "筷子": {
    "cantonese": "/manus-storage/graded-043_c4210186.mp3",
    "mandarin": "/manus-storage/graded-043_72e9e702.mp3"
  },
  "湯匙": {
    "cantonese": "/manus-storage/cantonese-spoon_7f8ea029.wav",
    "mandarin": "/manus-storage/mandarin-spoon_d89411a9.wav"
  },
  "碟": {
    "cantonese": "/manus-storage/graded-045_6ee493bf.mp3",
    "mandarin": "/manus-storage/graded-045_80e1778d.mp3"
  },
  "書": {
    "cantonese": "/manus-storage/graded-046_c2daa62e.mp3",
    "mandarin": "/manus-storage/graded-046_f11efba9.mp3"
  },
  "桌": {
    "cantonese": "/manus-storage/graded-047_940a5114.mp3",
    "mandarin": "/manus-storage/graded-047_5c838365.mp3"
  },
  "椅": {
    "cantonese": "/manus-storage/graded-048_f0b2fd3c.mp3",
    "mandarin": "/manus-storage/graded-048_b4df3a5d.mp3"
  },
  "門": {
    "cantonese": "/manus-storage/word-188_9b1d3ebf.mp3",
    "mandarin": "/manus-storage/word-188_c92fedee.mp3"
  },
  "窗": {
    "cantonese": "/manus-storage/word-189_f41e355b.mp3",
    "mandarin": "/manus-storage/word-189_7ec926a3.mp3"
  },
  "床": {
    "cantonese": "/manus-storage/word-190_85877c02.mp3",
    "mandarin": "/manus-storage/word-190_bd0a79db.mp3"
  },
  "枕頭": {
    "cantonese": "/manus-storage/word-201_fa6cc052.mp3",
    "mandarin": "/manus-storage/word-201_97ec941f.mp3"
  },
  "被子": {
    "cantonese": "/manus-storage/word-202_b0170a9e.mp3",
    "mandarin": "/manus-storage/word-202_a73da5e3.mp3"
  },
  "毛巾": {
    "cantonese": "/manus-storage/word-200_e9e80b9d.mp3",
    "mandarin": "/manus-storage/word-200_0ee618c5.mp3"
  },
  "牙刷": {
    "cantonese": "/manus-storage/word-199_7c75e62d.mp3",
    "mandarin": "/manus-storage/word-199_5724a504.mp3"
  },
  "鏡子": {
    "cantonese": "/manus-storage/word-198_f0ffa6d1.mp3",
    "mandarin": "/manus-storage/word-198_ee680936.mp3"
  },
  "雨傘": {
    "cantonese": "/manus-storage/word-182_0dafd012.mp3",
    "mandarin": "/manus-storage/word-182_9b806320.mp3"
  },
  "電話": {
    "cantonese": "/manus-storage/word-184_8fbf2232.mp3",
    "mandarin": "/manus-storage/word-184_ace41c0e.mp3"
  },
  "電腦": {
    "cantonese": "/manus-storage/word-186_a90e0c4a.mp3",
    "mandarin": "/manus-storage/word-186_67ce10f7.mp3"
  },
  "電視": {
    "cantonese": "/manus-storage/word-187_09981224.mp3",
    "mandarin": "/manus-storage/word-187_616f8a5f.mp3"
  },
  "時鐘": {
    "cantonese": "/manus-storage/word-185_619700bc.mp3",
    "mandarin": "/manus-storage/word-185_1099a202.mp3"
  },
  "背包": {
    "cantonese": "/manus-storage/word-196_a2db4c63.mp3",
    "mandarin": "/manus-storage/word-196_757bb1a3.mp3"
  },
  "鑰匙": {
    "cantonese": "/manus-storage/cantonese-key_85a5c256.wav",
    "mandarin": "/manus-storage/mandarin-key_50a4e95d.wav"
  },
  "燈": {
    "cantonese": "/manus-storage/word-210_e40a913a.mp3",
    "mandarin": "/manus-storage/word-210_90d05871.mp3"
  },
  "風扇": {
    "cantonese": "/manus-storage/word-203_bc4a8f30.mp3",
    "mandarin": "/manus-storage/word-203_fcc79294.mp3"
  },
  "冰箱": {
    "cantonese": "/manus-storage/cantonese-refrigerator_6ad3f8d8.wav",
    "mandarin": "/manus-storage/mandarin-refrigerator_9c4c80b7.wav"
  },
  "相機": {
    "cantonese": "/manus-storage/word-206_5bb976df.mp3",
    "mandarin": "/manus-storage/word-206_2d35cad7.mp3"
  },
  "錢包": {
    "cantonese": "/manus-storage/word-208_dba2ec5d.mp3",
    "mandarin": "/manus-storage/word-208_89b48a33.mp3"
  },
  "衣服": {
    "cantonese": "/manus-storage/word-193_b2753aea.mp3",
    "mandarin": "/manus-storage/word-193_dc301714.mp3"
  },
  "鞋子": {
    "cantonese": "/manus-storage/word-194_4f5d4990.mp3",
    "mandarin": "/manus-storage/word-194_4aecc438.mp3"
  },
  "皮球": {
    "cantonese": "/manus-storage/word-220_f412cac7.mp3",
    "mandarin": "/manus-storage/word-220_702abfb8.mp3"
  },
  "積木": {
    "cantonese": "/manus-storage/word-212_a8323d25.mp3",
    "mandarin": "/manus-storage/word-212_cb741ed6.mp3"
  },
  "洋娃娃": {
    "cantonese": "/manus-storage/word-213_85c69977.mp3",
    "mandarin": "/manus-storage/word-213_db739d22.mp3"
  },
  "玩具車": {
    "cantonese": "/manus-storage/word-214_fe5221e0.mp3",
    "mandarin": "/manus-storage/word-214_5a78812b.mp3"
  },
  "玩偶": {
    "cantonese": "/manus-storage/cantonese-doll_14b5bc32.wav",
    "mandarin": "/manus-storage/mandarin-doll_90bf20e0.wav"
  },
  "拼圖": {
    "cantonese": "/manus-storage/word-216_86f62ae4.mp3",
    "mandarin": "/manus-storage/word-216_9403fd91.mp3"
  },
  "風箏": {
    "cantonese": "/manus-storage/word-217_8dd57303.mp3",
    "mandarin": "/manus-storage/word-217_9c122c2a.mp3"
  },
  "陀螺": {
    "cantonese": "/manus-storage/word-218_53ffea2d.mp3",
    "mandarin": "/manus-storage/word-218_0c39799b.mp3"
  },
  "跳繩": {
    "cantonese": "/manus-storage/word-219_1e8262e8.mp3",
    "mandarin": "/manus-storage/word-219_20d74038.mp3"
  },
  "氣球": {
    "cantonese": "/manus-storage/cantonese-balloon_51a5f6ce.wav",
    "mandarin": "/manus-storage/mandarin-balloon_a485b040.wav"
  },
  "飛盤": {
    "cantonese": "/manus-storage/word-221_3ff19f1e.mp3",
    "mandarin": "/manus-storage/word-221_21490ea4.mp3"
  },
  "滑板": {
    "cantonese": "/manus-storage/word-222_0c9da999.mp3",
    "mandarin": "/manus-storage/word-222_2213eb0d.mp3"
  },
  "遊戲卡": {
    "cantonese": "/manus-storage/word-223_f5930df0.mp3",
    "mandarin": "/manus-storage/word-223_3248475e.mp3"
  },
  "畫筆": {
    "cantonese": "/manus-storage/word-224_3d9eb3e6.mp3",
    "mandarin": "/manus-storage/word-224_1487e0e5.mp3"
  },
  "顏色筆": {
    "cantonese": "/manus-storage/word-225_9684ed0b.mp3",
    "mandarin": "/manus-storage/word-225_33ac2a39.mp3"
  },
  "蠟筆": {
    "cantonese": "/manus-storage/word-226_8d114572.mp3",
    "mandarin": "/manus-storage/word-226_b4596fa2.mp3"
  },
  "貼紙": {
    "cantonese": "/manus-storage/word-227_fa2b4002.mp3",
    "mandarin": "/manus-storage/word-227_665ff4a3.mp3"
  },
  "玩具熊": {
    "cantonese": "/manus-storage/word-229_e17fbc2c.mp3",
    "mandarin": "/manus-storage/word-229_a2dc1f78.mp3"
  },
  "樂高": {
    "cantonese": "/manus-storage/word-230_e9875644.mp3",
    "mandarin": "/manus-storage/word-230_7cebb4bc.mp3"
  },
  "棋子": {
    "cantonese": "/manus-storage/word-231_41d7181d.mp3",
    "mandarin": "/manus-storage/word-231_5c949135.mp3"
  },
  "骰子": {
    "cantonese": "/manus-storage/word-232_ed6bd83d.mp3",
    "mandarin": "/manus-storage/word-232_f8385825.mp3"
  },
  "紙牌": {
    "cantonese": "/manus-storage/word-233_759b967a.mp3",
    "mandarin": "/manus-storage/word-233_8c77eae9.mp3"
  },
  "沙包": {
    "cantonese": "/manus-storage/word-234_d41a74d4.mp3",
    "mandarin": "/manus-storage/word-234_d18dc13f.mp3"
  },
  "呼拉圈": {
    "cantonese": "/manus-storage/word-235_a6eb2307.mp3",
    "mandarin": "/manus-storage/word-235_d91fb0cd.mp3"
  },
  "黏土": {
    "cantonese": "/manus-storage/word-236_c620bad9.mp3",
    "mandarin": "/manus-storage/word-236_91080680.mp3"
  },
  "吹泡泡": {
    "cantonese": "/manus-storage/word-237_8bd89eae.mp3",
    "mandarin": "/manus-storage/word-237_a48676c6.mp3"
  },
  "木馬": {
    "cantonese": "/manus-storage/word-238_d9fd124f.mp3",
    "mandarin": "/manus-storage/word-238_12f302a8.mp3"
  },
  "玩具屋": {
    "cantonese": "/manus-storage/word-239_93cc53e4.mp3",
    "mandarin": "/manus-storage/word-239_ebdfcbed.mp3"
  },
  "玩具電話": {
    "cantonese": "/manus-storage/word-240_353cca1b.mp3",
    "mandarin": "/manus-storage/word-240_6a5520a9.mp3"
  },
  "火車模型": {
    "cantonese": "/manus-storage/graded-049_a29a311e.mp3",
    "mandarin": "/manus-storage/graded-049_b42ffe9d.mp3"
  },
  "汽車": {
    "cantonese": "/manus-storage/word-241_6c9deed5.mp3",
    "mandarin": "/manus-storage/word-241_20e90b21.mp3"
  },
  "巴士": {
    "cantonese": "/manus-storage/word-242_0a718265.mp3",
    "mandarin": "/manus-storage/mandarin-gong1-jiao1-che1_ba6f55d3.wav"
  },
  "的士": {
    "cantonese": "/manus-storage/word-243_84079b8b.mp3",
    "mandarin": "/manus-storage/mandarin-chu1-zu1-che1_69e83860.wav"
  },
  "地鐵": {
    "cantonese": "/manus-storage/word-244_73128e4f.mp3",
    "mandarin": "/manus-storage/word-244_fec70c45.mp3"
  },
  "火車": {
    "cantonese": "/manus-storage/word-245_f927e4ed.mp3",
    "mandarin": "/manus-storage/word-245_5ed51d9d.mp3"
  },
  "電車": {
    "cantonese": "/manus-storage/word-246_428c5af2.mp3",
    "mandarin": "/manus-storage/word-246_dc60c38a.mp3"
  },
  "渡輪": {
    "cantonese": "/manus-storage/word-247_749c66ed.mp3",
    "mandarin": "/manus-storage/word-247_bbc336cc.mp3"
  },
  "飛機": {
    "cantonese": "/manus-storage/word-248_3595fabd.mp3",
    "mandarin": "/manus-storage/word-248_d4c8a532.mp3"
  },
  "單車": {
    "cantonese": "/manus-storage/word-249_50e78855.mp3",
    "mandarin": "/manus-storage/mandarin-zi4-xing2-che1_0c9542b3.wav"
  },
  "校巴": {
    "cantonese": "/manus-storage/word-250_31024e79.mp3",
    "mandarin": "/manus-storage/word-250_8bc3abf6.mp3"
  },
  "救護車": {
    "cantonese": "/manus-storage/word-251_bb94e79c.mp3",
    "mandarin": "/manus-storage/word-251_3b92d0a9.mp3"
  },
  "消防車": {
    "cantonese": "/manus-storage/word-252_bbb6b672.mp3",
    "mandarin": "/manus-storage/word-252_9688b8ea.mp3"
  },
  "貨車": {
    "cantonese": "/manus-storage/word-253_ed3ec4ef.mp3",
    "mandarin": "/manus-storage/word-253_7604d8a4.mp3"
  },
  "電單車": {
    "cantonese": "/manus-storage/word-254_33291b87.mp3",
    "mandarin": "/manus-storage/word-254_fb897325.mp3"
  },
  "船": {
    "cantonese": "/manus-storage/word-255_bd8e9c07.mp3",
    "mandarin": "/manus-storage/word-255_7d33100b.mp3"
  },
  "隧道": {
    "cantonese": "/manus-storage/word-256_a3e0d4f6.mp3",
    "mandarin": "/manus-storage/word-256_6033dad7.mp3"
  },
  "站牌": {
    "cantonese": "/manus-storage/word-257_310450cd.mp3",
    "mandarin": "/manus-storage/word-257_90aca27e.mp3"
  },
  "車站": {
    "cantonese": "/manus-storage/word-258_19ea3711.mp3",
    "mandarin": "/manus-storage/word-258_96cc94b0.mp3"
  },
  "機場": {
    "cantonese": "/manus-storage/word-259_2016c664.mp3",
    "mandarin": "/manus-storage/word-259_aae93a02.mp3"
  },
  "港口": {
    "cantonese": "/manus-storage/word-260_399dd63a.mp3",
    "mandarin": "/manus-storage/word-260_52cbb24a.mp3"
  },
  "路軌": {
    "cantonese": "/manus-storage/word-261_59368900.mp3",
    "mandarin": "/manus-storage/word-261_3d1c1380.mp3"
  },
  "交通燈": {
    "cantonese": "/manus-storage/word-262_1ebecc81.mp3",
    "mandarin": "/manus-storage/word-262_a216809f.mp3"
  },
  "斑馬線": {
    "cantonese": "/manus-storage/word-263_fa8f4849.mp3",
    "mandarin": "/manus-storage/word-263_bdb154f5.mp3"
  },
  "車票": {
    "cantonese": "/manus-storage/word-264_5c426524.mp3",
    "mandarin": "/manus-storage/word-264_b099f4af.mp3"
  },
  "八達通": {
    "cantonese": "/manus-storage/word-265_d732c322.mp3",
    "mandarin": "/manus-storage/word-265_3f1396bf.mp3"
  },
  "方向盤": {
    "cantonese": "/manus-storage/word-266_5b35b1dc.mp3",
    "mandarin": "/manus-storage/word-266_d45a6692.mp3"
  },
  "車門": {
    "cantonese": "/manus-storage/word-267_5c426358.mp3",
    "mandarin": "/manus-storage/word-267_12e9bea4.mp3"
  },
  "車窗": {
    "cantonese": "/manus-storage/word-268_4534c99b.mp3",
    "mandarin": "/manus-storage/word-268_6222df8e.mp3"
  },
  "車輪": {
    "cantonese": "/manus-storage/word-269_21d41c65.mp3",
    "mandarin": "/manus-storage/word-269_c7af12a3.mp3"
  },
  "安全帶": {
    "cantonese": "/manus-storage/word-270_a50fc9e5.mp3",
    "mandarin": "/manus-storage/word-270_4d3fc398.mp3"
  },
  "櫻桃": {
    "cantonese": "/manus-storage/cantonese-ce1-lei4-zi2_32f4825b.wav",
    "mandarin": "/manus-storage/mandarin-cherry_affdf596.wav"
  },
  "哈密瓜": {
    "cantonese": "/manus-storage/word-013_41b0f331.mp3",
    "mandarin": "/manus-storage/word-013_add509d8.mp3"
  },
  "檸檬": {
    "cantonese": "/manus-storage/word-014_9f71523c.mp3",
    "mandarin": "/manus-storage/word-014_4d71e954.mp3"
  },
  "木瓜": {
    "cantonese": "/manus-storage/word-015_c9f62a77.mp3",
    "mandarin": "/manus-storage/word-015_754c006c.mp3"
  },
  "馬鈴薯": {
    "cantonese": "/manus-storage/word-026_dbb208cc.mp3",
    "mandarin": "/manus-storage/word-026_a12436a5.mp3"
  },
  "白飯": {
    "cantonese": "/manus-storage/word-019_f0e39da3.mp3",
    "mandarin": "/manus-storage/word-019_d080a862.mp3"
  },
  "肉丸": {
    "cantonese": "/manus-storage/graded-050_0a7ce7a3.mp3",
    "mandarin": "/manus-storage/graded-050_ef49368a.mp3"
  },
  "炒飯": {
    "cantonese": "/manus-storage/graded-051_c242560c.mp3",
    "mandarin": "/manus-storage/graded-051_866574a9.mp3"
  },
  "炒麵": {
    "cantonese": "/manus-storage/graded-052_9c2db925.mp3",
    "mandarin": "/manus-storage/graded-052_a6fb078e.mp3"
  },
  "餛飩": {
    "cantonese": "/manus-storage/cantonese-wonton_dc4db74a.wav",
    "mandarin": "/manus-storage/mandarin-wonton_90dd5cf3.wav"
  },
  "水餃": {
    "cantonese": "/manus-storage/graded-054_681eacff.mp3",
    "mandarin": "/manus-storage/graded-054_e15a6fa9.mp3"
  },
  "燒賣": {
    "cantonese": "/manus-storage/graded-055_5d377838.mp3",
    "mandarin": "/manus-storage/graded-055_a97bd77f.mp3"
  },
  "包子": {
    "cantonese": "/manus-storage/graded-056_093a99a3.mp3",
    "mandarin": "/manus-storage/graded-056_7513e244.mp3"
  },
  "三文治": {
    "cantonese": "/manus-storage/graded-057_1136c786.mp3",
    "mandarin": "/manus-storage/graded-057_fe1373c6.mp3"
  },
  "漢堡包": {
    "cantonese": "/manus-storage/graded-058_0a509a71.mp3",
    "mandarin": "/manus-storage/graded-058_44077b52.mp3"
  },
  "意粉": {
    "cantonese": "/manus-storage/graded-059_e302623c.mp3",
    "mandarin": "/manus-storage/graded-059_d99b1cc4.mp3"
  },
  "薄餅": {
    "cantonese": "/manus-storage/graded-060_e663b782.mp3",
    "mandarin": "/manus-storage/graded-060_3ef1d25d.mp3"
  },
  "沙律": {
    "cantonese": "/manus-storage/graded-061_7f46535c.mp3",
    "mandarin": "/manus-storage/graded-061_f110fc7c.mp3"
  },
  "壽司": {
    "cantonese": "/manus-storage/graded-062_649d2ae8.mp3",
    "mandarin": "/manus-storage/graded-062_a2e73882.mp3"
  },
  "豆腐": {
    "cantonese": "/manus-storage/graded-063_d3d3185b.mp3",
    "mandarin": "/manus-storage/graded-063_611e1671.mp3"
  },
  "南瓜": {
    "cantonese": "/manus-storage/graded-064_fcf2c3cf.mp3",
    "mandarin": "/manus-storage/graded-064_cfdf04bb.mp3"
  },
  "冬瓜": {
    "cantonese": "/manus-storage/graded-065_80fe4e02.mp3",
    "mandarin": "/manus-storage/graded-065_71710743.mp3"
  },
  "青瓜": {
    "cantonese": "/manus-storage/graded-066_a5902337.mp3",
    "mandarin": "/manus-storage/graded-066_f40e8477.mp3"
  },
  "紅蘿蔔": {
    "cantonese": "/manus-storage/graded-067_04592999.mp3",
    "mandarin": "/manus-storage/graded-067_bc112587.mp3"
  },
  "洋蔥": {
    "cantonese": "/manus-storage/graded-068_273ddf26.mp3",
    "mandarin": "/manus-storage/graded-068_504ccd9a.mp3"
  },
  "西蘭花": {
    "cantonese": "/manus-storage/graded-069_a23569d3.mp3",
    "mandarin": "/manus-storage/graded-069_d8554a5f.mp3"
  },
  "蘑菇": {
    "cantonese": "/manus-storage/graded-070_1a4d6349.mp3",
    "mandarin": "/manus-storage/graded-070_b87489c4.mp3"
  },
  "蜜糖": {
    "cantonese": "/manus-storage/graded-071_ab43315c.mp3",
    "mandarin": "/manus-storage/graded-071_d6873437.mp3"
  },
  "花生": {
    "cantonese": "/manus-storage/graded-072_d09b303a.mp3",
    "mandarin": "/manus-storage/graded-072_6ddc3686.mp3"
  },
  "臘腸": {
    "cantonese": "/manus-storage/graded-073_c198e5bf.mp3",
    "mandarin": "/manus-storage/graded-073_6964fd5b.mp3"
  },
  "滿意": {
    "cantonese": "/manus-storage/word-041_25cb4028.mp3",
    "mandarin": "/manus-storage/word-041_d08aa6d6.mp3"
  },
  "驕傲": {
    "cantonese": "/manus-storage/word-042_512ddb27.mp3",
    "mandarin": "/manus-storage/word-042_ac1ae139.mp3"
  },
  "感動": {
    "cantonese": "/manus-storage/word-045_ebf38526.mp3",
    "mandarin": "/manus-storage/word-045_742cbdd9.mp3"
  },
  "失望": {
    "cantonese": "/manus-storage/word-046_84e39360.mp3",
    "mandarin": "/manus-storage/word-046_ef1e376a.mp3"
  },
  "焦慮": {
    "cantonese": "/manus-storage/word-047_5fed9d07.mp3",
    "mandarin": "/manus-storage/word-047_df85f747.mp3"
  },
  "自信": {
    "cantonese": "/manus-storage/word-048_9ad4fdc1.mp3",
    "mandarin": "/manus-storage/word-048_711f86e0.mp3"
  },
  "羞愧": {
    "cantonese": "/manus-storage/word-049_61c853ac.mp3",
    "mandarin": "/manus-storage/word-049_31e46c25.mp3"
  },
  "嫉妒": {
    "cantonese": "/manus-storage/word-050_4f57a5a5.mp3",
    "mandarin": "/manus-storage/word-050_18f4a8c4.mp3"
  },
  "期待": {
    "cantonese": "/manus-storage/word-051_e2c710d7.mp3",
    "mandarin": "/manus-storage/word-051_54e4937d.mp3"
  },
  "煩惱": {
    "cantonese": "/manus-storage/word-052_c6a37377.mp3",
    "mandarin": "/manus-storage/word-052_8cc0f7e5.mp3"
  },
  "孤單": {
    "cantonese": "/manus-storage/word-053_645124e9.mp3",
    "mandarin": "/manus-storage/word-053_229702a0.mp3"
  },
  "疲倦": {
    "cantonese": "/manus-storage/word-054_6c635454.mp3",
    "mandarin": "/manus-storage/word-054_fb3deefe.mp3"
  },
  "平靜": {
    "cantonese": "/manus-storage/word-055_f86ee328.mp3",
    "mandarin": "/manus-storage/word-055_dad0540e.mp3"
  },
  "溫柔": {
    "cantonese": "/manus-storage/word-056_bc6ba17d.mp3",
    "mandarin": "/manus-storage/word-056_85043929.mp3"
  },
  "關心": {
    "cantonese": "/manus-storage/word-057_53e73ff2.mp3",
    "mandarin": "/manus-storage/word-057_bf54050c.mp3"
  },
  "感謝": {
    "cantonese": "/manus-storage/word-058_a8fe75b5.mp3",
    "mandarin": "/manus-storage/word-058_674bb21e.mp3"
  },
  "希望": {
    "cantonese": "/manus-storage/word-059_3f86c83f.mp3",
    "mandarin": "/manus-storage/word-059_cb839a6e.mp3"
  },
  "信任": {
    "cantonese": "/manus-storage/word-060_28581414.mp3",
    "mandarin": "/manus-storage/word-060_5c1aaede.mp3"
  },
  "尊重": {
    "cantonese": "/manus-storage/word-389_c44195b6.mp3",
    "mandarin": "/manus-storage/word-389_e48107d0.mp3"
  },
  "同情": {
    "cantonese": "/manus-storage/word-390_0c4f191d.mp3",
    "mandarin": "/manus-storage/word-390_26d3b274.mp3"
  },
  "寬容": {
    "cantonese": "/manus-storage/word-391_9ff760c0.mp3",
    "mandarin": "/manus-storage/word-391_ec130271.mp3"
  },
  "體諒": {
    "cantonese": "/manus-storage/word-392_152a76e6.mp3",
    "mandarin": "/manus-storage/word-392_6118725f.mp3"
  },
  "慚愧": {
    "cantonese": "/manus-storage/word-393_954a6413.mp3",
    "mandarin": "/manus-storage/word-393_29fb265b.mp3"
  },
  "沮喪": {
    "cantonese": "/manus-storage/word-396_e74630d8.mp3",
    "mandarin": "/manus-storage/word-396_43723a58.mp3"
  },
  "挫折": {
    "cantonese": "/manus-storage/word-397_8c3a55eb.mp3",
    "mandarin": "/manus-storage/word-397_922218f5.mp3"
  },
  "壓力": {
    "cantonese": "/manus-storage/word-398_beebfde2.mp3",
    "mandarin": "/manus-storage/word-398_d2930e05.mp3"
  },
  "困惑": {
    "cantonese": "/manus-storage/word-399_db6254ed.mp3",
    "mandarin": "/manus-storage/word-399_030a6738.mp3"
  },
  "內疚": {
    "cantonese": "/manus-storage/word-400_19f6561f.mp3",
    "mandarin": "/manus-storage/word-400_0af74999.mp3"
  },
  "樂觀": {
    "cantonese": "/manus-storage/word-401_633d4a8c.mp3",
    "mandarin": "/manus-storage/word-401_c34398f5.mp3"
  },
  "悲觀": {
    "cantonese": "/manus-storage/word-402_ee5165a1.mp3",
    "mandarin": "/manus-storage/word-402_5c76b03b.mp3"
  },
  "狐狸": {
    "cantonese": "/manus-storage/word-082_8dc0c7fe.mp3",
    "mandarin": "/manus-storage/word-082_80466bc2.mp3"
  },
  "狼": {
    "cantonese": "/manus-storage/word-083_d4a4258b.mp3",
    "mandarin": "/manus-storage/word-083_dc2ab3e6.mp3"
  },
  "海龜": {
    "cantonese": "/manus-storage/word-084_ce81ed81.mp3",
    "mandarin": "/manus-storage/word-084_2cd70c03.mp3"
  },
  "海星": {
    "cantonese": "/manus-storage/word-086_a53e4c3d.mp3",
    "mandarin": "/manus-storage/word-086_6fb83f6a.mp3"
  },
  "八爪魚": {
    "cantonese": "/manus-storage/word-087_dd253407.mp3",
    "mandarin": "/manus-storage/word-087_ba701f98.mp3"
  },
  "鸚鵡": {
    "cantonese": "/manus-storage/word-088_04b67a33.mp3",
    "mandarin": "/manus-storage/word-088_67e5e5e4.mp3"
  },
  "駱駝": {
    "cantonese": "/manus-storage/word-079_0e4d0b99.mp3",
    "mandarin": "/manus-storage/word-079_202a8169.mp3"
  },
  "章魚": {
    "cantonese": "/manus-storage/graded-074_e4cc4fb7.mp3",
    "mandarin": "/manus-storage/graded-074_d3c206f4.mp3"
  },
  "貓頭鷹": {
    "cantonese": "/manus-storage/graded-075_b23b4aa7.mp3",
    "mandarin": "/manus-storage/graded-075_422ef0bd.mp3"
  },
  "斑點狗": {
    "cantonese": "/manus-storage/graded-076_e12c7f42.mp3",
    "mandarin": "/manus-storage/graded-076_f9e23c3b.mp3"
  },
  "牧羊犬": {
    "cantonese": "/manus-storage/graded-077_f0697a61.mp3",
    "mandarin": "/manus-storage/graded-077_1aaf203c.mp3"
  },
  "梅花鹿": {
    "cantonese": "/manus-storage/graded-078_4d82b295.mp3",
    "mandarin": "/manus-storage/graded-078_87285efc.mp3"
  },
  "黑猩猩": {
    "cantonese": "/manus-storage/graded-079_7c815910.mp3",
    "mandarin": "/manus-storage/graded-079_af3a5109.mp3"
  },
  "孔雀": {
    "cantonese": "/manus-storage/graded-080_7baedbc5.mp3",
    "mandarin": "/manus-storage/graded-080_b2cc8151.mp3"
  },
  "天鵝": {
    "cantonese": "/manus-storage/graded-081_15b9efc7.mp3",
    "mandarin": "/manus-storage/graded-081_78c5344c.mp3"
  },
  "鯊魚": {
    "cantonese": "/manus-storage/graded-082_ebdbf029.mp3",
    "mandarin": "/manus-storage/graded-082_598d4e88.mp3"
  },
  "海馬": {
    "cantonese": "/manus-storage/graded-083_c960e0f8.mp3",
    "mandarin": "/manus-storage/graded-083_053fb0aa.mp3"
  },
  "珊瑚魚": {
    "cantonese": "/manus-storage/graded-084_21f1e43c.mp3",
    "mandarin": "/manus-storage/graded-084_a0969310.mp3"
  },
  "螞蟻": {
    "cantonese": "/manus-storage/graded-085_73d6bae4.mp3",
    "mandarin": "/manus-storage/graded-085_d2857b6c.mp3"
  },
  "蜘蛛": {
    "cantonese": "/manus-storage/graded-086_188ae167.mp3",
    "mandarin": "/manus-storage/graded-086_43b625ed.mp3"
  },
  "蚯蚓": {
    "cantonese": "/manus-storage/graded-087_0871007c.mp3",
    "mandarin": "/manus-storage/graded-087_d6181022.mp3"
  },
  "蝸牛": {
    "cantonese": "/manus-storage/graded-088_e61ce79d.mp3",
    "mandarin": "/manus-storage/graded-088_517a5680.mp3"
  },
  "螳螂": {
    "cantonese": "/manus-storage/graded-089_efd06a0d.mp3",
    "mandarin": "/manus-storage/graded-089_2cf23791.mp3"
  },
  "甲蟲": {
    "cantonese": "/manus-storage/graded-090_6d17d6af.mp3",
    "mandarin": "/manus-storage/graded-090_555fd5e0.mp3"
  },
  "蜥蜴": {
    "cantonese": "/manus-storage/graded-091_c6375bb5.mp3",
    "mandarin": "/manus-storage/graded-091_a70a62c3.mp3"
  },
  "鱷魚": {
    "cantonese": "/manus-storage/graded-092_741b615c.mp3",
    "mandarin": "/manus-storage/graded-092_2e61fb30.mp3"
  },
  "犀牛": {
    "cantonese": "/manus-storage/graded-093_a1d10512.mp3",
    "mandarin": "/manus-storage/graded-093_55e62695.mp3"
  },
  "獵豹": {
    "cantonese": "/manus-storage/graded-094_e396b9f1.mp3",
    "mandarin": "/manus-storage/graded-094_dc4ed9f0.mp3"
  },
  "駱馬": {
    "cantonese": "/manus-storage/graded-095_c20c834f.mp3",
    "mandarin": "/manus-storage/graded-095_83a69a22.mp3"
  },
  "海豹": {
    "cantonese": "/manus-storage/graded-096_a7d38e44.mp3",
    "mandarin": "/manus-storage/graded-096_e9c019d2.mp3"
  },
  "湖水藍": {
    "cantonese": "/manus-storage/word-109_21f87146.mp3",
    "mandarin": "/manus-storage/word-109_67ca4441.mp3"
  },
  "墨綠色": {
    "cantonese": "/manus-storage/word-110_019e9ea9.mp3",
    "mandarin": "/manus-storage/word-110_34e93ab1.mp3"
  },
  "淺紫色": {
    "cantonese": "/manus-storage/word-114_aa357f3f.mp3",
    "mandarin": "/manus-storage/word-114_c5a3a3c8.mp3"
  },
  "深紫色": {
    "cantonese": "/manus-storage/word-115_94a43478.mp3",
    "mandarin": "/manus-storage/word-115_ab5a43ff.mp3"
  },
  "玫瑰紅": {
    "cantonese": "/manus-storage/graded-097_fc212601.mp3",
    "mandarin": "/manus-storage/graded-097_8bba578e.mp3"
  },
  "青綠色": {
    "cantonese": "/manus-storage/graded-098_aede18a8.mp3",
    "mandarin": "/manus-storage/graded-098_4f21c87d.mp3"
  },
  "深灰色": {
    "cantonese": "/manus-storage/graded-099_8a1c6d29.mp3",
    "mandarin": "/manus-storage/graded-099_9f3098df.mp3"
  },
  "淺灰色": {
    "cantonese": "/manus-storage/graded-100_40a2cc80.mp3",
    "mandarin": "/manus-storage/graded-100_24c05554.mp3"
  },
  "檸檬黃": {
    "cantonese": "/manus-storage/graded-101_ab9bec70.mp3",
    "mandarin": "/manus-storage/graded-101_b559f52c.mp3"
  },
  "橄欖綠": {
    "cantonese": "/manus-storage/graded-102_4c309f7d.mp3",
    "mandarin": "/manus-storage/graded-102_897fffa0.mp3"
  },
  "藏青色": {
    "cantonese": "/manus-storage/graded-103_ec22ea52.mp3",
    "mandarin": "/manus-storage/graded-103_0aca5442.mp3"
  },
  "酒紅色": {
    "cantonese": "/manus-storage/graded-104_339f6c73.mp3",
    "mandarin": "/manus-storage/graded-104_c37fd2d3.mp3"
  },
  "朱紅色": {
    "cantonese": "/manus-storage/graded-105_fb9e2f9d.mp3",
    "mandarin": "/manus-storage/graded-105_58c7f7e4.mp3"
  },
  "鵝黃色": {
    "cantonese": "/manus-storage/graded-106_cd657cc0.mp3",
    "mandarin": "/manus-storage/graded-106_2a6d89b3.mp3"
  },
  "香檳色": {
    "cantonese": "/manus-storage/graded-107_51e1aefe.mp3",
    "mandarin": "/manus-storage/graded-107_9389d57c.mp3"
  },
  "珊瑚色": {
    "cantonese": "/manus-storage/graded-108_b3372a58.mp3",
    "mandarin": "/manus-storage/graded-108_98dbea1e.mp3"
  },
  "靛藍色": {
    "cantonese": "/manus-storage/graded-109_5551b4a7.mp3",
    "mandarin": "/manus-storage/graded-109_ae689ba3.mp3"
  },
  "薄荷綠": {
    "cantonese": "/manus-storage/graded-110_cd99ca98.mp3",
    "mandarin": "/manus-storage/graded-110_df553e3c.mp3"
  },
  "青藍色": {
    "cantonese": "/manus-storage/graded-111_0c94b753.mp3",
    "mandarin": "/manus-storage/graded-111_5fec8260.mp3"
  },
  "煙灰色": {
    "cantonese": "/manus-storage/graded-112_3e1f939f.mp3",
    "mandarin": "/manus-storage/graded-112_65859934.mp3"
  },
  "象牙白": {
    "cantonese": "/manus-storage/graded-113_96fb6c59.mp3",
    "mandarin": "/manus-storage/graded-113_1bc683c7.mp3"
  },
  "栗色": {
    "cantonese": "/manus-storage/graded-114_882e3657.mp3",
    "mandarin": "/manus-storage/graded-114_f5728217.mp3"
  },
  "咖啡色": {
    "cantonese": "/manus-storage/graded-115_91e05f01.mp3",
    "mandarin": "/manus-storage/graded-115_36146bde.mp3"
  },
  "磚紅色": {
    "cantonese": "/manus-storage/graded-116_9d428e2f.mp3",
    "mandarin": "/manus-storage/graded-116_fa135a9f.mp3"
  },
  "暖色": {
    "cantonese": "/manus-storage/graded-117_acd037e9.mp3",
    "mandarin": "/manus-storage/graded-117_cba32948.mp3"
  },
  "冷色": {
    "cantonese": "/manus-storage/graded-118_308e8234.mp3",
    "mandarin": "/manus-storage/graded-118_5f1c3a87.mp3"
  },
  "主色": {
    "cantonese": "/manus-storage/graded-119_89c22dd6.mp3",
    "mandarin": "/manus-storage/graded-119_9dfa6753.mp3"
  },
  "調色": {
    "cantonese": "/manus-storage/graded-120_dcc1d987.mp3",
    "mandarin": "/manus-storage/graded-120_b368909a.mp3"
  },
  "顏料": {
    "cantonese": "/manus-storage/graded-121_4486a07b.mp3",
    "mandarin": "/manus-storage/graded-121_02ce5bea.mp3"
  },
  "色彩": {
    "cantonese": "/manus-storage/graded-122_08c36d26.mp3",
    "mandarin": "/manus-storage/graded-122_9aee7721.mp3"
  },
  "額頭": {
    "cantonese": "/manus-storage/graded-123_eef350f1.mp3",
    "mandarin": "/manus-storage/graded-123_f4fe24eb.mp3"
  },
  "太陽穴": {
    "cantonese": "/manus-storage/graded-124_b720a3a1.mp3",
    "mandarin": "/manus-storage/graded-124_5f5987ba.mp3"
  },
  "臉蛋": {
    "cantonese": "/manus-storage/graded-125_42d38e8e.mp3",
    "mandarin": "/manus-storage/graded-125_d79c983d.mp3"
  },
  "下巴": {
    "cantonese": "/manus-storage/graded-126_103eb36f.mp3",
    "mandarin": "/manus-storage/graded-126_7914e1a7.mp3"
  },
  "喉嚨": {
    "cantonese": "/manus-storage/graded-127_0053554d.mp3",
    "mandarin": "/manus-storage/graded-127_8e9475ef.mp3"
  },
  "胸口": {
    "cantonese": "/manus-storage/graded-128_d71026c9.mp3",
    "mandarin": "/manus-storage/graded-128_2c3d9c24.mp3"
  },
  "肩胛": {
    "cantonese": "/manus-storage/graded-129_96e60cde.mp3",
    "mandarin": "/manus-storage/graded-129_b69a718a.mp3"
  },
  "骨頭": {
    "cantonese": "/manus-storage/graded-130_1eeb16a2.mp3",
    "mandarin": "/manus-storage/graded-130_3ac4b771.mp3"
  },
  "肌肉": {
    "cantonese": "/manus-storage/graded-131_c159a84f.mp3",
    "mandarin": "/manus-storage/graded-131_3611b979.mp3"
  },
  "血液": {
    "cantonese": "/manus-storage/graded-132_84530e09.mp3",
    "mandarin": "/manus-storage/graded-132_6180d9a1.mp3"
  },
  "胃": {
    "cantonese": "/manus-storage/graded-133_e928362f.mp3",
    "mandarin": "/manus-storage/graded-133_6de2e481.mp3"
  },
  "腸子": {
    "cantonese": "/manus-storage/graded-134_ded562dd.mp3",
    "mandarin": "/manus-storage/graded-134_be897b05.mp3"
  },
  "肝臟": {
    "cantonese": "/manus-storage/graded-135_b2f6488f.mp3",
    "mandarin": "/manus-storage/graded-135_c337598b.mp3"
  },
  "腎臟": {
    "cantonese": "/manus-storage/graded-136_6ff91f10.mp3",
    "mandarin": "/manus-storage/graded-136_02b8b027.mp3"
  },
  "手肘": {
    "cantonese": "/manus-storage/graded-137_378827b7.mp3",
    "mandarin": "/manus-storage/graded-137_3783a2ee.mp3"
  },
  "前臂": {
    "cantonese": "/manus-storage/graded-138_72c18204.mp3",
    "mandarin": "/manus-storage/graded-138_e4798cd3.mp3"
  },
  "小腿": {
    "cantonese": "/manus-storage/graded-139_1a7efaea.mp3",
    "mandarin": "/manus-storage/graded-139_52f93a8e.mp3"
  },
  "大腿": {
    "cantonese": "/manus-storage/graded-140_8998d3dc.mp3",
    "mandarin": "/manus-storage/graded-140_6e82ac22.mp3"
  },
  "腳踝": {
    "cantonese": "/manus-storage/graded-141_ef4a46a7.mp3",
    "mandarin": "/manus-storage/graded-141_6fbf72f7.mp3"
  },
  "腳跟": {
    "cantonese": "/manus-storage/graded-142_5ec2a3aa.mp3",
    "mandarin": "/manus-storage/graded-142_e8779536.mp3"
  },
  "髖部": {
    "cantonese": "/manus-storage/graded-143_9c7f0f37.mp3",
    "mandarin": "/manus-storage/graded-143_88c6dce0.mp3"
  },
  "胸部": {
    "cantonese": "/manus-storage/graded-144_2e57f325.mp3",
    "mandarin": "/manus-storage/graded-144_f7e77bcc.mp3"
  },
  "脊骨": {
    "cantonese": "/manus-storage/graded-145_c5a4333b.mp3",
    "mandarin": "/manus-storage/graded-145_a44722bf.mp3"
  },
  "頭頂": {
    "cantonese": "/manus-storage/graded-146_0da75166.mp3",
    "mandarin": "/manus-storage/graded-146_be2d3490.mp3"
  },
  "關節": {
    "cantonese": "/manus-storage/graded-147_dc3340b9.mp3",
    "mandarin": "/manus-storage/graded-147_b85316d1.mp3"
  },
  "脈搏": {
    "cantonese": "/manus-storage/graded-148_3641afc4.mp3",
    "mandarin": "/manus-storage/graded-148_1dc1901a.mp3"
  },
  "呼吸": {
    "cantonese": "/manus-storage/graded-149_f67a2bd4.mp3",
    "mandarin": "/manus-storage/graded-149_e8e34690.mp3"
  },
  "視力": {
    "cantonese": "/manus-storage/graded-150_4271dc0c.mp3",
    "mandarin": "/manus-storage/graded-150_c94e0aba.mp3"
  },
  "聽力": {
    "cantonese": "/manus-storage/graded-151_76c9937c.mp3",
    "mandarin": "/manus-storage/graded-151_b2be9c6e.mp3"
  },
  "味覺": {
    "cantonese": "/manus-storage/graded-152_1754cd8b.mp3",
    "mandarin": "/manus-storage/graded-152_70aeb554.mp3"
  },
  "繼父": {
    "cantonese": "/manus-storage/graded-153_8fe5861f.mp3",
    "mandarin": "/manus-storage/graded-153_f51122c5.mp3"
  },
  "繼母": {
    "cantonese": "/manus-storage/graded-154_a639ef95.mp3",
    "mandarin": "/manus-storage/graded-154_00862b25.mp3"
  },
  "繼兄": {
    "cantonese": "/manus-storage/graded-155_33e08716.mp3",
    "mandarin": "/manus-storage/graded-155_d57edc2b.mp3"
  },
  "繼姐": {
    "cantonese": "/manus-storage/graded-156_e24501f6.mp3",
    "mandarin": "/manus-storage/graded-156_e88a0f04.mp3"
  },
  "女婿": {
    "cantonese": "/manus-storage/graded-157_d5bec9a1.mp3",
    "mandarin": "/manus-storage/graded-157_7cd7de90.mp3"
  },
  "媳婦": {
    "cantonese": "/manus-storage/graded-158_8405f511.mp3",
    "mandarin": "/manus-storage/graded-158_ca67fdad.mp3"
  },
  "侄子": {
    "cantonese": "/manus-storage/graded-159_8224be87.mp3",
    "mandarin": "/manus-storage/graded-159_13348fa4.mp3"
  },
  "侄女": {
    "cantonese": "/manus-storage/graded-160_e4115e1a.mp3",
    "mandarin": "/manus-storage/graded-160_e0daa21c.mp3"
  },
  "甥子": {
    "cantonese": "/manus-storage/graded-161_576c0864.mp3",
    "mandarin": "/manus-storage/graded-161_138f54f5.mp3"
  },
  "甥女": {
    "cantonese": "/manus-storage/graded-162_d02be7a0.mp3",
    "mandarin": "/manus-storage/graded-162_deb6f1c9.mp3"
  },
  "伯父": {
    "cantonese": "/manus-storage/graded-163_02d1cd7f.mp3",
    "mandarin": "/manus-storage/graded-163_20849e74.mp3"
  },
  "伯母": {
    "cantonese": "/manus-storage/graded-164_31129e8d.mp3",
    "mandarin": "/manus-storage/graded-164_c0dbb744.mp3"
  },
  "姨父": {
    "cantonese": "/manus-storage/graded-165_e31d0750.mp3",
    "mandarin": "/manus-storage/graded-165_c58b842e.mp3"
  },
  "姨母": {
    "cantonese": "/manus-storage/graded-166_7f3d7f80.mp3",
    "mandarin": "/manus-storage/graded-166_6d3143d1.mp3"
  },
  "乾爹": {
    "cantonese": "/manus-storage/graded-167_bab2da85.mp3",
    "mandarin": "/manus-storage/graded-167_d2b28a12.mp3"
  },
  "乾媽": {
    "cantonese": "/manus-storage/graded-168_f28c60c7.mp3",
    "mandarin": "/manus-storage/graded-168_e7f206f6.mp3"
  },
  "監護人": {
    "cantonese": "/manus-storage/graded-169_c6fe3278.mp3",
    "mandarin": "/manus-storage/graded-169_deb079e4.mp3"
  },
  "親家": {
    "cantonese": "/manus-storage/graded-170_f1986a86.mp3",
    "mandarin": "/manus-storage/graded-170_a1150925.mp3"
  },
  "手足": {
    "cantonese": "/manus-storage/graded-171_9a45d143.mp3",
    "mandarin": "/manus-storage/graded-171_46d154d5.mp3"
  },
  "夫婦": {
    "cantonese": "/manus-storage/graded-172_40585448.mp3",
    "mandarin": "/manus-storage/graded-172_eabc8f5a.mp3"
  },
  "夫妻": {
    "cantonese": "/manus-storage/graded-173_7302ba97.mp3",
    "mandarin": "/manus-storage/graded-173_59320a3d.mp3"
  },
  "家族": {
    "cantonese": "/manus-storage/graded-174_f9205f93.mp3",
    "mandarin": "/manus-storage/graded-174_6c9f7ea0.mp3"
  },
  "家務": {
    "cantonese": "/manus-storage/graded-175_ed0cf506.mp3",
    "mandarin": "/manus-storage/graded-175_22108532.mp3"
  },
  "家規": {
    "cantonese": "/manus-storage/graded-176_c45aa55a.mp3",
    "mandarin": "/manus-storage/graded-176_4aeebf41.mp3"
  },
  "家門": {
    "cantonese": "/manus-storage/graded-177_9e308d51.mp3",
    "mandarin": "/manus-storage/graded-177_85ebd94f.mp3"
  },
  "家鄉": {
    "cantonese": "/manus-storage/graded-178_0f4afc5f.mp3",
    "mandarin": "/manus-storage/graded-178_93058ec4.mp3"
  },
  "家庭照顧": {
    "cantonese": "/manus-storage/graded-179_ee3a65a3.mp3",
    "mandarin": "/manus-storage/graded-179_f989c70e.mp3"
  },
  "家庭聚會": {
    "cantonese": "/manus-storage/graded-180_0abf7ce8.mp3",
    "mandarin": "/manus-storage/graded-180_4634dbaf.mp3"
  },
  "親子": {
    "cantonese": "/manus-storage/graded-181_ba0b8956.mp3",
    "mandarin": "/manus-storage/graded-181_ba611781.mp3"
  },
  "親友": {
    "cantonese": "/manus-storage/graded-182_842d9366.mp3",
    "mandarin": "/manus-storage/graded-182_2ce8da19.mp3"
  },
  "鉛筆": {
    "cantonese": "/manus-storage/word-276_8888e63f.mp3",
    "mandarin": "/manus-storage/word-276_5e2c101d.mp3"
  },
  "橡皮": {
    "cantonese": "/manus-storage/word-277_e830b599.mp3",
    "mandarin": "/manus-storage/word-277_0e6792f3.mp3"
  },
  "尺子": {
    "cantonese": "/manus-storage/word-278_c2b2d249.mp3",
    "mandarin": "/manus-storage/word-278_2130edaf.mp3"
  },
  "書本": {
    "cantonese": "/manus-storage/word-275_c4eeeb50.mp3",
    "mandarin": "/manus-storage/word-275_8597fd2d.mp3"
  },
  "功課簿": {
    "cantonese": "/manus-storage/graded-183_4de0add7.mp3",
    "mandarin": "/manus-storage/graded-183_a507ab36.mp3"
  },
  "筆袋": {
    "cantonese": "/manus-storage/word-295_b61e9a61.mp3",
    "mandarin": "/manus-storage/word-295_1c57930c.mp3"
  },
  "膠水": {
    "cantonese": "/manus-storage/graded-184_ec3e8bc5.mp3",
    "mandarin": "/manus-storage/graded-184_d57909cf.mp3"
  },
  "剪刀": {
    "cantonese": "/manus-storage/graded-185_77fe320f.mp3",
    "mandarin": "/manus-storage/graded-185_3c6686d9.mp3"
  },
  "計算機": {
    "cantonese": "/manus-storage/graded-186_1360ef01.mp3",
    "mandarin": "/manus-storage/graded-186_1336451e.mp3"
  },
  "地球儀": {
    "cantonese": "/manus-storage/graded-187_ddefe991.mp3",
    "mandarin": "/manus-storage/graded-187_eec9580f.mp3"
  },
  "吹風機": {
    "cantonese": "/manus-storage/graded-188_8d204ae5.mp3",
    "mandarin": "/manus-storage/graded-188_52dd3918.mp3"
  },
  "洗衣機": {
    "cantonese": "/manus-storage/word-205_e403a385.mp3",
    "mandarin": "/manus-storage/word-205_2e347313.mp3"
  },
  "吸塵機": {
    "cantonese": "/manus-storage/graded-189_bca3d554.mp3",
    "mandarin": "/manus-storage/graded-189_8fe7c0dd.mp3"
  },
  "微波爐": {
    "cantonese": "/manus-storage/graded-190_fd3fc17f.mp3",
    "mandarin": "/manus-storage/graded-190_38c6c0b8.mp3"
  },
  "電飯煲": {
    "cantonese": "/manus-storage/graded-191_1fd83fc1.mp3",
    "mandarin": "/manus-storage/graded-191_be99f3e9.mp3"
  },
  "煮食爐": {
    "cantonese": "/manus-storage/graded-192_50b7541f.mp3",
    "mandarin": "/manus-storage/graded-192_3a9ad45f.mp3"
  },
  "水壺": {
    "cantonese": "/manus-storage/graded-193_698affa9.mp3",
    "mandarin": "/manus-storage/graded-193_637115a1.mp3"
  },
  "飯盒": {
    "cantonese": "/manus-storage/graded-194_4b677352.mp3",
    "mandarin": "/manus-storage/graded-194_8f12cc3d.mp3"
  },
  "保溫瓶": {
    "cantonese": "/manus-storage/graded-195_34641ac3.mp3",
    "mandarin": "/manus-storage/graded-195_5da167e5.mp3"
  },
  "耳機": {
    "cantonese": "/manus-storage/graded-196_e5474e36.mp3",
    "mandarin": "/manus-storage/graded-196_77ac2eb8.mp3"
  },
  "遙控器": {
    "cantonese": "/manus-storage/graded-197_a04ac7a0.mp3",
    "mandarin": "/manus-storage/graded-197_bcda4651.mp3"
  },
  "插頭": {
    "cantonese": "/manus-storage/graded-198_d8e32e21.mp3",
    "mandarin": "/manus-storage/graded-198_f9312265.mp3"
  },
  "充電器": {
    "cantonese": "/manus-storage/graded-199_760c19d4.mp3",
    "mandarin": "/manus-storage/graded-199_59de1d62.mp3"
  },
  "行李箱": {
    "cantonese": "/manus-storage/graded-200_b423a486.mp3",
    "mandarin": "/manus-storage/graded-200_4cf4d339.mp3"
  },
  "衣櫃": {
    "cantonese": "/manus-storage/graded-201_b552dc17.mp3",
    "mandarin": "/manus-storage/graded-201_d32b6207.mp3"
  },
  "鞋櫃": {
    "cantonese": "/manus-storage/graded-202_785aab11.mp3",
    "mandarin": "/manus-storage/graded-202_e454e166.mp3"
  },
  "書架": {
    "cantonese": "/manus-storage/graded-203_4da57b2f.mp3",
    "mandarin": "/manus-storage/graded-203_015fdbcd.mp3"
  },
  "抽屜": {
    "cantonese": "/manus-storage/graded-204_962e0b57.mp3",
    "mandarin": "/manus-storage/graded-204_733f237d.mp3"
  },
  "垃圾桶": {
    "cantonese": "/manus-storage/graded-205_4993d1da.mp3",
    "mandarin": "/manus-storage/graded-205_3b619929.mp3"
  },
  "回收箱": {
    "cantonese": "/manus-storage/graded-206_38b094a7.mp3",
    "mandarin": "/manus-storage/graded-206_cff86929.mp3"
  },
  "學校": {
    "cantonese": "/manus-storage/word-271_87eedf8d.mp3",
    "mandarin": "/manus-storage/word-271_0e785d5c.mp3"
  },
  "老師": {
    "cantonese": "/manus-storage/word-272_e85357be.mp3",
    "mandarin": "/manus-storage/word-272_33b232a0.mp3"
  },
  "同學": {
    "cantonese": "/manus-storage/word-273_71ab180a.mp3",
    "mandarin": "/manus-storage/word-273_b2f5b315.mp3"
  },
  "課室": {
    "cantonese": "/manus-storage/word-274_a5eaf21f.mp3",
    "mandarin": "/manus-storage/word-274_aeb112e2.mp3"
  },
  "閱讀": {
    "cantonese": "/manus-storage/word-280_8eb76fd9.mp3",
    "mandarin": "/manus-storage/word-280_52e37654.mp3"
  },
  "寫字": {
    "cantonese": "/manus-storage/word-281_59492c83.mp3",
    "mandarin": "/manus-storage/word-281_77fef5ac.mp3"
  },
  "數學": {
    "cantonese": "/manus-storage/word-282_353ee472.mp3",
    "mandarin": "/manus-storage/word-282_a58c5518.mp3"
  },
  "音樂": {
    "cantonese": "/manus-storage/word-283_e511865c.mp3",
    "mandarin": "/manus-storage/word-283_60afb5dd.mp3"
  },
  "圖畫": {
    "cantonese": "/manus-storage/word-284_81f70c72.mp3",
    "mandarin": "/manus-storage/word-284_287ab712.mp3"
  },
  "休息": {
    "cantonese": "/manus-storage/word-285_a07c4014.mp3",
    "mandarin": "/manus-storage/word-285_fbcf1976.mp3"
  },
  "圖書館": {
    "cantonese": "/manus-storage/word-286_381fbab8.mp3",
    "mandarin": "/manus-storage/word-286_d515b5e1.mp3"
  },
  "操場": {
    "cantonese": "/manus-storage/word-287_bcf3054a.mp3",
    "mandarin": "/manus-storage/word-287_72a33fa5.mp3"
  },
  "校服": {
    "cantonese": "/manus-storage/word-288_d20a5f0a.mp3",
    "mandarin": "/manus-storage/word-288_ac9361ef.mp3"
  },
  "考試": {
    "cantonese": "/manus-storage/word-289_c51b208b.mp3",
    "mandarin": "/manus-storage/word-289_f91ff54b.mp3"
  },
  "溫習": {
    "cantonese": "/manus-storage/word-290_a4046012.mp3",
    "mandarin": "/manus-storage/word-290_afab6843.mp3"
  },
  "班長": {
    "cantonese": "/manus-storage/word-291_6885861b.mp3",
    "mandarin": "/manus-storage/word-291_29a6ff86.mp3"
  },
  "小組": {
    "cantonese": "/manus-storage/word-292_3d88d35b.mp3",
    "mandarin": "/manus-storage/word-292_958fd1ad.mp3"
  },
  "課本": {
    "cantonese": "/manus-storage/word-293_73fffd8a.mp3",
    "mandarin": "/manus-storage/word-293_f817df32.mp3"
  },
  "練習簿": {
    "cantonese": "/manus-storage/word-294_cfd31296.mp3",
    "mandarin": "/manus-storage/word-294_5835b103.mp3"
  },
  "白板": {
    "cantonese": "/manus-storage/word-296_00ca203e.mp3",
    "mandarin": "/manus-storage/word-296_8d8e7452.mp3"
  },
  "黑板": {
    "cantonese": "/manus-storage/word-297_325d8d6b.mp3",
    "mandarin": "/manus-storage/word-297_8bd237aa.mp3"
  },
  "校長": {
    "cantonese": "/manus-storage/word-298_da676ff3.mp3",
    "mandarin": "/manus-storage/word-298_d32eda33.mp3"
  },
  "禮堂": {
    "cantonese": "/manus-storage/word-299_e42eff6c.mp3",
    "mandarin": "/manus-storage/word-299_61df25a0.mp3"
  },
  "上課": {
    "cantonese": "/manus-storage/word-300_aedd5356.mp3",
    "mandarin": "/manus-storage/word-300_d5477677.mp3"
  },
  "下課": {
    "cantonese": "/manus-storage/graded-207_dc5a4dc5.mp3",
    "mandarin": "/manus-storage/graded-207_2000a095.mp3"
  },
  "默書": {
    "cantonese": "/manus-storage/graded-208_00e4b7a7.mp3",
    "mandarin": "/manus-storage/graded-208_ebf7cfb6.mp3"
  },
  "小息": {
    "cantonese": "/manus-storage/graded-209_4f24feee.mp3",
    "mandarin": "/manus-storage/graded-209_18ae6227.mp3"
  },
  "校曆": {
    "cantonese": "/manus-storage/graded-210_fad70f9b.mp3",
    "mandarin": "/manus-storage/graded-210_059768b3.mp3"
  },
  "成績表": {
    "cantonese": "/manus-storage/graded-211_9e3a8a6b.mp3",
    "mandarin": "/manus-storage/graded-211_b24d84e7.mp3"
  },
  "家長日": {
    "cantonese": "/manus-storage/graded-212_17430a80.mp3",
    "mandarin": "/manus-storage/graded-212_96508f7f.mp3"
  },
  "醫生": {
    "cantonese": "/manus-storage/word-301_9422c5a7.mp3",
    "mandarin": "/manus-storage/word-301_c47ef8a0.mp3"
  },
  "護士": {
    "cantonese": "/manus-storage/word-302_b470f484.mp3",
    "mandarin": "/manus-storage/word-302_b85e3524.mp3"
  },
  "警察": {
    "cantonese": "/manus-storage/word-303_7485197e.mp3",
    "mandarin": "/manus-storage/word-303_9f56957b.mp3"
  },
  "消防員": {
    "cantonese": "/manus-storage/word-304_e7c3838c.mp3",
    "mandarin": "/manus-storage/word-304_80364f09.mp3"
  },
  "廚師": {
    "cantonese": "/manus-storage/word-305_866ed769.mp3",
    "mandarin": "/manus-storage/word-305_f60ab137.mp3"
  },
  "農夫": {
    "cantonese": "/manus-storage/word-306_bcf9c8cb.mp3",
    "mandarin": "/manus-storage/word-306_50d93a3d.mp3"
  },
  "司機": {
    "cantonese": "/manus-storage/word-307_647b8452.mp3",
    "mandarin": "/manus-storage/word-307_a4860b48.mp3"
  },
  "機師": {
    "cantonese": "/manus-storage/word-308_46256c01.mp3",
    "mandarin": "/manus-storage/word-308_2214c104.mp3"
  },
  "圖書管理員": {
    "cantonese": "/manus-storage/word-309_7e05e0fc.mp3",
    "mandarin": "/manus-storage/word-309_bba88bca.mp3"
  },
  "郵差": {
    "cantonese": "/manus-storage/word-310_d0660dd3.mp3",
    "mandarin": "/manus-storage/word-310_5b8d17b4.mp3"
  },
  "園丁": {
    "cantonese": "/manus-storage/word-311_62ed5042.mp3",
    "mandarin": "/manus-storage/word-311_5dd863c7.mp3"
  },
  "畫家": {
    "cantonese": "/manus-storage/word-312_c36d30df.mp3",
    "mandarin": "/manus-storage/word-312_02faa2bd.mp3"
  },
  "工程師": {
    "cantonese": "/manus-storage/word-313_2a14cd7b.mp3",
    "mandarin": "/manus-storage/word-313_81198890.mp3"
  },
  "運動員": {
    "cantonese": "/manus-storage/word-314_94c7e70e.mp3",
    "mandarin": "/manus-storage/word-314_32c23b16.mp3"
  },
  "歌手": {
    "cantonese": "/manus-storage/word-315_a3f7f8ff.mp3",
    "mandarin": "/manus-storage/word-315_12b38da9.mp3"
  },
  "演員": {
    "cantonese": "/manus-storage/word-316_d7a75e4f.mp3",
    "mandarin": "/manus-storage/word-316_59b17275.mp3"
  },
  "記者": {
    "cantonese": "/manus-storage/word-317_35c25dbb.mp3",
    "mandarin": "/manus-storage/word-317_172cd211.mp3"
  },
  "律師": {
    "cantonese": "/manus-storage/word-318_4930f47e.mp3",
    "mandarin": "/manus-storage/word-318_0b93c3ea.mp3"
  },
  "會計師": {
    "cantonese": "/manus-storage/word-319_86591b25.mp3",
    "mandarin": "/manus-storage/word-319_5014a292.mp3"
  },
  "攝影師": {
    "cantonese": "/manus-storage/word-320_3e7573a1.mp3",
    "mandarin": "/manus-storage/word-320_9479874b.mp3"
  },
  "髮型師": {
    "cantonese": "/manus-storage/word-321_7a2b4c1b.mp3",
    "mandarin": "/manus-storage/word-321_6d877f42.mp3"
  },
  "建築師": {
    "cantonese": "/manus-storage/word-322_e790a23d.mp3",
    "mandarin": "/manus-storage/word-322_ee5ed47a.mp3"
  },
  "科學家": {
    "cantonese": "/manus-storage/word-323_b1b2179c.mp3",
    "mandarin": "/manus-storage/word-323_db595f97.mp3"
  },
  "牙醫": {
    "cantonese": "/manus-storage/word-324_a9f2b649.mp3",
    "mandarin": "/manus-storage/word-324_3691658b.mp3"
  },
  "獸醫": {
    "cantonese": "/manus-storage/word-325_e06c7f30.mp3",
    "mandarin": "/manus-storage/word-325_23f5ee15.mp3"
  },
  "店員": {
    "cantonese": "/manus-storage/word-326_07ef2fe1.mp3",
    "mandarin": "/manus-storage/word-326_f613facf.mp3"
  },
  "清潔工": {
    "cantonese": "/manus-storage/word-327_6e24b7ba.mp3",
    "mandarin": "/manus-storage/word-327_07869a41.mp3"
  },
  "導遊": {
    "cantonese": "/manus-storage/word-328_c38a7000.mp3",
    "mandarin": "/manus-storage/word-328_e1d0150e.mp3"
  },
  "漁民": {
    "cantonese": "/manus-storage/word-329_5d53c899.mp3",
    "mandarin": "/manus-storage/word-329_eaa64de3.mp3"
  },
  "服務員": {
    "cantonese": "/manus-storage/graded-213_81aa15c5.mp3",
    "mandarin": "/manus-storage/graded-213_502b3dd0.mp3"
  },
  "足球": {
    "cantonese": "/manus-storage/word-330_28b9b96b.mp3",
    "mandarin": "/manus-storage/word-330_3358bb5b.mp3"
  },
  "籃球": {
    "cantonese": "/manus-storage/word-331_9f594cf0.mp3",
    "mandarin": "/manus-storage/word-331_a8c3bdea.mp3"
  },
  "羽毛球": {
    "cantonese": "/manus-storage/word-332_d61b37df.mp3",
    "mandarin": "/manus-storage/word-332_3040d694.mp3"
  },
  "游泳": {
    "cantonese": "/manus-storage/word-333_e343d8e3.mp3",
    "mandarin": "/manus-storage/word-333_ed235750.mp3"
  },
  "跑步": {
    "cantonese": "/manus-storage/word-334_b8f29ad4.mp3",
    "mandarin": "/manus-storage/word-334_a8b177bf.mp3"
  },
  "乒乓球": {
    "cantonese": "/manus-storage/word-335_36416134.mp3",
    "mandarin": "/manus-storage/word-335_18ece5df.mp3"
  },
  "排球": {
    "cantonese": "/manus-storage/word-336_42583ff8.mp3",
    "mandarin": "/manus-storage/word-336_365128a3.mp3"
  },
  "網球": {
    "cantonese": "/manus-storage/word-337_a8a381fe.mp3",
    "mandarin": "/manus-storage/word-337_d4eb11fc.mp3"
  },
  "跳高": {
    "cantonese": "/manus-storage/word-338_ff8d5ef0.mp3",
    "mandarin": "/manus-storage/word-338_a4a36a75.mp3"
  },
  "跳遠": {
    "cantonese": "/manus-storage/word-339_8db2cead.mp3",
    "mandarin": "/manus-storage/word-339_22fbc0a3.mp3"
  },
  "體操": {
    "cantonese": "/manus-storage/word-340_9d3ff82d.mp3",
    "mandarin": "/manus-storage/word-340_08c870ad.mp3"
  },
  "劍擊": {
    "cantonese": "/manus-storage/word-341_f2fb6075.mp3",
    "mandarin": "/manus-storage/word-341_e22182d2.mp3"
  },
  "滑冰": {
    "cantonese": "/manus-storage/word-342_c7780d51.mp3",
    "mandarin": "/manus-storage/word-342_0b4fbc8a.mp3"
  },
  "滑雪": {
    "cantonese": "/manus-storage/word-343_36575e14.mp3",
    "mandarin": "/manus-storage/word-343_06a336b4.mp3"
  },
  "行山": {
    "cantonese": "/manus-storage/word-344_363d42b4.mp3",
    "mandarin": "/manus-storage/word-344_22aa6830.mp3"
  },
  "賽跑": {
    "cantonese": "/manus-storage/word-345_bd970654.mp3",
    "mandarin": "/manus-storage/word-345_4db5b923.mp3"
  },
  "接力": {
    "cantonese": "/manus-storage/word-346_d3ddddf2.mp3",
    "mandarin": "/manus-storage/word-346_4061420e.mp3"
  },
  "瑜伽": {
    "cantonese": "/manus-storage/word-347_2acae662.mp3",
    "mandarin": "/manus-storage/word-347_a6bcae98.mp3"
  },
  "踢球": {
    "cantonese": "/manus-storage/cantonese-kick-ball_7c429d8f.wav",
    "mandarin": "/manus-storage/mandarin-kick-ball_317f54a2.wav"
  },
  "投球": {
    "cantonese": "/manus-storage/word-349_ed3d6414.mp3",
    "mandarin": "/manus-storage/word-349_d91c3866.mp3"
  },
  "運動場": {
    "cantonese": "/manus-storage/word-350_3e82b90c.mp3",
    "mandarin": "/manus-storage/word-350_49114fe1.mp3"
  },
  "球拍": {
    "cantonese": "/manus-storage/word-351_a828a2ac.mp3",
    "mandarin": "/manus-storage/word-351_6534f050.mp3"
  },
  "泳池": {
    "cantonese": "/manus-storage/word-352_1baf3a0a.mp3",
    "mandarin": "/manus-storage/word-352_1702839c.mp3"
  },
  "獎牌": {
    "cantonese": "/manus-storage/word-353_5223e631.mp3",
    "mandarin": "/manus-storage/word-353_b0284016.mp3"
  },
  "冠軍": {
    "cantonese": "/manus-storage/word-354_0510e212.mp3",
    "mandarin": "/manus-storage/word-354_41d7b816.mp3"
  },
  "比賽": {
    "cantonese": "/manus-storage/word-355_d1957b3d.mp3",
    "mandarin": "/manus-storage/word-355_1acf4029.mp3"
  },
  "隊友": {
    "cantonese": "/manus-storage/word-356_662ad2e9.mp3",
    "mandarin": "/manus-storage/word-356_9d936037.mp3"
  },
  "教練": {
    "cantonese": "/manus-storage/word-357_18c4982c.mp3",
    "mandarin": "/manus-storage/word-357_7ba17030.mp3"
  },
  "熱身": {
    "cantonese": "/manus-storage/word-358_7c724900.mp3",
    "mandarin": "/manus-storage/word-358_0ada20fb.mp3"
  },
  "馬拉松": {
    "cantonese": "/manus-storage/graded-214_82e3ee00.mp3",
    "mandarin": "/manus-storage/graded-214_396a7dcc.mp3"
  },
  "龍眼": {
    "cantonese": "/manus-storage/graded-215_8a86a732.mp3",
    "mandarin": "/manus-storage/graded-215_f4f1cb4f.mp3"
  },
  "荔枝": {
    "cantonese": "/manus-storage/graded-216_07345b4c.mp3",
    "mandarin": "/manus-storage/graded-216_0f95514e.mp3"
  },
  "楊桃": {
    "cantonese": "/manus-storage/graded-217_3656dd5b.mp3",
    "mandarin": "/manus-storage/graded-217_abfb7d51.mp3"
  },
  "石榴": {
    "cantonese": "/manus-storage/graded-218_76fba9b5.mp3",
    "mandarin": "/manus-storage/graded-218_3f6d7cec.mp3"
  },
  "柚子": {
    "cantonese": "/manus-storage/graded-219_d197875d.mp3",
    "mandarin": "/manus-storage/graded-219_22e73695.mp3"
  },
  "山竹": {
    "cantonese": "/manus-storage/graded-220_691bf0be.mp3",
    "mandarin": "/manus-storage/graded-220_e394abda.mp3"
  },
  "榴槤": {
    "cantonese": "/manus-storage/graded-221_7ccbcb35.mp3",
    "mandarin": "/manus-storage/graded-221_d967c197.mp3"
  },
  "藍莓": {
    "cantonese": "/manus-storage/graded-222_79c9eaf3.mp3",
    "mandarin": "/manus-storage/graded-222_0c26f4fd.mp3"
  },
  "覆盆子": {
    "cantonese": "/manus-storage/graded-223_4e48c6c2.mp3",
    "mandarin": "/manus-storage/graded-223_3688367c.mp3"
  },
  "黑莓": {
    "cantonese": "/manus-storage/graded-224_b8ed6ec1.mp3",
    "mandarin": "/manus-storage/graded-224_ce12bdad.mp3"
  },
  "奇異果": {
    "cantonese": "/manus-storage/graded-225_aa687098.mp3",
    "mandarin": "/manus-storage/graded-225_4adb844d.mp3"
  },
  "百香果": {
    "cantonese": "/manus-storage/graded-226_c169a9e8.mp3",
    "mandarin": "/manus-storage/graded-226_e7de0075.mp3"
  },
  "無花果": {
    "cantonese": "/manus-storage/graded-227_6a20a320.mp3",
    "mandarin": "/manus-storage/graded-227_9a0b336d.mp3"
  },
  "牛油果": {
    "cantonese": "/manus-storage/graded-228_cea8e651.mp3",
    "mandarin": "/manus-storage/graded-228_582c94a6.mp3"
  },
  "椰子": {
    "cantonese": "/manus-storage/graded-229_d4f81201.mp3",
    "mandarin": "/manus-storage/graded-229_9677e7b8.mp3"
  },
  "蓮藕": {
    "cantonese": "/manus-storage/graded-230_c4863f4d.mp3",
    "mandarin": "/manus-storage/graded-230_7be7b9ee.mp3"
  },
  "芋頭": {
    "cantonese": "/manus-storage/graded-231_dcbe62f6.mp3",
    "mandarin": "/manus-storage/graded-231_c2cd2990.mp3"
  },
  "蕃薯": {
    "cantonese": "/manus-storage/graded-232_ae03eb4a.mp3",
    "mandarin": "/manus-storage/graded-232_6c62e28a.mp3"
  },
  "苦瓜": {
    "cantonese": "/manus-storage/graded-233_dc22ce1d.mp3",
    "mandarin": "/manus-storage/graded-233_daa9ec40.mp3"
  },
  "絲瓜": {
    "cantonese": "/manus-storage/graded-234_22f881c2.mp3",
    "mandarin": "/manus-storage/graded-234_50c65522.mp3"
  },
  "茄子": {
    "cantonese": "/manus-storage/graded-235_daaccd0b.mp3",
    "mandarin": "/manus-storage/graded-235_eafdbac5.mp3"
  },
  "芥蘭": {
    "cantonese": "/manus-storage/graded-236_6ab54146.mp3",
    "mandarin": "/manus-storage/graded-236_b70e80bf.mp3"
  },
  "白菜": {
    "cantonese": "/manus-storage/graded-237_fc23492f.mp3",
    "mandarin": "/manus-storage/graded-237_74347a67.mp3"
  },
  "芹菜": {
    "cantonese": "/manus-storage/graded-238_b0074e92.mp3",
    "mandarin": "/manus-storage/graded-238_33135c43.mp3"
  },
  "秋葵": {
    "cantonese": "/manus-storage/graded-239_232de38a.mp3",
    "mandarin": "/manus-storage/graded-239_26b0ac61.mp3"
  },
  "椰菜": {
    "cantonese": "/manus-storage/graded-240_92cd687a.mp3",
    "mandarin": "/manus-storage/graded-240_0a803efe.mp3"
  },
  "芽菜": {
    "cantonese": "/manus-storage/graded-241_d0ea056f.mp3",
    "mandarin": "/manus-storage/graded-241_794ead64.mp3"
  },
  "木耳": {
    "cantonese": "/manus-storage/graded-242_ead04e56.mp3",
    "mandarin": "/manus-storage/graded-242_3ac31e19.mp3"
  },
  "腐竹": {
    "cantonese": "/manus-storage/graded-243_59d7a717.mp3",
    "mandarin": "/manus-storage/graded-243_4c150b98.mp3"
  },
  "蓮子": {
    "cantonese": "/manus-storage/graded-244_06fe9c5d.mp3",
    "mandarin": "/manus-storage/graded-244_4df936a7.mp3"
  },
  "豁達": {
    "cantonese": "/manus-storage/graded-245_07bee99a.mp3",
    "mandarin": "/manus-storage/graded-245_1c1a0e95.mp3"
  },
  "堅毅": {
    "cantonese": "/manus-storage/graded-246_5634b51e.mp3",
    "mandarin": "/manus-storage/graded-246_769a9731.mp3"
  },
  "謙虛": {
    "cantonese": "/manus-storage/graded-247_dc88712c.mp3",
    "mandarin": "/manus-storage/graded-247_324ec953.mp3"
  },
  "欣慰": {
    "cantonese": "/manus-storage/graded-248_02e89a33.mp3",
    "mandarin": "/manus-storage/graded-248_37a147ff.mp3"
  },
  "憤怒": {
    "cantonese": "/manus-storage/graded-249_1d7edb9a.mp3",
    "mandarin": "/manus-storage/graded-249_5688c4a6.mp3"
  },
  "憂慮": {
    "cantonese": "/manus-storage/graded-250_d4d14ac0.mp3",
    "mandarin": "/manus-storage/graded-250_720ee891.mp3"
  },
  "惶恐": {
    "cantonese": "/manus-storage/graded-251_96e01a04.mp3",
    "mandarin": "/manus-storage/graded-251_6284d49f.mp3"
  },
  "寂寞": {
    "cantonese": "/manus-storage/graded-252_ecd321d5.mp3",
    "mandarin": "/manus-storage/graded-252_6c8625f1.mp3"
  },
  "欣賞": {
    "cantonese": "/manus-storage/graded-253_b704ec04.mp3",
    "mandarin": "/manus-storage/graded-253_0f574f0f.mp3"
  },
  "欽佩": {
    "cantonese": "/manus-storage/graded-254_6fa9f0e7.mp3",
    "mandarin": "/manus-storage/graded-254_b16aefbe.mp3"
  },
  "懷念": {
    "cantonese": "/manus-storage/graded-255_fc1e5a1d.mp3",
    "mandarin": "/manus-storage/graded-255_6b65c586.mp3"
  },
  "眷戀": {
    "cantonese": "/manus-storage/graded-256_cebe5e0a.mp3",
    "mandarin": "/manus-storage/graded-256_0d368ced.mp3"
  },
  "釋懷": {
    "cantonese": "/manus-storage/graded-257_433a5a59.mp3",
    "mandarin": "/manus-storage/graded-257_cf03c08c.mp3"
  },
  "自豪": {
    "cantonese": "/manus-storage/graded-258_10277ac8.mp3",
    "mandarin": "/manus-storage/graded-258_40442473.mp3"
  },
  "無奈": {
    "cantonese": "/manus-storage/graded-259_9115f97c.mp3",
    "mandarin": "/manus-storage/graded-259_71870144.mp3"
  },
  "委屈": {
    "cantonese": "/manus-storage/graded-260_7b444f30.mp3",
    "mandarin": "/manus-storage/graded-260_8ac21d69.mp3"
  },
  "慚怍": {
    "cantonese": "/manus-storage/graded-261_30b77f04.mp3",
    "mandarin": "/manus-storage/graded-261_7d88e079.mp3"
  },
  "懊悔": {
    "cantonese": "/manus-storage/graded-262_57aafe55.mp3",
    "mandarin": "/manus-storage/graded-262_0a535b79.mp3"
  },
  "厭煩": {
    "cantonese": "/manus-storage/graded-263_b2517615.mp3",
    "mandarin": "/manus-storage/graded-263_324e18a6.mp3"
  },
  "迷惘": {
    "cantonese": "/manus-storage/graded-264_23764ccf.mp3",
    "mandarin": "/manus-storage/graded-264_59f3d214.mp3"
  },
  "敏感": {
    "cantonese": "/manus-storage/graded-265_fff9c72b.mp3",
    "mandarin": "/manus-storage/graded-265_40c8db6e.mp3"
  },
  "警覺": {
    "cantonese": "/manus-storage/graded-266_2a4204d4.mp3",
    "mandarin": "/manus-storage/graded-266_eae68c28.mp3"
  },
  "愉快": {
    "cantonese": "/manus-storage/graded-267_ed269803.mp3",
    "mandarin": "/manus-storage/graded-267_54df063e.mp3"
  },
  "敬畏": {
    "cantonese": "/manus-storage/graded-268_bcd566f5.mp3",
    "mandarin": "/manus-storage/graded-268_1e0d759e.mp3"
  },
  "從容": {
    "cantonese": "/manus-storage/graded-269_dc715cd8.mp3",
    "mandarin": "/manus-storage/graded-269_f1c9ca6b.mp3"
  },
  "沉著": {
    "cantonese": "/manus-storage/graded-270_d974a8ca.mp3",
    "mandarin": "/manus-storage/graded-270_840dc22e.mp3"
  },
  "專注": {
    "cantonese": "/manus-storage/graded-271_d6970ba6.mp3",
    "mandarin": "/manus-storage/graded-271_58fc26e5.mp3"
  },
  "投入": {
    "cantonese": "/manus-storage/graded-272_12197d17.mp3",
    "mandarin": "/manus-storage/graded-272_ee38619e.mp3"
  },
  "熱忱": {
    "cantonese": "/manus-storage/graded-273_5c9f535e.mp3",
    "mandarin": "/manus-storage/graded-273_44c13e11.mp3"
  },
  "同理心": {
    "cantonese": "/manus-storage/graded-274_b96ec1b4.mp3",
    "mandarin": "/manus-storage/graded-274_e21ca584.mp3"
  },
  "獵鷹": {
    "cantonese": "/manus-storage/graded-275_59dad9a6.mp3",
    "mandarin": "/manus-storage/graded-275_eaf8320b.mp3"
  },
  "丹頂鶴": {
    "cantonese": "/manus-storage/graded-276_79eed05c.mp3",
    "mandarin": "/manus-storage/graded-276_4b0e7cb9.mp3"
  },
  "火烈鳥": {
    "cantonese": "/manus-storage/graded-277_de1ee07e.mp3",
    "mandarin": "/manus-storage/graded-277_a2fe6718.mp3"
  },
  "信天翁": {
    "cantonese": "/manus-storage/graded-278_677b9bf7.mp3",
    "mandarin": "/manus-storage/graded-278_6172036e.mp3"
  },
  "啄木鳥": {
    "cantonese": "/manus-storage/graded-279_f9869b80.mp3",
    "mandarin": "/manus-storage/graded-279_3b1a4732.mp3"
  },
  "穿山甲": {
    "cantonese": "/manus-storage/graded-280_853a8d7a.mp3",
    "mandarin": "/manus-storage/graded-280_7500fc61.mp3"
  },
  "樹懶": {
    "cantonese": "/manus-storage/graded-281_1060b127.mp3",
    "mandarin": "/manus-storage/graded-281_2aac53d5.mp3"
  },
  "水獺": {
    "cantonese": "/manus-storage/graded-282_dfa1017d.mp3",
    "mandarin": "/manus-storage/graded-282_b8d7ed0d.mp3"
  },
  "北極熊": {
    "cantonese": "/manus-storage/graded-283_4ec9f70b.mp3",
    "mandarin": "/manus-storage/graded-283_079491ba.mp3"
  },
  "棕熊": {
    "cantonese": "/manus-storage/graded-284_f5a65741.mp3",
    "mandarin": "/manus-storage/graded-284_90dee095.mp3"
  },
  "野牛": {
    "cantonese": "/manus-storage/graded-285_bf8be07c.mp3",
    "mandarin": "/manus-storage/graded-285_b9b8664f.mp3"
  },
  "羚羊": {
    "cantonese": "/manus-storage/graded-286_e0a66bae.mp3",
    "mandarin": "/manus-storage/graded-286_c7e635ca.mp3"
  },
  "麋鹿": {
    "cantonese": "/manus-storage/graded-287_40737f90.mp3",
    "mandarin": "/manus-storage/graded-287_7c838195.mp3"
  },
  "野豬": {
    "cantonese": "/manus-storage/graded-288_d038d408.mp3",
    "mandarin": "/manus-storage/graded-288_a0d5299e.mp3"
  },
  "野兔": {
    "cantonese": "/manus-storage/graded-289_85228880.mp3",
    "mandarin": "/manus-storage/graded-289_ec4d01eb.mp3"
  },
  "白鷺": {
    "cantonese": "/manus-storage/graded-290_a9118abb.mp3",
    "mandarin": "/manus-storage/graded-290_0fc80ab0.mp3"
  },
  "鯉魚": {
    "cantonese": "/manus-storage/graded-291_ac610711.mp3",
    "mandarin": "/manus-storage/graded-291_c5632fbc.mp3"
  },
  "鱸魚": {
    "cantonese": "/manus-storage/graded-292_a7003311.mp3",
    "mandarin": "/manus-storage/graded-292_40d26ea8.mp3"
  },
  "海獅": {
    "cantonese": "/manus-storage/graded-293_272686e3.mp3",
    "mandarin": "/manus-storage/graded-293_adcc41a1.mp3"
  },
  "海象": {
    "cantonese": "/manus-storage/graded-294_34bf47dc.mp3",
    "mandarin": "/manus-storage/graded-294_614015c4.mp3"
  },
  "海膽": {
    "cantonese": "/manus-storage/graded-295_228e86f7.mp3",
    "mandarin": "/manus-storage/graded-295_a8ffe48a.mp3"
  },
  "水母": {
    "cantonese": "/manus-storage/graded-296_c34cbd23.mp3",
    "mandarin": "/manus-storage/graded-296_8f6f4afc.mp3"
  },
  "海葵": {
    "cantonese": "/manus-storage/graded-297_c7b5de52.mp3",
    "mandarin": "/manus-storage/graded-297_c780a30a.mp3"
  },
  "螃蟹": {
    "cantonese": "/manus-storage/graded-298_d700f5fe.mp3",
    "mandarin": "/manus-storage/graded-298_a0bfb945.mp3"
  },
  "龍蝦": {
    "cantonese": "/manus-storage/graded-299_3e50b25c.mp3",
    "mandarin": "/manus-storage/graded-299_b773c0fb.mp3"
  },
  "寄居蟹": {
    "cantonese": "/manus-storage/graded-300_7d3ae744.mp3",
    "mandarin": "/manus-storage/graded-300_e72e6260.mp3"
  },
  "蜈蚣": {
    "cantonese": "/manus-storage/graded-301_eddf2b51.mp3",
    "mandarin": "/manus-storage/graded-301_849e2a2b.mp3"
  },
  "毒蛇": {
    "cantonese": "/manus-storage/graded-302_04dac94d.mp3",
    "mandarin": "/manus-storage/graded-302_07694347.mp3"
  },
  "蝙蝠": {
    "cantonese": "/manus-storage/graded-303_85dfd555.mp3",
    "mandarin": "/manus-storage/graded-303_7c3ae30b.mp3"
  },
  "鵪鶉": {
    "cantonese": "/manus-storage/graded-304_6ff855cb.mp3",
    "mandarin": "/manus-storage/graded-304_051207f3.mp3"
  },
  "緋紅": {
    "cantonese": "/manus-storage/graded-305_5e8b95c5.mp3",
    "mandarin": "/manus-storage/graded-305_0d721cbf.mp3"
  },
  "赭石": {
    "cantonese": "/manus-storage/graded-306_c9bf99a1.mp3",
    "mandarin": "/manus-storage/graded-306_437e94a1.mp3"
  },
  "墨黑": {
    "cantonese": "/manus-storage/graded-307_ec421726.mp3",
    "mandarin": "/manus-storage/graded-307_bedc116f.mp3"
  },
  "乳白": {
    "cantonese": "/manus-storage/graded-308_7621a41a.mp3",
    "mandarin": "/manus-storage/graded-308_e1e5e04b.mp3"
  },
  "雪白": {
    "cantonese": "/manus-storage/graded-309_93d6216a.mp3",
    "mandarin": "/manus-storage/graded-309_5c717932.mp3"
  },
  "湛藍": {
    "cantonese": "/manus-storage/graded-310_29987e3b.mp3",
    "mandarin": "/manus-storage/graded-310_34a416dc.mp3"
  },
  "蔚藍": {
    "cantonese": "/manus-storage/graded-311_73440c00.mp3",
    "mandarin": "/manus-storage/graded-311_7762435f.mp3"
  },
  "碧綠": {
    "cantonese": "/manus-storage/graded-312_b604941a.mp3",
    "mandarin": "/manus-storage/graded-312_c9a91960.mp3"
  },
  "翠綠": {
    "cantonese": "/manus-storage/graded-313_a91248dc.mp3",
    "mandarin": "/manus-storage/graded-313_e47cad4b.mp3"
  },
  "藕紫": {
    "cantonese": "/manus-storage/graded-314_ac9505c1.mp3",
    "mandarin": "/manus-storage/graded-314_6f0597ed.mp3"
  },
  "煙紫": {
    "cantonese": "/manus-storage/graded-315_c3221fd5.mp3",
    "mandarin": "/manus-storage/graded-315_a34ff204.mp3"
  },
  "黛青": {
    "cantonese": "/manus-storage/graded-316_c7ecd3c2.mp3",
    "mandarin": "/manus-storage/graded-316_342cc0c0.mp3"
  },
  "靛青": {
    "cantonese": "/manus-storage/graded-317_067d3365.mp3",
    "mandarin": "/manus-storage/graded-317_229b4359.mp3"
  },
  "棗紅": {
    "cantonese": "/manus-storage/graded-318_fc0de850.mp3",
    "mandarin": "/manus-storage/graded-318_b9fbc6c3.mp3"
  },
  "胭脂紅": {
    "cantonese": "/manus-storage/graded-319_ed0dd09e.mp3",
    "mandarin": "/manus-storage/graded-319_8132c307.mp3"
  },
  "橘紅": {
    "cantonese": "/manus-storage/graded-320_954c3768.mp3",
    "mandarin": "/manus-storage/graded-320_2bdc433d.mp3"
  },
  "金黃": {
    "cantonese": "/manus-storage/graded-321_0a9c0026.mp3",
    "mandarin": "/manus-storage/graded-321_a8336676.mp3"
  },
  "鵝黃": {
    "cantonese": "/manus-storage/graded-322_87a3a7a5.mp3",
    "mandarin": "/manus-storage/graded-322_c6319619.mp3"
  },
  "藤黃": {
    "cantonese": "/manus-storage/graded-323_ce881cc3.mp3",
    "mandarin": "/manus-storage/graded-323_8da006fb.mp3"
  },
  "銀灰": {
    "cantonese": "/manus-storage/graded-324_28225cac.mp3",
    "mandarin": "/manus-storage/graded-324_3447f698.mp3"
  },
  "鉛灰": {
    "cantonese": "/manus-storage/graded-325_8ee5d5dc.mp3",
    "mandarin": "/manus-storage/graded-325_21893943.mp3"
  },
  "炭黑": {
    "cantonese": "/manus-storage/graded-326_f75169a0.mp3",
    "mandarin": "/manus-storage/graded-326_eb0d274c.mp3"
  },
  "霧白": {
    "cantonese": "/manus-storage/graded-327_5600f6c4.mp3",
    "mandarin": "/manus-storage/graded-327_07160842.mp3"
  },
  "暖黃": {
    "cantonese": "/manus-storage/graded-328_745d1637.mp3",
    "mandarin": "/manus-storage/graded-328_f8aab3b1.mp3"
  },
  "冷白": {
    "cantonese": "/manus-storage/graded-329_ca64cd53.mp3",
    "mandarin": "/manus-storage/graded-329_2ea44d78.mp3"
  },
  "飽和度": {
    "cantonese": "/manus-storage/graded-330_0be0b686.mp3",
    "mandarin": "/manus-storage/graded-330_0b303e04.mp3"
  },
  "明度": {
    "cantonese": "/manus-storage/graded-331_edc16bdc.mp3",
    "mandarin": "/manus-storage/graded-331_fb87003b.mp3"
  },
  "色調": {
    "cantonese": "/manus-storage/graded-332_fea7cc8f.mp3",
    "mandarin": "/manus-storage/graded-332_658e8cd2.mp3"
  },
  "色譜": {
    "cantonese": "/manus-storage/graded-333_b5aae477.mp3",
    "mandarin": "/manus-storage/graded-333_300207f1.mp3"
  },
  "漸層": {
    "cantonese": "/manus-storage/graded-334_f98e9a0b.mp3",
    "mandarin": "/manus-storage/graded-334_ce3e7e09.mp3"
  },
  "顱骨": {
    "cantonese": "/manus-storage/graded-335_e6199b44.mp3",
    "mandarin": "/manus-storage/graded-335_8b5da6d8.mp3"
  },
  "顎骨": {
    "cantonese": "/manus-storage/graded-336_2967e161.mp3",
    "mandarin": "/manus-storage/graded-336_6a3ae190.mp3"
  },
  "鎖骨": {
    "cantonese": "/manus-storage/graded-337_39971f10.mp3",
    "mandarin": "/manus-storage/graded-337_d2137bf7.mp3"
  },
  "肋骨": {
    "cantonese": "/manus-storage/graded-338_13956940.mp3",
    "mandarin": "/manus-storage/graded-338_91e7fd20.mp3"
  },
  "脊椎": {
    "cantonese": "/manus-storage/graded-339_231d1c3d.mp3",
    "mandarin": "/manus-storage/graded-339_3bff01e7.mp3"
  },
  "骨盆": {
    "cantonese": "/manus-storage/graded-340_041a00db.mp3",
    "mandarin": "/manus-storage/graded-340_1803d209.mp3"
  },
  "韌帶": {
    "cantonese": "/manus-storage/graded-341_8fd81ae8.mp3",
    "mandarin": "/manus-storage/graded-341_3673c8a0.mp3"
  },
  "肌腱": {
    "cantonese": "/manus-storage/graded-342_227e9836.mp3",
    "mandarin": "/manus-storage/graded-342_0a63a24c.mp3"
  },
  "神經": {
    "cantonese": "/manus-storage/graded-343_e583b09c.mp3",
    "mandarin": "/manus-storage/graded-343_7cb40f38.mp3"
  },
  "血管": {
    "cantonese": "/manus-storage/graded-344_35fc7e80.mp3",
    "mandarin": "/manus-storage/graded-344_3d9ea0e1.mp3"
  },
  "動脈": {
    "cantonese": "/manus-storage/graded-345_01b51bda.mp3",
    "mandarin": "/manus-storage/graded-345_1df13d9a.mp3"
  },
  "靜脈": {
    "cantonese": "/manus-storage/graded-346_00654747.mp3",
    "mandarin": "/manus-storage/graded-346_d36ebfe1.mp3"
  },
  "細胞": {
    "cantonese": "/manus-storage/graded-347_53611979.mp3",
    "mandarin": "/manus-storage/graded-347_4f25a786.mp3"
  },
  "瞳孔": {
    "cantonese": "/manus-storage/graded-348_53c97d39.mp3",
    "mandarin": "/manus-storage/graded-348_0442dd80.mp3"
  },
  "虹膜": {
    "cantonese": "/manus-storage/graded-349_9224830f.mp3",
    "mandarin": "/manus-storage/graded-349_6448d8d9.mp3"
  },
  "眼瞼": {
    "cantonese": "/manus-storage/graded-350_65d20443.mp3",
    "mandarin": "/manus-storage/graded-350_c28d3ea8.mp3"
  },
  "耳垂": {
    "cantonese": "/manus-storage/graded-351_ee25fa94.mp3",
    "mandarin": "/manus-storage/graded-351_e8f45902.mp3"
  },
  "聲帶": {
    "cantonese": "/manus-storage/graded-352_17e841fe.mp3",
    "mandarin": "/manus-storage/graded-352_f994ca6a.mp3"
  },
  "食道": {
    "cantonese": "/manus-storage/graded-353_bd0d9696.mp3",
    "mandarin": "/manus-storage/graded-353_03be73d9.mp3"
  },
  "氣管": {
    "cantonese": "/manus-storage/graded-354_08c77c8a.mp3",
    "mandarin": "/manus-storage/graded-354_0ae4481f.mp3"
  },
  "支氣管": {
    "cantonese": "/manus-storage/graded-355_7e730d78.mp3",
    "mandarin": "/manus-storage/graded-355_ee45eeec.mp3"
  },
  "橫膈膜": {
    "cantonese": "/manus-storage/graded-356_449995a6.mp3",
    "mandarin": "/manus-storage/graded-356_69c2a680.mp3"
  },
  "胰臟": {
    "cantonese": "/manus-storage/graded-357_b42bfa0a.mp3",
    "mandarin": "/manus-storage/graded-357_501e724e.mp3"
  },
  "膀胱": {
    "cantonese": "/manus-storage/graded-358_18e8dee6.mp3",
    "mandarin": "/manus-storage/graded-358_4da080bb.mp3"
  },
  "淋巴": {
    "cantonese": "/manus-storage/graded-359_de636625.mp3",
    "mandarin": "/manus-storage/graded-359_614214b5.mp3"
  },
  "汗腺": {
    "cantonese": "/manus-storage/graded-360_187a0a5a.mp3",
    "mandarin": "/manus-storage/graded-360_07c97d2f.mp3"
  },
  "毛孔": {
    "cantonese": "/manus-storage/graded-361_48316d3c.mp3",
    "mandarin": "/manus-storage/graded-361_a9051a10.mp3"
  },
  "脂肪": {
    "cantonese": "/manus-storage/graded-362_ddc988e5.mp3",
    "mandarin": "/manus-storage/graded-362_fe0bfa14.mp3"
  },
  "免疫力": {
    "cantonese": "/manus-storage/graded-363_9c6b394e.mp3",
    "mandarin": "/manus-storage/graded-363_f679c053.mp3"
  },
  "新陳代謝": {
    "cantonese": "/manus-storage/graded-364_60a823b6.mp3",
    "mandarin": "/manus-storage/graded-364_9e52808f.mp3"
  },
  "曾祖父": {
    "cantonese": "/manus-storage/graded-365_e3fc222f.mp3",
    "mandarin": "/manus-storage/graded-365_105f9422.mp3"
  },
  "曾祖母": {
    "cantonese": "/manus-storage/graded-366_5db2904a.mp3",
    "mandarin": "/manus-storage/graded-366_406d506e.mp3"
  },
  "外曾祖父": {
    "cantonese": "/manus-storage/graded-367_3df01983.mp3",
    "mandarin": "/manus-storage/graded-367_77000c8c.mp3"
  },
  "外曾祖母": {
    "cantonese": "/manus-storage/graded-368_44a9ccc3.mp3",
    "mandarin": "/manus-storage/graded-368_3465d92f.mp3"
  },
  "岳父": {
    "cantonese": "/manus-storage/graded-369_591bc28c.mp3",
    "mandarin": "/manus-storage/graded-369_f9c90389.mp3"
  },
  "岳母": {
    "cantonese": "/manus-storage/graded-370_9899b4df.mp3",
    "mandarin": "/manus-storage/graded-370_02c3a940.mp3"
  },
  "婆婆": {
    "cantonese": "/manus-storage/graded-371_fee7fc4c.mp3",
    "mandarin": "/manus-storage/graded-371_85527bcb.mp3"
  },
  "公公": {
    "cantonese": "/manus-storage/graded-372_73e68864.mp3",
    "mandarin": "/manus-storage/graded-372_bece3260.mp3"
  },
  "婆媳": {
    "cantonese": "/manus-storage/graded-373_458409a8.mp3",
    "mandarin": "/manus-storage/graded-373_c72f6db4.mp3"
  },
  "翁婿": {
    "cantonese": "/manus-storage/graded-374_016a48ce.mp3",
    "mandarin": "/manus-storage/graded-374_7abab887.mp3"
  },
  "姻親": {
    "cantonese": "/manus-storage/graded-375_2ca8a65f.mp3",
    "mandarin": "/manus-storage/graded-375_e2539b65.mp3"
  },
  "宗親": {
    "cantonese": "/manus-storage/graded-376_33237815.mp3",
    "mandarin": "/manus-storage/graded-376_72bb0982.mp3"
  },
  "同宗": {
    "cantonese": "/manus-storage/graded-377_4279ed89.mp3",
    "mandarin": "/manus-storage/graded-377_4e5ffc22.mp3"
  },
  "族譜": {
    "cantonese": "/manus-storage/graded-378_81e07257.mp3",
    "mandarin": "/manus-storage/graded-378_4869cc28.mp3"
  },
  "家訓": {
    "cantonese": "/manus-storage/graded-379_c1dfc417.mp3",
    "mandarin": "/manus-storage/graded-379_fc75b11a.mp3"
  },
  "家風": {
    "cantonese": "/manus-storage/graded-380_93b96dc0.mp3",
    "mandarin": "/manus-storage/graded-380_ae11175b.mp3"
  },
  "家傳": {
    "cantonese": "/manus-storage/graded-381_0773386a.mp3",
    "mandarin": "/manus-storage/graded-381_6aa528ad.mp3"
  },
  "傳承": {
    "cantonese": "/manus-storage/graded-382_32fda1f7.mp3",
    "mandarin": "/manus-storage/graded-382_24d3f6c2.mp3"
  },
  "血緣": {
    "cantonese": "/manus-storage/graded-383_a2c18e05.mp3",
    "mandarin": "/manus-storage/graded-383_4da88005.mp3"
  },
  "親屬": {
    "cantonese": "/manus-storage/graded-384_385bfcb0.mp3",
    "mandarin": "/manus-storage/graded-384_43db8045.mp3"
  },
  "撫養": {
    "cantonese": "/manus-storage/graded-385_96b5c4b2.mp3",
    "mandarin": "/manus-storage/graded-385_23ea6b19.mp3"
  },
  "扶養": {
    "cantonese": "/manus-storage/graded-386_55e4815a.mp3",
    "mandarin": "/manus-storage/graded-386_bb87a59b.mp3"
  },
  "孝順": {
    "cantonese": "/manus-storage/graded-387_7b4f2c67.mp3",
    "mandarin": "/manus-storage/graded-387_3d059cfc.mp3"
  },
  "和睦": {
    "cantonese": "/manus-storage/graded-388_c5b9a23d.mp3",
    "mandarin": "/manus-storage/graded-388_b636dca0.mp3"
  },
  "團聚": {
    "cantonese": "/manus-storage/graded-389_1655f33d.mp3",
    "mandarin": "/manus-storage/graded-389_386e6b09.mp3"
  },
  "離別": {
    "cantonese": "/manus-storage/graded-390_231221f0.mp3",
    "mandarin": "/manus-storage/graded-390_68f23f1e.mp3"
  },
  "團圓": {
    "cantonese": "/manus-storage/graded-391_b71d024a.mp3",
    "mandarin": "/manus-storage/graded-391_8ed14d8b.mp3"
  },
  "長輩": {
    "cantonese": "/manus-storage/graded-392_0cfc428b.mp3",
    "mandarin": "/manus-storage/graded-392_04972677.mp3"
  },
  "晚輩": {
    "cantonese": "/manus-storage/graded-393_98eaa5cf.mp3",
    "mandarin": "/manus-storage/graded-393_c5ed0e63.mp3"
  },
  "家族史": {
    "cantonese": "/manus-storage/graded-394_2d96ac04.mp3",
    "mandarin": "/manus-storage/graded-394_a3e7a51a.mp3"
  },
  "望遠鏡": {
    "cantonese": "/manus-storage/graded-395_c6f670a3.mp3",
    "mandarin": "/manus-storage/graded-395_138387b3.mp3"
  },
  "顯微鏡": {
    "cantonese": "/manus-storage/graded-396_16787b6c.mp3",
    "mandarin": "/manus-storage/graded-396_561a2aec.mp3"
  },
  "投影機": {
    "cantonese": "/manus-storage/graded-397_18cc7503.mp3",
    "mandarin": "/manus-storage/graded-397_0027d292.mp3"
  },
  "打印機": {
    "cantonese": "/manus-storage/graded-398_e2740a7a.mp3",
    "mandarin": "/manus-storage/graded-398_dbf3cb74.mp3"
  },
  "掃描器": {
    "cantonese": "/manus-storage/graded-399_fc9c7809.mp3",
    "mandarin": "/manus-storage/graded-399_cf030eff.mp3"
  },
  "平板電腦": {
    "cantonese": "/manus-storage/graded-400_7e487d04.mp3",
    "mandarin": "/manus-storage/graded-400_a881ea36.mp3"
  },
  "鍵盤": {
    "cantonese": "/manus-storage/graded-401_ef8edd6d.mp3",
    "mandarin": "/manus-storage/graded-401_46d25d61.mp3"
  },
  "滑鼠": {
    "cantonese": "/manus-storage/graded-402_da0b1e97.mp3",
    "mandarin": "/manus-storage/graded-402_eac28f63.mp3"
  },
  "路由器": {
    "cantonese": "/manus-storage/graded-403_6d7d01cd.mp3",
    "mandarin": "/manus-storage/graded-403_74b88643.mp3"
  },
  "硬碟": {
    "cantonese": "/manus-storage/graded-404_64a1ff57.mp3",
    "mandarin": "/manus-storage/graded-404_5f4cd55e.mp3"
  },
  "記憶卡": {
    "cantonese": "/manus-storage/graded-405_eb299bca.mp3",
    "mandarin": "/manus-storage/graded-405_47acbe9a.mp3"
  },
  "記憶棒": {
    "cantonese": "/manus-storage/graded-406_d1891bed.mp3",
    "mandarin": "/manus-storage/graded-406_7d0bde28.mp3"
  },
  "電池": {
    "cantonese": "/manus-storage/graded-407_ef63b436.mp3",
    "mandarin": "/manus-storage/graded-407_18e50b03.mp3"
  },
  "手電筒": {
    "cantonese": "/manus-storage/graded-408_ba2746b5.mp3",
    "mandarin": "/manus-storage/graded-408_c8dbc976.mp3"
  },
  "指南針": {
    "cantonese": "/manus-storage/graded-409_a4a7a701.mp3",
    "mandarin": "/manus-storage/graded-409_acd2b961.mp3"
  },
  "量角器": {
    "cantonese": "/manus-storage/graded-410_29ac8be6.mp3",
    "mandarin": "/manus-storage/graded-410_aee10eac.mp3"
  },
  "三角尺": {
    "cantonese": "/manus-storage/graded-411_53602f59.mp3",
    "mandarin": "/manus-storage/graded-411_2622a40b.mp3"
  },
  "訂書機": {
    "cantonese": "/manus-storage/graded-412_c47895fc.mp3",
    "mandarin": "/manus-storage/graded-412_e1027931.mp3"
  },
  "打孔機": {
    "cantonese": "/manus-storage/graded-413_d1474917.mp3",
    "mandarin": "/manus-storage/graded-413_c25f506a.mp3"
  },
  "文件夾": {
    "cantonese": "/manus-storage/graded-414_4722b38e.mp3",
    "mandarin": "/manus-storage/graded-414_118b2bd9.mp3"
  },
  "檔案袋": {
    "cantonese": "/manus-storage/graded-415_49134c63.mp3",
    "mandarin": "/manus-storage/graded-415_18b0de0a.mp3"
  },
  "標籤機": {
    "cantonese": "/manus-storage/graded-416_26833894.mp3",
    "mandarin": "/manus-storage/graded-416_02cf258a.mp3"
  },
  "保險箱": {
    "cantonese": "/manus-storage/graded-417_da5fc8e8.mp3",
    "mandarin": "/manus-storage/graded-417_8a717318.mp3"
  },
  "急救箱": {
    "cantonese": "/manus-storage/graded-418_346270ca.mp3",
    "mandarin": "/manus-storage/graded-418_87c68182.mp3"
  },
  "滅火筒": {
    "cantonese": "/manus-storage/graded-419_b73004be.mp3",
    "mandarin": "/manus-storage/graded-419_06f27695.mp3"
  },
  "體溫計": {
    "cantonese": "/manus-storage/graded-420_fac222a7.mp3",
    "mandarin": "/manus-storage/graded-420_dec6213f.mp3"
  },
  "血壓計": {
    "cantonese": "/manus-storage/graded-421_90095d51.mp3",
    "mandarin": "/manus-storage/graded-421_28efaaab.mp3"
  },
  "放大鏡": {
    "cantonese": "/manus-storage/graded-422_cabe0d9b.mp3",
    "mandarin": "/manus-storage/graded-422_f030c2a1.mp3"
  },
  "遙控車": {
    "cantonese": "/manus-storage/graded-423_0dd5b653.mp3",
    "mandarin": "/manus-storage/graded-423_2be82949.mp3"
  },
  "收音機": {
    "cantonese": "/manus-storage/graded-424_77af6451.mp3",
    "mandarin": "/manus-storage/graded-424_2d63ae55.mp3"
  },
  "太陽": {
    "cantonese": "/manus-storage/word-359_f4ce7ea6.mp3",
    "mandarin": "/manus-storage/word-359_5094d10b.mp3"
  },
  "月亮": {
    "cantonese": "/manus-storage/word-360_a33817a1.mp3",
    "mandarin": "/manus-storage/word-360_7ac758b7.mp3"
  },
  "星星": {
    "cantonese": "/manus-storage/word-361_2d13b08c.mp3",
    "mandarin": "/manus-storage/word-361_1799fc89.mp3"
  },
  "天空": {
    "cantonese": "/manus-storage/word-362_ad3a3757.mp3",
    "mandarin": "/manus-storage/word-362_f05a7e92.mp3"
  },
  "白雲": {
    "cantonese": "/manus-storage/word-363_2e02caec.mp3",
    "mandarin": "/manus-storage/word-363_f83f2e71.mp3"
  },
  "雨水": {
    "cantonese": "/manus-storage/word-364_f9807c0f.mp3",
    "mandarin": "/manus-storage/word-364_3a1a9480.mp3"
  },
  "彩虹": {
    "cantonese": "/manus-storage/word-365_9d19bc4e.mp3",
    "mandarin": "/manus-storage/word-365_20e82028.mp3"
  },
  "花朵": {
    "cantonese": "/manus-storage/word-366_acdfcc48.mp3",
    "mandarin": "/manus-storage/word-366_da199f7f.mp3"
  },
  "樹木": {
    "cantonese": "/manus-storage/word-367_a633e943.mp3",
    "mandarin": "/manus-storage/word-367_01648bed.mp3"
  },
  "草地": {
    "cantonese": "/manus-storage/word-368_cbcf1a00.mp3",
    "mandarin": "/manus-storage/word-368_6a7237b2.mp3"
  },
  "河流": {
    "cantonese": "/manus-storage/word-369_156b0c13.mp3",
    "mandarin": "/manus-storage/word-369_807e3412.mp3"
  },
  "海洋": {
    "cantonese": "/manus-storage/word-370_c0bf2ee9.mp3",
    "mandarin": "/manus-storage/word-370_024dbc8a.mp3"
  },
  "山峰": {
    "cantonese": "/manus-storage/word-371_28062873.mp3",
    "mandarin": "/manus-storage/word-371_e427d88a.mp3"
  },
  "石頭": {
    "cantonese": "/manus-storage/word-372_75d63c29.mp3",
    "mandarin": "/manus-storage/word-372_096d959e.mp3"
  },
  "泥土": {
    "cantonese": "/manus-storage/word-373_d556d2a5.mp3",
    "mandarin": "/manus-storage/word-373_38aa921e.mp3"
  },
  "森林": {
    "cantonese": "/manus-storage/word-374_30b51a76.mp3",
    "mandarin": "/manus-storage/word-374_f3b43f94.mp3"
  },
  "沙灘": {
    "cantonese": "/manus-storage/word-375_13cd539b.mp3",
    "mandarin": "/manus-storage/word-375_685ca476.mp3"
  },
  "瀑布": {
    "cantonese": "/manus-storage/word-376_2ce04790.mp3",
    "mandarin": "/manus-storage/word-376_6201dd40.mp3"
  },
  "湖泊": {
    "cantonese": "/manus-storage/word-377_3f89056e.mp3",
    "mandarin": "/manus-storage/word-377_d99fa5f4.mp3"
  },
  "火山": {
    "cantonese": "/manus-storage/word-378_0cebea0a.mp3",
    "mandarin": "/manus-storage/word-378_2b63ec83.mp3"
  },
  "天氣": {
    "cantonese": "/manus-storage/word-379_a73d315b.mp3",
    "mandarin": "/manus-storage/word-379_30576ea6.mp3"
  },
  "雷電": {
    "cantonese": "/manus-storage/word-380_8b67a268.mp3",
    "mandarin": "/manus-storage/word-380_c669713d.mp3"
  },
  "颱風": {
    "cantonese": "/manus-storage/word-381_71d00463.mp3",
    "mandarin": "/manus-storage/word-381_c4844b40.mp3"
  },
  "霧": {
    "cantonese": "/manus-storage/word-382_1671d460.mp3",
    "mandarin": "/manus-storage/word-382_bd940e99.mp3"
  },
  "露水": {
    "cantonese": "/manus-storage/word-383_6f2de1ce.mp3",
    "mandarin": "/manus-storage/word-383_cf8619bb.mp3"
  },
  "季節": {
    "cantonese": "/manus-storage/word-384_179f9cf3.mp3",
    "mandarin": "/manus-storage/word-384_0a11c902.mp3"
  },
  "春天": {
    "cantonese": "/manus-storage/word-385_405ab185.mp3",
    "mandarin": "/manus-storage/word-385_d618188f.mp3"
  },
  "夏天": {
    "cantonese": "/manus-storage/word-386_7476bdd0.mp3",
    "mandarin": "/manus-storage/word-386_ed4eb8d7.mp3"
  },
  "秋天": {
    "cantonese": "/manus-storage/word-387_b7e94a1b.mp3",
    "mandarin": "/manus-storage/word-387_e3ab6a9c.mp3"
  },
  "冬天": {
    "cantonese": "/manus-storage/word-388_acfdf78f.mp3",
    "mandarin": "/manus-storage/word-388_651d9f2c.mp3"
  },
  "責任感": {
    "cantonese": "/manus-storage/graded-425_5dd09e21.mp3",
    "mandarin": "/manus-storage/graded-425_649bc7b0.mp3"
  },
  "使命感": {
    "cantonese": "/manus-storage/graded-426_2693429e.mp3",
    "mandarin": "/manus-storage/graded-426_2a031b4c.mp3"
  },
  "榮譽感": {
    "cantonese": "/manus-storage/graded-427_1773d315.mp3",
    "mandarin": "/manus-storage/graded-427_3908a605.mp3"
  },
  "歸屬感": {
    "cantonese": "/manus-storage/graded-428_59dc66b9.mp3",
    "mandarin": "/manus-storage/graded-428_04b3883c.mp3"
  },
  "安全感": {
    "cantonese": "/manus-storage/graded-429_42e0e100.mp3",
    "mandarin": "/manus-storage/graded-429_215cae61.mp3"
  },
  "成就感": {
    "cantonese": "/manus-storage/graded-430_73254233.mp3",
    "mandarin": "/manus-storage/graded-430_6bc95c26.mp3"
  },
  "無力感": {
    "cantonese": "/manus-storage/graded-431_3ee7d31a.mp3",
    "mandarin": "/manus-storage/graded-431_8ac8eed4.mp3"
  },
  "疏離感": {
    "cantonese": "/manus-storage/graded-432_e40d2d29.mp3",
    "mandarin": "/manus-storage/graded-432_9bdb86cc.mp3"
  },
  "自卑": {
    "cantonese": "/manus-storage/graded-433_7850592b.mp3",
    "mandarin": "/manus-storage/graded-433_738d45a7.mp3"
  },
  "自責": {
    "cantonese": "/manus-storage/graded-434_8b6b23e4.mp3",
    "mandarin": "/manus-storage/graded-434_3e8fa623.mp3"
  },
  "自省": {
    "cantonese": "/manus-storage/graded-435_db33efd8.mp3",
    "mandarin": "/manus-storage/graded-435_cb196ad4.mp3"
  },
  "自律": {
    "cantonese": "/manus-storage/graded-436_72ffa4de.mp3",
    "mandarin": "/manus-storage/graded-436_c977c4ba.mp3"
  },
  "包容": {
    "cantonese": "/manus-storage/graded-437_bd0e2e51.mp3",
    "mandarin": "/manus-storage/graded-437_ef458565.mp3"
  },
  "諒解": {
    "cantonese": "/manus-storage/graded-438_5c7a741c.mp3",
    "mandarin": "/manus-storage/graded-438_1cfba214.mp3"
  },
  "憐憫": {
    "cantonese": "/manus-storage/graded-439_1601e0f2.mp3",
    "mandarin": "/manus-storage/graded-439_c8e5524c.mp3"
  },
  "焦躁": {
    "cantonese": "/manus-storage/graded-440_9f2d1aa9.mp3",
    "mandarin": "/manus-storage/graded-440_e8213f2c.mp3"
  },
  "惋惜": {
    "cantonese": "/manus-storage/graded-441_b27ccdb9.mp3",
    "mandarin": "/manus-storage/graded-441_2aa60760.mp3"
  },
  "感慨": {
    "cantonese": "/manus-storage/graded-442_1bad0087.mp3",
    "mandarin": "/manus-storage/graded-442_05523e62.mp3"
  },
  "惆悵": {
    "cantonese": "/manus-storage/graded-443_5d2fcfb2.mp3",
    "mandarin": "/manus-storage/graded-443_fb6a102d.mp3"
  },
  "哀傷": {
    "cantonese": "/manus-storage/graded-444_aa25a4d4.mp3",
    "mandarin": "/manus-storage/graded-444_b95437c6.mp3"
  },
  "悲憤": {
    "cantonese": "/manus-storage/graded-445_331b5077.mp3",
    "mandarin": "/manus-storage/graded-445_118b9232.mp3"
  },
  "欣喜": {
    "cantonese": "/manus-storage/graded-446_823415b7.mp3",
    "mandarin": "/manus-storage/graded-446_f8b65eda.mp3"
  },
  "雀躍": {
    "cantonese": "/manus-storage/graded-447_9359b506.mp3",
    "mandarin": "/manus-storage/graded-447_97323853.mp3"
  },
  "激動": {
    "cantonese": "/manus-storage/graded-448_b1a7fe60.mp3",
    "mandarin": "/manus-storage/graded-448_cc557b34.mp3"
  },
  "震撼": {
    "cantonese": "/manus-storage/graded-449_70e5d0ee.mp3",
    "mandarin": "/manus-storage/graded-449_383adc83.mp3"
  },
  "憧憬": {
    "cantonese": "/manus-storage/graded-450_47f4f4aa.mp3",
    "mandarin": "/manus-storage/graded-450_aa5f70a5.mp3"
  },
  "嚮往": {
    "cantonese": "/manus-storage/graded-451_5f4e1428.mp3",
    "mandarin": "/manus-storage/graded-451_53fd5f61.mp3"
  },
  "執著": {
    "cantonese": "/manus-storage/graded-452_e64294aa.mp3",
    "mandarin": "/manus-storage/graded-452_1ccaeb2c.mp3"
  },
  "果斷": {
    "cantonese": "/manus-storage/graded-453_8a57a6a4.mp3",
    "mandarin": "/manus-storage/graded-453_ff5038ab.mp3"
  },
  "克制": {
    "cantonese": "/manus-storage/graded-454_b6e4e187.mp3",
    "mandarin": "/manus-storage/graded-454_d67f50ab.mp3"
  },
  "社區": {
    "cantonese": "/manus-storage/word-404_e375a47c.mp3",
    "mandarin": "/manus-storage/word-404_18be97b3.mp3"
  },
  "醫院": {
    "cantonese": "/manus-storage/word-405_67a17240.mp3",
    "mandarin": "/manus-storage/word-405_525609cb.mp3"
  },
  "郵局": {
    "cantonese": "/manus-storage/word-406_4785c553.mp3",
    "mandarin": "/manus-storage/word-406_5d04e653.mp3"
  },
  "超級市場": {
    "cantonese": "/manus-storage/word-407_7d86e149.mp3",
    "mandarin": "/manus-storage/word-407_0fa5abb8.mp3"
  },
  "公園": {
    "cantonese": "/manus-storage/word-408_365de49b.mp3",
    "mandarin": "/manus-storage/word-408_bd1f7d6b.mp3"
  },
  "警署": {
    "cantonese": "/manus-storage/word-409_c16c0622.mp3",
    "mandarin": "/manus-storage/word-409_8daf5798.mp3"
  },
  "消防局": {
    "cantonese": "/manus-storage/word-410_6d288523.mp3",
    "mandarin": "/manus-storage/word-410_220405a6.mp3"
  },
  "政府": {
    "cantonese": "/manus-storage/word-411_c244ea9e.mp3",
    "mandarin": "/manus-storage/word-411_8500b471.mp3"
  },
  "議員": {
    "cantonese": "/manus-storage/word-412_f2501e82.mp3",
    "mandarin": "/manus-storage/word-412_d8f9514d.mp3"
  },
  "市民": {
    "cantonese": "/manus-storage/word-413_e8a9ddd6.mp3",
    "mandarin": "/manus-storage/word-413_f0f0c102.mp3"
  },
  "義工": {
    "cantonese": "/manus-storage/word-414_e5bd5174.mp3",
    "mandarin": "/manus-storage/word-414_c1d4eab8.mp3"
  },
  "鄰居": {
    "cantonese": "/manus-storage/word-415_aa87a7c8.mp3",
    "mandarin": "/manus-storage/word-415_f9a130d8.mp3"
  },
  "環保": {
    "cantonese": "/manus-storage/word-416_dab19975.mp3",
    "mandarin": "/manus-storage/word-416_ef8bffb8.mp3"
  },
  "回收": {
    "cantonese": "/manus-storage/word-417_5f4c8b8a.mp3",
    "mandarin": "/manus-storage/word-417_dd3a0b05.mp3"
  },
  "交通": {
    "cantonese": "/manus-storage/word-418_a136fd8e.mp3",
    "mandarin": "/manus-storage/word-418_1497786f.mp3"
  },
  "規則": {
    "cantonese": "/manus-storage/word-419_6928a107.mp3",
    "mandarin": "/manus-storage/word-419_bdbd210e.mp3"
  },
  "法律": {
    "cantonese": "/manus-storage/word-420_269335f3.mp3",
    "mandarin": "/manus-storage/word-420_fc12acdf.mp3"
  },
  "權利": {
    "cantonese": "/manus-storage/word-421_96e5095f.mp3",
    "mandarin": "/manus-storage/word-421_2952a262.mp3"
  },
  "責任": {
    "cantonese": "/manus-storage/word-422_672c1d12.mp3",
    "mandarin": "/manus-storage/word-422_6e9e97bd.mp3"
  },
  "文化": {
    "cantonese": "/manus-storage/word-423_207cf881.mp3",
    "mandarin": "/manus-storage/word-423_7bfc89cd.mp3"
  },
  "歷史": {
    "cantonese": "/manus-storage/word-424_4e04e4f3.mp3",
    "mandarin": "/manus-storage/word-424_a5facf8e.mp3"
  },
  "藝術": {
    "cantonese": "/manus-storage/word-425_4cd6107d.mp3",
    "mandarin": "/manus-storage/word-425_f213d6e0.mp3"
  },
  "科學": {
    "cantonese": "/manus-storage/word-426_490d6308.mp3",
    "mandarin": "/manus-storage/word-426_7b294885.mp3"
  },
  "博物館": {
    "cantonese": "/manus-storage/word-427_e5a7a822.mp3",
    "mandarin": "/manus-storage/word-427_170067f8.mp3"
  },
  "劇場": {
    "cantonese": "/manus-storage/word-428_4fd06782.mp3",
    "mandarin": "/manus-storage/word-428_a1c516f6.mp3"
  },
  "新聞": {
    "cantonese": "/manus-storage/word-429_fb5486e5.mp3",
    "mandarin": "/manus-storage/word-429_1739a517.mp3"
  },
  "媒體": {
    "cantonese": "/manus-storage/word-430_e2c9a3d8.mp3",
    "mandarin": "/manus-storage/word-430_51f700b0.mp3"
  },
  "慈善": {
    "cantonese": "/manus-storage/word-431_f0188553.mp3",
    "mandarin": "/manus-storage/word-431_b894157e.mp3"
  },
  "服務": {
    "cantonese": "/manus-storage/word-432_131252e0.mp3",
    "mandarin": "/manus-storage/word-432_559f4e51.mp3"
  },
  "公共設施": {
    "cantonese": "/manus-storage/graded-455_95a3eba0.mp3",
    "mandarin": "/manus-storage/graded-455_a269f541.mp3"
  }
};

export default topicAudio;
