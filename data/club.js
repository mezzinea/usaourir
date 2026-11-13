/*
 * US AOURIR — all editable content lives here.
 * Translatable text is written as { fr: "...", ar: "...", en: "..." }.
 * An empty translation falls back to French.
 *
 * ⚠️ Matches, results, teams and products below are SAMPLE DATA.
 *    Replace them with the club's real information before going live.
 */
window.USA_DATA = {
  settings: {
    clubName: "Union Sport Aourir",
    shortName: "US Aourir",
    email: "usaourir@gmail.com",
    instagram: "https://www.instagram.com/usaourir/",
    facebook: "https://web.facebook.com/usaourir",
    // WhatsApp number in international format, digits only, e.g. "2126XXXXXXXX".
    // Leave empty to receive shop orders by e-mail only.
    whatsapp: "212669112013", // 0669112013
    currency: "MAD",
    // Optional delivery fee (MAD) added when the customer picks home delivery. 0 = "to be confirmed".
    deliveryFee: 0,
    // Extra price (MAD) for printing a name + number on a jersey.
    printingFee: 50
  },

  // Kit colours, used by the live name + number preview in the shop.
  kits: {
    // The 2026/27 jersey: white with a green + gold diagonal stripe, dark green lettering.
    white: { name: { fr: "Maillot blanc", ar: "القميص الأبيض", en: "White jersey" }, body: "#F6F6F1", trim: "#0E773F", text: "#0F4D2C", stripe: ["#0E773F", "#E1C257"] },
    // Green jersey: dark green body, gold collar and cuffs, white lettering.
    green: { name: { fr: "Maillot vert", ar: "القميص الأخضر", en: "Green jersey" }, body: "#0F6234", trim: "#E1C257", text: "#FFFFFF" }
  },

  // Indicative size guide (cm). Check against the real supplier's chart.
  sizeGuide: {
    adult: [["S", 50, 70], ["M", 53, 72], ["L", 56, 74], ["XL", 59, 76], ["XXL", 62, 78]],
    // Add a `kids` table ([size, height, chest, length]) if kids sizes are sold.
    kids: []
  },

  // Shop FAQ (boutique.html).
  faq: [
    { q: { fr: "Comment commander ?", ar: "كيف أطلب؟", en: "How do I order?" },
      a: { fr: "Ajoutez vos articles au panier, indiquez votre nom et votre téléphone, puis envoyez la commande sur WhatsApp. Le club vous répond pour confirmer.", ar: "أضف منتجاتك إلى السلة، أدخل اسمك ورقم هاتفك، ثم أرسل الطلب عبر واتساب. سيرد عليك النادي للتأكيد.", en: "Add items to your cart, enter your name and phone, then send the order on WhatsApp. The club replies to confirm." } },
    { q: { fr: "Comment payer ?", ar: "كيف أدفع؟", en: "How do I pay?" },
      a: { fr: "Aucun paiement en ligne : vous payez à la livraison ou au moment du retrait au club.", ar: "لا يوجد دفع عبر الإنترنت: تدفع عند التسليم أو عند الاستلام من النادي.", en: "No online payment: you pay on delivery or when collecting at the club." } },
    { q: { fr: "Livraison ou retrait ?", ar: "التوصيل أم الاستلام؟", en: "Delivery or collection?" },
      a: { fr: "Le retrait au club à Aourir est gratuit. Pour une livraison à domicile, les frais sont confirmés avec vous sur WhatsApp.", ar: "الاستلام من النادي في أورير مجاني. بالنسبة للتوصيل إلى المنزل، يتم تأكيد التكلفة معك عبر واتساب.", en: "Collection at the club in Aourir is free. For home delivery, the fee is confirmed with you on WhatsApp." } },
    { q: { fr: "Le flocage, comment ça marche ?", ar: "كيف يتم الطبع؟", en: "How does printing work?" },
      a: { fr: "Sur les maillots, ajoutez un nom (12 lettres max) et un numéro. Le flocage est facturé en plus du maillot et le délai vous est confirmé à la commande.", ar: "على الأقمصة، أضف اسماً (12 حرفاً كحد أقصى) ورقماً. يُضاف ثمن الطبع إلى ثمن القميص ويتم تأكيد المدة عند الطلب.", en: "On jerseys, add a name (max 12 letters) and a number. Printing is charged on top of the jersey and the lead time is confirmed when you order." } },
    { q: { fr: "Et si la taille ne va pas ?", ar: "وإذا لم يناسبني المقاس؟", en: "What if the size is wrong?" },
      a: { fr: "Consultez le guide des tailles avant de commander. En cas de souci, contactez-nous sur WhatsApp pour voir les possibilités d’échange (hors maillots floqués).", ar: "اطلع على دليل المقاسات قبل الطلب. في حال وجود مشكلة، تواصل معنا عبر واتساب لمعرفة إمكانيات الاستبدال (باستثناء الأقمصة المطبوعة).", en: "Check the size guide before ordering. If there’s a problem, contact us on WhatsApp to see exchange options (printed jerseys excluded)." } }
  ],

  // Key figures shown on the homepage. Edit or remove freely.
  stats: [
    { value: "6", label: { fr: "Catégories jeunes", ar: "فئات الشباب", en: "Youth age groups" } },
    { value: "100+", label: { fr: "Licenciés", ar: "منخرط", en: "Registered players" } },
    { value: "2015", label: { fr: "Année de création", ar: "سنة التأسيس", en: "Founded" } }
  ],

  // Matches: NOT SHOWN on the site for now (the matches section was removed). Kept for later.
  // Date in "YYYY-MM-DDTHH:MM" (local time). Add a score once played: score: [2, 1] (home, away).
  matches: [
    { date: "2026-11-22T15:00", home: true, opponent: "Adversaire à confirmer", competition: { fr: "Championnat régional", ar: "البطولة الجهوية", en: "Regional league" }, venue: { fr: "Terrain municipal d’Aourir", ar: "الملعب البلدي أورير", en: "Aourir municipal ground" } },
    { date: "2026-11-29T15:00", home: false, opponent: "Adversaire à confirmer", competition: { fr: "Championnat régional", ar: "البطولة الجهوية", en: "Regional league" }, venue: { fr: "À l’extérieur", ar: "خارج الميدان", en: "Away" } },
    { date: "2026-12-06T15:00", home: true, opponent: "Adversaire à confirmer", competition: { fr: "Coupe", ar: "الكأس", en: "Cup" }, venue: { fr: "Terrain municipal d’Aourir", ar: "الملعب البلدي أورير", en: "Aourir municipal ground" } },
    { date: "2026-11-08T15:00", home: true, opponent: "Adversaire (exemple)", score: [2, 1], competition: { fr: "Championnat régional", ar: "البطولة الجهوية", en: "Regional league" }, venue: { fr: "Terrain municipal d’Aourir", ar: "الملعب البلدي أورير", en: "Aourir municipal ground" } },
    { date: "2026-11-01T15:00", home: false, opponent: "Adversaire (exemple)", score: [0, 0], competition: { fr: "Championnat régional", ar: "البطولة الجهوية", en: "Regional league" }, venue: { fr: "À l’extérieur", ar: "خارج الميدان", en: "Away" } }
  ],

  // Homepage hero slider. image: a photo slug from img/photos/ (<slug>-lg.webp / -md.webp).
  // product: optional shop image shown as an inset on the slide.
  heroSlides: [
    { image: "u18", tag: { fr: "Le club", ar: "النادي", en: "The club" },
      title: { fr: "Vert et or, une seule passion.", ar: "الأخضر والذهبي، شغف واحد.", en: "Green and gold, one passion." },
      text: { fr: "L’Union Sport Aourir rassemble joueurs, familles et supporters autour du football et des valeurs de notre ville.", ar: "يجمع الاتحاد الرياضي أورير اللاعبين والعائلات والمشجعين حول كرة القدم وقيم مدينتنا.", en: "Union Sport Aourir brings players, families and supporters together around football and the values of our town." },
      cta: { label: { fr: "Découvrir le club", ar: "اكتشف النادي", en: "Discover the club" }, href: "#club" } },
    { image: "ceremonie-1", tag: { fr: "Cérémonie", ar: "حفل", en: "Ceremony" },
      title: { fr: "Nos jeunes champions à l’honneur", ar: "أبطالنا الصغار في الواجهة", en: "Our young champions in the spotlight" },
      text: { fr: "Médailles, trophées et diplômes : retour en images sur nos cérémonies.", ar: "ميداليات وكؤوس وشهادات: عودة بالصور إلى حفلاتنا.", en: "Medals, trophies and certificates: our ceremonies in pictures." },
      cta: { label: { fr: "Voir la galerie", ar: "شاهد الصور", en: "View the gallery" }, href: "#galerie" } },
    { image: "match", product: "img/shop/maillot-1.webp", tag: { fr: "Boutique officielle", ar: "المتجر الرسمي", en: "Official shop" },
      title: { fr: "Les nouveaux maillots 2026/27 sont arrivés", ar: "أقمصة 2026/27 الجديدة وصلت", en: "The new 2026/27 jerseys are here" },
      text: { fr: "Floqué à votre nom. Chaque achat soutient l’école de foot.", ar: "مطبوع باسمك. كل عملية شراء تدعم مدرسة كرة القدم.", en: "Printed with your name. Every purchase supports the football school." },
      cta: { label: { fr: "Voir les maillots", ar: "شاهد الأقمصة", en: "See the jerseys" }, href: "boutique.html?cat=match#catalogue" } },
    { image: "ecole-de-foot", tag: { fr: "Inscriptions", ar: "التسجيل", en: "Registration" },
      title: { fr: "Rejoignez l’école de foot", ar: "انضم إلى مدرسة كرة القدم", en: "Join the football school" },
      text: { fr: "Des U11 aux U18, entraînements encadrés par notre staff technique.", ar: "من أقل من 11 سنة إلى أقل من 18 سنة، تداريب بإشراف طاقمنا التقني.", en: "From U11 to U18, training led by our technical staff." },
      cta: { label: { fr: "Inscrire un joueur", ar: "تسجيل لاعب", en: "Register a player" }, href: "join" } }
  ],

  // Team cards (image = photo slug). Order = display order.
  teams: [
    { name: { fr: "U11", ar: "أقل من 11 سنة", en: "U11" }, image: "u11" },
    { name: { fr: "U12", ar: "أقل من 12 سنة", en: "U12" }, image: "u12" },
    { name: { fr: "U13", ar: "أقل من 13 سنة", en: "U13" }, image: "u13" },
    { name: { fr: "U14", ar: "أقل من 14 سنة", en: "U14" }, image: "u14" },
    { name: { fr: "Minimes", ar: "الصغار", en: "Minimes" }, image: "minime" },
    { name: { fr: "U18", ar: "أقل من 18 سنة", en: "U18" }, image: "u18" }
  ],

  // Photo gallery ("Plus qu’un club"). Captions come from the photo names; edit freely.
  gallery: [
    { image: "ceremonie-cloture", caption: { fr: "Cérémonie de clôture", ar: "حفل الاختتام", en: "Closing ceremony" } },
    { image: "ceremonie-1", caption: { fr: "Remise des médailles", ar: "توزيع الميداليات", en: "Medal ceremony" } },
    { image: "futur-maroc", caption: { fr: "L’avenir du Maroc", ar: "مستقبل المغرب", en: "Morocco’s future" } },
    { image: "beach", caption: { fr: "Le volley-ball de plage", ar: "الكرة الطائرة الشاطئية", en: "Beach volleyball" } },
    { image: "formation", caption: { fr: "Formation", ar: "التكوين", en: "Training course" } },
    { image: "futur", caption: { fr: "La relève", ar: "الخلف", en: "The next generation" } },
    { image: "entrainement-1", caption: { fr: "Entraînement", ar: "تدريب", en: "Training" } },
    { image: "medailles", caption: { fr: "Médailles et trophées", ar: "ميداليات وكؤوس", en: "Medals and trophies" } },
    { image: "ceremonie-2", caption: { fr: "Remise des récompenses", ar: "توزيع الجوائز", en: "Awards" } },
    { image: "match", caption: { fr: "Match", ar: "مباراة", en: "Match" } },
    { image: "staff", caption: { fr: "Staff technique", ar: "الطاقم التقني", en: "Technical staff" } },
    { image: "entrainement-4", caption: { fr: "Causerie d’avant-séance", ar: "حديث ما قبل الحصة", en: "Pre-session talk" } },
    { image: "ceremonie-3", caption: { fr: "Le trophée", ar: "الكأس", en: "The trophy" } },
    { image: "fin-entrainement", caption: { fr: "Fin de séance", ar: "نهاية الحصة", en: "End of session" } },
    { image: "rassemblement", caption: { fr: "Rassemblement", ar: "تجمّع", en: "Gathering" } },
    { image: "entrainement-2", caption: { fr: "Entraînement", ar: "تدريب", en: "Training" } },
    { image: "equipe-1", caption: { fr: "Nos jeunes", ar: "شبابنا", en: "Our youngsters" } },
    { image: "entrainement-3", caption: { fr: "Entraînement", ar: "تدريب", en: "Training" } },
    { image: "equipe-2", caption: { fr: "Nos jeunes", ar: "شبابنا", en: "Our youngsters" } },
    { image: "entrainement-5", caption: { fr: "Entraînement", ar: "تدريب", en: "Training" } },
    { image: "ecole-de-foot", caption: { fr: "Toute l’école de foot", ar: "مدرسة كرة القدم بأكملها", en: "The whole football school" } },
    { image: "entrainement-6", caption: { fr: "Entraînement", ar: "تدريب", en: "Training" } }
  ],

  categories: [
    { id: "match", image: "img/shop/maillot-1.webp", name: { fr: "Tenue de match", ar: "زي المباراة", en: "Match kit" } },
    { id: "training", image: "img/shop/sweat-2.webp", name: { fr: "Entraînement", ar: "التداريب", en: "Training" } },
    { id: "supporters", image: "img/shop/drapeau-1.webp", name: { fr: "Supporters", ar: "المشجعون", en: "Supporters" } },
    { id: "accessoires", image: "img/shop/sac-1.webp", name: { fr: "Accessoires", ar: "إكسسوارات", en: "Accessories" } }
  ],

  /*
   * Products. Prices (MAD) are PLACEHOLDERS — set the real ones.
   * images: first one is the card picture; the others show in the product gallery.
   * sizes: [] = one size. optionLabel: rename the "Size" choice (e.g. colour for the mug).
   * badge: "new" | "best" | "". swatch: colour dot shown in the shop hero quick links.
   * customizable + kit: name + number printing with live preview (kit from `kits` above).
   */
  products: [
    { id: "maillot", category: "match", price: 125, badge: "new", swatch: "#F6F6F1", customizable: true, kit: "white",
      images: ["img/shop/maillot-1.webp", "img/shop/maillot-2.webp", "img/shop/maillot-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Maillot blanc 2026/27", ar: "القميص الأبيض 2026/27", en: "White jersey 2026/27" },
      desc: { fr: "Le maillot blanc de l’Ittihad Aourir, bande diagonale vert et or, écusson du club sur le cœur. Flocage nom + numéro possible.", ar: "القميص الأبيض لاتحاد أورير، بشريط مائل أخضر وذهبي وشعار النادي على القلب. إمكانية طبع الاسم والرقم.", en: "Ittihad Aourir’s white jersey, green and gold diagonal stripe, club crest over the heart. Name + number printing available." } },
    { id: "maillot-vert", category: "match", price: 125, badge: "new", swatch: "#0F6234", customizable: true, kit: "green",
      images: ["img/shop/maillot-vert-1.webp", "img/shop/maillot-vert-2.webp", "img/shop/maillot-vert-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Maillot vert 2026/27", ar: "القميص الأخضر 2026/27", en: "Green jersey 2026/27" },
      desc: { fr: "Le maillot vert de l’Ittihad Aourir, col et poignets dorés, « ITTIHAD AOURIR » sur la poitrine et écusson du club. Flocage nom + numéro possible.", ar: "القميص الأخضر لاتحاد أورير، بياقة وأطراف أكمام ذهبية، عبارة «اتحاد أورير» على الصدر وشعار النادي. إمكانية طبع الاسم والرقم.", en: "Ittihad Aourir’s green jersey, gold collar and cuffs, “ITTIHAD AOURIR” across the chest and the club crest. Name + number printing available." } },
    { id: "short-blanc", category: "match", price: 60, badge: "", swatch: "#FFFFFF",
      images: ["img/shop/short-blanc-1.webp", "img/shop/short-blanc-2.webp", "img/shop/short-blanc-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Short blanc", ar: "شورت أبيض", en: "White shorts" },
      desc: { fr: "Short de match blanc avec empiècements verts, taille élastique et cordon, écusson brodé.", ar: "شورت مباراة أبيض بلمسات خضراء، خصر مطاطي مع حبل، وشعار مطرّز.", en: "White match shorts with green panels, elastic drawstring waist, embroidered crest." } },
    { id: "short-vert", category: "match", price: 60, badge: "", swatch: "#0E773F",
      images: ["img/shop/short-vert-1.webp", "img/shop/short-vert-2.webp", "img/shop/short-vert-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Short vert", ar: "شورت أخضر", en: "Green shorts" },
      desc: { fr: "Short de match vert du club, taille élastique et cordon, écusson brodé.", ar: "شورت المباراة الأخضر للنادي، خصر مطاطي مع حبل، وشعار مطرّز.", en: "The club’s green match shorts, elastic drawstring waist, embroidered crest." } },
    { id: "short-noir", category: "match", price: 60, badge: "", swatch: "#0D1B0C",
      images: ["img/shop/short-noir-1.webp", "img/shop/short-noir-2.webp", "img/shop/short-noir-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Short noir", ar: "شورت أسود", en: "Black shorts" },
      desc: { fr: "Short noir aux empiècements vert clair, taille élastique et cordon, écusson brodé.", ar: "شورت أسود بلمسات خضراء فاتحة، خصر مطاطي مع حبل، وشعار مطرّز.", en: "Black shorts with light green panels, elastic drawstring waist, embroidered crest." } },
    { id: "veste", category: "training", price: 150, badge: "best",
      images: ["img/shop/veste-1.webp", "img/shop/veste-2.webp", "img/shop/veste-3.webp", "img/shop/veste-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Veste d’entraînement zippée", ar: "سترة تدريب بسحاب", en: "Zip training jacket" },
      desc: { fr: "Veste verte à col montant et zip intégral, liserés dorés sur les manches, écusson brodé.", ar: "سترة خضراء بياقة مرتفعة وسحاب كامل، خطوط ذهبية على الأكمام، وشعار مطرّز.", en: "Green full-zip jacket with stand-up collar, gold piping on the sleeves, embroidered crest." } },
    { id: "sweat", category: "training", price: 175, badge: "best",
      images: ["img/shop/sweat-1.webp", "img/shop/sweat-2.webp", "img/shop/sweat-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Sweat zippé à capuche", ar: "سترة بقبعة وسحاب", en: "Zip hoodie" },
      desc: { fr: "Sweat vert zippé à capuche, « ITTIHAD AOURIR » dans le dos, poches zippées.", ar: "سترة خضراء بقبعة وسحاب، عبارة «اتحاد أورير» على الظهر، وجيوب بسحاب.", en: "Green zip hoodie with “ITTIHAD AOURIR” on the back and zipped pockets." } },
    { id: "pantalon", category: "training", price: 110, badge: "",
      images: ["img/shop/pantalon-1.webp", "img/shop/pantalon-2.webp", "img/shop/pantalon-full.webp"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      name: { fr: "Pantalon d’entraînement", ar: "سروال التدريب", en: "Training pants" },
      desc: { fr: "Pantalon noir ajusté, bas resserrés, poches zippées et écusson du club.", ar: "سروال أسود مضبوط، أطراف مشدودة، جيوب بسحاب وشعار النادي.", en: "Slim black pants with cuffed ankles, zipped pockets and the club crest." } },
    { id: "echarpe", category: "supporters", price: 45, badge: "best",
      images: ["img/shop/echarpe-1.webp"], sizes: [],
      name: { fr: "Écharpe Ittihad Aourir", ar: "وشاح اتحاد أورير", en: "Ittihad Aourir scarf" },
      desc: { fr: "L’écharpe verte des supporters, écussons aux deux extrémités et franges dorées.", ar: "وشاح المشجعين الأخضر، بشعار في الطرفين وأهداب ذهبية.", en: "The supporters’ green scarf, crest at both ends and gold fringes." } },
    { id: "drapeau", category: "supporters", price: 60, badge: "",
      images: ["img/shop/drapeau-1.webp"], sizes: [],
      name: { fr: "Drapeau du club", ar: "علم النادي", en: "Club flag" },
      desc: { fr: "Drapeau vert à bandes blanches avec l’écusson et « US AOURIR ».", ar: "علم أخضر بخطوط بيضاء مع الشعار وعبارة «US AOURIR».", en: "Green flag with white stripes, the crest and “US AOURIR”." } },
    { id: "sac", category: "accessoires", price: 140, badge: "new",
      images: ["img/shop/sac-1.webp"], sizes: [],
      name: { fr: "Sac de sport", ar: "حقيبة رياضية", en: "Sports bag" },
      desc: { fr: "Grand sac vert et noir avec bandoulière, liserés dorés et écusson du club.", ar: "حقيبة كبيرة خضراء وسوداء بحزام كتف، خطوط ذهبية وشعار النادي.", en: "Large green and black holdall with shoulder strap, gold trims and the club crest." } },
    { id: "casquette", category: "accessoires", price: 50, badge: "",
      images: ["img/shop/casquette-1.webp", "img/shop/casquette-2.webp", "img/shop/casquette-full.webp"], sizes: [],
      name: { fr: "Casquette brodée", ar: "قبعة مطرّزة", en: "Embroidered cap" },
      desc: { fr: "Casquette verte à visière liserée d’or, écusson brodé devant et « US AOURIR » au dos, réglable.", ar: "قبعة خضراء بحافة ذهبية، شعار مطرّز في الأمام و«US AOURIR» في الخلف، قابلة للتعديل.", en: "Green cap with gold-piped peak, embroidered crest on the front and “US AOURIR” on the back, adjustable." } },
    { id: "mug", category: "accessoires", price: 35, badge: "",
      images: ["img/shop/mug-1.webp", "img/shop/mug-2.webp", "img/shop/mug-full.webp"],
      sizes: [{ fr: "Vert", ar: "أخضر", en: "Green" }, { fr: "Blanc", ar: "أبيض", en: "White" }], optionLabel: { fr: "Couleur", ar: "اللون", en: "Colour" },
      name: { fr: "Mug US Aourir", ar: "كوب US Aourir", en: "US Aourir mug" },
      desc: { fr: "Mug en céramique, en version verte avec l’écusson ou blanche avec le logo US Aourir.", ar: "كوب خزفي، بنسخة خضراء مع الشعار أو بيضاء مع شعار US Aourir.", en: "Ceramic mug, green with the crest or white with the US Aourir logo." } }
  ]
};
