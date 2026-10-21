// Helper script to add multilingual descriptions to holidays.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current holidays.json
const holidaysPath = path.join(__dirname, '../src/data/holidays.json');
const data = JSON.parse(fs.readFileSync(holidaysPath, 'utf8'));

// Multilingual descriptions for each country
const descriptions = {
    GH: {
        en: "Ghana observes several public holidays each year that affect work schedules, school calendars, travel plans, and government services. These holidays reflect the country's history, religious diversity, and the importance of labour and agriculture to national life.",
        es: "Ghana observa varios días festivos cada año que afectan los horarios de trabajo, calendarios escolares, planes de viaje y servicios gubernamentales. Estos días festivos reflejan la historia del país, la diversidad religiosa y la importancia del trabajo y la agricultura en la vida nacional.",
        fr: "Le Ghana observe plusieurs jours fériés chaque année qui affectent les horaires de travail, les calendriers scolaires, les plans de voyage et les services gouvernementaux. Ces jours fériés reflètent l'histoire du pays, la diversité religieuse et l'importance du travail et de l'agriculture dans la vie nationale.",
        de: "Ghana beobachtet mehrere Feiertage pro Jahr, die Arbeitszeiten, Schulkalender, Reisepläne und Regierungsdienste beeinflussen. Diese Feiertage spiegeln die Geschichte des Landes, die religiöse Vielfalt und die Bedeutung von Arbeit und Landwirtschaft für das nationale Leben wider.",
        pt: "Gana observa vários feriados públicos a cada ano que afetam horários de trabalho, calendários escolares, planos de viagem e serviços governamentais. Esses feriados refletem a história do país, a diversidade religiosa e a importância do trabalho e da agricultura na vida nacional.",
        zh: "加纳每年都会庆祝几个公共假日，这些假日会影响工作时间表、学校日历、旅行计划和政府服务。这些假日反映了该国的历史、宗教多样性以及劳动和农业对国家生活的重要性。",
        ar: "تحتفل غانا بعدة أيام عطلة رسمية كل عام تؤثر على جداول العمل والتقويمات المدرسية وخطط السفر والخدمات الحكومية. تعكس هذه العطلات تاريخ البلاد والتنوع الديني وأهمية العمل والزراعة في الحياة الوطنية.",
        ja: "ガーナは毎年いくつかの祝日を定めており、これらは勤務スケジュール、学校カレンダー、旅行計画、政府サービスに影響を与えます。これらの祝日は、国の歴史、宗教的多様性、そして国民生活における労働と農業の重要性を反映しています。"
    },
    NG: {
        en: "Nigeria observes a range of national and religious public holidays that reflect its political history, cultural diversity, and multi-faith society. These holidays influence government services, business operations, school calendars, and travel plans across the country.",
        es: "Nigeria observa una variedad de días festivos nacionales y religiosos que reflejan su historia política, diversidad cultural y sociedad multirreligiosa. Estos días festivos influyen en los servicios gubernamentales, operaciones comerciales, calendarios escolares y planes de viaje en todo el país.",
        fr: "Le Nigeria observe une gamme de jours fériés nationaux et religieux qui reflètent son histoire politique, sa diversité culturelle et sa société multireligieuse. Ces jours fériés influencent les services gouvernementaux, les opérations commerciales, les calendriers scolaires et les plans de voyage à travers le pays.",
        de: "Nigeria beobachtet eine Reihe nationaler und religiöser Feiertage, die seine politische Geschichte, kulturelle Vielfalt und multireligiöse Gesellschaft widerspiegeln. Diese Feiertage beeinflussen Regierungsdienste, Geschäftsabläufe, Schulkalender und Reisepläne im ganzen Land.",
        pt: "A Nigéria observa uma variedade de feriados nacionais e religiosos que refletem sua história política, diversidade cultural e sociedade multireligiosa. Esses feriados influenciam serviços governamentais, operações comerciais, calendários escolares e planos de viagem em todo o país.",
        zh: "尼日利亚庆祝一系列国家和宗教公共假日，反映其政治历史、文化多样性和多信仰社会。这些假日影响全国的政府服务、商业运营、学校日历和旅行计划。",
        ar: "تحتفل نيجيريا بمجموعة من الأعياد الوطنية والدينية التي تعكس تاريخها السياسي وتنوعها الثقافي ومجتمعها متعدد الأديان. تؤثر هذه العطلات على الخدمات الحكومية والعمليات التجارية والتقويمات المدرسية وخطط السفر في جميع أنحاء البلاد.",
        ja: "ナイジェリアは、その政治史、文化的多様性、多宗教社会を反映する一連の国民的および宗教的祝日を定めています。これらの祝日は、全国の政府サービス、ビジネス運営、学校カレンダー、旅行計画に影響を与えます。"
    },
    US: {
        en: "The United States observes several federal public holidays each year that reflect the nation's history, democratic values, military service, and cultural traditions. These holidays affect government operations, school schedules, banking services, and many workplaces across the country.",
        es: "Estados Unidos observa varios días festivos federales cada año que reflejan la historia de la nación, los valores democráticos, el servicio militar y las tradiciones culturales. Estos días festivos afectan las operaciones gubernamentales, los horarios escolares, los servicios bancarios y muchos lugares de trabajo en todo el país.",
        fr: "Les États-Unis observent plusieurs jours fériés fédéraux chaque année qui reflètent l'histoire de la nation, les valeurs démocratiques, le service militaire et les traditions culturelles. Ces jours fériés affectent les opérations gouvernementales, les horaires scolaires, les services bancaires et de nombreux lieux de travail à travers le pays.",
        de: "Die Vereinigten Staaten beobachten mehrere bundesweite Feiertage pro Jahr, die die Geschichte der Nation, demokratische Werte, Militärdienst und kulturelle Traditionen widerspiegeln. Diese Feiertage beeinflussen Regierungsoperationen, Schulpläne, Bankdienstleistungen und viele Arbeitsplätze im ganzen Land.",
        pt: "Os Estados Unidos observam vários feriados federais a cada ano que refletem a história da nação, valores democráticos, serviço militar e tradições culturais. Esses feriados afetam operações governamentais, horários escolares, serviços bancários e muitos locais de trabalho em todo o país.",
        zh: "美国每年庆祝几个联邦公共假日，反映国家的历史、民主价值观、军事服务和文化传统。这些假日影响全国的政府运营、学校时间表、银行服务和许多工作场所。",
        ar: "تحتفل الولايات المتحدة بعدة أيام عطلة فيدرالية كل عام تعكس تاريخ الأمة والقيم الديمقراطية والخدمة العسكرية والتقاليد الثقافية. تؤثر هذه العطلات على العمليات الحكومية والجداول المدرسية والخدمات المصرفية والعديد من أماكن العمل في جميع أنحاء البلاد.",
        ja: "米国は毎年いくつかの連邦祝日を定めており、これらは国の歴史、民主的価値観、軍事奉仕、文化的伝統を反映しています。これらの祝日は、全国の政府運営、学校スケジュール、銀行サービス、多くの職場に影響を与えます。"
    },
    GB: {
        en: "The United Kingdom observes a mix of bank holidays and public holidays that shape everyday life across England, Wales, Scotland, and Northern Ireland. These holidays affect work schedules, school terms, travel plans, and the availability of public services. While many holidays are shared nationwide, some are observed differently depending on the region.",
        es: "El Reino Unido observa una combinación de días festivos bancarios y públicos que dan forma a la vida cotidiana en Inglaterra, Gales, Escocia e Irlanda del Norte. Estos días festivos afectan los horarios de trabajo, los períodos escolares, los planes de viaje y la disponibilidad de servicios públicos. Si bien muchos días festivos se comparten a nivel nacional, algunos se observan de manera diferente según la región.",
        fr: "Le Royaume-Uni observe un mélange de jours fériés bancaires et publics qui façonnent la vie quotidienne en Angleterre, au Pays de Galles, en Écosse et en Irlande du Nord. Ces jours fériés affectent les horaires de travail, les périodes scolaires, les plans de voyage et la disponibilité des services publics. Bien que de nombreux jours fériés soient partagés à l'échelle nationale, certains sont observés différemment selon la région.",
        de: "Das Vereinigte Königreich beobachtet eine Mischung aus Bankfeiertagen und öffentlichen Feiertagen, die das tägliche Leben in England, Wales, Schottland und Nordirland prägen. Diese Feiertage beeinflussen Arbeitszeiten, Schulzeiten, Reisepläne und die Verfügbarkeit öffentlicher Dienstleistungen. Während viele Feiertage landesweit geteilt werden, werden einige je nach Region unterschiedlich beobachtet.",
        pt: "O Reino Unido observa uma mistura de feriados bancários e públicos que moldam a vida cotidiana na Inglaterra, País de Gales, Escócia e Irlanda do Norte. Esses feriados afetam horários de trabalho, períodos escolares, planos de viagem e a disponibilidade de serviços públicos. Embora muitos feriados sejam compartilhados nacionalmente, alguns são observados de forma diferente dependendo da região.",
        zh: "英国庆祝银行假日和公共假日的混合，这些假日塑造了英格兰、威尔士、苏格兰和北爱尔兰的日常生活。这些假日影响工作时间表、学期、旅行计划和公共服务的可用性。虽然许多假日在全国范围内共享，但有些假日根据地区的不同而有所不同。",
        ar: "تحتفل المملكة المتحدة بمزيج من العطلات المصرفية والعطلات العامة التي تشكل الحياة اليومية في إنجلترا وويلز واسكتلندا وأيرلندا الشمالية. تؤثر هذه العطلات على جداول العمل والفصول الدراسية وخطط السفر وتوافر الخدمات العامة. في حين يتم مشاركة العديد من العطلات على الصعيد الوطني، يتم الاحتفال ببعضها بشكل مختلف حسب المنطقة.",
        ja: "英国は、イングランド、ウェールズ、スコットランド、北アイルランド全体の日常生活を形作る銀行休日と祝日の組み合わせを定めています。これらの祝日は、勤務スケジュール、学期、旅行計画、公共サービスの利用可能性に影響を与えます。多くの祝日は全国的に共有されていますが、一部は地域によって異なる方法で観察されます。"
    },
    CA: {
        en: "Canada observes several statutory public holidays each year that reflect its national history, bilingual identity, multicultural values, and respect for workers and veterans. These holidays influence government services, school calendars, banking operations, and workplace schedules across the country.",
        es: "Canadá observa varios días festivos estatutarios cada año que reflejan su historia nacional, identidad bilingüe, valores multiculturales y respeto por los trabajadores y veteranos. Estos días festivos influyen en los servicios gubernamentales, calendarios escolares, operaciones bancarias y horarios laborales en todo el país.",
        fr: "Le Canada observe plusieurs jours fériés légaux chaque année qui reflètent son histoire nationale, son identité bilingue, ses valeurs multiculturelles et son respect pour les travailleurs et les anciens combattants. Ces jours fériés influencent les services gouvernementaux, les calendriers scolaires, les opérations bancaires et les horaires de travail à travers le pays.",
        de: "Kanada beobachtet mehrere gesetzliche Feiertage pro Jahr, die seine nationale Geschichte, zweisprachige Identität, multikulturelle Werte und Respekt für Arbeiter und Veteranen widerspiegeln. Diese Feiertage beeinflussen Regierungsdienste, Schulkalender, Bankgeschäfte und Arbeitszeiten im ganzen Land.",
        pt: "O Canadá observa vários feriados públicos estatutários a cada ano que refletem sua história nacional, identidade bilíngue, valores multiculturais e respeito por trabalhadores e veteranos. Esses feriados influenciam serviços governamentais, calendários escolares, operações bancárias e horários de trabalho em todo o país.",
        zh: "加拿大每年庆祝几个法定公共假日，反映其国家历史、双语身份、多元文化价值观以及对工人和退伍军人的尊重。这些假日影响全国的政府服务、学校日历、银行业务和工作时间表。",
        ar: "تحتفل كندا بعدة أيام عطلة رسمية قانونية كل عام تعكس تاريخها الوطني وهويتها ثنائية اللغة وقيمها متعددة الثقافات واحترامها للعمال والمحاربين القدامى. تؤثر هذه العطلات على الخدمات الحكومية والتقويمات المدرسية والعمليات المصرفية وجداول العمل في جميع أنحاء البلاد.",
        ja: "カナダは毎年いくつかの法定祝日を定めており、これらは国の歴史、二言語アイデンティティ、多文化的価値観、労働者と退役軍人への敬意を反映しています。これらの祝日は、全国の政府サービス、学校カレンダー、銀行業務、職場のスケジュールに影響を与えます。"
    },
    DE: {
        en: "Germany observes a mix of national and regional public holidays that reflect its history, Christian traditions, labor movement, and federal structure. While some holidays apply nationwide, many are observed only in specific federal states (Bundesländer), making local context especially important.",
        es: "Alemania observa una combinación de días festivos nacionales y regionales que reflejan su historia, tradiciones cristianas, movimiento laboral y estructura federal. Si bien algunos días festivos se aplican a nivel nacional, muchos se observan solo en estados federales específicos (Bundesländer), lo que hace que el contexto local sea especialmente importante.",
        fr: "L'Allemagne observe un mélange de jours fériés nationaux et régionaux qui reflètent son histoire, ses traditions chrétiennes, son mouvement ouvrier et sa structure fédérale. Alors que certains jours fériés s'appliquent à l'échelle nationale, beaucoup ne sont observés que dans des États fédéraux spécifiques (Bundesländer), ce qui rend le contexte local particulièrement important.",
        de: "Deutschland beobachtet eine Mischung aus nationalen und regionalen Feiertagen, die seine Geschichte, christliche Traditionen, Arbeiterbewegung und föderale Struktur widerspiegeln. Während einige Feiertage bundesweit gelten, werden viele nur in bestimmten Bundesländern beobachtet, was den lokalen Kontext besonders wichtig macht.",
        pt: "A Alemanha observa uma mistura de feriados nacionais e regionais que refletem sua história, tradições cristãs, movimento trabalhista e estrutura federal. Embora alguns feriados se apliquem nacionalmente, muitos são observados apenas em estados federais específicos (Bundesländer), tornando o contexto local especialmente importante.",
        zh: "德国庆祝国家和地区公共假日的混合，反映其历史、基督教传统、劳工运动和联邦结构。虽然一些假日适用于全国，但许多假日仅在特定的联邦州（Bundesländer）庆祝，这使得地方背景特别重要。",
        ar: "تحتفل ألمانيا بمزيج من الأعياد الوطنية والإقليمية التي تعكس تاريخها والتقاليد المسيحية وحركة العمال والهيكل الفيدرالي. في حين تنطبق بعض العطلات على الصعيد الوطني، يتم الاحتفال بالعديد منها فقط في ولايات فيدرالية محددة (Bundesländer)، مما يجعل السياق المحلي مهمًا بشكل خاص.",
        ja: "ドイツは、その歴史、キリスト教の伝統、労働運動、連邦構造を反映する国民的および地域的祝日の組み合わせを定めています。一部の祝日は全国的に適用されますが、多くは特定の連邦州（Bundesländer）でのみ観察されるため、地域の文脈が特に重要です。"
    },
    FR: {
        en: "France observes a range of public holidays shaped by revolutionary history, Christian traditions, and national remembrance. These holidays affect work schedules, school calendars, government services, and travel across the country. Most public holidays are observed nationwide, with businesses and public institutions typically closed or operating reduced hours.",
        es: "Francia observa una variedad de días festivos moldeados por la historia revolucionaria, las tradiciones cristianas y el recuerdo nacional. Estos días festivos afectan los horarios de trabajo, los calendarios escolares, los servicios gubernamentales y los viajes en todo el país. La mayoría de los días festivos se observan a nivel nacional, con empresas e instituciones públicas típicamente cerradas o operando con horarios reducidos.",
        fr: "La France observe une gamme de jours fériés façonnés par l'histoire révolutionnaire, les traditions chrétiennes et la commémoration nationale. Ces jours fériés affectent les horaires de travail, les calendriers scolaires, les services gouvernementaux et les voyages à travers le pays. La plupart des jours fériés sont observés à l'échelle nationale, les entreprises et les institutions publiques étant généralement fermées ou fonctionnant à horaires réduits.",
        de: "Frankreich beobachtet eine Reihe von Feiertagen, die von revolutionärer Geschichte, christlichen Traditionen und nationalem Gedenken geprägt sind. Diese Feiertage beeinflussen Arbeitszeiten, Schulkalender, Regierungsdienste und Reisen im ganzen Land. Die meisten Feiertage werden landesweit beobachtet, wobei Unternehmen und öffentliche Einrichtungen in der Regel geschlossen sind oder mit reduzierten Öffnungszeiten arbeiten.",
        pt: "A França observa uma variedade de feriados moldados pela história revolucionária, tradições cristãs e lembrança nacional. Esses feriados afetam horários de trabalho, calendários escolares, serviços governamentais e viagens em todo o país. A maioria dos feriados é observada nacionalmente, com empresas e instituições públicas tipicamente fechadas ou operando com horários reduzidos.",
        zh: "法国庆祝由革命历史、基督教传统和国家纪念塑造的一系列公共假日。这些假日影响全国的工作时间表、学校日历、政府服务和旅行。大多数公共假日在全国范围内庆祝，企业和公共机构通常关闭或缩短营业时间。",
        ar: "تحتفل فرنسا بمجموعة من الأعياد العامة التي شكلها التاريخ الثوري والتقاليد المسيحية والذكرى الوطنية. تؤثر هذه العطلات على جداول العمل والتقويمات المدرسية والخدمات الحكومية والسفر في جميع أنحاء البلاد. يتم الاحتفال بمعظم العطلات العامة على الصعيد الوطني، حيث تكون الشركات والمؤسسات العامة مغلقة عادةً أو تعمل بساعات مخفضة.",
        ja: "フランスは、革命の歴史、キリスト教の伝統、国家の追悼によって形作られた一連の祝日を定めています。これらの祝日は、全国の勤務スケジュール、学校カレンダー、政府サービス、旅行に影響を与えます。ほとんどの祝日は全国的に観察され、企業や公共機関は通常閉鎖されているか、営業時間が短縮されています。"
    },
    JP: {
        en: "Japan's national holidays blend ancient traditions with modern celebrations, honoring nature, culture, and historical milestones. These holidays reflect Japanese values of respect for tradition, appreciation of nature, and commemoration of constitutional democracy.",
        es: "Los días festivos nacionales de Japón combinan tradiciones antiguas con celebraciones modernas, honrando la naturaleza, la cultura y los hitos históricos. Estos días festivos reflejan los valores japoneses de respeto por la tradición, apreciación de la naturaleza y conmemoración de la democracia constitucional.",
        fr: "Les jours fériés nationaux du Japon mélangent les traditions anciennes avec les célébrations modernes, honorant la nature, la culture et les jalons historiques. Ces jours fériés reflètent les valeurs japonaises de respect pour la tradition, d'appréciation de la nature et de commémoration de la démocratie constitutionnelle.",
        de: "Japans nationale Feiertage verbinden alte Traditionen mit modernen Feiern und ehren Natur, Kultur und historische Meilensteine. Diese Feiertage spiegeln japanische Werte des Respekts vor Traditionen, der Wertschätzung der Natur und des Gedenkens an die konstitutionelle Demokratie wider.",
        pt: "Os feriados nacionais do Japão misturam tradições antigas com celebrações modernas, honrando a natureza, a cultura e marcos históricos. Esses feriados refletem os valores japoneses de respeito pela tradição, apreciação da natureza e comemoração da democracia constitucional.",
        zh: "日本的国定假日将古老传统与现代庆祝活动相结合，尊重自然、文化和历史里程碑。这些假日反映了日本对传统的尊重、对自然的欣赏以及对宪法民主的纪念的价值观。",
        ar: "تمزج الأعياد الوطنية في اليابان بين التقاليد القديمة والاحتفالات الحديثة، تكريمًا للطبيعة والثقافة والمعالم التاريخية. تعكس هذه العطلات القيم اليابانية المتمثلة في احترام التقاليد وتقدير الطبيعة وإحياء ذكرى الديمقراطية الدستورية.",
        ja: "日本の国民の祝日は、古代の伝統と現代の祝祭を融合させ、自然、文化、歴史的なマイルストーンを称えています。これらの祝日は、伝統への敬意、自然への感謝、立憲民主主義の記念という日本の価値観を反映しています。"
    },
    IN: {
        en: "India observes public holidays that reflect its independence movement, constitutional democracy, and extraordinary religious and cultural diversity. Some holidays are observed nationwide, while others vary by state and region depending on local traditions and religious practices.",
        es: "India observa días festivos que reflejan su movimiento de independencia, democracia constitucional y extraordinaria diversidad religiosa y cultural. Algunos días festivos se observan a nivel nacional, mientras que otros varían según el estado y la región dependiendo de las tradiciones locales y las prácticas religiosas.",
        fr: "L'Inde observe des jours fériés qui reflètent son mouvement d'indépendance, sa démocratie constitutionnelle et sa diversité religieuse et culturelle extraordinaire. Certains jours fériés sont observés à l'échelle nationale, tandis que d'autres varient selon l'État et la région en fonction des traditions locales et des pratiques religieuses.",
        de: "Indien beobachtet Feiertage, die seine Unabhängigkeitsbewegung, konstitutionelle Demokratie und außergewöhnliche religiöse und kulturelle Vielfalt widerspiegeln. Einige Feiertage werden landesweit beobachtet, während andere je nach Bundesstaat und Region je nach lokalen Traditionen und religiösen Praktiken variieren.",
        pt: "A Índia observa feriados que refletem seu movimento de independência, democracia constitucional e extraordinária diversidade religiosa e cultural. Alguns feriados são observados nacionalmente, enquanto outros variam por estado e região dependendo das tradições locais e práticas religiosas.",
        zh: "印度庆祝反映其独立运动、宪法民主以及非凡的宗教和文化多样性的公共假日。一些假日在全国范围内庆祝，而其他假日则根据当地传统和宗教习俗因州和地区而异。",
        ar: "تحتفل الهند بأيام عطلة عامة تعكس حركة استقلالها والديمقراطية الدستورية والتنوع الديني والثقافي الاستثنائي. يتم الاحتفال ببعض العطلات على الصعيد الوطني، بينما تختلف العطلات الأخرى حسب الولاية والمنطقة اعتمادًا على التقاليد المحلية والممارسات الدينية.",
        ja: "インドは、その独立運動、立憲民主主義、並外れた宗教的および文化的多様性を反映する祝日を定めています。一部の祝日は全国的に観察されますが、他の祝日は地域の伝統や宗教的慣習に応じて州や地域によって異なります。"
    },
    AU: {
        en: "Australia observes a range of public holidays that reflect its national identity, military history, cultural traditions, and regional diversity. These holidays play an important role in daily life, affecting government services, schools, workplaces, and travel across the country.",
        es: "Australia observa una variedad de días festivos que reflejan su identidad nacional, historia militar, tradiciones culturales y diversidad regional. Estos días festivos desempeñan un papel importante en la vida diaria, afectando los servicios gubernamentales, las escuelas, los lugares de trabajo y los viajes en todo el país.",
        fr: "L'Australie observe une gamme de jours fériés qui reflètent son identité nationale, son histoire militaire, ses traditions culturelles et sa diversité régionale. Ces jours fériés jouent un rôle important dans la vie quotidienne, affectant les services gouvernementaux, les écoles, les lieux de travail et les voyages à travers le pays.",
        de: "Australien beobachtet eine Reihe von Feiertagen, die seine nationale Identität, Militärgeschichte, kulturelle Traditionen und regionale Vielfalt widerspiegeln. Diese Feiertage spielen eine wichtige Rolle im täglichen Leben und beeinflussen Regierungsdienste, Schulen, Arbeitsplätze und Reisen im ganzen Land.",
        pt: "A Austrália observa uma variedade de feriados que refletem sua identidade nacional, história militar, tradições culturais e diversidade regional. Esses feriados desempenham um papel importante na vida cotidiana, afetando serviços governamentais, escolas, locais de trabalho e viagens em todo o país.",
        zh: "澳大利亚庆祝一系列反映其国家身份、军事历史、文化传统和地区多样性的公共假日。这些假日在日常生活中发挥重要作用，影响全国的政府服务、学校、工作场所和旅行。",
        ar: "تحتفل أستراليا بمجموعة من الأعياد العامة التي تعكس هويتها الوطنية وتاريخها العسكري وتقاليدها الثقافية وتنوعها الإقليمي. تلعب هذه العطلات دورًا مهمًا في الحياة اليومية، حيث تؤثر على الخدمات الحكومية والمدارس وأماكن العمل والسفر في جميع أنحاء البلاد.",
        ja: "オーストラリアは、その国民的アイデンティティ、軍事史、文化的伝統、地域的多様性を反映する一連の祝日を定めています。これらの祝日は日常生活において重要な役割を果たし、全国の政府サービス、学校、職場、旅行に影響を与えます。"
    }
};

// Transform the countries array
data.countries = data.countries.map(country => {
    const countryDescriptions = descriptions[country.id];

    if (countryDescriptions) {
        return {
            ...country,
            description: countryDescriptions
        };
    }

    return country;
});

// Write the updated data back
fs.writeFileSync(holidaysPath, JSON.stringify(data, null, 2), 'utf8');

console.log('✅ Successfully added multilingual descriptions to holidays.json');
