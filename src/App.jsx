import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend as RechartLegend,
} from "recharts";

const FACTS_EN={
  1:"Paris has 470km of catacombs with 6M skeletons. The Eiffel Tower grows 15cm taller in summer due to heat expansion of its metal.",
  2:"Big Ben refers only to the bell, not the tower. London has more CCTV cameras per capita than any other Western city.",
  3:"Madrid is Europe's only capital without a navigable river. Its Sobrino de Botín restaurant has been open since 1725 — a world record.",
  4:"Tokyo has the world's most punctual trains (18-second average delay) and more Michelin stars than Paris, London and New York combined.",
  5:"Berlin has more bridges than Venice (960 vs 400) and more museums per capita than any city on Earth (170+).",
  6:"Lisbon is older than Rome by 400 years. Its iconic yellow Tram 28, launched in 1901, still uses the original cars.",
  7:"In Prague, beer is cheaper than bottled water. Its 1410 astronomical clock is the world's oldest still operating.",
  8:"Rome's Trevi Fountain collects €1.5M in coins yearly, donated to charity. The city has more obelisks than Egypt.",
  9:"Stockholm is built on 14 islands. Its metro is the world's longest art gallery, with every station uniquely decorated.",
  10:"Seoul has the world's fastest internet. It's the only city where you can get surgery, eat 24/7 and play in PC cafés on the same street.",
  11:"Buenos Aires has more psychoanalysts per capita than anywhere on Earth. Its 9 de Julio Avenue is the world's widest at 16 lanes.",
  12:"Sydney Opera House took 14 years instead of 4 and cost 14 times the budget. Its roof tiles are self-cleaning thanks to a special glaze.",
  13:"Mexico City sinks 9cm per year into a drained Aztec lake. Despite this, it has more museums than almost any city in the world.",
  14:"Montreal has a 33km underground city, used daily by 500,000 people in winter to avoid -30°C temperatures.",
  15:"Cairo houses the only ancient wonder still standing: the Great Pyramid of Giza, built 4,500 years ago.",
  16:"Santiago is one of the few capitals where you can ski in the Andes in the morning and relax on a Pacific beach in the afternoon.",
  17:"Amsterdam has more bikes than people (880K vs 800K). Houses lean forward on purpose so furniture can be hoisted up with pulley ropes.",
  18:"Barcelona's Eixample district has uniquely chamfered block corners for traffic flow. Sagrada Família, under construction since 1882, opens fully in 2026.",
  19:"Vienna invented coffee house culture, recognized by UNESCO. It also has the world's oldest zoo, open since 1752.",
  20:"Budapest is two cities (Buda+Pest) joined by bridges. It has the oldest metro in continental Europe (1896) and more thermal baths than any capital.",
  21:"Warsaw was 85% destroyed in WWII. Its old town was rebuilt so precisely from old paintings that UNESCO listed it as World Heritage.",
  22:"Dublin is Europe's youngest capital by average age. It invented Guinness (1759) and Halloween, from the Celtic Samhain festival.",
  23:"Copenhagen tops world happiness rankings. Its concept of 'hygge' (cozy togetherness) was born here.",
  24:"Oslo is Europe's most expensive city, but Norway gives more foreign aid per capita than any country. The world's best Viking ships are preserved here.",
  25:"Helsinki is the only capital where the presidential palace, cathedral, market square and harbor are all visible from one single spot.",
  26:"Brussels hosts NATO and EU HQ — the de facto political capital of the Western world. It's also the world comics capital (Tintin, Smurfs).",
  27:"Zurich tops quality-of-life rankings consistently. Its tap water comes straight from the Alps and is safe to drink from any public fountain.",
  28:"Athens has been inhabited for 7,000 years — Europe's oldest city. The Parthenon's columns are slightly curved to correct an optical illusion.",
  29:"Istanbul is the world's only city on two continents. Its Grand Bazaar has 4,000+ shops and has been open since 1455.",
  30:"Seville is Europe's hottest major city (45°C summers), birthplace of flamenco and tapas, and Spain's only inland port.",
  31:"Krakow was the only major Polish city not destroyed in WWII. Its Jewish quarter Kazimierz inspired Schindler's List.",
  32:"Porto gave its name to Port wine. Its iconic blue-and-white azulejo tiles cover everything from train station walls to church façades.",
  33:"Valencia invented paella — originally with rabbit and chicken, not seafood. Its Las Fallas festival burns giant sculptures at midnight.",
  34:"Riga has the world's largest Art Nouveau district: one third of all city centre buildings were built in this style (1896–1913).",
  35:"Tallinn is one of Europe's best-preserved medieval cities. Estonia was the first Soviet republic to declare independence in 1991.",
  36:"Vilnius has the largest baroque old town in Northern Europe. Its micro-republic Užupis declared independence on April Fools' Day 1997.",
  37:"Ljubljana is Europe's greenest capital (550m² of green space per person). Its entire city centre is car-free.",
  38:"Bratislava is the only capital in the world that borders two other countries — Austria and Hungary — simultaneously.",
  39:"Reykjavik is the world's northernmost capital and runs on 100% renewable energy. Northern Lights are visible from the city centre.",
  40:"Singapore went from third-world to first-world in a single generation (1965–2000). It's the world's greenest skyscraper city.",
  41:"Bangkok has the world's longest official city name (169 Thai characters). Its famous tuk-tuks are now electric.",
  42:"Dubai went from a fishing village to the world's most futuristic city in 50 years. The Burj Khalifa lets you watch the sunset twice in one evening.",
  43:"Nairobi is the only capital with a national park inside city limits — you can see lions with skyscrapers in the background.",
  44:"Bogotá closes 121km of streets every Sunday for Ciclovía — the world's largest weekly temporary cycle path.",
  45:"Lima is South America's food capital with more restaurants per capita than Paris. Peruvian ceviche is UNESCO Intangible Heritage.",
  46:"Lagos is Africa's largest city and Sub-Saharan Africa's millionaire capital. Afrobeats, born here, now dominates global music charts.",
  47:"New York has 800+ languages spoken — the world's most. Its subway is the only one running 24/7, 365 days a year.",
  48:"San Francisco invented the fortune cookie, the martini and the hippie movement. The Golden Gate was once deemed impossible to build.",
  49:"Mumbai produces more films than Hollywood (~1,800/year vs 600). Its dabbawalas achieve 99.9999% delivery accuracy — studied at Harvard.",
  50:"Tel Aviv is the world's startup capital per capita. It never sleeps: beach, restaurants and clubs are open 24/7.",
  51:"Milan houses Da Vinci's Last Supper painted on a wall (months' wait to book). It hosts the world's most influential fashion week.",
  52:"Naples invented the margherita pizza in 1889. Its pizza-making tradition is UNESCO Intangible Heritage. Mount Vesuvius looms overhead.",
  53:"Florence is the Renaissance and banking birthplace. The Uffizi Gallery holds the world's greatest concentration of Renaissance art.",
  54:"Venice is built on 118 islands with 400 bridges and no roads. During Acqua Alta, St Mark's Square can be completely underwater.",
  55:"Turin was Italy's first unified capital. It's the world chocolate capital — gianduja (hazelnut chocolate) was invented here in the 19th century.",
  56:"Bologna has the world's oldest university (1088) and 38km of UNESCO-listed covered arcades. It gave the world Bolognese sauce and tortellini.",
  57:"Lyon invented cinema: the Lumière brothers shot the world's first film here on December 28, 1895. It's also France's gastronomic capital.",
  58:"Marseille is France's oldest city (founded 600 BC by Greeks). Its bouillabaisse recipe is so iconic it has an official legal charter.",
  59:"Nice was Italian until 1860. Its Promenade des Anglais was funded in 1820 by English tourists — history's first tourist-funded infrastructure.",
  60:"Bordeaux is the world wine capital. Its 1855 wine classification, created for the Paris World's Fair, is still used today unchanged.",
  61:"Toulouse is the European aerospace capital — Airbus HQ is here. Nicknamed 'La Ville Rose' for its distinctive pink brick buildings.",
  62:"Strasbourg hosts the EU Parliament, Council of Europe and European Court of Human Rights — the symbolic capital of Europe.",
  63:"Munich's Oktoberfest draws 6M visitors consuming 7.5M liters of beer in 16 days. It also houses the world's largest science museum.",
  64:"Hamburg is Europe's 2nd largest port. Its Speicherstadt warehouse district is the world's largest historical warehouse complex (UNESCO).",
  65:"Cologne's cathedral took 632 years to build (1248–1880). The city invented Eau de Cologne in 1709 — the base for all modern perfumes.",
  66:"Frankfurt is Europe's financial capital (ECB, Bundesbank). Goethe's birthplace, it also hosts the world's first book fair (since 1454).",
  67:"Düsseldorf is Germany's fashion and ad capital. It has the world's largest Japanese community outside Asia.",
  68:"Geneva houses more international organizations than New York. The World Wide Web was invented at CERN here in 1989.",
  69:"Bern has one of Europe's best-preserved medieval centres in sandstone. Einstein developed relativity here as a patent examiner.",
  70:"Edinburgh's Old and New Towns are UNESCO listed. Its Fringe Festival is the world's largest arts festival (50,000+ performances in August).",
  71:"Manchester was the world's first industrial city. Alan Turing worked here. The city arguably invented modern association football.",
  72:"Glasgow has more green space per capita than any UK city. Charles Rennie Mackintosh's School of Art is one of the finest Art Nouveau buildings globally.",
  73:"Bristol is Banksy's birthplace — the mysterious artist has never been officially identified. The Concorde supersonic jet was launched from here.",
  74:"Rotterdam was rebuilt from WWII bombing as a lab of modern architecture. It has Europe's largest port and iconic tilted Cube Houses.",
  75:"Antwerp is the world's diamond capital — 80%+ of rough diamonds pass through. It's also Belgium's fashion capital (home to the Antwerp Six).",
  76:"Bruges is one of Europe's best-preserved medieval cities, nicknamed 'Venice of the North.' Its entire historic centre is UNESCO listed.",
  77:"Gothenburg invented sitting outdoors in cold weather — locals stay outside under blankets with hot drinks even in winter.",
  78:"Bergen is Europe's rainiest city (2,250mm/year), surrounded by 7 mountains. Bergensers are famously optimistic despite the weather.",
  79:"Bucharest was called 'Little Paris' for its Haussmann-style boulevards. Its Parliament Palace is the 2nd largest building by volume after the Pentagon.",
  80:"Sofia has 8,000 years of continuous settlement — one of Europe's oldest cities. Natural hot springs flow beneath the city centre.",
  81:"Zagreb has a Museum of Broken Relationships where people donate objects from failed romances. It also has the world's shortest funicular (66m).",
  82:"Dubrovnik is Game of Thrones' King's Landing. Its medieval walls were so over-toured that visitor numbers had to be officially capped.",
  83:"Split has 3,000 people living inside Diocletian's Roman Palace (305 AD) — the world's only actively inhabited ancient Roman palace.",
  84:"Belgrade has been destroyed and rebuilt 44 times — one of history's most frequently razed cities. Its fortress overlooks two rivers' confluence.",
  85:"Sarajevo triggered WWI (1914 assassination here), hosted the 1984 Winter Olympics, and endured history's longest capital siege (1,425 days).",
  86:"Tirana is Europe's most colourful capital — painter-turned-mayor Edi Rama had every building painted in vivid colours.",
  87:"Skopje built 136 statues and dozens of neoclassical buildings in just 4 years ('Skopje 2014'). It has the world's most statues per capita.",
  88:"Bilbao's 1997 Guggenheim Museum triggered such a dramatic revival it coined the 'Bilbao Effect' term now used worldwide in urban planning.",
  89:"Granada's Alhambra is Spain's most visited monument (2.7M/year) and the world's finest example of Islamic palace architecture.",
  90:"Palma's La Seu cathedral (started 1229), partly restored by Gaudí, is one of the world's finest Gothic cathedrals.",
  91:"Málaga is Picasso's birthplace. The Picasso Museum is steps from his childhood home. The city enjoys 320 sunny days per year.",
  92:"Luxembourg City is built over dramatic gorges with rock-face fortifications. Luxembourg has the 2nd highest GDP per capita in the world.",
  93:"Valletta is the EU's smallest capital (6,000 people), yet every building within its walls has historical importance. Built by the Knights of Malta in 1566.",
  94:"Nicosia is the world's last divided capital — split since 1974 by a UN Buffer Zone you can cross on foot with a passport.",
  95:"Thessaloniki has more UNESCO sites than Athens. It is also the birthplace of Mustafa Kemal Atatürk, founder of modern Turkey.",
  96:"Gdańsk is where WWII started (Sept 1, 1939) and where communism ended — the Solidarity union born in its shipyards in 1980 brought down the Eastern Bloc.",
  97:"Wrocław has 100+ bridges over the Odra and 400+ hidden bronze dwarf statues — finding them all is a beloved tourist tradition.",
  98:"Poznań is where Poland was born (10th-century Piast dynasty). Every noon, two mechanical billy-goats emerge from the town hall clock and butt heads 12 times.",
  99:"Innsbruck hosted the Winter Olympics twice (1964 and 1976) — a record. Ski runs start just 10 minutes from downtown.",
  100:"Salzburg is Mozart's birthplace and the setting of The Sound of Music. Its baroque old town, surrounded by mountains, is UNESCO World Heritage.",
  101:"São Paulo is the Southern Hemisphere's largest city. It has the world's largest Japanese community outside Japan (1M+) and more helicopters per capita than New York.",
  102:"Rio's Carnival is the world's largest festival (2M people daily for 5 days). Christ the Redeemer has been struck by lightning many times — locals find it perfectly normal.",
  103:"Brasília was built in just 41 months (1956–60) and is UNESCO listed — the only 20th-century city with that honour. Seen from the air it looks like an airplane.",
  104:"Salvador has the strongest African culture outside Africa (80% have African heritage). Capoeira and Candomblé were born here.",
  105:"Fortaleza has 25km of urban beaches. Every evening a different neighbourhood holds a 'Forró Night' — thousands dancing under the stars.",
  106:"Recife is nicknamed the 'Brazilian Venice' for its canals and bridges. It rivals Rio for Brazil's most beloved Carnival.",
  107:"Belo Horizonte is the world capital of the kilo restaurant — self-service dining where you pay by weight of food taken.",
  108:"Manaus's Teatro Amazonas opera house was built in 1896 in the heart of the Amazon jungle and is considered one of the world's most beautiful.",
  109:"Curitiba is a global model of sustainable urbanism. Its articulated bus network was copied by dozens of cities worldwide.",
  110:"Porto Alegre is the world BBQ (churrasco) capital and invented municipal participatory budgeting in 1989 — now used in 300+ cities globally.",
  111:"Montevideo ranks first in Latin America for quality of life. Uruguay legalized cannabis and same-sex marriage in 2013 — two world firsts in the same year.",
  112:"Medellín went from the world's most dangerous city (1990s) to one of its most innovative. Its urban cable car connecting hillside neighbourhoods is a global model.",
  113:"Cali is the world salsa capital. Every summer, the Feria de Cali brings 3M+ people to 6 days of non-stop dancing.",
  114:"Cartagena's 16th-century Spanish colonial walls still stand. Gabriel García Márquez set several novels here and is buried in the city.",
  115:"Quito is the world's 2nd highest capital (2,850m) and was the first city ever listed as UNESCO World Heritage (1978).",
  116:"Guayaquil is the gateway to the Galápagos Islands and home to Arriba cacao — considered among the world's finest chocolate.",
  117:"La Paz is the world's highest seat of government (3,650m). Its Witches' Market sells dried llama foetuses used as offerings in Aymara tradition.",
  118:"Santa Cruz is Bolivia's fastest-growing city, nicknamed 'Ciudad de los Anillos' for its concentric boulevard ring roads.",
  119:"Asunción (founded 1537) was the base for colonising the entire Río de la Plata region. Guaraní is co-official with Spanish.",
  120:"Caracas sits in a valley at 900m altitude, giving it an eternal spring with a year-round average of 22°C — once nicknamed 'city of eternal spring'.",
  121:"Georgetown is one of few South American capitals with English as official language and is built below sea level, relying on Dutch-era dykes.",
  122:"Paramaribo is the only capital where a Catholic cathedral and a grand mosque face each other on the same public square — a symbol of coexistence.",
  123:"Cayenne is the closest French territory to the equator. The nearby Kourou Space Centre launches Ariane rockets — the equator helps save fuel.",
  124:"Córdoba hosts South America's oldest university (1613) and was birthplace of the 1918 student movement that reformed Latin American higher education.",
  125:"Rosario is the birthplace of both Lionel Messi and Che Guevara — born just a few streets apart.",
  126:"Mendoza is the world Malbec capital. Its high-altitude vineyards (900m) produce some of the finest red wines on Earth.",
  127:"Bariloche is Argentina's artisanal chocolate capital — more chocolate shops per capita than anywhere in the world. Nicknamed 'Switzerland of Argentina'.",
  128:"Salta (nicknamed 'Salta la Linda') has remarkably preserved Spanish colonial architecture. It's the starting point for the 'Train to the Clouds' (4,220m altitude).",
  129:"Valparaíso is UNESCO-listed for colourful architecture on 42 hills. Pablo Neruda lived here and wrote about the sea views.",
  130:"Concepción is Chile's 2nd city and cultural capital — it has produced more Chilean rock bands than anywhere else in the country.",
  131:"Cusco was the Inca Empire's capital. Inca walls fitted stones so perfectly — with no mortar — they survived earthquakes that toppled Spanish constructions.",
  132:"Arequipa, 'La Ciudad Blanca', is built from white volcanic sillar stone. Many consider it Peru's true gastronomic capital.",
  133:"Trujillo is Peru's marinera dance capital. Nearby Chan Chan is the world's largest pre-Columbian adobe city (UNESCO).",
  134:"Havana is frozen in time — thousands of 1950s American cars still roam its streets. Its UNESCO colonial old city is one of the Americas' best preserved.",
  135:"Haiti was the world's first Black republic (1804), born from the only successful slave revolution in history. Port-au-Prince has one of the Caribbean's most vibrant art scenes.",
  136:"Port-au-Prince has one of the Caribbean's most vibrant art scenes. Haitian naive painting is recognized worldwide as a unique artistic tradition.",
  137:"Bogotá closes 121km of roads every Sunday for the world's largest weekly cycle path (Ciclovía). Its cable cars connect hilltop hillside neighbourhoods.",
  138:"Florianópolis ('Floripa') is an island with 42 beaches, famous for exceptional quality of life and attracting digital nomads worldwide.",
  139:"Natal is nicknamed 'Cidade do Sol' (300 sunny days/year). It's Brazil's closest point to Africa — just 3,000km from Dakar.",
  140:"Maceió has some of the world's most beautiful natural pools — emerald lagoons formed by coral reefs at low tide, with perfect water clarity.",
  141:"Belém's Ver-o-Peso is one of the world's largest open-air markets, with hundreds of medicinal plants and exotic Amazonian fruits unknown outside Brazil.",
  142:"Goiânia is one of the world's most tree-lined cities (60 trees per person). It has Latin America's largest urban park.",
  143:"Montevideo tops Latin America for quality of life. Uruguayans are the world's biggest per-capita maté drinkers — carrying thermos and gourd everywhere.",
  144:"Punta del Este is the 'Saint-Tropez of South America.' Its famous 'La Mano' sculpture emerging from the beach sand is a global icon.",
  145:"Sucre is Bolivia's constitutional capital. By law all colonial buildings must be painted white — earning it the name 'La Ciudad Blanca'. Bolivia uniquely has two capitals.",
  146:"Cochabamba ('Ciudad Jardín') has a year-round spring climate at 2,570m. Its 2000 'Water War' against privatisation inspired social movements worldwide.",
  147:"Barranquilla is Shakira's hometown. Its Carnival is the world's 2nd largest after Rio, listed as UNESCO Intangible Heritage.",
  148:"Buenaventura is Colombia's main Pacific port and one of the rainiest cities on Earth (7,000mm/year). It's the birthplace of Afro-Colombian Pacific music.",
  149:"Santa Marta (founded 1525) is Colombia's oldest city. Simón Bolívar died here in 1830. The spectacular Tayrona National Park is just 30km away.",
  150:"Maracaibo is famous for the Catatumbo Lightning — a natural phenomenon where lightning silently illuminates the sky nearly 300 nights per year. NASA calls it the world's 'natural lighthouse'.",
  151:"Beijing hosted both Summer (2008) and Winter (2022) Olympics — the only city to do so. The Forbidden City has 9,999 rooms — one short of the number reserved for the gods.",
  152:"Shanghai has the world's fastest commercial train (Maglev, 431km/h). It built more skyscrapers in 20 years than New York did in an entire century.",
  153:"Hong Kong has the world's highest skyscraper density (9,000+ towers over 14 floors). Its nightly harbour light show across 44 buildings is Guinness-certified.",
  154:"Osaka ('Kitchen of Japan') invented instant ramen. Locals greet each other with 'Have you eaten?' The city's Kuidaore spirit means 'eat until you drop'.",
  155:"Kyoto was spared from atomic bombs because the US Secretary of War had honeymooned there. It has 1,600 Buddhist temples and 400 Shinto shrines.",
  156:"Seoul has the world's fastest internet. It's one of the most connected cities on Earth — free WiFi in every metro station, bus and public park.",
  157:"Busan hosts BIFF, one of Asia's top film festivals. It has the world's only UN Memorial Cemetery — the only UN cemetery on Earth.",
  158:"Taipei 101's 660-tonne golden tuned mass damper prevents the tower from collapsing in typhoons — it's visible to visitors from inside the building.",
  159:"New Delhi was purpose-built by the British (1911–1931) to replace Calcutta as capital. Its Connaught Place is a perfect circle inspired by Roman city planning.",
  160:"Bangalore is India's Silicon Valley (35% of Indian IT professionals work here) and the 'Garden City' with 1,000 parks — a legacy of 19th-century royal urban planning.",
  161:"Chennai is South India's cultural capital, cradle of Carnatic music and Bharatanatyam dance. It also has one of the world's longest urban beaches (13km).",
  162:"Kolkata is the world's only city with hand-pulled rickshaws still in active use — a British colonial tradition kept alive out of respect for rickshaw pullers.",
  163:"Karachi generates 42% of Pakistan's total tax revenue. The city has 145 languages spoken — one of the most linguistically diverse cities on Earth.",
  164:"Lahore, the 'City of Gardens', has the UNESCO-listed Shalimar Garden. Its Sufi music traditions gather millions at annual shrine festivals.",
  165:"Dhaka is the world's most densely populated city (44,000 people/km²) and the global centre of low-cost textile manufacturing for major fashion brands.",
  166:"Kathmandu Valley has 7 UNESCO World Heritage sites — the highest concentration in the world for such a small area. All Everest expeditions start here.",
  167:"Colombo is the capital of Ceylon tea (Sri Lanka is the world's 4th largest producer). It houses the world's largest collection of uncut gems.",
  168:"Islamabad was built from scratch in 1966. It's consistently ranked Pakistan's cleanest and greenest city — a complete contrast to chaotic Karachi.",
  169:"Kabul sits at 1,800m altitude. Despite decades of conflict, its antiques market has objects from Greek Bactrian, Mongol and Mughal eras coexisting side by side.",
  170:"Tehran is surrounded by the Alborz mountains — you can ski less than 30 minutes from the city centre. The Iranian capital has 5 ski resorts accessible by metro.",
  171:"Baghdad was the world's largest city in the 9th century (1M people, when Paris had 20,000). Its House of Wisdom was the greatest intellectual centre of the era.",
  172:"Riyadh plans to build 'The Line' — a 170km-long, 500m-tall linear city for 9M people, with no cars and 100% renewable energy.",
  173:"Doha hosted the 2022 FIFA World Cup — the first in winter and in an Arab country. Qatar spent more on stadium air conditioning than some countries' entire annual energy use.",
  174:"Kuwait City's Kuwait Tower stores desalinated seawater in a modernist Islamic masterpiece (1979). Kuwait has more oil per capita than any other country.",
  175:"Manila is the world's most densely populated city (111,000 people/km² in some districts). Filipinos were nicknamed 'the texting nation' — the world's highest SMS users per capita.",
  176:"Kuala Lumpur's Petronas Towers were the world's tallest (1998–2004). The sky bridge at floor 41 between the two towers is Southeast Asia's most photographed attraction.",
  177:"Jakarta is literally sinking — the city's north drops 25cm per year from groundwater pumping. Indonesia is moving its entire capital to Nusantara on Borneo island.",
  178:"Bali is Indonesia's only Hindu-majority island (87% of Indonesia is Muslim). Every Balinese family has a private temple. Nyepi (Day of Silence) shuts the entire island for 24h.",
  179:"Ho Chi Minh City has 9M+ motorbikes — one per person. Crossing the street through the scooter traffic is considered an art requiring years of practice to master.",
  180:"Hanoi was founded in 1010 — one of Southeast Asia's oldest capitals. Its Old Quarter's 36 streets each still bear the name of the craft guild once practiced there.",
  181:"Phnom Penh was deliberately emptied of all inhabitants by the Khmer Rouge in 1975 — one of history's only intentionally depopulated capitals. It has been rebuilt since 2012.",
  182:"Vientiane is Southeast Asia's most relaxed capital — nicknamed 'the capital that doesn't stress.' Bars close at midnight and you can hear frogs from the city centre.",
  183:"Yangon's Shwedagon Pagoda is covered in 60 tonnes of pure gold and crowned by a 76-carat diamond. Tradition places its construction 2,600 years ago.",
  184:"Naypyidaw was secretly built by Myanmar's military junta in 2005. Its 20-lane highway is almost completely empty — a ghost capital built by design.",
  185:"Chengdu is the world's giant panda capital. Its residents are China's most relaxed — the city is the global mahjong capital and a tea-terrace civilisation.",
  186:"Chongqing is the world's largest municipality by area (bigger than Austria) with 32M people. Its 'bangbang men' bamboo porters climb hundreds of steps to deliver goods in steep alleyways.",
  187:"Guangzhou (Canton) is China's gastronomic capital — Cantonese cuisine is the world's most recognised. It hosts the world's largest trade fair (Canton Fair) twice per year.",
  188:"Shenzhen was a fishing village of 30,000 in 1979. Today it has 13M people and is the world's electronics capital (Huawei, Tencent and DJI are headquartered here).",
  189:"Xi'an is one of the world's oldest cities and the Silk Road's origin. The Terracotta Army (8,000 soldiers, buried 210 BC) was discovered in 1974 by farmers digging a well.",
  190:"Macao generates 7× more gambling revenue than Las Vegas — the only place in China where gambling is legal, with one of the world's highest GDPs per capita.",
  191:"Almaty sits at 900m at the foot of the Tian Shan mountains. A ski resort is accessible from the city centre in just 15 minutes — a rarity for a major metropolis.",
  192:"Tashkent has one of the world's most beautiful metros — every station is decorated like a museum with mosaics and chandeliers. The city was entirely rebuilt after a 1966 earthquake.",
  193:"Tbilisi, founded in the 5th century (legend: a king followed a wounded pheasant into hot sulphur springs), is where Georgia's 8,000-year winemaking tradition began.",
  194:"Yerevan was founded in 782 BC — older than Rome. Mount Ararat, visible from almost everywhere, is actually in Turkey — a deep symbolic wound for Armenians.",
  195:"Baku's name means 'city battered by winds' in Persian. Its Flame Towers — three skyscrapers shaped like oil flames — light up nightly to symbolise the nation's black gold.",
  196:"Ulaanbaatar is the world's coldest capital (-2°C annual average). Half of Mongolia lives here, and many nomads have relocated their yurts to the city, creating unique tent neighbourhoods.",
  197:"Pyongyang is the world's most hermetic capital — only a few thousand escorted tourists are admitted each year. Its metro runs 100m underground — the world's deepest.",
  198:"Dili overlooks a pristine turquoise bay with some of the world's best-preserved reefs, almost unknown to mass tourism. East Timor is Asia's youngest nation (independence 2002).",
  199:"Astana (Nur-Sultan) was built from scratch in the Kazakh steppe in just 10 years. It has changed its name 3 times in 30 years and features buildings designed by Norman Foster.",
  200:"Jakarta is being abandoned as Indonesia's capital — sinking 25cm/year, it will be partly underwater by 2050. The new capital Nusantara is being built on Borneo island.",
  201:"Los Angeles is the global cinema capital and has more highways than any city in the world. Yet traffic is so bad that locals measure distance in minutes, never in kilometres.",
  202:"Chicago invented the skyscraper, deep-dish pizza and House music. It's called 'The Windy City' not for its weather but for its 'windbag' 19th-century politicians.",
  203:"Houston is the world centre of the space industry (NASA Mission Control is here) and the most linguistically diverse US city (145 languages spoken daily).",
  204:"Miami is the only major US city founded by a woman (Julia Tuttle, 1896). Today, 70% of residents speak Spanish at home. It's the world's 4th financial centre.",
  205:"Seattle is where Starbucks, Amazon, Microsoft and Boeing were all founded. The Space Needle was supposed to be demolished after the 1962 World's Fair.",
  206:"Boston is home to Harvard and MIT — the world's two most influential universities, less than 5km apart. The Boston Tea Party (1773) triggered the American Revolution.",
  207:"Washington D.C.'s main avenues form a perfect pentagram visible from space. All Smithsonian museums are free — unique among the world's great capitals.",
  208:"Atlanta is Coca-Cola's birthplace (invented 1886 to cure headaches). It's also the home of CNN, Delta Airlines and the US Centers for Disease Control.",
  209:"Las Vegas consumes more electricity per capita than any other city. The Strip is one of the few places on Earth visible from space at night.",
  210:"Denver is exactly 1,609m above sea level ('Mile High City') — purple seats in the Rockies stadium mark the exact elevation. It's the US legal cannabis capital since 2012.",
  211:"Portland is the world's food truck capital (700+) and has the world's highest craft brewery density (70 breweries). Its motto: 'Keep Portland Weird'.",
  212:"Nashville is the world country music capital — Grand Ole Opry has broadcast live shows since 1925. It's also the global centre of the Christian music industry.",
  213:"Phoenix is the fastest-growing US city for 50 years. With 110 days above 38°C annually, it's a frontline city for urban climate change adaptation.",
  214:"Minneapolis has the world's longest indoor skyway network (80 blocks of climate-controlled walkways for -30°C winters). It's also the birthplace of Prince.",
  215:"New Orleans is jazz's birthplace (Louis Armstrong born here, 1901). Built below sea level, it suffered catastrophically from Hurricane Katrina (2005). Mardi Gras is the US's largest street festival.",
  216:"Toronto is the world's most multicultural city (50%+ of residents born abroad, representing 200 nationalities). The CN Tower was the world's tallest structure for 32 years.",
  217:"Vancouver is the only major North American city where you can ski in the morning and surf in the afternoon. It has North America's 2nd largest Chinatown after San Francisco.",
  218:"Calgary has Canada's most millionaires per capita thanks to Alberta's oil boom. The annual Stampede is the world's largest rodeo (10 days, everyone wears cowboy hats).",
  219:"Ottawa has the world's longest natural skating rink (7.8km on the Rideau Canal in winter). The Netherlands gifts 10,000 tulips yearly since 1945 — a WWII thank-you.",
  220:"Quebec City has intact medieval ramparts — the only North American city with them (UNESCO). Its Winter Carnival features ice canoe racing on the St. Lawrence River.",
  221:"Edmonton is Canada's 'Festival City' (50+ festivals per year) and home to North America's largest mall — complete with its own indoor waterpark, ice rink and golf course.",
  222:"Guadalajara is the birthplace of mariachi and tequila — Mexico's two most globally recognised cultural symbols. It's also Mexico's Silicon Valley (IBM, Intel have R&D centres here).",
  223:"Monterrey generates 25% of Mexico's industrial GDP. It's surrounded by the Sierra Madre mountains with the iconic Cerro de la Silla visible from everywhere in the city.",
  224:"Cancún didn't exist in 1970 — it was all jungle. A Mexican government computer selected the site as the ideal tourist destination and built the city from scratch.",
  225:"Oaxaca is Mexico's gastronomic capital: birthplace of mole, artisanal mezcal and tlayudas. Its Día de Muertos celebrations are considered the most spectacular in the world.",
  226:"Puebla invented chili con carne and tacos al pastor. On May 5, 1862, Mexican forces defeated Napoleon III's French army here — his only battlefield defeat.",
  227:"Costa Rica abolished its army in 1948 and reinvested those funds into education and healthcare. Its 'Pura Vida' (Pure Life) is both a greeting and a full philosophy of existence.",
  228:"Guatemala City is built on a 1,500m plateau surrounded by active volcanoes. Pacaya volcano regularly spews lava flows just 30km from downtown. It's Central America's most populous city.",
  229:"Tegucigalpa is one of the world's only capitals without a flat airport — planes must slalom between mountains to land on a short runway perched at the edge of a ravine.",
  230:"El Salvador was the world's first country to adopt Bitcoin as official legal tender (2021). San Salvador has the world's highest density of pupusería restaurants.",
  231:"Managua is one of the world's only capitals without a real city centre — its historic core was destroyed by a 1972 earthquake and never rebuilt.",
  232:"Panama City is the only place on Earth where you can see the sun rise on the Pacific and set on the Atlantic from the same city. The Canal cut 15,000km off the sea route from New York to San Francisco.",
  233:"Havana is a city frozen in time with thousands of 1950s American cars still running. Its UNESCO colonial old city is one of the Americas' best preserved.",
  234:"Kingston is Bob Marley's hometown and the birthplace of reggae and dancehall. Jamaica produces more world athletics champions per capita than any other country — including Usain Bolt.",
  235:"Port of Spain is the birthplace of calypso, soca and the steel pan — the percussion instrument invented in the 1930s from empty oil drums. Trinidad's Carnival is often called the world's most creative.",
  236:"San Juan is the 2nd oldest European city in the Americas (after Santo Domingo). Its cobalt-blue UNESCO old city and Spanish ramparts overlook a stunning turquoise bay.",
  237:"Santo Domingo (founded 1496) is the Americas' first European city. Its Colonial Zone contains the first hospital, university and cathedral built in the New World.",
  238:"Havana's Cubans have been distilling rum from sugarcane for 400 years. Havana Club's world-famous recipes follow original Spanish colonial formulas.",
  239:"Bridgetown is Rihanna's hometown — she's been named national ambassador and has a street named after her. The island is considered the birthplace of modern rum.",
  240:"Nassau is one of the world's busiest cruise ports (3.5M passengers/year). In the 17th century it was the global capital of piracy — home of Blackbeard and Calico Jack.",
  241:"Winnipeg is Canada's geographic centre and endures the world's most brutal wind-chill factor of any major city. It has Canada's highest number of artists per capita.",
  242:"Halifax played a vital WWII role as the main Allied convoy departure port. In 1917, a munitions ship collision caused the world's largest man-made explosion before Hiroshima.",
  243:"Victoria is nicknamed 'the most British city outside the UK' for its Westminster-style parliament and English gardens. Daffodils bloom there in January — Canada's mildest winter climate.",
  244:"Belize City is the gateway to the Great Blue Hole — a 300m-diameter underwater sinkhole and one of the world's top 10 dive sites. Belize is Central America's only English-speaking country.",
  245:"Guadeloupe is shaped like a butterfly seen from the air. The island produces some of the world's finest agricultural rums, made directly from fresh cane juice rather than molasses.",
  246:"Martinique is Empress Joséphine's birthplace (Napoleon's wife). In 1902, the Mont Pelée volcano destroyed the nearby city of Saint-Pierre in just 2 minutes, killing 30,000 people.",
  247:"Monterrey is Mexico's economic powerhouse (25% of industrial GDP). Surrounded by Sierra Madre, it has MARCO — one of Latin America's finest contemporary art museums.",
  248:"San Diego has the best climate of any US city (266 sunny days/year, 18°C average). It hosts the world's largest naval base and the US's most visited zoo.",
  249:"Austin is the world's live music capital with 250+ venues. It hosts SXSW — the world's largest music, film and tech gathering — with 400,000 participants each March.",
  250:"Philadelphia is where the US was born — the Declaration of Independence was signed here in 1776. It's the global cheesesteak capital. Rocky's famous museum steps are here.",
  251:"Johannesburg is built on the world's largest man-planted urban forest (10M trees). It was born from gold — a 1886 discovery transformed a farm into a megacity in just 10 years.",
  252:"Cape Town is the only city built at the foot of a UNESCO World Heritage natural monument — Table Mountain. Bartolomeu Dias began his African circumnavigation from here in 1488.",
  253:"Durban has the world's largest Indian population outside India (1.2M+) and is the global capital of surfing on natural waves, with 22°C ocean water year-round.",
  254:"Pretoria is nicknamed the 'Jacaranda City' — 70,000 jacarandas turn it purple every October. South Africa uniquely has two capitals: Pretoria (admin) and Cape Town (legislative).",
  255:"Accra is one of Africa's fastest-growing capitals, known for its colourful kente cloth markets. Its Jamestown neighbourhood — a former colonial fort — is now a vibrant boxing hub.",
  256:"Abidjan, the 'Paris of West Africa', produces 40% of the world's cocoa. Every chocolate bar sold globally likely contains cocoa from this region.",
  257:"Dakar is the westernmost point of Africa. The Dakar Rally — now held in Saudi Arabia — keeps the Senegalese capital's name as a permanent homage to its origins.",
  258:"Douala is Cameroon's economic hub and Central Africa's largest port. The makossa music genre born here influenced Michael Jackson's 'Wanna Be Startin' Somethin''.",
  259:"Yaoundé is built on seven hills — just like Rome and Lisbon. It's known for its French colonial architecture and one of Central Africa's most animated central markets.",
  260:"Addis Ababa is the African Union's headquarters — the continent's diplomatic capital. It's also the legendary birthplace of arabica coffee: a local shepherd first noticed his goats' energy after eating coffee cherries.",
  261:"Dar es Salaam means 'Haven of Peace' in Arabic. The city is the starting point for Zanzibar Island and Kilimanjaro — both accessible within a few hours.",
  262:"Kampala is built on seven hills — like Rome — and has one of the world's youngest urban populations, with a median age of just 15 years.",
  263:"Kigali is often called Africa's cleanest city (plastic bags banned since 2008, monthly community clean-ups mandatory). It's become a tech hub 30 years after the 1994 genocide.",
  264:"Lusaka is one of Africa's fastest-growing capitals. Nearby Victoria Falls — the world's widest waterfall (1.7km) — is just 500km away.",
  265:"Harare experienced the world's most severe modern hyperinflation — in 2008, a 100-trillion Zimbabwean dollar banknote was worth less than one US dollar.",
  266:"Maputo has a remarkable iron market designed by Eiffel (same engineer as the Eiffel Tower). The city is famous for its stunning sunsets over Maputo Bay.",
  267:"Madagascar is so isolated that 90% of its species are found nowhere else on Earth. Lemurs exist only here. Antananarivo ('Tana') is built on 12 sacred hills.",
  268:"Lomé is the only African capital directly bordering the Atlantic Ocean — a beach is just metres from the presidential palace. Its Grand Market houses the world's largest voodoo fetish market.",
  269:"Cotonou is the birthplace of voodoo, which spread to the Caribbean via the slave trade. Benin was the first African country to organise a peaceful democratic transition (1991).",
  270:"Niamey is one of the world's capitals closest to the Sahara Desert. Niger is projected to become Earth's hottest country — Niamey regularly records temperatures of 48°C.",
  271:"Bamako is the world capital of Mandingue music — griots here perpetuate a 700-year-old oral musical tradition still performed at weddings and ceremonies.",
  272:"Ouagadougou ('Ouaga') hosts FESPACO — Africa's largest film festival. The city's name means 'you are welcome among us, you who are not just passing through' in Mooré language.",
  273:"Conakry is built on a peninsula pointing toward the Atlantic. Guinea holds 40% of the world's bauxite (aluminium ore) reserves — potentially one of Africa's richest countries.",
  274:"Freetown was founded in 1792 for freed slaves and Black loyalists from the American Revolution. Its very name symbolises this unique history of liberation.",
  275:"Monrovia is in Liberia — Africa's only country founded by freed American slaves. Liberia was never colonised and its flag closely resembles the US Stars and Stripes.",
  276:"Abuja was built from scratch in the 1980s to replace Lagos — too overcrowded to govern. It's geometrically planned around Aso Rock, a giant granite formation dominating the skyline.",
  277:"Kano is one of sub-Saharan Africa's oldest cities (emirate since the 11th century). Its 500-year-old indigo dyeing pits in the old city are still actively used today.",
  278:"Ibadan was once sub-Saharan Africa's largest city before Lagos overtook it. It houses Nigeria's first university (1948) and remains the country's intellectual heartland.",
  279:"Libreville was founded in 1849 for freed slaves — hence its name ('free city'). Gabon is one of the world's most forested countries with 88% tropical forest cover.",
  280:"Brazzaville is the only capital facing another foreign capital just 4km away — Kinshasa (DRC). A ferry connects them in 20 minutes across two entirely separate countries.",
  281:"Kinshasa is Africa's 3rd largest city and may become the world's largest megacity by 2100 (83M inhabitants predicted by the UN). Soukous music born here shaped all modern African music.",
  282:"Luanda was once the world's most expensive expat city ($10 beers, $20 apples). Fuelled by oil wealth, it mixes ultra-modern towers with vast shanty towns in a striking contrast.",
  283:"Windhoek is one of Africa's cleanest and best-managed capitals. Namibia was the world's first country to enshrine environmental protection directly into its national constitution.",
  284:"Gaborone is in Botswana, which went from the world's poorest country to middle-income status in just 30 years — thanks to diamonds. Botswana produces 25% of the world's diamonds.",
  285:"Lilongwe is one of Africa's greenest capitals, surrounded by forests. Malawi is nicknamed the 'Warm Heart of Africa' for its inhabitants' legendary friendliness towards foreigners.",
  286:"Moroni (Comoros) is the world capital of ylang-ylang — the flower used in luxury perfumes including Chanel N°5. The Comoros is one of the world's least visited countries.",
  287:"Djibouti is one of Earth's hottest places. Its Lake Assal is Africa's lowest point (155m below sea level). Ten different countries maintain military bases in this strategic city.",
  288:"Mogadishu was founded in the 9th century by Arab and Persian merchants. Since 2012 it has seen remarkable reconstruction with new hotels, restaurants and a reborn vibrant music scene.",
  289:"Asmara is nicknamed 'Little Rome' for its 1930s Art Deco architecture — the world's best preserved outside Europe. UNESCO listed it in 2017, making it one of the least-known UNESCO cities.",
  290:"Khartoum sits at the confluence of the Blue and White Nile rivers. Its name means 'elephant's trunk' in Arabic — the shape of the peninsula formed by the two converging rivers.",
  291:"Tunis is one of the Mediterranean's most affordable major cities. Just a few km from downtown lies Carthage — ancient rival of Rome — with UNESCO-listed ruins that almost changed world history.",
  292:"Algiers, 'Algiers the White', shimmers over the Mediterranean. Its UNESCO-listed Casbah medieval labyrinth inspired many films and novels over the decades.",
  293:"Casablanca houses the Hassan II Mosque — the world's 2nd largest (210m minaret visible at sea). Despite the famous Bogart film, not one scene was actually shot in Morocco.",
  294:"Rabat is Morocco's capital but its 4th most populous city. The Mohammed V Mausoleum is guarded 24/7 by soldiers in white djellabas mounted on white horses — a spectacular honour guard.",
  295:"Marrakech's Jemaa el-Fna square is the world's only marketplace with UNESCO Intangible Heritage status. By night it becomes a giant open-air theatre of storytellers and musicians.",
  296:"Tripoli was founded by the Phoenicians in the 7th century BC. Its Ottoman old city still sells traditional Libyan crafts almost unchanged for centuries.",
  297:"N'Djamena: Lake Chad nearby has shrunk 90% in 50 years — from 25,000 to 2,500km² — one of the world's most dramatic climate change catastrophes witnessed in a single lifetime.",
  298:"Bangui is crossed by the Ubangi river (5km wide), natural border with DRC. The Central African Republic holds vast untapped resources: diamonds, uranium and precious hardwoods.",
  299:"Malabo is an island capital in the Gulf of Guinea. Equatorial Guinea became one of Africa's richest per-capita nations thanks to oil — but also one of the continent's most unequal.",
  300:"São Tomé and Príncipe is Africa's 2nd smallest country, located exactly on the equator. It was the world's first cocoa plantation — exporting chocolate to Europe since the 16th century.",
  301:"Melbourne topped The Economist's 'World's Most Livable City' ranking for 7 consecutive years. It's the world's specialty coffee capital — its baristas invented the flat white.",
  302:"Brisbane will host the 2032 Olympic Games. The city has completely transformed its river banks over 20 years and is the gateway to the Gold Coast and Great Barrier Reef.",
  303:"Perth is the world's most isolated city — 2,700km from the next major Australian city — and is closer to Singapore than to Sydney. This isolation has earned it consistently high quality-of-life rankings.",
  304:"Adelaide is the 'City of Festivals', hosting the Southern Hemisphere's largest arts festival (Adelaide Fringe: 7,000 shows in 4 weeks). The Barossa Valley wine region is 60km away.",
  305:"Canberra was purpose-built after Sydney and Melbourne refused to cede capital status to each other. American architect Walter Burley Griffin designed it in 1913 after winning an international competition.",
  306:"Darwin is Australia's closest capital to Asia and its most northerly city. Cyclone Tracy (1974) completely destroyed it — triggering Australia's largest-ever evacuation — and it was rebuilt in just 2 years.",
  307:"Hobart is Australia's 2nd oldest and coldest city. Its MONA museum (Museum of Old and New Art) — built underground in caves — transformed Tasmania into a global artistic destination.",
  308:"Gold Coast is Australia's surfing capital: 57km of beaches and 600+ registered professional surfers. It hosts the Quiksilver Pro annual world surfing championship event.",
  309:"Auckland is built on 50 dormant volcanoes (last erupted 600 years ago). It's the America's Cup sailing capital and home to one-third of New Zealand's entire population.",
  310:"Wellington is the world's windiest capital ('Windy Welly') and the global fantasy film capital — all Lord of the Rings and Hobbit films were made at Weta Workshop studios here.",
  311:"Christchurch's 2011 earthquake (magnitude 6.3, 185 deaths) prompted a creative urban rebuild, including a cardboard cathedral that became a global architectural icon.",
  312:"Queenstown is the world's bungee jumping capital — the first commercial jump happened here in 1988 from the Kawarau Bridge. Its scenery inspired the Lord of the Rings landscapes.",
  313:"Suva is Oceania's rainiest capital (3,000mm/year). Fiji has 333 islands, 110 inhabited. The kava traditional drink is consumed at every official ceremony and social gathering.",
  314:"Nadi is Fiji's tourist hub. 38% of Fijians have Indian origins — descendants of workers brought by the British in the 19th century. Hindu temples are found throughout the region.",
  315:"Papua New Guinea speaks 839 languages for 9M people — the world's most linguistically diverse country. Port Moresby has unique wildlife including the cassowary, capable of killing a person with one kick.",
  316:"Dili overlooks a pristine turquoise bay with some of the world's best-preserved coral reefs, almost unknown to mass tourism. East Timor is Asia's youngest nation (independence 2002).",
  317:"Honiara is built on the beaches of the WWII Battle of Guadalcanal (1942–43). The surrounding waters house dozens of warship wrecks — a paradise for technical divers.",
  318:"Vanuatu is regularly ranked as one of the world's happiest countries despite low GDP. Its 83 islands have 113 different languages spoken by just 300,000 people.",
  319:"Samoa skipped an entire day (Friday Dec 29, 2011) when it moved to the other side of the international date line — an economic decision to align with Australia and New Zealand.",
  320:"Pago Pago has one of the South Pacific's deepest natural harbours. American Samoa is the only US territory located south of the equator.",
  321:"Nuku'alofa is the capital of the South Pacific's only remaining absolute monarchy — Tonga was never colonised. Tonga produces more professional rugby league players per capita than any nation.",
  322:"Kiribati (Tarawa) will be the first country to disappear due to climate change — its islands don't exceed 3m in altitude. The government has already bought land in Fiji for the future evacuation of its 120,000 citizens.",
  323:"Tuvalu (Funafuti) is the world's 4th smallest country (26km² of land). It's partly financing its climate relocation using revenue from selling its '.tv' internet domain to television channels worldwide.",
  324:"Nauru (Yaren) — its phosphate wealth gave it the world's highest GDP per capita in the 1970s. When the mine ran out, it lost everything within 20 years: one of history's most dramatic national rise-and-falls.",
  325:"Micronesia's 607 islands are scattered across 2.7M km² of ocean. Yap Island still uses giant circular stone discs — up to 4m in diameter — as traditional currency (Rai stones).",
  326:"The Marshall Islands' Bikini Atoll gave its name to the swimsuit after US nuclear tests (1946–58). Bikini Atoll residents were displaced and cannot return home 70 years later due to radioactive contamination.",
  327:"Palau's waters contain the world's first national marine sanctuary (commercial fishing entirely prohibited). Its Jellyfish Lake — with millions of harmless jellyfish — is ranked among the top 10 dive experiences globally.",
  328:"Melekeok became Palau's capital only in 2006, built from scratch on a near-uninhabited island. It has just 400 permanent residents — one of the world's newest and smallest capital cities.",
  329:"Guam is a US territory 13,000km from Washington D.C. — the westernmost US city. The indigenous Chamorro people's traditional navigation uses stars as a natural GPS system across open ocean.",
  330:"Saipan was the site of a decisive 1944 Pacific battle. Its 'Suicide Cliff' — where thousands of Japanese civilians jumped — remains a haunting memorial. The island is surrounded by crystal-clear turquoise waters.",
  331:"Papeete is the gateway to Bora Bora and Moorea. Tahitian black pearls are the world's only naturally black ones. Paul Gauguin spent his final years painting his most famous works on this island.",
  332:"Bora Bora is regularly ranked the world's most beautiful island. Overwater bungalows above the turquoise lagoon were invented here in 1961 — a hotel innovation copied worldwide ever since.",
  333:"New Caledonia has the world's largest UNESCO-listed lagoon (24,000km²). It's the world's 3rd nickel producer — giving it one of the Pacific's highest standards of living.",
  334:"Wallis and Futuna is one of the few French territories where a customary royal kingdom officially coexists with the French Republic — three kings recognised by Paris, a unique constitutional arrangement.",
  335:"Mayotte's lagoon is one of the world's largest and houses dugongs — the 'sea sirens' of the Indian Ocean. Between 40–50% of its population was born abroad.",
  336:"Réunion's Piton de la Fournaise is one of the world's most active volcanoes (erupts every 9 months on average). Its maloya music — born from slave resistance — is UNESCO Intangible Heritage.",
  337:"The dodo lived only in Mauritius — and went extinct just 100 years after Dutch discovery (1681). Mauritius now has one of Africa's highest GDPs per capita.",
  338:"Victoria (Seychelles) is the world's smallest capital (26,000 people). The Seychelles' granitic islands are the only mid-ocean continental granite islands on Earth — remnants of the ancient Gondwana supercontinent.",
  339:"Cairns is the gateway to the Great Barrier Reef (Earth's largest living structure, visible from space) and the Daintree Rainforest — the world's oldest tropical forest at 135 million years old.",
  340:"Alice Springs is at the heart of the Australian Outback, 1,500km from the nearest coast. Just 40km away lies Uluru (Ayers Rock) — Australia's most sacred and iconic natural landmark at 348m high.",
  341:"Broome's 'Staircase to the Moon' — where moonlight creates a golden staircase on tidal mudflats — is one of Australia's most photographed natural phenomena. The city is also the South Sea pearl capital.",
  342:"Byron Bay is Australia's easternmost point and the world capital of bohemian surf culture. Chris Hemsworth (Thor) lives here. The Splendour in the Grass festival draws 35,000 people annually.",
  343:"Dunedin is nicknamed the 'Edinburgh of the Pacific' (founded by Scots in 1848). Baldwin Street is the world's steepest street. It has the only publicly accessible royal albatross colony on Earth.",
  344:"Hamilton hosts National Fieldays — the Southern Hemisphere's largest agricultural show (100,000 visitors in 4 days). It sits in the heart of New Zealand's Waikato region, sacred Maori land.",
  345:"Rotorua's geothermal activity means the city smells of sulphur and geysers erupt in public parks. It's the heart of Maori culture in New Zealand — nightly haka performances and hangi (earth oven feasts) are offered.",
  346:"Nuku'alofa: King Taufa'ahau Tupou IV was once listed in the Guinness Book as the world's heaviest man (209kg). Tonga is where the sun rises first every day, due to its position just west of the date line.",
  347:"New Caledonia's Kanak culture features traditional great houses built with 10m coconut-wood poles. The island is ringed by the world's largest enclosed coral lagoon — 24,000km², UNESCO protected.",
  348:"Whangarei is the gateway to New Zealand's Northland — its warmest and sunniest region. Surrounding kauri forests house ancient trees that can live for 2,000 years and grow to 50m in height.",
  349:"Townsville, nicknamed 'Sunny Town' (300 sunny days/year), is the gateway to Magnetic Island where wild koalas roam freely on national park hiking trails.",
  350:"Launceston is home to the Cataract Gorge — one of the world's deepest gorges in any city centre, just 15 minutes' walk from downtown. Tasmania also claims the world's purest air and water quality.",
};
const FACTS_ES={
  1:"París tiene 470 km de catacumbas con 6 millones de esqueletos. La Torre Eiffel crece 15 cm en verano por expansión térmica del metal.",
  2:"'Big Ben' designa solo la campana, no la torre. Londres tiene más cámaras CCTV per cápita que cualquier ciudad occidental.",
  3:"Madrid es la única capital europea sin río navegable. Su restaurante Sobrino de Botín lleva abierto desde 1725, récord mundial.",
  4:"Los trenes de Tokio tienen el menor retraso medio del mundo (18 segundos). La ciudad tiene más estrellas Michelin que París, Londres y Nueva York juntos.",
  5:"Berlín tiene más puentes que Venecia (960 vs 400) y más museos per cápita que cualquier ciudad del mundo (más de 170).",
  6:"Lisboa es 400 años más antigua que Roma. Su icónico Tranvía 28, lanzado en 1901, sigue usando los vagones originales.",
  7:"En Praga la cerveza es más barata que el agua embotellada. Su reloj astronómico de 1410 es el más antiguo del mundo aún en funcionamiento.",
  8:"La Fontana de Trevi de Roma recauda 1,5 millones de euros en monedas al año, donados a la caridad. La ciudad tiene más obeliscos que Egipto.",
  9:"Estocolmo está construida sobre 14 islas. Su metro es la galería de arte más larga del mundo, con cada estación decorada de forma única.",
  10:"Seúl tiene la internet más rápida del mundo. Es la única ciudad donde en la misma calle puedes operarte, comer las 24h y jugar en cibercafés.",
  11:"Buenos Aires tiene más psicoanalistas per cápita que cualquier ciudad del mundo. La Avenida 9 de Julio es la más ancha del planeta con 16 carriles.",
  12:"La Ópera de Sídney tardó 14 años en lugar de 4, costando 14 veces el presupuesto. Sus azulejos del techo son autolimpiables gracias a un esmalte especial.",
  13:"Ciudad de México se hunde 9 cm al año en un lago azteca drenado. Aun así tiene más museos que casi cualquier ciudad del mundo.",
  14:"Montreal tiene una ciudad subterránea de 33 km usada por 500.000 personas al día en invierno para evitar los -30°C.",
  15:"El Cairo alberga la única maravilla antigua del mundo aún en pie: la Gran Pirámide de Guiza, construida hace 4.500 años.",
  16:"Santiago es una de las pocas capitales donde puedes esquiar en los Andes por la mañana y relajarte en una playa del Pacífico por la tarde.",
  17:"Ámsterdam tiene más bicicletas que personas (880K vs 800K). Las casas se inclinan hacia adelante deliberadamente para izar muebles por poleas.",
  18:"El Eixample de Barcelona tiene esquinas achaflanadas únicas en el mundo. La Sagrada Família, en construcción desde 1882, se terminará en 2026.",
  19:"Viena inventó la cultura del café, reconocida por la UNESCO. También tiene el zoológico más antiguo del mundo, abierto desde 1752.",
  20:"Budapest son dos ciudades (Buda+Pest) unidas por puentes. Tiene el metro más antiguo de Europa continental (1896) y más balnearios que cualquier capital.",
  21:"Varsovia fue destruida en un 85% en la IIGM. Su casco antiguo fue reconstruido tan fielmente a partir de pinturas que la UNESCO lo declaró Patrimonio Mundial.",
  22:"Dublín es la capital europea más joven por edad media. Inventó la Guinness (1759) y Halloween, del festival celta Samhain.",
  23:"Copenhague encabeza los rankings mundiales de felicidad. Su concepto de 'hygge' (acogimiento acogedor) nació aquí.",
  24:"Oslo es la ciudad más cara de Europa, pero Noruega da más ayuda exterior per cápita que ningún otro país. Aquí se conservan los mejores barcos vikingos.",
  25:"Helsinki es la única capital desde donde el palacio presidencial, la catedral, el mercado y el puerto son visibles desde un mismo punto.",
  26:"Bruselas alberga la OTAN y la UE — capital política de facto del mundo occidental. También es la capital mundial del cómic (Tintín, los Pitufos).",
  27:"Zúrich lidera constantemente los rankings de calidad de vida. Su agua del grifo viene directamente de los Alpes y es potable en cualquier fuente pública.",
  28:"Atenas lleva habitada 7.000 años — la ciudad más antigua de Europa. Las columnas del Partenón son ligeramente curvas para corregir una ilusión óptica.",
  29:"Estambul es la única ciudad del mundo en dos continentes. Su Gran Bazar tiene más de 4.000 tiendas y lleva abierto desde 1455.",
  30:"Sevilla es la ciudad grande más calurosa de Europa (45°C en verano), cuna del flamenco y las tapas, y único puerto interior de España.",
  31:"Cracovia fue la única gran ciudad polaca no destruida en la IIGM. Su barrio judío Kazimierz inspiró La Lista de Schindler.",
  32:"Oporto dio nombre al vino de Oporto. Sus icónicos azulejos azules y blancos cubren desde estaciones de tren hasta fachadas de iglesias.",
  33:"Valencia inventó la paella — originalmente con conejo y pollo, no marisco. Su festival Las Fallas quema monumentos gigantes a medianoche.",
  34:"Riga tiene el mayor distrito Art Nouveau del mundo: un tercio de los edificios del centro fueron construidos en este estilo entre 1896 y 1913.",
  35:"Tallin es una de las ciudades medievales mejor conservadas de Europa. Estonia fue la primera república soviética en declarar la independencia (1991).",
  36:"Vilna tiene el casco antiguo barroco más grande del norte de Europa. Su microrrepública Užupis declaró la independencia el Día de los Inocentes de 1997.",
  37:"Ljubljana es la capital más verde de Europa (550 m² de zona verde por persona). Su centro es completamente libre de coches.",
  38:"Bratislava es la única capital del mundo que limita simultáneamente con otros dos países: Austria y Hungría.",
  39:"Reikiavik es la capital más septentrional del mundo y funciona con energía 100% renovable. Las auroras boreales son visibles desde el centro.",
  40:"Singapur pasó del tercer al primer mundo en una sola generación (1965-2000). Es la ciudad de rascacielos más verde del mundo.",
  41:"Bangkok tiene el nombre oficial de ciudad más largo del mundo (169 caracteres en tailandés). Sus famosos tuk-tuks son ahora eléctricos.",
  42:"Dubái pasó de aldea pesquera a ciudad más futurista del mundo en 50 años. El Burj Khalifa te permite ver el atardecer dos veces en una noche.",
  43:"Nairobi es la única capital del mundo con un parque nacional dentro de sus límites — se pueden ver leones con rascacielos de fondo.",
  44:"Bogotá cierra 121 km de calles cada domingo para la Ciclovía — la mayor pista ciclista temporal semanal del mundo.",
  45:"Lima es la capital gastronómica de América del Sur, con más restaurantes per cápita que París. El ceviche peruano es Patrimonio Inmaterial de la UNESCO.",
  46:"Lagos es la mayor ciudad de África y la capital de los millonarios del África subsahariana. El Afrobeats, nacido aquí, domina las listas musicales mundiales.",
  47:"Nueva York tiene más de 800 idiomas — la mayor diversidad lingüística del mundo. Su metro es el único que funciona 24/7 los 365 días del año.",
  48:"San Francisco inventó la galleta de la fortuna, el martini y el movimiento hippie. El Golden Gate fue considerado imposible de construir.",
  49:"Mumbai produce más películas que Hollywood (~1.800/año vs 600). Sus dabbawalas tienen un 99,9999% de precisión en entregas — estudiado en Harvard.",
  50:"Tel Aviv es la capital mundial de startups per cápita. Nunca duerme: playa, restaurantes y discotecas abiertos las 24h.",
  51:"Milán alberga La Última Cena de Da Vinci pintada en una pared (meses de espera para reservar). Celebra la semana de la moda más influyente del mundo.",
  52:"Nápoles inventó la pizza margherita en 1889. Su tradición pizzera es Patrimonio Inmaterial de la UNESCO. El Vesubio domina el horizonte.",
  53:"Florencia es la cuna del Renacimiento y de la banca. Los Uffizi tienen la mayor concentración de arte renacentista del mundo.",
  54:"Venecia está sobre 118 islas con 400 puentes y sin carreteras. Durante el Acqua Alta, la Plaza de San Marcos puede quedar completamente inundada.",
  55:"Turín fue la primera capital de la Italia unificada y la capital mundial del chocolate — el gianduja (chocolate con avellana) fue inventado aquí.",
  56:"Bolonia tiene la universidad más antigua del mundo (1088) y 38 km de pórticos cubiertos declarados Patrimonio de la UNESCO.",
  57:"Lyon inventó el cine: los hermanos Lumière rodaron aquí la primera película de la historia el 28 de diciembre de 1895. Es también la capital gastronómica de Francia.",
  58:"Marsella es la ciudad más antigua de Francia (fundada en el 600 a.C. por griegos). Su bouillabaisse tiene una carta oficial que especifica la receta exacta.",
  59:"Niza fue italiana hasta 1860. Su Promenade des Anglais fue financiada en 1820 por turistas ingleses — la primera infraestructura costeada por turistas.",
  60:"Burdeos es la capital mundial del vino. Su clasificación de vinos de 1855, creada para la Feria Mundial de París, sigue usándose hoy sin cambios.",
  61:"Toulouse es la capital europea de la aeroespacial — la sede de Airbus está aquí. Apodada 'La Ciudad Rosa' por sus edificios de ladrillo rosado.",
  62:"Estrasburgo alberga el Parlamento Europeo, el Consejo de Europa y el TEDH — la capital simbólica de Europa.",
  63:"El Oktoberfest de Múnich atrae 6 millones de visitantes que consumen 7,5 millones de litros de cerveza en 16 días.",
  64:"Hamburgo es el 2º mayor puerto de Europa. Su Speicherstadt es el mayor complejo de almacenes históricos del mundo, declarado Patrimonio de la UNESCO.",
  65:"La catedral de Colonia tardó 632 años en construirse (1248-1880). La ciudad inventó el Agua de Colonia en 1709, base de todos los perfumes modernos.",
  66:"Frankfurt es la capital financiera de Europa (BCE, Bundesbank). Cuna de Goethe, también alberga la primera feria del libro del mundo (desde 1454).",
  67:"Düsseldorf es la capital de la moda y publicidad de Alemania. Tiene la mayor comunidad japonesa del mundo fuera de Asia.",
  68:"Ginebra alberga más organizaciones internacionales que Nueva York. La World Wide Web fue inventada en el CERN aquí en 1989.",
  69:"Berna tiene uno de los cascos medievales mejor conservados de Europa, en arenisca. Einstein desarrolló la relatividad aquí mientras era examinador de patentes.",
  70:"El casco antiguo y nuevo de Edimburgo son Patrimonio de la UNESCO. Su Festival Fringe es el mayor festival de artes del mundo (más de 50.000 actuaciones en agosto).",
  71:"Mánchester fue la primera ciudad industrial del mundo. Alan Turing trabajó aquí. La ciudad posiblemente inventó el fútbol moderno.",
  72:"Glasgow tiene más zona verde per cápita que cualquier ciudad del Reino Unido. La Escuela de Arte de Mackintosh es uno de los mejores edificios Art Nouveau del mundo.",
  73:"Bristol es la ciudad natal de Banksy — el misterioso artista nunca ha sido identificado oficialmente. El avión supersónico Concorde fue lanzado desde aquí.",
  74:"Rotterdam fue reconstruida tras los bombardeos de la IIGM como laboratorio de arquitectura moderna. Tiene el mayor puerto de Europa y las icónicas Casas Cubo inclinadas.",
  75:"Amberes es la capital mundial del diamante (más del 80% de los diamantes en bruto pasan por aquí). También es la capital belga de la moda.",
  76:"Brujas es una de las ciudades medievales mejor conservadas de Europa, la 'Venecia del Norte.' Todo su centro histórico está en la lista UNESCO.",
  77:"Gotemburgo inventó el concepto de sentarse al aire libre en el frío — sus ciudadanos se quedan fuera bajo mantas con bebidas calientes incluso en invierno.",
  78:"Bergen es la ciudad más lluviosa de Europa (2.250 mm/año), rodeada de 7 montañas. Sus habitantes son famosos por su optimismo a pesar del tiempo.",
  79:"Bucarest fue llamada 'La pequeña París'. Su Palacio del Parlamento es el 2º edificio más grande del mundo por volumen, tras el Pentágono.",
  80:"Sofía lleva 8.000 años habitada ininterrumpidamente — una de las ciudades más antiguas de Europa. Bajo el centro urbano brotan manantiales termales naturales.",
  81:"Zagreb tiene un Museo de Relaciones Rotas donde la gente dona objetos de romances fallidos. También tiene el funicular más corto del mundo (66 m).",
  82:"Dubrovnik es el Desembarco del Rey de Juego de Tronos. Sus murallas medievales recibían tanta afluencia que tuvieron que limitar el número de visitantes.",
  83:"En Split 3.000 personas viven dentro del Palacio Romano de Diocleciano (305 d.C.) — el único palacio romano antiguo activamente habitado del mundo.",
  84:"Belgrado ha sido destruida y reconstruida 44 veces — una de las ciudades más arrasadas de la historia. Su fortaleza domina la confluencia de dos ríos.",
  85:"Sarajevo desencadenó la IGM (asesinato de 1914), albergó los JJ.OO. de Invierno de 1984 y sufrió el sitio de capital más largo de la historia (1.425 días).",
  86:"Tirana es la capital más colorida de Europa — el alcalde-pintor Edi Rama mandó pintar todos los edificios de colores vivos.",
  87:"Skopie erigió 136 estatuas y decenas de edificios neoclásicos en solo 4 años ('Skopje 2014'). Tiene la mayor densidad de estatuas per cápita del mundo.",
  88:"El Guggenheim de Bilbao (1997) transformó tan drásticamente la ciudad que se acuñó el término 'Efecto Bilbao', usado mundialmente en urbanismo.",
  89:"La Alhambra de Granada es el monumento más visitado de España (2,7 M/año) y el mejor ejemplo de arquitectura palaciega islámica del mundo.",
  90:"La catedral La Seu de Palma (iniciada en 1229), restaurada en parte por Gaudí, es una de las mejores catedrales góticas del mundo.",
  91:"Málaga es la ciudad natal de Picasso. El Museo Picasso está a pocos pasos de donde nació. La ciudad disfruta de 320 días de sol al año.",
  92:"Luxemburgo está construida sobre dramáticos desfiladeros rocosos. Luxemburgo tiene el 2º PIB per cápita más alto del mundo.",
  93:"La Valeta es la capital más pequeña de la UE (6.000 personas), pero cada edificio dentro de sus murallas tiene importancia histórica. Construida por los Caballeros de Malta en 1566.",
  94:"Nicosia es la última capital dividida del mundo, partida desde 1974 por una Zona Tampón de la ONU que se puede cruzar a pie con pasaporte.",
  95:"Tesalónica tiene más sitios UNESCO que Atenas. También es el lugar de nacimiento de Mustafa Kemal Atatürk, fundador de la Turquía moderna.",
  96:"Gdansk es donde empezó la IIGM (1 sept. 1939) y acabó el comunismo — el sindicato Solidaridad nacido en sus astilleros en 1980 derrumbó el bloque oriental.",
  97:"Breslavia tiene más de 100 puentes sobre el Odra y más de 400 estatuas de enanos de bronce escondidas — encontrarlas todas es una tradición turística.",
  98:"Poznán es donde nació Polonia (dinastía Piast, siglo X). Cada mediodía, dos machos cabríos mecánicos salen del campanario del Ayuntamiento y se embisten 12 veces.",
  99:"Innsbruck albergó los JJ.OO. de Invierno dos veces (1964 y 1976) — un récord. Las pistas de esquí están a solo 10 minutos del centro.",
  100:"Salzburgo es el lugar de nacimiento de Mozart y el escenario de Sonrisas y Lágrimas. Su casco barroco rodeado de montañas es Patrimonio de la UNESCO.",
  101:"São Paulo es la mayor ciudad del Hemisferio Sur. Tiene la mayor comunidad japonesa fuera de Japón (más de 1 millón) y más helicópteros per cápita que Nueva York.",
  102:"El Carnaval de Río es el mayor festival del mundo (2 millones de personas al día durante 5 días). El Cristo Redentor ha sido alcanzado por rayos muchas veces.",
  103:"Brasilia fue construida en solo 41 meses (1956-60) y es Patrimonio de la UNESCO — la única ciudad del siglo XX con esa distinción. Vista desde el aire parece un avión.",
  104:"Salvador tiene la cultura africana más fuerte fuera de África (el 80% tiene ascendencia africana). La Capoeira y el Candomblé nacieron aquí.",
  105:"Fortaleza tiene 25 km de playas urbanas. Cada noche un barrio diferente celebra una 'Noche de Forró' — miles de personas bailando bajo las estrellas.",
  106:"Recife es la 'Venecia brasileña' por sus canales y puentes. Rivaliza con Río por ser el Carnaval más querido de Brasil.",
  107:"Belo Horizonte es la capital mundial del restaurante por kilo — autoservicio donde pagas por el peso de la comida elegida.",
  108:"El Teatro Amazonas de Manaos fue construido en 1896 en el corazón de la jungla amazónica y es considerado uno de los más bellos del mundo.",
  109:"Curitiba es modelo mundial de urbanismo sostenible. Su red de buses articulados fue copiada por decenas de ciudades en todo el mundo.",
  110:"Porto Alegre es la capital mundial del churrasco e inventó el presupuesto participativo municipal en 1989, ahora usado en más de 300 ciudades.",
  111:"Montevideo lidera América Latina en calidad de vida. Uruguay legalizó el cannabis y el matrimonio gay en 2013 — dos primicias mundiales en el mismo año.",
  112:"Medellín pasó de ser la ciudad más peligrosa del mundo (años 90) a una de las más innovadoras. Su teleférico urbano que conecta barrios de ladera es un modelo global.",
  113:"Cali es la capital mundial de la salsa. Cada verano, la Feria de Cali reúne a más de 3 millones de personas en 6 días de baile continuo.",
  114:"Las murallas coloniales españolas del siglo XVI de Cartagena siguen en pie. Gabriel García Márquez ambientó varias novelas aquí y está enterrado en la ciudad.",
  115:"Quito es la 2ª capital más alta del mundo (2.850 m) y fue la primera ciudad declarada Patrimonio Mundial de la UNESCO (1978).",
  116:"Guayaquil es la puerta de entrada a las Islas Galápagos y hogar del cacao Arriba, considerado uno de los mejores chocolates del mundo.",
  117:"La Paz es la sede de gobierno más alta del mundo (3.650 m). Su Mercado de las Brujas vende fetos de llama secos como ofrendas en la tradición aymara.",
  118:"Santa Cruz es la ciudad de mayor crecimiento de Bolivia, apodada 'Ciudad de los Anillos' por sus bulevares circulares concéntricos.",
  119:"Asunción (fundada en 1537) fue la base para colonizar toda la región del Río de la Plata. El guaraní es cooficial junto al español.",
  120:"Caracas está en un valle a 900 m de altitud con una primavera eterna y temperatura media de 22°C — apodada 'ciudad de la eterna primavera'.",
  121:"Georgetown es una de las pocas capitales suramericanas con inglés como idioma oficial y está construida bajo el nivel del mar, dependiendo de diques holandeses.",
  122:"Paramaribo es la única capital donde una catedral católica y una gran mezquita se enfrentan en la misma plaza pública — símbolo de coexistencia.",
  123:"Cayena es el territorio francés más cercano al ecuador. El cercano Centro Espacial de Kourou lanza cohetes Ariane — el ecuador ayuda a ahorrar combustible.",
  124:"Córdoba alberga la universidad más antigua de América del Sur (1613) y fue cuna del movimiento estudiantil de 1918 que reformó la educación latinoamericana.",
  125:"Rosario es el lugar de nacimiento de Lionel Messi y el Che Guevara — nacidos a pocas calles de distancia.",
  126:"Mendoza es la capital mundial del Malbec. Sus viñedos de altura (900 m) producen algunos de los mejores vinos tintos del mundo.",
  127:"Bariloche es la capital argentina del chocolate artesanal — más chocolaterías per cápita que en ningún otro lugar del mundo. Apodada 'la Suiza argentina'.",
  128:"Salta ('Salta la Linda') tiene una arquitectura colonial española notablemente conservada. Es el punto de partida del 'Tren a las Nubes' (4.220 m de altitud).",
  129:"Valparaíso es Patrimonio de la UNESCO por su arquitectura colorida en 42 colinas. Pablo Neruda vivió aquí y escribió inspirado por sus vistas al mar.",
  130:"Concepción es la 2ª ciudad y capital cultural de Chile — ha producido más grupos de rock chileno que cualquier otro lugar del país.",
  131:"Cusco fue la capital del Imperio Inca. Los muros incas encajaban piedras tan perfectamente — sin mortero — que sobrevivían terremotos que derribaban construcciones españolas.",
  132:"Arequipa, 'La Ciudad Blanca', está construida con sillar, piedra volcánica blanca. Muchos la consideran la verdadera capital gastronómica del Perú.",
  133:"Trujillo es la capital de la marinera, el baile nacional del Perú. Cerca está Chan Chan, la mayor ciudad de adobe precolombina del mundo (UNESCO).",
  134:"La Habana está congelada en el tiempo — miles de coches americanos de los años 50 circulan por sus calles. Su casco colonial UNESCO es uno de los mejor conservados de las Américas.",
  135:"Haití fue la primera república negra del mundo (1804), nacida de la única revolución de esclavos exitosa de la historia. Puerto Príncipe tiene una de las escenas artísticas más vibrantes del Caribe.",
  136:"Puerto Príncipe tiene una de las escenas artísticas más vibrantes del Caribe. La pintura naif haitiana está reconocida mundialmente como tradición artística única.",
  137:"Bogotá cierra 121 km de calles cada domingo para la mayor pista ciclista temporal semanal del mundo. Sus teleféricos conectan barrios de ladera.",
  138:"Florianópolis ('Floripa') es una isla con 42 playas, famosa por su excepcional calidad de vida y por atraer nómadas digitales de todo el mundo.",
  139:"Natal es la 'Cidade do Sol' (300 días de sol/año). Es el punto de Brasil más cercano a África — solo 3.000 km de Dakar.",
  140:"Maceió tiene algunas de las piscinas naturales más bellas del mundo — lagunas esmeralda formadas por arrecifes de coral en marea baja, con agua perfectamente clara.",
  141:"El mercado Ver-o-Peso de Belém es uno de los mayores mercados al aire libre del mundo, con cientos de plantas medicinales y frutas exóticas amazónicas.",
  142:"Goiânia es una de las ciudades más arboladas del mundo (60 árboles por persona). Tiene el mayor parque urbano de América Latina.",
  143:"Montevideo lidera América Latina en calidad de vida. Los uruguayos son los mayores consumidores de mate per cápita del mundo — llevan termo y calabaza a todas partes.",
  144:"Punta del Este es el 'Saint-Tropez de América del Sur'. Su famosa escultura 'La Mano' emergiendo de la arena de la playa es un icono mundial.",
  145:"Sucre es la capital constitucional de Bolivia. Por ley todos los edificios coloniales deben pintarse de blanco, ganándose el nombre 'La Ciudad Blanca'. Bolivia tiene dos capitales.",
  146:"Cochabamba ('Ciudad Jardín') tiene clima primaveral todo el año a 2.570 m. Su 'Guerra del Agua' de 2000 contra la privatización inspiró movimientos sociales mundiales.",
  147:"Barranquilla es la ciudad natal de Shakira. Su Carnaval es el 2º más grande del mundo tras Río y está declarado Patrimonio Inmaterial de la UNESCO.",
  148:"Buenaventura es el principal puerto del Pacífico colombiano y una de las ciudades más lluviosas de la Tierra (7.000 mm/año). Es la cuna de la música afrocolombiana.",
  149:"Santa Marta (fundada en 1525) es la ciudad más antigua de Colombia. Simón Bolívar murió aquí en 1830. El espectacular Parque Nacional Tayrona está a solo 30 km.",
  150:"Maracaibo es famosa por el Relámpago del Catatumbo — los relámpagos iluminan el cielo en silencio casi 300 noches al año. La NASA lo llama 'el faro natural del mundo'.",
  151:"Pekín albergó los JJ.OO. de verano (2008) e invierno (2022) — la única ciudad en hacerlo. La Ciudad Prohibida tiene 9.999 habitaciones, una menos que el número reservado para los dioses.",
  152:"Shanghái tiene el tren comercial más rápido del mundo (Maglev, 431 km/h). Construyó más rascacielos en 20 años que Nueva York en todo un siglo.",
  153:"Hong Kong tiene la mayor densidad de rascacielos del mundo (más de 9.000 torres de más de 14 pisos). Su espectáculo de luces nocturno en 44 edificios del puerto está en el Libro Guinness.",
  154:"Osaka ('Cocina de Japón') inventó el ramen instantáneo. Los locales se saludan con '¿Has comido?' El espíritu 'Kuidaore' de la ciudad significa 'come hasta caer'.",
  155:"Kioto fue salvada de las bombas atómicas porque el Secretario de Guerra de EE.UU. pasó allí su luna de miel. Tiene 1.600 templos budistas y 400 santuarios sintoístas.",
  156:"Seúl tiene la internet más rápida del mundo. Es una de las ciudades más conectadas de la Tierra — WiFi gratuito en cada metro, autobús y parque público.",
  157:"Busan celebra el BIFF, uno de los mejores festivales de cine de Asia. Tiene el único Cementerio Memorial de la ONU del mundo.",
  158:"El amortiguador de masa de 660 toneladas del Taipei 101 evita que el edificio se derrumbe en los tifones — es visible para los visitantes desde el interior.",
  159:"Nueva Delhi fue construida expresamente por los británicos (1911-1931) para reemplazar a Calcuta como capital. Su Connaught Place es un círculo perfecto inspirado en el urbanismo romano.",
  160:"Bangalore es el Silicon Valley de la India (el 35% de los profesionales de TI trabajan aquí) y la 'Ciudad Jardín' con 1.000 parques, legado del urbanismo real del siglo XIX.",
  161:"Chennai es la capital cultural del sur de la India, cuna de la música carnatik y la danza Bharatanatyam. También tiene una de las playas urbanas más largas del mundo (13 km).",
  162:"Kolkata es la única ciudad del mundo con rickshaws tirados a mano aún en uso — tradición colonial británica mantenida viva por respeto a los rickshaweros.",
  163:"Karachi genera el 42% de los ingresos fiscales totales de Pakistán. La ciudad habla 145 idiomas — una de las más diversas lingüísticamente del mundo.",
  164:"Lahore, la 'Ciudad de los Jardines', tiene el Jardín Shalimar declarado Patrimonio de la UNESCO. Sus tradiciones de música sufí reúnen millones en festivales anuales.",
  165:"Dhaka es la ciudad más densamente poblada del mundo (44.000 personas/km²) y el centro mundial de fabricación textil barata para las grandes marcas de moda.",
  166:"El valle de Katmandú tiene 7 sitios del Patrimonio Mundial de la UNESCO — la mayor concentración del mundo para un área tan pequeña. Todas las expediciones al Everest parten de aquí.",
  167:"Colombo es la capital del té de Ceilán (Sri Lanka es el 4º productor mundial). Alberga la mayor colección de gemas sin tallar del mundo.",
  168:"Islamabad fue construida desde cero en 1966. Es clasificada constantemente como la ciudad más limpia y verde de Pakistán, en completo contraste con el caótico Karachi.",
  169:"Kabul está a 1.800 m de altitud. A pesar de décadas de conflicto, su mercado de antigüedades tiene objetos de las épocas griega, mongola y mogol conviviendo en el mismo lugar.",
  170:"Teherán está rodeada por los montes Alborz — puedes esquiar a menos de 30 minutos del centro. La capital iraní tiene 5 estaciones de esquí accesibles en metro.",
  171:"Bagdad fue la ciudad más grande del mundo en el siglo IX (1 millón de habitantes, cuando París tenía 20.000). Su Casa de la Sabiduría fue el mayor centro intelectual de la época.",
  172:"Riad planea construir 'The Line' — una megaestructura lineal de 170 km de largo y 500 m de alto para 9 millones de personas, sin coches y con energía 100% renovable.",
  173:"Doha acogió el Mundial FIFA 2022 — el primero en invierno y en un país árabe. Qatar gastó más en aire acondicionado de estadios que la energía anual total de algunos países.",
  174:"La Torre Kuwait de Ciudad de Kuwait almacena agua de mar desalinizada en una obra maestra islámica modernista (1979). Kuwait tiene más petróleo per cápita que ningún otro país.",
  175:"Manila es la ciudad más densamente poblada del mundo (111.000 personas/km² en algunos distritos). Los filipinos fueron apodados 'la nación del SMS' — los mayores usuarios per cápita del mundo.",
  176:"Las Torres Petronas de Kuala Lumpur fueron las más altas del mundo (1998-2004). La pasarela en el piso 41 entre las dos torres es el atractivo más fotografiado del Sudeste Asiático.",
  177:"Yakarta se hunde literalmente — el norte de la ciudad baja 25 cm/año por bombeo de aguas subterráneas. Indonesia traslada toda su capital a Nusantara en la isla de Borneo.",
  178:"Bali es la única isla de Indonesia con mayoría hindú (el 87% de Indonesia es musulmán). Cada familia balinesa tiene un templo privado. El Nyepi cierra toda la isla durante 24 horas.",
  179:"Ciudad Ho Chi Minh tiene más de 9 millones de motos — una por habitante. Cruzar la calle entre el tráfico de scooters se considera un arte que requiere años de práctica.",
  180:"Hanói fue fundada en 1010 — una de las capitales más antiguas del Sudeste Asiático. Sus 36 calles del barrio antiguo llevan aún el nombre del gremio que allí se practicaba.",
  181:"Phnom Penh fue deliberadamente vaciada de todos sus habitantes por los Jemeres Rojos en 1975 — una de las únicas capitales intencionalmente despobladas de la historia.",
  182:"Vientián es la capital más tranquila del Sudeste Asiático — apodada 'la capital que no estresa.' Los bares cierran a medianoche y se oyen ranas desde el centro.",
  183:"La Pagoda Shwedagon de Yangón está cubierta con 60 toneladas de oro puro y coronada por un diamante de 76 quilates. La tradición data su construcción hace 2.600 años.",
  184:"Naipidó fue construida en secreto por la junta militar de Myanmar en 2005. Su autopista de 20 carriles está casi completamente vacía — una capital fantasma construida por diseño.",
  185:"Chengdu es la capital mundial del panda gigante. Sus habitantes son los más relajados de China — la ciudad es la capital mundial del mahjong y una civilización del té en terrazas.",
  186:"Chongqing es el mayor municipio del mundo por superficie (mayor que Austria) con 32 millones de personas. Sus 'bangbang men' suben cientos de escalones con mercancía en bambú.",
  187:"Guangzhou (Cantón) es la capital gastronómica de China — la cocina cantonesa es la más reconocida del mundo. Celebra la mayor feria comercial del mundo (Feria de Cantón) dos veces al año.",
  188:"Shenzhen era un pueblo pesquero de 30.000 personas en 1979. Hoy tiene 13 millones y es la capital mundial de la electrónica (Huawei, Tencent y DJI tienen aquí su sede).",
  189:"Xi'an es una de las ciudades más antiguas del mundo y el origen de la Ruta de la Seda. El Ejército de Terracota (8.000 soldados, enterrados en el 210 a.C.) fue descubierto en 1974 por campesinos.",
  190:"Macao genera 7 veces más ingresos del juego que Las Vegas — el único lugar de China donde el juego es legal, con uno de los mayores PIB per cápita del mundo.",
  191:"Almaty está a 900 m al pie de las montañas Tian Shan. Una estación de esquí es accesible desde el centro en solo 15 minutos — una rareza para una gran metrópoli.",
  192:"Tashkent tiene uno de los metros más bellos del mundo — cada estación está decorada como un museo con mosaicos y lámparas de araña. La ciudad fue completamente reconstruida tras el terremoto de 1966.",
  193:"Tbilisi, fundada en el siglo V (leyenda: un rey siguió a un faisán herido hacia manantiales sulfurosos), es donde empezó la tradición vinícola de 8.000 años de Georgia.",
  194:"Ereván fue fundada en el 782 a.C. — más antigua que Roma. El Monte Ararat, visible desde casi toda la ciudad, está en realidad en Turquía — un profundo dolor simbólico para los armenios.",
  195:"El nombre de Bakú significa 'ciudad azotada por los vientos' en persa. Sus Torres de Fuego — tres rascacielos con forma de llama de petróleo — se iluminan de noche.",
  196:"Ulán Bator es la capital más fría del mundo (-2°C de media anual). La mitad de Mongolia vive aquí, y muchos nómadas han trasladado sus yurtas, creando barrios de tiendas únicos.",
  197:"Pyongyang es la capital más hermética del mundo — solo unos miles de turistas escoltados entran al año. Su metro va a 100 m de profundidad — el más profundo del mundo.",
  198:"Dili da a una bahía turquesa prístina con algunos de los mejores arrecifes del mundo, casi desconocidos para el turismo masivo. Timor Oriental es el país más joven de Asia (independencia 2002).",
  199:"Astaná (Nur-Sultán) fue construida desde cero en la estepa kazaja en solo 10 años. Ha cambiado de nombre 3 veces en 30 años y tiene edificios diseñados por Norman Foster.",
  200:"Yakarta está siendo abandonada como capital de Indonesia — hundiéndose 25 cm/año, estará parcialmente bajo el agua en 2050. La nueva capital Nusantara se construye en la isla de Borneo.",
  201:"Los Ángeles es la capital mundial del cine y tiene más autopistas que ninguna otra ciudad. El tráfico es tan malo que los locales miden las distancias en minutos, nunca en kilómetros.",
  202:"Chicago inventó el rascacielos, la pizza de molde profundo y la música House. Se llama 'The Windy City' no por el viento sino por sus 'boca llena de aire' políticos del siglo XIX.",
  203:"Houston es el centro mundial de la industria espacial (el Control de Misiones de la NASA está aquí) y la ciudad más diversa lingüísticamente de EE.UU. (145 idiomas hablados).",
  204:"Miami es la única gran ciudad de EE.UU. fundada por una mujer (Julia Tuttle, 1896). Hoy, el 70% de los residentes hablan español en casa. Es el 4º centro financiero del mundo.",
  205:"Seattle es donde se fundaron Starbucks, Amazon, Microsoft y Boeing. La Space Needle debía demolerse tras la Feria Mundial de 1962.",
  206:"Boston alberga Harvard y el MIT — las dos universidades más influyentes del mundo a menos de 5 km. El Motín del Té de Boston (1773) desencadenó la Revolución Americana.",
  207:"Las principales avenidas de Washington D.C. forman un pentáculo perfecto visible desde el espacio. Todos los museos Smithsonian son gratuitos — algo único entre las grandes capitales.",
  208:"Atlanta es el lugar de nacimiento de Coca-Cola (inventada en 1886 para curar dolores de cabeza). También es sede de CNN, Delta Airlines y los Centros de Control de Enfermedades de EE.UU.",
  209:"Las Vegas consume más electricidad per cápita que ninguna otra ciudad. El Strip es uno de los pocos lugares de la Tierra visible desde el espacio de noche.",
  210:"Denver está exactamente a 1.609 m de altitud ('Mile High City') — unos asientos violetas en el estadio de los Rockies marcan la altitud exacta. Es la capital del cannabis legal de EE.UU. desde 2012.",
  211:"Portland es la capital mundial de los food trucks (más de 700) y tiene la mayor densidad de cervecerías artesanales del mundo (70). Su lema: 'Keep Portland Weird'.",
  212:"Nashville es la capital mundial de la música country — el Grand Ole Opry emite en directo desde 1925. También es el centro mundial de la industria de la música cristiana.",
  213:"Phoenix es la ciudad de mayor crecimiento de EE.UU. durante 50 años. Con 110 días por encima de los 38°C al año, está en primera línea de la adaptación al cambio climático.",
  214:"Minneapolis tiene la mayor red de pasarelas interiores del mundo (80 manzanas climatizadas para inviernos de -30°C). También es la ciudad natal de Prince.",
  215:"Nueva Orleans es la cuna del jazz (Louis Armstrong nació aquí, 1901). Construida bajo el nivel del mar, sufrió catastróficamente el huracán Katrina (2005). El Mardi Gras es el mayor festival callejero de EE.UU.",
  216:"Toronto es la ciudad más multicultural del mundo (más del 50% nació en el extranjero, representando 200 nacionalidades). La CN Tower fue la estructura más alta del mundo durante 32 años.",
  217:"Vancouver es la única gran ciudad norteamericana donde puedes esquiar por la mañana y surfear por la tarde. Tiene el 2º mayor barrio chino de América del Norte tras San Francisco.",
  218:"Calgary tiene más millonarios per cápita que ninguna otra ciudad canadiense gracias al petróleo de Alberta. El Stampede anual es el rodeo más grande del mundo (10 días, todos llevan sombrero vaquero).",
  219:"Ottawa tiene la pista de patinaje natural más larga del mundo (7,8 km en el Canal Rideau en invierno). Los Países Bajos regalan 10.000 tulipanes al año desde 1945, como agradecimiento de la IIGM.",
  220:"Ciudad de Quebec tiene murallas medievales intactas — la única ciudad norteamericana con ellas (UNESCO). Su Carnaval de Invierno incluye carreras de canoa sobre el hielo del río San Lorenzo.",
  221:"Edmonton es la 'Ciudad de los Festivales' de Canadá (más de 50 festivales al año) y alberga el mayor centro comercial de América del Norte — con parque acuático, pista de hielo y campo de golf.",
  222:"Guadalajara es el lugar de nacimiento del mariachi y el tequila — los dos símbolos culturales más reconocidos de México. También es el Silicon Valley de México (IBM e Intel tienen aquí sus centros de I+D).",
  223:"Monterrey genera el 25% del PIB industrial de México. Está rodeada por la Sierra Madre con el icónico Cerro de la Silla visible desde toda la ciudad.",
  224:"Cancún no existía en 1970 — era todo jungla. Un ordenador del gobierno mexicano seleccionó el lugar como destino turístico ideal y la ciudad fue construida desde cero.",
  225:"Oaxaca es la capital gastronómica de México: cuna del mole, el mezcal artesanal y las tlayudas. Sus celebraciones del Día de Muertos son consideradas las más espectaculares del mundo.",
  226:"Puebla inventó el chile con carne y los tacos al pastor. El 5 de mayo de 1862, las fuerzas mexicanas derrotaron aquí al ejército francés de Napoleón III — su única derrota en combate.",
  227:"Costa Rica abolió su ejército en 1948 y reinvirtió esos fondos en educación y sanidad. Su 'Pura Vida' es tanto un saludo como una filosofía de vida completa.",
  228:"Ciudad de Guatemala está sobre una meseta a 1.500 m rodeada de volcanes activos. El Pacaya expulsa coladas de lava a solo 30 km del centro. Es la ciudad más poblada de América Central.",
  229:"Tegucigalpa es una de las únicas capitales del mundo sin aeropuerto plano — los aviones deben hacer eslalon entre montañas para aterrizar en una pista corta al borde de un barranco.",
  230:"El Salvador fue el primer país del mundo en adoptar Bitcoin como moneda de curso legal (2021). San Salvador tiene la mayor densidad de restaurantes de pupusas del mundo.",
  231:"Managua es una de las únicas capitales del mundo sin un verdadero centro urbano — su núcleo histórico fue destruido por un terremoto en 1972 y nunca fue reconstruido.",
  232:"Ciudad de Panamá es el único lugar de la Tierra donde puedes ver el sol salir por el Pacífico y ponerse por el Atlántico desde la misma ciudad. El Canal redujo 15.000 km la ruta marítima de Nueva York a San Francisco.",
  233:"La Habana es una ciudad congelada en el tiempo con miles de coches americanos de los años 50 aún en circulación. Su casco colonial UNESCO es uno de los mejor conservados de las Américas.",
  234:"Kingston es la ciudad natal de Bob Marley y el lugar de nacimiento del reggae y el dancehall. Jamaica produce más campeones mundiales de atletismo per cápita que ningún otro país — incluido Usain Bolt.",
  235:"Puerto España es el lugar de nacimiento del calypso, el soca y el steel pan — instrumento de percusión inventado en los años 30 a partir de barriles de petróleo vacíos.",
  236:"San Juan es la 2ª ciudad europea más antigua de las Américas (tras Santo Domingo). Su casco antiguo azul cobalto UNESCO y sus murallas españolas dominan una impresionante bahía turquesa.",
  237:"Santo Domingo (fundada en 1496) es la primera ciudad europea de las Américas. Su Zona Colonial contiene el primer hospital, la primera universidad y la primera catedral construidos en el Nuevo Mundo.",
  238:"Los cubanos de La Habana llevan 400 años destilando ron de caña de azúcar. Las recetas del Havana Club, famosas en todo el mundo, siguen fórmulas coloniales españolas originales.",
  239:"Bridgetown es la ciudad natal de Rihanna — ha sido nombrada embajadora nacional y una calle lleva su nombre. La isla es considerada el lugar de nacimiento del ron moderno.",
  240:"Nassau es uno de los puertos de crucero más transitados del mundo (3,5 millones de pasajeros/año). En el siglo XVII era la capital mundial de la piratería — hogar de Barbanegra y Calico Jack.",
  241:"Winnipeg es el centro geográfico de Canadá y soporta el factor de enfriamiento por viento más brutal entre las grandes ciudades del mundo. Tiene el mayor número de artistas per cápita de Canadá.",
  242:"Halifax jugó un papel vital en la IIGM como principal puerto de salida de los convoyes aliados. En 1917, la colisión de un barco de municiones causó la mayor explosión artificial del mundo antes de Hiroshima.",
  243:"Victoria es apodada 'la ciudad más británica fuera del Reino Unido' por su parlamento al estilo Westminster y jardines ingleses. Los narcisos florecen allí en enero — el invierno más suave de Canadá.",
  244:"Ciudad de Belice es la puerta de entrada al Gran Agujero Azul — un sumidero submarino de 300 m de diámetro y uno de los 10 mejores sitios de buceo del mundo. Belice es el único país de América Central con inglés como idioma oficial.",
  245:"Guadalupe tiene forma de mariposa vista desde el aire. La isla produce algunos de los mejores rones agrícolas del mundo, elaborados directamente con jugo de caña fresca en lugar de melaza.",
  246:"Martinica es el lugar de nacimiento de la emperatriz Josefina (esposa de Napoleón). En 1902, el volcán Mont Pelée destruyó la ciudad de Saint-Pierre en solo 2 minutos, matando a 30.000 personas.",
  247:"Monterrey es el motor económico de México (25% del PIB industrial). Rodeada por la Sierra Madre, tiene el MARCO — uno de los mejores museos de arte contemporáneo de América Latina.",
  248:"San Diego tiene el mejor clima de cualquier ciudad de EE.UU. (266 días de sol/año, 18°C de media). Alberga la mayor base naval del mundo y el zoológico más visitado de EE.UU.",
  249:"Austin es la capital mundial de la música en directo con más de 250 salas. Celebra el SXSW — el mayor encuentro mundial de música, cine y tecnología — con 400.000 participantes cada marzo.",
  250:"Filadelfia es donde nació EE.UU. — la Declaración de Independencia fue firmada aquí en 1776. Es la capital mundial del cheesesteak. Los famosos escalones del museo de Rocky están aquí.",
  251:"Johannesburgo está construida sobre el mayor bosque urbano plantado por el hombre (10 millones de árboles). Nació del oro — un hallazgo en 1886 transformó una granja en una megaciudad en solo 10 años.",
  252:"Ciudad del Cabo es la única ciudad construida al pie de un monumento natural declarado Patrimonio de la UNESCO — la Montaña de la Mesa. Bartolomeu Días inició su circunnavegación africana desde aquí en 1488.",
  253:"Durban tiene la mayor población de origen indio fuera de la India (más de 1,2 millones) y es la capital mundial del surf en olas naturales, con agua a 22°C todo el año.",
  254:"Pretoria es apodada la 'Ciudad Jacaranda' — 70.000 jacarandas la tiñen de morado cada octubre. Sudáfrica tiene dos capitales: Pretoria (administrativa) y Ciudad del Cabo (legislativa).",
  255:"Acra es una de las capitales africanas de mayor crecimiento, conocida por sus mercados de tela kente multicolor. Su barrio Jamestown — un antiguo fuerte colonial — es ahora un vibrante centro del boxeo.",
  256:"Abiyán, la 'París del África Occidental', produce el 40% del cacao mundial. Es muy probable que cada tableta de chocolate vendida en el mundo contenga cacao de esta región.",
  257:"Dakar es el punto más occidental de África. El Rally Dakar — ahora celebrado en Arabia Saudí — conserva el nombre de la capital senegalesa como homenaje permanente a sus orígenes.",
  258:"Duala es el motor económico de Camerún y el mayor puerto de África central. El género musical makossa nacido aquí influyó en el 'Wanna Be Startin' Somethin'' de Michael Jackson.",
  259:"Yaundé está construida sobre siete colinas — igual que Roma y Lisboa. Es conocida por su arquitectura colonial francesa y uno de los mercados centrales más animados de África central.",
  260:"Adís Abeba es la sede de la Unión Africana y capital diplomática del continente. También es el legendario lugar de nacimiento del café arábica: un pastor local notó la energía de sus cabras tras comer cerezas de café.",
  261:"Dar es Salaam significa 'Puerto de la Paz' en árabe. La ciudad es el punto de partida para la Isla de Zanzíbar y el Kilimanjaro — ambos accesibles en pocas horas.",
  262:"Kampala está construida sobre siete colinas — como Roma — y tiene una de las poblaciones urbanas más jóvenes del mundo, con una edad media de solo 15 años.",
  263:"Kigali es frecuentemente la ciudad más limpia de África (bolsas de plástico prohibidas desde 2008, limpiezas comunitarias mensuales obligatorias). Es un hub tecnológico 30 años después del genocidio de 1994.",
  264:"Lusaka es una de las capitales africanas de mayor crecimiento. Las cercanas Cataratas Victoria — la cascada más ancha del mundo (1,7 km) — están a solo 500 km.",
  265:"Harare experimentó la hiperinflación moderna más severa del mundo — en 2008, un billete de 100 billones de dólares zimbabuenses valía menos de un dólar estadounidense.",
  266:"Maputo tiene un notable mercado de hierro diseñado por Eiffel (el mismo ingeniero que la Torre Eiffel). La ciudad es famosa por sus impresionantes atardeceres sobre la Bahía de Maputo.",
  267:"Madagascar está tan aislada que el 90% de sus especies no se encuentran en ningún otro lugar de la Tierra. Los lémures solo existen aquí. Antananarivo ('Tana') está construida sobre 12 colinas sagradas.",
  268:"Lomé es la única capital africana bordeada directamente por el Atlántico — una playa está a pocos metros del palacio presidencial. Su Gran Mercado alberga el mayor mercado de fetiches vudú del mundo.",
  269:"Cotonú es el lugar de nacimiento del vudú, que se extendió al Caribe a través de la trata de esclavos. Benín fue el primer país africano en organizar una transición democrática pacífica (1991).",
  270:"Niamey es una de las capitales más cercanas al desierto del Sahara. Níger está proyectado para ser el país más caluroso de la Tierra — Niamey registra regularmente temperaturas de 48°C.",
  271:"Bamako es la capital mundial de la música mandinga — los griots perpetúan aquí una tradición musical oral de 700 años de antigüedad, aún interpretada en bodas y ceremonias.",
  272:"Uagadugú ('Ouaga') celebra el FESPACO — el mayor festival de cine de África. El nombre de la ciudad significa 'eres bienvenido entre nosotros, tú que no solo estás de paso' en lengua mooré.",
  273:"Conakri está construida sobre una península que apunta hacia el Atlántico. Guinea posee el 40% de las reservas mundiales de bauxita (mineral de aluminio) — potencialmente uno de los países más ricos de África.",
  274:"Freetown fue fundada en 1792 para esclavos liberados y leales negros de la Revolución Americana. Su propio nombre simboliza esta historia única de liberación.",
  275:"Monrovia está en Liberia — el único país de África fundado por esclavos americanos liberados. Liberia nunca fue colonizada y su bandera se parece mucho a las barras y estrellas de EE.UU.",
  276:"Abuja fue construida desde cero en los años 80 para reemplazar a Lagos — demasiado superpoblada para gobernar. Está geométricamente planificada alrededor de Aso Rock, una gigante formación granítica.",
  277:"Kano es una de las ciudades más antiguas del África subsahariana (emirato desde el siglo XI). Sus fosas de tinte índigo de 500 años de antigüedad en la ciudad vieja siguen en uso activo hoy.",
  278:"Ibadán fue en su día la mayor ciudad del África subsahariana antes de que Lagos la superara. Alberga la primera universidad de Nigeria (1948) y sigue siendo el centro intelectual del país.",
  279:"Libreville fue fundada en 1849 para esclavos liberados — de ahí su nombre ('ciudad libre'). Gabón es uno de los países más boscosos del mundo con el 88% de cobertura forestal tropical.",
  280:"Brazzaville es la única capital que se enfrenta a otra capital extranjera a solo 4 km — Kinshasa (RDC). Un ferry las conecta en 20 minutos a través de dos países completamente distintos.",
  281:"Kinshasa es la 3ª mayor ciudad de África y puede convertirse en la mayor megaciudad del mundo en 2100 (83 millones de habitantes según la ONU). El soukous nacido aquí modeló toda la música africana moderna.",
  282:"Luanda fue la ciudad más cara del mundo para expatriados ($10 una cerveza, $20 una manzana). Impulsada por el petróleo, mezcla torres ultramodernas con vastos barrios marginales en un contraste impactante.",
  283:"Windhoek es una de las capitales más limpias y mejor gestionadas de África. Namibia fue el primer país del mundo en incluir directamente la protección medioambiental en su constitución nacional.",
  284:"Gaborone está en Botsuana, que pasó del país más pobre del mundo a renta media en solo 30 años gracias a los diamantes. Botsuana produce el 25% de los diamantes mundiales.",
  285:"Lilongwe es una de las capitales más verdes de África, rodeada de bosques. Malawi es apodada el 'Corazón Cálido de África' por la legendaria amabilidad de sus habitantes hacia los extranjeros.",
  286:"Moroni (Comoras) es la capital mundial del ylang-ylang — la flor utilizada en perfumes de lujo incluido el Chanel N°5. Las Comoras es uno de los países menos visitados del mundo.",
  287:"Yibuti es uno de los lugares más calurosos de la Tierra. Su lago Assal es el punto más bajo de África (155 m bajo el nivel del mar). Diez países distintos tienen bases militares en esta ciudad estratégica.",
  288:"Mogadiscio fue fundada en el siglo IX por comerciantes árabes y persas. Desde 2012 ha experimentado una notable reconstrucción con nuevos hoteles, restaurantes y una escena musical renacida.",
  289:"Asmara es apodada 'La Pequeña Roma' por su arquitectura Art Déco de los años 30 — la mejor conservada del mundo fuera de Europa. La UNESCO la incluyó en su lista en 2017.",
  290:"Jartum está en la confluencia del Nilo Azul y el Nilo Blanco. Su nombre significa 'trompa de elefante' en árabe — la forma de la península que forman los dos ríos al converger.",
  291:"Túnez es una de las grandes ciudades mediterráneas más asequibles. A pocos km del centro está Cartago — antigua rival de Roma — con ruinas UNESCO que casi cambiaron la historia del mundo.",
  292:"Argel, 'Argel la Blanca', brilla sobre el Mediterráneo. Su laberinto medieval de la Casbah, declarado Patrimonio de la UNESCO, ha inspirado numerosas películas y novelas.",
  293:"Casablanca alberga la Mezquita Hassan II — la 2ª más grande del mundo (minarete de 210 m visible desde el mar). A pesar de la famosa película de Bogart, ninguna escena fue rodada en Marruecos.",
  294:"Rabat es la capital de Marruecos pero su 4ª ciudad en población. El Mausoleo de Mohammed V está custodiado 24/7 por soldados en chilabas blancas sobre caballos blancos — una espectacular guardia de honor.",
  295:"La plaza Jemaa el-Fna de Marrakech es el único mercado del mundo con estatus de Patrimonio Inmaterial de la UNESCO. Por la noche se convierte en un gigantesco teatro al aire libre con cuentacuentos y músicos.",
  296:"Trípoli fue fundada por los fenicios en el siglo VII a.C. Su ciudad vieja otomana sigue vendiendo artesanía tradicional libia prácticamente sin cambios desde hace siglos.",
  297:"N'Djamena: el cercano lago Chad ha encogido un 90% en 50 años — de 25.000 a 2.500 km² — una de las catástrofes climáticas más dramáticas del mundo presenciadas en una sola vida.",
  298:"Bangui está atravesada por el río Ubangui (5 km de ancho), frontera natural con la RDC. La República Centroafricana posee enormes recursos sin explotar: diamantes, uranio y maderas preciosas.",
  299:"Malabo es una capital insular en el golfo de Guinea. Guinea Ecuatorial se convirtió en uno de los países más ricos de África per cápita gracias al petróleo — pero también en uno de los más desiguales.",
  300:"Santo Tomé y Príncipe es el 2º país más pequeño de África, situado exactamente en el ecuador. Fue la primera plantación de cacao del mundo — exportando chocolate a Europa desde el siglo XVI.",
  301:"Melbourne encabezó el ranking de 'Ciudad más habitable del mundo' de The Economist durante 7 años consecutivos. Es la capital mundial del café de especialidad — sus baristas inventaron el flat white.",
  302:"Brisbane acogerá los Juegos Olímpicos de 2032. La ciudad ha transformado completamente sus orillas del río en 20 años y es la puerta de entrada a Gold Coast y la Gran Barrera de Coral.",
  303:"Perth es la ciudad más aislada del mundo — a 2.700 km de la siguiente gran ciudad australiana — y está más cerca de Singapur que de Sídney. Este aislamiento le ha valido altas clasificaciones de calidad de vida.",
  304:"Adelaida es la 'Ciudad de los Festivales', con el mayor festival de artes del Hemisferio Sur (Adelaide Fringe: 7.000 espectáculos en 4 semanas). La región vinícola del valle de Barossa está a 60 km.",
  305:"Canberra fue construida expresamente después de que Sídney y Melbourne se negaran a cederse mutuamente la condición de capital. El arquitecto americano Walter Burley Griffin la diseñó en 1913.",
  306:"Darwin es la capital australiana más cercana a Asia y la más septentrional. El ciclón Tracy (1974) la destruyó completamente — desencadenando la mayor evacuación de Australia — y fue reconstruida en solo 2 años.",
  307:"Hobart es la 2ª ciudad más antigua y la más fría de Australia. Su museo MONA (Museum of Old and New Art) — construido bajo tierra en cuevas — transformó Tasmania en un destino artístico mundial.",
  308:"Gold Coast es la capital australiana del surf: 57 km de playas y más de 600 surfistas profesionales registrados. Celebra el Quiksilver Pro, una de las mangas del campeonato mundial de surf.",
  309:"Auckland está construida sobre 50 volcanes dormidos (el último entró en erupción hace 600 años). Es la capital de la Copa América de vela y alberga a un tercio de toda la población de Nueva Zelanda.",
  310:"Wellington es la capital más ventosa del mundo ('Windy Welly') y la capital mundial del cine fantástico — todas las películas de El Señor de los Anillos y El Hobbit fueron hechas en los estudios Weta Workshop aquí.",
  311:"El terremoto de Christchurch de 2011 (magnitud 6,3, 185 muertos) impulsó una creativa reconstrucción urbana, incluida una catedral de cartón que se convirtió en icono arquitectónico mundial.",
  312:"Queenstown es la capital mundial del puenting — el primer salto comercial tuvo lugar aquí en 1988 desde el Puente Kawarau. Su paisaje inspiró los paisajes de El Señor de los Anillos.",
  313:"Suva es la capital más lluviosa de Oceanía (3.000 mm/año). Fiyi tiene 333 islas, 110 habitadas. La bebida tradicional kava se consume en cada ceremonia oficial y reunión social.",
  314:"Nadi es el centro turístico de Fiyi. El 38% de los fiyianos tiene orígenes indios — descendientes de trabajadores traídos por los británicos en el siglo XIX. Los templos hindúes abundan por toda la región.",
  315:"Papúa Nueva Guinea habla 839 idiomas para 9 millones de personas — el país lingüísticamente más diverso del mundo. Port Moresby tiene fauna única como el casuario, capaz de matar a una persona de una patada.",
  316:"Dili da a una bahía turquesa prístina con algunos de los mejores arrecifes coralinos del mundo, casi desconocidos para el turismo masivo. Timor Oriental es el país más joven de Asia (independencia 2002).",
  317:"Honiara está construida en las playas de la Batalla de Guadalcanal (IIGM, 1942-43). Las aguas circundantes albergan decenas de pecios de barcos de guerra — un paraíso para los buceadores técnicos.",
  318:"Vanuatu es clasificado regularmente como uno de los países más felices del mundo a pesar de su bajo PIB. Sus 83 islas tienen 113 idiomas diferentes hablados por solo 300.000 personas.",
  319:"Samoa se saltó un día entero (viernes 29 dic. 2011) al pasar al otro lado de la línea de cambio de fecha — una decisión económica para alinearse con Australia y Nueva Zelanda.",
  320:"Pago Pago tiene uno de los puertos naturales más profundos del Pacífico Sur. La Samoa americana es el único territorio de EE.UU. situado al sur del ecuador.",
  321:"Nukualofa es la capital de la única monarquía absoluta restante del Pacífico Sur — Tonga nunca fue colonizada. Tonga produce más jugadores profesionales de rugby a XIII per cápita que ninguna nación.",
  322:"Kiribati (Tarawa) será el primer país en desaparecer por el cambio climático — sus islas no superan los 3 m de altitud. El gobierno ya compró tierras en Fiyi para la futura evacuación de sus 120.000 ciudadanos.",
  323:"Tuvalu (Funafuti) es el 4º país más pequeño del mundo (26 km² de tierra). Financia parte de su reubicación climática con ingresos de la venta de su dominio de internet '.tv' a cadenas de televisión.",
  324:"Nauru (Yaren) — su riqueza en fosfatos le dio el mayor PIB per cápita del mundo en los años 70. Cuando se agotó la mina, lo perdió todo en 20 años: uno de los ascensos y caídas nacionales más dramáticos.",
  325:"La Micronesia tiene 607 islas esparcidas en 2,7 millones de km² de océano. La isla de Yap usa aún enormes discos de piedra circulares — hasta 4 m de diámetro — como moneda tradicional (piedras Rai).",
  326:"El atolón de Bikini de las Islas Marshall dio nombre al bañador tras los ensayos nucleares de EE.UU. (1946-58). Sus habitantes fueron desplazados y no pueden regresar 70 años después por contaminación radiactiva.",
  327:"Las aguas de Palaos albergan el primer santuario marino nacional del mundo (pesca comercial totalmente prohibida). Su Lago de las Medusas — con millones de medusas inofensivas — está entre las 10 mejores experiencias de buceo.",
  328:"Melekeok se convirtió en la capital de Palaos solo en 2006, construida desde cero en una isla casi deshabitada. Tiene apenas 400 residentes permanentes — una de las capitales más nuevas y pequeñas del mundo.",
  329:"Guam es un territorio de EE.UU. a 13.000 km de Washington D.C. — la ciudad estadounidense más occidental. La navegación tradicional del pueblo chamorro utiliza las estrellas como GPS natural en el océano abierto.",
  330:"Saipán fue escenario de una decisiva batalla del Pacífico en 1944. Su 'Acantilado del Suicidio' — donde miles de civiles japoneses se lanzaron — sigue siendo un conmovedor memorial. La rodean aguas turquesas cristalinas.",
  331:"Papeete es la puerta de entrada a Bora Bora y Moorea. Las perlas negras de Tahití son las únicas naturalmente negras del mundo. Paul Gauguin pasó sus últimos años pintando sus obras más famosas en esta isla.",
  332:"Bora Bora es clasificada regularmente como la isla más bella del mundo. Los bungalows sobre pilotis sobre la laguna turquesa fueron inventados aquí en 1961 — una innovación hotelera copiada en todo el mundo desde entonces.",
  333:"Nueva Caledonia tiene el mayor lagunar declarado Patrimonio de la UNESCO del mundo (24.000 km²). Es el 3er productor mundial de níquel — lo que le da uno de los niveles de vida más altos del Pacífico.",
  334:"Wallis y Futuna es uno de los pocos territorios franceses donde un reino real consuetudinario coexiste oficialmente con la República Francesa — tres reyes reconocidos por París, un arreglo constitucional único.",
  335:"La laguna de Mayotte es una de las más grandes del mundo y alberga dugongos — las 'sirenas del mar' del Océano Índico. Entre el 40 y el 50% de su población nació en el extranjero.",
  336:"El Piton de la Fournaise de Reunión es uno de los volcanes más activos del mundo (entra en erupción cada 9 meses de media). Su música maloya — nacida de la resistencia de los esclavos — es Patrimonio Inmaterial de la UNESCO.",
  337:"El dodo vivió solo en Mauricio — y se extinguió apenas 100 años después del descubrimiento holandés (1681). Mauricio tiene ahora uno de los PIB per cápita más altos de África.",
  338:"Victoria (Seychelles) es la capital más pequeña del mundo (26.000 personas). Las islas graníticas de las Seychelles son las únicas islas de granito continental en medio del océano — vestigios del antiguo supercontinente Gondwana.",
  339:"Cairns es la puerta de entrada a la Gran Barrera de Coral (la mayor estructura viva de la Tierra, visible desde el espacio) y la selva de Daintree — el bosque tropical más antiguo del mundo con 135 millones de años.",
  340:"Alice Springs está en el corazón del Outback australiano, a 1.500 km de la costa más cercana. A solo 40 km está Uluru (Ayers Rock) — el monumento natural más sagrado e icónico de Australia con 348 m de altura.",
  341:"La 'Escalera a la Luna' de Broome — donde la luz de la luna crea una escalera dorada en las vasijas de la marea — es uno de los fenómenos naturales más fotografiados de Australia. La ciudad también es la capital de las perlas de los Mares del Sur.",
  342:"Byron Bay es el punto más oriental de Australia y la capital mundial de la cultura surfera bohemia. Chris Hemsworth (Thor) vive aquí. El festival Splendour in the Grass atrae a 35.000 personas cada año.",
  343:"Dunedin es apodada el 'Edimburgo del Pacífico' (fundada por escoceses en 1848). La calle Baldwin es la más empinada del mundo. Tiene la única colonia de albatros reales accesible al público en la Tierra.",
  344:"Hamilton celebra el National Fieldays — la mayor exposición agrícola del Hemisferio Sur (100.000 visitantes en 4 días). Está en el corazón de la región Waikato de Nueva Zelanda, tierra sagrada maorí.",
  345:"La actividad geotérmica de Rotorua hace que la ciudad huela a azufre y que los géiseres broten en parques públicos. Es el corazón de la cultura maorí en Nueva Zelanda — con haka y hangi (festines en el horno de tierra) cada noche.",
  346:"Nukualofa: el rey Taufa'ahau Tupou IV figuró una vez en el Libro Guinness como el hombre más pesado del mundo (209 kg). Tonga es donde el sol sale primero cada día, por su posición al oeste de la línea de cambio de fecha.",
  347:"La cultura kanak de Nueva Caledonia tiene grandes casas tradicionales construidas con postes de madera de cocotero de 10 m. La isla está rodeada por el mayor lagunar de coral cerrado del mundo — 24.000 km², protegido por la UNESCO.",
  348:"Whangarei es la puerta de entrada al Northland de Nueva Zelanda — su región más cálida y soleada. Los bosques de kauri circundantes albergan árboles ancestrales que pueden vivir 2.000 años y alcanzar los 50 m de altura.",
  349:"Townsville, apodada 'Sunny Town' (300 días de sol/año), es la puerta de entrada a la isla Magnética donde los koalas salvajes deambulan libremente por los senderos del parque nacional.",
  350:"Launceston alberga la Cataract Gorge — una de las gargantas más profundas del mundo en cualquier centro urbano, a solo 15 minutos a pie del centro. Tasmania también reivindica la calidad de aire y agua más pura del mundo.",
};

const CITIES = [
  { id:1, name:"Paris", country:"France", flag:"🇫🇷", continent:"Europe", coords:"48.8566°N, 2.3522°E", funFact:"Paris possède plus de 470 km de tunnels de catacombes sous ses rues, renfermant les ossements de plus de 6 millions de personnes !", costs:{logement:1100,courses:150,restos:150,nocturne:100,transport:85,sante:60,telecom:25,voyage:180} },
  { id:2, name:"Londres", country:"Royaume-Uni", flag:"🇬🇧", continent:"Europe", coords:"51.5074°N, 0.1278°O", funFact:"Big Ben ne s'appelle pas officiellement 'Big Ben' — ce surnom désigne la cloche intérieure, pas la tour (qui s'appelle Elizabeth Tower).", costs:{logement:1400,courses:178,restos:178,nocturne:140,transport:160,sante:70,telecom:30,voyage:220} },
  { id:3, name:"Madrid", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"40.4168°N, 3.7038°O", funFact:"Madrid est la seule capitale européenne sans fleuve navigable — le Manzanares est si petit qu'on l'a surnommé 'le ruisseau apprivoisé'.", costs:{logement:850,courses:122,restos:111,nocturne:90,transport:55,sante:45,telecom:20,voyage:150} },
  { id:4, name:"Tokyo", country:"Japon", flag:"🇯🇵", continent:"Asie", coords:"35.6762°N, 139.6503°E", funFact:"Tokyo possède le réseau ferroviaire le plus ponctuel au monde : un retard moyen de 18 secondes déclenche des excuses officielles !", costs:{logement:950,courses:164,restos:158,nocturne:110,transport:95,sante:55,telecom:35,voyage:300} },
  { id:5, name:"Berlin", country:"Allemagne", flag:"🇩🇪", continent:"Europe", coords:"52.5200°N, 13.4050°E", funFact:"Berlin a plus de ponts que Venise ! La ville compte 960 ponts contre seulement 400 pour la cité des doges.", costs:{logement:900,courses:136,restos:118,nocturne:100,transport:90,sante:50,telecom:22,voyage:160} },
  { id:6, name:"Lisbonne", country:"Portugal", flag:"🇵🇹", continent:"Europe", coords:"38.7169°N, 9.1399°O", funFact:"Lisbonne est l'une des plus vieilles capitales d'Europe, plus ancienne que Rome ! Les Phéniciens l'ont fondée vers 1200 avant J.-C.", costs:{logement:750,courses:112,restos:95,nocturne:70,transport:40,sante:40,telecom:18,voyage:140} },
  { id:7, name:"Prague", country:"Tchéquie", flag:"🇨🇿", continent:"Europe", coords:"50.0755°N, 14.4378°E", funFact:"Prague est la ville où la bière est moins chère que l'eau minérale en bouteille dans la plupart des restaurants !", costs:{logement:600,courses:94,restos:71,nocturne:60,transport:30,sante:35,telecom:15,voyage:120} },
  { id:8, name:"Rome", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"41.9028°N, 12.4964°E", funFact:"La Fontaine de Trevi génère environ 1,5 million d'euros de pièces par an — le tout reversé à une association caritative !", costs:{logement:850,courses:131,restos:126,nocturne:80,transport:40,sante:50,telecom:20,voyage:170} },
  { id:9, name:"Stockholm", country:"Suède", flag:"🇸🇪", continent:"Europe", coords:"59.3293°N, 18.0686°E", funFact:"Stockholm est construite sur 14 îles. Sa station de métro Kungsträdgården ressemble à une véritable grotte rocheuse peinte en rouge.", costs:{logement:1050,courses:169,restos:166,nocturne:130,transport:100,sante:55,telecom:28,voyage:190} },
  { id:10, name:"Séoul", country:"Corée du Sud", flag:"🇰🇷", continent:"Asie", coords:"37.5665°N, 126.9780°E", funFact:"Séoul a la connexion Internet la plus rapide au monde — la K-pop se télécharge à la vitesse de la lumière !", costs:{logement:800,courses:141,restos:111,nocturne:90,transport:50,sante:60,telecom:30,voyage:280} },
  { id:11, name:"Buenos Aires", country:"Argentine", flag:"🇦🇷", continent:"Amérique du Sud", coords:"34.6037°S, 58.3816°O", funFact:"Buenos Aires est surnommée 'Le Paris de l'Amérique du Sud' et abrite le plus grand théâtre lyrique du monde, le Teatro Colón.", costs:{logement:400,courses:84,restos:59,nocturne:50,transport:20,sante:30,telecom:12,voyage:200} },
  { id:12, name:"Sydney", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"33.8688°S, 151.2093°E", funFact:"L'Opéra de Sydney a pris 14 ans à construire (au lieu des 4 prévus) et a coûté 102 millions de dollars — soit 14 fois le budget initial !", costs:{logement:1300,courses:173,restos:166,nocturne:120,transport:120,sante:80,telecom:40,voyage:350} },
  { id:13, name:"Mexico City", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"19.4326°N, 99.1332°O", funFact:"Mexico City s'enfonce dans le sol à raison de 9 cm par an — la ville est construite sur un ancien lac aztèque qui se vide progressivement.", costs:{logement:500,courses:103,restos:71,nocturne:65,transport:25,sante:35,telecom:15,voyage:160} },
  { id:14, name:"Montréal", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"45.5017°N, 73.5673°O", funFact:"Montréal possède une 'ville souterraine' de 33 km de tunnels climatisés reliant 80 immeubles — parfait pour survivre aux hivers à -30 °C !", costs:{logement:950,courses:159,restos:138,nocturne:95,transport:90,sante:65,telecom:45,voyage:220} },
  { id:15, name:"Le Caire", country:"Égypte", flag:"🇪🇬", continent:"Afrique", coords:"30.0444°N, 31.2357°E", funFact:"Le Caire est la plus grande ville d'Afrique avec 22 millions d'habitants. Les pyramides de Gizeh sont visibles depuis certains appartements !", costs:{logement:300,courses:70,restos:39,nocturne:40,transport:15,sante:25,telecom:10,voyage:100} },
  { id:16, name:"Santiago", country:"Chili", flag:"🇨🇱", continent:"Amérique du Sud", coords:"33.4489°S, 70.6693°O", funFact:"Santiago est entourée de volcans et offre une vue sur les Andes enneigées depuis le centre-ville — idéal pour skier après les cours !", costs:{logement:550,courses:108,restos:79,nocturne:70,transport:35,sante:45,telecom:18,voyage:180} },
  { id:17, name:"Amsterdam", country:"Pays-Bas", flag:"🇳🇱", continent:"Europe", coords:"52.3676°N, 4.9041°E", funFact:"Amsterdam compte plus de vélos (880 000) que d'habitants (820 000). Chaque année, environ 15 000 vélos finissent au fond des canaux.", costs:{logement:1150,courses:145,restos:142,nocturne:110,transport:100,sante:55,telecom:25,voyage:200} },
  { id:18, name:"Barcelone", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"41.3851°N, 2.1734°E", funFact:"La Sagrada Família est en construction depuis 1882 — soit plus de 140 ans pour une seule église. Elle devrait être achevée d'ici 2026.", costs:{logement:900,courses:127,restos:114,nocturne:95,transport:50,sante:45,telecom:20,voyage:160} },
  { id:19, name:"Vienne", country:"Autriche", flag:"🇦🇹", continent:"Europe", coords:"48.2082°N, 16.3738°E", funFact:"Vienne est régulièrement classée ville la plus agréable à vivre au monde. Elle possède 450 cafés historiques — le 'café viennois' est au patrimoine de l'UNESCO.", costs:{logement:950,courses:141,restos:134,nocturne:100,transport:80,sante:50,telecom:22,voyage:170} },
  { id:20, name:"Budapest", country:"Hongrie", flag:"🇭🇺", continent:"Europe", coords:"47.4979°N, 19.0402°E", funFact:"Budapest est en réalité deux villes fusionnées en 1873 : Buda (côté collines) et Pest (côté plaine). Son Parlement est l'un des plus grands du monde.", costs:{logement:600,courses:103,restos:79,nocturne:65,transport:30,sante:35,telecom:14,voyage:130} },
  { id:21, name:"Varsovie", country:"Pologne", flag:"🇵🇱", continent:"Europe", coords:"52.2297°N, 21.0122°E", funFact:"Le centre historique de Varsovie a été entièrement reconstruit après la Seconde Guerre mondiale grâce aux peintures de Canaletto — classé UNESCO en 1980.", costs:{logement:650,courses:98,restos:75,nocturne:60,transport:28,sante:30,telecom:14,voyage:130} },
  { id:22, name:"Dublin", country:"Irlande", flag:"🇮🇪", continent:"Europe", coords:"53.3498°N, 6.2603°O", funFact:"Dublin compte plus de prix Nobel de littérature par habitant que n'importe quelle autre ville au monde (Yeats, Shaw, Beckett, Heaney).", costs:{logement:1300,courses:164,restos:158,nocturne:130,transport:120,sante:60,telecom:35,voyage:200} },
  { id:23, name:"Copenhague", country:"Danemark", flag:"🇩🇰", continent:"Europe", coords:"55.6761°N, 12.5683°E", funFact:"Copenhague ambitionne d'être la première capitale à émissions nettes de carbone nulles. Déjà, 62 % des habitants s'y déplacent quotidiennement à vélo.", costs:{logement:1100,courses:173,restos:170,nocturne:135,transport:95,sante:55,telecom:25,voyage:200} },
  { id:24, name:"Oslo", country:"Norvège", flag:"🇳🇴", continent:"Europe", coords:"59.9139°N, 10.7522°E", funFact:"Oslo est l'une des villes les plus chères au monde. Un Big Mac y coûte environ 7 € — et une bière en bar peut dépasser 12 € !", costs:{logement:1350,courses:211,restos:197,nocturne:150,transport:110,sante:60,telecom:30,voyage:220} },
  { id:25, name:"Helsinki", country:"Finlande", flag:"🇫🇮", continent:"Europe", coords:"60.1699°N, 24.9384°E", funFact:"En Finlande, il y a plus de saunas que de voitures. Le sauna y est considéré comme un lieu sacré — même les réunions d'affaires s'y tiennent !", costs:{logement:1000,courses:155,restos:150,nocturne:120,transport:90,sante:50,telecom:22,voyage:190} },
  { id:26, name:"Bruxelles", country:"Belgique", flag:"🇧🇪", continent:"Europe", coords:"50.8503°N, 4.3517°E", funFact:"Bruxelles a plus de fresques de bandes dessinées murales au m² que toute autre ville. La BD est considérée comme le 9e art en Belgique — patrie de Tintin !", costs:{logement:900,courses:136,restos:122,nocturne:90,transport:60,sante:45,telecom:20,voyage:160} },
  { id:27, name:"Zurich", country:"Suisse", flag:"🇨🇭", continent:"Europe", coords:"47.3769°N, 8.5417°E", funFact:"Zurich arrive systématiquement 1re ou 2e des classements de qualité de vie mondiale — mais aussi dans le top 3 des villes les plus chères au monde !", costs:{logement:1800,courses:244,restos:229,nocturne:175,transport:130,sante:90,telecom:45,voyage:250} },
  { id:28, name:"Athènes", country:"Grèce", flag:"🇬🇷", continent:"Europe", coords:"37.9838°N, 23.7275°E", funFact:"L'Acropole d'Athènes est visible depuis presque tous les points de la ville. L'architecture grecque a directement inspiré la Maison Blanche et le Capitole américain.", costs:{logement:600,courses:112,restos:87,nocturne:70,transport:30,sante:35,telecom:16,voyage:140} },
  { id:29, name:"Istanbul", country:"Turquie", flag:"🇹🇷", continent:"Europe", coords:"41.0082°N, 28.9784°E", funFact:"Istanbul est la seule ville au monde à s'étendre sur deux continents (Europe et Asie). Son Grand Bazar compte plus de 4 000 boutiques !", costs:{logement:450,courses:94,restos:63,nocturne:60,transport:20,sante:30,telecom:10,voyage:150} },
  { id:30, name:"Séville", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"37.3891°N, 5.9845°O", funFact:"Séville est la ville la plus chaude d'Europe avec des étés à 45 °C. C'est là qu'est né Don Juan et que se déroule l'opéra Carmen de Bizet.", costs:{logement:650,courses:108,restos:87,nocturne:75,transport:35,sante:38,telecom:18,voyage:140} },
  { id:31, name:"Cracovie", country:"Pologne", flag:"🇵🇱", continent:"Europe", coords:"50.0647°N, 19.9450°E", funFact:"Cracovie est l'une des rares grandes villes polonaises à avoir survécu à la Seconde Guerre mondiale pratiquement intacte — classée UNESCO en 1978.", costs:{logement:500,courses:89,restos:67,nocturne:50,transport:22,sante:28,telecom:12,voyage:120} },
  { id:32, name:"Porto", country:"Portugal", flag:"🇵🇹", continent:"Europe", coords:"41.1579°N, 8.6291°O", funFact:"Porto a donné son nom au porto, mais aussi au Portugal ! 'Portus Cale', l'ancien nom de la ville, est à l'origine du nom du pays.", costs:{logement:680,courses:103,restos:83,nocturne:65,transport:35,sante:38,telecom:16,voyage:130} },
  { id:33, name:"Valence", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"39.4699°N, 0.3763°O", funFact:"Valence est la ville natale de la paella ! La recette originale (avec lapin, poulet et haricots) n'a rien à voir avec la version aux fruits de mer popularisée ailleurs.", costs:{logement:700,courses:112,restos:95,nocturne:75,transport:35,sante:40,telecom:18,voyage:140} },
  { id:34, name:"Riga", country:"Lettonie", flag:"🇱🇻", continent:"Europe", coords:"56.9496°N, 24.1052°E", funFact:"Riga possède le plus grand ensemble de bâtiments Art Nouveau au monde — 800 édifices, soit un tiers du centre-ville entier !", costs:{logement:450,courses:84,restos:63,nocturne:50,transport:22,sante:28,telecom:12,voyage:110} },
  { id:35, name:"Tallinn", country:"Estonie", flag:"🇪🇪", continent:"Europe", coords:"59.4370°N, 24.7536°E", funFact:"L'Estonie est la nation la plus numérique au monde : vote électronique, e-résidence, et Skype y a été inventé. Tallinn = Silicon Valley de l'Europe de l'Est !", costs:{logement:500,courses:89,restos:67,nocturne:55,transport:24,sante:30,telecom:13,voyage:120} },
  { id:36, name:"Vilnius", country:"Lituanie", flag:"🇱🇹", continent:"Europe", coords:"54.6872°N, 25.2797°E", funFact:"Vilnius abrite la 'République Indépendante d'Užupis', un quartier artistique auto-proclamé en 1997, avec sa propre constitution et son président !", costs:{logement:480,courses:87,restos:63,nocturne:50,transport:22,sante:28,telecom:12,voyage:110} },
  { id:37, name:"Ljubljana", country:"Slovénie", flag:"🇸🇮", continent:"Europe", coords:"46.0569°N, 14.5058°E", funFact:"Ljubljana (prononcé 'Lyoublyiana') a été élue capitale verte européenne en 2016. Son centre-ville est entièrement interdit aux voitures.", costs:{logement:650,courses:108,restos:79,nocturne:60,transport:28,sante:35,telecom:15,voyage:130} },
  { id:38, name:"Bratislava", country:"Slovaquie", flag:"🇸🇰", continent:"Europe", coords:"48.1486°N, 17.1077°E", funFact:"Bratislava est la seule capitale dont les frontières touchent deux pays différents (Autriche et Hongrie) à moins de 10 km du centre-ville !", costs:{logement:550,courses:94,restos:71,nocturne:55,transport:25,sante:30,telecom:13,voyage:120} },
  { id:39, name:"Reykjavik", country:"Islande", flag:"🇮🇸", continent:"Europe", coords:"64.1466°N, 21.9426°O", funFact:"Reykjavik fonctionne à 100 % aux énergies renouvelables (géothermie). C'est aussi la ville avec le taux de criminalité le plus bas au monde — les policiers n'ont pas d'armes à feu !", costs:{logement:1100,courses:197,restos:189,nocturne:150,transport:80,sante:60,telecom:28,voyage:280} },
  { id:40, name:"Singapour", country:"Singapour", flag:"🇸🇬", continent:"Asie", coords:"1.3521°N, 103.8198°E", funFact:"Singapour est l'un des rares pays où il est illégal de mâcher du chewing-gum (sauf usage médical). La propreté y est une véritable obsession nationale !", costs:{logement:1600,courses:188,restos:166,nocturne:125,transport:80,sante:90,telecom:35,voyage:350} },
  { id:41, name:"Bangkok", country:"Thaïlande", flag:"🇹🇭", continent:"Asie", coords:"13.7563°N, 100.5018°E", funFact:"Le nom officiel de Bangkok est le plus long nom de ville au monde : 169 caractères en thaï. Les habitants l'appellent simplement 'Krung Thep' (Cité des Anges).", costs:{logement:500,courses:94,restos:59,nocturne:60,transport:30,sante:40,telecom:15,voyage:200} },
  { id:42, name:"Dubaï", country:"Émirats Arabes Unis", flag:"🇦🇪", continent:"Asie", coords:"25.2048°N, 55.2708°E", funFact:"Dubaï n'avait pas de gratte-ciel avant 1991. En 30 ans, elle est devenue la ville avec le plus de tours de plus de 150 m au monde, devançant Hong Kong !", costs:{logement:1200,courses:169,restos:158,nocturne:140,transport:80,sante:80,telecom:35,voyage:300} },
  { id:43, name:"Nairobi", country:"Kenya", flag:"🇰🇪", continent:"Afrique", coords:"1.2921°S, 36.8219°E", funFact:"Nairobi est la seule capitale au monde avec un parc national en son cœur — on peut y observer lions et girafes avec les gratte-ciel en arrière-plan !", costs:{logement:400,courses:80,restos:51,nocturne:45,transport:20,sante:35,telecom:12,voyage:200} },
  { id:44, name:"Bogotá", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"4.7110°N, 74.0721°O", funFact:"Bogotá ferme ses rues aux voitures chaque dimanche pour 121 km de 'Ciclovía' — la plus grande piste cyclable temporaire hebdomadaire du monde !", costs:{logement:430,courses:89,restos:59,nocturne:50,transport:18,sante:30,telecom:13,voyage:160} },
  { id:45, name:"Lima", country:"Pérou", flag:"🇵🇪", continent:"Amérique du Sud", coords:"12.0464°S, 77.0428°O", funFact:"Lima abrite Central, élu meilleur restaurant d'Amérique Latine plusieurs années d'affilée. La gastronomie péruvienne est reconnue patrimoine immatériel de l'UNESCO.", costs:{logement:420,courses:87,restos:55,nocturne:50,transport:18,sante:28,telecom:12,voyage:160} },
  { id:46, name:"Lagos", country:"Nigéria", flag:"🇳🇬", continent:"Afrique", coords:"6.5244°N, 3.3792°E", funFact:"Lagos pourrait devenir la plus grande ville au monde d'ici 2100 selon l'ONU, avec une population estimée à 88 millions d'habitants.", costs:{logement:350,courses:75,restos:47,nocturne:40,transport:15,sante:25,telecom:10,voyage:150} },
  { id:47, name:"New York", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"40.7128°N, 74.0060°O", funFact:"New York est composée de 5 arrondissements distincts et de plus de 800 langues parlées — c'est la ville la plus linguistiquement diverse de la planète !", costs:{logement:1800,courses:197,restos:197,nocturne:160,transport:130,sante:120,telecom:50,voyage:250} },
  { id:48, name:"San Francisco", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"37.7749°N, 122.4194°O", funFact:"Le Golden Gate n'est pas rouge — sa couleur officielle s'appelle 'International Orange'. Elle a été choisie pour sa visibilité dans le brouillard de la baie.", costs:{logement:2100,courses:211,restos:205,nocturne:150,transport:120,sante:130,telecom:55,voyage:280} },
  { id:49, name:"Mumbai", country:"Inde", flag:"🇮🇳", continent:"Asie", coords:"19.0760°N, 72.8777°E", funFact:"Mumbai produit plus de films que Hollywood ! Bollywood sort environ 1 800 films par an contre 600 pour Hollywood — c'est la capitale du rêve indien.", costs:{logement:400,courses:75,restos:47,nocturne:45,transport:15,sante:30,telecom:8,voyage:180} },
  { id:50, name:"Tel Aviv", country:"Israël", flag:"🇮🇱", continent:"Asie", coords:"32.0853°N, 34.7818°E", funFact:"Tel Aviv est la seule ville construite entièrement sur des dunes de sable au XXe siècle. Elle compte aussi le plus de start-ups par habitant après la Silicon Valley.", costs:{logement:1350,courses:178,restos:166,nocturne:120,transport:90,sante:80,telecom:40,voyage:250} },
  // ── 50 nouvelles villes européennes ──
  { id:51, name:"Milan", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"45.4654°N, 9.1859°E", funFact:"Milan abrite La Cène de Léonard de Vinci, peinte directement sur un mur du réfectoire Santa Maria delle Grazie — et non sur une toile. Il faut réserver des mois à l'avance !", costs:{logement:1050,courses:141,restos:142,nocturne:110,transport:60,sante:55,telecom:22,voyage:170} },
  { id:52, name:"Naples", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"40.8518°N, 14.2681°E", funFact:"Naples est la ville natale de la vraie pizza margherita, créée en 1889 en hommage à la reine Margherita de Savoie avec les couleurs du drapeau italien.", costs:{logement:650,courses:112,restos:95,nocturne:70,transport:35,sante:42,telecom:18,voyage:140} },
  { id:53, name:"Florence", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"43.7696°N, 11.2558°E", funFact:"Florence contient plus de 30 % du patrimoine artistique mondial. Le musée des Offices possède tellement d'œuvres que la majorité est stockée dans des réserves invisibles du public.", costs:{logement:850,courses:127,restos:118,nocturne:80,transport:38,sante:48,telecom:20,voyage:160} },
  { id:54, name:"Venise", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"45.4408°N, 12.3155°E", funFact:"Venise est construite sur 118 petites îles reliées par 400 ponts. La ville s'enfonce dans l'eau à raison de 1 à 2 mm par an — et les marées hautes inondent régulièrement la place Saint-Marc.", costs:{logement:950,courses:136,restos:134,nocturne:85,transport:50,sante:50,telecom:22,voyage:180} },
  { id:55, name:"Turin", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"45.0703°N, 7.6869°E", funFact:"Turin est considérée comme l'une des capitales mondiales du chocolat : le bicerin (chocolat chaud, crème et café) y a été inventé au XVIIIe siècle. La ville abrite aussi le fameux Suaire de Turin.", costs:{logement:700,courses:117,restos:103,nocturne:75,transport:45,sante:48,telecom:20,voyage:150} },
  { id:56, name:"Bologne", country:"Italie", flag:"🇮🇹", continent:"Europe", coords:"44.4949°N, 11.3426°E", funFact:"Bologne abrite la plus vieille université du monde, fondée en 1088. Surnommée 'La Grassa' (la Grasse), elle est le berceau des vraies pâtes bolognaises — avec des tagliatelles, jamais des spaghetti !", costs:{logement:750,courses:120,restos:103,nocturne:75,transport:40,sante:46,telecom:20,voyage:145} },
  { id:57, name:"Lyon", country:"France", flag:"🇫🇷", continent:"Europe", coords:"45.7640°N, 4.8357°E", funFact:"Lyon est la capitale mondiale de la gastronomie selon beaucoup de chefs. La ville compte plus de restaurants par habitant que Paris — et Paul Bocuse y a régné pendant 50 ans.", costs:{logement:750,courses:131,restos:122,nocturne:85,transport:70,sante:55,telecom:23,voyage:140} },
  { id:58, name:"Marseille", country:"France", flag:"🇫🇷", continent:"Europe", coords:"43.2965°N, 5.3698°E", funFact:"Marseille est la plus vieille ville de France, fondée par les Grecs en 600 avant J.-C. sous le nom de Massalia. C'est aussi le port où La Marseillaise a été chantée pour la première fois.", costs:{logement:680,courses:124,restos:107,nocturne:78,transport:60,sante:52,telecom:22,voyage:130} },
  { id:59, name:"Nice", country:"France", flag:"🇫🇷", continent:"Europe", coords:"43.7102°N, 7.2620°E", funFact:"Nice a appartenu au Royaume de Sardaigne jusqu'en 1860 — soit bien après la Révolution française ! Sa cuisine mêle traditions françaises et italiennes, comme la salade niçoise et la socca.", costs:{logement:850,courses:136,restos:122,nocturne:88,transport:55,sante:55,telecom:23,voyage:145} },
  { id:60, name:"Bordeaux", country:"France", flag:"🇫🇷", continent:"Europe", coords:"44.8378°N, 0.5792°O", funFact:"Bordeaux est classée au patrimoine mondial de l'UNESCO pour son ensemble architectural du XVIIIe siècle. Elle possède plus de bâtiments classés monuments historiques que n'importe quelle autre ville française hors Paris.", costs:{logement:720,courses:127,restos:114,nocturne:82,transport:55,sante:52,telecom:22,voyage:135} },
  { id:61, name:"Toulouse", country:"France", flag:"🇫🇷", continent:"Europe", coords:"43.6047°N, 1.4442°E", funFact:"Toulouse est surnommée 'La Ville Rose' pour ses briques de teinte rosée. C'est aussi la capitale mondiale de l'aéronautique — Airbus y a son siège social et y assemble le célèbre A380.", costs:{logement:700,courses:124,restos:107,nocturne:78,transport:52,sante:50,telecom:22,voyage:130} },
  { id:62, name:"Strasbourg", country:"France", flag:"🇫🇷", continent:"Europe", coords:"48.5734°N, 7.7521°E", funFact:"Strasbourg est la seule ville française à avoir été capitale de deux pays différents. Elle abrite le Parlement européen et incarne à elle seule l'idée d'une Europe réconciliée.", costs:{logement:680,courses:122,restos:105,nocturne:75,transport:50,sante:50,telecom:21,voyage:130} },
  { id:63, name:"Munich", country:"Allemagne", flag:"🇩🇪", continent:"Europe", coords:"48.1351°N, 11.5820°E", funFact:"L'Oktoberfest de Munich est la plus grande fête populaire au monde : 6 millions de visiteurs consomment 7 millions de litres de bière en 16 jours. Pourtant, la ville est aussi réputée pour ses musées de classe mondiale.", costs:{logement:1100,courses:150,restos:142,nocturne:110,transport:80,sante:55,telecom:24,voyage:165} },
  { id:64, name:"Hambourg", country:"Allemagne", flag:"🇩🇪", continent:"Europe", coords:"53.5753°N, 10.0153°E", funFact:"Hambourg est la ville avec le plus de ponts au monde après Venise et Amsterdam — plus de 2 500 ! Son port est aussi le 3e plus grand d'Europe.", costs:{logement:980,courses:141,restos:130,nocturne:100,transport:85,sante:52,telecom:23,voyage:160} },
  { id:65, name:"Cologne", country:"Allemagne", flag:"🇩🇪", continent:"Europe", coords:"50.9333°N, 6.9500°E", funFact:"La cathédrale de Cologne a mis 632 ans à être construite (de 1248 à 1880). Pendant la Seconde Guerre mondiale, les bombardements alliés l'ont épargnée pour s'en servir de point de repère de navigation.", costs:{logement:850,courses:131,restos:118,nocturne:92,transport:75,sante:50,telecom:22,voyage:150} },
  { id:66, name:"Francfort", country:"Allemagne", flag:"🇩🇪", continent:"Europe", coords:"50.1109°N, 8.6821°E", funFact:"Francfort est le berceau de l'euro : la Banque Centrale Européenne y est installée. C'est aussi la ville natale de Goethe — et son nom signifie littéralement 'gué des Francs'.", costs:{logement:1000,courses:143,restos:134,nocturne:100,transport:78,sante:52,telecom:23,voyage:160} },
  { id:67, name:"Düsseldorf", country:"Allemagne", flag:"🇩🇪", continent:"Europe", coords:"51.2217°N, 6.7762°E", funFact:"Düsseldorf est la capitale mondiale de la mode après Paris, Milan et New York — son boulevard Königsallee est l'une des rues commerçantes les plus luxueuses d'Europe.", costs:{logement:950,courses:138,restos:128,nocturne:98,transport:76,sante:51,telecom:22,voyage:155} },
  { id:68, name:"Genève", country:"Suisse", flag:"🇨🇭", continent:"Europe", coords:"46.2044°N, 6.1432°E", funFact:"Genève abrite plus d'organisations internationales que New York — dont le CERN, où le World Wide Web a été inventé par Tim Berners-Lee en 1989.", costs:{logement:1900,courses:253,restos:237,nocturne:180,transport:80,sante:95,telecom:45,voyage:220} },
  { id:69, name:"Édimbourg", country:"Royaume-Uni", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", continent:"Europe", coords:"55.9533°N, 3.1883°O", funFact:"Édimbourg accueille chaque août le plus grand festival des arts au monde — le Festival Fringe — avec plus de 3 500 spectacles en 25 jours. La ville a aussi inspiré le décor de Harry Potter à J.K. Rowling.", costs:{logement:1050,courses:150,restos:146,nocturne:115,transport:80,sante:55,telecom:28,voyage:170} },
  { id:70, name:"Manchester", country:"Royaume-Uni", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent:"Europe", coords:"53.4808°N, 2.2426°O", funFact:"Manchester a été le berceau de la Révolution industrielle au XVIIIe siècle. C'est aussi la ville qui a vu naître des groupes légendaires comme Oasis et The Smiths.", costs:{logement:950,courses:141,restos:134,nocturne:105,transport:75,sante:52,telecom:27,voyage:160} },
  { id:71, name:"Glasgow", country:"Royaume-Uni", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", continent:"Europe", coords:"55.8642°N, 4.2518°O", funFact:"Glasgow est connue pour son humour acerbe et son accent incompréhensible même pour les autres Britanniques. C'est la ville d'Europe qui compte le plus de musées gratuits par habitant.", costs:{logement:850,courses:131,restos:122,nocturne:95,transport:68,sante:50,telecom:26,voyage:155} },
  { id:72, name:"Bristol", country:"Royaume-Uni", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent:"Europe", coords:"51.4545°N, 2.5879°O", funFact:"Bristol est le fief de Banksy, l'artiste de street art anonyme le plus célèbre au monde. La ville a aussi lancé la scène trip-hop mondiale avec Massive Attack et Portishead.", costs:{logement:1000,courses:143,restos:134,nocturne:100,transport:70,sante:52,telecom:27,voyage:160} },
  { id:73, name:"Rotterdam", country:"Pays-Bas", flag:"🇳🇱", continent:"Europe", coords:"51.9244°N, 4.4777°E", funFact:"Rotterdam abrite le plus grand port d'Europe. Entièrement reconstruite après les bombardements de 1940, la ville est devenue un laboratoire d'architecture contemporaine — avec même des maisons en forme de cube.", costs:{logement:1000,courses:141,restos:130,nocturne:100,transport:90,sante:52,telecom:24,voyage:170} },
  { id:74, name:"Anvers", country:"Belgique", flag:"🇧🇪", continent:"Europe", coords:"51.2213°N, 4.4051°E", funFact:"Anvers est la capitale mondiale du diamant — 80 % des diamants bruts mondiaux y transitent chaque année. Son port est le 2e d'Europe et la ville a été le foyer de Rubens toute sa vie.", costs:{logement:850,courses:129,restos:114,nocturne:85,transport:58,sante:44,telecom:20,voyage:150} },
  { id:75, name:"Bruges", country:"Belgique", flag:"🇧🇪", continent:"Europe", coords:"51.2093°N, 3.2247°E", funFact:"Bruges est si bien préservée qu'elle est surnommée la 'Venise du Nord'. Son centre médiéval est entièrement classé UNESCO — et a servi de décor au film 'In Bruges' avec Colin Farrell.", costs:{logement:780,courses:124,restos:111,nocturne:78,transport:40,sante:42,telecom:19,voyage:140} },
  { id:76, name:"Göteborg", country:"Suède", flag:"🇸🇪", continent:"Europe", coords:"57.7089°N, 11.9746°E", funFact:"Göteborg est la ville natale de Volvo. Le parc d'attractions Liseberg y est le plus fréquenté de Scandinavie — malgré des hivers à -10 °C !", costs:{logement:900,courses:159,restos:150,nocturne:115,transport:85,sante:53,telecom:26,voyage:170} },
  { id:77, name:"Bergen", country:"Norvège", flag:"🇳🇴", continent:"Europe", coords:"60.3913°N, 5.3221°E", funFact:"Bergen est entourée de sept montagnes et reçoit en moyenne 239 jours de pluie par an — les habitants ont un surnom affectueux pour leur imperméable : 'la veste Bergen'. C'est le point de départ des fjords.", costs:{logement:1150,courses:188,restos:178,nocturne:135,transport:95,sante:58,telecom:28,voyage:200} },
  { id:78, name:"Bucarest", country:"Roumanie", flag:"🇷🇴", continent:"Europe", coords:"44.4268°N, 26.1025°E", funFact:"Bucarest abrite le Palais du Parlement, le 2e plus grand bâtiment administratif au monde après le Pentagone. Construit sous Ceaușescu, il a nécessité 700 architectes et 20 000 ouvriers travaillant 24h/24.", costs:{logement:500,courses:87,restos:65,nocturne:55,transport:22,sante:30,telecom:12,voyage:120} },
  { id:79, name:"Sofia", country:"Bulgarie", flag:"🇧🇬", continent:"Europe", coords:"42.6977°N, 23.3219°E", funFact:"Sofia est l'une des plus vieilles capitales d'Europe — des vestiges datant de 7 000 ans ont été retrouvés sous le centre-ville. Le métro a régulièrement mis au jour des ruines romaines lors de sa construction.", costs:{logement:420,courses:82,restos:61,nocturne:50,transport:18,sante:28,telecom:11,voyage:110} },
  { id:80, name:"Zagreb", country:"Croatie", flag:"🇭🇷", continent:"Europe", coords:"45.8150°N, 15.9819°E", funFact:"Zagreb abrite le seul Musée des Ruptures Amoureuses au monde — une collection d'objets laissés par des ex-amants avec leurs histoires. Le concept a depuis été copié dans une dizaine d'autres pays.", costs:{logement:580,courses:96,restos:73,nocturne:58,transport:26,sante:32,telecom:13,voyage:130} },
  { id:81, name:"Dubrovnik", country:"Croatie", flag:"🇭🇷", continent:"Europe", coords:"42.6507°N, 18.0944°E", funFact:"Dubrovnik a servi de décor à Port-Réal dans Game of Thrones — la ville a connu une telle invasion touristique après la série que la mairie a dû limiter le nombre de visiteurs quotidiens dans la vieille ville.", costs:{logement:750,courses:112,restos:95,nocturne:70,transport:30,sante:38,telecom:14,voyage:150} },
  { id:82, name:"Split", country:"Croatie", flag:"🇭🇷", continent:"Europe", coords:"43.5081°N, 16.4402°E", funFact:"Le centre-ville de Split est littéralement construit à l'intérieur du palais de l'Empereur Dioclétien (305 ap. J.-C.) — des milliers de personnes y habitent dans ce que l'on considère comme le plus grand palais romain habité du monde.", costs:{logement:680,courses:105,restos:83,nocturne:65,transport:28,sante:35,telecom:13,voyage:140} },
  { id:83, name:"Belgrade", country:"Serbie", flag:"🇷🇸", continent:"Europe", coords:"44.7866°N, 20.4489°E", funFact:"Belgrade est réputée pour avoir la vie nocturne la plus folle d'Europe — ses 'splavovi' (clubs sur bateaux amarrés sur la Sava et le Danube) font la fête jusqu'à 10h du matin.", costs:{logement:450,courses:84,restos:61,nocturne:60,transport:20,sante:28,telecom:11,voyage:115} },
  { id:84, name:"Sarajevo", country:"Bosnie-Herzégovine", flag:"🇧🇦", continent:"Europe", coords:"43.8476°N, 18.3564°E", funFact:"Sarajevo est la seule ville au monde à avoir organisé les Jeux Olympiques d'hiver (1984) et à avoir été assiégée pendant une guerre (1992-1996) — le siège le plus long d'une capitale dans l'histoire des guerres modernes.", costs:{logement:380,courses:75,restos:55,nocturne:45,transport:18,sante:25,telecom:10,voyage:110} },
  { id:85, name:"Tirana", country:"Albanie", flag:"🇦🇱", continent:"Europe", coords:"41.3275°N, 19.8187°E", funFact:"Tirana est devenue l'une des capitales les plus colorées d'Europe grâce à son ancien maire, le peintre Edi Rama, qui a fait peindre tous les bâtiments en couleurs vives pour lutter contre la déprime post-communiste.", costs:{logement:340,courses:70,restos:47,nocturne:40,transport:15,sante:22,telecom:9,voyage:105} },
  { id:86, name:"Bilbao", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"43.2630°N, 2.9349°O", funFact:"L'ouverture du musée Guggenheim de Bilbao en 1997 a été un tel tournant économique qu'on parle du 'Effet Bilbao' dans le monde entier pour désigner la régénération urbaine par la culture.", costs:{logement:780,courses:120,restos:105,nocturne:80,transport:42,sante:42,telecom:19,voyage:145} },
  { id:87, name:"Grenade", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"37.1773°N, 3.5986°O", funFact:"Grenade est la seule ville d'Europe occidentale où les bars servent encore les tapas gratuitement avec chaque consommation — une tradition qui se perd ailleurs mais reste sacrée ici.", costs:{logement:580,courses:101,restos:79,nocturne:65,transport:30,sante:35,telecom:17,voyage:130} },
  { id:88, name:"Palma", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"39.5696°N, 2.6502°E", funFact:"Palma de Majorque compte plus de 300 jours de soleil par an. Sa cathédrale La Seu, construite sur 300 ans, possède l'un des plus grands rosaces de vitraux du monde.", costs:{logement:850,courses:124,restos:107,nocturne:85,transport:40,sante:44,telecom:19,voyage:150} },
  { id:89, name:"Malaga", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"36.7213°N, 4.4213°O", funFact:"Malaga est la ville natale de Pablo Picasso — le musée Picasso y est installé dans son palais natal. La ville est aussi connue pour le plus fort taux d'ensoleillement d'Europe continentale.", costs:{logement:720,courses:115,restos:99,nocturne:78,transport:35,sante:40,telecom:18,voyage:140} },
  { id:90, name:"Luxembourg", country:"Luxembourg", flag:"🇱🇺", continent:"Europe", coords:"49.6117°N, 6.1319°E", funFact:"Luxembourg est la seule capitale européenne à avoir un tramway entièrement gratuit pour tous ses habitants et visiteurs. La ville abrite aussi la Cour de Justice de l'Union Européenne.", costs:{logement:1400,courses:183,restos:166,nocturne:120,transport:0,sante:65,telecom:30,voyage:180} },
  { id:91, name:"La Valette", country:"Malte", flag:"🇲🇹", continent:"Europe", coords:"35.8997°N, 14.5146°E", funFact:"La Valette est la plus petite capitale de l'Union Européenne — seulement 6 000 habitants dans la vieille ville. Elle possède plus de monuments classés UNESCO par km² que n'importe quelle autre ville au monde.", costs:{logement:850,courses:127,restos:107,nocturne:80,transport:25,sante:45,telecom:20,voyage:160} },
  { id:92, name:"Nicosie", country:"Chypre", flag:"🇨🇾", continent:"Europe", coords:"35.1856°N, 33.3823°E", funFact:"Nicosie est la seule capitale au monde encore divisée par une frontière militaire — la 'Ligne Verte' de l'ONU sépare la partie grecque de la partie turque depuis 1974.", costs:{logement:700,courses:117,restos:95,nocturne:72,transport:30,sante:40,telecom:18,voyage:155} },
  { id:93, name:"Thessalonique", country:"Grèce", flag:"🇬🇷", continent:"Europe", coords:"40.6401°N, 22.9444°E", funFact:"Thessalonique est considérée comme la capitale gastronomique de la Grèce — les Grecs eux-mêmes le reconnaissent. La ville a été fondée par Alexandre le Grand en 315 av. J.-C., du nom de sa sœur.", costs:{logement:500,courses:98,restos:75,nocturne:60,transport:25,sante:32,telecom:14,voyage:125} },
  { id:94, name:"Gdańsk", country:"Pologne", flag:"🇵🇱", continent:"Europe", coords:"54.3520°N, 18.6466°E", funFact:"Gdańsk est le berceau du mouvement Solidarność — c'est dans ses chantiers navals que Lech Wałęsa a lancé en 1980 le syndicat qui a contribué à faire tomber le communisme en Europe de l'Est.", costs:{logement:550,courses:91,restos:69,nocturne:52,transport:24,sante:29,telecom:12,voyage:120} },
  { id:95, name:"Wrocław", country:"Pologne", flag:"🇵🇱", continent:"Europe", coords:"51.1079°N, 17.0385°E", funFact:"Wrocław est surnommée la 'Venise de Pologne' avec ses 12 îles et 112 ponts. La ville cache aussi plus de 300 petits nains de bronze dans ses rues — une tradition née de la résistance à la censure communiste.", costs:{logement:520,courses:89,restos:67,nocturne:52,transport:23,sante:28,telecom:12,voyage:115} },
  { id:96, name:"Bilbao", country:"Espagne", flag:"🇪🇸", continent:"Europe", coords:"43.2630°N, 2.9349°O", funFact:"Le Guggenheim de Bilbao a transformé une ville industrielle déclinante en destination culturelle mondiale. On appelle désormais 'effet Bilbao' tout projet architectural qui régénère une ville.", costs:{logement:780,courses:120,restos:105,nocturne:80,transport:42,sante:42,telecom:19,voyage:145} },
  { id:97, name:"Skopje", country:"Macédoine du Nord", flag:"🇲🇰", continent:"Europe", coords:"41.9981°N, 21.4254°E", funFact:"Skopje a installé plus de 100 statues néoclassiques en quelques années dans les années 2010 — dont une d'Alexandre le Grand de 22 mètres — dans le cadre du controversé projet 'Skopje 2014'.", costs:{logement:320,courses:68,restos:45,nocturne:38,transport:14,sante:20,telecom:9,voyage:100} },
  { id:98, name:"Belgrade", country:"Serbie", flag:"🇷🇸", continent:"Europe", coords:"44.7866°N, 20.4489°E", funFact:"Belgrade a été détruite et reconstruite 44 fois au cours de l'histoire — ce qui en fait l'une des villes les plus souvent razées de la planète. Sa forteresse de Kalemegdan domine la confluence du Danube et de la Sava.", costs:{logement:450,courses:84,restos:61,nocturne:60,transport:20,sante:28,telecom:11,voyage:115} },
  { id:99, name:"Berne", country:"Suisse", flag:"🇨🇭", continent:"Europe", coords:"46.9481°N, 7.4474°E", funFact:"Berne est l'une des rares capitales fédérales à ne pas être la plus grande ville du pays. Son nom signifie 'ours' en allemand — la ville élève effectivement des ours vivants dans une fosse en plein centre depuis le Moyen Âge.", costs:{logement:1550,courses:230,restos:205,nocturne:155,transport:90,sante:88,telecom:42,voyage:210} },
  { id:100, name:"Innsbruck", country:"Autriche", flag:"🇦🇹", continent:"Europe", coords:"47.2692°N, 11.4041°E", funFact:"Innsbruck a accueilli les Jeux Olympiques d'hiver à deux reprises (1964 et 1976) — un record. La ville est encadrée par des montagnes de 2 000 m et offre l'une des plus belles vues alpines depuis un centre-ville en Europe.", costs:{logement:850,courses:134,restos:122,nocturne:88,transport:65,sante:48,telecom:21,voyage:155} },
  // ── 50 villes d'Amérique du Sud ──
  { id:101, name:"São Paulo", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"23.5505°S, 46.6333°O", funFact:"São Paulo est la plus grande ville de l'hémisphère sud avec 22 millions d'habitants. Elle abrite la plus grande communauté japonaise en dehors du Japon — plus d'un million de personnes !", costs:{logement:500,courses:98,restos:75,nocturne:65,transport:28,sante:40,telecom:14,voyage:180} },
  { id:102, name:"Rio de Janeiro", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"22.9068°S, 43.1729°O", funFact:"Le Carnaval de Rio est le plus grand festival au monde — 2 millions de personnes défilent chaque jour pendant 5 jours. Le Christ Rédempteur a été frappé par la foudre à plusieurs reprises, ce que les Cariocas trouvent tout à fait normal.", costs:{logement:480,courses:94,restos:71,nocturne:70,transport:25,sante:38,telecom:13,voyage:170} },
  { id:103, name:"Brasília", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"15.7801°S, 47.9292°O", funFact:"Brasília a été construite de zéro en seulement 41 mois (1956-1960) et est classée au patrimoine mondial de l'UNESCO — la seule ville du XXe siècle à recevoir cette distinction. Vue du ciel, elle ressemble à un avion.", costs:{logement:520,courses:103,restos:77,nocturne:60,transport:30,sante:42,telecom:14,voyage:160} },
  { id:104, name:"Salvador", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"12.9777°S, 38.5016°O", funFact:"Salvador est la ville avec la plus forte culture africaine hors d'Afrique — 80 % de ses habitants ont des origines africaines. La Capoeira, le Candomblé et l'Axé y sont nés. La ville a été la première capitale du Brésil pendant 214 ans.", costs:{logement:360,courses:80,restos:57,nocturne:50,transport:20,sante:30,telecom:11,voyage:155} },
  { id:105, name:"Fortaleza", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"3.7172°S, 38.5434°O", funFact:"Fortaleza possède 25 km de plages urbaines et une culture de la fête unique au Brésil : la 'Cidade Forró' où chaque soir de la semaine, dans un quartier différent, des milliers de personnes dansent le forró sous les étoiles.", costs:{logement:320,courses:73,restos:51,nocturne:45,transport:18,sante:28,telecom:10,voyage:150} },
  { id:106, name:"Recife", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"8.0476°S, 34.8770°O", funFact:"Recife est surnommée la 'Venise brésilienne' avec ses nombreux canaux, ponts et îles. C'est aussi la ville avec le Carnaval le plus populaire du Brésil selon ses habitants — rivalisant sérieusement avec Rio.", costs:{logement:350,courses:76,restos:54,nocturne:48,transport:19,sante:29,telecom:10,voyage:150} },
  { id:107, name:"Belo Horizonte", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"19.9191°S, 43.9386°O", funFact:"Belo Horizonte est la capitale mondiale du bar à kilo (restaurants self-service où l'on paye au poids). La ville est aussi réputée pour avoir le meilleur street food du Brésil — notamment le fameux 'pastel de feira'.", costs:{logement:380,courses:79,restos:58,nocturne:50,transport:21,sante:32,telecom:11,voyage:155} },
  { id:108, name:"Manaus", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"3.1190°S, 60.0217°O", funFact:"Manaus est la porte d'entrée de l'Amazonie, la plus grande forêt tropicale du monde. Son opéra Teatro Amazonas, inauguré en 1896 au cœur de la jungle, est considéré comme l'un des plus beaux du monde.", costs:{logement:340,courses:77,restos:55,nocturne:42,transport:20,sante:30,telecom:11,voyage:200} },
  { id:109, name:"Curitiba", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"25.4290°S, 49.2671°O", funFact:"Curitiba est souvent citée comme modèle mondial d'urbanisme durable — son réseau de bus articulés 'tube' a inspiré des dizaines de villes à travers le monde. La ville a aussi planté 1,5 million d'arbres en quelques décennies.", costs:{logement:360,courses:76,restos:54,nocturne:46,transport:18,sante:30,telecom:10,voyage:150} },
  { id:110, name:"Porto Alegre", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"30.0346°S, 51.2177°O", funFact:"Porto Alegre est la capitale mondiale du churrasco — le barbecue brésilien. C'est aussi la ville qui a inventé le budget participatif municipal en 1989, une innovation démocratique copiée dans plus de 300 villes dans le monde.", costs:{logement:370,courses:77,restos:56,nocturne:48,transport:19,sante:31,telecom:10,voyage:155} },
  { id:111, name:"Montevideo", country:"Uruguay", flag:"🇺🇾", continent:"Amérique du Sud", coords:"34.9011°S, 56.1645°O", funFact:"Montevideo est régulièrement classée meilleure qualité de vie d'Amérique Latine. L'Uruguay a été le premier pays au monde à légaliser le cannabis en 2013 et le mariage pour tous en 2013 également — deux premières mondiales la même année.", costs:{logement:480,courses:94,restos:69,nocturne:58,transport:24,sante:36,telecom:14,voyage:160} },
  { id:112, name:"Medellín", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"6.2442°N, 75.5812°O", funFact:"Medellín était dans les années 1990 la ville la plus dangereuse du monde. Elle est aujourd'hui reconnue comme l'une des villes les plus innovantes de la planète — son téléphérique urbain reliant les quartiers défavorisés est devenu un modèle mondial.", costs:{logement:400,courses:82,restos:58,nocturne:48,transport:17,sante:28,telecom:12,voyage:150} },
  { id:113, name:"Cali", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"3.4516°N, 76.5320°O", funFact:"Cali est la capitale mondiale de la salsa — ses habitants sont réputés pour être les meilleurs danseurs de la planète. Chaque été, la Feria de Cali rassemble plus de 3 millions de personnes pendant 6 jours de danse non-stop.", costs:{logement:360,courses:76,restos:52,nocturne:44,transport:15,sante:26,telecom:11,voyage:145} },
  { id:114, name:"Cartagena", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"10.3910°N, 75.4794°O", funFact:"Cartagena est l'une des villes les mieux conservées des Amériques — ses remparts coloniaux construits par les Espagnols au XVIe siècle sont encore debout. Gabriel García Márquez y a situé plusieurs de ses romans et y est enterré.", costs:{logement:420,courses:84,restos:61,nocturne:52,transport:16,sante:28,telecom:11,voyage:155} },
  { id:115, name:"Quito", country:"Équateur", flag:"🇪🇨", continent:"Amérique du Sud", coords:"0.1807°S, 78.4678°O", funFact:"Quito est la capitale la plus haute du monde après La Paz — à 2 850 m d'altitude. Elle est aussi l'une des mieux conservées d'Amérique Latine et a été la première ville à être classée au patrimoine de l'UNESCO en 1978.", costs:{logement:380,courses:77,restos:55,nocturne:45,transport:17,sante:28,telecom:11,voyage:160} },
  { id:116, name:"Guayaquil", country:"Équateur", flag:"🇪🇨", continent:"Amérique du Sud", coords:"2.1962°S, 79.8862°O", funFact:"Guayaquil est le principal port de l'Équateur et la ville natale du cacao Arriba, considéré comme l'un des meilleurs chocolats au monde. La ville est aussi le point de départ pour les Îles Galápagos.", costs:{logement:340,courses:71,restos:51,nocturne:41,transport:15,sante:25,telecom:10,voyage:155} },
  { id:117, name:"La Paz", country:"Bolivie", flag:"🇧🇴", continent:"Amérique du Sud", coords:"16.5000°S, 68.1500°O", funFact:"La Paz est le siège du gouvernement bolivien le plus haut du monde — à 3 650 m d'altitude. Son marché des sorcières (Mercado de Hechicería) vend des fœtus de lamas séchés, utilisés comme offrandes aux dieux dans la tradition aymara.", costs:{logement:280,courses:63,restos:43,nocturne:36,transport:12,sante:22,telecom:9,voyage:170} },
  { id:118, name:"Santa Cruz de la Sierra", country:"Bolivie", flag:"🇧🇴", continent:"Amérique du Sud", coords:"17.7833°S, 63.1822°O", funFact:"Santa Cruz est la ville bolivienne à la croissance la plus rapide et le moteur économique du pays. Située dans les basses terres tropicales, à l'opposé de La Paz en altitude, elle est souvent surnommée 'La Ciudad de los Anillos' pour ses boulevards circulaires concentriques.", costs:{logement:300,courses:66,restos:44,nocturne:38,transport:13,sante:23,telecom:9,voyage:165} },
  { id:119, name:"Asunción", country:"Paraguay", flag:"🇵🇾", continent:"Amérique du Sud", coords:"25.2867°S, 57.6470°O", funFact:"Asunción est l'une des premières villes fondées en Amérique du Sud par les Espagnols (1537) et a servi de base pour la colonisation de toute la région du Río de la Plata. Le guaraní y est co-langue officielle avec l'espagnol.", costs:{logement:320,courses:68,restos:47,nocturne:39,transport:14,sante:24,telecom:9,voyage:150} },
  { id:120, name:"Caracas", country:"Venezuela", flag:"🇻🇪", continent:"Amérique du Sud", coords:"10.4806°N, 66.9036°O", funFact:"Caracas est encaissée dans une vallée à 900 m d'altitude, si bien que la ville jouit d'un printemps éternel avec une température moyenne de 22 °C toute l'année — on l'a longtemps surnommée 'la ville de l'éternel printemps'.", costs:{logement:200,courses:56,restos:36,nocturne:30,transport:8,sante:18,telecom:7,voyage:140} },
  { id:121, name:"Georgetown", country:"Guyana", flag:"🇬🇾", continent:"Amérique du Sud", coords:"6.8013°N, 58.1551°O", funFact:"Georgetown est l'une des rares capitales d'Amérique du Sud où l'anglais est langue officielle. La ville est construite en dessous du niveau de la mer et dépend d'un système de digues hérité de la colonisation néerlandaise pour ne pas être inondée.", costs:{logement:350,courses:73,restos:49,nocturne:40,transport:15,sante:25,telecom:10,voyage:170} },
  { id:122, name:"Paramaribo", country:"Suriname", flag:"🇸🇷", continent:"Amérique du Sud", coords:"5.8664°N, 55.1668°O", funFact:"Paramaribo est la seule capitale au monde où une cathédrale catholique en bois et une grande mosquée se font face sur la même place publique — symbole d'une cohabitation religieuse remarquable héritée de son histoire coloniale.", costs:{logement:340,courses:71,restos:48,nocturne:39,transport:14,sante:24,telecom:9,voyage:165} },
  { id:123, name:"Cayenne", country:"Guyane française", flag:"🇫🇷", continent:"Amérique du Sud", coords:"4.9224°N, 52.3135°O", funFact:"Cayenne est le territoire français le plus proche de l'Équateur. Le Centre Spatial Guyanais de Kourou, à 60 km, lance les fusées Ariane — l'équateur permet des lancements plus économiques grâce à la rotation terrestre.", costs:{logement:750,courses:150,restos:111,nocturne:70,transport:35,sante:55,telecom:22,voyage:280} },
  { id:124, name:"Córdoba", country:"Argentine", flag:"🇦🇷", continent:"Amérique du Sud", coords:"31.4201°S, 64.1888°O", funFact:"Córdoba est la deuxième ville d'Argentine et abrite la plus ancienne université d'Amérique du Sud fondée en 1613 — la Universidad Nacional de Córdoba. C'est aussi le berceau du mouvement estudiantin de 1918 qui a transformé les universités latino-américaines.", costs:{logement:340,courses:73,restos:52,nocturne:44,transport:17,sante:27,telecom:11,voyage:170} },
  { id:125, name:"Rosario", country:"Argentine", flag:"🇦🇷", continent:"Amérique du Sud", coords:"32.9468°S, 60.6393°O", funFact:"Rosario est la ville natale de Lionel Messi et d'Ernesto 'Che' Guevara — deux des personnalités argentines les plus connues au monde, nées à quelques rues d'intervalle. La ville est aussi le port depuis lequel les céréales argentines sont exportées vers le monde entier.", costs:{logement:320,courses:69,restos:49,nocturne:42,transport:15,sante:26,telecom:10,voyage:160} },
  { id:126, name:"Mendoza", country:"Argentine", flag:"🇦🇷", continent:"Amérique du Sud", coords:"32.8908°S, 68.8272°O", funFact:"Mendoza est la capitale mondiale du vin Malbec — ses vignobles d'altitude (900 m) produisent certains des meilleurs vins rouges du monde. Les Andes sont visibles depuis la ville et le ski à Aconcagua, le plus haut sommet hors d'Asie, est à portée.", costs:{logement:310,courses:68,restos:48,nocturne:41,transport:14,sante:25,telecom:10,voyage:175} },
  { id:127, name:"Bariloche", country:"Argentine", flag:"🇦🇷", continent:"Amérique du Sud", coords:"41.1335°S, 71.3103°O", funFact:"San Carlos de Bariloche est la capitale du chocolat artisanal argentin — la ville compte plus de boutiques de chocolat par habitant que n'importe quelle autre ville au monde. Ses paysages de lacs et montagnes lui ont valu le surnom de 'Suisse de l'Argentine'.", costs:{logement:380,courses:79,restos:58,nocturne:50,transport:20,sante:30,telecom:11,voyage:185} },
  { id:128, name:"Salta", country:"Argentine", flag:"🇦🇷", continent:"Amérique du Sud", coords:"24.7859°S, 65.4117°O", funFact:"Salta est surnommée 'Salta la Linda' (Salta la Belle) pour son architecture coloniale espagnole remarquablement bien conservée. La ville est le point de départ du 'Tren a las Nubes' (Train vers les nuages), l'un des plus hauts du monde à 4 220 m.", costs:{logement:290,courses:65,restos:45,nocturne:38,transport:13,sante:23,telecom:9,voyage:165} },
  { id:129, name:"Valparaíso", country:"Chili", flag:"🇨🇱", continent:"Amérique du Sud", coords:"33.0472°S, 71.6127°O", funFact:"Valparaíso est classée au patrimoine mondial de l'UNESCO pour son architecture colorée construite sur 42 collines. Pablo Neruda y avait une maison — La Sebastiana — et s'en est inspiré pour beaucoup de ses poèmes sur la mer.", costs:{logement:440,courses:87,restos:64,nocturne:52,transport:26,sante:33,telecom:13,voyage:155} },
  { id:130, name:"Concepción", country:"Chili", flag:"🇨🇱", continent:"Amérique du Sud", coords:"36.8270°S, 73.0503°O", funFact:"Concepción est la deuxième ville du Chili et la capitale culturelle du pays — elle a produit plus de groupes de rock chiliens que n'importe quelle autre ville, au point qu'on la surnomme 'la ciudad universitaria'.", costs:{logement:400,courses:81,restos:58,nocturne:48,transport:22,sante:30,telecom:12,voyage:148} },
  { id:131, name:"Cusco", country:"Pérou", flag:"🇵🇪", continent:"Amérique du Sud", coords:"13.5320°S, 71.9675°O", funFact:"Cusco était la capitale de l'empire inca, le plus grand empire précolombien d'Amérique. Les Incas construisaient leurs murs avec des pierres si parfaitement ajustées qu'aucun mortier n'était nécessaire — et certains murs ont survécu aux tremblements de terre quand les constructions espagnoles s'effondraient.", costs:{logement:300,courses:65,restos:44,nocturne:36,transport:14,sante:22,telecom:9,voyage:175} },
  { id:132, name:"Arequipa", country:"Pérou", flag:"🇵🇪", continent:"Amérique du Sud", coords:"16.4090°S, 71.5375°O", funFact:"Arequipa est surnommée 'La Ciudad Blanca' car ses bâtiments coloniaux sont construits en sillar, une pierre volcanique blanche extraite du volcan Misti qui domine la ville. C'est aussi la capitale gastronomique du Pérou selon de nombreux chefs.", costs:{logement:280,courses:61,restos:41,nocturne:34,transport:12,sante:20,telecom:8,voyage:165} },
  { id:133, name:"Trujillo", country:"Pérou", flag:"🇵🇪", continent:"Amérique du Sud", coords:"8.1116°S, 79.0288°O", funFact:"Trujillo est la capitale de la marinera, la danse nationale du Pérou. La ville est aussi au centre de la côte péruvienne, près de Chan Chan, la plus grande ville précolombienne construite en adobe du monde et classée au patrimoine UNESCO.", costs:{logement:260,courses:59,restos:39,nocturne:32,transport:11,sante:19,telecom:8,voyage:155} },
  { id:134, name:"La Havane", country:"Cuba", flag:"🇨🇺", continent:"Amérique du Sud", coords:"23.1136°N, 82.3666°O", funFact:"La Havane est une ville figée dans le temps — des milliers de voitures américaines des années 1950 circulent encore dans ses rues. Classée UNESCO, la vieille ville coloniale est l'une des mieux préservées des Amériques, par défaut d'investissement plutôt que par choix.", costs:{logement:250,courses:61,restos:39,nocturne:32,transport:10,sante:15,telecom:8,voyage:160} },
  { id:135, name:"Port-au-Prince", country:"Haïti", flag:"🇭🇹", continent:"Amérique du Sud", coords:"18.5944°N, 72.3074°O", funFact:"Haïti est la première République noire indépendante de l'histoire (1804), née d'une révolution d'esclaves unique au monde. Malgré ses difficultés, la ville abrite une scène artistique vivante, notamment la peinture naïve haïtienne reconnue internationalement.", costs:{logement:200,courses:54,restos:35,nocturne:28,transport:8,sante:15,telecom:7,voyage:155} },
  { id:136, name:"Quito", country:"Équateur", flag:"🇪🇨", continent:"Amérique du Sud", coords:"0.1807°S, 78.4678°O", funFact:"Quito se trouve à seulement 25 km de l'Équateur géographique. Par une bizarrerie de la géodésie, le monument de la 'Mitad del Mundo' est positionné à 240 m du vrai équateur — mais personne ne l'a su pendant des décennies.", costs:{logement:380,courses:77,restos:55,nocturne:45,transport:17,sante:28,telecom:11,voyage:160} },
  { id:137, name:"Bogotá", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"4.7110°N, 74.0721°O", funFact:"Bogotá ferme ses rues aux voitures chaque dimanche pour 121 km de 'Ciclovía' — la plus grande piste cyclable temporaire hebdomadaire du monde !", costs:{logement:430,courses:89,restos:59,nocturne:50,transport:18,sante:30,telecom:13,voyage:160} },
  { id:138, name:"Florianópolis", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"27.5954°S, 48.5480°O", funFact:"Florianópolis, surnommée 'Floripa', est une île réputée pour ses 42 plages et sa qualité de vie exceptionnelle. Elle attire les digital nomads du monde entier et a été classée meilleure ville d'Amérique Latine pour vivre selon plusieurs classements.", costs:{logement:420,courses:84,restos:61,nocturne:50,transport:22,sante:33,telecom:12,voyage:165} },
  { id:139, name:"Natal", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"5.7945°S, 35.2110°O", funFact:"Natal est surnommée 'Cidade do Sol' (Ville du Soleil) pour ses 300 jours de soleil par an et ses dunes géantes dorées. C'est le point du Brésil le plus proche de l'Afrique — seulement 3 000 km séparent Natal de Dakar.", costs:{logement:300,courses:69,restos:48,nocturne:39,transport:16,sante:26,telecom:9,voyage:150} },
  { id:140, name:"Maceió", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"9.6658°S, 35.7353°O", funFact:"Maceió possède certaines des plus belles piscines naturelles au monde — des lagons de couleur émeraude formés par des récifs coralliens à marée basse, où l'on peut se baigner par 2 m de fond avec une visibilité parfaite.", costs:{logement:310,courses:70,restos:49,nocturne:40,transport:16,sante:26,telecom:9,voyage:150} },
  { id:141, name:"Belém", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"1.4558°S, 48.5044°O", funFact:"Belém est la porte d'entrée de l'Amazonie depuis l'Atlantique. Son marché du Ver-o-Peso est l'un des plus grands marchés à ciel ouvert du monde — on y trouve des centaines de plantes médicinales, d'animaux et de fruits dont la plupart sont inconnus hors du Brésil.", costs:{logement:320,courses:71,restos:49,nocturne:40,transport:17,sante:27,telecom:10,voyage:160} },
  { id:142, name:"Goiânia", country:"Brésil", flag:"🇧🇷", continent:"Amérique du Sud", coords:"16.6869°S, 49.2648°O", funFact:"Goiânia a été fondée en 1933 et est connue pour être l'une des villes les plus arborées au monde — plus de 60 arbres par habitant. Elle possède aussi le plus grand parc urbain d'Amérique Latine, le Parque Flamboyant.", costs:{logement:340,courses:73,restos:51,nocturne:42,transport:18,sante:28,telecom:10,voyage:155} },
  { id:143, name:"Montevideo", country:"Uruguay", flag:"🇺🇾", continent:"Amérique du Sud", coords:"34.9011°S, 56.1645°O", funFact:"Montevideo est régulièrement classée première ville d'Amérique Latine en qualité de vie. Les Uruguayens sont aussi les plus grands consommateurs de maté au monde — ils se promènent avec leur thermos et leur calebasse à toute heure.", costs:{logement:480,courses:94,restos:69,nocturne:58,transport:24,sante:36,telecom:14,voyage:160} },
  { id:144, name:"Punta del Este", country:"Uruguay", flag:"🇺🇾", continent:"Amérique du Sud", coords:"34.9676°S, 54.9507°O", funFact:"Punta del Este est le Saint-Tropez de l'Amérique du Sud — en janvier et février, ses plages accueillent les élites brésiliennes et argentines. La célèbre sculpture 'La Main' (Los Dedos) émergeant du sable est devenue le symbole de la ville.", costs:{logement:600,courses:112,restos:83,nocturne:75,transport:28,sante:40,telecom:16,voyage:175} },
  { id:145, name:"Sucre", country:"Bolivie", flag:"🇧🇴", continent:"Amérique du Sud", coords:"19.0196°S, 65.2619°O", funFact:"Sucre est la capitale constitutionnelle de la Bolivie (La Paz est le siège du gouvernement) et est surnommée 'La Ciudad Blanca' pour ses bâtiments coloniaux blancs obligatoirement peints ainsi par décret municipal. La Bolivie a deux capitales — fait unique au monde.", costs:{logement:260,courses:59,restos:39,nocturne:32,transport:11,sante:19,telecom:8,voyage:165} },
  { id:146, name:"Cochabamba", country:"Bolivie", flag:"🇧🇴", continent:"Amérique du Sud", coords:"17.3895°S, 66.1568°O", funFact:"Cochabamba est surnommée la 'Ciudad Jardín' (Ville Jardin) pour son climat printanier toute l'année à 2 570 m d'altitude. Elle est aussi connue pour la 'Guerre de l'Eau' de 2000, un soulèvement populaire contre la privatisation de l'eau qui a inspiré des mouvements sociaux dans le monde entier.", costs:{logement:270,courses:60,restos:41,nocturne:34,transport:11,sante:20,telecom:8,voyage:160} },
  { id:147, name:"Barranquilla", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"10.9685°N, 74.7813°O", funFact:"Barranquilla est le berceau de Shakira — la pop star mondiale y est née et y a grandi. La ville est aussi connue pour son Carnaval, le deuxième plus grand au monde après Rio, classé au patrimoine immatériel de l'UNESCO.", costs:{logement:350,courses:74,restos:51,nocturne:42,transport:15,sante:25,telecom:10,voyage:145} },
  { id:148, name:"Buenaventura", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"3.8801°N, 77.0316°O", funFact:"Buenaventura est le principal port du Pacifique colombien et l'un des plus pluvieux au monde avec plus de 7 000 mm de pluie par an. La ville est aussi le creuset de la musique Pacific colombienne, une fusion afro-colombienne unique.", costs:{logement:280,courses:62,restos:41,nocturne:32,transport:13,sante:21,telecom:8,voyage:140} },
  { id:149, name:"Santa Marta", country:"Colombie", flag:"🇨🇴", continent:"Amérique du Sud", coords:"11.2408°N, 74.1990°O", funFact:"Santa Marta est la plus vieille ville de Colombie fondée par les Espagnols en 1525. C'est là que Simón Bolívar, le Libertador de l'Amérique du Sud, est mort en 1830 — et le parc national Tayrona, considéré comme l'un des plus beaux du monde, se trouve à 30 km.", costs:{logement:320,courses:69,restos:47,nocturne:39,transport:14,sante:23,telecom:9,voyage:150} },
  { id:150, name:"Maracaibo", country:"Venezuela", flag:"🇻🇪", continent:"Amérique du Sud", coords:"10.6319°N, 71.6457°O", funFact:"Maracaibo est connue pour le Relámpago del Catatumbo — un phénomène naturel unique où des éclairs illuminent le ciel presque 300 nuits par an au-dessus du lac de Maracaibo, sans presque jamais de tonnerre. La NASA le considère comme le 'phare naturel' du monde.", costs:{logement:180,courses:52,restos:34,nocturne:28,transport:7,sante:15,telecom:6,voyage:135} },

  // ── 50 villes d'Asie ──
  { id:151, name:"Pékin", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"39.9042°N, 116.4074°E", funFact:"Pékin a accueilli les Jeux Olympiques d'été (2008) ET d'hiver (2022) — seule ville au monde à avoir organisé les deux. La Cité Interdite compte 9 999 pièces : les architectes ont refusé le chiffre 10 000, réservé aux dieux.", costs:{logement:700,courses:117,restos:87,nocturne:80,transport:40,sante:50,telecom:18,voyage:250} },
  { id:152, name:"Shanghai", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"31.2304°N, 121.4737°E", funFact:"Shanghai possède le train le plus rapide du monde en exploitation commerciale — le Maglev atteint 431 km/h. La ville a construit en 20 ans plus de gratte-ciel que New York en un siècle.", costs:{logement:900,courses:131,restos:103,nocturne:95,transport:45,sante:55,telecom:20,voyage:270} },
  { id:153, name:"Hong Kong", country:"Chine (RAS)", flag:"🇭🇰", continent:"Asie", coords:"22.3193°N, 114.1694°E", funFact:"Hong Kong possède la plus haute densité de gratte-ciel au monde — plus de 9 000 tours de plus de 14 étages. La ville organise chaque soir un spectacle son et lumière synchronisé sur 44 immeubles du port Victoria, classé au Guinness World Records.", costs:{logement:1500,courses:178,restos:158,nocturne:130,transport:70,sante:80,telecom:30,voyage:280} },
  { id:154, name:"Osaka", country:"Japon", flag:"🇯🇵", continent:"Asie", coords:"34.6937°N, 135.5023°E", funFact:"Osaka est surnommée la 'cuisine du Japon' — les habitants disent 'Kuidaore' (mange jusqu'à en tomber). La ville a inventé le ramen instantané (Nissin Foods) et le takoyaki. L'expression locale de salutation est littéralement 'Tu as mangé ?'", costs:{logement:750,courses:136,restos:126,nocturne:90,transport:80,sante:50,telecom:30,voyage:260} },
  { id:155, name:"Kyoto", country:"Japon", flag:"🇯🇵", continent:"Asie", coords:"35.0116°N, 135.7681°E", funFact:"Kyoto a été épargnée par les bombes atomiques pendant la Seconde Guerre mondiale grâce à l'intervention du Secrétaire à la Guerre américain Henry Stimson, qui y avait passé sa lune de miel. La ville compte 1 600 temples bouddhistes et 400 sanctuaires shinto.", costs:{logement:700,courses:127,restos:114,nocturne:75,transport:70,sante:48,telecom:28,voyage:240} },
  { id:156, name:"Séoul", country:"Corée du Sud", flag:"🇰🇷", continent:"Asie", coords:"37.5665°N, 126.9780°E", funFact:"Séoul a la connexion Internet la plus rapide au monde — la K-pop se télécharge à la vitesse de la lumière !", costs:{logement:800,courses:141,restos:111,nocturne:90,transport:50,sante:60,telecom:30,voyage:280} },
  { id:157, name:"Busan", country:"Corée du Sud", flag:"🇰🇷", continent:"Asie", coords:"35.1796°N, 129.0756°E", funFact:"Busan est la deuxième ville de Corée et l'une des capitales mondiales du cinéma asiatique grâce au BIFF (Busan International Film Festival). La ville est célèbre pour son cimetière UN Memorial — le seul cimetière de l'ONU au monde.", costs:{logement:600,courses:117,restos:87,nocturne:70,transport:40,sante:50,telecom:25,voyage:240} },
  { id:158, name:"Taipei", country:"Taïwan", flag:"🇹🇼", continent:"Asie", coords:"25.0330°N, 121.5654°E", funFact:"Taipei 101 a été le plus haut bâtiment du monde de 2004 à 2010. La tour possède un amortisseur à masse accordée de 660 tonnes — une sphère géante dorée visible depuis l'intérieur qui empêche le bâtiment de s'effondrer lors des typhons.", costs:{logement:750,courses:127,restos:99,nocturne:80,transport:50,sante:55,telecom:25,voyage:260} },
  { id:159, name:"New Delhi", country:"Inde", flag:"🇮🇳", continent:"Asie", coords:"28.6139°N, 77.2090°E", funFact:"New Delhi a été construite par les Britanniques entre 1911 et 1931 pour remplacer Calcutta comme capitale. La ville est organisée autour de Connaught Place, un cercle parfait inspiré des villes romaines, visible depuis l'espace.", costs:{logement:350,courses:68,restos:43,nocturne:40,transport:20,sante:35,telecom:8,voyage:200} },
  { id:160, name:"Bangalore", country:"Inde", flag:"🇮🇳", continent:"Asie", coords:"12.9716°N, 77.5946°E", funFact:"Bangalore est la Silicon Valley de l'Inde — 35 % des informaticiens indiens y travaillent. La ville est aussi surnommée la 'Cité des Jardins' pour ses 1 000 parcs, héritage du Maharaja qui la planifiait comme une ville verte au XIXe siècle.", costs:{logement:400,courses:73,restos:47,nocturne:45,transport:22,sante:38,telecom:8,voyage:190} },
  { id:161, name:"Chennai", country:"Inde", flag:"🇮🇳", continent:"Asie", coords:"13.0827°N, 80.2707°E", funFact:"Chennai est la capitale culturelle de l'Inde du Sud et le berceau de la musique carnatique et de la danse Bharatanatyam. C'est aussi la 4e ville d'Inde en population et possède l'une des plus longues plages urbaines du monde (13 km).", costs:{logement:320,courses:66,restos:43,nocturne:35,transport:18,sante:32,telecom:7,voyage:185} },
  { id:162, name:"Kolkata", country:"Inde", flag:"🇮🇳", continent:"Asie", coords:"22.5726°N, 88.3639°E", funFact:"Kolkata (anciennement Calcutta) est la seule ville du monde à avoir encore des rickshaws tirés à la main — une tradition coloniale britannique que la ville refuse d'abandonner par respect pour les tireurs qui en dépendent.", costs:{logement:280,courses:61,restos:39,nocturne:32,transport:15,sante:28,telecom:7,voyage:180} },
  { id:163, name:"Karachi", country:"Pakistan", flag:"🇵🇰", continent:"Asie", coords:"24.8607°N, 67.0011°E", funFact:"Karachi est la plus grande ville du Pakistan et l'une des plus grandes mégapoles du monde avec 16 millions d'habitants. La ville produit 42 % des recettes fiscales totales du Pakistan — une concentration économique sans équivalent dans le monde.", costs:{logement:250,courses:56,restos:36,nocturne:25,transport:12,sante:25,telecom:7,voyage:180} },
  { id:164, name:"Lahore", country:"Pakistan", flag:"🇵🇰", continent:"Asie", coords:"31.5497°N, 74.3436°E", funFact:"Lahore est le cœur culturel du Pakistan — la 'Ville des Jardins' avec la fameuse Shalimar Garden classée UNESCO. Le Mela Chiraghan (Festival des Lumières) y rassemble chaque année des millions de personnes autour du tombeau d'un saint soufi.", costs:{logement:220,courses:52,restos:34,nocturne:22,transport:10,sante:22,telecom:6,voyage:175} },
  { id:165, name:"Dhaka", country:"Bangladesh", flag:"🇧🇩", continent:"Asie", coords:"23.8103°N, 90.4125°E", funFact:"Dhaka est la capitale mondiale de la densité urbaine — plus de 44 000 habitants au km². La ville est aussi le centre mondial de l'industrie textile bon marché, fournissant les plus grandes marques de mode mondiales.", costs:{logement:200,courses:47,restos:30,nocturne:20,transport:10,sante:20,telecom:6,voyage:175} },
  { id:166, name:"Katmandou", country:"Népal", flag:"🇳🇵", continent:"Asie", coords:"27.7172°N, 85.3240°E", funFact:"Katmandou est le point de départ de toutes les expéditions vers l'Everest. La vallée de Katmandou compte 7 sites classés au patrimoine mondial de l'UNESCO — la plus forte concentration au monde pour une superficie aussi réduite.", costs:{logement:220,courses:49,restos:31,nocturne:22,transport:10,sante:20,telecom:6,voyage:200} },
  { id:167, name:"Colombo", country:"Sri Lanka", flag:"🇱🇰", continent:"Asie", coords:"6.9271°N, 79.8612°E", funFact:"Colombo est connue pour être la capitale du thé de Ceylan — le Sri Lanka est le 4e producteur mondial. La ville abrite aussi la plus grande collection de gemmes non taillées au monde grâce à ses mines de saphirs, rubis et topazes.", costs:{logement:300,courses:63,restos:41,nocturne:32,transport:14,sante:25,telecom:8,voyage:195} },
  { id:168, name:"Islamabad", country:"Pakistan", flag:"🇵🇰", continent:"Asie", coords:"33.7294°N, 73.0931°E", funFact:"Islamabad est l'une des rares capitales construites de toutes pièces au XXe siècle, inaugurée en 1966. La ville est systématiquement classée la plus propre et la plus verte du Pakistan — ses rues arborées et ses parcs tranchent radicalement avec le chaos de Karachi.", costs:{logement:260,courses:57,restos:36,nocturne:26,transport:12,sante:24,telecom:7,voyage:178} },
  { id:169, name:"Kaboul", country:"Afghanistan", flag:"🇦🇫", continent:"Asie", coords:"34.5553°N, 69.2075°E", funFact:"Kaboul est l'une des capitales les plus hautes du monde à 1 800 m d'altitude. Malgré des décennies de conflits, la ville conserve un marché d'antiquités unique au monde où se côtoient objets de l'époque grecque bactérienne, mongole et moghole.", costs:{logement:180,courses:45,restos:28,nocturne:10,transport:8,sante:15,telecom:5,voyage:200} },
  { id:170, name:"Téhéran", country:"Iran", flag:"🇮🇷", continent:"Asie", coords:"35.6892°N, 51.3890°E", funFact:"Téhéran est entourée par les monts Alborz, si bien qu'on peut skier à moins de 30 minutes du centre-ville — la capitale iranienne possède 5 stations de ski accessibles en métro, une bizarrerie urbaine unique au monde.", costs:{logement:300,courses:66,restos:43,nocturne:25,transport:15,sante:28,telecom:9,voyage:190} },
  { id:171, name:"Bagdad", country:"Irak", flag:"🇮🇶", continent:"Asie", coords:"33.3152°N, 44.3661°E", funFact:"Bagdad fut la capitale du califat abbasside et la plus grande ville du monde au IXe siècle avec 1 million d'habitants — quand Paris en comptait 20 000. La Maison de la Sagesse y était le plus grand centre intellectuel de l'époque.", costs:{logement:250,courses:56,restos:36,nocturne:15,transport:12,sante:22,telecom:8,voyage:190} },
  { id:172, name:"Riyad", country:"Arabie Saoudite", flag:"🇸🇦", continent:"Asie", coords:"24.7136°N, 46.6753°E", funFact:"Riyad projette de construire 'The Line', une mégastructure linéaire de 170 km de long, 200 m de large et 500 m de haut pour 9 millions d'habitants — sans voitures, sans routes et fonctionnant à 100 % aux énergies renouvelables d'ici 2030.", costs:{logement:900,courses:131,restos:111,nocturne:30,transport:50,sante:65,telecom:25,voyage:280} },
  { id:173, name:"Doha", country:"Qatar", flag:"🇶🇦", continent:"Asie", coords:"25.2854°N, 51.5310°E", funFact:"Doha a organisé la Coupe du Monde 2022 — le premier tournoi en hiver et dans un pays arabe. Pour refroidir les stades, le Qatar a dépensé plus d'énergie en climatisation que certains pays en une année entière.", costs:{logement:1100,courses:150,restos:142,nocturne:50,transport:60,sante:70,telecom:30,voyage:290} },
  { id:174, name:"Koweït City", country:"Koweït", flag:"🇰🇼", continent:"Asie", coords:"29.3759°N, 47.9774°E", funFact:"Le Koweït possède plus de pétrole par habitant que n'importe quel autre pays. Koweït City abrite la Tour du Koweït, inaugurée en 1979 — un chef-d'œuvre d'architecture islamique moderniste qui stocke l'eau de mer dessalinisée.", costs:{logement:950,courses:138,restos:116,nocturne:35,transport:55,sante:65,telecom:28,voyage:275} },
  { id:175, name:"Manille", country:"Philippines", flag:"🇵🇭", continent:"Asie", coords:"14.5995°N, 120.9842°E", funFact:"Manille est la ville la plus densément peuplée du monde avec 111 000 habitants au km² dans certains quartiers. Les Philippines sont aussi le pays où l'on envoie le plus de SMS par habitant — les Philippins ont été surnommés 'la nation des textos'.", costs:{logement:380,courses:73,restos:49,nocturne:42,transport:18,sante:30,telecom:10,voyage:210} },
  { id:176, name:"Kuala Lumpur", country:"Malaisie", flag:"🇲🇾", continent:"Asie", coords:"3.1390°N, 101.6869°E", funFact:"Kuala Lumpur abrite les Tours Petronas, qui furent les plus hautes tours du monde de 1998 à 2004. La passerelle au 41e étage entre les deux tours est l'une des attractions les plus photographiées d'Asie du Sud-Est.", costs:{logement:550,courses:94,restos:67,nocturne:60,transport:35,sante:45,telecom:15,voyage:220} },
  { id:177, name:"Jakarta", country:"Indonésie", flag:"🇮🇩", continent:"Asie", coords:"6.2088°S, 106.8456°E", funFact:"Jakarta est en train de sombrer littéralement : le nord de la ville s'enfonce de 25 cm par an à cause du pompage excessif des eaux souterraines. L'Indonésie a décidé de déplacer sa capitale vers Nusantara sur l'île de Bornéo.", costs:{logement:450,courses:82,restos:57,nocturne:55,transport:25,sante:38,telecom:12,voyage:215} },
  { id:178, name:"Bali (Denpasar)", country:"Indonésie", flag:"🇮🇩", continent:"Asie", coords:"8.6705°S, 115.2126°E", funFact:"Bali est la seule île majoritairement hindoue d'Indonésie — un pays à 87 % musulman. Chaque famille balinaise possède son propre temple privé. La fête de Nyepi (Jour du Silence) impose 24h sans bruit, sans lumière ni déplacements — même l'aéroport ferme.", costs:{logement:400,courses:75,restos:53,nocturne:50,transport:20,sante:32,telecom:10,voyage:220} },
  { id:179, name:"Ho Chi Minh-Ville", country:"Viêt Nam", flag:"🇻🇳", continent:"Asie", coords:"10.8231°N, 106.6297°E", funFact:"Ho Chi Minh-Ville (ex-Saïgon) abrite plus de 9 millions de motos — soit 1 moto pour 1 habitant. Les embouteillages de scooters sont si denses que traverser la rue est considéré comme un art nécessitant plusieurs années d'apprentissage.", costs:{logement:380,courses:70,restos:47,nocturne:42,transport:18,sante:30,telecom:9,voyage:205} },
  { id:180, name:"Hanoï", country:"Viêt Nam", flag:"🇻🇳", continent:"Asie", coords:"21.0285°N, 105.8542°E", funFact:"Hanoï est l'une des capitales les plus anciennes d'Asie du Sud-Est, fondée en 1010. Le quartier des 36 rues de Hanoï doit son organisation médiévale aux corporations — chaque rue porte encore le nom du métier qui y était pratiqué.", costs:{logement:340,courses:65,restos:43,nocturne:38,transport:15,sante:27,telecom:8,voyage:200} },
  { id:181, name:"Phnom Penh", country:"Cambodge", flag:"🇰🇭", continent:"Asie", coords:"11.5564°N, 104.9282°E", funFact:"Phnom Penh fut abandonnée et entièrement vidée de ses habitants en 1975 par les Khmers Rouges — une des rares capitales de l'histoire à avoir été délibérément dépeuplée. La ville a été reconstruite depuis et redevient un hub économique régional.", costs:{logement:300,courses:61,restos:39,nocturne:32,transport:13,sante:22,telecom:7,voyage:200} },
  { id:182, name:"Vientiane", country:"Laos", flag:"🇱🇦", continent:"Asie", coords:"17.9757°N, 102.6331°E", funFact:"Vientiane est la capitale la plus petite et la plus tranquille d'Asie du Sud-Est — surnommée 'la capitale qui ne stresse pas'. La ville ferme ses bars à minuit et les nuits y sont si calmes qu'on entend les grenouilles depuis le centre-ville.", costs:{logement:280,courses:59,restos:38,nocturne:28,transport:12,sante:20,telecom:7,voyage:195} },
  { id:183, name:"Rangoun", country:"Myanmar", flag:"🇲🇲", continent:"Asie", coords:"16.8661°N, 96.1951°E", funFact:"Rangoun abrite la Pagode Shwedagon, recouverte de 60 tonnes d'or pur et couronnée d'un diamant de 76 carats. Selon la tradition, elle aurait été construite il y a 2 600 ans — ce qui en ferait l'un des plus anciens monuments bouddhistes au monde.", costs:{logement:280,courses:56,restos:36,nocturne:25,transport:12,sante:20,telecom:7,voyage:210} },
  { id:184, name:"Naypyidaw", country:"Myanmar", flag:"🇲🇲", continent:"Asie", coords:"19.7633°N, 96.0785°E", funFact:"Naypyidaw est la capitale la plus mystérieuse du monde — construite en secret par la junte militaire en 2005, la ville fantôme compte 20 voies autoroutières parfaitement asphaltées... presque entièrement vides. Sa construction reste l'un des chantiers les plus coûteux de l'histoire de l'Asie.", costs:{logement:220,courses:49,restos:32,nocturne:15,transport:10,sante:18,telecom:6,voyage:195} },
  { id:185, name:"Chengdu", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"30.5728°N, 104.0668°E", funFact:"Chengdu est la capitale mondiale du panda géant — la ville abrite la plus grande base de reproduction des pandas du monde. Les habitants de Chengdu sont aussi réputés pour être les plus détendus de Chine : la ville est la capitale mondiale du jeu de mahjong et du thé bu en terrasse.", costs:{logement:550,courses:94,restos:71,nocturne:65,transport:35,sante:42,telecom:15,voyage:240} },
  { id:186, name:"Chongqing", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"29.5630°N, 106.5516°E", funFact:"Chongqing est la plus grande municipalité au monde en superficie — plus grande que l'Autriche — avec 32 millions d'habitants. La ville est célèbre pour ses 'bangbang men', ces porteurs de bambou qui grimpent des centaines de marches pour livrer des marchandises dans les ruelles escarpées.", costs:{logement:480,courses:87,restos:64,nocturne:58,transport:30,sante:38,telecom:13,voyage:235} },
  { id:187, name:"Guangzhou", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"23.1291°N, 113.2644°E", funFact:"Guangzhou (Canton) est la capitale gastronomique de la Chine — la cuisine cantonaise est la plus connue au monde grâce aux immigrants chinois. La ville accueille aussi la plus grande foire commerciale du monde, la Canton Fair, deux fois par an.", costs:{logement:650,courses:103,restos:79,nocturne:72,transport:38,sante:45,telecom:16,voyage:250} },
  { id:188, name:"Shenzhen", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"22.5431°N, 114.0579°E", funFact:"Shenzhen était un village de pêcheurs de 30 000 habitants en 1979. Désignée première zone économique spéciale par Deng Xiaoping, elle compte aujourd'hui 13 millions d'habitants. C'est la capitale mondiale de l'électronique — Huawei, Tencent et DJI y ont leur siège.", costs:{logement:750,courses:112,restos:85,nocturne:78,transport:40,sante:48,telecom:17,voyage:255} },
  { id:189, name:"Xi'an", country:"Chine", flag:"🇨🇳", continent:"Asie", coords:"34.3416°N, 108.9398°E", funFact:"Xi'an est l'une des plus anciennes villes du monde et le point de départ de la Route de la Soie. L'Armée de Terre Cuite — 8 000 soldats de céramique grandeur nature enterrés depuis 210 av. J.-C. — a été découverte par des paysans en creusant un puits en 1974.", costs:{logement:450,courses:82,restos:59,nocturne:50,transport:28,sante:38,telecom:13,voyage:230} },
  { id:190, name:"Macao", country:"Chine (RAS)", flag:"🇲🇴", continent:"Asie", coords:"22.1987°N, 113.5439°E", funFact:"Macao génère plus de revenus issus du jeu que Las Vegas — environ 7 fois plus. La ville est aussi le seul endroit en Chine où les jeux d'argent sont légaux, ce qui en fait une enclave unique avec le PIB par habitant parmi les plus élevés du monde.", costs:{logement:1200,courses:159,restos:142,nocturne:115,transport:55,sante:70,telecom:28,voyage:260} },
  { id:191, name:"Almaty", country:"Kazakhstan", flag:"🇰🇿", continent:"Asie", coords:"43.2220°N, 76.8512°E", funFact:"Almaty est l'ancienne capitale du Kazakhstan et reste la plus grande ville du pays. Nichée au pied des montagnes Tian Shan à 900 m d'altitude, la ville possède un domaine skiable accessible directement depuis le centre en 15 minutes — une rareté pour une grande métropole.", costs:{logement:380,courses:73,restos:51,nocturne:45,transport:20,sante:32,telecom:11,voyage:210} },
  { id:192, name:"Tachkent", country:"Ouzbékistan", flag:"🇺🇿", continent:"Asie", coords:"41.2995°N, 69.2401°E", funFact:"Tachkent est la plus grande ville d'Asie centrale et fut entièrement reconstruite après un tremblement de terre dévastateur en 1966. La ville possède l'un des métros les plus beaux du monde — chaque station est décorée comme un musée avec mosaïques, lustres et marbres uniques.", costs:{logement:290,courses:59,restos:39,nocturne:32,transport:12,sante:22,telecom:7,voyage:205} },
  { id:193, name:"Tbilissi", country:"Géorgie", flag:"🇬🇪", continent:"Asie", coords:"41.6938°N, 44.8015°E", funFact:"Tbilissi est l'une des plus anciennes villes du monde, fondée au Ve siècle selon la légende par un roi qui suivit un faisan blessé tombé dans une source chaude sulfureuse. La ville est aussi le berceau du vin — la Géorgie revendique 8 000 ans de viticulture.", costs:{logement:380,courses:73,restos:51,nocturne:44,transport:18,sante:28,telecom:10,voyage:200} },
  { id:194, name:"Erevan", country:"Arménie", flag:"🇦🇲", continent:"Asie", coords:"40.1872°N, 44.5152°E", funFact:"Erevan est l'une des plus vieilles villes habitées en continu au monde — fondée en 782 av. J.-C., soit plus vieille que Rome. Depuis presque partout dans la ville, on peut voir le Mont Ararat — qui se trouve pourtant en Turquie, une douleur symbolique profonde pour les Arméniens.", costs:{logement:330,courses:65,restos:43,nocturne:38,transport:15,sante:25,telecom:9,voyage:195} },
  { id:195, name:"Bakou", country:"Azerbaïdjan", flag:"🇦🇿", continent:"Asie", coords:"40.4093°N, 49.8671°E", funFact:"Bakou est surnommée 'la ville des vents' et son nom signifie littéralement 'ville battue par les vents' en persan. Ses tours flammes illuminées la nuit — trois gratte-ciel en forme de flammes de pétrole — symbolisent l'or noir qui a rendu le pays riche.", costs:{logement:420,courses:77,restos:54,nocturne:48,transport:18,sante:30,telecom:10,voyage:208} },
  { id:196, name:"Ulaanbaatar", country:"Mongolie", flag:"🇲🇳", continent:"Asie", coords:"47.8864°N, 106.9057°E", funFact:"Ulaanbaatar est la capitale la plus froide du monde avec une température moyenne annuelle de -2 °C. La moitié de la population de Mongolie vit dans la capitale et beaucoup d'habitants nomades traditionnels y ont déplacé leurs yourtes — créant des quartiers entiers de tentes urbaines.", costs:{logement:300,courses:61,restos:39,nocturne:34,transport:14,sante:22,telecom:8,voyage:230} },
  { id:197, name:"Pyongyang", country:"Corée du Nord", flag:"🇰🇵", continent:"Asie", coords:"39.0392°N, 125.7625°E", funFact:"Pyongyang est la capitale la plus hermétique du monde — seuls quelques milliers de touristes encadrés y sont admis chaque année. La ville possède pourtant le métro le plus profond du monde (100 m), des stades géants et une fontaine lumineuse classée parmi les plus spectaculaires d'Asie.", costs:{logement:150,courses:38,restos:24,nocturne:10,transport:5,sante:10,telecom:3,voyage:300} },
  { id:198, name:"Dili", country:"Timor oriental", flag:"🇹🇱", continent:"Asie", coords:"8.5569°S, 125.5789°E", funFact:"Dili est la capitale du pays le plus jeune d'Asie — le Timor oriental a obtenu son indépendance en 2002 après plus de 400 ans de colonisation portugaise puis 24 ans d'occupation indonésienne. La ville s'ouvre sur une baie turquoise et des récifs parmi les mieux préservés du monde.", costs:{logement:280,courses:60,restos:39,nocturne:28,transport:12,sante:20,telecom:7,voyage:250} },
  { id:199, name:"Nur-Sultan (Astana)", country:"Kazakhstan", flag:"🇰🇿", continent:"Asie", coords:"51.1694°N, 71.4491°E", funFact:"Astana a été construite de zéro dans la steppe kazakhe en seulement 10 ans et est devenue l'une des villes les plus futuristes du monde — avec des bâtiments signés Norman Foster et une architecture entre Las Vegas et Dubaï. La ville a changé de nom 3 fois en 30 ans.", costs:{logement:360,courses:69,restos:48,nocturne:41,transport:17,sante:28,telecom:10,voyage:215} },
  { id:200, name:"Djakarta", country:"Indonésie", flag:"🇮🇩", continent:"Asie", coords:"6.2088°S, 106.8456°E", funFact:"Jakarta est en train d'être abandonnée comme capitale — le gouvernement indonésien a décidé de déplacer la capitale vers Nusantara sur Bornéo. Jakarta s'enfonce de 25 cm par an dans certains quartiers et sera partiellement sous les eaux d'ici 2050.", costs:{logement:450,courses:82,restos:57,nocturne:55,transport:25,sante:38,telecom:12,voyage:215} },

  // ── 50 villes d'Amérique du Nord ──
  { id:201, name:"Los Angeles", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"34.0522°N, 118.2437°O", funFact:"Los Angeles est la capitale mondiale du cinéma — mais aussi la ville avec le plus de highways au monde. Malgré cela, ses embouteillages sont si légendaires que les habitants mesurent les distances en minutes, jamais en km.", costs:{logement:1700,courses:300,restos:280,nocturne:160,transport:100,sante:120,telecom:48,voyage:260} },
  { id:202, name:"Chicago", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"41.8781°N, 87.6298°O", funFact:"Chicago est surnommée 'The Windy City' non pas pour son vent (d'autres villes sont plus venteuses) mais pour ses politiciens 'pleins de vent' au XIXe siècle. La ville a aussi inventé le gratte-ciel, le deep-dish pizza et la House music.", costs:{logement:1100,courses:260,restos:230,nocturne:150,transport:95,sante:110,telecom:45,voyage:230} },
  { id:203, name:"Houston", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"29.7604°N, 95.3698°O", funFact:"Houston est le centre mondial de l'industrie spatiale — la NASA y a son Centre de Contrôle Mission. La ville est aussi la plus diverse des États-Unis avec plus de 145 langues parlées et la plus grande communauté vietnamienne hors d'Asie.", costs:{logement:950,courses:240,restos:200,nocturne:130,transport:80,sante:105,telecom:42,voyage:220} },
  { id:204, name:"Miami", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"25.7617°N, 80.1918°O", funFact:"Miami est la seule grande ville américaine fondée par une femme — Julia Tuttle, en 1896. La ville est aujourd'hui la capitale latino des États-Unis : 70 % des habitants y parlent espagnol à la maison. C'est aussi la 4e place financière mondiale.", costs:{logement:1400,courses:275,restos:255,nocturne:180,transport:85,sante:115,telecom:46,voyage:240} },
  { id:205, name:"Seattle", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"47.6062°N, 122.3321°O", funFact:"Seattle est la ville où Starbucks, Amazon, Microsoft et Boeing ont été fondés — une concentration unique de géants technologiques pour une même ville. La Space Needle, construite pour l'Expo 62, était censée être démolie après l'exposition.", costs:{logement:1500,courses:285,restos:265,nocturne:155,transport:95,sante:120,telecom:50,voyage:250} },
  { id:206, name:"Boston", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"42.3601°N, 71.0589°O", funFact:"Boston abrite Harvard et MIT — les deux universités les plus influentes au monde à moins de 5 km l'une de l'autre. La ville a aussi déclenché la Révolution américaine avec la Boston Tea Party en 1773.", costs:{logement:1500,courses:280,restos:260,nocturne:155,transport:95,sante:115,telecom:48,voyage:240} },
  { id:207, name:"Washington D.C.", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"38.9072°N, 77.0369°O", funFact:"Washington D.C. est une ville conçue comme un symbole — ses avenues principales forment un pentagramme parfait visible depuis l'espace. Tous ses musées fédéraux (Smithsonian) sont gratuits — une politique unique parmi les grandes capitales mondiales.", costs:{logement:1500,courses:275,restos:255,nocturne:155,transport:90,sante:115,telecom:48,voyage:245} },
  { id:208, name:"Atlanta", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"33.7490°N, 84.3880°O", funFact:"Atlanta est le berceau du Coca-Cola, inventé par un pharmacien local en 1886 pour soigner les maux de tête. La ville abrite aussi CNN, Delta Airlines et le CDC — le Centre de Contrôle des Maladies des États-Unis.", costs:{logement:1100,courses:248,restos:215,nocturne:135,transport:78,sante:105,telecom:42,voyage:220} },
  { id:209, name:"Las Vegas", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"36.1699°N, 115.1398°O", funFact:"Las Vegas consomme plus d'électricité par habitant que n'importe quelle autre ville au monde — ses 30 millions de visiteurs annuels font tourner les casinos 24h/24. Le Strip est l'un des seuls endroits de la planète visible depuis l'espace la nuit.", costs:{logement:1050,courses:245,restos:230,nocturne:200,transport:70,sante:100,telecom:40,voyage:230} },
  { id:210, name:"Denver", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"39.7392°N, 104.9903°O", funFact:"Denver est la 'Mile High City' — exactement à 1 609 m d'altitude, marquée par une ligne de sièges violets dans le stade des Rockies. La ville est aussi la capitale américaine du cannabis légal depuis 2012 et possède plus de brasseries par habitant que n'importe quelle ville des USA.", costs:{logement:1150,courses:255,restos:225,nocturne:140,transport:82,sante:105,telecom:42,voyage:225} },
  { id:211, name:"Portland", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"45.5051°N, 122.6750°O", funFact:"Portland est la capitale mondiale du food truck — plus de 700 camions de cuisine de rue y opèrent légalement. La ville est aussi connue pour son slogan 'Keep Portland Weird' et ses 70 brasseries artisanales, le record mondial de densité de craft beer.", costs:{logement:1200,courses:258,restos:228,nocturne:140,transport:78,sante:108,telecom:44,voyage:235} },
  { id:212, name:"Nashville", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"36.1627°N, 86.7816°O", funFact:"Nashville est la capitale mondiale de la country music — le Grand Ole Opry y diffuse des concerts live depuis 1925 sans interruption. La ville est aussi le centre mondial de l'industrie musicale chrétienne et possède plus de bancs d'enregistrement au km² que Los Angeles.", costs:{logement:1000,courses:240,restos:210,nocturne:140,transport:72,sante:100,telecom:40,voyage:215} },
  { id:213, name:"Phoenix", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"33.4484°N, 112.0740°O", funFact:"Phoenix est la ville américaine qui connaît la croissance la plus rapide depuis 50 ans. Avec 110 jours dépassant les 38 °C par an, la ville est aussi l'une des premières à faire face aux défis concrets du changement climatique en zone urbaine.", costs:{logement:1000,courses:238,restos:205,nocturne:128,transport:72,sante:100,telecom:40,voyage:215} },
  { id:214, name:"Minneapolis", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"44.9778°N, 93.2650°O", funFact:"Minneapolis est reliée à Saint Paul par le plus grand réseau de skyways intérieurs au monde — 80 blocs de passerelles climatisées permettent de traverser le centre-ville sans jamais sortir par -30 °C. La ville est aussi la patrie de Prince.", costs:{logement:1000,courses:245,restos:212,nocturne:130,transport:78,sante:102,telecom:40,voyage:218} },
  { id:215, name:"New Orleans", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"29.9511°N, 90.0715°O", funFact:"La Nouvelle-Orléans est le berceau du jazz — Louis Armstrong y est né en 1901. La ville est construite en dessous du niveau de la mer, ce qui a rendu l'ouragan Katrina en 2005 particulièrement dévastateur. Son Mardi Gras est le plus grand festival de rue des États-Unis.", costs:{logement:900,courses:235,restos:205,nocturne:140,transport:65,sante:95,telecom:38,voyage:210} },
  { id:216, name:"Toronto", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"43.6532°N, 79.3832°O", funFact:"Toronto est la ville la plus multiculturelle au monde — plus de 50 % de ses habitants sont nés à l'étranger, représentant 200 nationalités. La CN Tower a été le bâtiment le plus haut du monde pendant 32 ans (1976–2007).", costs:{logement:1100,courses:268,restos:235,nocturne:145,transport:90,sante:65,telecom:42,voyage:225} },
  { id:217, name:"Vancouver", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"49.2827°N, 123.1207°O", funFact:"Vancouver est la seule grande ville d'Amérique du Nord où on peut skier le matin et surfer l'après-midi le même jour. La ville a aussi le plus grand Chinatown d'Amérique du Nord après San Francisco.", costs:{logement:1350,courses:278,restos:248,nocturne:148,transport:88,sante:65,telecom:44,voyage:240} },
  { id:218, name:"Calgary", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"51.0447°N, 114.0719°O", funFact:"Calgary est la ville canadienne avec le plus de millionnaires par habitant, grâce au boom pétrolier de l'Alberta. Le Stampede annuel est le plus grand rodéo au monde — 10 jours où même les banquiers portent des chapeaux de cow-boy.", costs:{logement:1050,courses:258,restos:225,nocturne:138,transport:82,sante:62,telecom:42,voyage:228} },
  { id:219, name:"Ottawa", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"45.4215°N, 75.6972°O", funFact:"Ottawa possède le plus long patinoire naturelle du monde sur le canal Rideau — 7,8 km de glace praticable en hiver. La ville est aussi réputée pour ses tulipes : les Pays-Bas en offrent 10 000 chaque année depuis 1945 en remerciement d'avoir protégé la famille royale néerlandaise.", costs:{logement:950,courses:248,restos:218,nocturne:130,transport:82,sante:62,telecom:40,voyage:218} },
  { id:220, name:"Québec City", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"46.8139°N, 71.2080°O", funFact:"Québec est la seule ville d'Amérique du Nord dont les remparts médiévaux sont encore intacts — classée au patrimoine mondial de l'UNESCO. Son Carnaval d'hiver est le plus grand au monde après Rio, avec des compétitions de canot à glace sur le Saint-Laurent.", costs:{logement:850,courses:238,restos:205,nocturne:122,transport:72,sante:58,telecom:38,voyage:208} },
  { id:221, name:"Edmonton", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"53.5461°N, 113.4938°O", funFact:"Edmonton est surnommée 'La Cité des Festivals' avec plus de 50 festivals annuels. Elle abrite aussi le plus grand mall au monde en Amérique du Nord, le West Edmonton Mall — avec son propre parc aquatique intérieur, une piste de glace et un terrain de golf.", costs:{logement:950,courses:245,restos:212,nocturne:128,transport:78,sante:60,telecom:40,voyage:220} },
  { id:222, name:"Guadalajara", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"20.6597°N, 103.3496°O", funFact:"Guadalajara est le berceau de deux des symboles les plus reconnaissables de la culture mexicaine : le mariachi et la tequila. La ville est aussi la Silicon Valley du Mexique — IBM et Intel y ont leurs plus grands centres de développement en Amérique Latine.", costs:{logement:420,courses:148,restos:115,nocturne:78,transport:18,sante:30,telecom:12,voyage:155} },
  { id:223, name:"Monterrey", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"25.6866°N, 100.3161°O", funFact:"Monterrey est le poumon économique du Mexique — la ville génère 25 % du PIB industriel national. La ville est aussi entourée d'un cirque de montagnes impressionnant (la Sierra Madre Orientale) avec le Cerro de la Silla, symbole de la ville, visible depuis partout.", costs:{logement:450,courses:155,restos:122,nocturne:85,transport:20,sante:32,telecom:13,voyage:160} },
  { id:224, name:"Cancún", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"21.1619°N, 86.8515°O", funFact:"Cancún n'existait pas en 1970 — c'était une jungle. Un ordinateur gouvernemental mexicain a sélectionné cet endroit comme destination touristique idéale et la ville a été construite de zéro. Aujourd'hui, 6 millions de touristes y débarquent chaque année.", costs:{logement:480,courses:165,restos:135,nocturne:95,transport:22,sante:32,telecom:13,voyage:170} },
  { id:225, name:"Oaxaca", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"17.0732°N, 96.7266°O", funFact:"Oaxaca est la capitale gastronomique du Mexique — berceau du mole (sauce chocolat-piment), du mezcal artisanal et des tlayudas. La fête des Morts (Día de Muertos) y est la plus spectaculaire du monde avec des défilés de squelettes géants dans les rues.", costs:{logement:320,courses:132,restos:102,nocturne:65,transport:14,sante:24,telecom:10,voyage:148} },
  { id:226, name:"Puebla", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"19.0414°N, 98.2063°O", funFact:"Puebla est célèbre pour avoir inventé le chili con carne et les tacos al pastor. La ville a aussi été le théâtre de la bataille du 5 mai 1862 où le Mexique a vaincu l'armée française — la seule défaite de Napoléon III en Europe ou en Amérique.", costs:{logement:340,courses:138,restos:108,nocturne:68,transport:15,sante:26,telecom:10,voyage:150} },
  { id:227, name:"San José", country:"Costa Rica", flag:"🇨🇷", continent:"Amérique du Nord", coords:"9.9281°N, 84.0907°O", funFact:"Le Costa Rica a aboli son armée en 1948 — une des rares nations sans forces militaires — et a réinvesti ces fonds dans l'éducation et la santé. La promesse de 'Pura Vida' (Pure Vie) est à la fois une salutation et une philosophie d'existence.", costs:{logement:420,courses:158,restos:128,nocturne:82,transport:18,sante:38,telecom:14,voyage:175} },
  { id:228, name:"Ciudad de Guatemala", country:"Guatemala", flag:"🇬🇹", continent:"Amérique du Nord", coords:"14.6349°N, 90.5069°O", funFact:"La ville de Guatemala est construite sur un plateau à 1 500 m entouré de volcans actifs — dont le Pacaya qui crache régulièrement des coulées de lave à 30 km du centre-ville. La ville est la plus peuplée d'Amérique Centrale.", costs:{logement:320,courses:138,restos:105,nocturne:65,transport:13,sante:24,telecom:9,voyage:155} },
  { id:229, name:"Tegucigalpa", country:"Honduras", flag:"🇭🇳", continent:"Amérique du Nord", coords:"14.0723°N, 87.2024°O", funFact:"Tegucigalpa est l'une des seules capitales au monde sans gare ferroviaire ni aéroport plat — son aéroport Toncontín est classé parmi les plus dangereux du monde car les avions doivent slalomer entre les montagnes avant d'atterrir sur une piste courte au bord d'un ravin.", costs:{logement:280,courses:125,restos:95,nocturne:58,transport:11,sante:20,telecom:8,voyage:148} },
  { id:230, name:"San Salvador", country:"El Salvador", flag:"🇸🇻", continent:"Amérique du Nord", coords:"13.6929°N, 89.2182°O", funFact:"El Salvador est le premier pays au monde à avoir adopté le Bitcoin comme monnaie légale officielle en 2021. San Salvador possède aussi l'un des plus hauts taux de densité de pupuserías (restaurants de pupusas, plat national) au monde.", costs:{logement:290,courses:128,restos:98,nocturne:60,transport:11,sante:21,telecom:8,voyage:150} },
  { id:231, name:"Managua", country:"Nicaragua", flag:"🇳🇮", continent:"Amérique du Nord", coords:"12.1364°N, 86.2514°O", funFact:"Managua est l'une des rares capitales au monde sans vrai centre-ville — son centre historique a été détruit par un tremblement de terre en 1972 et n'a jamais été reconstruit. La ville est aujourd'hui un dédale de quartiers sans cœur urbain identifiable.", costs:{logement:270,courses:120,restos:92,nocturne:55,transport:10,sante:19,telecom:7,voyage:148} },
  { id:232, name:"Panama City", country:"Panama", flag:"🇵🇦", continent:"Amérique du Nord", coords:"8.9936°N, 79.5197°O", funFact:"Panama City est le seul endroit au monde où on peut voir le soleil se lever sur le Pacifique et se coucher sur l'Atlantique depuis la même ville. Le Canal de Panama a réduit de 15 000 km le trajet maritime entre New York et San Francisco.", costs:{logement:480,courses:175,restos:145,nocturne:98,transport:22,sante:38,telecom:14,voyage:170} },
  { id:233, name:"La Havane", country:"Cuba", flag:"🇨🇺", continent:"Amérique du Nord", coords:"23.1136°N, 82.3666°O", funFact:"La Havane est une ville figée dans le temps — des milliers de voitures américaines des années 1950 circulent encore dans ses rues. Classée UNESCO, la vieille ville coloniale est l'une des mieux préservées des Amériques, par manque d'investissement plutôt que par choix.", costs:{logement:250,courses:108,restos:82,nocturne:52,transport:8,sante:15,telecom:7,voyage:158} },
  { id:234, name:"Kingston", country:"Jamaïque", flag:"🇯🇲", continent:"Amérique du Nord", coords:"17.9970°N, 76.7936°O", funFact:"Kingston est la patrie de Bob Marley et le berceau du reggae et du dancehall. L'île a produit plus de champions du monde d'athlétisme par habitant que n'importe quel autre pays — dont Usain Bolt, le détenteur du record du monde du 100m.", costs:{logement:380,courses:148,restos:118,nocturne:78,transport:16,sante:28,telecom:11,voyage:165} },
  { id:235, name:"Port of Spain", country:"Trinité-et-Tobago", flag:"🇹🇹", continent:"Amérique du Nord", coords:"10.6918°N, 61.2225°O", funFact:"Port of Spain est le berceau du calypso, du soca et de la steel pan — l'instrument à percussion inventé dans les années 1930 à partir de fûts de pétrole vides. Le Carnaval de Trinidad est souvent considéré comme le plus créatif du monde.", costs:{logement:420,courses:158,restos:128,nocturne:85,transport:18,sante:30,telecom:12,voyage:170} },
  { id:236, name:"San Juan", country:"Porto Rico (USA)", flag:"🇵🇷", continent:"Amérique du Nord", coords:"18.4655°N, 66.1057°O", funFact:"San Juan est la deuxième plus vieille ville européenne des Amériques (après Saint-Domingue). Sa vieille ville bleue cobalt est classée au patrimoine de l'UNESCO et ses remparts espagnols dominent une baie turquoise — une image de carte postale devenue réalité.", costs:{logement:850,courses:222,restos:188,nocturne:118,transport:45,sante:60,telecom:35,voyage:195} },
  { id:237, name:"Santo Domingo", country:"République Dominicaine", flag:"🇩🇴", continent:"Amérique du Nord", coords:"18.4861°N, 69.9312°O", funFact:"Santo Domingo est la première ville européenne fondée dans les Amériques (1496) par Bartholomée Colomb, frère de Christophe. La Zone Coloniale, classée UNESCO, contient le premier hôpital, la première université et la première cathédrale des Amériques.", costs:{logement:360,courses:142,restos:112,nocturne:72,transport:15,sante:26,telecom:10,voyage:158} },
  { id:238, name:"Havana", country:"Cuba", flag:"🇨🇺", continent:"Amérique du Nord", coords:"23.1136°N, 82.3666°O", funFact:"Les Cubains consomment le sucre de canne depuis 400 ans — le rhum Havana Club y est produit selon des recettes coloniales espagnoles. La ville est aussi célèbre pour ses soirées de salsa improvisées dans la rue.", costs:{logement:240,courses:105,restos:80,nocturne:50,transport:8,sante:14,telecom:6,voyage:155} },
  { id:239, name:"Bridgetown", country:"Barbade", flag:"🇧🇧", continent:"Amérique du Nord", coords:"13.0969°N, 59.6145°O", funFact:"La Barbade est la patrie de Rihanna — la chanteuse a été nommée ambassadrice nationale et une rue porte son nom. L'île est aussi connue pour être à l'origine du rhum moderne et pour avoir la plus haute densité de centenaires dans la Caraïbe.", costs:{logement:550,courses:188,restos:155,nocturne:98,transport:20,sante:38,telecom:14,voyage:175} },
  { id:240, name:"Nassau", country:"Bahamas", flag:"🇧🇸", continent:"Amérique du Nord", coords:"25.0480°N, 77.3558°O", funFact:"Nassau est l'un des ports de croisière les plus fréquentés du monde — 3,5 millions de passagers par an pour une île de 250 000 habitants. La ville était aussi au XVIIe siècle la capitale mondiale de la piraterie, repaire de Barbe Noire et Calico Jack.", costs:{logement:900,courses:245,restos:215,nocturne:138,transport:30,sante:55,telecom:20,voyage:190} },
  { id:241, name:"Winnipeg", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"49.8951°N, 97.1384°O", funFact:"Winnipeg est le centre géographique du Canada et se vante du plus froid 'wind chill' parmi toutes les grandes villes du monde. Pourtant, la ville compte le plus grand nombre d'artistes per capita au Canada et son quartier Exchange District est classé lieu historique national.", costs:{logement:880,courses:238,restos:205,nocturne:120,transport:72,sante:58,telecom:38,voyage:210} },
  { id:242, name:"Halifax", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"44.6488°N, 63.5752°O", funFact:"Halifax a joué un rôle crucial dans les deux guerres mondiales comme port de départ des convois alliés. La ville a aussi connu en 1917 la plus grande explosion man-made avant Hiroshima — le naufrage de deux navires chargés de munitions a détruit la moitié de la ville.", costs:{logement:920,courses:242,restos:208,nocturne:122,transport:72,sante:58,telecom:38,voyage:212} },
  { id:243, name:"Victoria", country:"Canada", flag:"🇨🇦", continent:"Amérique du Nord", coords:"48.4284°N, 123.3656°O", funFact:"Victoria est surnommée 'La ville la plus britannique hors du Royaume-Uni' avec son parlement de style Westminster, ses pubs et ses jardins fleuris. Elle détient le record canadien de douceur climatique — des jonquilles y fleurissent en janvier.", costs:{logement:1050,courses:252,restos:222,nocturne:128,transport:72,sante:60,telecom:40,voyage:225} },
  { id:244, name:"Belize City", country:"Belize", flag:"🇧🇿", continent:"Amérique du Nord", coords:"17.2510°N, 88.7590°O", funFact:"Le Belize est le seul pays d'Amérique Centrale dont la langue officielle est l'anglais. La ville est le point de départ pour le Great Blue Hole, un trou sous-marin circulaire de 300 m de diamètre classé parmi les 10 plus beaux sites de plongée du monde.", costs:{logement:360,courses:145,restos:112,nocturne:68,transport:15,sante:26,telecom:10,voyage:170} },
  { id:245, name:"Pointe-à-Pitre", country:"Guadeloupe (France)", flag:"🇬🇵", continent:"Amérique du Nord", coords:"16.2490°N, 61.5530°O", funFact:"La Guadeloupe a la forme d'un papillon vu du ciel — ses deux îles principales sont séparées par une rivière salée (La Rivière Salée). L'île produit certains des meilleurs rhums agricoles du monde, élaborés directement à partir du jus de canne fraîche.", costs:{logement:780,courses:228,restos:195,nocturne:115,transport:32,sante:52,telecom:22,voyage:215} },
  { id:246, name:"Fort-de-France", country:"Martinique (France)", flag:"🇲🇶", continent:"Amérique du Nord", coords:"14.6037°N, 61.0786°O", funFact:"La Martinique est le berceau de l'impératrice Joséphine de Beauharnais, épouse de Napoléon Bonaparte. L'île est aussi connue pour la catastrophe de 1902 quand le volcan Mont Pelée a détruit en 2 minutes la ville de Saint-Pierre, tuant 30 000 personnes.", costs:{logement:800,courses:232,restos:198,nocturne:118,transport:32,sante:52,telecom:22,voyage:218} },
  { id:247, name:"Monterrey", country:"Mexique", flag:"🇲🇽", continent:"Amérique du Nord", coords:"25.6866°N, 100.3161°O", funFact:"Monterrey est le poumon économique du Mexique avec 25 % du PIB industriel national. Entourée de la Sierra Madre, elle combine industrie lourde et vie culturelle — avec la ville intérieure MARCO, l'un des plus beaux musées d'art contemporain d'Amérique Latine.", costs:{logement:450,courses:155,restos:122,nocturne:85,transport:20,sante:32,telecom:13,voyage:160} },
  { id:248, name:"San Diego", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"32.7157°N, 117.1611°O", funFact:"San Diego est la ville américaine avec le meilleur climat — 266 jours de soleil par an et une température moyenne annuelle de 18 °C. C'est aussi la 2e ville de Californie, avec la plus grande base militaire navale du monde et le zoo le plus visité des États-Unis.", costs:{logement:1500,courses:278,restos:248,nocturne:148,transport:88,sante:115,telecom:46,voyage:242} },
  { id:249, name:"Austin", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"30.2672°N, 97.7431°O", funFact:"Austin est la capitale mondiale de la musique live — plus de 250 salles de concert pour 950 000 habitants. La ville abrite aussi le festival SXSW, le plus grand rassemblement mondial de musique, cinéma et technologie avec 400 000 participants chaque mars.", costs:{logement:1150,courses:252,restos:222,nocturne:142,transport:78,sante:105,telecom:42,voyage:225} },
  { id:250, name:"Philadelphia", country:"États-Unis", flag:"🇺🇸", continent:"Amérique du Nord", coords:"39.9526°N, 75.1652°O", funFact:"Philadelphie est le berceau des États-Unis — la Déclaration d'Indépendance y a été signée en 1776. La ville est aussi la capitale mondiale du cheesesteak (steak sandwich au fromage fondu) et abrite le Philadelphia Museum of Art, dont les marches ont été rendues célèbres par Rocky.", costs:{logement:1100,courses:252,restos:222,nocturne:138,transport:82,sante:108,telecom:43,voyage:222} },
  // ── 50 villes d'Afrique ──
  { id:251, name:"Johannesburg", country:"Afrique du Sud", flag:"🇿🇦", continent:"Afrique", coords:"26.2041°S, 28.0473°E", funFact:"Johannesburg est bâtie sur la plus grande forêt urbaine plantée par l'homme au monde — 10 millions d'arbres ont été plantés depuis 1886. La ville est née littéralement de l'or : la découverte d'un filon en 1886 a transformé une ferme en mégapole en 10 ans.", costs:{logement:450,courses:148,restos:118,nocturne:80,transport:28,sante:42,telecom:14,voyage:195} },
  { id:252, name:"Le Cap", country:"Afrique du Sud", flag:"🇿🇦", continent:"Afrique", coords:"33.9249°S, 18.4241°E", funFact:"Le Cap est la seule ville au monde construite au pied d'un monument naturel classé au patrimoine mondial — la Montagne de la Table. La ville est aussi le point de départ historique de la circumnavigation africaine par Bartolomeu Dias en 1488.", costs:{logement:480,courses:152,restos:122,nocturne:82,transport:30,sante:44,telecom:15,voyage:198} },
  { id:253, name:"Durban", country:"Afrique du Sud", flag:"🇿🇦", continent:"Afrique", coords:"29.8587°S, 31.0218°E", funFact:"Durban possède la plus grande population d'origine indienne hors d'Inde au monde — plus de 1,2 million de personnes. La ville est aussi la capitale mondiale du surf sur vagues naturelles, avec une eau à 22 °C toute l'année.", costs:{logement:380,courses:138,restos:108,nocturne:70,transport:24,sante:38,telecom:13,voyage:185} },
  { id:254, name:"Pretoria", country:"Afrique du Sud", flag:"🇿🇦", continent:"Afrique", coords:"25.7479°S, 28.2293°E", funFact:"Pretoria est surnommée la 'Ville Jacaranda' — 70 000 jacarandas fleurissent en octobre, transformant la ville en un tapis violet spectaculaire. C'est aussi la capitale administrative de l'Afrique du Sud, pendant que Le Cap est la capitale législative.", costs:{logement:380,courses:135,restos:105,nocturne:68,transport:22,sante:36,telecom:12,voyage:182} },
  { id:255, name:"Accra", country:"Ghana", flag:"🇬🇭", continent:"Afrique", coords:"5.6037°N, 0.1870°O", funFact:"Accra est l'une des capitales africaines qui connaît la croissance la plus rapide. La ville est connue pour ses marchés de tissu kente multicolore et abrite Jamestown, un ancien fort colonial devenu quartier de boxe — le sport national du Ghana.", costs:{logement:380,courses:142,restos:110,nocturne:72,transport:18,sante:30,telecom:11,voyage:188} },
  { id:256, name:"Abidjan", country:"Côte d'Ivoire", flag:"🇨🇮", continent:"Afrique", coords:"5.3600°N, 4.0083°O", funFact:"Abidjan est surnommée la 'Paris de l'Afrique de l'Ouest' pour son architecture des années 1970 et sa vie culturelle. Elle produit 40 % du cacao mondial — chaque tablette de chocolat vendue dans le monde contient probablement du cacao d'ici.", costs:{logement:350,courses:135,restos:105,nocturne:68,transport:16,sante:28,telecom:10,voyage:182} },
  { id:257, name:"Dakar", country:"Sénégal", flag:"🇸🇳", continent:"Afrique", coords:"14.7167°N, 17.4677°O", funFact:"Dakar est le point le plus à l'ouest du continent africain — c'est de là que partaient historiquement les navires négriers. La ville est aussi connue pour le Rallye Dakar, qui se tient désormais en Arabie Saoudite mais garde son nom en hommage à la capitale sénégalaise.", costs:{logement:300,courses:122,restos:92,nocturne:58,transport:14,sante:24,telecom:9,voyage:175} },
  { id:258, name:"Douala", country:"Cameroun", flag:"🇨🇲", continent:"Afrique", coords:"4.0511°N, 9.7679°E", funFact:"Douala est le poumon économique du Cameroun et le plus grand port d'Afrique centrale. La ville est aussi réputée pour sa scène musicale — le makossa, genre musical créé par Manu Dibango à Douala, a influencé Michael Jackson dans 'Wanna Be Startin' Somethin'.", costs:{logement:320,courses:128,restos:98,nocturne:62,transport:15,sante:26,telecom:10,voyage:178} },
  { id:259, name:"Yaoundé", country:"Cameroun", flag:"🇨🇲", continent:"Afrique", coords:"3.8480°N, 11.5021°E", funFact:"Yaoundé est construite sur sept collines — tout comme Rome et Lisbonne. La ville est surnommée 'la ville aux sept collines' et est connue pour son architecture coloniale française et son marché central, l'un des plus animés d'Afrique centrale.", costs:{logement:290,courses:118,restos:90,nocturne:56,transport:13,sante:23,telecom:9,voyage:172} },
  { id:260, name:"Addis-Abeba", country:"Éthiopie", flag:"🇪🇹", continent:"Afrique", coords:"9.0320°N, 38.7469°E", funFact:"Addis-Abeba est le siège de l'Union Africaine et la capitale diplomatique du continent. La ville est aussi le berceau du café arabica — selon la légende, un berger éthiopien nommé Kaldi remarqua l'énergie de ses chèvres après avoir mangé des cerises de caféier.", costs:{logement:280,courses:112,restos:85,nocturne:52,transport:12,sante:22,telecom:8,voyage:182} },
  { id:261, name:"Dar es Salaam", country:"Tanzanie", flag:"🇹🇿", continent:"Afrique", coords:"6.7924°S, 39.2083°E", funFact:"Dar es Salaam signifie 'Havre de paix' en arabe — nom donné par le sultan de Zanzibar qui l'a fondée en 1862. La ville est le point de départ pour l'Île de Zanzibar et le Kilimandjaro, tous deux accessibles en quelques heures.", costs:{logement:300,courses:118,restos:90,nocturne:58,transport:13,sante:24,telecom:9,voyage:188} },
  { id:262, name:"Kampala", country:"Ouganda", flag:"🇺🇬", continent:"Afrique", coords:"0.3476°N, 32.5825°E", funFact:"Kampala est construite sur sept collines, tout comme Rome — une coïncidence architecturale qui frappe les visiteurs. La ville est aussi l'une des plus jeunes populations du monde avec un âge médian de 15 ans, ce qui en fait l'une des capitales les plus dynamiques d'Afrique.", costs:{logement:260,courses:105,restos:78,nocturne:48,transport:11,sante:20,telecom:7,voyage:175} },
  { id:263, name:"Kigali", country:"Rwanda", flag:"🇷🇼", continent:"Afrique", coords:"1.9441°S, 30.0619°E", funFact:"Kigali est souvent citée comme la ville la plus propre d'Afrique — les sacs plastiques y sont interdits depuis 2008 et le dernier samedi du mois, tous les citoyens participent obligatoirement au nettoyage de leur quartier. La ville s'est transformée en hub technologique en 30 ans après le génocide de 1994.", costs:{logement:280,courses:112,restos:85,nocturne:50,transport:12,sante:22,telecom:8,voyage:185} },
  { id:264, name:"Lusaka", country:"Zambie", flag:"🇿🇲", continent:"Afrique", coords:"15.3875°S, 28.3228°E", funFact:"Lusaka est l'une des capitales africaines qui croît le plus vite, avec un taux de 4 % par an. La Zambie abrite les Chutes Victoria — la plus grande cascade du monde selon son rideau d'eau de 1,7 km de large — à 500 km de la capitale.", costs:{logement:270,courses:108,restos:82,nocturne:50,transport:11,sante:20,telecom:7,voyage:182} },
  { id:265, name:"Harare", country:"Zimbabwe", flag:"🇿🇼", continent:"Afrique", coords:"17.8252°S, 31.0335°E", funFact:"Harare a connu l'hyperinflation la plus sévère de l'histoire moderne — en 2008, un billet de 100 000 milliards de dollars zimbabwéens valait moins d'un dollar américain. La ville reste cependant une ville verte avec de nombreux parcs et jardins botaniques de l'époque coloniale.", costs:{logement:240,courses:100,restos:75,nocturne:45,transport:10,sante:18,telecom:6,voyage:175} },
  { id:266, name:"Maputo", country:"Mozambique", flag:"🇲🇿", continent:"Afrique", coords:"25.9692°S, 32.5732°E", funFact:"Maputo est l'une des rares capitales africaines avec une architecture coloniale portugaise remarquablement préservée — le marché de fer conçu par Eiffel (le même que la Tour Eiffel) trône au centre-ville. La ville est aussi réputée pour ses couchers de soleil sur la baie de Maputo.", costs:{logement:280,courses:112,restos:85,nocturne:52,transport:12,sante:22,telecom:8,voyage:178} },
  { id:267, name:"Antananarivo", country:"Madagascar", flag:"🇲🇬", continent:"Afrique", coords:"18.8792°S, 47.5079°E", funFact:"Madagascar est une île si isolée que 90 % de ses espèces animales et végétales sont endémiques — introuvables ailleurs sur Terre. Les lémuriens, symboles de l'île, n'existent qu'ici. Antananarivo (surnommée 'Tana') est construite sur 12 collines sacrées.", costs:{logement:220,courses:95,restos:72,nocturne:42,transport:9,sante:18,telecom:6,voyage:188} },
  { id:268, name:"Lomé", country:"Togo", flag:"🇹🇬", continent:"Afrique", coords:"6.1375°N, 1.2123°E", funFact:"Lomé est l'unique capitale africaine bordée directement par l'océan Atlantique — une plage de sable s'étend à quelques mètres du palais présidentiel. Le grand marché de Lomé abrite le marché des fétiches, le plus grand marché de médecine traditionnelle vaudou du monde.", costs:{logement:250,courses:100,restos:75,nocturne:45,transport:10,sante:18,telecom:6,voyage:170} },
  { id:269, name:"Cotonou", country:"Bénin", flag:"🇧🇯", continent:"Afrique", coords:"6.3654°N, 2.4183°E", funFact:"Cotonou est le siège économique du Bénin — le pays est considéré comme le berceau du vaudou, religion qui s'est répandue dans toute la Caraïbe via la traite négrière. Le Bénin a été le premier pays africain à organiser une transition démocratique pacifique en 1991.", costs:{logement:260,courses:105,restos:78,nocturne:47,transport:11,sante:19,telecom:6,voyage:172} },
  { id:270, name:"Niamey", country:"Niger", flag:"🇳🇪", continent:"Afrique", coords:"13.5137°N, 2.1098°E", funFact:"Niamey est l'une des capitales les plus proches du désert du Sahara — à quelques dizaines de km, le sable prend le dessus. Le Niger est le pays le plus chaud du monde selon les projections climatiques, et Niamey enregistre régulièrement des pics à 48 °C.", costs:{logement:200,courses:88,restos:65,nocturne:35,transport:8,sante:15,telecom:5,voyage:165} },
  { id:271, name:"Bamako", country:"Mali", flag:"🇲🇱", continent:"Afrique", coords:"12.6392°N, 8.0029°O", funFact:"Bamako est la capitale mondiale de la musique mandingue — des griots y perpétuent une tradition musicale orale vieille de 700 ans. Le Festival au Désert de Tombouctou, né près de Bamako, a réuni des artistes du monde entier avant d'être interrompu par les conflits.", costs:{logement:210,courses:90,restos:68,nocturne:38,transport:9,sante:16,telecom:5,voyage:168} },
  { id:272, name:"Ouagadougou", country:"Burkina Faso", flag:"🇧🇫", continent:"Afrique", coords:"12.3642°N, 1.5353°O", funFact:"Ouagadougou (souvent abrégée 'Ouaga') est connue pour son festival de cinéma africain, le FESPACO — le plus grand festival de cinéma d'Afrique qui se tient tous les deux ans. Le nom de la ville signifie 'tu es bienvenu chez nous, toi qui n'es pas de passage' en langue mooré.", costs:{logement:215,courses:90,restos:68,nocturne:38,transport:9,sante:16,telecom:5,voyage:168} },
  { id:273, name:"Conakry", country:"Guinée", flag:"🇬🇳", continent:"Afrique", coords:"9.6412°N, 13.5784°O", funFact:"Conakry est construite sur une presqu'île en forme de doigt pointant vers l'Atlantique. La Guinée possède 40 % des réserves mondiales de bauxite (minerai d'aluminium) — un trésor sous-exploité qui en fait potentiellement l'un des pays les plus riches du continent.", costs:{logement:220,courses:92,restos:70,nocturne:40,transport:9,sante:16,telecom:5,voyage:168} },
  { id:274, name:"Freetown", country:"Sierra Leone", flag:"🇸🇱", continent:"Afrique", coords:"8.4657°N, 13.2317°O", funFact:"Freetown a été fondée en 1792 pour accueillir des esclaves affranchis et des Noirs loyalistes qui avaient combattu pour les Britanniques pendant la Révolution américaine. Son nom — 'ville libre' — symbolise cette histoire unique. La ville est entourée de plages de sable blanc spectaculaires.", costs:{logement:210,courses:88,restos:65,nocturne:36,transport:8,sante:15,telecom:5,voyage:165} },
  { id:275, name:"Monrovia", country:"Libéria", flag:"🇱🇷", continent:"Afrique", coords:"6.3106°N, 10.8047°O", funFact:"Le Libéria est le seul pays africain fondé par des esclaves américains affranchis — Monrovia a été nommée en l'honneur du président américain James Monroe. Le pays n'a jamais été colonisé et son drapeau ressemble fortement au Stars and Stripes américain.", costs:{logement:200,courses:85,restos:62,nocturne:34,transport:8,sante:14,telecom:5,voyage:162} },
  { id:276, name:"Abuja", country:"Nigéria", flag:"🇳🇬", continent:"Afrique", coords:"9.0579°N, 7.4951°E", funFact:"Abuja est une capitale construite de zéro dans les années 1980 pour remplacer Lagos — trop surpeuplée et difficile à gouverner. La ville est géométriquement planifiée autour du Rocher d'Aso, une formation granitique géante qui domine le paysage.", costs:{logement:350,courses:132,restos:102,nocturne:65,transport:16,sante:28,telecom:10,voyage:175} },
  { id:277, name:"Kano", country:"Nigéria", flag:"🇳🇬", continent:"Afrique", coords:"12.0000°N, 8.5167°E", funFact:"Kano est l'une des plus vieilles villes d'Afrique subsaharienne — son émirat existe depuis le XIe siècle. La ville est aussi le centre de la teinture à l'indigo avec ses fosses à teinture vieilles de 500 ans, encore en activité au cœur de la vieille ville.", costs:{logement:240,courses:98,restos:72,nocturne:42,transport:10,sante:18,telecom:6,voyage:168} },
  { id:278, name:"Ibadan", country:"Nigéria", flag:"🇳🇬", continent:"Afrique", coords:"7.3776°N, 3.9470°E", funFact:"Ibadan était la plus grande ville d'Afrique subsaharienne avant l'essor de Lagos. Elle abrite l'Université d'Ibadan, la première université du Nigeria (1948), et reste le centre intellectuel du pays. La ville est entièrement construite à flanc de collines sans plan d'urbanisme apparent.", costs:{logement:230,courses:95,restos:70,nocturne:40,transport:9,sante:17,telecom:5,voyage:165} },
  { id:279, name:"Libreville", country:"Gabon", flag:"🇬🇦", continent:"Afrique", coords:"0.4162°N, 9.4673°E", funFact:"Libreville a été fondée en 1849 par des esclaves affranchis capturés sur un navire brésilien — d'où son nom 'ville libre'. Le Gabon est l'un des pays les plus boisés du monde avec 88 % de son territoire couvert de forêt tropicale et une politique de conservation exemplaire.", costs:{logement:480,courses:162,restos:125,nocturne:80,transport:20,sante:35,telecom:12,voyage:188} },
  { id:280, name:"Brazzaville", country:"Congo", flag:"🇨🇬", continent:"Afrique", coords:"4.2634°S, 15.2429°E", funFact:"Brazzaville est la seule capitale au monde qui fait face à une autre capitale étrangère à seulement 4 km — Kinshasa (RDC). On peut voir la skyline de l'une depuis l'autre. Un bac les relie en 20 minutes, mais les deux villes sont séparées par deux pays distincts.", costs:{logement:380,courses:142,restos:108,nocturne:68,transport:16,sante:28,telecom:10,voyage:178} },
  { id:281, name:"Kinshasa", country:"RD Congo", flag:"🇨🇩", continent:"Afrique", coords:"4.3217°S, 15.3220°E", funFact:"Kinshasa est la troisième plus grande ville d'Afrique et sera peut-être la plus grande mégapole du monde en 2100 selon l'ONU avec 83 millions d'habitants prévus. La soukous, genre musical congolais né à Kinshasa, a influencé toute la musique africaine moderne.", costs:{logement:280,courses:112,restos:85,nocturne:52,transport:12,sante:22,telecom:8,voyage:178} },
  { id:282, name:"Luanda", country:"Angola", flag:"🇦🇴", continent:"Afrique", coords:"8.8368°S, 13.2343°E", funFact:"Luanda a été pendant plusieurs années la ville la plus chère du monde pour les expatriés — une bière y coûtait 10 $, une pomme 20 $. Alimentée par le boom pétrolier, la ville mélange gratte-ciel ultramodernes et bidonvilles géants dans un contraste saisissant.", costs:{logement:650,courses:195,restos:155,nocturne:98,transport:28,sante:45,telecom:15,voyage:195} },
  { id:283, name:"Windhoek", country:"Namibie", flag:"🇳🇦", continent:"Afrique", coords:"22.5609°S, 17.0658°E", funFact:"Windhoek est l'une des capitales les plus propres et les mieux gérées d'Afrique. La Namibie est aussi le premier pays au monde à avoir inscrit la protection de l'environnement dans sa constitution. La ville est entourée d'un désert où les dunes sont parmi les plus hautes du monde.", costs:{logement:340,courses:130,restos:98,nocturne:60,transport:14,sante:28,telecom:10,voyage:185} },
  { id:284, name:"Gaborone", country:"Botswana", flag:"🇧🇼", continent:"Afrique", coords:"24.6282°S, 25.9231°E", funFact:"Gaborone est l'une des villes africaines qui a connu la croissance économique la plus rapide — le Botswana est passé en 30 ans du pays le plus pauvre du monde à un pays à revenu intermédiaire grâce aux diamants. Le Botswana produit 25 % des diamants mondiaux.", costs:{logement:360,courses:135,restos:102,nocturne:62,transport:15,sante:30,telecom:11,voyage:188} },
  { id:285, name:"Lilongwe", country:"Malawi", flag:"🇲🇼", continent:"Afrique", coords:"13.9626°S, 33.7741°E", funFact:"Lilongwe est l'une des capitales africaines les plus vertes — la ville est entourée de forêts et de parcs naturels. Le Malawi est surnommé le 'Pays Chaleureux d'Afrique' pour la réputation de gentillesse légendaire de ses habitants envers les étrangers.", costs:{logement:200,courses:85,restos:62,nocturne:34,transport:8,sante:14,telecom:5,voyage:168} },
  { id:286, name:"Moroni", country:"Comores", flag:"🇰🇲", continent:"Afrique", coords:"11.7022°S, 43.2551°E", funFact:"Les Comores sont la capitale mondiale de l'ylang-ylang, fleur utilisée dans les parfums de luxe (Chanel N°5 notamment). L'archipel est aussi l'un des pays les moins visités au monde, ce qui en fait une destination authentiquement préservée.", costs:{logement:260,courses:105,restos:78,nocturne:45,transport:11,sante:20,telecom:7,voyage:188} },
  { id:287, name:"Djibouti", country:"Djibouti", flag:"🇩🇯", continent:"Afrique", coords:"11.5892°N, 43.1456°E", funFact:"Djibouti est l'un des endroits les plus chauds de la planète — le Lac Assal, à 155 m sous le niveau de la mer, est le point le plus bas d'Afrique et le troisième au monde. La ville est aussi le carrefour stratégique où se concentrent les bases militaires de 10 pays différents.", costs:{logement:480,courses:165,restos:128,nocturne:78,transport:22,sante:35,telecom:12,voyage:195} },
  { id:288, name:"Mogadiscio", country:"Somalie", flag:"🇸🇴", continent:"Afrique", coords:"2.0469°N, 45.3182°E", funFact:"Mogadiscio est l'une des plus vieilles villes d'Afrique de l'Est, fondée au IXe siècle par des marchands arabes et perses. Malgré des décennies de conflits, la ville connaît depuis 2012 une reconstruction remarquable avec de nouveaux hôtels, restaurants et une scène musicale renaissante.", costs:{logement:200,courses:85,restos:62,nocturne:25,transport:8,sante:12,telecom:5,voyage:195} },
  { id:289, name:"Asmara", country:"Érythrée", flag:"🇪🇷", continent:"Afrique", coords:"15.3229°N, 38.9251°E", funFact:"Asmara est surnommée 'La Petite Rome' pour son architecture Art Déco des années 1930, la mieux conservée au monde en dehors de l'Europe. La ville a été classée au patrimoine mondial de l'UNESCO en 2017 — un joyau architectural méconnu à 2 300 m d'altitude.", costs:{logement:220,courses:92,restos:68,nocturne:38,transport:9,sante:16,telecom:5,voyage:175} },
  { id:290, name:"Khartoum", country:"Soudan", flag:"🇸🇩", continent:"Afrique", coords:"15.5007°N, 32.5599°E", funFact:"Khartoum est construite à la confluence du Nil Bleu et du Nil Blanc — le point de rencontre de deux grands fleuves. Son nom signifie 'trompe d'éléphant' en arabe, car la forme de la péninsule formée par les deux Nils ressemble à cette partie de l'animal.", costs:{logement:220,courses:92,restos:68,nocturne:35,transport:9,sante:16,telecom:5,voyage:175} },
  { id:291, name:"Tunis", country:"Tunisie", flag:"🇹🇳", continent:"Afrique", coords:"36.8065°N, 10.1815°E", funFact:"Tunis est l'une des grandes métropoles méditerranéennes les plus abordables. À quelques km du centre se trouve Carthage — l'ancienne rivale de Rome — dont les ruines classées UNESCO attestent d'une civilisation qui a failli changer l'histoire du monde.", costs:{logement:320,courses:120,restos:90,nocturne:55,transport:13,sante:24,telecom:9,voyage:165} },
  { id:292, name:"Alger", country:"Algérie", flag:"🇩🇿", continent:"Afrique", coords:"36.7372°N, 3.0869°E", funFact:"Alger est surnommée 'Alger la Blanche' pour ses bâtiments blancs qui scintillent sur la Méditerranée. La Casbah d'Alger, labyrinthe médiéval classé UNESCO, a inspiré de nombreux films et romans, dont le célèbre film 'La Bataille d'Alger' de Gillo Pontecorvo.", costs:{logement:280,courses:110,restos:82,nocturne:48,transport:11,sante:20,telecom:7,voyage:162} },
  { id:293, name:"Casablanca", country:"Maroc", flag:"🇲🇦", continent:"Afrique", coords:"33.5731°N, 7.5898°O", funFact:"Casablanca abrite la Mosquée Hassan II, la deuxième plus grande mosquée du monde après La Mecque, avec un minaret de 210 m visible depuis la mer. Malgré le film éponyme, aucune scène de Casablanca avec Humphrey Bogart n'a été tournée au Maroc.", costs:{logement:380,courses:138,restos:105,nocturne:65,transport:16,sante:28,telecom:10,voyage:170} },
  { id:294, name:"Rabat", country:"Maroc", flag:"🇲🇦", continent:"Afrique", coords:"34.0132°N, 6.8326°O", funFact:"Rabat est la capitale du Maroc mais sa quatrième ville en population. Le mausolée Mohammed V y est gardé 24h/24 par des soldats en djellaba blanche montés sur des chevaux blancs — une garde d'honneur parmi les plus spectaculaires au monde.", costs:{logement:350,courses:128,restos:98,nocturne:60,transport:14,sante:26,telecom:9,voyage:165} },
  { id:295, name:"Marrakech", country:"Maroc", flag:"🇲🇦", continent:"Afrique", coords:"31.6295°N, 7.9811°O", funFact:"La place Jemaa el-Fna de Marrakech est classée au patrimoine immatériel de l'UNESCO — c'est la seule place de marché du monde à avoir reçu cette distinction. La nuit, elle se transforme en un gigantesque théâtre à ciel ouvert avec conteurs, musiciens et charmeurs de serpents.", costs:{logement:360,courses:132,restos:100,nocturne:62,transport:14,sante:26,telecom:9,voyage:168} },
  { id:296, name:"Tripoli", country:"Libye", flag:"🇱🇾", continent:"Afrique", coords:"32.8872°N, 13.1913°E", funFact:"Tripoli est l'une des plus anciennes villes du monde méditerranéen — fondée par les Phéniciens au VIIe siècle av. J.-C. La vieille ville ottomane est labyrinthique et ses souks vendent encore de l'artisanat traditionnel libyen quasi intact depuis des siècles.", costs:{logement:280,courses:112,restos:85,nocturne:35,transport:12,sante:20,telecom:7,voyage:170} },
  { id:297, name:"Ndjamena", country:"Tchad", flag:"🇹🇩", continent:"Afrique", coords:"12.1048°N, 15.0442°E", funFact:"N'Djamena est l'une des villes les plus proches du centre géographique de l'Afrique. Le Tchad abrite le Lac Tchad, qui a rétrécit de 90 % en 50 ans à cause du changement climatique — passant de 25 000 km² à 2 500 km², une catastrophe environnementale majeure.", costs:{logement:210,courses:88,restos:65,nocturne:35,transport:9,sante:15,telecom:5,voyage:165} },
  { id:298, name:"Bangui", country:"Centrafrique", flag:"🇨🇫", continent:"Afrique", coords:"4.3612°N, 18.5550°E", funFact:"Bangui est traversée par l'Oubangui, une rivière large de 5 km qui sert de frontière naturelle avec la RDC. La Centrafrique est l'un des pays les plus riches en ressources naturelles non exploitées d'Afrique — diamants, uranium et bois précieux.", costs:{logement:200,courses:85,restos:62,nocturne:32,transport:8,sante:13,telecom:5,voyage:165} },
  { id:299, name:"Malabo", country:"Guinée Équatoriale", flag:"🇬🇶", continent:"Afrique", coords:"3.7500°N, 8.7833°E", funFact:"Malabo est une capitale insulaire construite sur l'île de Bioko, au milieu du golfe de Guinée. La Guinée Équatoriale est devenue l'un des pays les plus riches d'Afrique per capita grâce au pétrole — mais aussi l'un des plus inégalitaires.", costs:{logement:550,courses:178,restos:138,nocturne:85,transport:22,sante:38,telecom:13,voyage:195} },
  { id:300, name:"São Tomé", country:"São Tomé-et-Príncipe", flag:"🇸🇹", continent:"Afrique", coords:"0.1864°N, 6.6131°E", funFact:"São Tomé-et-Príncipe est le deuxième plus petit pays d'Afrique et l'un des moins connus au monde. Les îles sont situées exactement sur l'équateur et furent la première plantation de cacao au monde — exportant le chocolat vers l'Europe dès le XVIe siècle.", costs:{logement:280,courses:112,restos:85,nocturne:48,transport:11,sante:20,telecom:7,voyage:195} },

  // ── 50 villes d'Océanie ──
  { id:301, name:"Melbourne", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"37.8136°S, 144.9631°E", funFact:"Melbourne a été classée la ville la plus agréable à vivre au monde pendant 7 années consécutives par The Economist. La ville est aussi la capitale mondiale du café de spécialité — ses baristas ont inventé le flat white et le magic, exportés dans le monde entier.", costs:{logement:1100,courses:198,restos:175,nocturne:110,transport:110,sante:78,telecom:38,voyage:320} },
  { id:302, name:"Brisbane", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"27.4698°S, 153.0251°E", funFact:"Brisbane accueillera les Jeux Olympiques de 2032 — une ville qui a radicalement transformé ses berges du fleuve Brisbane ces 20 dernières années. La ville est le point de départ idéal pour la Côte d'Or et la Grande Barrière de Corail.", costs:{logement:980,courses:188,restos:165,nocturne:105,transport:105,sante:76,telecom:38,voyage:310} },
  { id:303, name:"Perth", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"31.9505°S, 115.8605°E", funFact:"Perth est la ville la plus isolée du monde — à 2 700 km de la prochaine grande ville australienne. Elle est plus proche de Singapour que de Sydney. Cette isolation lui a aussi valu d'être une des villes avec la meilleure qualité de vie au monde.", costs:{logement:950,courses:185,restos:162,nocturne:102,transport:100,sante:74,telecom:36,voyage:305} },
  { id:304, name:"Adelaide", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"34.9285°S, 138.6007°E", funFact:"Adelaide est surnommée la 'Ville des Festivals' — elle accueille le plus grand festival des arts de l'hémisphère sud (Adelaide Fringe) avec 7 000 spectacles en 4 semaines. La région est aussi au cœur de la production viticole australienne avec la Barossa Valley à 60 km.", costs:{logement:880,courses:178,restos:155,nocturne:98,transport:95,sante:72,telecom:35,voyage:298} },
  { id:305, name:"Canberra", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"35.2809°S, 149.1300°E", funFact:"Canberra est une ville entièrement planifiée — conçue par l'architecte américain Walter Burley Griffin en 1913 après un concours international. La ville a été choisie comme capitale fédérale car Sydney et Melbourne refusaient de se céder mutuellement la primauté.", costs:{logement:1000,courses:192,restos:168,nocturne:100,transport:100,sante:75,telecom:36,voyage:300} },
  { id:306, name:"Darwin", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"12.4634°S, 130.8456°E", funFact:"Darwin est la capitale la plus proche de l'Asie en Australie et la plus septentrionale. La ville a été entièrement détruite par le cyclone Tracy en 1974 — la plus grande évacuation de l'histoire australienne — et reconstruite de zéro en 2 ans.", costs:{logement:880,courses:182,restos:158,nocturne:100,transport:95,sante:72,telecom:35,voyage:295} },
  { id:307, name:"Hobart", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"42.8826°S, 147.3257°E", funFact:"Hobart est la deuxième plus ancienne ville d'Australie et la plus froide. Elle est connue pour le MONA (Museum of Old and New Art), un musée privé construit dans des cavernes sous terre qui a transformé l'île de Tasmanie en destination artistique mondiale.", costs:{logement:820,courses:172,restos:148,nocturne:92,transport:88,sante:70,telecom:34,voyage:285} },
  { id:308, name:"Gold Coast", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"28.0167°S, 153.4000°E", funFact:"Gold Coast est la capitale australienne du surf avec 57 km de plages et plus de 600 surfers professionnels inscrits. La ville accueille chaque année le Quiksilver Pro, l'une des manches du championnat du monde de surf.", costs:{logement:920,courses:182,restos:160,nocturne:108,transport:98,sante:73,telecom:36,voyage:305} },
  { id:309, name:"Auckland", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"36.8485°S, 174.7633°E", funFact:"Auckland est construite sur 50 volcans endormis — le dernier a éruplé il y a 600 ans. La ville est aussi le point de départ de la Coupe de l'América de voile, qui s'y tient régulièrement depuis 2000. Un tiers de la population néo-zélandaise y vit.", costs:{logement:1100,courses:198,restos:172,nocturne:108,transport:105,sante:75,telecom:38,voyage:320} },
  { id:310, name:"Wellington", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"41.2865°S, 174.7762°E", funFact:"Wellington est la capitale la plus venteuse du monde — surnommée 'Windy Welly'. C'est aussi la capitale mondiale du cinéma fantastique grâce à Peter Jackson : tous les films du Seigneur des Anneaux et de Hobbit y ont été tournés dans les studios Weta Workshop.", costs:{logement:980,courses:188,restos:162,nocturne:102,transport:98,sante:73,telecom:36,voyage:310} },
  { id:311, name:"Christchurch", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"43.5321°S, 172.6362°E", funFact:"Christchurch a été partiellement détruite par un séisme de magnitude 6,3 en 2011 — 185 personnes ont péri. La reconstruction a été l'occasion d'en faire une ville de la créativité avec des installations artistiques temporaires et une cathédrale de carton devenue icône mondiale.", costs:{logement:880,courses:178,restos:155,nocturne:98,transport:92,sante:71,telecom:35,voyage:305} },
  { id:312, name:"Queenstown", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"45.0312°S, 168.6626°E", funFact:"Queenstown est la capitale mondiale du saut à l'élastique — le premier saut commercial au monde y a eu lieu en 1988 depuis le Pont Kawarau. La ville est entourée des Alpes du Sud et du Lac Wakatipu, formant l'un des paysages les plus spectaculaires de la planète.", costs:{logement:980,courses:192,restos:168,nocturne:110,transport:98,sante:73,telecom:36,voyage:318} },
  { id:313, name:"Suva", country:"Fidji", flag:"🇫🇯", continent:"Océanie", coords:"18.1416°S, 178.4419°E", funFact:"Suva est la capitale la plus pluvieuse d'Océanie avec plus de 3 000 mm de pluie par an. Les Fidji sont composées de 333 îles dont seulement 110 sont habitées. La culture kava y est centrale — la boisson traditionnelle est consommée lors de chaque cérémonie officielle.", costs:{logement:320,courses:128,restos:98,nocturne:62,transport:14,sante:25,telecom:10,voyage:265} },
  { id:314, name:"Nadi", country:"Fidji", flag:"🇫🇯", continent:"Océanie", coords:"17.7765°S, 177.4356°E", funFact:"Nadi est la principale porte d'entrée des Fidji et le hub touristique du Pacifique Sud. La ville est célèbre pour ses temples hindous — 38 % des Fidjiens ont des origines indiennes, descendants des travailleurs emmenés par les Britanniques au XIXe siècle.", costs:{logement:300,courses:122,restos:92,nocturne:58,transport:13,sante:23,telecom:9,voyage:258} },
  { id:315, name:"Port Moresby", country:"Papouasie-Nouvelle-Guinée", flag:"🇵🇬", continent:"Océanie", coords:"9.4431°S, 147.1797°E", funFact:"La Papouasie-Nouvelle-Guinée est le pays le plus linguistiquement diversifié au monde — 839 langues y sont parlées pour 9 millions d'habitants. Port Moresby abrite une faune unique dont le casoar, oiseau géant incapable de voler mais capable de tuer un homme d'un coup de patte.", costs:{logement:600,courses:162,restos:125,nocturne:78,transport:22,sante:35,telecom:12,voyage:280} },
  { id:316, name:"Dili", country:"Timor oriental", flag:"🇹🇱", continent:"Océanie", coords:"8.5569°S, 125.5789°E", funFact:"Dili est la capitale du pays le plus jeune d'Asie du Sud-Est — le Timor oriental a obtenu son indépendance en 2002. La ville s'ouvre sur une baie turquoise avec des récifs parmi les mieux préservés du monde, quasi inconnus du tourisme de masse.", costs:{logement:280,courses:108,restos:80,nocturne:45,transport:10,sante:18,telecom:6,voyage:240} },
  { id:317, name:"Honiara", country:"Îles Salomon", flag:"🇸🇧", continent:"Océanie", coords:"9.4319°S, 159.9556°E", funFact:"Honiara est construite sur les plages où s'est déroulée la bataille de Guadalcanal (1942-43), l'une des plus sanglantes du Pacifique. Les eaux entourant les îles Salomon abritent des dizaines d'épaves de la Seconde Guerre mondiale, paradis des plongeurs.", costs:{logement:300,courses:118,restos:88,nocturne:48,transport:12,sante:20,telecom:7,voyage:268} },
  { id:318, name:"Port Vila", country:"Vanuatu", flag:"🇻🇺", continent:"Océanie", coords:"17.7333°S, 168.3167°E", funFact:"Le Vanuatu est régulièrement classé comme l'un des pays les plus heureux du monde malgré un PIB très faible — ses habitants accordent plus de valeur aux liens sociaux qu'à l'argent. L'archipel compte 83 îles et 113 langues différentes pour 300 000 habitants.", costs:{logement:350,courses:132,restos:102,nocturne:60,transport:14,sante:24,telecom:9,voyage:272} },
  { id:319, name:"Apia", country:"Samoa", flag:"🇼🇸", continent:"Océanie", coords:"13.8506°S, 171.7513°O", funFact:"Les Samoa ont décidé en 2011 de passer de l'ouest à l'est de la ligne internationale du changement de date — la population a littéralement sauté du jeudi au samedi, le vendredi 29 décembre 2011 n'ayant jamais existé. Une décision économique pour s'aligner sur l'Australie et la NZ.", costs:{logement:280,courses:112,restos:82,nocturne:48,transport:11,sante:20,telecom:7,voyage:262} },
  { id:320, name:"Pago Pago", country:"Samoa américaines", flag:"🇦🇸", continent:"Océanie", coords:"14.2756°S, 170.7020°O", funFact:"Pago Pago possède l'un des ports naturels les plus profonds du Pacifique Sud. Les Samoa américaines sont le seul territoire américain au sud de l'équateur. La capitale est célèbre pour son air pur et ses montagnes verdoyantes qui plongent directement dans la mer.", costs:{logement:380,courses:145,restos:112,nocturne:60,transport:16,sante:30,telecom:12,voyage:270} },
  { id:321, name:"Nukuʻalofa", country:"Tonga", flag:"🇹🇴", continent:"Océanie", coords:"21.1394°S, 175.2049°O", funFact:"Tonga est le seul royaume polynésien encore existant — la monarchie n'a jamais été colonisée. Le pays est aussi le champion du monde de rugby à XIII proportionnellement à sa population, produisant plus de joueurs professionnels par habitant que n'importe quel autre pays.", costs:{logement:280,courses:112,restos:82,nocturne:45,transport:11,sante:19,telecom:6,voyage:262} },
  { id:322, name:"Tarawa", country:"Kiribati", flag:"🇰🇮", continent:"Océanie", coords:"1.3290°N, 172.9790°E", funFact:"Kiribati est le premier pays au monde qui disparaîtra sous les eaux à cause du réchauffement climatique — ses îles ne dépassent pas 3 m d'altitude. Le gouvernement a déjà acheté des terres aux Fidji pour préparer l'évacuation des 120 000 habitants.", costs:{logement:260,courses:105,restos:78,nocturne:38,transport:10,sante:18,telecom:6,voyage:280} },
  { id:323, name:"Funafuti", country:"Tuvalu", flag:"🇹🇻", continent:"Océanie", coords:"8.5211°S, 179.1960°E", funFact:"Tuvalu est le quatrième plus petit pays du monde avec seulement 26 km² de terres — et l'un des plus menacés par la montée des eaux. Le pays a généré des revenus imprévus en vendant son code internet '.tv' à des chaînes de télévision pour des millions de dollars.", costs:{logement:280,courses:108,restos:80,nocturne:38,transport:10,sante:18,telecom:6,voyage:285} },
  { id:324, name:"Yaren", country:"Nauru", flag:"🇳🇷", continent:"Océanie", coords:"0.5477°S, 166.9209°E", funFact:"Nauru est le troisième plus petit pays du monde et le seul sans capitale officielle — Yaren est le district principal. L'île a connu un pic de richesse grâce au phosphate dans les années 1970 (plus haut PIB per capita mondial), puis a tout perdu en 20 ans quand la mine s'est épuisée.", costs:{logement:350,courses:135,restos:102,nocturne:42,transport:12,sante:22,telecom:7,voyage:290} },
  { id:325, name:"Palikir", country:"Micronésie", flag:"🇫🇲", continent:"Océanie", coords:"6.9147°N, 158.1611°E", funFact:"La Micronésie fédérée est un archipel de 607 îles éparpillées sur 2,7 millions de km² d'océan. L'île de Yap, dans cet État, utilise encore des pierres géantes circulaires (Rai stones) allant jusqu'à 4 m de diamètre comme monnaie traditionnelle — une des plus originales du monde.", costs:{logement:300,courses:118,restos:88,nocturne:42,transport:12,sante:20,telecom:7,voyage:278} },
  { id:326, name:"Majuro", country:"Îles Marshall", flag:"🇲🇭", continent:"Océanie", coords:"7.0897°N, 171.3803°E", funFact:"Les Îles Marshall sont célèbres pour les essais nucléaires américains de 1946-1958 sur l'atoll de Bikini — qui a donné son nom au maillot de bain. Les habitants de Bikini ont été déplacés et n'ont pas pu rentrer chez eux depuis 70 ans à cause de la contamination radioactive.", costs:{logement:320,courses:122,restos:92,nocturne:45,transport:12,sante:20,telecom:7,voyage:280} },
  { id:327, name:"Koror", country:"Palaos", flag:"🇵🇼", continent:"Océanie", coords:"7.3451°N, 134.4790°E", funFact:"Les Palaos possèdent le premier sanctuaire marin national au monde — la pêche commerciale y est totalement interdite dans les eaux territoriales. Le lac des méduses de Palaos, où l'on peut nager entouré de millions de méduses inoffensives, est classé parmi les 10 meilleures expériences de plongée mondiales.", costs:{logement:380,courses:145,restos:112,nocturne:55,transport:14,sante:25,telecom:9,voyage:285} },
  { id:328, name:"Melekeok", country:"Palaos", flag:"🇵🇼", continent:"Océanie", coords:"7.4920°N, 134.6384°E", funFact:"Melekeok est devenu la capitale de Palaos en 2006 seulement, remplaçant Koror. C'est l'une des capitales les plus récentes et les plus petites du monde — construite de zéro sur une île presque vierge avec seulement 400 habitants permanents.", costs:{logement:350,courses:135,restos:102,nocturne:45,transport:12,sante:22,telecom:7,voyage:282} },
  { id:329, name:"Hagåtña", country:"Guam", flag:"🇬🇺", continent:"Océanie", coords:"13.4745°N, 144.7504°E", funFact:"Guam est un territoire américain à 13 000 km de Washington D.C. — la ville la plus à l'ouest des États-Unis. Les Chamorros, peuple autochtone de Guam, ont une culture millénaire menacée qui inclut la navigation traditionnelle en pirogue dans des étoiles comme GPS naturel.", costs:{logement:850,courses:178,restos:152,nocturne:90,transport:50,sante:65,telecom:35,voyage:285} },
  { id:330, name:"Saipan", country:"Îles Mariannes", flag:"🇲🇵", continent:"Océanie", coords:"15.1778°N, 145.7510°E", funFact:"Saipan a été le théâtre en 1944 d'une des batailles les plus décisives du Pacifique — la chute de l'île a permis aux B-29 américains d'atteindre le Japon. La falaise du bord du monde (Suicide Cliff) où des milliers de civils japonais se sont jetés reste un mémorial poignant.", costs:{logement:750,courses:162,restos:132,nocturne:75,transport:35,sante:55,telecom:25,voyage:275} },
  { id:331, name:"Papeete", country:"Polynésie française", flag:"🇵🇫", continent:"Océanie", coords:"17.5516°S, 149.5585°O", funFact:"Papeete est la capitale de la Polynésie française et le point de départ pour Bora Bora et Moorea. Tahiti est l'île où Gauguin a passé les dernières années de sa vie à peindre ses célèbres tableaux polynésiens. Les perles noires de Tahiti sont les seules au monde naturellement noires.", costs:{logement:980,courses:198,restos:172,nocturne:108,transport:45,sante:65,telecom:30,voyage:420} },
  { id:332, name:"Bora Bora", country:"Polynésie française", flag:"🇵🇫", continent:"Océanie", coords:"16.5004°S, 151.7415°O", funFact:"Bora Bora est régulièrement classée la plus belle île du monde. Ses bungalows sur pilotis au-dessus du lagon turquoise ont été inventés ici en 1961 — une innovation hôtelière copiée dans tout le monde tropical depuis.", costs:{logement:1800,courses:295,restos:262,nocturne:148,transport:55,sante:72,telecom:35,voyage:480} },
  { id:333, name:"Nouméa", country:"Nouvelle-Calédonie", flag:"🇳🇨", continent:"Océanie", coords:"22.2758°S, 166.4580°E", funFact:"La Nouvelle-Calédonie possède le plus grand lagon du monde classé au patrimoine UNESCO — 24 000 km² d'eaux turquoise. Le territoire est aussi le 3e producteur mondial de nickel, ce qui lui assure un niveau de vie parmi les plus élevés du Pacifique.", costs:{logement:950,courses:192,restos:165,nocturne:102,transport:42,sante:62,telecom:28,voyage:395} },
  { id:334, name:"Mata-Utu", country:"Wallis-et-Futuna", flag:"🇼🇫", continent:"Océanie", coords:"13.2825°S, 176.1764°O", funFact:"Wallis-et-Futuna est l'un des rares territoires français où la chefferie coutumière royale coexiste officiellement avec l'État républicain. Les trois royaumes traditionnels (Uvea, Alo et Sigave) ont leur roi, reconnu par Paris — une cohabitation constitutionnelle unique au monde.", costs:{logement:380,courses:145,restos:112,nocturne:42,transport:15,sante:25,telecom:10,voyage:395} },
  { id:335, name:"Mamoudzou", country:"Mayotte", flag:"🇾🇹", continent:"Océanie", coords:"12.7806°S, 45.2278°E", funFact:"Mayotte est le département français le plus pauvre mais le plus attractif pour l'immigration — entre 40 et 50 % de sa population est née à l'étranger (principalement aux Comores). Le lagon de Mayotte est l'un des plus grands au monde et abrite des dugongs, sirènes de la mer Indienne.", costs:{logement:680,courses:158,restos:122,nocturne:68,transport:22,sante:42,telecom:18,voyage:385} },
  { id:336, name:"Saint-Denis", country:"La Réunion", flag:"🇷🇪", continent:"Océanie", coords:"20.8823°S, 55.4504°E", funFact:"La Réunion abrite le Piton de la Fournaise, l'un des volcans les plus actifs au monde avec une éruption en moyenne tous les 9 mois. L'île est aussi connue pour le maloya, musique créole classée au patrimoine immatériel de l'UNESCO, née de la résistance des esclaves.", costs:{logement:780,courses:168,restos:135,nocturne:80,transport:28,sante:50,telecom:22,voyage:380} },
  { id:337, name:"Port Louis", country:"Île Maurice", flag:"🇲🇺", continent:"Océanie", coords:"20.1654°S, 57.4991°E", funFact:"L'Île Maurice est le premier pays au monde où le dodo a vécu — et où il s'est éteint en 1681, moins de 100 ans après la découverte de l'île par les Hollandais. Maurice est aujourd'hui l'un des pays africains les plus développés avec un PIB par habitant parmi les plus élevés du continent.", costs:{logement:680,courses:155,restos:122,nocturne:75,transport:22,sante:40,telecom:16,voyage:375} },
  { id:338, name:"Victoria", country:"Seychelles", flag:"🇸🇨", continent:"Océanie", coords:"4.6191°S, 55.4513°E", funFact:"Victoria est la plus petite capitale du monde avec seulement 26 000 habitants. Les Seychelles sont composées de 115 îles granitiques et coralliennes — les seules îles granitiques d'origine continentale au milieu d'un océan, vestiges d'un continent disparu appelé Gondwana.", costs:{logement:980,courses:195,restos:168,nocturne:105,transport:35,sante:55,telecom:25,voyage:410} },
  { id:339, name:"Cairns", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"16.9186°S, 145.7781°E", funFact:"Cairns est la porte d'entrée de la Grande Barrière de Corail — la plus grande structure vivante sur Terre, visible depuis l'espace. La ville est aussi le point de départ pour la forêt de Daintree, la plus ancienne forêt tropicale du monde (135 millions d'années, plus ancienne que l'Amazonie).", costs:{logement:880,courses:178,restos:155,nocturne:98,transport:88,sante:70,telecom:34,voyage:295} },
  { id:340, name:"Alice Springs", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"23.6980°S, 133.8807°E", funFact:"Alice Springs est au cœur de l'Outback australien, à 1 500 km de la côte la plus proche. À 40 km se trouve Uluru (Ayers Rock), le rocher sacré des Aborigènes Anangu — le monument naturel le plus emblématique d'Australie, culminant à 348 m de hauteur.", costs:{logement:820,courses:172,restos:148,nocturne:88,transport:82,sante:68,telecom:33,voyage:288} },
  { id:341, name:"Broome", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"17.9614°S, 122.2359°E", funFact:"Broome est connue pour l'Escalier de la Lune — une fois par mois, la lune se lève au-dessus des vasières exposées à marée basse et crée un escalier de lumière dorée, visible seulement depuis un point précis pendant 3 jours. La ville est aussi le centre mondial de la perle des mers du Sud.", costs:{logement:850,courses:175,restos:152,nocturne:95,transport:85,sante:68,telecom:33,voyage:290} },
  { id:342, name:"Byron Bay", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"28.6474°S, 153.6020°E", funFact:"Byron Bay est le point le plus à l'est du continent australien. Le village est devenu la capitale mondiale de l'esprit bohème et du yoga — Chris Hemsworth (Thor) y habite. Le festival Splendour in the Grass y rassemble 35 000 personnes chaque année pour le plus grand festival de musique australien.", costs:{logement:950,courses:185,restos:162,nocturne:105,transport:90,sante:70,telecom:34,voyage:295} },
  { id:343, name:"Dunedin", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"45.8788°S, 170.5028°E", funFact:"Dunedin est surnommée l'Édimbourg du Pacifique pour son héritage écossais — la ville a été fondée par des colons écossais en 1848. La Baldwin Street y est répertoriée comme la rue la plus raide du monde selon le Guinness. La ville abrite aussi la seule colonie d'albatros royaux accessible au public mondial.", costs:{logement:820,courses:168,restos:145,nocturne:90,transport:88,sante:68,telecom:33,voyage:298} },
  { id:344, name:"Hamilton", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"37.7826°S, 175.2528°E", funFact:"Hamilton est la ville néo-zélandaise au cœur de la région Waikato, terre sacrée des Maoris. La ville accueille le National Fieldays — la plus grande exposition agricole de l'hémisphère sud avec 100 000 visiteurs en 4 jours. Elle est aussi réputée pour ses jardins botaniques exceptionnels.", costs:{logement:880,courses:175,restos:152,nocturne:96,transport:90,sante:70,telecom:34,voyage:298} },
  { id:345, name:"Rotorua", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"38.1368°S, 176.2497°E", funFact:"Rotorua est construite sur l'une des zones géothermiques les plus actives au monde — la ville sent le soufre et des geysers jaillissent dans des parcs publics. C'est aussi le cœur de la culture Maorie en Nouvelle-Zélande, avec des haka et des hangi (festins dans la terre) proposés chaque soir.", costs:{logement:850,courses:172,restos:148,nocturne:92,transport:88,sante:70,telecom:34,voyage:295} },
  { id:346, name:"Nuku'alofa", country:"Tonga", flag:"🇹🇴", continent:"Océanie", coords:"21.1363°S, 175.2165°O", funFact:"Nuku'alofa est la capitale du seul royaume absolu du Pacifique Sud. Le roi Taufa'ahau Tupou IV y régnait — il était autrefois inscrit dans le Guinness Book comme l'homme le plus lourd du monde (209 kg). Tonga est aussi le pays où le soleil se lève en premier chaque jour.", costs:{logement:280,courses:112,restos:82,nocturne:42,transport:10,sante:18,telecom:6,voyage:258} },
  { id:347, name:"Noumea Beach", country:"Nouvelle-Calédonie", flag:"🇳🇨", continent:"Océanie", coords:"22.2715°S, 166.4374°E", funFact:"La Grande Terre de Nouvelle-Calédonie est entourée par le plus grand lagon fermé du monde — 24 000 km² de coraux protégés par l'UNESCO. Le territoire kanak possède une culture unique avec des cases géantes (maisons traditionnelles) construites avec des perches de bois de cocotier culminant à 10 m.", costs:{logement:920,courses:185,restos:160,nocturne:98,transport:40,sante:60,telecom:27,voyage:390} },
  { id:348, name:"Whangarei", country:"Nouvelle-Zélande", flag:"🇳🇿", continent:"Océanie", coords:"35.7275°S, 174.3240°E", funFact:"Whangarei est la porte d'entrée du Northland néo-zélandais, région la plus chaude et ensoleillée du pays. La ville est entourée de dizaines de plages sauvages quasi désertes et de forêts kauri — les géants arboricoles qui peuvent vivre 2 000 ans et atteindre 50 m de hauteur.", costs:{logement:820,courses:165,restos:142,nocturne:88,transport:85,sante:67,telecom:33,voyage:292} },
  { id:349, name:"Townsville", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"19.2576°S, 146.8179°E", funFact:"Townsville est surnommée 'Sunny Town' avec 300 jours de soleil par an — et pourtant elle est régulièrement frappée par des cyclones tropicaux. La ville est le point de départ pour Magnetic Island, où 30 % de l'île est parc national et où des koalas sauvages se baladent librement sur les sentiers.", costs:{logement:850,courses:172,restos:148,nocturne:92,transport:85,sante:68,telecom:33,voyage:285} },
  { id:350, name:"Launceston", country:"Australie", flag:"🇦🇺", continent:"Océanie", coords:"41.4388°S, 147.1347°E", funFact:"Launceston est la deuxième ville de Tasmanie et abrite l'une des plus profondes gorges des centres-villes du monde — la Cataract Gorge à seulement 15 minutes à pied du centre. La Tasmanie est par ailleurs le territoire le plus pur du monde en termes de qualité de l'air et de l'eau.", costs:{logement:780,courses:162,restos:138,nocturne:85,transport:82,sante:66,telecom:32,voyage:278} },
];

const CONTINENTS = ["Tous","Europe","Asie","Amérique du Nord","Amérique du Sud","Afrique","Océanie"];

const SAFETY={
  1:62,
  2:58,
  3:63,
  4:83,
  5:71,
  6:72,
  7:68,
  8:59,
  9:77,
  10:74,
  11:45,
  12:62,
  13:38,
  14:67,
  15:40,
  16:58,
  17:64,
  18:57,
  19:80,
  20:65,
  21:66,
  22:60,
  23:78,
  24:79,
  25:82,
  26:60,
  27:79,
  28:65,
  29:55,
  30:58,
  31:69,
  32:71,
  33:60,
  34:68,
  35:72,
  36:70,
  37:76,
  38:72,
  39:85,
  40:82,
  41:50,
  42:65,
  43:35,
  44:40,
  45:42,
  46:28,
  47:52,
  48:48,
  49:44,
  50:58,
  51:64,
  52:48,
  53:68,
  54:70,
  55:67,
  56:70,
  57:66,
  58:52,
  59:64,
  60:72,
  61:70,
  62:74,
  63:72,
  64:68,
  65:70,
  66:66,
  67:68,
  68:78,
  69:80,
  70:72,
  71:60,
  72:58,
  73:62,
  74:66,
  75:68,
  76:74,
  77:70,
  78:76,
  79:52,
  80:58,
  81:64,
  82:65,
  83:68,
  84:48,
  85:50,
  86:60,
  87:56,
  88:60,
  89:62,
  90:65,
  91:60,
  92:78,
  93:75,
  94:62,
  95:62,
  96:68,
  97:67,
  98:68,
  99:76,
  100:74,
  101:42,
  102:38,
  103:55,
  104:40,
  105:42,
  106:38,
  107:45,
  108:40,
  109:52,
  110:48,
  111:60,
  112:48,
  113:42,
  114:50,
  115:52,
  116:48,
  117:45,
  118:45,
  119:50,
  120:30,
  121:40,
  122:48,
  123:52,
  124:52,
  125:45,
  126:55,
  127:60,
  128:55,
  129:60,
  130:52,
  131:50,
  132:52,
  133:48,
  134:48,
  135:38,
  136:38,
  137:40,
  138:58,
  139:42,
  140:42,
  141:40,
  142:48,
  143:62,
  144:62,
  145:52,
  146:45,
  147:40,
  148:32,
  149:45,
  150:28,
  151:82,
  152:78,
  153:78,
  154:82,
  155:83,
  156:74,
  157:72,
  158:80,
  159:50,
  160:55,
  161:52,
  162:48,
  163:42,
  164:45,
  165:40,
  166:55,
  167:58,
  168:55,
  169:15,
  170:42,
  171:22,
  172:50,
  173:72,
  174:68,
  175:45,
  176:60,
  177:48,
  178:70,
  179:55,
  180:60,
  181:48,
  182:62,
  183:62,
  184:45,
  185:75,
  186:72,
  187:72,
  188:75,
  189:78,
  190:70,
  191:62,
  192:58,
  193:60,
  194:55,
  195:58,
  196:55,
  197:55,
  198:62,
  199:58,
  200:48,
  201:45,
  202:42,
  203:48,
  204:55,
  205:58,
  206:58,
  207:55,
  208:48,
  209:52,
  210:60,
  211:62,
  212:60,
  213:52,
  214:62,
  215:48,
  216:65,
  217:68,
  218:70,
  219:72,
  220:72,
  221:68,
  222:52,
  223:52,
  224:58,
  225:50,
  226:52,
  227:68,
  228:42,
  229:35,
  230:35,
  231:38,
  232:55,
  233:48,
  234:52,
  235:45,
  236:60,
  237:45,
  238:48,
  239:65,
  240:62,
  241:68,
  242:70,
  243:72,
  244:58,
  245:68,
  246:65,
  247:52,
  248:62,
  249:55,
  250:52,
  251:30,
  252:38,
  253:38,
  254:35,
  255:42,
  256:45,
  257:48,
  258:40,
  259:42,
  260:45,
  261:45,
  262:38,
  263:55,
  264:42,
  265:35,
  266:40,
  267:52,
  268:35,
  269:40,
  270:32,
  271:38,
  272:35,
  273:38,
  274:38,
  275:32,
  276:42,
  277:38,
  278:35,
  279:45,
  280:38,
  281:30,
  282:32,
  283:62,
  284:58,
  285:52,
  286:60,
  287:50,
  288:25,
  289:55,
  290:35,
  291:55,
  292:48,
  293:58,
  294:60,
  295:58,
  296:32,
  297:32,
  298:20,
  299:38,
  300:55,
  301:72,
  302:70,
  303:73,
  304:72,
  305:75,
  306:68,
  307:74,
  308:70,
  309:68,
  310:72,
  311:70,
  312:72,
  313:52,
  314:55,
  315:40,
  316:58,
  317:50,
  318:60,
  319:65,
  320:62,
  321:68,
  322:62,
  323:65,
  324:58,
  325:62,
  326:65,
  327:68,
  328:65,
  329:65,
  330:62,
  331:65,
  332:68,
  333:68,
  334:65,
  335:55,
  336:62,
  337:68,
  338:72,
  339:70,
  340:65,
  341:68,
  342:65,
  343:72,
  344:70,
  345:70,
  346:68,
  347:68,
  348:70,
  349:68,
  350:72,
};


const WORLD_PATHS = [
  {d:"M86.7,86.2L31.1,95.7L40.0,109.2L64.4,118.3L95.6,120.5L106.7,128.4L124.4,137.4L128.9,154.3L140.0,162.4L155.6,167.6L166.7,174.9L188.9,179.7L200.0,183.1L211.1,188.8L228.9,191.1L233.3,191.1L260.0,188.8L264.4,183.1L251.1,179.7L244.4,177.3L222.2,172.5L222.2,171.3L220.0,165.0L231.1,158.4L233.3,154.3L244.4,147.0L251.1,140.7L282.2,140.7L277.8,133.9L268.9,126.5L257.8,118.3L257.8,111.6L248.9,120.5L228.9,124.6L224.4,124.6L226.7,116.2L226.7,106.7L237.8,101.4L248.9,95.7L248.9,89.5L217.8,86.2L188.9,89.5L177.8,95.7L160.0,101.4L144.4,95.7L122.2,89.5L100.0,86.2L86.7,86.2Z",fill:"#1d3557"},
  {d:"M297.8,22.1L360.0,66.5L344.4,95.7L306.7,109.2L284.4,104.1L275.6,89.5L248.9,66.5L244.4,30.6L266.7,12.3L297.8,22.1Z",fill:"#1d3557"},
  {d:"M240.0,186.6L264.4,186.6L262.2,188.8L266.7,191.1L284.4,194.4L288.9,197.8L288.9,200.0L304.4,203.3L322.2,208.9L317.8,213.4L313.3,216.9L304.4,226.3L293.3,232.4L282.2,240.2L273.3,245.7L262.2,251.5L248.9,267.9L255.6,273.5L244.4,273.5L235.6,251.5L240.0,241.6L240.0,235.0L244.4,222.7L244.4,220.3L222.2,205.6L222.2,200.0L228.9,194.4L228.9,191.1L240.0,188.8L240.0,186.6Z",fill:"#1b4332"},
  {d:"M344.4,86.2L440.0,75.1L462.2,89.5L455.6,104.1L455.6,116.2L448.9,122.5L453.3,124.6L448.9,128.4L455.6,124.6L448.9,126.5L448.9,132.1L444.4,135.7L448.9,139.0L453.3,142.3L462.2,145.4L460.0,148.5L460.0,154.3L453.3,155.7L431.1,157.1L433.3,154.3L417.8,145.4L395.6,145.4L388.9,140.7L377.8,133.9L388.9,126.5L388.9,120.5L384.4,111.6L368.9,104.1L360.0,95.7L344.4,86.2Z",fill:"#2d2b55"},
  {d:"M397.8,113.9L388.9,120.5L388.9,126.5L388.9,130.3L393.3,133.9L402.2,133.9L402.2,130.3L404.4,124.6L400.0,120.5L397.8,113.9Z",fill:"#2d2b55"},
  {d:"M382.2,126.5L377.8,132.1L386.7,132.1L386.7,128.4L382.2,126.5Z",fill:"#2d2b55"},
  {d:"M346.7,101.4L346.7,109.2L371.1,109.2L371.1,104.1L368.9,98.6L346.7,101.4Z",fill:"#2d2b55"},
  {d:"M422.2,155.7L480.0,155.7L477.8,167.6L482.2,174.9L493.3,184.3L493.3,194.4L493.3,200.0L488.9,205.6L488.9,213.4L473.3,218.0L473.3,228.7L460.0,241.6L440.0,241.6L437.8,235.0L426.7,220.3L422.2,205.6L420.0,200.0L417.8,195.6L404.4,194.4L393.3,195.6L382.2,197.8L388.9,194.4L433.3,188.8L422.2,183.1L424.4,177.3L484.4,182.0L497.8,186.6L482.2,174.9L477.8,167.6L480.0,155.7L422.2,155.7Z",fill:"#3d2b1e"},
  {d:"M508.9,213.4L497.8,218.0L497.8,228.7L500.0,229.9L508.9,220.3L508.9,213.4Z",fill:"#3d2b1e"},
  {d:"M466.7,82.7L522.2,56.6L626.7,66.5L688.9,79.0L777.8,95.7L777.8,116.2L755.6,135.7L715.6,148.5L711.1,158.4L688.9,165.0L671.1,171.3L653.3,174.9L644.4,177.3L631.1,188.8L628.9,197.8L622.2,197.8L622.2,194.4L622.2,188.8L631.1,179.7L640.0,174.9L666.7,165.0L684.4,158.4L711.1,158.4L662.2,151.4L666.7,143.9L644.4,135.7L600.0,143.9L582.2,148.5L551.1,154.3L537.8,157.1L511.1,157.1L511.1,167.6L524.4,174.9L515.6,182.0L497.8,184.3L484.4,174.9L475.6,167.6L475.6,162.4L480.0,157.1L480.0,151.4L497.8,148.5L520.0,135.7L533.3,124.6L551.1,101.4L577.8,101.4L577.8,86.2L466.7,82.7Z",fill:"#1a3a3a"},
  {d:"M551.1,172.5L560.0,167.6L573.3,167.6L595.6,174.9L586.7,179.7L577.8,184.3L573.3,191.1L571.1,191.1L573.3,188.8L568.9,184.3L564.4,179.7L551.1,172.5Z",fill:"#1a3a3a"},
  {d:"M622.2,174.9L622.2,177.3L631.1,179.7L626.7,183.1L631.1,186.6L631.1,188.8L628.9,197.8L622.2,197.8L622.2,194.4L617.8,188.8L617.8,186.6L617.8,184.3L613.3,179.7L622.2,174.9Z",fill:"#1a3a3a"},
  {d:"M722.2,145.4L713.3,151.4L702.2,158.4L691.1,161.1L691.1,159.8L700.0,158.4L706.7,155.7L711.1,151.4L722.2,145.4Z",fill:"#1a3a3a"},
  {d:"M713.3,145.4L722.2,147.0L715.6,143.9L713.3,145.4Z",fill:"#1a3a3a"},
  {d:"M577.8,188.8L577.8,192.2L580.0,193.3L582.2,192.2L577.8,188.8Z",fill:"#1a3a3a"},
  {d:"M693.3,211.2L702.2,211.2L702.2,215.7L715.6,215.7L715.6,211.2L722.2,211.2L722.2,215.7L740.0,227.5L735.6,240.2L726.7,245.7L726.7,253.0L726.7,254.6L722.2,253.0L717.8,247.1L706.7,240.2L702.2,240.2L704.4,242.9L711.1,245.7L686.7,245.7L671.1,240.2L653.3,229.9L653.3,225.1L671.1,219.2L684.4,216.9L691.1,214.6L693.3,213.4L693.3,211.2Z",fill:"#3d3519"},
  {d:"M782.2,240.2L788.9,244.3L788.9,248.6L786.7,250.0L782.2,240.2Z",fill:"#3d3519"},
  {d:"M780.0,250.0L773.3,257.7L777.8,257.7L782.2,253.0L786.7,250.0L780.0,250.0Z",fill:"#3d3519"},
  {d:"M657.8,192.2L662.2,194.4L655.6,197.8L642.2,200.0L655.6,204.4L660.0,204.4L660.0,200.0L660.0,195.6L657.8,192.2Z",fill:"#1a3a3a"},
  {d:"M611.1,194.4L617.8,200.0L626.7,202.2L633.3,206.7L631.1,205.6L622.2,201.1L617.8,196.7L611.1,194.4Z",fill:"#1a3a3a"},
  {d:"M635.6,206.7L648.9,208.9L655.6,208.9L637.8,207.8L635.6,206.7Z",fill:"#1a3a3a"},
];

const COUNTRIES_EN={
  "Afghanistan":"Afghanistan",
  "Afrique du Sud":"South Africa",
  "Albanie":"Albania",
  "Algérie":"Algeria",
  "Allemagne":"Germany",
  "Angola":"Angola",
  "Arabie Saoudite":"Saudi Arabia",
  "Argentine":"Argentina",
  "Arménie":"Armenia",
  "Australie":"Australia",
  "Autriche":"Austria",
  "Azerbaïdjan":"Azerbaijan",
  "Bahamas":"Bahamas",
  "Bangladesh":"Bangladesh",
  "Barbade":"Barbados",
  "Belgique":"Belgium",
  "Belize":"Belize",
  "Bolivie":"Bolivia",
  "Bosnie-Herzégovine":"Bosnia-Herzegovina",
  "Botswana":"Botswana",
  "Brésil":"Brazil",
  "Bulgarie":"Bulgaria",
  "Burkina Faso":"Burkina Faso",
  "Bénin":"Benin",
  "Cambodge":"Cambodia",
  "Cameroun":"Cameroon",
  "Canada":"Canada",
  "Centrafrique":"Central African Rep.",
  "Chili":"Chile",
  "Chine":"China",
  "Chine (RAS)":"China (SAR)",
  "Chypre":"Cyprus",
  "Colombie":"Colombia",
  "Comores":"Comoros",
  "Congo":"Congo",
  "Corée du Nord":"North Korea",
  "Corée du Sud":"South Korea",
  "Costa Rica":"Costa Rica",
  "Croatie":"Croatia",
  "Cuba":"Cuba",
  "Côte d'Ivoire":"Ivory Coast",
  "Danemark":"Denmark",
  "Djibouti":"Djibouti",
  "El Salvador":"El Salvador",
  "Espagne":"Spain",
  "Estonie":"Estonia",
  "Fidji":"Fiji",
  "Finlande":"Finland",
  "France":"France",
  "Gabon":"Gabon",
  "Ghana":"Ghana",
  "Grèce":"Greece",
  "Guadeloupe (France)":"Guadeloupe (France)",
  "Guam":"Guam",
  "Guatemala":"Guatemala",
  "Guinée":"Guinea",
  "Guinée Équatoriale":"Equatorial Guinea",
  "Guyana":"Guyana",
  "Guyane française":"French Guiana",
  "Géorgie":"Georgia",
  "Haïti":"Haiti",
  "Honduras":"Honduras",
  "Hongrie":"Hungary",
  "Inde":"India",
  "Indonésie":"Indonesia",
  "Irak":"Iraq",
  "Iran":"Iran",
  "Irlande":"Ireland",
  "Islande":"Iceland",
  "Israël":"Israel",
  "Italie":"Italy",
  "Jamaïque":"Jamaica",
  "Japon":"Japan",
  "Kazakhstan":"Kazakhstan",
  "Kenya":"Kenya",
  "Kiribati":"Kiribati",
  "Koweït":"Kuwait",
  "La Réunion":"Réunion",
  "Laos":"Laos",
  "Lettonie":"Latvia",
  "Libye":"Libya",
  "Libéria":"Liberia",
  "Lituanie":"Lithuania",
  "Luxembourg":"Luxembourg",
  "Macédoine du Nord":"North Macedonia",
  "Madagascar":"Madagascar",
  "Malaisie":"Malaysia",
  "Malawi":"Malawi",
  "Mali":"Mali",
  "Malte":"Malta",
  "Maroc":"Morocco",
  "Martinique (France)":"Martinique (France)",
  "Mayotte":"Mayotte",
  "Mexique":"Mexico",
  "Micronésie":"Micronesia",
  "Mongolie":"Mongolia",
  "Mozambique":"Mozambique",
  "Myanmar":"Myanmar",
  "Namibie":"Namibia",
  "Nauru":"Nauru",
  "Nicaragua":"Nicaragua",
  "Niger":"Niger",
  "Nigéria":"Nigeria",
  "Norvège":"Norway",
  "Nouvelle-Calédonie":"New Caledonia",
  "Nouvelle-Zélande":"New Zealand",
  "Népal":"Nepal",
  "Ouganda":"Uganda",
  "Ouzbékistan":"Uzbekistan",
  "Pakistan":"Pakistan",
  "Palaos":"Palau",
  "Panama":"Panama",
  "Papouasie-Nouvelle-Guinée":"Papua New Guinea",
  "Paraguay":"Paraguay",
  "Pays-Bas":"Netherlands",
  "Philippines":"Philippines",
  "Pologne":"Poland",
  "Polynésie française":"French Polynesia",
  "Porto Rico (USA)":"Puerto Rico (USA)",
  "Portugal":"Portugal",
  "Pérou":"Peru",
  "Qatar":"Qatar",
  "RD Congo":"DR Congo",
  "Roumanie":"Romania",
  "Royaume-Uni":"United Kingdom",
  "Rwanda":"Rwanda",
  "République Dominicaine":"Dominican Republic",
  "Samoa":"Samoa",
  "Samoa américaines":"American Samoa",
  "Serbie":"Serbia",
  "Seychelles":"Seychelles",
  "Sierra Leone":"Sierra Leone",
  "Singapour":"Singapore",
  "Slovaquie":"Slovakia",
  "Slovénie":"Slovenia",
  "Somalie":"Somalia",
  "Soudan":"Sudan",
  "Sri Lanka":"Sri Lanka",
  "Suisse":"Switzerland",
  "Suriname":"Suriname",
  "Suède":"Sweden",
  "São Tomé-et-Príncipe":"São Tomé and Príncipe",
  "Sénégal":"Senegal",
  "Tanzanie":"Tanzania",
  "Taïwan":"Taiwan",
  "Tchad":"Chad",
  "Tchéquie":"Czech Republic",
  "Thaïlande":"Thailand",
  "Timor oriental":"East Timor",
  "Togo":"Togo",
  "Tonga":"Tonga",
  "Trinité-et-Tobago":"Trinidad and Tobago",
  "Tunisie":"Tunisia",
  "Turquie":"Turkey",
  "Tuvalu":"Tuvalu",
  "Uruguay":"Uruguay",
  "Vanuatu":"Vanuatu",
  "Venezuela":"Venezuela",
  "Viêt Nam":"Vietnam",
  "Wallis-et-Futuna":"Wallis and Futuna",
  "Zambie":"Zambia",
  "Zimbabwe":"Zimbabwe",
  "Égypte":"Egypt",
  "Émirats Arabes Unis":"UAE",
  "Équateur":"Ecuador",
  "Érythrée":"Eritrea",
  "États-Unis":"United States",
  "Éthiopie":"Ethiopia",
  "Île Maurice":"Mauritius",
  "Îles Mariannes":"Mariana Islands",
  "Îles Marshall":"Marshall Islands",
  "Îles Salomon":"Solomon Islands",
};

const COUNTRIES_ES={
  "Afghanistan":"Afganistán",
  "Afrique du Sud":"Sudáfrica",
  "Albanie":"Albania",
  "Algérie":"Argelia",
  "Allemagne":"Alemania",
  "Angola":"Angola",
  "Arabie Saoudite":"Arabia Saudita",
  "Argentine":"Argentina",
  "Arménie":"Armenia",
  "Australie":"Australia",
  "Autriche":"Austria",
  "Azerbaïdjan":"Azerbaiyán",
  "Bahamas":"Bahamas",
  "Bangladesh":"Bangladés",
  "Barbade":"Barbados",
  "Belgique":"Bélgica",
  "Belize":"Belice",
  "Bolivie":"Bolivia",
  "Bosnie-Herzégovine":"Bosnia-Herzegovina",
  "Botswana":"Botsuana",
  "Brésil":"Brasil",
  "Bulgarie":"Bulgaria",
  "Burkina Faso":"Burkina Faso",
  "Bénin":"Benín",
  "Cambodge":"Camboya",
  "Cameroun":"Camerún",
  "Canada":"Canadá",
  "Centrafrique":"Rep. Centroafricana",
  "Chili":"Chile",
  "Chine":"China",
  "Chine (RAS)":"China (RAE)",
  "Chypre":"Chipre",
  "Colombie":"Colombia",
  "Comores":"Comoras",
  "Congo":"Congo",
  "Corée du Nord":"Corea del Norte",
  "Corée du Sud":"Corea del Sur",
  "Costa Rica":"Costa Rica",
  "Croatie":"Croacia",
  "Cuba":"Cuba",
  "Côte d'Ivoire":"Costa de Marfil",
  "Danemark":"Dinamarca",
  "Djibouti":"Yibuti",
  "El Salvador":"El Salvador",
  "Espagne":"España",
  "Estonie":"Estonia",
  "Fidji":"Fiyi",
  "Finlande":"Finlandia",
  "France":"Francia",
  "Gabon":"Gabón",
  "Ghana":"Ghana",
  "Grèce":"Grecia",
  "Guadeloupe (France)":"Guadalupe (Francia)",
  "Guam":"Guam",
  "Guatemala":"Guatemala",
  "Guinée":"Guinea",
  "Guinée Équatoriale":"Guinea Ecuatorial",
  "Guyana":"Guyana",
  "Guyane française":"Guayana Francesa",
  "Géorgie":"Georgia",
  "Haïti":"Haití",
  "Honduras":"Honduras",
  "Hongrie":"Hungría",
  "Inde":"India",
  "Indonésie":"Indonesia",
  "Irak":"Irak",
  "Iran":"Irán",
  "Irlande":"Irlanda",
  "Islande":"Islandia",
  "Israël":"Israel",
  "Italie":"Italia",
  "Jamaïque":"Jamaica",
  "Japon":"Japón",
  "Kazakhstan":"Kazajistán",
  "Kenya":"Kenia",
  "Kiribati":"Kiribati",
  "Koweït":"Kuwait",
  "La Réunion":"Reunión",
  "Laos":"Laos",
  "Lettonie":"Letonia",
  "Libye":"Libia",
  "Libéria":"Liberia",
  "Lituanie":"Lituania",
  "Luxembourg":"Luxemburgo",
  "Macédoine du Nord":"Macedonia del Norte",
  "Madagascar":"Madagascar",
  "Malaisie":"Malasia",
  "Malawi":"Malaui",
  "Mali":"Mali",
  "Malte":"Malta",
  "Maroc":"Marruecos",
  "Martinique (France)":"Martinica (Francia)",
  "Mayotte":"Mayotte",
  "Mexique":"México",
  "Micronésie":"Micronesia",
  "Mongolie":"Mongolia",
  "Mozambique":"Mozambique",
  "Myanmar":"Myanmar",
  "Namibie":"Namibia",
  "Nauru":"Nauru",
  "Nicaragua":"Nicaragua",
  "Niger":"Níger",
  "Nigéria":"Nigeria",
  "Norvège":"Noruega",
  "Nouvelle-Calédonie":"Nueva Caledonia",
  "Nouvelle-Zélande":"Nueva Zelanda",
  "Népal":"Nepal",
  "Ouganda":"Uganda",
  "Ouzbékistan":"Uzbekistán",
  "Pakistan":"Pakistán",
  "Palaos":"Palaos",
  "Panama":"Panamá",
  "Papouasie-Nouvelle-Guinée":"Papúa Nueva Guinea",
  "Paraguay":"Paraguay",
  "Pays-Bas":"Países Bajos",
  "Philippines":"Filipinas",
  "Pologne":"Polonia",
  "Polynésie française":"Polinesia Francesa",
  "Porto Rico (USA)":"Puerto Rico (EE.UU.)",
  "Portugal":"Portugal",
  "Pérou":"Perú",
  "Qatar":"Catar",
  "RD Congo":"RD Congo",
  "Roumanie":"Rumanía",
  "Royaume-Uni":"Reino Unido",
  "Rwanda":"Ruanda",
  "République Dominicaine":"Rep. Dominicana",
  "Samoa":"Samoa",
  "Samoa américaines":"Samoa Americana",
  "Serbie":"Serbia",
  "Seychelles":"Seychelles",
  "Sierra Leone":"Sierra Leona",
  "Singapour":"Singapur",
  "Slovaquie":"Eslovaquia",
  "Slovénie":"Eslovenia",
  "Somalie":"Somalia",
  "Soudan":"Sudán",
  "Sri Lanka":"Sri Lanka",
  "Suisse":"Suiza",
  "Suriname":"Surinam",
  "Suède":"Suecia",
  "São Tomé-et-Príncipe":"Santo Tomé y Príncipe",
  "Sénégal":"Senegal",
  "Tanzanie":"Tanzania",
  "Taïwan":"Taiwán",
  "Tchad":"Chad",
  "Tchéquie":"República Checa",
  "Thaïlande":"Tailandia",
  "Timor oriental":"Timor Oriental",
  "Togo":"Togo",
  "Tonga":"Tonga",
  "Trinité-et-Tobago":"Trinidad y Tobago",
  "Tunisie":"Túnez",
  "Turquie":"Turquía",
  "Tuvalu":"Tuvalu",
  "Uruguay":"Uruguay",
  "Vanuatu":"Vanuatu",
  "Venezuela":"Venezuela",
  "Viêt Nam":"Vietnam",
  "Wallis-et-Futuna":"Wallis y Futuna",
  "Zambie":"Zambia",
  "Zimbabwe":"Zimbabue",
  "Égypte":"Egipto",
  "Émirats Arabes Unis":"EAU",
  "Équateur":"Ecuador",
  "Érythrée":"Eritrea",
  "États-Unis":"Estados Unidos",
  "Éthiopie":"Etiopía",
  "Île Maurice":"Mauricio",
  "Îles Mariannes":"Islas Marianas",
  "Îles Marshall":"Islas Marshall",
  "Îles Salomon":"Islas Salomón",
};

const CONTINENTS_EN={
  "Europe":"Europe",
  "Asie":"Asia",
  "Amérique du Nord":"North America",
  "Amérique du Sud":"South America",
  "Afrique":"Africa",
  "Océanie":"Oceania",
};

const CONTINENTS_ES={
  "Europe":"Europa",
  "Asie":"Asia",
  "Amérique du Nord":"América del Norte",
  "Amérique du Sud":"América del Sur",
  "Afrique":"África",
  "Océanie":"Oceanía",
};

const ENGLISH_LEVEL={
  1:3,
  2:5,
  3:4,
  4:3,
  5:4,
  6:4,
  7:4,
  8:3,
  9:5,
  10:3,
  11:3,
  12:5,
  13:3,
  14:5,
  15:2,
  16:3,
  17:5,
  18:4,
  19:4,
  20:4,
  21:4,
  22:5,
  23:5,
  24:5,
  25:4,
  26:4,
  27:4,
  28:3,
  29:3,
  30:3,
  31:4,
  32:4,
  33:3,
  34:4,
  35:4,
  36:4,
  37:4,
  38:4,
  39:2,
  40:5,
  41:3,
  42:4,
  43:3,
  44:3,
  45:3,
  46:3,
  47:5,
  48:5,
  49:3,
  50:4,
  51:3,
  52:3,
  53:3,
  54:3,
  55:3,
  56:3,
  57:3,
  58:3,
  59:4,
  60:3,
  61:3,
  62:3,
  63:4,
  64:4,
  65:4,
  66:4,
  67:4,
  68:5,
  69:4,
  70:5,
  71:5,
  72:5,
  73:5,
  74:4,
  75:4,
  76:5,
  77:5,
  78:4,
  79:4,
  80:4,
  81:4,
  82:4,
  83:4,
  84:3,
  85:3,
  86:3,
  87:3,
  88:3,
  89:3,
  90:4,
  91:4,
  92:2,
  93:4,
  94:4,
  95:4,
  96:3,
  97:4,
  98:4,
  99:4,
  100:4,
  101:3,
  102:3,
  103:3,
  104:3,
  105:3,
  106:3,
  107:3,
  108:3,
  109:3,
  110:3,
  111:3,
  112:3,
  113:3,
  114:3,
  115:3,
  116:3,
  117:2,
  118:2,
  119:2,
  120:2,
  121:2,
  122:2,
  123:2,
  124:3,
  125:3,
  126:3,
  127:3,
  128:3,
  129:3,
  130:3,
  131:3,
  132:3,
  133:3,
  134:2,
  135:1,
  136:3,
  137:3,
  138:3,
  139:3,
  140:3,
  141:3,
  142:3,
  143:3,
  144:3,
  145:2,
  146:2,
  147:3,
  148:3,
  149:3,
  150:2,
  151:2,
  152:2,
  153:3,
  154:3,
  155:3,
  156:3,
  157:3,
  158:3,
  159:3,
  160:3,
  161:3,
  162:3,
  163:2,
  164:2,
  165:2,
  166:2,
  167:3,
  168:2,
  169:1,
  170:2,
  171:2,
  172:2,
  173:3,
  174:2,
  175:3,
  176:3,
  177:2,
  178:2,
  179:2,
  180:2,
  181:2,
  182:2,
  183:2,
  184:2,
  185:2,
  186:2,
  187:2,
  188:2,
  189:2,
  190:3,
  191:2,
  192:2,
  193:2,
  194:2,
  195:2,
  196:2,
  197:1,
  198:2,
  199:2,
  200:2,
  201:5,
  202:5,
  203:5,
  204:5,
  205:5,
  206:5,
  207:5,
  208:5,
  209:5,
  210:5,
  211:5,
  212:5,
  213:5,
  214:5,
  215:5,
  216:5,
  217:5,
  218:5,
  219:5,
  220:5,
  221:5,
  222:3,
  223:3,
  224:3,
  225:3,
  226:3,
  227:3,
  228:2,
  229:2,
  230:2,
  231:2,
  232:2,
  233:2,
  234:3,
  235:4,
  236:3,
  237:2,
  238:2,
  239:4,
  240:4,
  241:5,
  242:5,
  243:5,
  244:2,
  245:2,
  246:2,
  247:3,
  248:5,
  249:5,
  250:5,
  251:4,
  252:4,
  253:4,
  254:4,
  255:3,
  256:2,
  257:2,
  258:2,
  259:2,
  260:2,
  261:3,
  262:3,
  263:3,
  264:3,
  265:3,
  266:2,
  267:2,
  268:2,
  269:2,
  270:2,
  271:2,
  272:2,
  273:2,
  274:2,
  275:2,
  276:3,
  277:3,
  278:3,
  279:2,
  280:2,
  281:2,
  282:2,
  283:3,
  284:3,
  285:2,
  286:1,
  287:2,
  288:1,
  289:1,
  290:1,
  291:2,
  292:2,
  293:2,
  294:2,
  295:2,
  296:1,
  297:2,
  298:2,
  299:2,
  300:2,
  301:5,
  302:5,
  303:5,
  304:5,
  305:5,
  306:5,
  307:5,
  308:5,
  309:5,
  310:5,
  311:5,
  312:5,
  313:4,
  314:4,
  315:3,
  316:2,
  317:3,
  318:3,
  319:3,
  320:4,
  321:3,
  322:3,
  323:3,
  324:3,
  325:3,
  326:3,
  327:3,
  328:3,
  329:4,
  330:4,
  331:2,
  332:2,
  333:3,
  334:2,
  335:2,
  336:2,
  337:3,
  338:3,
  339:5,
  340:5,
  341:5,
  342:5,
  343:5,
  344:5,
  345:5,
  346:3,
  347:3,
  348:5,
  349:5,
  350:5,
};

const CATEGORIES = [
  { key:"logement",  label:"🏠 Logement",    color:"#FF6B35" },
  { key:"courses",   label:"🛒 Courses",      color:"#F7C59F" },
  { key:"restos",    label:"🍽️ Restos",        color:"#EFEFD0" },
  { key:"nocturne",  label:"🍺 Vie Nocturne", color:"#5B8DEF" },
  { key:"transport", label:"🚇 Transport",    color:"#1A936F" },
  { key:"sante",     label:"❤️ Santé",         color:"#88D498" },
  { key:"telecom",   label:"📱 Télécom",       color:"#C6DABF" },
  { key:"voyage",    label:"✈️ Voyages",        color:"#FFD700" },
];

const ALL_CAT_KEYS = CATEGORIES.map(c=>c.key);

const PRESETS = {
  survival:{ label:"🧟 Survival", labelFull:"🧟 Survival Mode", description:"Économies max", color:"#1A936F", multipliers:{logement:0.8,courses:0.7,restos:0.5,nocturne:0.3,transport:0.8,sante:1.0,telecom:0.8,voyage:0.3}},
  standard:{ label:"⚖️ Standard", labelFull:"⚖️ Standard",      description:"Vie équilibrée", color:"#FF6B35", multipliers:{logement:1.0,courses:1.0,restos:1.0,nocturne:1.0,transport:1.0,sante:1.0,telecom:1.0,voyage:1.0}},
  golden:  { label:"👑 Golden",   labelFull:"👑 Golden Era",     description:"Pas de limite",  color:"#FFD700", multipliers:{logement:1.3,courses:1.2,restos:1.8,nocturne:2.0,transport:1.2,sante:1.2,telecom:1.2,voyage:2.5}},
};

const BUDGET_REF=1200, BUDGET_WARN=1500;

const CONT_COLORS = {
  "Europe":"#5B8DEF","Asie":"#FF6B35","Amérique du Nord":"#FFD700",
  "Amérique du Sud":"#1A936F","Afrique":"#F7C59F","Océanie":"#a78bfa",
};

// ── TRANSLATIONS ──
const LANGS = {
  fr:{
    appSubtitle:"Globe-Trotter Pro 2026 🌍",
    tabCities:"🌍 Villes", tabBudget:"💰 Mon Budget", tabMap:"🗺️ Carte",
    search:"Ville ou pays...", allContinents:"Tous",
    sortAZ:"Tri : A → Z", sortCheap:"Tri : Moins cher", sortExpensive:"Tri : Plus cher",
    randomBtn:"🎲", battleBtn:"⚔️ Battle", battleQuit:"⚔️ Quitter",
    budgetTitle:"Calculateur de Budget Étudiant",
    budgetSavings:"Mes économies disponibles (€) — optionnel",
    budgetMonthly:"Mon budget mensuel (€/mois)",
    budgetMonths:"mois", budgetForever:"∞ pour toujours",
    budgetTableCity:"Ville", budgetTableCost:"Coût/mois", budgetTableMonths:"Durée",
    budgetTableMonthly:"Apport mensuel nécessaire",
    budgetHint:"Combien de mois peux-tu vivre dans chaque ville avec ton budget ?",
    mapTitle:"Carte des villes", mapHint:"Clique sur un point pour voir les détails",
    favoritesTitle:"⭐ Favoris",
    noFavorites:"Aucun favori — clique sur ★ pour en ajouter",
    customCats:"⚙️ Catégories", activeCats:"CATÉGORIES ACTIVES",
    checkAll:"Tout cocher", uncheckAll:"Tout décocher",
    otherCosts:"➕ AUTRES DÉPENSES", otherPlaceholder:"Ex : sport, abonnements...",
    budgetMeter:"BUDGET MENSUEL ESTIMÉ", refErasmus:"Réf. bourse",
    alert:"Alerte", didYouKnow:"💡 DID YOU KNOW?",
    battleSelectFor:"Sélectionner pour :", battleCity:"Ville",
    moreExpensive:"plus chère", lessExpensive:"moins chère",
    modeLabel:"Mode :", perMonth:"/mois", cities:"ville",
    filterNActive:"/%s actives",
    footer:"DONNÉES INDICATIVES · MADE WITH ❤️ BY ELIO",
    safety:"Sécurité", lightMode:"☀️", darkMode:"🌙", battle3:"⚔️ Trio",
    notes:"📝 Notes personnelles", notesPlaceholder:"Tes notes sur cette ville (appart trouvé, contacts, idées...)",
    englishLevel:"Anglais",
    repartition:"RÉPARTITION", detail:"DÉTAIL",
    catLabels:{logement:"🏠 Logement",courses:"🛒 Courses",restos:"🍽️ Restos",nocturne:"🍺 Vie Nocturne",transport:"🚇 Transport",sante:"❤️ Santé",telecom:"📱 Télécom",voyage:"✈️ Voyages"},
    presetDesc:{survival:"Économies max — pâtes et covoiturage", standard:"Vie équilibrée — l'expérience Erasmus typique", golden:"Pas de limite — vis ta meilleure vie"},
  },
  en:{
    appSubtitle:"Globe-Trotter Pro 2026 🌍",
    tabCities:"🌍 Cities", tabBudget:"💰 My Budget", tabMap:"🗺️ Map",
    search:"City or country...", allContinents:"All",
    sortAZ:"Sort: A → Z", sortCheap:"Sort: Cheapest", sortExpensive:"Sort: Most expensive",
    randomBtn:"🎲", battleBtn:"⚔️ Battle", battleQuit:"⚔️ Quit",
    budgetTitle:"Student Budget Calculator",
    budgetSavings:"My savings (€) — optional",
    budgetMonthly:"My monthly budget (€/month)",
    budgetMonths:"months", budgetForever:"∞ forever",
    budgetTableCity:"City", budgetTableCost:"Cost/month", budgetTableMonths:"Duration",
    budgetTableMonthly:"Monthly contribution needed",
    budgetHint:"How many months can you live in each city with your budget?",
    mapTitle:"Cities Map", mapHint:"Click on a dot to see details",
    favoritesTitle:"⭐ Favorites",
    noFavorites:"No favorites yet — click ★ to add one",
    customCats:"⚙️ Categories", activeCats:"ACTIVE CATEGORIES",
    checkAll:"Check all", uncheckAll:"Uncheck all",
    otherCosts:"➕ OTHER EXPENSES", otherPlaceholder:"E.g. gym, subscriptions...",
    budgetMeter:"ESTIMATED MONTHLY BUDGET", refErasmus:"Grant ref.",
    alert:"Alert", didYouKnow:"💡 DID YOU KNOW?",
    battleSelectFor:"Select for:", battleCity:"City",
    moreExpensive:"more expensive", lessExpensive:"cheaper",
    modeLabel:"Mode:", perMonth:"/month", cities:"city",
    filterNActive:"/%s active",
    footer:"INDICATIVE DATA · MADE WITH ❤️ BY ELIO",
    safety:"Safety", lightMode:"☀️", darkMode:"🌙", battle3:"⚔️ Trio",
    notes:"📝 Personal notes", notesPlaceholder:"Your notes about this city (flat found, contacts, ideas...)",
    englishLevel:"English",
    repartition:"BREAKDOWN", detail:"DETAIL",
    catLabels:{logement:"🏠 Housing",courses:"🛒 Groceries",restos:"🍽️ Restaurants",nocturne:"🍺 Nightlife",transport:"🚇 Transport",sante:"❤️ Health",telecom:"📱 Telecom",voyage:"✈️ Travel"},
    presetDesc:{survival:"Max savings — pasta and carpooling", standard:"Balanced life — the typical Erasmus experience", golden:"No limits — live your best life"},
  },
  es:{
    appSubtitle:"Globe-Trotter Pro 2026 🌍",
    tabCities:"🌍 Ciudades", tabBudget:"💰 Mi Presupuesto", tabMap:"🗺️ Mapa",
    search:"Ciudad o país...", allContinents:"Todos",
    sortAZ:"Orden: A → Z", sortCheap:"Orden: Más barato", sortExpensive:"Orden: Más caro",
    randomBtn:"🎲", battleBtn:"⚔️ Batalla", battleQuit:"⚔️ Salir",
    budgetTitle:"Calculadora de Presupuesto Estudiantil",
    budgetSavings:"Mis ahorros (€) — opcional",
    budgetMonthly:"Mi presupuesto mensual (€/mes)",
    budgetMonths:"meses", budgetForever:"∞ para siempre",
    budgetTableCity:"Ciudad", budgetTableCost:"Coste/mes", budgetTableMonths:"Duración",
    budgetTableMonthly:"Aporte mensual necesario",
    budgetHint:"¿Cuántos meses puedes vivir en cada ciudad con tu presupuesto?",
    mapTitle:"Mapa de ciudades", mapHint:"Haz clic en un punto para ver detalles",
    favoritesTitle:"⭐ Favoritos",
    noFavorites:"Sin favoritos — haz clic en ★ para añadir",
    customCats:"⚙️ Categorías", activeCats:"CATEGORÍAS ACTIVAS",
    checkAll:"Marcar todo", uncheckAll:"Desmarcar todo",
    otherCosts:"➕ OTROS GASTOS", otherPlaceholder:"Ej: deporte, suscripciones...",
    budgetMeter:"PRESUPUESTO MENSUAL ESTIMADO", refErasmus:"Ref. beca",
    alert:"Alerta", didYouKnow:"💡 ¿SABÍAS QUE?",
    battleSelectFor:"Seleccionar para:", battleCity:"Ciudad",
    moreExpensive:"más cara", lessExpensive:"más barata",
    modeLabel:"Modo:", perMonth:"/mes", cities:"ciudad",
    filterNActive:"/%s activas",
    footer:"DATOS INDICATIVOS · HECHO CON ❤️ POR ELIO",
    safety:"Seguridad", lightMode:"☀️", darkMode:"🌙", battle3:"⚔️ Trío",
    notes:"📝 Notas personales", notesPlaceholder:"Tus notas sobre esta ciudad (piso encontrado, contactos, ideas...)",
    englishLevel:"Inglés",
    repartition:"DESGLOSE", detail:"DETALLE",
    catLabels:{logement:"🏠 Alojamiento",courses:"🛒 Compras",restos:"🍽️ Restaurantes",nocturne:"🍺 Vida Nocturna",transport:"🚇 Transporte",sante:"❤️ Salud",telecom:"📱 Telecom",voyage:"✈️ Viajes"},
    presetDesc:{survival:"Ahorro máximo — pasta y coche compartido", standard:"Vida equilibrada — la experiencia Erasmus típica", golden:"Sin límites — vive tu mejor vida"},
  },
};

function getCatLabel(cat,t){return(t.catLabels&&t.catLabels[cat.key])||cat.label;}

function getCountry(city, lang){
  if(lang==="en") return COUNTRIES_EN[city.country]||city.country;
  if(lang==="es") return COUNTRIES_ES[city.country]||city.country;
  return city.country;
}
function getContinent(cont, lang){
  if(lang==="en") return CONTINENTS_EN[cont]||cont;
  if(lang==="es") return CONTINENTS_ES[cont]||cont;
  return cont;
}

// ── HELPERS ──
function calcTotal(city,preset,activeKeys,extra=0){
  const m=PRESETS[preset].multipliers;
  return Math.round(Object.entries(city.costs).filter(([k])=>activeKeys.includes(k)).reduce((s,[k,v])=>s+v*(m[k]||1),0))+extra;
}
function adjustedCosts(city,preset){
  const m=PRESETS[preset].multipliers;
  return Object.fromEntries(Object.entries(city.costs).map(([k,v])=>[k,Math.round(v*(m[k]||1))]));
}


function safetyLabel(score){
  if(score>=70)return{color:"#1A936F",icon:"🛡️",text:"Sûr"};
  if(score>=50)return{color:"#FFD700",icon:"⚠️",text:"Moyen"};
  return{color:"#FF4D4D",icon:"🔴",text:"Risqué"};
}

function englishLabel(level){
  const labels=[
    null,
    {bars:1,color:"#FF4D4D",text:"Très limité",desc:"L'anglais est peu parlé. Apprendre quelques bases locales est indispensable."},
    {bars:2,color:"#FF8C42",text:"Limité",desc:"L'anglais peut suffire dans les zones touristiques, mais pas au quotidien."},
    {bars:3,color:"#FFD700",text:"Modéré",desc:"L'anglais est compris dans la plupart des situations courantes."},
    {bars:4,color:"#1A936F",text:"Bon",desc:"L'anglais est largement parlé, tu pourras facilement te débrouiller."},
    {bars:5,color:"#5B8DEF",text:"Très bon",desc:"Pays anglophone ou niveau très élevé — aucun problème."},
  ];
  return labels[Math.max(1,Math.min(5,level))];
}

function shortLabel(l){return l.replace(/^\S+\s/,"");}
function parseCoords(coordStr){
  const m=coordStr.match(/([\d.]+)°([NS]),\s*([\d.]+)°([EO])/);
  if(!m)return null;
  return{lat:parseFloat(m[1])*(m[2]==="N"?1:-1),lng:parseFloat(m[3])*(m[4]==="E"?1:-1)};
}
function mercatorX(lng,w){return((lng+180)/360)*w;}
function mercatorY(lat,h){
  const r=lat*Math.PI/180;
  return(1-(Math.log(Math.tan(r/2+Math.PI/4))/Math.PI))/2*h;
}

function useWindowWidth(){
  const[w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return w;
}

// ── BUDGET METER ──
function BudgetMeter({total,t,darkMode=true}){
  const dm=darkMode;
  const pct=Math.min((total/BUDGET_WARN)*100,100);
  const over=total>BUDGET_WARN,mid=total>BUDGET_REF&&!over;
  const color=over?"#FF4D4D":mid?"#FFD700":"#1A936F";
  const diff=total-BUDGET_REF;
  return(
    <div style={{background:dm?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)",borderRadius:12,padding:"14px 16px",border:dm?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.08)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:dm?"#a0aec0":"#4a5568",fontSize:11,fontFamily:"'Space Mono',monospace"}}>{t.budgetMeter}</span>
        </div>
        <span style={{color,fontSize:20,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{total} €</span>
      </div>
      <div style={{height:5,background:dm?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)",borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,#1A936F,${color})`,borderRadius:99,transition:"width 0.6s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:10,color:"#4a5568",fontFamily:"'Space Mono',monospace"}}>
        <span>{t.refErasmus} : {BUDGET_REF} €</span><span>{t.alert} : {BUDGET_WARN} €</span>
      </div>
      {over&&<div style={{marginTop:9,padding:"8px 12px",background:"rgba(255,77,77,0.08)",border:"1px solid rgba(255,77,77,0.22)",borderRadius:8,fontSize:12,color:"#FF6B6B"}}>⚠️ +{diff} € au-dessus du seuil.</div>}
      {mid&&<div style={{marginTop:9,padding:"8px 12px",background:"rgba(255,215,0,0.07)",border:"1px solid rgba(255,215,0,0.18)",borderRadius:8,fontSize:12,color:"#FFD700"}}>💡 +{diff} € — gérable !</div>}
      {!over&&!mid&&<div style={{marginTop:9,padding:"8px 12px",background:"rgba(26,147,111,0.07)",border:"1px solid rgba(26,147,111,0.18)",borderRadius:8,fontSize:12,color:"#88D498"}}>✅ {Math.abs(diff)} € de marge.</div>}
    </div>
  );
}

// ── FUN FACT ──
function getFact(city,lang){if(lang==="en")return FACTS_EN[city.id]||city.funFact;if(lang==="es")return FACTS_ES[city.id]||city.funFact;return city.funFact;}
function FunFact({city,t,lang,darkMode=true}){
  const[vis,setVis]=useState(false);
  useEffect(()=>{setVis(false);const tm=setTimeout(()=>setVis(true),60);return()=>clearTimeout(tm);},[city.id]);
  return(
    <div style={{background:"linear-gradient(135deg,rgba(255,107,53,0.09),rgba(91,141,239,0.09))",borderRadius:12,padding:"12px 14px",border:"1px solid rgba(255,107,53,0.18)",opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(6px)",transition:"all 0.4s ease"}}>
      <div style={{fontSize:10,color:"#FF6B35",fontFamily:"'Space Mono',monospace",marginBottom:5,letterSpacing:1.5}}>{t.didYouKnow}</div>
      <p style={{margin:0,fontSize:13,color:darkMode?"#cbd5e0":"#2d3748",lineHeight:1.65}}>{getFact(city,lang)}</p>
    </div>
  );
}

// ── CATEGORY PANEL ──
function CategoryPanel({activeKeys,setActiveKeys,extraCost,setExtraCost,extraLabel,setExtraLabel,t}){
  const toggle=key=>setActiveKeys(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);
  const allOn=activeKeys.length===ALL_CAT_KEYS.length;
  return(
    <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"14px 16px",border:"1px solid rgba(255,255,255,0.07)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontSize:10,color:"#718096",fontFamily:"'Space Mono',monospace",letterSpacing:1}}>{t.activeCats}</span>
        <button onClick={()=>setActiveKeys(allOn?[]:ALL_CAT_KEYS)} style={{fontSize:10,padding:"2px 8px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#718096",cursor:"pointer"}}>{allOn?t.uncheckAll:t.checkAll}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 12px"}}>
        {CATEGORIES.map(c=>{
          const on=activeKeys.includes(c.key);
          return(
            <label key={c.key} onClick={()=>toggle(c.key)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"4px 6px",borderRadius:7,background:on?`${c.color}15`:"transparent",border:`1px solid ${on?c.color+"40":"rgba(255,255,255,0.05)"}`,transition:"all 0.15s"}}>
              <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${on?c.color:"rgba(255,255,255,0.2)"}`,background:on?c.color:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {on&&<span style={{color:"#0d1117",fontSize:10,fontWeight:700}}>✓</span>}
              </div>
              <span style={{fontSize:12,color:on?"#f7fafc":"#718096",userSelect:"none"}}>{getCatLabel(c,t)}</span>
            </label>
          );
        })}
      </div>
      <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:10,color:"#718096",fontFamily:"'Space Mono',monospace",marginBottom:8,letterSpacing:1}}>{t.otherCosts}</div>
        <div style={{display:"flex",gap:8}}>
          <input value={extraLabel} onChange={e=>setExtraLabel(e.target.value)} placeholder={t.otherPlaceholder} style={{flex:2,padding:"7px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#f7fafc",fontSize:12,outline:"none"}}/>
          <div style={{position:"relative",flex:1}}>
            <input type="number" min="0" value={extraCost||""} onChange={e=>setExtraCost(Math.max(0,parseInt(e.target.value)||0))} placeholder="0" style={{width:"100%",padding:"7px 28px 7px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#FFD700",fontSize:13,fontWeight:700,outline:"none",fontFamily:"'Space Mono',monospace"}}/>
            <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",color:"#718096",fontSize:11,pointerEvents:"none"}}>€</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL VIEW ──
function DetailView({city,preset,isMobile,activeKeys,extraCost,extraLabel,favorites,toggleFav,t,lang,darkMode,notes={},updateNote}){
  const[showSafetyInfo,setShowSafetyInfo]=useState(false);
  useEffect(()=>setShowSafetyInfo(false),[city.id]);
  const adj=adjustedCosts(city,preset);
  const total=calcTotal(city,preset,activeKeys,extraCost);
  const activeCats=CATEGORIES.filter(c=>activeKeys.includes(c.key));
  const pieData=activeCats.map(c=>({name:shortLabel(getCatLabel(c,t)),value:adj[c.key],fill:c.color}));
  if(extraCost>0)pieData.push({name:extraLabel||"Autres",value:extraCost,fill:"#a78bfa"});
  const isFav=favorites.has(city.id);
  const safetyScore=SAFETY[city.id]||55;
  const saf=safetyLabel(safetyScore);
  const dm=darkMode;
  const engLevel=ENGLISH_LEVEL[city.id]||2;
  const engInfo=englishLabel(engLevel);
  return(
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
        <div style={{fontSize:isMobile?38:48}}>{city.flag}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <h2 style={{margin:0,fontSize:isMobile?20:26,fontWeight:800,color:dm?"#f7fafc":"#1a202c"}}>{city.name}</h2>
            <button onClick={()=>toggleFav(city.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:isFav?"#FFD700":"#4a5568",transition:"all 0.2s",transform:isFav?"scale(1.2)":"scale(1)",filter:isFav?"drop-shadow(0 0 6px #FFD70088)":"none"}}>{isFav?"★":"☆"}</button>
          </div>
          <div style={{color:"#718096",fontSize:12,marginTop:2}}>{getCountry(city,lang)} · <span style={{color:CONT_COLORS[city.continent]||"#718096"}}>{getContinent(city.continent,lang)}</span> · {city.coords}</div>
        </div>
        {/* Safety badge */}
        <div style={{position:"relative",flexShrink:0}}>
          <div onClick={()=>setShowSafetyInfo(!showSafetyInfo)} style={{textAlign:"center",background:dm?`${saf.color}18`:`${saf.color}22`,border:`1px solid ${saf.color}55`,borderRadius:10,padding:"6px 10px",minWidth:58,cursor:"pointer",userSelect:"none",transition:"all 0.2s"}}>
            <div style={{fontSize:16}}>{saf.icon}</div>
            <div style={{fontSize:10,color:saf.color,fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{safetyScore}/100</div>
            <div style={{fontSize:8,color:saf.color,opacity:0.8}}>{t.safety} ℹ️</div>
          </div>
          {showSafetyInfo&&(
            <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:240,background:dm?"#1a202c":"#ffffff",border:`1px solid ${saf.color}55`,borderRadius:12,padding:"12px 14px",zIndex:50,boxShadow:"0 8px 24px rgba(0,0,0,0.3)"}}>
              <div style={{fontSize:11,fontWeight:700,color:saf.color,marginBottom:6,fontFamily:"'Space Mono',monospace"}}>{saf.icon} {saf.text.toUpperCase()} — {safetyScore}/100</div>
              <div style={{fontSize:11,color:dm?"#a0aec0":"#4a5568",lineHeight:1.6,marginBottom:8}}>
                Score calculé d'après le <strong style={{color:dm?"#e2e8f0":"#1a202c"}}>Numbeo Safety Index 2024</strong>, indice mondial basé sur des enquêtes auprès des habitants.
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4,fontSize:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#1A936F",fontSize:12}}>🛡️</span><span style={{color:dm?"#a0aec0":"#4a5568"}}>≥ 70 — Ville sûre</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#FFD700",fontSize:12}}>⚠️</span><span style={{color:dm?"#a0aec0":"#4a5568"}}>50–69 — Précautions normales</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#FF4D4D",fontSize:12}}>🔴</span><span style={{color:dm?"#a0aec0":"#4a5568"}}>&lt; 50 — Vigilance accrue</span></div>
              </div>
              <div style={{marginTop:8,fontSize:9,color:"#4a5568",borderTop:`1px solid ${dm?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)"}`,paddingTop:6}}>Source : numbeo.com · Données indicatives</div>
              <button onClick={()=>setShowSafetyInfo(false)} style={{position:"absolute",top:6,right:8,background:"none",border:"none",cursor:"pointer",color:"#4a5568",fontSize:14}}>✕</button>
            </div>
          )}
        </div>
      </div>

      <FunFact city={city} t={t} lang={lang} darkMode={darkMode}/>

      {/* ── ENGLISH LEVEL + NOTES ROW ── */}
      <div style={{display:"flex",gap:10,margin:"12px 0",flexWrap:"wrap"}}>
        {/* English level */}
        <div style={{flex:"0 0 auto",background:dm?`${engInfo.color}12`:`${engInfo.color}18`,border:`1px solid ${engInfo.color}40`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:18}}>🗣️</div>
          <div>
            <div style={{fontSize:9,color:"#718096",fontFamily:"'Space Mono',monospace",marginBottom:3,letterSpacing:1}}>{(t.englishLevel||"ANGLAIS").toUpperCase()}</div>
            <div style={{display:"flex",gap:3,marginBottom:3}}>
              {[1,2,3,4,5].map(i=>(
                <div key={i} style={{width:14,height:6,borderRadius:2,background:i<=engLevel?engInfo.color:dm?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)",transition:"background 0.3s"}}/>
              ))}
            </div>
            <div style={{fontSize:10,color:engInfo.color,fontWeight:700}}>{engInfo.text}</div>
            <div style={{fontSize:9,color:dm?"#4a5568":"#718096",marginTop:2,maxWidth:140,lineHeight:1.4}}>{engInfo.desc}</div>
          </div>
        </div>

        {/* Notes personnelles */}
        <div style={{flex:1,minWidth:180,background:dm?"rgba(255,215,0,0.04)":"rgba(255,215,0,0.08)",border:dm?"1px solid rgba(255,215,0,0.15)":"1px solid rgba(255,215,0,0.3)",borderRadius:12,padding:"10px 14px"}}>
          <div style={{fontSize:9,color:"#FFD700",fontFamily:"'Space Mono',monospace",marginBottom:6,letterSpacing:1}}>{(t.notes||"📝 NOTES").replace("📝 ","").toUpperCase()}</div>
          <textarea
            value={notes[city.id]||""}
            onChange={e=>updateNote&&updateNote(city.id,e.target.value)}
            placeholder={t.notesPlaceholder||"Tes notes..."}
            rows={3}
            style={{width:"100%",background:"transparent",border:"none",outline:"none",resize:"none",color:dm?"#e2e8f0":"#1a202c",fontSize:12,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}
          />
        </div>
      </div>

      <div style={{margin:"0 0 14px"}}>
        <BudgetMeter total={total} t={t} darkMode={darkMode}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:20}}>
        <div>
          <div style={{fontSize:10,color:"#718096",fontFamily:"'Space Mono',monospace",marginBottom:8,letterSpacing:1}}>{t.repartition}</div>
          {pieData.length>0?(
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={78} paddingAngle={2} animationBegin={0} animationDuration={600}>
                  {pieData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                </Pie>
                <Tooltip
  contentStyle={{background:dm?"#1a202c":"#ffffff",border:`1px solid rgba(${dm?"255,255,255":"0,0,0"},0.12)`,borderRadius:8,fontSize:12,boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}
  labelStyle={{color:dm?"#f7fafc":"#1a202c",fontWeight:700,marginBottom:4}}
  itemStyle={{color:dm?"#e2e8f0":"#1a202c"}}
  formatter={(v,name)=>[<span style={{color:dm?"#FFD700":"#FF6B35",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{`${v} €`}</span>,name]}
/>
              </PieChart>
            </ResponsiveContainer>
          ):<div style={{height:190,display:"flex",alignItems:"center",justifyContent:"center",color:"#4a5568",fontSize:13}}>—</div>}
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px 8px",justifyContent:"center",marginTop:4}}>
            {pieData.map((e,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:dm?"#a0aec0":"#4a5568"}}>
                <span style={{width:7,height:7,borderRadius:2,background:e.fill,display:"inline-block"}}/>
                {e.name}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:10,color:"#718096",fontFamily:"'Space Mono',monospace",marginBottom:8,letterSpacing:1}}>{t.detail}</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {activeCats.map(c=>{
              const val=adj[c.key];
              const pct=total>0?Math.round((val/total)*100):0;
              return(
                <div key={c.key} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:18,textAlign:"center",fontSize:13,flexShrink:0}}>{getCatLabel(c,t).split(" ")[0]}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                      <span style={{color:dm?"#a0aec0":"#4a5568"}}>{shortLabel(getCatLabel(c,t))}</span>
                      <span style={{color:dm?"#e2e8f0":"#1a202c",fontFamily:"'Space Mono',monospace"}}>{val} €</span>
                    </div>
                    <div style={{height:4,background:dm?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.08)",borderRadius:99}}>
                      <div style={{height:"100%",width:`${pct}%`,background:c.color,borderRadius:99,transition:"width 0.5s ease"}}/>
                    </div>
                  </div>
                </div>
              );
            })}
            {extraCost>0&&(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:18,textAlign:"center",fontSize:13}}>➕</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                    <span style={{color:dm?"#a0aec0":"#4a5568"}}>{extraLabel||"Autres"}</span>
                    <span style={{color:"#FFD700",fontFamily:"'Space Mono',monospace"}}>{extraCost} €</span>
                  </div>
                  <div style={{height:4,background:dm?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.08)",borderRadius:99}}>
                    <div style={{height:"100%",width:`${total>0?Math.round((extraCost/total)*100):0}%`,background:"#a78bfa",borderRadius:99}}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BATTLE VIEW ──
function BattleView({cities,preset,isMobile,activeKeys,extraCost,t,lang,darkMode}){
  const dm=darkMode;
  const SLOTS=[
    {color:"#FF6B35",label:"A"},
    {color:"#5B8DEF",label:"B"},
    {color:"#a78bfa",label:"C"},
  ];
  const totals=cities.map(c=>calcTotal(c,preset,activeKeys,extraCost));
  const minTotal=Math.min(...totals);
  const activeCats=CATEGORIES.filter(c=>activeKeys.includes(c.key));
  const barData=activeCats.map(c=>{
    const entry={name:shortLabel(getCatLabel(c,t))};
    cities.forEach((city,i)=>{const adj=adjustedCosts(city,preset);entry[city.name]=adj[c.key];});
    return entry;
  });
  const barColors=["#FF6B35","#5B8DEF","#a78bfa"];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* City cards — toujours 3 colonnes, compactes sur mobile */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
        {cities.map((city,i)=>{
          const total=totals[i];
          const isCheapest=total===minTotal;
          const color=SLOTS[i].color;
          const safetyScore=SAFETY[city.id]||55;
          const saf=safetyLabel(safetyScore);
          const diff=total-minTotal;
          return(
            <div key={city.id} style={{background:dm?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.04)",border:`2px solid ${color}55`,borderRadius:12,padding:isMobile?"8px":"12px 14px",position:"relative",minWidth:0,overflow:"hidden"}}>
              {isCheapest&&(
                <div style={{position:"absolute",top:0,left:0,right:0,background:"#1A936F",color:"#fff",fontSize:7,fontWeight:700,padding:"2px 0",textAlign:"center",fontFamily:"'Space Mono',monospace",letterSpacing:0.5}}>✅ MOINS CHER</div>
              )}
              <div style={{marginTop:isCheapest?14:0,display:"flex",flexDirection:"column",gap:4,alignItems:"center",textAlign:"center"}}>
                <span style={{fontSize:isMobile?22:28}}>{city.flag}</span>
                <div style={{minWidth:0,width:"100%"}}>
                  <div style={{fontWeight:800,color:dm?"#f7fafc":"#1a202c",fontSize:isMobile?11:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{city.name}</div>
                  {!isMobile&&<div style={{fontSize:9,color:"#718096",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{getCountry(city,lang)}</div>}
                </div>
                <div style={{fontSize:isMobile?13:16,fontWeight:800,color,fontFamily:"'Space Mono',monospace",lineHeight:1}}>{total}€</div>
                <div style={{fontSize:8,color:"#718096"}}>/mois</div>
                <div style={{display:"flex",alignItems:"center",gap:2,fontSize:9}}>
                  <span>{saf.icon}</span>
                  <span style={{color:saf.color,fontWeight:700}}>{safetyScore}</span>
                  <span style={{fontSize:7,padding:"1px 5px",borderRadius:20,background:`${color}25`,color,fontWeight:700,marginLeft:2}}>{SLOTS[i].label}</span>
                </div>
                {!isCheapest&&diff>0&&(
                  <div style={{fontSize:8,color,fontFamily:"'Space Mono',monospace",fontWeight:600}}>+{diff}€</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      {barData.length>0&&(
        <div style={{background:dm?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.03)",borderRadius:12,padding:"14px 6px 6px",border:dm?"1px solid rgba(255,255,255,0.05)":"1px solid rgba(0,0,0,0.08)"}}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{top:0,right:8,left:-20,bottom:44}}>
              <CartesianGrid strokeDasharray="3 3" stroke={dm?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.08)"}/>
              <XAxis dataKey="name" tick={{fill:dm?"#718096":"#4a5568",fontSize:9}} angle={-35} textAnchor="end" interval={0}/>
              <YAxis tick={{fill:dm?"#718096":"#4a5568",fontSize:9}}/>
              <Tooltip
                contentStyle={{background:dm?"#1a202c":"#ffffff",border:`1px solid rgba(${dm?"255,255,255":"0,0,0"},0.12)`,borderRadius:8,fontSize:11,boxShadow:"0 4px 12px rgba(0,0,0,0.3)"}}
                labelStyle={{color:dm?"#f7fafc":"#1a202c",fontWeight:700,marginBottom:4}}
                itemStyle={{color:dm?"#e2e8f0":"#1a202c"}}
                formatter={(v,name)=>[<span style={{color:dm?"#FFD700":"#FF6B35",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{`${v} €`}</span>,name]}
              />
              <RechartLegend wrapperStyle={{fontSize:10,color:dm?"#a0aec0":"#4a5568",paddingTop:4}}/>
              {cities.map((city,i)=>(
                <Bar key={city.id} dataKey={city.name} fill={barColors[i]} radius={[3,3,0,0]}/>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Fun facts — 1 colonne sur mobile, 3 sur desktop */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:10}}>
        {cities.map(city=><FunFact key={city.id} city={city} t={t} lang={lang} darkMode={darkMode}/>)}
      </div>
    </div>
  );
}

// ── MON BUDGET TAB ──
function BudgetTab({preset,activeKeys,extraCost,t,isMobile,darkMode=true,lang="fr"}){
  const[savings,setSavings]=useState(5000);
  const[monthly,setMonthly]=useState(0);
  const[sortBudget,setSortBudget]=useState("asc");
  const[contFilter,setContFilter]=useState("Tous");

  const rows=useMemo(()=>{
    let list=CITIES.filter(c=>contFilter==="Tous"||c.continent===contFilter);
    return list.map(city=>{
      const cost=calcTotal(city,preset,activeKeys,extraCost);
      const netCost=Math.max(0,cost-monthly);
      const months=netCost===0?Infinity:Math.floor(savings/netCost);
      return{city,cost,months,netCost};
    }).sort((a,b)=>sortBudget==="asc"?a.cost-b.cost:b.cost-a.cost);
  },[preset,activeKeys,extraCost,savings,monthly,sortBudget,contFilter]);

  const maxMonths=Math.min(...rows.filter(r=>r.months<Infinity).map(r=>r.months).concat([0]));
  const maxCost=Math.max(...rows.map(r=>r.cost));

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{textAlign:"center",paddingBottom:4}}>
        <h2 style={{fontSize:22,fontWeight:800,background:"linear-gradient(135deg,#FF6B35,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 6px"}}>{t.budgetTitle}</h2>
        <p style={{color:"#718096",fontSize:13,margin:0}}>{t.budgetHint}</p>
      </div>

      {/* Inputs */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16}}>
        {[
          {label:t.budgetMonthly,val:monthly,set:setMonthly,color:"#1A936F"},
          {label:t.budgetSavings,val:savings,set:setSavings,color:"#FF6B35"},
        ].map(({label,val,set,color})=>(
          <div key={label} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"16px",border:`1px solid ${color}30`}}>
            <div style={{fontSize:11,color:"#718096",marginBottom:8}}>{label}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <input type="number" min="0" value={val} onChange={e=>set(Math.max(0,parseInt(e.target.value)||0))}
                style={{flex:1,padding:"10px 14px",background:"rgba(255,255,255,0.06)",border:`1px solid ${color}50`,borderRadius:9,color,fontSize:20,fontWeight:800,fontFamily:"'Space Mono',monospace",outline:"none",width:"100%"}}/>
              <span style={{color:"#718096",fontSize:16}}>€</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {["Tous",...Object.keys(CONT_COLORS)].map(c=>(
            <button key={c} onClick={()=>setContFilter(c)} style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${contFilter===c?(CONT_COLORS[c]||"#FF6B35")+"60":"rgba(255,255,255,0.07)"}`,background:contFilter===c?"rgba(255,107,53,0.1)":"transparent",color:contFilter===c?"#f7fafc":"#718096",fontSize:10,cursor:"pointer"}}>
              {c==="Tous"?t.allContinents:getContinent(c,lang)}
            </button>
          ))}
        </div>
        <select value={sortBudget} onChange={e=>setSortBudget(e.target.value)} style={{marginLeft:"auto",padding:"5px 10px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#a0aec0",fontSize:12,outline:"none",cursor:"pointer"}}>
          <option value="asc">{t.sortCheap}</option>
          <option value="desc">{t.sortExpensive}</option>
        </select>
      </div>

      {/* Table */}
      <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:"1px solid rgba(255,255,255,0.06)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr 1fr",gap:8,padding:"10px 16px",background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:10,color:"#4a5568",fontFamily:"'Space Mono',monospace",letterSpacing:1}}>
          <span>{t.budgetTableCity}</span>
          <span style={{textAlign:"right"}}>{t.budgetTableCost}</span>
          <span style={{textAlign:"center"}}>{t.budgetTableMonths}</span>
          <span style={{textAlign:"right"}}>{t.budgetTableMonthly}</span>
        </div>
        {/* Rows */}
        <div style={{maxHeight:480,overflowY:"auto"}}>
          {rows.map(({city,cost,months,netCost})=>{
            const pct=maxCost>0?(cost/maxCost)*100:0;
            const monthsPct=months===Infinity?100:maxMonths>0?(months/Math.max(...rows.map(r=>r.months===Infinity?0:r.months)))*100:0;
            const durationColor=months===Infinity?"#1A936F":months>=12?"#FFD700":months>=6?"#F7C59F":"#FF4D4D";
            return(
              <div key={city.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr 1fr",gap:8,padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.04)",alignItems:"center",transition:"background 0.15s",cursor:"default"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {/* City */}
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>{city.flag}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#f7fafc"}}>{city.name}</div>
                    <div style={{fontSize:10,color:CONT_COLORS[city.continent]||"#718096"}}>{getContinent(city.continent,lang)}</div>
                  </div>
                </div>
                {/* Cost bar */}
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#FF6B35",fontFamily:"'Space Mono',monospace"}}>{cost} €</div>
                  <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:99,marginTop:3}}>
                    <div style={{height:"100%",width:`${pct}%`,background:"#FF6B35",borderRadius:99}}/>
                  </div>
                </div>
                {/* Duration bar */}
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:durationColor,fontFamily:"'Space Mono',monospace",minWidth:40}}>
                      {months===Infinity?t.budgetForever:`${months} ${t.budgetMonths}`}
                    </span>
                  </div>
                  <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:99,marginTop:4}}>
                    <div style={{height:"100%",width:`${Math.min(monthsPct,100)}%`,background:`linear-gradient(90deg,${durationColor}88,${durationColor})`,borderRadius:99,transition:"width 0.4s"}}/>
                  </div>
                </div>
                {/* Monthly needed */}
                <div style={{textAlign:"right",fontSize:11,color:netCost===0?"#1A936F":"#a0aec0",fontFamily:"'Space Mono',monospace"}}>
                  {netCost===0?"✅ 0 €":`${netCost} €`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAP VIEW ──
function MapView({preset,activeKeys,extraCost,favorites,toggleFav,t,isMobile,lang,darkMode}){
  const[hovered,setHovered]=useState(null);
  const[selected,setSelected]=useState(null);
  const[mapCont,setMapCont]=useState("Tous");
  const svgRef=useRef(null);
  const W=800,H=400;

  const visibleCities=useMemo(()=>
    CITIES.filter(c=>(mapCont==="Tous"||c.continent===mapCont)&&parseCoords(c.coords))
  ,[mapCont]);

  const cityPoints=useMemo(()=>
    visibleCities.map(city=>{
      const{lat,lng}=parseCoords(city.coords);
      const x=mercatorX(lng,W);
      const y=mercatorY(lat,H);
      return{city,x,y};
    })
  ,[visibleCities]);

  const info=selected||hovered;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <h2 style={{margin:0,fontSize:20,fontWeight:800,color:"#f7fafc"}}>{t.mapTitle}</h2>
          <p style={{margin:"4px 0 0",fontSize:12,color:"#718096"}}>{t.mapHint}</p>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {["Tous",...Object.keys(CONT_COLORS)].map(c=>(
            <button key={c} onClick={()=>setMapCont(c)} style={{padding:"3px 10px",borderRadius:20,border:`1px solid ${mapCont===c?(CONT_COLORS[c]||"#FF6B35")+"70":"rgba(255,255,255,0.07)"}`,background:mapCont===c?`${CONT_COLORS[c]||"#FF6B35"}18`:"transparent",color:mapCont===c?"#f7fafc":"#718096",fontSize:10,cursor:"pointer"}}>
              {c==="Tous"?t.allContinents:getContinent(c,lang)}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:16}}>
        {/* SVG Map */}
        <div style={{flex:1,background:darkMode?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.04)",borderRadius:16,border:darkMode?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.12)",overflow:"hidden",position:"relative"}}>
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:"auto",display:"block",cursor:"crosshair"}}>
            {/* Ocean background */}
            <rect width={W} height={H} fill={darkMode?"#0d1f35":"#a8c5d8"}/>
            {/* Continent shapes */}
            {WORLD_PATHS.map((p,i)=>(
              <path key={i} d={p.d} fill={darkMode?p.fill:"#b8c9b0"} stroke={darkMode?"rgba(100,160,220,0.25)":"rgba(255,255,255,0.7)"} strokeWidth={0.8}/>
            ))}
            {/* Grid lines */}
            {[-60,-30,0,30,60].map(lat=>{
              const y=mercatorY(lat,H);
              return(<line key={lat} x1={0} y1={y} x2={W} y2={y} stroke={darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.12)"} strokeWidth={lat===0?1.5:0.5}/>);
            })}
            {[-150,-120,-90,-60,-30,0,30,60,90,120,150].map(lng=>{
              const x=mercatorX(lng,W);
              return(<line key={lng} x1={x} y1={0} x2={x} y2={H} stroke={darkMode?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)"} strokeWidth={0.5}/>);
            })}
            {/* City dots */}
            {cityPoints.map(({city,x,y})=>{
              const isHov=hovered?.id===city.id;
              const isSel=selected?.id===city.id;
              const isFav=favorites.has(city.id);
              const color=CONT_COLORS[city.continent]||"#aaa";
              const total=calcTotal(city,preset,activeKeys,extraCost);
              return(
                <g key={city.id} style={{cursor:"pointer"}} onClick={()=>setSelected(city===selected?null:city)} onMouseEnter={()=>setHovered(city)} onMouseLeave={()=>setHovered(null)}>
                  {(isHov||isSel)&&<circle cx={x} cy={y} r={10} fill={color} opacity={0.15}/>}
                  <circle cx={x} cy={y} r={isSel?7:isHov?6:isFav?4.5:3.5} fill={isSel?"#FFD700":color} stroke={darkMode?"rgba(0,0,0,0.5)":"rgba(255,255,255,0.8)"} strokeWidth={isSel?1.5:1} opacity={0.92}/>
                  {isFav&&!isSel&&<text x={x} y={y-6} textAnchor="middle" fontSize={8} fill="#FFD700">★</text>}
                  {(isHov||isSel)&&(
                    <g>
                      <rect x={x+8} y={y-18} width={city.name.length*6.5+calcTotal(city,preset,activeKeys,extraCost).toString().length*7+28} height={24} rx={5} fill="#1a202c" stroke={color} strokeWidth={1} opacity={0.95}/>
                      <text x={x+14} y={y-2} fontSize={10} fill="#f7fafc" fontWeight="bold">{city.flag} {city.name}</text>
                      <text x={x+14+city.name.length*6.5+18} y={y-2} fontSize={10} fill={color} fontWeight="bold" fontFamily="monospace">{total}€</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          {/* Legend */}
          <div style={{position:"absolute",bottom:10,left:12,display:"flex",gap:8,flexWrap:"wrap"}}>
            {Object.entries(CONT_COLORS).map(([cont,color])=>(
              <div key={cont} style={{display:"flex",alignItems:"center",gap:4,fontSize:9,color:"#718096"}}>
                <span style={{width:7,height:7,borderRadius:"50%",background:color,display:"inline-block"}}/>
                {cont.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>

        {/* City info panel */}
        <div style={{width:isMobile?"100%":280,flexShrink:0}}>
          {info?(
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:`1px solid ${CONT_COLORS[info.continent]||"#FF6B35"}40`,padding:16,height:"100%"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{fontSize:36}}>{info.flag}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:800,fontSize:16,color:"#f7fafc"}}>{info.name}</span>
                    <button onClick={()=>toggleFav(info.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:favorites.has(info.id)?"#FFD700":"#4a5568",transition:"all 0.2s"}}>{favorites.has(info.id)?"★":"☆"}</button>
                  </div>
                  <div style={{fontSize:11,color:CONT_COLORS[info.continent]||"#718096"}}>{getCountry(info,lang)} · {getContinent(info.continent,lang)}</div>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 14px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#718096",marginBottom:4,fontFamily:"'Space Mono',monospace"}}>COÛT MENSUEL ({preset.toUpperCase()})</div>
                <div style={{fontSize:28,fontWeight:800,color:CONT_COLORS[info.continent]||"#FF6B35",fontFamily:"'Space Mono',monospace"}}>{calcTotal(info,preset,activeKeys,extraCost)} €</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {CATEGORIES.filter(c=>activeKeys.includes(c.key)).map(c=>{
                  const adj=adjustedCosts(info,preset);
                  return(
                    <div key={c.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11}}>
                      <span style={{color:"#a0aec0"}}>{getCatLabel(c,t)}</span>
                      <span style={{color:"#e2e8f0",fontFamily:"'Space Mono',monospace",fontSize:12}}>{adj[c.key]} €</span>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop:12,padding:"10px 12px",background:"rgba(255,107,53,0.07)",borderRadius:9,border:"1px solid rgba(255,107,53,0.15)"}}>
                <div style={{fontSize:10,color:"#FF6B35",marginBottom:4,fontFamily:"'Space Mono',monospace"}}>💡</div>
                <p style={{margin:0,fontSize:11,color:"#a0aec0",lineHeight:1.55}}>{getFact(info,lang).substring(0,160)}...</p>
              </div>
            </div>
          ):(
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:14,border:"1px solid rgba(255,255,255,0.05)",padding:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",minHeight:200,gap:12,color:"#4a5568",textAlign:"center"}}>
              <div style={{fontSize:40}}>🗺️</div>
              <div style={{fontSize:13}}>Passe la souris ou clique sur une ville</div>
              <div style={{fontSize:11}}>{cityPoints.length} villes affichées</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── APP ──
export default function App(){
  const width=useWindowWidth(),isMobile=width<768;
  const[lang,setLang]=useState("fr");
  const t=LANGS[lang];
  const[search,setSearch]=useState("");
  const[continent,setContinent]=useState("Tous");
  const[sortOrder,setSortOrder]=useState("az");
  const[preset,setPreset]=useState("standard");
  const[selectedCity,setSelectedCity]=useState(CITIES[0]);
  const[battleMode,setBattleMode]=useState(false);
  const[battleCityA,setBattleCityA]=useState(CITIES[0]);
  const[battleCityB,setBattleCityB]=useState(CITIES[1]);
  const[battleSelect,setBattleSelect]=useState("A");
  const[activeKeys,setActiveKeys]=useState(ALL_CAT_KEYS);
  const[extraCost,setExtraCost]=useState(0);
  const[extraLabel,setExtraLabel]=useState("");
  const[showFilters,setShowFilters]=useState(false);
  const[favorites,setFavorites]=useState(new Set());
  const[notes,setNotes]=useState({});
  const[darkMode,setDarkMode]=useState(true);
  const[battleCityC,setBattleCityC]=useState(CITIES[2]);
  const[activeTab,setActiveTab]=useState("cities"); // cities | budget | map
  const detailRef=useRef(null);

  const updateNote=useCallback((id,text)=>setNotes(prev=>({...prev,[id]:text})),[]);
  const toggleFav=useCallback(id=>setFavorites(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;}),[]);

  const filtered=useMemo(()=>{
    let list=CITIES.filter(c=>(continent==="Tous"||c.continent===continent)&&(c.name.toLowerCase().includes(search.toLowerCase())||c.country.toLowerCase().includes(search.toLowerCase())));
    if(sortOrder==="az") list=[...list].sort((a,b)=>a.name.localeCompare(b.name,"fr"));
    if(sortOrder==="price-asc") list=[...list].sort((a,b)=>calcTotal(a,preset,activeKeys)-calcTotal(b,preset,activeKeys));
    if(sortOrder==="price-desc") list=[...list].sort((a,b)=>calcTotal(b,preset,activeKeys)-calcTotal(a,preset,activeKeys));
    return list;
  },[search,continent,sortOrder,preset,activeKeys,lang,t]);

  const favCities=useMemo(()=>CITIES.filter(c=>favorites.has(c.id)),[favorites]);

  const handleCityClick=useCallback((city)=>{
    if(battleMode){if(battleSelect==="A")setBattleCityA(city);else if(battleSelect==="B")setBattleCityB(city);else setBattleCityC(city);}
    else setSelectedCity(city);
    if(isMobile&&detailRef.current)setTimeout(()=>detailRef.current.scrollIntoView({behavior:"smooth",block:"start"}),80);
  },[battleMode,battleSelect,isMobile]);

  const randomCity=useCallback(()=>{
    const city=CITIES[Math.floor(Math.random()*CITIES.length)];
    setSelectedCity(city);
    setActiveTab("cities");
    if(isMobile&&detailRef.current)setTimeout(()=>detailRef.current.scrollIntoView({behavior:"smooth",block:"start"}),80);
  },[isMobile]);

  const inactiveCount=ALL_CAT_KEYS.length-activeKeys.length;

  const TABS=[
    {id:"cities",label:t.tabCities},
    {id:"budget",label:t.tabBudget},
    {id:"map",   label:t.tabMap},
  ];

  return(
    <div style={{minHeight:"100vh",background:darkMode?"#0d1117":"#f0f4f8",fontFamily:"'DM Sans',-apple-system,sans-serif",color:darkMode?"#f7fafc":"#1a202c",transition:"background 0.3s,color 0.3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(255,107,53,0.35);border-radius:99px;}
        input::placeholder{color:#4a5568;} button,select{font-family:'DM Sans',sans-serif;}
        select option{background:${darkMode?'#1a202c':'#ffffff'};}
        input[type=number]::-webkit-inner-spin-button{opacity:0;}
        textarea{font-family:'DM Sans',sans-serif;} textarea::placeholder{color:#4a5568;}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:darkMode?"linear-gradient(180deg,rgba(255,107,53,0.07) 0%,transparent 100%)":"linear-gradient(180deg,rgba(255,107,53,0.12) 0%,rgba(255,255,255,0.95) 100%)",borderBottom:darkMode?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.1)",padding:isMobile?"10px 12px":"14px 24px",position:"sticky",top:0,zIndex:30,backdropFilter:"blur(14px)"}}>
        <div style={{maxWidth:1400,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:9,color:"#FF6B35",fontFamily:"'Space Mono',monospace",letterSpacing:2.5}}>STUDENT</div>
              <h1 style={{fontSize:isMobile?14:19,fontWeight:800,background:"linear-gradient(135deg,#FF6B35,#FFD700)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.2,whiteSpace:"nowrap"}}>{t.appSubtitle}</h1>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
              {/* Dark/Light mode toggle */}
              <button onClick={()=>setDarkMode(!darkMode)} style={{padding:"4px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:darkMode?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.08)",color:darkMode?"#FFD700":"#FF6B35",cursor:"pointer",fontSize:16,transition:"all 0.2s",lineHeight:1}}>{darkMode?"☀️":"🌙"}</button>
              {/* Language switcher */}
              <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.04)",padding:2,borderRadius:8,border:"1px solid rgba(255,255,255,0.07)"}}>
                {[{code:"fr",flag:"🇫🇷"},{code:"en",flag:"🇬🇧"},{code:"es",flag:"🇪🇸"}].map(({code,flag})=>(
                  <button key={code} onClick={()=>setLang(code)} style={{padding:"4px 8px",borderRadius:6,border:"none",cursor:"pointer",background:lang===code?"rgba(255,107,53,0.25)":"transparent",fontSize:14,transition:"all 0.2s",opacity:lang===code?1:0.5}}>{flag}</button>
                ))}
              </div>
              {/* Presets */}
              <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.04)",padding:2,borderRadius:8,border:"1px solid rgba(255,255,255,0.07)"}}>
                {Object.entries(PRESETS).map(([key,p])=>(
                  <button key={key} onClick={()=>setPreset(key)} style={{padding:isMobile?"4px 7px":"5px 10px",borderRadius:6,border:"none",cursor:"pointer",background:preset===key?p.color:"transparent",color:preset===key?"#0d1117":"#718096",fontWeight:preset===key?700:400,fontSize:isMobile?10:11,transition:"all 0.2s"}}>{p.label}</button>
                ))}
              </div>
              {/* Battle */}
              <button onClick={()=>{setBattleMode(!battleMode);setActiveTab("cities");}} style={{padding:isMobile?"5px 9px":"5px 12px",borderRadius:7,border:`1px solid ${battleMode?"rgba(255,107,53,0.5)":"rgba(255,255,255,0.1)"}`,background:battleMode?"rgba(255,107,53,0.15)":"transparent",color:battleMode?"#FF6B35":"#718096",cursor:"pointer",fontSize:isMobile?10:11,fontWeight:600,transition:"all 0.2s"}}>
                {battleMode?t.battleQuit:t.battleBtn}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:2,marginTop:10,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3,border:"1px solid rgba(255,255,255,0.06)",width:"fit-content"}}>
            {TABS.map(tab=>(
              <button key={tab.id} onClick={()=>{setActiveTab(tab.id);setBattleMode(false);}} style={{padding:"6px 14px",borderRadius:7,border:"none",cursor:"pointer",background:activeTab===tab.id?"rgba(255,107,53,0.2)":"transparent",color:activeTab===tab.id?"#FF6B35":darkMode?"#718096":"#4a5568",fontWeight:activeTab===tab.id?700:400,fontSize:isMobile?11:12,transition:"all 0.2s",whiteSpace:"nowrap"}}>{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BATTLE SELECT BAR ── */}
      {battleMode&&(
        <div style={{background:"rgba(255,107,53,0.05)",borderBottom:"1px solid rgba(255,107,53,0.16)",padding:"7px 14px"}}>
          <div style={{maxWidth:1400,margin:"0 auto",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#a0aec0"}}>{t.battleSelectFor}</span>
            {[{s:"A",city:battleCityA,color:"#FF6B35"},{s:"B",city:battleCityB,color:"#5B8DEF"},{s:"C",city:battleCityC,color:"#a78bfa"}].map(({s,city,color})=>(
              <button key={s} onClick={()=>setBattleSelect(s)} style={{padding:"4px 12px",borderRadius:6,border:`1px solid ${battleSelect===s?color+"80":"rgba(255,255,255,0.08)"}`,background:battleSelect===s?color+"18":"transparent",color:battleSelect===s?color:"#718096",cursor:"pointer",fontSize:11,fontWeight:600}}>
                {t.battleCity} {s} · {city.flag} {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:isMobile?"12px":"20px 24px"}}>

        {/* ── BUDGET TAB ── */}
        {activeTab==="budget"&&(
          <BudgetTab preset={preset} activeKeys={activeKeys} extraCost={extraCost} t={t} isMobile={isMobile} darkMode={darkMode} lang={lang}/>
        )}

        {/* ── MAP TAB ── */}
        {activeTab==="map"&&(
          <MapView preset={preset} activeKeys={activeKeys} extraCost={extraCost} favorites={favorites} toggleFav={toggleFav} t={t} isMobile={isMobile} lang={lang} darkMode={darkMode}/>
        )}

        {/* ── CITIES TAB ── */}
        {activeTab==="cities"&&(
          <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:18,alignItems:"flex-start"}}>

            {/* SIDEBAR */}
            <div style={{width:isMobile?"100%":300,flexShrink:0,display:"flex",flexDirection:"column",gap:10,order:isMobile&&battleMode?2:0}}>

              {/* Search */}
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"#4a5568"}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{width:"100%",padding:"9px 10px 9px 32px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,color:"#f7fafc",fontSize:13,outline:"none"}} onFocus={e=>e.target.style.borderColor="rgba(255,107,53,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.07)"}/>
              </div>

              {/* Continents */}
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {["Tous",...CONTINENTS.filter(c=>c!=="Tous")].map(c=>(
                  <button key={c} onClick={()=>setContinent(c)} style={{padding:"3px 9px",borderRadius:20,border:`1px solid ${continent===c?"rgba(255,107,53,0.45)":"rgba(255,255,255,0.07)"}`,background:continent===c?"rgba(255,107,53,0.12)":"transparent",color:continent===c?"#FF6B35":"#718096",fontSize:10,cursor:"pointer",fontWeight:continent===c?600:400}}>
                    {c==="Tous"?t.allContinents:getContinent(c,lang)}
                  </button>
                ))}
              </div>

              {/* Sort + random */}
              <div style={{display:"flex",gap:6}}>
                <select value={sortOrder} onChange={e=>setSortOrder(e.target.value)} style={{flex:1,padding:"7px 8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,color:"#a0aec0",fontSize:12,outline:"none",cursor:"pointer"}}>
                  <option value="az">{t.sortAZ}</option>
                  <option value="price-asc">{t.sortCheap}</option>
                  <option value="price-desc">{t.sortExpensive}</option>
                </select>
                <button onClick={randomCity} title="Random" style={{padding:"7px 11px",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.04)",color:"#a0aec0",cursor:"pointer",fontSize:15}}>{t.randomBtn}</button>
              </div>

              {/* Category filter toggle */}
              <button onClick={()=>setShowFilters(!showFilters)} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${showFilters||inactiveCount>0?"rgba(255,107,53,0.4)":"rgba(255,255,255,0.07)"}`,background:showFilters?"rgba(255,107,53,0.1)":"rgba(255,255,255,0.02)",color:showFilters||inactiveCount>0?"#FF6B35":"#718096",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span>{t.customCats}</span>
                <span style={{fontSize:10,background:"rgba(255,107,53,0.15)",borderRadius:10,padding:"1px 6px"}}>{activeKeys.length}/8{inactiveCount>0?` (−${inactiveCount})`:""}</span>
              </button>
              {showFilters&&<CategoryPanel activeKeys={activeKeys} setActiveKeys={setActiveKeys} extraCost={extraCost} setExtraCost={setExtraCost} extraLabel={extraLabel} setExtraLabel={setExtraLabel} t={t}/>}

              {/* Favorites section */}
              {favCities.length>0&&(
                <div style={{background:"rgba(255,215,0,0.04)",borderRadius:10,padding:"10px 12px",border:"1px solid rgba(255,215,0,0.15)"}}>
                  <div style={{fontSize:10,color:"#FFD700",fontFamily:"'Space Mono',monospace",marginBottom:8,letterSpacing:1}}>{t.favoritesTitle}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {favCities.map(city=>{
                      const total=calcTotal(city,preset,activeKeys,extraCost);
                      return(
                        <div key={city.id} onClick={()=>handleCityClick(city)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 8px",borderRadius:7,background:selectedCity.id===city.id?"rgba(255,215,0,0.12)":"transparent",cursor:"pointer",transition:"background 0.15s"}}>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <span style={{fontSize:13}}>{city.flag} {city.name}</span>
                            {notes[city.id]&&<span style={{fontSize:9,opacity:0.5}}>📝</span>}
                          </div>
                          <span style={{fontSize:11,color:"#FFD700",fontFamily:"'Space Mono',monospace"}}>{total} €</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* City count */}
              <div style={{fontSize:10,color:darkMode?"#4a5568":"#718096",fontFamily:"'Space Mono',monospace"}}>{filtered.length} {t.cities}{filtered.length!==1?"s":""}</div>

              {/* City list */}
              <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:isMobile?(battleMode?160:240):"calc(100vh - 440px)",overflowY:"auto",paddingRight:2}}>
                {filtered.map(city=>{
                  const total=calcTotal(city,preset,activeKeys,extraCost);
                  const isA=battleMode&&city.id===battleCityA.id;
                  const isB=battleMode&&city.id===battleCityB.id;
                  const isC=battleMode&&city.id===battleCityC.id;
                  const isSel=battleMode?(isA||isB||isC):city.id===selectedCity.id;
                  const ac=isC?"#a78bfa":isB?"#5B8DEF":"#FF6B35";
                  const isFav=favorites.has(city.id);
                  return(
                    <div key={city.id} onClick={()=>handleCityClick(city)} style={{padding:"8px 12px",borderRadius:9,background:isSel?`${ac}14`:darkMode?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.04)",border:`1px solid ${isSel?`${ac}45`:"rgba(255,255,255,0.05)"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <span style={{fontSize:18}}>{city.flag}</span>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{fontSize:13,fontWeight:isSel?700:500,color:isSel?(darkMode?"#f7fafc":"#1a202c"):darkMode?"#cbd5e0":"#2d3748"}}>{city.name}</span>
                            {isFav&&<span style={{fontSize:10,color:"#FFD700"}}>★</span>}
                            {notes[city.id]&&<span style={{fontSize:9,opacity:0.6}} title={notes[city.id]}>📝</span>}
                          </div>
                          <div style={{fontSize:10,color:darkMode?"#4a5568":"#718096"}}>{getCountry(city,lang)}</div>
                        </div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:12,fontWeight:700,color:isSel?ac:darkMode?"#718096":"#4a5568",fontFamily:"'Space Mono',monospace"}}>{total} €</div>
                        {!battleMode&&(
                          <div style={{display:"flex",flexDirection:"column",gap:2,alignItems:"flex-end",marginTop:2}}>
                            <div style={{fontSize:9,color:safetyLabel(SAFETY[city.id]||55).color}}>{safetyLabel(SAFETY[city.id]||55).icon} {SAFETY[city.id]||55}</div>
                            <div style={{display:"flex",gap:1}}>
                              {[1,2,3,4,5].map(i=>{const lvl=ENGLISH_LEVEL[city.id]||2;const el=englishLabel(lvl);return <div key={i} style={{width:6,height:3,borderRadius:1,background:i<=lvl?el.color:"rgba(128,128,128,0.2)"}}/>;})}</div>
                          </div>
                        )}
                        {battleMode&&isSel&&<div style={{fontSize:9,color:ac,fontWeight:700}}>{t.battleCity} {isA?"A":isB?"B":"C"}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAIL PANEL */}
            <div ref={detailRef} style={{flex:1,minWidth:0,background:darkMode?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.9)",border:darkMode?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.1)",borderRadius:16,padding:isMobile?12:24,...(isMobile?{scrollMarginTop:80,order:isMobile&&battleMode?1:0}:{})}}>
              {isMobile&&!battleMode&&(
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,paddingBottom:10,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{fontSize:20}}>{selectedCity.flag}</span>
                  <span style={{color:"#FF6B35",fontWeight:700,fontSize:14}}>{selectedCity.name}</span>
                  <span style={{fontSize:11,color:"#4a5568",marginLeft:"auto"}}>↑</span>
                </div>
              )}
              {battleMode
                ?<BattleView cities={[battleCityA,battleCityB,battleCityC]} preset={preset} isMobile={isMobile} activeKeys={activeKeys} extraCost={extraCost} t={t} lang={lang} darkMode={darkMode}/>
                :<DetailView city={selectedCity} preset={preset} isMobile={isMobile} activeKeys={activeKeys} extraCost={extraCost} extraLabel={extraLabel} favorites={favorites} toggleFav={toggleFav} t={t} lang={lang} darkMode={darkMode} notes={notes} updateNote={updateNote}/>
              }
            </div>
          </div>
        )}
      </div>

      <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",padding:"10px 24px",textAlign:"center",fontSize:10,color:"#2d3748",fontFamily:"'Space Mono',monospace"}}>
        STUDENT GLOBE-TROTTER PRO 2026 · MADE WITH ❤️ BY ELIO
      </div>
    </div>
  );
}


