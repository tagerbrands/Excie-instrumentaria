import { v4 as uuidv4 } from 'uuid';

export type CheckboxGroup = string[];

export interface AnswerSet {
  id: string;
  infoGebruik: string;
  infoBron: string;
  opbrengst: string;
  actie: string;
  delenOptIn: 'Ja' | 'Nee' | '';
  delen: string;
}

export interface ThemeResponse {
  id: string;
  themeName: string;
  synthese?: string;
  answerSets: AnswerSet[];
}

export interface InterviewData {
  isAnalysis?: boolean;
  analysisTitle?: string;
  analysisSourceIds?: string[];
  id: string;
  lastUpdated: string;
  // Meta
  excie: string;
  datum: string;
  cveLid: string;
  
  // Startvragen
  onderwijsvorm: CheckboxGroup;
  onderwijsvormOpmerkingen: string;
  doelExcie: string;
  drieDoelen: string;
  borgingsagenda: 'Ja' | 'Nee' | '';
  borgingsagendaDelen: 'Ja' | 'Nee' | '';
  modelKader: string;
  
  // Categories
  toetsbeleid: ThemeResponse[];
  toetsorganisatie: ThemeResponse[];
  toetsbekwaamheid: ThemeResponse[];
  toetsTaken: ThemeResponse[];
  toetsprogramma: ThemeResponse[];
  
  // Slotvragen
  verdereInstrumenten: string;
  eigenstandigOordeel: string;
  vragenBorgenKwaliteit: string;
}

export const createEmptyAnswerSet = (): AnswerSet => ({
  id: uuidv4(),
  infoGebruik: '',
  infoBron: '',
  opbrengst: '',
  actie: '',
  delenOptIn: '',
  delen: ''
});

export const createEmptyThemeResponse = (themeName: string): ThemeResponse => ({
  id: uuidv4(),
  themeName,
  answerSets: [createEmptyAnswerSet()]
});

export interface ThemeInfo {
  theme: string;
  subthemes: {
    subtheme: string;
    toelichting: string;
    suggesties: string;
  }[];
}

export const ENTITY_THEMES: Record<string, ThemeInfo[]> = {
  toetsTaken: [
    {
      theme: 'LUK-kwaliteit',
      subthemes: [
        { subtheme: 'Formulering', toelichting: 'Heldere, toetsbare formuleringen van LUKs die zijn afgestemd op het juiste niveau binnen het curriculum. Rubrics maken criteria evt. concreet en meetbaar.', suggesties: 'Valideer of (doorontwikkelingen van) de LUKs voldoen aan de geldende NVAO kwaliteitseisen: tuning, niveau, taxonomie.' }
      ]
    },
    {
      theme: 'Portfoliocriteria',
      subthemes: [
        { subtheme: 'Ontvankelijkheidscriteria', toelichting: 'Vastleggen van vereisten die niet onder de LUKs vallen, maar wel noodzaak zijn om juiste beslissingen te nemen.', suggesties: 'Evalueer deze criteria periodiek om vast te stellen dat ze 1) noodzakelijk zijn, 2) niet leiden tot overmatige belasting van studenten, 3) samenhang vertonen met de LUKs en 4) bijdragen aan de kwaliteit van beslissingen.' },
        { subtheme: 'VRAAKKT', toelichting: 'Duidelijke afspraken over de toepassing van de VRAAKKT-criteria.', suggesties: 'Beoordeel of toetsinstructies omtrent de toepassing van VRAAKKT-criteria van voldoende kwaliteit zijn. Verifieer of VRAAKKT-criteria zuiver in de beslisprocedure zijn geïntegreerd.' },
        { subtheme: 'Verplichte bewijsmaterialen', toelichting: 'Vastgelegde bewijsmaterialen die een vaste basis vormen voor beoordeling, met invloed op o.a. kwaliteit van scaffolding, kalibratie, feedbackprocessen en beslissingen.', suggesties: 'Analyseer het ontwerp i.r.t. toetsbeleid, didactische visie en kwaliteitscriteria systematisch en observeer het effect op de beslissing (risico op ‘afvinken’ kan de holistische blik verstoren). Evalueer hoe studenten worden geïnformeerd over de invloed van verplichte bewijsmaterialen op beslissingen.' }
      ]
    },
    {
      theme: 'Kaders & Procedures',
      subthemes: [
        { subtheme: 'Bewijsmateriaal (Low stake)', toelichting: 'Integratie van bewijsmaterialen en bijbehorende feedback in het onderwijsontwerp, conform de principes van constructive alignment.', suggesties: 'Stel vast dat bewijsmaterialen zijn ontworpen in relatie tot kwaliteitscriteria, hoe ze worden verzameld en hoe en door wie feedback wordt gegenereerd en vastgelegd. Zie periodiek en steekproefsgewijs toe op de uitvoer van de vastgestelde procedures.' },
        { subtheme: 'Eerder verworven bewijs (EVB)', toelichting: 'Richtlijnen voor de omgang met bewijsmaterialen die buiten het toezicht van de opleiding tot stand zijn gekomen.', suggesties: 'Toets of de EVB-procedure de kwaliteit en authenticiteit van extern bewijsmateriaal waarborgt. Zie periodiek en steekproefsgewijs toe op de uitvoer van de vastgestelde procedures.' },
        { subtheme: 'Tussentijdse evaluatie (Intermediate stake)', toelichting: 'Feedbackmomenten die halverwege het leertraject inzicht geven in de voortgang richting de LUKs. Hierbij wordt het portfolio holistisch bekeken.', suggesties: 'Verifieer of de status van deze beoordeling in relatie tot de beslissing transparant is voor alle actoren. Valideer of beoordelingscriteria in relatie tot het holistische oordeel transparant zijn voor alle actoren. Zie periodiek en steekproefsgewijs toe op de uitvoer van de vastgestelde procedures.' }
      ]
    },
    {
      theme: 'Digitale systemen',
      subthemes: [
        { subtheme: 'Authenticiteitscheck', toelichting: 'Digitale systemen moeten een robuuste check op de authenticiteit van bewijsmaterialen en feedback mogelijk maken.', suggesties: 'Evalueer periodiek of procedures voor documentatie van bewijsmaterialen en feedback mogelijk zijn (in relatie tot toepassing van VRAAKKT-criteria, koppeling van bewijsmaterialen aan feedback, enz.).' }
      ]
    },
    {
      theme: 'Fraudebeleid',
      subthemes: [
        { subtheme: 'Informeren, Preventie & Melden', toelichting: 'Integraal fraudebeleid gericht op voorkomen en vroegtijdig signaleren van fraude door betrokkenen te informeren, incentives te vermijden en detectie inzetten ter bijsturing i.p.v. bestraffing.', suggesties: 'Beoordeel hoe fraudepreventie en informatievoorziening terugkerend zijn geïntegreerd in het curriculum. Instrueer relevante actoren periodiek over de procedure voor het melden van een vermoeden van fraude.' }
      ]
    }
  ],
  toetsprogramma: [
    {
      theme: 'LUK-kwaliteit',
      subthemes: [
        { subtheme: 'BOKS(AE)', toelichting: 'Body of Knowledge, Skills (and Attitude & Ethics), geformuleerd a.d.h.v. het beroepscompetentieprofiel.', suggesties: 'Toets of de LUKs de BOKS(AE) aantoonbaar dekken en of die relatie begrijpelijk is opgenomen in de Zelfevaluatie en Reflectie (ZER) t.b.v. accreditatie.' }
      ]
    }
  ],
  toetsbeleid: [
    {
      theme: 'Kaders & Procedures',
      subthemes: [
        { subtheme: 'Beslissing (High stake)', toelichting: 'Het uiteindelijke besluitvormingsproces waarbij wordt vastgesteld of een student voldoet aan de toetscriteria.', suggesties: 'Toets of de beslisprocedure grip geeft op de rolverdeling, mate van (on)afhankelijkheid van beoordelaars en toepassing van vierogenbeleid. Beoordeel of de beslisprocedure aan alle eisen voldoet (conform OER, examinatorhandelingen, remediëring, enz.). Beoordeel of toetsinstructies en evt. rubrics van voldoende kwaliteit zijn. Zie periodiek en steekproefsgewijs toe op de uitvoer van de vastgestelde procedures.' }
      ]
    },
    {
      theme: 'Organisatie',
      subthemes: [
        { subtheme: 'Governance', toelichting: 'De verdeling van rollen, taken en verantwoordelijkheden binnen het onderwijs- en toetssysteem.', suggesties: 'Analyseer systematisch of taken en verantwoordelijkheden bij de juiste rollen zijn belegd, of inzichtelijk is hoe rollen samenwerken en zich tot elkaar verhouden, met welk mandaat ze opereren en of facilitering adequaat is. Evalueer periodiek of de actoren rolvast handelen conform hun verantwoordelijkheden.' }
      ]
    },
    {
      theme: 'Fraudebeleid',
      subthemes: [
        { subtheme: 'Onderzoek & Sanctioneren', toelichting: 'Na een melding van fraude start een onderzoek dat pedagogisch is ingericht, met als doel het leerproces van de student te ondersteunen in plaats van te straffen.', suggesties: 'Ontwerp en implementeer een methodiek voor fraudeonderzoek die recht doet aan haar doel en evalueer deze periodiek. Leg een sanctieladder transparant vast, en sanctioneer a.d.h.v. een heldere contextschets en onderbouwing.' }
      ]
    }
  ],
  toetsorganisatie: [
    {
      theme: 'Profiel examinatoren',
      subthemes: [
        { subtheme: 'Kalibratie', toelichting: 'Structurele kalibratiesessies om de interpretatie van LUKs en verwachtingen t.a.v. ontvankelijkheidscriteria eenduidig te maken en zo tot consistente besluitvorming te komen.', suggesties: 'Zie toe op structurele roostering en aanwezigheid van kalibratiesessies. Beoordeel of verslaglegging en communicatie over bereikte consensus van voldoende kwaliteit is. Verifieer de kwaliteit van kalibratie via steekproefsgewijze herbeoordelingen.' },
        { subtheme: 'Feedbackgeletterdheid', toelichting: 'Examinatoren moeten in staat zijn om zowel de inhoud als de kwaliteit van feedback te interpreteren (feedback duiden) en helder, onderbouwd feedback te geven.', suggesties: 'Valideer de kwaliteit en toepassing van ondersteunende middelen (zoals een handreiking).' }
      ]
    },
    {
      theme: 'Digitale systemen',
      subthemes: [
        { subtheme: 'Externe validering', toelichting: 'Mogelijkheid voor externe experts om de toetskwaliteit te beoordelen en een onafhankelijke kwaliteitscheck te doen, ook na uitschrijving van de student.', suggesties: 'Analyseer systematisch of externe validatie van portfolio’s is ingericht, met aandacht voor privacy en (data)veiligheid.' },
        { subtheme: 'Certificering', toelichting: 'Examinatoren moeten beschikken over de juiste kwalificaties (bijvoorbeeld BKE, master) die passen bij de toetsingstaak.', suggesties: 'Verifieer periodiek of certificering passend en actueel is in relatie tot de taak (bijv. via HR-systemen).' }
      ]
    }
  ],
  toetsbekwaamheid: [
    {
      theme: 'Profiel examinatoren',
      subthemes: [
        { subtheme: 'Professionalisering', toelichting: 'Structurele bijscholing, trainingen en intervisie om de deskundigheid en integriteit van examinatoren te borgen.', suggesties: 'Stel eisen aan structurele professionalisering, monitor intervisie en trainingsdeelname, beoordeel facilitering.' },
        { subtheme: 'Kalibratie', toelichting: 'Structurele kalibratiesessies om de interpretatie van LUKs en verwachtingen t.a.v. ontvankelijkheidscriteria eenduidig te maken en zo tot consistente besluitvorming te komen.', suggesties: 'Zie steekproefsgewijs toe op de uitvoer van de kalibratieprocedure, incl. de kwaliteit en toepassing van ondersteunende middelen (zoals een handreiking).' },
        { subtheme: 'Feedbackgeletterdheid', toelichting: 'Examinatoren moeten in staat zijn om zowel de inhoud als de kwaliteit van feedback te interpreteren (feedback duiden) en helder, onderbouwd feedback te geven.', suggesties: 'Analyseer de kwaliteit van feedback geven systematisch, bijv. via een analyse op de toepassing van feedbackmodellen, examinator- en studentevaluaties, of verzoeken tot herbeoordeling waar feedbackkwaliteit in het geding is. Toets de kwaliteit van feedback duiden, bijv. via de inzet van herbeoordelingen op risicovolle eindwerken.' }
      ]
    }
  ]
};

export const defaultInterview: Omit<InterviewData, 'id' | 'lastUpdated'> = {
  excie: '',
  datum: '',
  cveLid: '',
  onderwijsvorm: [],
  onderwijsvormOpmerkingen: '',
  doelExcie: '',
  drieDoelen: '',
  borgingsagenda: '',
  borgingsagendaDelen: '',
  modelKader: '',
  toetsbeleid: ENTITY_THEMES['toetsbeleid'].map(t => createEmptyThemeResponse(t.theme)),
  toetsorganisatie: ENTITY_THEMES['toetsorganisatie'].map(t => createEmptyThemeResponse(t.theme)),
  toetsbekwaamheid: ENTITY_THEMES['toetsbekwaamheid'].map(t => createEmptyThemeResponse(t.theme)),
  toetsTaken: ENTITY_THEMES['toetsTaken'].map(t => createEmptyThemeResponse(t.theme)),
  toetsprogramma: ENTITY_THEMES['toetsprogramma'].map(t => createEmptyThemeResponse(t.theme)),
  verdereInstrumenten: '',
  eigenstandigOordeel: '',
  vragenBorgenKwaliteit: '',
};

export const ONDERWIJSVORM_OPTIONS = [
  'TGO',
  'Programmatisch toetsen',
  'Flexibel onderwijs',
  'Inter-/transdiciplinair toetsen',
  'Anders, nl...'
];

export const CATEGORIES = [
  { 
    key: 'toetsbeleid', 
    label: 'TOETSBELEID', 
    color: 'bg-pink-100 border-pink-300', 
    headerBg: 'bg-pink-200',
    description: 'Met het toetsbeleid wordt het geheel aan vastgestelde afspraken, zowel inhoudelijk als procedureel, over toetsen en beoordelen bedoeld (Bruijns & Kok, 2015). Binnen het integraal toetsbeleid zijn meerdere niveaus te onderscheiden, waaronder het beleid op instellingsniveau en het beleid op opleidingsniveau.' 
  },
  { 
    key: 'toetsorganisatie', 
    label: 'TOETSORGANISATIE', 
    color: 'bg-orange-100 border-orange-300', 
    headerBg: 'bg-orange-200',
    description: 'De kwaliteit van de hele organisatie van het toetsbouwwerk is belangrijk om toetskwaliteit te kunnen garanderen. Met de toetsorganisatie wordt verwezen naar de wijze waarop docenten, examencommissie, toetscommissie, management en ondersteunende medewerkers doelgericht met elkaar samenwerken om de gewenste toetskwaliteit op alle toetsentiteiten te realiseren (Van Deursen & Van Zijl, 2015). Daarbij gaat het om het vaststellen van rollen, taken en verantwoordelijkheden van actoren/betrokkenen bij toetsing, het rolvast met elkaar samenwerken en de logistieke organisatie van toetsing.' 
  },
  { 
    key: 'toetsbekwaamheid', 
    label: 'TOETSBEKWAAMHEID', 
    color: 'bg-green-100 border-green-300', 
    headerBg: 'bg-green-200',
    description: 'Met toetsbekwaamheid wordt in het toetsweb verwezen naar de deskundigheid die bij actoren binnen de opleiding aanwezig moet zijn om kwaliteit te realiseren op alle toetsentiteiten (Van Berkel, Sluijsmans & Joosten-ten Brinke, 2015). Specifiek voor de entiteit toetsen geldt dat de toetsbekwaamheid van docenten, examencommissies en andere betrokkenen van essentieel belang is: elke docent moet in staat zijn om toetsinformatie te interpreteren en te gebruiken om vast te stellen waar studenten staan en hoe deze informatie verder kan bijdragen aan het leren van de student (Straetmans, 2006).' 
  },
  { 
    key: 'toetsTaken', 
    label: 'TOETS(TAK)EN', 
    color: 'bg-blue-100 border-blue-300', 
    headerBg: 'bg-blue-200',
    description: 'Onder toetsen worden (leer)activiteiten/meet-instrumenten verstaan die worden ingezet om na te gaan of de beoogde leerresultaten zijn bereikt (Joosten-ten Brinke & Draaier, 2015). Bij de kwaliteit van de toets in zijn geheel horen ook het ontwerp van de beoordelingsmodellen en student- en beoordelaarsinstructies. Onder toetstaken worden items of opdrachten binnen een toets verstaan waarmee studenten worden uitgedaagd hun kennis en vaardigheden te tonen (Draaier & Joosten-ten Brinke, 2015).' 
  },
  { 
    key: 'toetsprogramma', 
    label: 'TOETSPROGRAMMA', 
    color: 'bg-teal-100 border-teal-300', 
    headerBg: 'bg-teal-200',
    description: 'Het toetsprogramma is een bewuste en beargumenteerde combinatie van toets(vorm)en, passend bij de doelen en opbouw van een opleiding (het onderwijsprogramma) (Baartman & Van der Vleuten, 2015). Het gaat om de heldere samenhang tussen toetsen en de borging van de verschillende functies van toetsing.' 
  },
] as const;

