import type { CategoryId, Pictogram, Product, UseCase } from "../products";
import type { Localized } from "../site";
import { type ColourKey, type Cut, colour, euSizes, type FeatureKey, feature, type Sizes, style, type StyleKey, ukSizes } from "./vocab";

/*
 * Safety footwear, transcribed from the brands' own catalogues:
 * - Black Hammer, Safex, Hammerland, Toelect: Black Safe e-catalogue, Aug 2026
 * - Kickers: Kickers Safety catalogue, Aug 2026
 * - Tanker Tec: product sheets from the client
 * Prices in the catalogues are deliberately left out: pricing goes through WhatsApp.
 */

/** A product line: one series in a brand's catalogue, sharing copy and core specs. */
type Line = {
  brand: string;
  /** Series name, used in the product name ("4000 Series Mid-Cut Lace-Up Safety Boot"). */
  label?: Localized;
  category?: CategoryId;
  summary: Localized;
  description: Localized;
  features: FeatureKey[];
  uses: UseCase[];
};

type Spec = {
  code: string;
  line: Line;
  style?: StyleKey;
  /** Full name, for products that don't follow the "series + style + noun" pattern. */
  name?: Localized;
  cut?: Cut | "rain" | "clog";
  colours: ColourKey[];
  sizes?: Sizes;
  /** Extra features on top of the line's own. */
  features?: FeatureKey[];
  /** Features to drop from the line's list for this model. */
  without?: FeatureKey[];
  slug?: string;
  featured?: boolean;
};

const noun = {
  shoe: { en: "Safety Shoe", ms: "Kasut Keselamatan", zh: "安全鞋" },
  boot: { en: "Safety Boot", ms: "But Keselamatan", zh: "安全靴" },
} satisfies Record<string, Localized>;

const series = (n: string) => ({ en: `${n} Series`, ms: `Siri ${n}`, zh: `${n} 系列` });

// ─── Black Hammer ──────────────────────────────────────────────────────────

const BH = "Black Hammer";

const bhClassic: Line = {
  brand: BH,
  label: { en: "Classic", ms: "Klasik", zh: "经典款" },
  summary: {
    en: "A plain black leather safety shoe with a steel toe cap and an oil-resistant sole.",
    ms: "Kasut keselamatan kulit hitam ringkas dengan penutup jari keluli dan tapak tahan minyak.",
    zh: "简洁黑色皮革安全鞋，钢头防砸，耐油大底。",
  },
  description: {
    en: "Black Hammer's Classic Series is the everyday workhorse: a genuine leather upper, a steel toe cap and an oil-resistant sole, for factory, warehouse and workshop floors. Sizes 11 and 12 carry a small surcharge; ask us on WhatsApp.",
    ms: "Siri Klasik Black Hammer ialah pilihan harian: bahagian atas kulit asli, penutup jari keluli dan tapak tahan minyak, untuk lantai kilang, gudang dan bengkel. Saiz 11 dan 12 dikenakan caj tambahan kecil; tanya kami di WhatsApp.",
    zh: "Black Hammer 经典系列是日常主力款：真皮鞋面、钢头防砸、耐油大底，适合工厂、仓库和车间。11、12 码需少量加价，详情请在 WhatsApp 咨询。",
  },
  features: ["leather", "steelToe", "oilResistant"],
  uses: ["factory", "warehouse", "workshop"],
};

const bh2000: Line = {
  brand: BH,
  label: series("2000"),
  summary: {
    en: "Genuine leather, a steel toe cap and a steel midsole on an oil-resistant sole.",
    ms: "Kulit asli, penutup jari keluli dan tapak tengah keluli di atas tapak tahan minyak.",
    zh: "真皮鞋面，钢头加钢板中底，耐油大底。",
  },
  description: {
    en: "The 2000 Series pairs a genuine leather upper with a steel toe cap (200 J impact) and a steel midsole that stops nails and sharp debris coming through the sole. The oil-resistant outsole withstands heat up to 180 °C, and the insole absorbs shock to cut fatigue on long shifts.",
    ms: "Siri 2000 menggabungkan bahagian atas kulit asli dengan penutup jari keluli (hentaman 200 J) dan tapak tengah keluli yang menghalang paku dan serpihan tajam menembusi tapak. Tapak luar tahan minyak menahan haba sehingga 180 °C, dan tapak dalam menyerap hentakan untuk mengurangkan keletihan sepanjang syif.",
    zh: "2000 系列采用真皮鞋面，钢头可抗 200 焦耳冲击，钢板中底防止钉子和尖锐碎片刺穿鞋底。耐油大底可耐 180°C 高温，鞋垫吸震，长时间工作也不易疲劳。",
  },
  features: ["leather", "steelToe", "steelMidsole", "oilResistant"],
  uses: ["construction", "factory", "warehouse", "workshop"],
};

const bh4000: Line = {
  brand: BH,
  label: series("4000"),
  summary: {
    en: "Heavy-duty leather with a steel toe, steel midsole and a double-lock stitched upper.",
    ms: "Kulit tugas berat dengan penutup jari keluli, tapak tengah keluli dan bahagian atas berjahit kunci berganda.",
    zh: "重型真皮安全鞋，钢头、钢板中底，双锁缝合鞋面。",
  },
  description: {
    en: "Black Hammer's 4000 Series is built for hard sites: a steel toe cap rated to 200 J impact and 15,000 N compression, a steel midsole rated to 1,100 N penetration, and an oil-resistant rubber sole. The upper is double-lock stitched to the sole so it holds together for longer.",
    ms: "Siri 4000 Black Hammer dibina untuk tapak kerja yang lasak: penutup jari keluli tahan hentaman 200 J dan mampatan 15,000 N, tapak tengah keluli tahan tusukan 1,100 N, dan tapak getah tahan minyak. Bahagian atas dijahit kunci berganda pada tapak supaya lebih tahan lama.",
    zh: "Black Hammer 4000 系列专为艰苦工地打造：钢头可抗 200 焦耳冲击和 15,000 牛压力，钢板中底可抗 1,100 牛穿刺，配耐油橡胶大底。鞋面以双锁缝线与鞋底牢固相连，更加耐穿。",
  },
  features: ["leather", "steelToe", "steelMidsole", "oilResistant", "doubleLock"],
  uses: ["construction", "factory", "oil-gas", "workshop"],
};

const bhSport: Line = {
  brand: BH,
  label: { en: "Sport", ms: "Sukan", zh: "运动款" },
  summary: {
    en: "A trainer-style safety shoe: lighter on the foot, with full toe protection.",
    ms: "Kasut keselamatan gaya kasut sukan: lebih ringan, dengan perlindungan jari kaki penuh.",
    zh: "运动鞋款式的安全鞋：脚感更轻，鞋头防护不打折。",
  },
  description: {
    en: "Black Hammer's sport range looks and feels like a trainer but keeps a protective toe cap and an anti-puncture midsole. A good pick for warehouses, logistics and anyone who walks a lot on shift.",
    ms: "Rangkaian sukan Black Hammer kelihatan dan terasa seperti kasut sukan tetapi kekal dengan penutup jari pelindung dan tapak tengah kalis tusukan. Sesuai untuk gudang, logistik dan sesiapa yang banyak berjalan semasa syif.",
    zh: "Black Hammer 运动系列外观和脚感都像运动鞋，同时保留防护鞋头和防刺穿中底。适合仓库、物流以及上班需要大量走动的人。",
  },
  features: [],
  uses: ["warehouse", "logistics", "factory"],
};

const bhSafety: Line = {
  brand: BH,
  summary: {
    en: "Black Hammer leather safety footwear with a steel toe cap and steel midsole.",
    ms: "Kasut keselamatan kulit Black Hammer dengan penutup jari keluli dan tapak tengah keluli.",
    zh: "Black Hammer 皮革安全鞋，钢头加钢板中底。",
  },
  description: {
    en: "From Black Hammer's Men's Safety Series: a leather upper over a steel toe cap and a steel anti-puncture midsole, for construction sites, factories and workshops.",
    ms: "Daripada Siri Keselamatan Lelaki Black Hammer: bahagian atas kulit dengan penutup jari keluli dan tapak tengah keluli kalis tusukan, untuk tapak pembinaan, kilang dan bengkel.",
    zh: "Black Hammer 男款安全系列：皮革鞋面，钢头加钢板防刺穿中底，适合建筑工地、工厂和车间。",
  },
  features: ["leather", "steelToe", "steelMidsole"],
  uses: ["construction", "factory", "workshop"],
};

const bhFastLock: Line = {
  ...bhSport,
  label: { en: "Fast Lock", ms: "Fast Lock", zh: "快锁" },
  summary: {
    en: "Sporty safety footwear with a dial instead of laces: push, turn to tighten, pull to release.",
    ms: "Kasut keselamatan sporty dengan dail menggantikan tali: tekan, pusing untuk ketatkan, tarik untuk lepaskan.",
    zh: "运动款安全鞋，用旋钮代替鞋带：按下、旋紧、拉起即松开。",
  },
  description: {
    en: "The Fast Lock lacing system tightens evenly with a turn of the dial and releases with a pull, so there are no loose laces to snag on site. Composite toe cap and Kevlar anti-puncture midsole keep it metal-free and light.",
    ms: "Sistem tali Fast Lock diketatkan sekata dengan pusingan dail dan dilepaskan dengan tarikan, jadi tiada tali longgar yang boleh tersangkut di tapak kerja. Penutup jari komposit dan tapak tengah Kevlar kalis tusukan menjadikannya bebas logam dan ringan.",
    zh: "快锁鞋带系统旋转旋钮即可均匀收紧，一拉即松开，工地上不再有松散鞋带被勾住的风险。复合材料鞋头和凯夫拉防刺穿中底，无金属更轻便。",
  },
  features: ["compositeToe", "kevlarMidsole", "rubberEva", "fastLock"],
};

const bhUltraGrip: Line = {
  ...bhFastLock,
  label: { en: "UltraGrip Pro", ms: "UltraGrip Pro", zh: "UltraGrip Pro" },
  summary: {
    en: "Waterproof Fast Lock safety footwear on Black Hammer's UltraGrip Pro rubber and EVA sole.",
    ms: "Kasut keselamatan Fast Lock kalis air dengan tapak getah dan EVA UltraGrip Pro Black Hammer.",
    zh: "防水快锁安全鞋，配 Black Hammer UltraGrip Pro 橡胶 + EVA 大底。",
  },
  description: {
    en: "Black Hammer's top range. A HydroGuard waterproof, seam-sealed membrane keeps feet dry; the UltraGrip Pro outsole pairs rubber for grip with EVA for cushioning over long hours; ESD and an antistatic insole keep static down. Built to the EN S3 standard.",
    ms: "Rangkaian tertinggi Black Hammer. Membran kalis air HydroGuard dengan jahitan dikedap memastikan kaki kering; tapak UltraGrip Pro menggabungkan getah untuk cengkaman dan EVA untuk keselesaan berjam-jam; ESD dan tapak dalam antistatik mengurangkan cas statik. Dibina mengikut standard EN S3.",
    zh: "Black Hammer 顶级系列。HydroGuard 防水内膜接缝密封，保持双脚干爽；UltraGrip Pro 大底以橡胶抓地、EVA 缓震，久穿舒适；ESD 设计和防静电鞋垫减少静电。按 EN S3 标准制造。",
  },
  features: ["waterproofMembrane", "compositeToe", "kevlarMidsole", "ultraGrip", "fastLock", "esd"],
  uses: ["factory", "logistics", "construction"],
};

const bhGoodyear: Line = {
  brand: BH,
  label: { en: "Goodyear Welt", ms: "Goodyear Welt", zh: "固特异" },
  summary: {
    en: "Goodyear-welted leather safety boots, stitched to last and resoleable.",
    ms: "But keselamatan kulit berbinaan Goodyear welt, dijahit untuk tahan lama.",
    zh: "固特异沿条工艺真皮安全靴，缝制牢固、经久耐穿。",
  },
  description: {
    en: "In a Goodyear welted boot the upper, insole and sole are stitched together through a leather welt, which makes one of the strongest, longest-lasting bonds in footwear. Leather upper and lining, a cork bed, a steel toe cap and a steel midsole.",
    ms: "Dalam but Goodyear welt, bahagian atas, tapak dalam dan tapak dijahit bersama melalui jalur kulit, menghasilkan ikatan antara yang paling kukuh dan tahan lama. Bahagian atas dan lapisan kulit, lapisan gabus, penutup jari keluli dan tapak tengah keluli.",
    zh: "固特异沿条工艺将鞋面、内底和大底通过皮质沿条缝合在一起，是鞋类中最牢固、最耐用的结构之一。皮质鞋面和内里、软木垫层、钢头和钢板中底。",
  },
  features: ["goodyear", "leather", "steelToe", "steelMidsole"],
  uses: ["construction", "oil-gas", "workshop"],
};

const bhMotor: Line = {
  brand: BH,
  label: { en: "Motor", ms: "Motor", zh: "骑行" },
  summary: {
    en: "Safety boots for riders: gear-pad protection, a steel toe and a fuel-oil-resistant sole.",
    ms: "But keselamatan untuk penunggang: pelindung gear, penutup jari keluli dan tapak tahan minyak bahan api.",
    zh: "适合骑手的安全靴：换挡护垫、钢头防砸、耐燃油大底。",
  },
  description: {
    en: "Black Hammer's motor boots are made for dispatch riders and anyone who rides to site: a gear-pad over the toe, a steel toe cap and steel midsole, and a fuel-oil-resistant rubber sole with double-lock stitching.",
    ms: "But motor Black Hammer dibuat untuk penghantar dan sesiapa yang menunggang ke tapak kerja: pelindung gear di atas jari kaki, penutup jari keluli dan tapak tengah keluli, serta tapak getah tahan minyak bahan api dengan jahitan kunci berganda.",
    zh: "Black Hammer 骑行靴专为外卖骑手和骑车上工地的人设计：鞋头换挡护垫、钢头和钢板中底，配双锁缝线耐燃油橡胶大底。",
  },
  features: ["leather", "steelToe", "steelMidsole", "fuelOilResistant"],
  uses: ["logistics", "construction"],
};

const bhWaterproof: Line = {
  brand: BH,
  label: { en: "Waterproof", ms: "Kalis Air", zh: "防水" },
  summary: {
    en: "A waterproof leather safety boot for wet sites and rainy days.",
    ms: "But keselamatan kulit kalis air untuk tapak basah dan hari hujan.",
    zh: "防水真皮安全靴，适合潮湿工地和雨天。",
  },
  description: {
    en: "From Black Hammer's water-resistant range: a waterproof leather upper with full toe and sole protection, for sites where puddles and mud are part of the job.",
    ms: "Daripada rangkaian kalis air Black Hammer: bahagian atas kulit kalis air dengan perlindungan jari kaki dan tapak penuh, untuk tapak kerja yang penuh lopak dan lumpur.",
    zh: "Black Hammer 防水系列：防水皮革鞋面，鞋头和鞋底全面防护，适合积水泥泞的工地。",
  },
  features: ["waterproof"],
  uses: ["construction", "plantation", "oil-gas"],
};

const bhRain: Line = {
  brand: BH,
  category: "safety-boots",
  summary: {
    en: "A 100% waterproof PVC safety rain boot.",
    ms: "But hujan keselamatan PVC 100% kalis air.",
    zh: "100% 防水 PVC 安全雨靴。",
  },
  description: {
    en: "For wet sites, wash-down areas, plantations and food processing. Fully waterproof, easy to hose clean at the end of the day, with a ridged anti-slip sole.",
    ms: "Untuk tapak basah, kawasan cucian, ladang dan pemprosesan makanan. Kalis air sepenuhnya, mudah dibersihkan dengan air di penghujung hari, dengan tapak beralur anti-gelincir.",
    zh: "适用于潮湿工地、冲洗区、种植园和食品加工。完全防水，收工后用水一冲就干净，鞋底带防滑纹路。",
  },
  features: ["waterproof", "slipResistant"],
  uses: ["plantation", "food", "construction"],
};

const bhLadies: Line = {
  brand: BH,
  label: { en: "Ladies'", ms: "Wanita", zh: "女款" },
  summary: {
    en: "Black Hammer cut for women's feet, with the same steel toe and steel midsole.",
    ms: "Black Hammer yang dipotong untuk kaki wanita, dengan penutup jari dan tapak tengah keluli yang sama.",
    zh: "按女性脚型设计的 Black Hammer，同样钢头加钢板中底。",
  },
  description: {
    en: "Many women make do with small men's sizes that never quite fit. The Ladies Series is made on a women's last, in UK 4 to 10, with a steel toe cap, steel midsole and oil-resistant sole. Come in and try it on.",
    ms: "Ramai wanita terpaksa memakai saiz lelaki yang kecil dan tidak pernah benar-benar muat. Siri Wanita dibuat pada acuan kaki wanita, saiz UK 4 hingga 10, dengan penutup jari keluli, tapak tengah keluli dan tapak tahan minyak. Datang dan cuba di kedai.",
    zh: "很多女性只能将就穿小码男鞋，始终不太合脚。女款系列采用女性鞋楦，英码 4 至 10，钢头、钢板中底、耐油大底。欢迎到店试穿。",
  },
  features: ["steelToe", "steelMidsole", "oilResistant"],
  uses: ["factory", "warehouse", "food"],
};

const bhHospitality: Line = {
  brand: BH,
  category: "hospitality",
  summary: {
    en: "A waterproof, slip-resistant safety clog for kitchens and long shifts on wet floors.",
    ms: "Klog keselamatan kalis air dan kalis gelincir untuk dapur dan syif panjang di lantai basah.",
    zh: "防水防滑安全洞洞鞋，适合厨房和湿滑地面上的长班。",
  },
  description: {
    en: "Black Hammer safety clogs are made for food service, hospitality and healthcare. The upper keeps out water and oil, the rubber sole grips on wet floors, and the light build stays comfortable through a long shift.",
    ms: "Klog keselamatan Black Hammer dibuat untuk perkhidmatan makanan, hospitaliti dan penjagaan kesihatan. Bahagian atas menghalang air dan minyak, tapak getah mencengkam lantai basah, dan binaannya yang ringan kekal selesa sepanjang syif.",
    zh: "Black Hammer 安全洞洞鞋专为餐饮、酒店和医疗行业设计。鞋面防水防油，橡胶大底在湿滑地面也能抓地，轻便设计整个班次都舒适。",
  },
  features: ["waterproofUpper", "slipResistant"],
  uses: ["hospitality", "food"],
};

// ─── Safex ─────────────────────────────────────────────────────────────────

const safex: Line = {
  brand: "Safex",
  category: "hospitality",
  summary: {
    en: "A leather kitchen safety shoe with a light-duty toe cap and an anti-slip sole.",
    ms: "Kasut keselamatan dapur kulit dengan penutup jari tugas ringan dan tapak anti-gelincir.",
    zh: "真皮厨房安全鞋，轻型防护鞋头，防滑大底。",
  },
  description: {
    en: "Safex kitchen shoes are designed for food service, hospitality and healthcare: tested in the field and comfortable through long shifts, with an anti-slip pattern sole for wet kitchen floors.",
    ms: "Kasut dapur Safex direka untuk perkhidmatan makanan, hospitaliti dan penjagaan kesihatan: diuji di lapangan dan selesa sepanjang syif, dengan tapak bercorak anti-gelincir untuk lantai dapur yang basah.",
    zh: "Safex 厨房鞋专为餐饮、酒店和医疗行业设计：经实地测试，长班也舒适，防滑纹路大底适合湿滑的厨房地面。",
  },
  features: ["leather", "absToe", "stitched", "slipResistant"],
  uses: ["hospitality", "food"],
};

// ─── Hammerland ────────────────────────────────────────────────────────────

const hammerland: Line = {
  brand: "Hammerland",
  summary: {
    en: "Value safety footwear with a steel toe cap and steel midsole.",
    ms: "Kasut keselamatan berpatutan dengan penutup jari keluli dan tapak tengah keluli.",
    zh: "高性价比安全鞋，钢头加钢板中底。",
  },
  description: {
    en: "Hammerland covers the basics well: a steel toe cap, a steel anti-puncture midsole and an oil- or slip-resistant sole, at a price that suits kitting out a whole crew.",
    ms: "Hammerland memenuhi keperluan asas dengan baik: penutup jari keluli, tapak tengah keluli kalis tusukan dan tapak tahan minyak atau kalis gelincir, pada harga yang sesuai untuk melengkapkan seluruh pasukan.",
    zh: "Hammerland 把基本防护做到位：钢头、钢板防刺穿中底、耐油或防滑大底，价格适合为整个团队配备。",
  },
  features: ["steelToe", "steelMidsole"],
  uses: ["construction", "factory", "warehouse"],
};

const hammerland4000: Line = {
  ...hammerland,
  description: {
    en: "Hammerland's leather range: a steel toe cap and steel midsole, an oil-resistant rubber sole, and an upper double-lock stitched to the sole for a longer life on site.",
    ms: "Rangkaian kulit Hammerland: penutup jari keluli dan tapak tengah keluli, tapak getah tahan minyak, dan bahagian atas berjahit kunci berganda pada tapak untuk hayat lebih panjang di tapak kerja.",
    zh: "Hammerland 皮革系列：钢头和钢板中底，耐油橡胶大底，鞋面与鞋底双锁缝合，在工地上更耐穿。",
  },
  features: ["leather", "steelToe", "steelMidsole", "oilResistant", "doubleLock"],
  uses: ["construction", "factory", "workshop"],
};

// ─── Toelect ───────────────────────────────────────────────────────────────

const toelect: Line = {
  brand: "Toelect",
  summary: {
    en: "An affordable steel-toe safety shoe on an oil-resistant PU sole.",
    ms: "Kasut keselamatan berpenutup jari keluli yang mampu milik, dengan tapak PU tahan minyak.",
    zh: "实惠的钢头安全鞋，耐油 PU 大底。",
  },
  description: {
    en: "Toelect's SR range keeps it simple: a steel toe cap, a steel midsole and an oil-resistant PU outsole, for everyday site and factory wear.",
    ms: "Rangkaian SR Toelect ringkas dan praktikal: penutup jari keluli, tapak tengah keluli dan tapak luar PU tahan minyak, untuk kegunaan harian di tapak kerja dan kilang.",
    zh: "Toelect SR 系列简单实用：钢头、钢板中底、耐油 PU 大底，适合日常工地和工厂穿着。",
  },
  features: ["steelToe", "steelMidsole", "oilResistant", "puSole"],
  uses: ["construction", "factory", "warehouse"],
};

const toelectSport: Line = {
  brand: "Toelect",
  label: { en: "Sport", ms: "Sukan", zh: "运动款" },
  summary: {
    en: "A light Flyknit safety trainer with dial lacing and a composite toe.",
    ms: "Kasut sukan keselamatan Flyknit yang ringan dengan tali berdail dan penutup jari komposit.",
    zh: "轻便飞织安全运动鞋，旋钮系带，复合材料鞋头。",
  },
  description: {
    en: "Toelect's sport range is built on a breathable Flyknit upper with a composite toe cap and Kevlar midsole, so there's no metal to weigh it down. The Fast Lock dial tightens with a turn.",
    ms: "Rangkaian sukan Toelect dibina dengan bahagian atas Flyknit yang bernafas, penutup jari komposit dan tapak tengah Kevlar, jadi tiada logam yang memberatkannya. Dail Fast Lock diketatkan dengan sekali pusing.",
    zh: "Toelect 运动系列采用透气飞织鞋面、复合材料鞋头和凯夫拉中底，没有金属，穿着更轻。快锁旋钮一拧即可收紧。",
  },
  features: ["flyknit", "compositeToe", "kevlarMidsole", "rubberEva", "fastLock"],
  uses: ["warehouse", "logistics", "factory"],
};

// ─── Kickers ───────────────────────────────────────────────────────────────

const kickers: Line = {
  brand: "Kickers",
  summary: {
    en: "A Kickers leather safety boot with a wide toe box for all-day comfort.",
    ms: "But keselamatan kulit Kickers dengan ruang jari kaki lebar untuk keselesaan sepanjang hari.",
    zh: "Kickers 真皮安全靴，宽楦鞋头，全天舒适。",
  },
  description: {
    en: "Kickers Safety boots are made from genuine leather on a wide toe design, so there's room for your toes on long days. Each model pairs its toe cap with an anti-puncture midsole; check the features for the exact build.",
    ms: "But Kickers Safety dibuat daripada kulit asli dengan reka bentuk jari kaki lebar, jadi jari kaki anda ada ruang sepanjang hari. Setiap model menggabungkan penutup jari dengan tapak tengah kalis tusukan; lihat ciri-ciri untuk binaan sebenar.",
    zh: "Kickers Safety 安全靴采用真皮和宽楦设计，长时间穿着脚趾也有空间。每款都搭配防护鞋头和防刺穿中底，具体配置见产品特点。",
  },
  features: ["leather", "wideToe"],
  uses: ["construction", "oil-gas", "factory"],
};

const kickersMesh: Line = {
  brand: "Kickers",
  label: { en: "Mesh TPU", ms: "Mesh TPU", zh: "网面 TPU" },
  summary: {
    en: "A breathable, metal-free Kickers safety trainer with ESD protection.",
    ms: "Kasut sukan keselamatan Kickers yang bernafas, bebas logam dan dengan perlindungan ESD.",
    zh: "透气无金属的 Kickers 安全运动鞋，带 ESD 防护。",
  },
  description: {
    en: "A mesh upper with TPU overlays keeps air moving, a composite toe cap and Kevlar midsole keep it light, and ESD protection makes it suitable for electronics and clean-floor work.",
    ms: "Bahagian atas jaring dengan lapisan TPU mengekalkan pengudaraan, penutup jari komposit dan tapak tengah Kevlar menjadikannya ringan, dan perlindungan ESD menjadikannya sesuai untuk kerja elektronik dan lantai bersih.",
    zh: "网面鞋面配 TPU 覆盖层，保持透气；复合材料鞋头和凯夫拉中底更轻便；ESD 防护适合电子厂和洁净车间。",
  },
  features: ["mesh", "compositeToe", "kevlarMidsole", "esd"],
  uses: ["factory", "warehouse", "logistics"],
};

// ─── Tanker Tec ────────────────────────────────────────────────────────────

const tankerTec: Line = {
  brand: "Tanker Tec",
  summary: {
    en: "Metal-free, ESD safety footwear with a heat-, oil- and slip-resistant sole.",
    ms: "Kasut keselamatan bebas logam dan ESD dengan tapak tahan haba, minyak dan gelincir.",
    zh: "无金属 ESD 安全鞋，大底耐高温、耐油、防滑。",
  },
  description: {
    en: "Tanker Tec is built entirely without metal: a composite toe cap (EN ISO 20345:2011) and a Kevlar puncture-resistant midsole (EN 12568:2010), so it won't set off most security scanners. The outsole is oil-, slip- and heat-resistant (EN ISO 20344:2011), and ESD protection dissipates static.",
    ms: "Tanker Tec dibina sepenuhnya tanpa logam: penutup jari komposit (EN ISO 20345:2011) dan tapak tengah Kevlar kalis tusukan (EN 12568:2010), jadi ia tidak mencetuskan kebanyakan pengimbas keselamatan. Tapak luar tahan minyak, gelincir dan haba (EN ISO 20344:2011), dan perlindungan ESD melesapkan cas statik.",
    zh: "Tanker Tec 完全不含金属：复合材料鞋头（EN ISO 20345:2011）和凯夫拉防刺穿中底（EN 12568:2010），不易触发大多数安检设备。大底耐油、防滑、耐高温（EN ISO 20344:2011），ESD 设计可消散静电。",
  },
  features: ["compositeToe", "kevlarMidsole", "metalFree", "oilResistant", "slipResistant", "heatResistant300", "esd"],
  uses: ["factory", "warehouse", "construction"],
};

// ─── The range ─────────────────────────────────────────────────────────────

const specs: Spec[] = [
  // Black Hammer Classic
  { code: "BH 0991", line: bhClassic, style: "lowLace", colours: ["black"], sizes: ukSizes(4, 12) },
  { code: "BH 0993", line: bhClassic, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(4, 12) },
  { code: "BH0993/2-SP", line: bhClassic, style: "midDoubleZip", colours: ["black", "brown"], sizes: ukSizes(5, 12), features: ["fullGrain", "steelMidsole", "puSole"] },
  { code: "BH0993-779", line: bhClassic, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(5, 12), features: ["steelMidsole"], without: ["oilResistant"] },

  // Black Hammer 2000 Series
  { code: "BH 2331", line: bh2000, style: "lowLace", colours: ["black"], sizes: ukSizes(4, 12), features: ["dosh"] },
  { code: "BH 2333", line: bh2000, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(4, 12), features: ["dosh"], featured: true },
  { code: "BH 2882", line: bh2000, style: "midDoubleZip", colours: ["brown"], sizes: ukSizes(4, 11), features: ["dosh"] },
  { code: "BH 2334", line: bh2000, style: "highSlipOn", colours: ["black"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 2332", line: bh2000, style: "midLace", colours: ["black"], sizes: ukSizes(4, 12) },
  { code: "BH 2335", line: bh2000, style: "lowSlipOn", colours: ["black"], sizes: ukSizes(4, 12) },
  { code: "BH 2336", line: bh2000, style: "midLace", colours: ["black"], sizes: ukSizes(4, 12) },
  { code: "BH 2607", line: bh2000, style: "lowLace", colours: ["nubuckBrown", "brown"], sizes: ukSizes(6, 10) },
  { code: "BH 2608", line: bh2000, style: "lowSlipOn", colours: ["nubuckBrown"], sizes: ukSizes(6, 10) },
  { code: "BH 2609", line: bh2000, style: "midDoubleZip", colours: ["nubuckBrown", "brown"], sizes: ukSizes(6, 10) },
  { code: "BH 2610", line: bh2000, style: "midLace", colours: ["nubuckBrown", "black", "brown"], sizes: ukSizes(6, 10) },
  { code: "BH 2881", line: bh2000, style: "lowLace", colours: ["brown"], sizes: ukSizes(4, 11) },
  { code: "BH 2885", line: bh2000, style: "midDoubleZip", colours: ["black", "whisky"], sizes: ukSizes(5, 11) },
  { code: "BH 2889", line: bh2000, style: "midDoubleZip", colours: ["khaki"], sizes: ukSizes(5, 11) },

  // Black Hammer 4000 Series
  { code: "BH 4658", line: bh4000, style: "lowLace", colours: ["brown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4660", line: bh4000, style: "midLace", colours: ["brown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4663", line: bh4000, style: "midDoubleZip", colours: ["brown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4664", line: bh4000, style: "midSlipOnZip", colours: ["brown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4666", line: bh4000, style: "highSlipOn", colours: ["brown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4994", line: bh4000, style: "midLace", colours: ["brown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4891", line: bh4000, style: "midDoubleZip", colours: ["brown", "black"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4892", line: bh4000, style: "midLace", colours: ["brown", "whisky", "blackBrown"], sizes: ukSizes(5, 12), features: ["dosh"] },
  { code: "BH 4101", line: bh4000, style: "midLace", colours: ["tan"], sizes: ukSizes(5, 13) },
  { code: "BH 4102", line: bh4000, style: "midDoubleZip", colours: ["blackBrown"], sizes: ukSizes(5, 13) },
  { code: "BH 4103", line: bh4000, style: "midLace", colours: ["blackBrown"], sizes: ukSizes(5, 13) },
  { code: "BH 4107", line: bh4000, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(5, 13) },
  { code: "BH 4108", line: bh4000, style: "midLace", colours: ["brown"], sizes: ukSizes(5, 13) },
  { code: "BH 4109", line: bh4000, style: "midLace", colours: ["black"], sizes: ukSizes(5, 13) },
  { code: "BH 4501", line: bh4000, style: "midDoubleZip", colours: ["black", "khaki", "whisky"], sizes: ukSizes(5, 11) },
  { code: "BH 4659", line: bh4000, style: "lowSlipOn", colours: ["brown"], sizes: ukSizes(5, 12) },
  { code: "BH 4664 L", line: bh4000, style: "midSlipOnZip", colours: ["brown"], sizes: ukSizes(5, 11) },
  { code: "BH 4665", line: bh4000, style: "highSlipOnZip", colours: ["brown"], sizes: ukSizes(5, 12) },
  { code: "BH 4671", line: bh4000, style: "lowSlipOn", colours: ["brown"], sizes: ukSizes(5, 11) },
  { code: "BH 4671 L", line: bh4000, style: "lowSlipOn", colours: ["brown"], sizes: ukSizes(5, 12) },
  { code: "BH 4672", line: bh4000, style: "midDoubleZip", colours: ["brown"], sizes: ukSizes(5, 11) },
  { code: "BH 4672 L", line: bh4000, style: "midDoubleZip", colours: ["brown"], sizes: ukSizes(5, 11) },
  { code: "BH 4701", line: bh4000, style: "midDoubleZip", colours: ["blackBrown", "brownBlack"], sizes: ukSizes(5, 11) },
  { code: "BH 4751", line: bh4000, style: "midLace", colours: ["black"], sizes: ukSizes(5, 11) },
  { code: "BH 4755", line: bh4000, style: "highSlipOn", colours: ["brown", "maroon", "whisky"], sizes: ukSizes(5, 12) },
  { code: "BH 4881", line: bh4000, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(5, 12) },
  { code: "BH 4883", line: bh4000, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(5, 12) },
  { code: "BH 4884", line: bh4000, style: "highSlipOnZip", colours: ["black"], sizes: ukSizes(5, 12) },
  { code: "BH 4991", line: bh4000, style: "lowLace", colours: ["brown"], sizes: ukSizes(5, 12) },
  { code: "BH 4992", line: bh4000, style: "lowLace", colours: ["brown"], sizes: ukSizes(5, 12) },
  { code: "BH 4993", line: bh4000, style: "lowLace", colours: ["brown"], sizes: ukSizes(5, 12) },
  { code: "BH 4602", line: bh4000, style: "lowLace", colours: ["brown"], sizes: ukSizes(5, 12), without: ["steelMidsole"] },
  { code: "BH 4654", line: bh4000, style: "midLace", colours: ["brown"], sizes: ukSizes(5, 12), without: ["steelMidsole"] },

  // Black Hammer sport, Fast Lock and UltraGrip Pro
  { code: "BH2019-004", line: bhSafety, style: "highSlipOn", colours: ["brown", "black"], sizes: ukSizes(5, 13), features: ["puRubber"] },
  { code: "BHS 201604", line: bhSport, style: "midLace", colours: ["black", "brown"], sizes: ukSizes(5, 11), features: ["steelToe", "steelMidsole", "slipResistant", "oilResistant"] },
  { code: "BH2016-008/B", line: bhSport, style: "lowLace", colours: ["black"], sizes: euSizes(38, 46), features: ["compositeToe", "kevlarMidsole", "antistatic", "oilResistant", "puSole"] },
  { code: "BHS 201622", line: bhSport, style: "lowLace", colours: ["blackRed", "grey"], sizes: euSizes(38, 46), features: ["compositeToe", "kevlarMidsole", "rubberEva"] },
  { code: "BHS 201628", line: bhSport, style: "lowLace", colours: ["black"], sizes: euSizes(39, 47), features: ["mesh", "compositeToe", "kevlarMidsole", "ultraGrip"] },
  { code: "BHS 201610", line: bhSafety, style: "midLace", colours: ["black"], sizes: euSizes(37, 47), features: ["embossed", "puSole"], without: ["leather"] },
  { code: "BHS 201612", line: bhFastLock, style: "lowFastLock", colours: ["black"], sizes: euSizes(37, 47), features: ["fabric"] },
  { code: "BHS 201629", line: bhFastLock, style: "lowFastLock", colours: ["black"], sizes: euSizes(39, 47), features: ["mesh", "ultraGrip"] },
  { code: "BHS 201630", line: bhFastLock, style: "midFastLock", colours: ["black"], sizes: euSizes(39, 47), features: ["mesh", "ultraGrip"] },
  { code: "BHS 26618", line: bhMotor, style: "midDoubleZip", colours: ["black", "whisky"], sizes: ukSizes(6, 10), without: ["leather"] },
  { code: "BHS22003", line: bhUltraGrip, style: "lowFastLock", colours: ["black"], sizes: euSizes(39, 47), features: ["limitedStock"] },
  { code: "BHS22004", line: bhUltraGrip, style: "midFastLock", colours: ["grey"], sizes: euSizes(39, 47) },
  { code: "BHS22004/B", line: bhUltraGrip, style: "midFastLock", colours: ["black"], sizes: euSizes(39, 47) },
  { code: "BHS22005", line: bhUltraGrip, style: "lowFastLock", colours: ["black"], sizes: euSizes(39, 47) },
  { code: "BHS22006", line: bhUltraGrip, style: "midFastLock", colours: ["black"], sizes: euSizes(39, 47) },

  // Black Hammer Goodyear Welt
  { code: "BH-8001", line: bhGoodyear, style: "midLace", colours: ["black", "chilliRed"], sizes: ukSizes(5, 11), features: ["oilHeatResistant"], featured: true },
  { code: "BH-8002", line: bhGoodyear, style: "midDoubleZip", colours: ["brown", "maroon"], sizes: ukSizes(5, 11), features: ["oilHeatResistant"] },
  { code: "BH-8003", line: bhGoodyear, style: "midLace", colours: ["brown", "tan"], sizes: ukSizes(5, 11), features: ["oilResistant"] },
  { code: "BH-8004", line: bhGoodyear, style: "midDoubleZip", colours: ["black", "tan"], sizes: ukSizes(5, 11), features: ["oilResistant"] },

  // Black Hammer motor boots
  { code: "BHS26622", line: bhMotor, style: "midZipVelcro", colours: ["brown", "black"], sizes: ukSizes(6, 10) },
  { code: "BHS26623", line: bhMotor, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(6, 10) },
  { code: "BHS26624", line: bhMotor, style: "highZipVelcro", colours: ["black"], sizes: ukSizes(6, 10) },
  { code: "BHS26625", line: bhMotor, style: "midSingleZip", colours: ["black", "brown"], sizes: ukSizes(6, 10), features: ["rubberToeBumper"] },
  { code: "BHS26626", line: bhMotor, style: "midLace", colours: ["black", "brown"], sizes: ukSizes(6, 10), features: ["rubberToeBumper"] },

  // Black Hammer waterproof
  { code: "BHS 201611", line: bhWaterproof, style: "midLace", colours: ["brown"], sizes: euSizes(39, 46), features: ["leather", "steelToe", "steelMidsole", "slipResistant", "oilResistant"] },
  { code: "BH-1102RS", line: bhWaterproof, style: "midLace", colours: ["black"], sizes: euSizes(39, 47), features: ["compositeToe", "kevlarMidsole", "puRubber", "limitedStock"] },

  // Black Hammer safety rain boots
  {
    code: "BH(LL-2)", line: bhRain, cut: "rain", colours: ["yellow", "white", "black"], sizes: euSizes(37, 47),
    name: { en: "Safety Rain Boot, 35 cm", ms: "But Hujan Keselamatan, 35 cm", zh: "安全雨靴，35 厘米" },
    features: ["steelToe", "steelMidsole", "shaft35", "s5src"], featured: true,
  },
  {
    code: "BH(LL-2) 106", line: bhRain, cut: "rain", colours: ["yellow", "black", "white", "brown"], sizes: euSizes(39, 46),
    name: { en: "Safety Rain Boot 106, 35 cm", ms: "But Hujan Keselamatan 106, 35 cm", zh: "安全雨靴 106，35 厘米" },
    features: ["steelToe", "steelMidsole", "shaft35", "s5fo"],
  },
  {
    code: "BH(LL-3)", line: bhRain, cut: "rain", colours: ["white"], sizes: euSizes(37, 47),
    name: { en: "Rain Boot, 27 cm (No Steel Toe)", ms: "But Hujan, 27 cm (Tanpa Penutup Jari Keluli)", zh: "雨靴，27 厘米（无钢头）" },
    features: ["noSteelToe", "evaInsole", "shaft27"],
  },
  {
    code: "BH(LL-4)", line: bhRain, cut: "rain", colours: ["black"], sizes: euSizes(37, 47),
    name: { en: "Rain Boot, 35 cm (No Steel Toe)", ms: "But Hujan, 35 cm (Tanpa Penutup Jari Keluli)", zh: "雨靴，35 厘米（无钢头）" },
    features: ["noSteelToe", "evaInsole", "shaft35"],
  },
  {
    code: "BH(LL-5)", line: bhRain, cut: "rain", colours: ["brown"], sizes: euSizes(37, 47),
    name: { en: "Safety Rain Boot, 35 cm, Brown", ms: "But Hujan Keselamatan, 35 cm, Coklat", zh: "安全雨靴，35 厘米，棕色" },
    features: ["steelToe", "steelMidsole", "evaInsole", "shaft35", "s5src"],
  },

  // Black Hammer Ladies
  { code: "BH 3887", line: bhLadies, style: "lowLace", colours: ["black", "brown"], sizes: ukSizes(4, 10) },
  { code: "BH 3888", line: bhLadies, style: "midLace", colours: ["black", "brown"], sizes: ukSizes(4, 10) },
  { code: "BH 3889", line: bhLadies, style: "midDoubleZip", colours: ["black", "brown"], sizes: ukSizes(4, 10) },
  { code: "BH2-3890", line: bhLadies, style: "lowLace", colours: ["black"], sizes: ukSizes(4, 10) },
  { code: "BH2-3891", line: bhLadies, style: "midLace", colours: ["black"], sizes: ukSizes(4, 10) },
  { code: "BH2-3892", line: bhLadies, style: "midDoubleZip", colours: ["black"], sizes: ukSizes(4, 10) },

  // Black Hammer hospitality clogs
  {
    code: "BHC-S077(T)-HT", line: bhHospitality, cut: "clog", colours: ["black"], sizes: euSizes(36, 46),
    name: { en: "Safety Clog with Toe Cap", ms: "Klog Keselamatan dengan Penutup Jari", zh: "带护头安全洞洞鞋" },
    features: ["absToe", "removableInsole"],
  },
  {
    code: "BHC-S077", line: bhHospitality, cut: "clog", colours: ["black"], sizes: euSizes(36, 47),
    name: { en: "Kitchen Safety Clog", ms: "Klog Keselamatan Dapur", zh: "厨房安全洞洞鞋" },
  },
  {
    code: "BHC-S085", line: bhHospitality, cut: "clog", colours: ["black"], sizes: euSizes(36, 47),
    name: { en: "Kitchen Safety Clog with Strap", ms: "Klog Keselamatan Dapur Bertali", zh: "带后带厨房安全洞洞鞋" },
  },

  // Safex
  {
    code: "SFC-8300/1-HT", line: safex, cut: "clog", colours: ["black"], sizes: euSizes(39, 46),
    name: { en: "Leather Kitchen Slip-On", ms: "Kasut Dapur Kulit Tanpa Tali", zh: "真皮厨房一脚蹬" },
  },
  {
    code: "SFC-8300/2-HT", line: safex, cut: "clog", colours: ["black", "white"], sizes: euSizes(40, 46),
    name: { en: "Leather Kitchen Slip-On, Open Back", ms: "Kasut Dapur Kulit Tanpa Tali, Belakang Terbuka", zh: "真皮厨房一脚蹬，露跟款" },
  },
  {
    code: "SFC-8300/3-HT", line: safex, cut: "clog", colours: ["black"], sizes: euSizes(42, 46),
    name: { en: "Leather Kitchen Slip-On with Buckle Strap", ms: "Kasut Dapur Kulit Tanpa Tali dengan Tali Kancing", zh: "真皮厨房一脚蹬，带扣带" },
  },
  {
    code: "SFC-SP8021", line: safex, cut: "low", colours: ["black"], sizes: euSizes(40, 46),
    name: { en: "Dry Kitchen Safety Sneaker", ms: "Kasut Sukan Keselamatan Dapur Kering", zh: "干厨房安全运动鞋" },
    features: ["mesh", "compositeToe", "kevlarMidsole", "rubberEva"], without: ["leather", "absToe", "stitched"],
  },

  // Hammerland
  { code: "HAM 3001GK", line: hammerland, style: "lowLace", colours: ["grey"], sizes: euSizes(36, 45), features: ["oilResistant"] },
  { code: "HAM 3002GK", line: hammerland, style: "midDoubleZip", colours: ["black", "brown", "nubuckBrown"], sizes: euSizes(36, 45), features: ["oilResistant"] },
  { code: "HAM 3003GK", line: hammerland, style: "midLace", colours: ["grey"], sizes: euSizes(36, 45), features: ["oilResistant"] },
  { code: "HAM 3004GK", line: hammerland, style: "lowLace", colours: ["brown"], sizes: euSizes(36, 45), features: ["oilResistant"] },
  { code: "HAM 3008GK", line: hammerland, style: "midLace", colours: ["black", "brown"], sizes: euSizes(36, 47), features: ["slipResistant"] },
  { code: "HAM 3010GK", line: hammerland, style: "highSlipOn", colours: ["black", "brown"], sizes: euSizes(39, 47), features: ["slipResistant"] },
  { code: "HAM 4401", line: hammerland4000, style: "midLaceZip", colours: ["brown"], sizes: ukSizes(6, 11) },
  { code: "HAM 4402", line: hammerland4000, style: "midDoubleZip", colours: ["brown", "khaki"], sizes: ukSizes(6, 11) },
  { code: "HAM 4403", line: hammerland4000, style: "midLace", colours: ["khaki"], sizes: ukSizes(6, 11) },
  { code: "HAM 4404", line: hammerland4000, style: "midDoubleZip", colours: ["black", "blackBrown"], sizes: ukSizes(6, 11) },
  { code: "HAM 4405", line: hammerland4000, style: "highSlipOn", colours: ["lightBrown", "black"], sizes: ukSizes(6, 11) },

  // Toelect
  { code: "TOE-SR1002", line: toelect, style: "lowLace", colours: ["black"], sizes: euSizes(39, 47) },
  { code: "TOE-SR1003", line: toelect, style: "midDoubleZip", colours: ["black"], sizes: euSizes(38, 46) },
  { code: "TOE-SR1004", line: toelect, style: "midLace", colours: ["black"], sizes: euSizes(39, 46) },
  { code: "TOE-SP004", line: toelectSport, style: "lowFastLock", colours: ["black"], sizes: euSizes(39, 46) },
  { code: "TOE-SP006", line: toelectSport, style: "lowFastLock", colours: ["black"], sizes: euSizes(39, 46) },
  { code: "TOE-SP007", line: toelectSport, style: "midFastLock", colours: ["black"], sizes: euSizes(39, 46) },

  // Kickers
  {
    code: "TY2-3068", line: kickers, style: "midDoubleZip", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "5-Inch Ankle Boot, Duo Zip", ms: "But Buku Lali 5 Inci, Zip Berkembar", zh: "5 英寸双拉链短靴" },
    features: ["compositeToe", "kevlarMidsole", "esd", "waterproof", "reflector"], featured: true,
  },
  {
    code: "TY2-3066", line: kickers, style: "midLace", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "5-Inch Ankle Boot, Lace-Up", ms: "But Buku Lali 5 Inci, Bertali", zh: "5 英寸系带短靴" },
    features: ["compositeToe", "kevlarMidsole", "esd", "waterproof", "reflector"],
  },
  {
    code: "BRFL1998", line: kickers, style: "midLace", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "Ankle-Cut Safety Boot", ms: "But Keselamatan Paras Buku Lali", zh: "及踝安全靴" },
    features: ["steelToe", "kevlarMidsole", "waterproof", "slipResistant"],
  },
  {
    code: "BKFL1998", line: kickers, style: "midLace", colours: ["black"], sizes: ukSizes(6, 13),
    name: { en: "Ankle-Cut Safety Boot", ms: "But Keselamatan Paras Buku Lali", zh: "及踝安全靴" },
    features: ["steelToe", "kevlarMidsole", "waterproof", "slipResistant"],
  },
  {
    code: "BKFL1768", line: kickers, style: "midLace", colours: ["black"], sizes: ukSizes(6, 13),
    name: { en: "Ankle Safety Boot, Steel Plate", ms: "But Keselamatan Buku Lali, Plat Keluli", zh: "钢板及踝安全靴" },
    features: ["steelToe", "steelMidsole", "waterproof", "slipResistant"],
  },
  {
    code: "BRFL1768", line: kickers, style: "midLace", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "Ankle Safety Boot, Steel Plate", ms: "But Keselamatan Buku Lali, Plat Keluli", zh: "钢板及踝安全靴" },
    features: ["steelToe", "steelMidsole", "waterproof", "slipResistant"],
  },
  {
    code: "CMFL2986", line: kickers, style: "midLace", colours: ["camel"], sizes: ukSizes(6, 13),
    name: { en: "Goodyear Welted Ankle Boot", ms: "But Buku Lali Goodyear Welt", zh: "固特异工艺及踝靴" },
    features: ["compositeToe", "punctureResistant", "goodyear", "slipResistant"],
  },
  {
    code: "BRFL2986", line: kickers, style: "midLace", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "Goodyear Welted Ankle Boot", ms: "But Buku Lali Goodyear Welt", zh: "固特异工艺及踝靴" },
    features: ["compositeToe", "punctureResistant", "goodyear", "slipResistant"],
  },
  {
    code: "TY2-3069", line: kickers, style: "highPullOnLace", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "8-Inch Pull-On Boot, Lace-Up", ms: "But Sarung 8 Inci, Bertali", zh: "8 英寸套穿系带靴" },
    features: ["compositeToe", "kevlarMidsole", "waterproof", "reflector"],
  },
  {
    code: "BRFL2840", line: kickers, style: "midLace", colours: ["brown"], sizes: ukSizes(6, 13),
    name: { en: "Electrical Hazard Ankle Boot", ms: "But Buku Lali Bahaya Elektrik", zh: "电绝缘及踝靴" },
    features: ["compositeToe", "kevlarMidsole", "electricHazard", "goodyear", "slipResistant"],
  },
  {
    code: "AS2512", slug: "kickers-as2512-ankle", line: kickersMesh, style: "midLace", colours: ["blackRed", "blackGrey"], sizes: ukSizes(6, 13),
    name: { en: "Mesh TPU Ankle-Cut Safety Trainer", ms: "Kasut Sukan Keselamatan Mesh TPU Paras Buku Lali", zh: "网面 TPU 及踝安全运动鞋" },
  },
  {
    code: "AS2512", slug: "kickers-as2512-low", line: kickersMesh, style: "lowLace", colours: ["blackRed", "blackGrey"], sizes: ukSizes(6, 13),
    name: { en: "Mesh TPU Low-Cut Safety Trainer", ms: "Kasut Sukan Keselamatan Mesh TPU Potongan Rendah", zh: "网面 TPU 低帮安全运动鞋" },
  },
  {
    code: "AS2528", line: kickersMesh, style: "lowLace", colours: ["black"], sizes: ukSizes(6, 13),
    name: { en: "Mesh TPU Low-Cut Safety Trainer", ms: "Kasut Sukan Keselamatan Mesh TPU Potongan Rendah", zh: "网面 TPU 低帮安全运动鞋" },
  },

  // Tanker Tec
  { code: "TKT 50009", line: tankerTec, style: "midLace", colours: ["blackOrange"], features: ["mesh"], featured: true },
  { code: "TKT 50008", line: tankerTec, style: "midLace", colours: ["brown"] },
  { code: "TKT 50011", line: tankerTec, style: "midLace", colours: ["brown"] },
  { code: "TKT 50010", line: tankerTec, style: "lowLace", colours: ["blackOrange"], features: ["mesh"] },
  { code: "TKT 50012", line: tankerTec, style: "midPullOn", colours: ["black"] },
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const pictogramFor: Record<NonNullable<Spec["cut"]>, Pictogram> = {
  low: "shoe",
  mid: "boot-mid",
  high: "boot-high",
  rain: "gumboot",
  clog: "shoe",
};

function categoryFor(cut: NonNullable<Spec["cut"]>): CategoryId {
  return cut === "low" || cut === "clog" ? "safety-shoes" : "safety-boots";
}

function nameFor(spec: Spec, cut: NonNullable<Spec["cut"]>): Localized {
  if (spec.name) return spec.name;
  const s = style[spec.style!].name;
  const n = cut === "low" ? noun.shoe : noun.boot;
  const label = spec.line.label;
  return {
    en: [label?.en, s.en, n.en].filter(Boolean).join(" "),
    ms: [n.ms, s.ms, label?.ms].filter(Boolean).join(" "),
    zh: [label?.zh, s.zh, n.zh].filter(Boolean).join(""),
  };
}

export function footwear(): Omit<Product, "image" | "gallery" | "imageFit">[] {
  return specs.map((spec) => {
    const cut = spec.cut ?? style[spec.style!].cut;
    const keys = [...spec.line.features, ...(spec.features ?? [])].filter(
      (key, i, all) => all.indexOf(key) === i && !spec.without?.includes(key),
    );
    return {
      slug: spec.slug ?? slugify(spec.code),
      code: spec.code,
      brand: spec.line.brand,
      category: spec.line.category ?? categoryFor(cut),
      pictogram: pictogramFor[cut],
      name: nameFor(spec, cut),
      summary: spec.line.summary,
      description: spec.line.description,
      features: keys.map((key) => feature[key]),
      sizes: spec.sizes,
      colours: spec.colours.map((key) => colour[key]),
      uses: spec.line.uses,
      featured: spec.featured,
    };
  });
}
