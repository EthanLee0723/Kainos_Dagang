import type { Product } from "../products";
import { colour } from "./vocab";

/*
 * Helmets and vests, from the product sheets the client supplied
 * (MSA, Proguard, and the reflective vests in "Misc").
 */
export const gear: Omit<Product, "image" | "gallery" | "imageFit">[] = [
  {
    slug: "msa-v-gard-helmet",
    code: "V-Gard",
    brand: "MSA",
    category: "helmets",
    pictogram: "helmet",
    name: {
      en: "MSA V-Gard Safety Helmet",
      ms: "Topi Keselamatan MSA V-Gard",
      zh: "MSA V-Gard 安全帽",
    },
    summary: {
      en: "The classic V-Gard hard hat, SIRIM-DOSH approved, with a shock buffer and an easy-adjust ratchet.",
      ms: "Topi keledar V-Gard klasik, diluluskan SIRIM-DOSH, dengan penyerap hentakan dan ratchet mudah laras.",
      zh: "经典 V-Gard 安全帽，SIRIM-DOSH 认证，带缓冲结构和易调旋钮。",
    },
    description: {
      en: "MSA calls itself The Safety Company, and the V-Gard is its best-known helmet. The V-shaped shock buffer helps absorb hard knocks, and the ratchet buckle adjusts to your head in seconds. Used on construction sites, ports, mechanical and production floors, by electricians, and in the chemical and mining industries.",
      ms: "MSA dikenali sebagai The Safety Company, dan V-Gard ialah topi keledarnya yang paling terkenal. Penyerap hentakan berbentuk V membantu menyerap hentaman kuat, dan kancing ratchet boleh dilaras mengikut kepala anda dalam beberapa saat. Digunakan di tapak pembinaan, pelabuhan, lantai mekanikal dan pengeluaran, oleh juruelektrik, serta dalam industri kimia dan perlombongan.",
      zh: "MSA 被称为 The Safety Company，V-Gard 是其最知名的安全帽。V 形缓冲结构帮助吸收强力撞击，旋钮扣几秒内即可调到合适头围。广泛用于建筑工地、港口、机械和生产车间、电工作业以及化工和采矿行业。",
    },
    features: [
      { en: "Classic V-Gard shell", ms: "Cangkerang V-Gard klasik", zh: "经典 V-Gard 帽壳" },
      { en: "V-shaped shock buffer", ms: "Penyerap hentakan berbentuk V", zh: "V 形缓冲结构" },
      { en: "Easy-adjust ratchet buckle", ms: "Kancing ratchet mudah laras", zh: "易调旋钮扣" },
      { en: "SIRIM-DOSH approved PPE", ms: "PPE diluluskan SIRIM-DOSH", zh: "SIRIM-DOSH 认证个人防护装备" },
    ],
    colours: [colour.white, colour.yellow, colour.red, colour.blue, colour.orange],
    uses: ["construction", "factory", "oil-gas", "logistics"],
    featured: true,
  },
  {
    slug: "proguard-advanlite-2-helmet",
    code: "WHG3RS",
    brand: "Proguard",
    category: "helmets",
    pictogram: "helmet",
    name: {
      en: "Proguard AdvanLite 2 Vented Helmet, Swivel Ratchet",
      ms: "Topi Keselamatan Berlubang Proguard AdvanLite 2, Ratchet Pusing",
      zh: "Proguard AdvanLite 2 透气安全帽，旋转棘轮",
    },
    summary: {
      en: "A vented ABS hard hat with a swivel ratchet that locks the fit in place.",
      ms: "Topi keledar ABS berlubang udara dengan ratchet pusing yang mengunci padanan.",
      zh: "ABS 透气安全帽，旋转棘轮锁定松紧。",
    },
    description: {
      en: "The AdvanLite 2 has a vented ABS shell to let heat out on hot sites and a webbing harness with a swivel ratchet lock. Complies with AS/NZS 1801:1997, MS 183:2001 and EN 397:2012 + A1:2012, and is SIRIM certified. Also available as the 4P-WHG3RS with a chin strap. Packed 1 per polybag, 20 per carton.",
      ms: "AdvanLite 2 mempunyai cangkerang ABS berlubang udara untuk membebaskan haba di tapak yang panas dan abah-abah anyaman dengan kunci ratchet pusing. Mematuhi AS/NZS 1801:1997, MS 183:2001 dan EN 397:2012 + A1:2012, serta diperakui SIRIM. Juga tersedia sebagai 4P-WHG3RS dengan tali dagu. Dibungkus 1 sebeg plastik, 20 sekarton.",
      zh: "AdvanLite 2 采用透气 ABS 帽壳，在炎热工地散热更好，配织带帽衬和旋转棘轮锁。符合 AS/NZS 1801:1997、MS 183:2001 和 EN 397:2012 + A1:2012，并获 SIRIM 认证。另有带下颚带的 4P-WHG3RS 款。每顶独立胶袋包装，每箱 20 顶。",
    },
    features: [
      { en: "Vented ABS shell", ms: "Cangkerang ABS berlubang udara", zh: "透气 ABS 帽壳" },
      { en: "Swivel ratchet lock", ms: "Kunci ratchet pusing", zh: "旋转棘轮锁" },
      { en: "Webbing harness", ms: "Abah-abah anyaman", zh: "织带帽衬" },
      { en: "EN 397 and MS 183 compliant, SIRIM certified", ms: "Mematuhi EN 397 dan MS 183, diperakui SIRIM", zh: "符合 EN 397 和 MS 183，SIRIM 认证" },
      { en: "Chin-strap version available (4P-WHG3RS)", ms: "Versi bertali dagu tersedia (4P-WHG3RS)", zh: "可选下颚带款（4P-WHG3RS）" },
    ],
    colours: [colour.white, colour.yellow, colour.blue, colour.red, colour.orange],
    pack: { en: "1 per polybag, 20 per carton", ms: "1 sebeg plastik, 20 sekarton", zh: "每顶独立包装，每箱 20 顶" },
    uses: ["construction", "factory", "roadworks"],
    featured: true,
  },
  {
    slug: "reflective-safety-vest-pockets",
    code: "VEST-ZP",
    category: "hi-vis",
    pictogram: "vest",
    name: {
      en: "Reflective Safety Vest with Zip and Pockets",
      ms: "Vest Keselamatan Pemantul Cahaya Berzip dan Berpoket",
      zh: "拉链多口袋反光安全背心",
    },
    summary: {
      en: "A full-colour hi-vis vest with a zip front, pockets and a clear ID-card holder.",
      ms: "Vest kebolehlihatan tinggi berwarna penuh dengan zip hadapan, poket dan pemegang kad ID lutsinar.",
      zh: "纯色高可视背心，前拉链，多口袋，透明证件袋。",
    },
    description: {
      en: "Two reflective bands around the body and two over the shoulders keep you visible from every direction, day and night. Front pockets and a clear card holder make it practical for supervisors, marshals and event crews. Available in several colours, so teams can be told apart at a glance.",
      ms: "Dua jalur pemantul di sekeliling badan dan dua di atas bahu memastikan anda kelihatan dari setiap arah, siang dan malam. Poket hadapan dan pemegang kad lutsinar menjadikannya praktikal untuk penyelia, marsyal dan kru acara. Tersedia dalam beberapa warna supaya pasukan mudah dibezakan.",
      zh: "身体两圈、肩部两道反光带，日夜都能从各个方向被看见。前口袋和透明证件袋，适合主管、指挥员和活动工作人员。多种颜色可选，方便一眼区分不同团队。",
    },
    features: [
      { en: "High-visibility reflective tape, front and back", ms: "Pita pemantul kebolehlihatan tinggi, depan dan belakang", zh: "前后高亮反光带" },
      { en: "Zip front", ms: "Zip hadapan", zh: "前拉链" },
      { en: "Multiple pockets", ms: "Pelbagai poket", zh: "多个口袋" },
      { en: "Clear ID-card holder", ms: "Pemegang kad ID lutsinar", zh: "透明证件袋" },
    ],
    colours: [colour.blue, colour.red, colour.orange, colour.green, colour.lightBlue, colour.fluoYellow],
    uses: ["construction", "roadworks", "logistics"],
    featured: true,
  },
  {
    slug: "mesh-reflective-safety-vest",
    code: "VEST-MS",
    category: "hi-vis",
    pictogram: "vest",
    name: {
      en: "Breathable Mesh Reflective Safety Vest",
      ms: "Vest Keselamatan Pemantul Cahaya Jaring Bernafas",
      zh: "透气网眼反光安全背心",
    },
    summary: {
      en: "A light mesh hi-vis vest with 2-inch PVC reflective tape all the way round.",
      ms: "Vest kebolehlihatan tinggi jaring yang ringan dengan pita pemantul PVC 2 inci di sekeliling badan.",
      zh: "轻薄网眼高可视背心，2 英寸 PVC 反光带环绕一周。",
    },
    description: {
      en: "Open mesh lets air through on hot days, and 2-inch high-visibility PVC reflective tape runs 360° around the waist, so drivers and machine operators see you from any side. A common bulk order for site crews and roadside work; ask us about custom printing.",
      ms: "Jaring terbuka membolehkan udara mengalir pada hari panas, dan pita pemantul PVC kebolehlihatan tinggi 2 inci melingkari pinggang 360°, jadi pemandu dan pengendali mesin nampak anda dari mana-mana sisi. Tempahan pukal yang biasa untuk kru tapak dan kerja tepi jalan; tanya kami tentang cetakan khas.",
      zh: "网眼面料在炎热天气也透气，2 英寸高亮 PVC 反光带 360° 环绕腰部，司机和机械操作员从任何方向都能看到你。工地团队和路边作业常见的批量订单；可咨询定制印字。",
    },
    features: [
      { en: "Breathable mesh", ms: "Jaring bernafas", zh: "透气网眼" },
      { en: '2" PVC reflective tape, 360° round the waist', ms: 'Pita pemantul PVC 2", 360° di pinggang', zh: "2 英寸 PVC 反光带，腰部 360° 环绕" },
      { en: "High-visibility colour", ms: "Warna kebolehlihatan tinggi", zh: "高可视颜色" },
      { en: "Custom printing on request", ms: "Cetakan khas atas permintaan", zh: "可按需定制印字" },
    ],
    colours: [colour.fluoYellow],
    uses: ["construction", "roadworks", "logistics"],
  },
];
