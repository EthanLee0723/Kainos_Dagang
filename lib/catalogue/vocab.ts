import type { Localized } from "../site";

/*
 * Shared wording for the catalogue, in all three languages. Product data
 * refers to these by key so a phrase is translated once and reads the same
 * on every product.
 */

export const colour = {
  black: { en: "Black", ms: "Hitam", zh: "黑色" },
  brown: { en: "Brown", ms: "Coklat", zh: "棕色" },
  nubuckBrown: { en: "Nubuck brown", ms: "Coklat nubuk", zh: "磨砂棕" },
  lightBrown: { en: "Light brown", ms: "Coklat muda", zh: "浅棕色" },
  blackBrown: { en: "Black brown", ms: "Coklat kehitaman", zh: "黑棕色" },
  brownBlack: { en: "Brown black", ms: "Coklat hitam", zh: "棕黑色" },
  whisky: { en: "Whisky", ms: "Wiski", zh: "威士忌色" },
  khaki: { en: "Khaki", ms: "Khaki", zh: "卡其色" },
  tan: { en: "Tan", ms: "Perang muda", zh: "棕褐色" },
  camel: { en: "Camel", ms: "Perang unta", zh: "驼色" },
  maroon: { en: "Maroon", ms: "Merah marun", zh: "酒红色" },
  chilliRed: { en: "Chilli red", ms: "Merah cili", zh: "辣椒红" },
  grey: { en: "Grey", ms: "Kelabu", zh: "灰色" },
  white: { en: "White", ms: "Putih", zh: "白色" },
  yellow: { en: "Yellow", ms: "Kuning", zh: "黄色" },
  orange: { en: "Orange", ms: "Oren", zh: "橙色" },
  red: { en: "Red", ms: "Merah", zh: "红色" },
  blue: { en: "Blue", ms: "Biru", zh: "蓝色" },
  lightBlue: { en: "Light blue", ms: "Biru muda", zh: "浅蓝色" },
  green: { en: "Green", ms: "Hijau", zh: "绿色" },
  fluoYellow: { en: "Fluorescent yellow", ms: "Kuning pendarfluor", zh: "荧光黄" },
  blackRed: { en: "Black/red", ms: "Hitam/merah", zh: "黑红" },
  blackGrey: { en: "Black/grey", ms: "Hitam/kelabu", zh: "黑灰" },
  blackOrange: { en: "Black/orange", ms: "Hitam/oren", zh: "黑橙" },
} satisfies Record<string, Localized>;

export type ColourKey = keyof typeof colour;

export const feature = {
  steelToe: { en: "Steel toe cap", ms: "Penutup jari kaki keluli", zh: "钢头防砸" },
  compositeToe: { en: "Composite toe cap (metal-free)", ms: "Penutup jari kaki komposit (bebas logam)", zh: "复合材料鞋头（无金属）" },
  absToe: { en: "ABS plastic toe cap (light duty)", ms: "Penutup jari kaki plastik ABS (tugas ringan)", zh: "ABS 塑料鞋头（轻型防护）" },
  noSteelToe: { en: "No steel toe cap", ms: "Tiada penutup jari kaki keluli", zh: "无钢头" },
  steelMidsole: { en: "Steel anti-puncture midsole", ms: "Tapak tengah keluli kalis tusukan", zh: "钢板防刺穿中底" },
  kevlarMidsole: { en: "Kevlar anti-puncture midsole", ms: "Tapak tengah Kevlar kalis tusukan", zh: "凯夫拉防刺穿中底" },
  punctureResistant: { en: "Puncture-resistant", ms: "Kalis tusukan", zh: "防刺穿" },
  oilResistant: { en: "Oil-resistant outsole", ms: "Tapak luar tahan minyak", zh: "耐油大底" },
  oilHeatResistant: { en: "Oil- and heat-resistant outsole", ms: "Tapak luar tahan minyak dan haba", zh: "耐油耐高温大底" },
  fuelOilResistant: { en: "Fuel-oil-resistant rubber sole", ms: "Tapak getah tahan minyak bahan api", zh: "耐燃油橡胶大底" },
  heatResistant300: { en: "Heat-resistant outsole (300 °C for 60 s)", ms: "Tapak luar tahan haba (300 °C selama 60 s)", zh: "耐高温大底（300°C，60 秒）" },
  slipResistant: { en: "Slip-resistant outsole", ms: "Tapak luar kalis gelincir", zh: "防滑大底" },
  rubberEva: { en: "Rubber and EVA outsole", ms: "Tapak luar getah dan EVA", zh: "橡胶 + EVA 大底" },
  puSole: { en: "PU outsole", ms: "Tapak luar PU", zh: "PU 大底" },
  puRubber: { en: "PU/rubber outsole", ms: "Tapak luar PU/getah", zh: "PU/橡胶大底" },
  ultraGrip: { en: "UltraGrip Pro rubber outsole", ms: "Tapak getah UltraGrip Pro", zh: "UltraGrip Pro 橡胶大底" },
  doubleLock: { en: "Double-lock stitched upper", ms: "Bahagian atas berjahit kunci berganda", zh: "双锁缝合鞋面" },
  goodyear: { en: "Goodyear welted construction", ms: "Binaan Goodyear welt", zh: "固特异沿条工艺" },
  leather: { en: "Genuine leather upper", ms: "Bahagian atas kulit asli", zh: "真皮鞋面" },
  fullGrain: { en: "Full-grain leather", ms: "Kulit full-grain", zh: "头层全粒面皮" },
  embossed: { en: "Embossed leather upper", ms: "Bahagian atas kulit bercorak timbul", zh: "压纹皮鞋面" },
  mesh: { en: "Breathable mesh upper", ms: "Bahagian atas jaring bernafas", zh: "透气网面" },
  fabric: { en: "Fabric upper", ms: "Bahagian atas fabrik", zh: "织物鞋面" },
  flyknit: { en: "Flyknit upper", ms: "Bahagian atas Flyknit", zh: "飞织鞋面" },
  waterproof: { en: "Waterproof", ms: "Kalis air", zh: "防水" },
  waterproofUpper: { en: "Waterproof upper", ms: "Bahagian atas kalis air", zh: "防水鞋面" },
  waterproofMembrane: { en: "Waterproof, seam-sealed membrane", ms: "Membran kalis air, jahitan dikedap", zh: "防水内膜，接缝密封" },
  antistatic: { en: "Antistatic", ms: "Antistatik", zh: "防静电" },
  esd: { en: "ESD (static-dissipative)", ms: "ESD (melesapkan cas statik)", zh: "ESD 静电消散" },
  electricHazard: { en: "Electrical hazard protection", ms: "Perlindungan bahaya elektrik", zh: "电绝缘防护" },
  metalFree: { en: "Metal-free build", ms: "Binaan bebas logam", zh: "无金属结构" },
  fastLock: { en: "Fast Lock dial lacing", ms: "Tali pantas Fast Lock berdail", zh: "快锁旋钮鞋带" },
  rubberToeBumper: { en: "Rubber toe bumper", ms: "Pelindung jari kaki getah", zh: "橡胶护趾" },
  wideToe: { en: "Wide toe design", ms: "Reka bentuk jari kaki lebar", zh: "宽楦鞋头" },
  reflector: { en: "Reflective details", ms: "Butiran pemantul cahaya", zh: "反光细节" },
  stitched: { en: "Stitched for durability", ms: "Berjahit untuk ketahanan", zh: "缝线加固，经久耐穿" },
  evaInsole: { en: "EVA insole", ms: "Tapak dalam EVA", zh: "EVA 鞋垫" },
  removableInsole: { en: "Removable cushioned EVA insole", ms: "Tapak dalam EVA berkusyen boleh tanggal", zh: "可拆卸 EVA 缓震鞋垫" },
  dosh: { en: "SIRIM-DOSH approved (MS ISO 20345:2008)", ms: "Diluluskan SIRIM-DOSH (MS ISO 20345:2008)", zh: "SIRIM-DOSH 认证（MS ISO 20345:2008）" },
  s5src: { en: "EN ISO 20345:2011 S5 SRC", ms: "EN ISO 20345:2011 S5 SRC", zh: "EN ISO 20345:2011 S5 SRC" },
  s5fo: { en: "EN ISO 20345:2022 S5 FO", ms: "EN ISO 20345:2022 S5 FO", zh: "EN ISO 20345:2022 S5 FO" },
  shaft35: { en: "35 cm shaft", ms: "Batang 35 cm", zh: "35 厘米筒高" },
  shaft27: { en: "27 cm shaft", ms: "Batang 27 cm", zh: "27 厘米筒高" },
  limitedStock: { en: "Limited sizes and stock", ms: "Saiz dan stok terhad", zh: "尺码和库存有限" },
} satisfies Record<string, Localized>;

export type FeatureKey = keyof typeof feature;

export type Cut = "low" | "mid" | "high";

/** Cut + fastening, as the catalogues name each style. */
export const style = {
  lowLace: { cut: "low", name: { en: "Low-Cut Lace-Up", ms: "Potongan Rendah Bertali", zh: "低帮系带" } },
  lowSlipOn: { cut: "low", name: { en: "Low-Cut Slip-On", ms: "Potongan Rendah Tanpa Tali", zh: "低帮一脚蹬" } },
  lowFastLock: { cut: "low", name: { en: "Low-Cut Fast Lock", ms: "Potongan Rendah Fast Lock", zh: "低帮快锁" } },
  midLace: { cut: "mid", name: { en: "Mid-Cut Lace-Up", ms: "Potongan Sederhana Bertali", zh: "中帮系带" } },
  midLaceZip: { cut: "mid", name: { en: "Mid-Cut Lace-Up with Zip", ms: "Potongan Sederhana Bertali dan Berzip", zh: "中帮系带拉链" } },
  midDoubleZip: { cut: "mid", name: { en: "Mid-Cut Double Zip", ms: "Potongan Sederhana Zip Berkembar", zh: "中帮双拉链" } },
  midSingleZip: { cut: "mid", name: { en: "Mid-Cut Single Zip", ms: "Potongan Sederhana Zip Tunggal", zh: "中帮单拉链" } },
  midZipVelcro: { cut: "mid", name: { en: "Mid-Cut Zip & Velcro", ms: "Potongan Sederhana Zip & Velcro", zh: "中帮拉链魔术贴" } },
  midSlipOnZip: { cut: "mid", name: { en: "Mid-Cut Slip-On with Zip", ms: "Potongan Sederhana Tanpa Tali Berzip", zh: "中帮一脚蹬拉链" } },
  midFastLock: { cut: "mid", name: { en: "Mid-Cut Fast Lock", ms: "Potongan Sederhana Fast Lock", zh: "中帮快锁" } },
  midPullOn: { cut: "mid", name: { en: "Mid-Cut Pull-On", ms: "Potongan Sederhana Sarung", zh: "中帮套穿" } },
  highSlipOn: { cut: "high", name: { en: "High-Cut Slip-On", ms: "Potongan Tinggi Tanpa Tali", zh: "高帮一脚蹬" } },
  highSlipOnZip: { cut: "high", name: { en: "High-Cut Slip-On with Zip", ms: "Potongan Tinggi Tanpa Tali Berzip", zh: "高帮一脚蹬拉链" } },
  highZipVelcro: { cut: "high", name: { en: "High-Cut Double Zip & Velcro", ms: "Potongan Tinggi Zip Berkembar & Velcro", zh: "高帮双拉链魔术贴" } },
  highPullOnLace: { cut: "high", name: { en: "8-Inch Pull-On Lace-Up", ms: "Potongan Tinggi 8 Inci Bertali", zh: "8 英寸高帮系带" } },
} satisfies Record<string, { cut: Cut; name: Localized }>;

export type StyleKey = keyof typeof style;

export type Sizes = { label: Localized; values: string[] };

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

export const ukSizes = (from: number, to: number): Sizes => ({
  label: { en: "UK size", ms: "Saiz UK", zh: "英码" },
  values: range(from, to),
});

export const euSizes = (from: number, to: number): Sizes => ({
  label: { en: "EU size", ms: "Saiz EU", zh: "欧码" },
  values: range(from, to),
});
