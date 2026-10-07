import type { Locale } from "./i18n/config";
import type { Localized } from "./site";

/*
 * SAMPLE CATALOGUE.
 * Every product below is a placeholder (`sample: true`) until the real product
 * list and photos arrive. To publish a real product, replace its fields, set
 * `sample: false`, and add `image` (a file in /public/products). Prices are
 * intentionally absent: all pricing goes through WhatsApp.
 */

export type CategoryId =
  | "safety-shoes"
  | "safety-boots"
  | "helmets"
  | "gloves"
  | "eye-ear"
  | "hi-vis"
  | "socks"
  | "site-safety";

export type Pictogram =
  | "shoe"
  | "boot-mid"
  | "boot-high"
  | "gumboot"
  | "helmet"
  | "glove"
  | "goggles"
  | "glasses"
  | "earmuff"
  | "vest"
  | "sock"
  | "cone"
  | "net"
  | "tape"
  | "baton";

export type UseCase =
  | "construction"
  | "factory"
  | "warehouse"
  | "logistics"
  | "workshop"
  | "oil-gas"
  | "food"
  | "plantation"
  | "roadworks";

export type Category = {
  id: CategoryId;
  name: Localized;
  blurb: Localized;
  pictogram: Pictogram;
};

export type Product = {
  slug: string;
  code: string;
  brand?: string;
  category: CategoryId;
  pictogram: Pictogram;
  /** Optional real photo in /public, e.g. "/products/kd-ss-101.webp". */
  image?: string;
  name: Localized;
  summary: Localized;
  description: Localized;
  features: Localized[];
  sizes?: { label: Localized; values: string[] };
  colours?: Localized[];
  pack?: Localized;
  uses: UseCase[];
  featured?: boolean;
  sample: boolean;
};

export const categories: Category[] = [
  {
    id: "safety-shoes",
    pictogram: "shoe",
    name: { en: "Safety Shoes", ms: "Kasut Keselamatan", zh: "安全鞋" },
    blurb: {
      en: "Low and mid-cut, laced, zipped or slip-on.",
      ms: "Potongan rendah dan sederhana, bertali, berzip atau tanpa tali.",
      zh: "低帮、中帮，系带、拉链或一脚蹬。",
    },
  },
  {
    id: "safety-boots",
    pictogram: "boot-high",
    name: { en: "Safety Boots", ms: "But Keselamatan", zh: "安全靴" },
    blurb: {
      en: "High-cut boots and rubber gumboots for wet, rough sites.",
      ms: "But potongan tinggi dan but getah untuk tapak basah dan lasak.",
      zh: "高帮安全靴与雨靴，适合潮湿崎岖的工地。",
    },
  },
  {
    id: "helmets",
    pictogram: "helmet",
    name: { en: "Safety Helmets", ms: "Topi Keselamatan", zh: "安全帽" },
    blurb: {
      en: "Hard hats in site colours, with ratchet or chin strap.",
      ms: "Topi keledar pelbagai warna tapak, dengan ratchet atau tali dagu.",
      zh: "多种工地颜色，旋钮调节或带下颚带。",
    },
  },
  {
    id: "gloves",
    pictogram: "glove",
    name: { en: "Gloves", ms: "Sarung Tangan", zh: "手套" },
    blurb: {
      en: "Cut-resistant, coated and cotton work gloves.",
      ms: "Sarung tangan tahan potong, bersalut dan kapas.",
      zh: "防割、涂层及棉纱劳保手套。",
    },
  },
  {
    id: "eye-ear",
    pictogram: "goggles",
    name: { en: "Eye & Ear Protection", ms: "Pelindung Mata & Telinga", zh: "护目与护耳" },
    blurb: {
      en: "Goggles, safety glasses and earmuffs.",
      ms: "Gogal, cermin mata keselamatan dan penutup telinga.",
      zh: "护目镜、安全眼镜和防噪耳罩。",
    },
  },
  {
    id: "hi-vis",
    pictogram: "vest",
    name: { en: "Safety Vests", ms: "Vest Keselamatan", zh: "反光背心" },
    blurb: {
      en: "Reflective vests so you are seen on site and on the road.",
      ms: "Vest pemantul cahaya supaya anda kelihatan di tapak dan jalan raya.",
      zh: "反光背心，让你在工地和道路上更醒目。",
    },
  },
  {
    id: "socks",
    pictogram: "sock",
    name: { en: "Socks", ms: "Stokin", zh: "袜子" },
    blurb: {
      en: "Cushioned work socks for long days in safety shoes.",
      ms: "Stokin kerja berkusyen untuk hari panjang berkasut keselamatan.",
      zh: "缓冲工作袜，久穿安全鞋也舒适。",
    },
  },
  {
    id: "site-safety",
    pictogram: "cone",
    name: { en: "Site Safety", ms: "Keselamatan Tapak", zh: "工地安全用品" },
    blurb: {
      en: "Cones, barrier netting, warning tape and traffic batons.",
      ms: "Kon, jaring penghadang, pita amaran dan baton trafik.",
      zh: "路锥、围栏网、警示带和交通指挥棒。",
    },
  },
];

const ukSizes = (from: number, to: number) => ({
  label: { en: "UK size", ms: "Saiz UK", zh: "英码" },
  values: Array.from({ length: to - from + 1 }, (_, i) => String(from + i)),
});

const apparelSizes = (values: string[]) => ({
  label: { en: "Size", ms: "Saiz", zh: "尺码" },
  values,
});

const colour = {
  white: { en: "White", ms: "Putih", zh: "白色" },
  yellow: { en: "Yellow", ms: "Kuning", zh: "黄色" },
  orange: { en: "Orange", ms: "Oren", zh: "橙色" },
  blue: { en: "Blue", ms: "Biru", zh: "蓝色" },
  red: { en: "Red", ms: "Merah", zh: "红色" },
  green: { en: "Green", ms: "Hijau", zh: "绿色" },
  black: { en: "Black", ms: "Hitam", zh: "黑色" },
  fluoYellow: { en: "Fluorescent yellow", ms: "Kuning pendarfluor", zh: "荧光黄" },
} satisfies Record<string, Localized>;

const feature = {
  steelToe: { en: "Steel toe cap", ms: "Penutup jari kaki keluli", zh: "钢头防砸" },
  slipResistant: { en: "Slip-resistant outsole", ms: "Tapak luar kalis gelincir", zh: "防滑大底" },
  oilResistant: { en: "Oil-resistant outsole", ms: "Tapak luar tahan minyak", zh: "耐油大底" },
  paddedCollar: { en: "Padded ankle collar", ms: "Kolar buku lali berpad", zh: "加垫护踝鞋口" },
} satisfies Record<string, Localized>;

export const products: Product[] = [
  {
    slug: "black-hammer-low-cut-lace-up",
    code: "KD-SS-101",
    brand: "Black Hammer",
    category: "safety-shoes",
    pictogram: "shoe",
    name: {
      en: "Black Hammer Low-Cut Lace-Up Safety Shoe",
      ms: "Kasut Keselamatan Black Hammer Potongan Rendah Bertali",
      zh: "Black Hammer 低帮系带安全鞋",
    },
    summary: {
      en: "An everyday low-cut safety shoe for factory and warehouse floors.",
      ms: "Kasut keselamatan potongan rendah untuk kegunaan harian di kilang dan gudang.",
      zh: "适合工厂和仓库日常穿着的低帮安全鞋。",
    },
    description: {
      en: "A classic lace-up safety shoe for people on their feet all shift. Try a few sizes in store so the toe cap sits right and the heel doesn't slip.",
      ms: "Kasut keselamatan bertali klasik untuk mereka yang berdiri sepanjang syif. Cuba beberapa saiz di kedai supaya penutup jari kaki selesa dan tumit tidak tergelincir.",
      zh: "经典系带安全鞋，适合整班站立工作的人。欢迎到店试穿不同尺码，确保鞋头贴合、脚跟不打滑。",
    },
    features: [
      feature.steelToe,
      feature.slipResistant,
      { en: "Breathable lining", ms: "Lapisan dalam bernafas", zh: "透气内衬" },
      { en: "Cushioned insole", ms: "Tapak dalam berkusyen", zh: "缓震鞋垫" },
    ],
    sizes: ukSizes(5, 12),
    uses: ["factory", "warehouse", "workshop"],
    featured: true,
    sample: true,
  },
  {
    slug: "black-hammer-mid-cut-side-zip",
    code: "KD-SS-102",
    brand: "Black Hammer",
    category: "safety-shoes",
    pictogram: "boot-mid",
    name: {
      en: "Black Hammer Mid-Cut Safety Shoe with Side Zip",
      ms: "Kasut Keselamatan Black Hammer Potongan Sederhana Berzip Sisi",
      zh: "Black Hammer 中帮侧拉链安全鞋",
    },
    summary: {
      en: "Mid-cut ankle support with a side zip for quick on and off.",
      ms: "Sokongan buku lali potongan sederhana dengan zip sisi untuk pakai dan tanggal dengan cepat.",
      zh: "中帮护踝设计，侧拉链穿脱快捷。",
    },
    description: {
      en: "The laces stay tied and the zip does the work, which suits jobs where you're in and out of your shoes all day. The higher collar gives your ankles more support on uneven ground.",
      ms: "Tali kekal terikat dan zip memudahkan kerja, sesuai untuk tugas yang kerap memakai dan menanggalkan kasut. Kolar yang lebih tinggi memberi sokongan tambahan pada buku lali di permukaan tidak rata.",
      zh: "鞋带系好不用解，拉链即可穿脱，适合一天多次穿脱的工作。较高的鞋口为脚踝在不平地面上提供更多支撑。",
    },
    features: [
      feature.steelToe,
      { en: "Side zip", ms: "Zip sisi", zh: "侧拉链" },
      feature.paddedCollar,
      feature.oilResistant,
    ],
    sizes: ukSizes(5, 12),
    uses: ["construction", "logistics", "workshop"],
    featured: true,
    sample: true,
  },
  {
    slug: "black-hammer-low-cut-slip-on",
    code: "KD-SS-103",
    brand: "Black Hammer",
    category: "safety-shoes",
    pictogram: "shoe",
    name: {
      en: "Black Hammer Low-Cut Slip-On Safety Shoe",
      ms: "Kasut Keselamatan Black Hammer Potongan Rendah Tanpa Tali",
      zh: "Black Hammer 低帮一脚蹬安全鞋",
    },
    summary: {
      en: "No laces to tie or catch: elastic sides and a steel toe.",
      ms: "Tiada tali untuk diikat atau tersangkut: sisi elastik dan penutup jari keluli.",
      zh: "无鞋带，不怕勾挂：松紧侧边，钢头保护。",
    },
    description: {
      en: "A slip-on safety shoe for warehouses, kitchens and workshops where loose laces are a hazard. Elastic side panels keep it snug without tying.",
      ms: "Kasut keselamatan tanpa tali untuk gudang, dapur dan bengkel di mana tali yang longgar boleh membahayakan. Panel sisi elastik memastikan ia kemas tanpa perlu diikat.",
      zh: "适合仓库、厨房和车间的一脚蹬安全鞋，避免鞋带松脱带来的危险。松紧侧片无需系带也能贴合。",
    },
    features: [
      feature.steelToe,
      { en: "Elastic side panels", ms: "Panel sisi elastik", zh: "松紧侧片" },
      feature.slipResistant,
      { en: "Pull tab at the heel", ms: "Tali tarik di tumit", zh: "后跟提拉环" },
    ],
    sizes: ukSizes(5, 12),
    uses: ["warehouse", "food", "workshop"],
    sample: true,
  },
  {
    slug: "ladies-low-cut-safety-shoe",
    code: "KD-SS-104",
    category: "safety-shoes",
    pictogram: "shoe",
    name: {
      en: "Ladies' Low-Cut Safety Shoe",
      ms: "Kasut Keselamatan Wanita Potongan Rendah",
      zh: "女款低帮安全鞋",
    },
    summary: {
      en: "A narrower, lighter fit made for women's feet.",
      ms: "Potongan lebih ramping dan ringan, direka untuk kaki wanita.",
      zh: "鞋楦更窄更轻，专为女性脚型设计。",
    },
    description: {
      en: "Many women make do with small men's sizes that never quite fit. This low-cut shoe is cut narrower through the heel and forefoot. Come in and try it on.",
      ms: "Ramai wanita terpaksa memakai saiz lelaki yang kecil dan tidak pernah benar-benar muat. Kasut potongan rendah ini lebih ramping di bahagian tumit dan hadapan kaki. Datang dan cuba di kedai.",
      zh: "很多女性只能将就穿小码男鞋，始终不太合脚。这款低帮鞋的后跟和前掌更窄。欢迎到店试穿。",
    },
    features: [
      { en: "Protective toe cap", ms: "Penutup jari pelindung", zh: "防护鞋头" },
      { en: "Lightweight build", ms: "Binaan ringan", zh: "轻量设计" },
      feature.slipResistant,
      { en: "Narrower women's fit", ms: "Potongan wanita lebih ramping", zh: "女性窄楦" },
    ],
    sizes: ukSizes(3, 8),
    uses: ["factory", "warehouse", "food"],
    sample: true,
  },
  {
    slug: "black-hammer-high-cut-slip-on-boot",
    code: "KD-SB-201",
    brand: "Black Hammer",
    category: "safety-boots",
    pictogram: "boot-high",
    name: {
      en: "Black Hammer High-Cut Slip-On Safety Boot",
      ms: "But Keselamatan Black Hammer Potongan Tinggi Tanpa Tali",
      zh: "Black Hammer 高帮一脚蹬安全靴",
    },
    summary: {
      en: "A tall pull-on boot that protects ankles and shins on rough ground.",
      ms: "But tinggi mudah sarung yang melindungi buku lali dan tulang kering di kawasan lasak.",
      zh: "高筒套穿式安全靴，在崎岖地面保护脚踝和小腿。",
    },
    description: {
      en: "The high shaft keeps out mud, gravel and debris on construction and plantation sites. Pull-on loops make it quick to get on, even with work gloves on.",
      ms: "Batang but yang tinggi menghalang lumpur, batu kelikir dan serpihan di tapak pembinaan dan ladang. Gelung tarik memudahkan pemakaian walaupun memakai sarung tangan kerja.",
      zh: "高筒设计阻挡建筑工地和种植园里的泥土、碎石和杂物。提拉环让你戴着劳保手套也能快速穿上。",
    },
    features: [
      feature.steelToe,
      { en: "High shaft", ms: "Batang tinggi", zh: "高筒设计" },
      { en: "Pull-on loops", ms: "Gelung tarik", zh: "提拉环" },
      feature.slipResistant,
    ],
    sizes: ukSizes(5, 12),
    uses: ["construction", "plantation", "oil-gas"],
    featured: true,
    sample: true,
  },
  {
    slug: "black-hammer-high-cut-lace-up-boot",
    code: "KD-SB-202",
    brand: "Black Hammer",
    category: "safety-boots",
    pictogram: "boot-high",
    name: {
      en: "Black Hammer High-Cut Lace-Up Safety Boot",
      ms: "But Keselamatan Black Hammer Potongan Tinggi Bertali",
      zh: "Black Hammer 高帮系带安全靴",
    },
    summary: {
      en: "A lace-up high-cut boot for a locked-in fit on long shifts.",
      ms: "But potongan tinggi bertali untuk padanan kemas sepanjang syif panjang.",
      zh: "高帮系带安全靴，长时间作业也稳固贴合。",
    },
    description: {
      en: "Laces let you tighten the fit around the ankle for climbing, carrying and long hours on site. Ask us about sizing: boots fit differently from shoes.",
      ms: "Tali membolehkan anda mengetatkan padanan di sekitar buku lali untuk memanjat, mengangkat dan bekerja lama di tapak. Tanya kami tentang saiz kerana padanan but berbeza daripada kasut.",
      zh: "系带可在脚踝处调节松紧，适合攀爬、搬运和长时间工地作业。尺码可以问我们：靴子和鞋子的合脚程度不同。",
    },
    features: [
      feature.steelToe,
      { en: "Lace-up ankle fit", ms: "Ikatan tali di buku lali", zh: "系带锁踝" },
      feature.paddedCollar,
      feature.oilResistant,
    ],
    sizes: ukSizes(5, 12),
    uses: ["construction", "oil-gas", "logistics"],
    sample: true,
  },
  {
    slug: "pvc-safety-gumboot",
    code: "KD-SB-203",
    category: "safety-boots",
    pictogram: "gumboot",
    name: { en: "PVC Safety Gumboot", ms: "But Getah Keselamatan PVC", zh: "PVC 安全雨靴" },
    summary: {
      en: "A waterproof rubber boot with a protective toe for wet work.",
      ms: "But getah kalis air dengan penutup jari pelindung untuk kerja basah.",
      zh: "防水胶靴，带防护鞋头，适合潮湿作业。",
    },
    description: {
      en: "For wet sites, wash-down areas, plantations and food processing. Easy to hose clean at the end of the day.",
      ms: "Untuk tapak basah, kawasan cucian, ladang dan pemprosesan makanan. Mudah dibersihkan dengan air di penghujung hari.",
      zh: "适用于潮湿工地、冲洗区、种植园和食品加工。收工后用水一冲就干净。",
    },
    features: [
      { en: "Waterproof PVC", ms: "PVC kalis air", zh: "防水 PVC" },
      { en: "Protective toe cap", ms: "Penutup jari pelindung", zh: "防护鞋头" },
      { en: "Easy to clean", ms: "Mudah dibersihkan", zh: "易清洗" },
      { en: "Ridged anti-slip sole", ms: "Tapak beralur anti-gelincir", zh: "防滑纹路鞋底" },
    ],
    sizes: ukSizes(4, 12),
    colours: [colour.black, colour.white],
    uses: ["food", "plantation", "construction"],
    featured: true,
    sample: true,
  },
  {
    slug: "safety-helmet-ratchet",
    code: "KD-HD-301",
    category: "helmets",
    pictogram: "helmet",
    name: {
      en: "Safety Helmet with Ratchet Harness",
      ms: "Topi Keselamatan dengan Pelaras Ratchet",
      zh: "旋钮调节安全帽",
    },
    summary: {
      en: "A site hard hat that adjusts with one twist of the ratchet.",
      ms: "Topi keledar tapak yang dilaras dengan satu pusingan ratchet.",
      zh: "一拧旋钮即可调节松紧的工地安全帽。",
    },
    description: {
      en: "Ratchet adjustment means one helmet fits many head sizes, which helps when kitting out a whole crew. Available in standard site colours.",
      ms: "Pelarasan ratchet membolehkan satu topi muat pelbagai saiz kepala, memudahkan apabila melengkapkan seluruh pasukan. Tersedia dalam warna tapak yang biasa.",
      zh: "旋钮调节，一顶帽子适合多种头围，给整个团队配备时更省心。提供常用工地颜色。",
    },
    features: [
      { en: "Ratchet adjustment", ms: "Pelarasan ratchet", zh: "旋钮调节" },
      { en: "Replaceable sweatband", ms: "Pad peluh boleh ganti", zh: "可更换吸汗带" },
      { en: "Accessory slots", ms: "Slot aksesori", zh: "配件插槽" },
    ],
    colours: [colour.white, colour.yellow, colour.orange, colour.blue, colour.red, colour.green],
    uses: ["construction", "factory", "oil-gas"],
    featured: true,
    sample: true,
  },
  {
    slug: "safety-helmet-chin-strap",
    code: "KD-HD-302",
    category: "helmets",
    pictogram: "helmet",
    name: {
      en: "Safety Helmet with Chin Strap",
      ms: "Topi Keselamatan dengan Tali Dagu",
      zh: "带下颚带安全帽",
    },
    summary: {
      en: "Keeps the helmet on when you bend, climb or work at height.",
      ms: "Memastikan topi kekal di kepala ketika membongkok, memanjat atau bekerja di tempat tinggi.",
      zh: "弯腰、攀爬或高空作业时，安全帽不易脱落。",
    },
    description: {
      en: "A chin strap holds the helmet in place on scaffolding, ladders and windy rooftops.",
      ms: "Tali dagu memegang topi di tempatnya semasa bekerja di perancah, tangga dan bumbung berangin.",
      zh: "下颚带让安全帽在脚手架、梯子和大风屋顶上保持稳固。",
    },
    features: [
      { en: "Adjustable chin strap", ms: "Tali dagu boleh laras", zh: "可调下颚带" },
      { en: "Adjustable harness", ms: "Abah-abah boleh laras", zh: "可调帽衬" },
      { en: "Sweatband", ms: "Pad peluh", zh: "吸汗带" },
    ],
    colours: [colour.white, colour.yellow, colour.orange, colour.blue],
    uses: ["construction", "oil-gas", "roadworks"],
    sample: true,
  },
  {
    slug: "cut-resistant-work-gloves",
    code: "KD-HN-401",
    category: "gloves",
    pictogram: "glove",
    name: {
      en: "Cut-Resistant Work Gloves",
      ms: "Sarung Tangan Kerja Tahan Potong",
      zh: "防割劳保手套",
    },
    summary: {
      en: "Coated grip and cut-resistant knit for sheet metal, glass and sharp edges.",
      ms: "Cengkaman bersalut dan kait tahan potong untuk kepingan logam, kaca dan bucu tajam.",
      zh: "涂层防滑，防割针织，适合处理金属板、玻璃和锋利边缘。",
    },
    description: {
      en: "For handling sharp materials. The coated palm grips well while the back of the hand stays breathable.",
      ms: "Untuk mengendalikan bahan tajam. Tapak tangan bersalut memberi cengkaman yang baik manakala bahagian belakang tangan kekal bernafas.",
      zh: "适合搬运锋利材料。掌面涂层抓握力好，手背保持透气。",
    },
    features: [
      { en: "Cut-resistant knit", ms: "Kait tahan potong", zh: "防割针织" },
      { en: "Coated palm for grip", ms: "Tapak tangan bersalut untuk cengkaman", zh: "掌面涂层防滑" },
      { en: "Breathable back", ms: "Bahagian belakang bernafas", zh: "手背透气" },
      { en: "Elastic knit cuff", ms: "Pergelangan kait elastik", zh: "松紧针织袖口" },
    ],
    sizes: apparelSizes(["S", "M", "L", "XL"]),
    uses: ["factory", "workshop", "construction"],
    featured: true,
    sample: true,
  },
  {
    slug: "cotton-knitted-gloves",
    code: "KD-HN-402",
    category: "gloves",
    pictogram: "glove",
    name: { en: "Cotton Knitted Gloves", ms: "Sarung Tangan Kait Kapas", zh: "棉纱针织手套" },
    summary: {
      en: "Everyday cotton gloves, sold by the dozen.",
      ms: "Sarung tangan kapas harian, dijual secara dozen.",
      zh: "日常棉纱手套，按打出售。",
    },
    description: {
      en: "Light general-purpose gloves for packing, loading and light assembly. A popular bulk order.",
      ms: "Sarung tangan serbaguna yang ringan untuk pembungkusan, pemunggahan dan pemasangan ringan. Pilihan popular untuk tempahan pukal.",
      zh: "轻便通用手套，适合包装、装卸和轻型组装。批量采购的热门之选。",
    },
    features: [
      { en: "Soft cotton knit", ms: "Kait kapas lembut", zh: "柔软棉纱" },
      { en: "Elastic cuff", ms: "Pergelangan elastik", zh: "松紧袖口" },
      { en: "Washable", ms: "Boleh dibasuh", zh: "可清洗" },
    ],
    pack: { en: "Sold per dozen pairs", ms: "Dijual per dozen pasang", zh: "按打（12 双）出售" },
    uses: ["warehouse", "logistics", "factory"],
    sample: true,
  },
  {
    slug: "anti-fog-safety-goggles",
    code: "KD-EE-501",
    category: "eye-ear",
    pictogram: "goggles",
    name: { en: "Anti-Fog Safety Goggles", ms: "Gogal Keselamatan Anti-Kabus", zh: "防雾护目镜" },
    summary: {
      en: "Sealed eye protection against dust and splashes, with anti-fog lenses.",
      ms: "Perlindungan mata tertutup daripada habuk dan percikan, dengan kanta anti-kabus.",
      zh: "密封式护目，防尘防溅，镜片防雾。",
    },
    description: {
      en: "Goggles seal around the eyes for grinding, cutting, mixing and dusty work. They fit over most prescription glasses.",
      ms: "Gogal menutup rapat di sekeliling mata untuk kerja mengisar, memotong, mencampur dan berdebu. Muat di atas kebanyakan cermin mata preskripsi.",
      zh: "护目镜紧贴眼周，适合打磨、切割、搅拌和多尘作业。可戴在大多数近视眼镜外。",
    },
    features: [
      { en: "Anti-fog lens", ms: "Kanta anti-kabus", zh: "防雾镜片" },
      { en: "Indirect vents", ms: "Pengudaraan tidak langsung", zh: "间接通风" },
      { en: "Fits over glasses", ms: "Muat di atas cermin mata", zh: "可套戴眼镜" },
      { en: "Adjustable strap", ms: "Tali boleh laras", zh: "可调头带" },
    ],
    uses: ["construction", "workshop", "factory"],
    sample: true,
  },
  {
    slug: "clear-safety-glasses",
    code: "KD-EE-502",
    category: "eye-ear",
    pictogram: "glasses",
    name: { en: "Clear Safety Glasses", ms: "Cermin Mata Keselamatan Jernih", zh: "透明安全眼镜" },
    summary: {
      en: "Light wraparound glasses for all-day eye protection.",
      ms: "Cermin mata balut yang ringan untuk perlindungan mata sepanjang hari.",
      zh: "轻便包覆式眼镜，全天护眼。",
    },
    description: {
      en: "Clear wraparound lenses guard against flying particles without blocking your side vision.",
      ms: "Kanta balut yang jernih melindungi daripada partikel berterbangan tanpa menghalang penglihatan sisi.",
      zh: "透明包覆镜片防飞溅颗粒，不遮挡侧面视野。",
    },
    features: [
      { en: "Wraparound lens", ms: "Kanta balut", zh: "包覆式镜片" },
      { en: "Lightweight frame", ms: "Bingkai ringan", zh: "轻量镜框" },
      { en: "Clear lens for indoor work", ms: "Kanta jernih untuk kerja dalaman", zh: "透明镜片适合室内作业" },
    ],
    uses: ["factory", "workshop", "warehouse"],
    sample: true,
  },
  {
    slug: "safety-earmuffs",
    code: "KD-EE-503",
    category: "eye-ear",
    pictogram: "earmuff",
    name: { en: "Safety Earmuffs", ms: "Penutup Telinga Keselamatan", zh: "防噪音耳罩" },
    summary: {
      en: "Padded earmuffs for noisy machines and sites.",
      ms: "Penutup telinga berpad untuk mesin dan tapak yang bising.",
      zh: "加垫耳罩，适合嘈杂机器和工地。",
    },
    description: {
      en: "For workshops, generators, grinders and anywhere you have to raise your voice to be heard.",
      ms: "Untuk bengkel, janakuasa, mesin pengisar dan di mana-mana sahaja anda perlu meninggikan suara untuk didengari.",
      zh: "适用于车间、发电机、打磨机，以及任何需要大声说话才能被听见的地方。",
    },
    features: [
      { en: "Padded ear cushions", ms: "Kusyen telinga berpad", zh: "加垫耳垫" },
      { en: "Adjustable headband", ms: "Ikat kepala boleh laras", zh: "可调头带" },
      { en: "Folds for storage", ms: "Boleh dilipat untuk simpanan", zh: "可折叠收纳" },
    ],
    uses: ["factory", "workshop", "construction"],
    sample: true,
  },
  {
    slug: "reflective-safety-vest",
    code: "KD-HV-601",
    category: "hi-vis",
    pictogram: "vest",
    name: { en: "Reflective Safety Vest", ms: "Vest Keselamatan Pemantul Cahaya", zh: "反光安全背心" },
    summary: {
      en: "A high-visibility vest with reflective strips, for site and roadside work.",
      ms: "Vest kebolehlihatan tinggi dengan jalur pemantul, untuk kerja di tapak dan tepi jalan.",
      zh: "高可视反光背心，适合工地和路边作业。",
    },
    description: {
      en: "Bright fabric and reflective tape keep you visible to drivers and machine operators, day and night. A common bulk order for crews and events.",
      ms: "Fabrik terang dan pita pemantul memastikan anda kelihatan kepada pemandu dan pengendali mesin, siang dan malam. Tempahan pukal yang biasa untuk pasukan kerja dan acara.",
      zh: "亮色面料加反光条，让司机和机械操作员日夜都能看到你。工作团队和活动常见的批量订单。",
    },
    features: [
      { en: "Reflective strips", ms: "Jalur pemantul", zh: "反光条" },
      { en: "Breathable mesh", ms: "Jaring bernafas", zh: "透气网布" },
      { en: "Front closure", ms: "Penutup hadapan", zh: "前襟开合" },
    ],
    sizes: apparelSizes(["M", "L", "XL", "XXL"]),
    colours: [colour.orange, colour.fluoYellow],
    uses: ["construction", "roadworks", "logistics"],
    featured: true,
    sample: true,
  },
  {
    slug: "cushioned-work-socks",
    code: "KD-SK-701",
    category: "socks",
    pictogram: "sock",
    name: { en: "Cushioned Work Socks", ms: "Stokin Kerja Berkusyen", zh: "加厚缓冲工作袜" },
    summary: {
      en: "Thick-soled cotton socks made for safety shoes.",
      ms: "Stokin kapas bertapak tebal, dibuat untuk kasut keselamatan.",
      zh: "厚底棉袜，专为安全鞋设计。",
    },
    description: {
      en: "A cushioned sole and a reinforced heel and toe take the pressure off long days in safety shoes. Buy them with your shoes and we'll fit the shoes with the socks on.",
      ms: "Tapak berkusyen serta tumit dan jari yang diperkukuh mengurangkan tekanan sepanjang hari berkasut keselamatan. Beli bersama kasut anda dan kami akan padankan kasut dengan stokin dipakai.",
      zh: "缓冲袜底，加固脚跟和脚趾，减轻整天穿安全鞋的压力。和鞋子一起买，我们会让你穿着袜子试鞋。",
    },
    features: [
      { en: "Cushioned sole", ms: "Tapak berkusyen", zh: "缓冲袜底" },
      { en: "Reinforced heel and toe", ms: "Tumit dan jari diperkukuh", zh: "加固脚跟脚趾" },
      { en: "Absorbs sweat", ms: "Menyerap peluh", zh: "吸汗" },
    ],
    pack: { en: "Free size, fits UK 6–10", ms: "Saiz bebas, muat UK 6–10", zh: "均码，适合英码 6–10" },
    uses: ["construction", "factory", "warehouse"],
    featured: true,
    sample: true,
  },
  {
    slug: "ankle-work-socks-3-pack",
    code: "KD-SK-702",
    category: "socks",
    pictogram: "sock",
    name: {
      en: "Ankle Work Socks (Pack of 3)",
      ms: "Stokin Kerja Paras Buku Lali (Pek 3)",
      zh: "短筒工作袜（3 双装）",
    },
    summary: {
      en: "Shorter cotton socks for low-cut safety shoes.",
      ms: "Stokin kapas lebih pendek untuk kasut keselamatan potongan rendah.",
      zh: "短款棉袜，适合低帮安全鞋。",
    },
    description: {
      en: "A lighter sock for low-cut shoes and hot days, sold in packs of three.",
      ms: "Stokin yang lebih ringan untuk kasut potongan rendah dan hari yang panas, dijual dalam pek tiga.",
      zh: "更轻薄的袜子，适合低帮鞋和炎热天气，三双一包。",
    },
    features: [
      { en: "Breathable cotton", ms: "Kapas bernafas", zh: "透气棉" },
      { en: "Cushioned heel", ms: "Tumit berkusyen", zh: "缓冲后跟" },
    ],
    pack: { en: "Pack of 3 pairs, free size", ms: "Pek 3 pasang, saiz bebas", zh: "3 双装，均码" },
    uses: ["factory", "warehouse", "logistics"],
    sample: true,
  },
  {
    slug: "traffic-cone-reflective",
    code: "KD-ST-801",
    category: "site-safety",
    pictogram: "cone",
    name: {
      en: "Traffic Cone with Reflective Collar",
      ms: "Kon Trafik dengan Kolar Pemantul",
      zh: "带反光环交通路锥",
    },
    summary: {
      en: "Marks off work zones, loading bays and car parks.",
      ms: "Menandakan zon kerja, ruang pemunggahan dan tempat letak kereta.",
      zh: "用于划分作业区、装卸区和停车场。",
    },
    description: {
      en: "A weighted base keeps it standing in wind and passing traffic, and the reflective collar shows up in headlights.",
      ms: "Tapak berpemberat memastikan ia kekal berdiri ketika angin dan lalu lintas, dan kolar pemantul jelas kelihatan di bawah lampu kenderaan.",
      zh: "加重底座在风中和车流旁也能稳立，反光环在车灯下清晰可见。",
    },
    features: [
      { en: "Reflective collar", ms: "Kolar pemantul", zh: "反光环" },
      { en: "Weighted base", ms: "Tapak berpemberat", zh: "加重底座" },
      { en: "Stackable", ms: "Boleh disusun", zh: "可叠放" },
    ],
    sizes: { label: { en: "Height", ms: "Ketinggian", zh: "高度" }, values: ["45 cm", "70 cm", "90 cm"] },
    uses: ["roadworks", "construction", "logistics"],
    sample: true,
  },
  {
    slug: "barrier-safety-netting",
    code: "KD-ST-802",
    category: "site-safety",
    pictogram: "net",
    name: { en: "Barrier Safety Netting", ms: "Jaring Penghadang Keselamatan", zh: "安全围栏网" },
    summary: {
      en: "Bright orange netting to fence off excavations and hazards.",
      ms: "Jaring oren terang untuk memagari kawasan galian dan bahaya.",
      zh: "亮橙色围网，用于围挡开挖区和危险区域。",
    },
    description: {
      en: "Lightweight plastic mesh that unrolls fast to mark a boundary people can see from a distance.",
      ms: "Jaring plastik ringan yang cepat dibentangkan untuk menandakan sempadan yang boleh dilihat dari jauh.",
      zh: "轻质塑料网，展开迅速，远处也能看清边界。",
    },
    features: [
      { en: "High-visibility orange", ms: "Oren yang mudah dilihat", zh: "高可视橙色" },
      { en: "Lightweight roll", ms: "Gulungan ringan", zh: "轻便成卷" },
      { en: "Reusable", ms: "Boleh diguna semula", zh: "可重复使用" },
    ],
    pack: { en: "Sold by the roll", ms: "Dijual mengikut gulung", zh: "按卷出售" },
    uses: ["construction", "roadworks"],
    sample: true,
  },
  {
    slug: "warning-tape",
    code: "KD-ST-803",
    category: "site-safety",
    pictogram: "tape",
    name: { en: "Warning Tape", ms: "Pita Amaran", zh: "警示胶带" },
    summary: {
      en: "Striped barricade tape to keep people out of danger zones.",
      ms: "Pita penghadang berjalur untuk menghalang orang memasuki zon bahaya.",
      zh: "条纹隔离警示带，防止人员进入危险区域。",
    },
    description: {
      en: "Tie it between cones, poles or railings to close off a spill, a lift or a work area in seconds.",
      ms: "Ikat di antara kon, tiang atau pagar untuk menutup kawasan tumpahan, lif atau kawasan kerja dalam beberapa saat.",
      zh: "系在路锥、柱子或栏杆之间，几秒钟就能封闭溢漏区、电梯或作业区域。",
    },
    features: [
      { en: "Bold hazard stripes", ms: "Jalur amaran yang jelas", zh: "醒目警示条纹" },
      { en: "Easy to tie off", ms: "Mudah diikat", zh: "易于系扎" },
    ],
    pack: { en: "Sold by the roll", ms: "Dijual mengikut gulung", zh: "按卷出售" },
    uses: ["construction", "factory", "roadworks"],
    sample: true,
  },
  {
    slug: "led-traffic-baton",
    code: "KD-ST-804",
    category: "site-safety",
    pictogram: "baton",
    name: { en: "LED Traffic Baton", ms: "Baton Trafik LED", zh: "LED 交通指挥棒" },
    summary: {
      en: "A light-up baton for directing vehicles at night or in car parks.",
      ms: "Baton bercahaya untuk mengarah kenderaan pada waktu malam atau di tempat letak kereta.",
      zh: "发光指挥棒，用于夜间或停车场指挥车辆。",
    },
    description: {
      en: "For guards, marshals and site traffic control, with steady and flashing modes.",
      ms: "Untuk pengawal, marsyal dan kawalan trafik tapak, dengan mod nyala tetap dan berkelip.",
      zh: "适用于保安、指挥员和工地交通管制，有常亮和闪烁两种模式。",
    },
    features: [
      { en: "Steady and flashing modes", ms: "Mod tetap dan berkelip", zh: "常亮与闪烁模式" },
      { en: "Battery powered", ms: "Berkuasa bateri", zh: "电池供电" },
      { en: "Wrist strap", ms: "Tali pergelangan", zh: "手腕绳" },
    ],
    uses: ["roadworks", "logistics", "construction"],
    sample: true,
  },
];

/** Brands named by the client. Shown as brands stocked, never as "authorised". */
export const brands = ["Black Hammer", "Kickers"];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: CategoryId) {
  return categories.find((c) => c.id === id)!;
}

export function isCategoryId(value: string | null | undefined): value is CategoryId {
  return !!value && categories.some((c) => c.id === value);
}

export function productsInCategory(id: CategoryId) {
  return products.filter((p) => p.category === id);
}

export const featuredProducts = products.filter((p) => p.featured);

export function relatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .concat(products.filter((p) => p.category !== product.category && p.featured))
    .slice(0, limit);
}

/** "UK 5–12", "S–XL", "45 cm · 70 cm · 90 cm": a one-line size summary for tiles. */
export function sizeSummary(product: Product, locale: Locale) {
  if (!product.sizes) return product.pack?.[locale];
  const { values, label } = product.sizes;
  if (values.length > 3) {
    const prefix = label.en.startsWith("UK") ? (locale === "zh" ? "英码 " : "UK ") : "";
    return `${prefix}${values[0]}–${values[values.length - 1]}`;
  }
  return values.join(" · ");
}
