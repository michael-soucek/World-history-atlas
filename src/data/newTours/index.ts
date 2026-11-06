import type { Tour } from "@/data/tours";
import { TOUR as ancientEgypt } from "./ancient-egypt";
import { TOUR as empiresOfPersia } from "./empires-of-persia";
import { TOUR as historyOfJapan } from "./history-of-japan";
import { TOUR as byzantineEmpire } from "./byzantine-empire";
import { TOUR as peoplingOfTheAmericas } from "./peopling-of-the-americas";
import { TOUR as migrationsOfAsia } from "./migrations-of-asia";
import { TOUR as riseAndFallOfRome } from "./rise-and-fall-of-rome";
import { TOUR as silkRoad } from "./silk-road";
import { TOUR as ageOfDiscovery } from "./age-of-discovery";
import { TOUR as riseOfTheCaliphates } from "./rise-of-the-caliphates";
import { TOUR as silkRoadAndTrade } from "./silk-road-and-trade";
import { TOUR as chineseDynasties } from "./chinese-dynasties";
import { TOUR as empiresOfTheAmericas } from "./empires-of-the-americas";
import { TOUR as worldAtWar } from "./world-at-war";
import { TOUR as endOfEmpires } from "./end-of-empires";
import { TOUR as kingdomsOfAfrica } from "./kingdoms-of-africa";
import { TOUR as empiresOfIndia } from "./empires-of-india";
import { TOUR as cradleOfCivilization } from "./cradle-of-civilization";
import { TOUR as coldWar } from "./cold-war";
import { TOUR as worldReligions } from "./world-religions";
import { TOUR as ageOfRevolutions } from "./age-of-revolutions";
import { TOUR as magyarJourney } from "./magyar-journey";
import { TOUR as mongolWorldConquest } from "./mongol-world-conquest";
import { TOUR as vikingVoyages } from "./viking-voyages";
import { TOUR as reconquista } from "./reconquista";
import { TOUR as blackDeath } from "./black-death";
import { TOUR as renaissance } from "./renaissance";
import { TOUR as reformation } from "./reformation";
import { TOUR as enlightenment } from "./enlightenment";
import { TOUR as industrialRevolution } from "./industrial-revolution";
import { TOUR as outOfAfrica } from "./out-of-africa";
import { TOUR as polynesianVoyagers } from "./polynesian-voyagers";
import { TOUR as bantuExpansion } from "./bantu-expansion";
import { TOUR as alexanderTheGreat } from "./alexander-the-great";
import { TOUR as hannibalAndThePunicWars } from "./hannibal-and-the-punic-wars";
import { TOUR as hunsAndTheGreatMigrations } from "./huns-and-the-great-migrations";
import { TOUR as theCrusades } from "./the-crusades";
import { TOUR as ottomanAdvance } from "./ottoman-advance";
import { TOUR as conquestOfTheAztecAndInca } from "./conquest-of-the-aztec-and-inca";
import { TOUR as atlanticSlaveTrade } from "./atlantic-slave-trade";
import { TOUR as napoleonicWars } from "./napoleonic-wars";
import { TOUR as americanCivilWar } from "./american-civil-war";
import { TOUR as ancientGreece } from "./ancient-greece";
import { TOUR as britishEmpire } from "./british-empire";
import { TOUR as europeThroughHistory } from "./europe-through-history";
import { TOUR as fallOfCommunism } from "./fall-of-communism";
import { TOUR as greatTravellers } from "./great-travellers";
import { TOUR as migrationsOfEurope } from "./migrations-of-europe";
import { TOUR as hundredYearsWar } from "./hundred-years-war";
import { TOUR as koreanWar } from "./korean-war";
import { TOUR as riseOfRussia } from "./rise-of-russia";
import { TOUR as scrambleForAfrica } from "./scramble-for-africa";
import { TOUR as spanishEmpire } from "./spanish-empire";
import { TOUR as thirtyYearsWar } from "./thirty-years-war";
import { TOUR as unificationOfItalyAndGermany } from "./unification-of-italy-and-germany";
import { TOUR as vietnamWars } from "./vietnam-wars";

/** Tours added 2026-10-31: wars, empires, eras and journeys, each in its own file. */
export const NEW_TOURS: Tour[] = [ancientEgypt, empiresOfPersia, historyOfJapan, byzantineEmpire, peoplingOfTheAmericas, migrationsOfAsia, migrationsOfEurope, americanCivilWar, ancientGreece, britishEmpire, europeThroughHistory, fallOfCommunism, greatTravellers, hundredYearsWar, koreanWar, riseOfRussia, scrambleForAfrica, spanishEmpire, thirtyYearsWar, unificationOfItalyAndGermany, vietnamWars];

/** The first tours, once inline in tours.ts. */
export const CLASSIC_TOURS: Tour[] = [riseAndFallOfRome, silkRoad, ageOfDiscovery, riseOfTheCaliphates, silkRoadAndTrade, chineseDynasties, empiresOfTheAmericas, worldAtWar, endOfEmpires, kingdomsOfAfrica, empiresOfIndia, cradleOfCivilization, coldWar, worldReligions, ageOfRevolutions];

/** Peoples, armies, ideas and diseases on the move, drawn with arrows. */
export const MOVEMENT_TOURS: Tour[] = [magyarJourney, mongolWorldConquest, vikingVoyages, reconquista, blackDeath, renaissance, reformation, enlightenment, industrialRevolution];

/** History's biggest events: migrations, conquests, wars and voyages. */
export const EVENT_TOURS: Tour[] = [outOfAfrica, polynesianVoyagers, bantuExpansion, alexanderTheGreat, hannibalAndThePunicWars, hunsAndTheGreatMigrations, theCrusades, ottomanAdvance, conquestOfTheAztecAndInca, atlanticSlaveTrade, napoleonicWars];
