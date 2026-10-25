import type { CrosswalkEntry, EntityType } from "@/types";

/** Crosswalk for historical persons. */
export const PEOPLE_CROSSWALK: Record<string, CrosswalkEntry & { entityType: EntityType }> = {
  "genghis-khan":          { wikidataId: "Q720", slug: "genghis-khan",          entityType: "person" },
  "alexander-the-great":   { wikidataId: "Q8409", slug: "alexander-the-great",  entityType: "person" },
  "julius-caesar":         { wikidataId: "Q1048", slug: "julius-caesar",         entityType: "person" },
  "cleopatra":             { wikidataId: "Q635", slug: "cleopatra",             entityType: "person" },
  "charlemagne":           { wikidataId: "Q3044", slug: "charlemagne",           entityType: "person" },
  "saladin":               { wikidataId: "Q8581", slug: "saladin",               entityType: "person" },
  "tamerlane":             { wikidataId: "Q8462", slug: "tamerlane",            entityType: "person" },
  "napoleon":              { wikidataId: "Q517",  slug: "napoleon",              entityType: "person" },
  "constantine-i":         { wikidataId: "Q8413", slug: "constantine-i",         entityType: "person" },
  "augustus":              { wikidataId: "Q1405", slug: "augustus",              entityType: "person" },
  "attila-the-hun":        { wikidataId: "Q36724", slug: "attila-the-hun",       entityType: "person" },
  "kublai-khan":           { wikidataId: "Q7523",  slug: "kublai-khan",          entityType: "person" },
  "suleiman-the-magnificent": { wikidataId: "Q8474", slug: "suleiman-the-magnificent", entityType: "person" },
  "akbar":                 { wikidataId: "Q8597", slug: "akbar",               entityType: "person" },
  "cyrus-the-great":       { wikidataId: "Q8423", slug: "cyrus-the-great",      entityType: "person" },
  "hannibal":              { wikidataId: "Q36456",  slug: "hannibal",             entityType: "person" },
  "ramesses-ii":           { wikidataId: "Q1523", slug: "ramesses-ii",          entityType: "person" },
  // Added 2026-10: rulers, thinkers, scientists and modern leaders from every region
"mansa-musa": { wikidataId: "Q309333", slug: "mansa-musa", entityType: "person", name: "Mansa Musa" },
  "sundiata-keita": { wikidataId: "Q175772", slug: "sundiata-keita", entityType: "person", name: "Sundiata Keita" },
  "shaka": { wikidataId: "Q27695", slug: "shaka", entityType: "person", name: "Shaka" },
  "nzinga-of-ndongo-and-matamba": { wikidataId: "Q467650", slug: "nzinga-of-ndongo-and-matamba", entityType: "person", name: "Nzinga of Ndongo and Matamba" },
  "moctezuma-ii": { wikidataId: "Q141791", slug: "moctezuma-ii", entityType: "person", name: "Moctezuma II" },
  "pachacuti": { wikidataId: "Q213758", slug: "pachacuti", entityType: "person", name: "Pachacuti" },
  "simon-bolivar": { wikidataId: "Q8605", slug: "simon-bolivar", entityType: "person", name: "Simón Bolívar" },
  "toussaint-louverture": { wikidataId: "Q205783", slug: "toussaint-louverture", entityType: "person", name: "Toussaint Louverture" },
  "qin-shi-huang": { wikidataId: "Q7192", slug: "qin-shi-huang", entityType: "person", name: "Qin Shi Huang" },
  "wu-zetian": { wikidataId: "Q9738", slug: "wu-zetian", entityType: "person", name: "Wu Zetian" },
  "kangxi-emperor": { wikidataId: "Q17790", slug: "kangxi-emperor", entityType: "person", name: "Kangxi Emperor" },
  "empress-dowager-cixi": { wikidataId: "Q47842", slug: "empress-dowager-cixi", entityType: "person", name: "Empress Dowager Cixi" },
  "tokugawa-ieyasu": { wikidataId: "Q171977", slug: "tokugawa-ieyasu", entityType: "person", name: "Tokugawa Ieyasu" },
  "emperor-meiji": { wikidataId: "Q174231", slug: "emperor-meiji", entityType: "person", name: "Emperor Meiji" },
  "peter-the-great": { wikidataId: "Q8479", slug: "peter-the-great", entityType: "person", name: "Peter the Great" },
  "catherine-the-great": { wikidataId: "Q36450", slug: "catherine-the-great", entityType: "person", name: "Catherine the Great" },
  "ivan-the-terrible": { wikidataId: "Q7996", slug: "ivan-the-terrible", entityType: "person", name: "Ivan the Terrible" },
  "ashoka": { wikidataId: "Q8589", slug: "ashoka", entityType: "person", name: "Ashoka" },
  "chandragupta-maurya": { wikidataId: "Q188541", slug: "chandragupta-maurya", entityType: "person", name: "Chandragupta Maurya" },
  "shah-jahan": { wikidataId: "Q83672", slug: "shah-jahan", entityType: "person", name: "Shah Jahan" },
  "hammurabi": { wikidataId: "Q36359", slug: "hammurabi", entityType: "person", name: "Hammurabi" },
  "sargon-of-akkad": { wikidataId: "Q199461", slug: "sargon-of-akkad", entityType: "person", name: "Sargon of Akkad" },
  "hatshepsut": { wikidataId: "Q129234", slug: "hatshepsut", entityType: "person", name: "Hatshepsut" },
  "nebuchadnezzar-ii": { wikidataId: "Q12591", slug: "nebuchadnezzar-ii", entityType: "person", name: "Nebuchadnezzar II" },
  "darius-the-great": { wikidataId: "Q44387", slug: "darius-the-great", entityType: "person", name: "Darius the Great" },
  "pericles": { wikidataId: "Q80398", slug: "pericles", entityType: "person", name: "Pericles" },
  "justinian-i": { wikidataId: "Q41866", slug: "justinian-i", entityType: "person", name: "Justinian I" },
  "harun-al-rashid": { wikidataId: "Q131002", slug: "harun-al-rashid", entityType: "person", name: "Harun al-Rashid" },
  "mehmed-ii": { wikidataId: "Q34503", slug: "mehmed-ii", entityType: "person", name: "Mehmed II" },
  "william-the-conqueror": { wikidataId: "Q37594", slug: "william-the-conqueror", entityType: "person", name: "William the Conqueror" },
  "joan-of-arc": { wikidataId: "Q7226", slug: "joan-of-arc", entityType: "person", name: "Joan of Arc" },
  "isabella-i-of-castile": { wikidataId: "Q45859", slug: "isabella-i-of-castile", entityType: "person", name: "Isabella I of Castile" },
  "charles-v-holy-roman-emperor": { wikidataId: "Q32500", slug: "charles-v-holy-roman-emperor", entityType: "person", name: "Charles V, Holy Roman Emperor" },
  "elizabeth-i": { wikidataId: "Q7207", slug: "elizabeth-i", entityType: "person", name: "Elizabeth I" },
  "louis-xiv": { wikidataId: "Q7742", slug: "louis-xiv", entityType: "person", name: "Louis XIV" },
  "queen-victoria": { wikidataId: "Q9439", slug: "queen-victoria", entityType: "person", name: "Queen Victoria" },
  "otto-von-bismarck": { wikidataId: "Q8442", slug: "otto-von-bismarck", entityType: "person", name: "Otto von Bismarck" },
  "confucius": { wikidataId: "Q4604", slug: "confucius", entityType: "person", name: "Confucius" },
  "buddha": { wikidataId: "Q9441", slug: "buddha", entityType: "person", name: "The Buddha" },
  "jesus": { wikidataId: "Q302", slug: "jesus", entityType: "person", name: "Jesus" },
  "muhammad": { wikidataId: "Q9458", slug: "muhammad", entityType: "person", name: "Muhammad" },
  "socrates": { wikidataId: "Q913", slug: "socrates", entityType: "person", name: "Socrates" },
  "plato": { wikidataId: "Q859", slug: "plato", entityType: "person", name: "Plato" },
  "aristotle": { wikidataId: "Q868", slug: "aristotle", entityType: "person", name: "Aristotle" },
  "martin-luther": { wikidataId: "Q9554", slug: "martin-luther", entityType: "person", name: "Martin Luther" },
  "leonardo-da-vinci": { wikidataId: "Q762", slug: "leonardo-da-vinci", entityType: "person", name: "Leonardo da Vinci" },
  "galileo-galilei": { wikidataId: "Q307", slug: "galileo-galilei", entityType: "person", name: "Galileo Galilei" },
  "isaac-newton": { wikidataId: "Q935", slug: "isaac-newton", entityType: "person", name: "Isaac Newton" },
  "charles-darwin": { wikidataId: "Q1035", slug: "charles-darwin", entityType: "person", name: "Charles Darwin" },
  "marie-curie": { wikidataId: "Q7186", slug: "marie-curie", entityType: "person", name: "Marie Curie" },
  "albert-einstein": { wikidataId: "Q937", slug: "albert-einstein", entityType: "person", name: "Albert Einstein" },
  "george-washington": { wikidataId: "Q23", slug: "george-washington", entityType: "person", name: "George Washington" },
  "abraham-lincoln": { wikidataId: "Q91", slug: "abraham-lincoln", entityType: "person", name: "Abraham Lincoln" },
  "vladimir-lenin": { wikidataId: "Q1394", slug: "vladimir-lenin", entityType: "person", name: "Vladimir Lenin" },
  "joseph-stalin": { wikidataId: "Q855", slug: "joseph-stalin", entityType: "person", name: "Joseph Stalin" },
  "adolf-hitler": { wikidataId: "Q352", slug: "adolf-hitler", entityType: "person", name: "Adolf Hitler" },
  "winston-churchill": { wikidataId: "Q8016", slug: "winston-churchill", entityType: "person", name: "Winston Churchill" },
  "franklin-d-roosevelt": { wikidataId: "Q8007", slug: "franklin-d-roosevelt", entityType: "person", name: "Franklin D. Roosevelt" },
  "mao-zedong": { wikidataId: "Q5816", slug: "mao-zedong", entityType: "person", name: "Mao Zedong" },
  "mahatma-gandhi": { wikidataId: "Q1001", slug: "mahatma-gandhi", entityType: "person", name: "Mahatma Gandhi" },
  "ho-chi-minh": { wikidataId: "Q36014", slug: "ho-chi-minh", entityType: "person", name: "Ho Chi Minh" },
  "sun-yat-sen": { wikidataId: "Q8573", slug: "sun-yat-sen", entityType: "person", name: "Sun Yat-sen" },
  "nelson-mandela": { wikidataId: "Q8023", slug: "nelson-mandela", entityType: "person", name: "Nelson Mandela" },
  // Added 2026-10-25: philosophers, rulers, artists and scientists
  "adam-smith": { wikidataId: "Q9381", slug: "adam-smith", entityType: "person", name: "Adam Smith" },
  "adi-shankara": { wikidataId: "Q180967", slug: "adi-shankara", entityType: "person", name: "Adi Shankara" },
  "al-farabi": { wikidataId: "Q160460", slug: "al-farabi", entityType: "person", name: "Al-Farabi" },
  "al-ghazali": { wikidataId: "Q9546", slug: "al-ghazali", entityType: "person", name: "Al-Ghazali" },
  "al-kindi": { wikidataId: "Q179759", slug: "al-kindi", entityType: "person", name: "Al-Kindi" },
  "albert-camus": { wikidataId: "Q34670", slug: "albert-camus", entityType: "person", name: "Albert Camus" },
  "anselm-of-canterbury": { wikidataId: "Q43939", slug: "anselm-of-canterbury", entityType: "person", name: "Anselm of Canterbury" },
  "archduke-franz-ferdinand": { wikidataId: "Q43063", slug: "archduke-franz-ferdinand", entityType: "person", name: "Archduke Franz Ferdinand" },
  "arthur-schopenhauer": { wikidataId: "Q38193", slug: "arthur-schopenhauer", entityType: "person", name: "Arthur Schopenhauer" },
  "augustine-of-hippo": { wikidataId: "Q8018", slug: "augustine-of-hippo", entityType: "person", name: "Augustine of Hippo" },
  "averroes": { wikidataId: "Q39837", slug: "averroes", entityType: "person", name: "Averroes (Ibn Rushd)" },
  "avicenna": { wikidataId: "Q8011", slug: "avicenna", entityType: "person", name: "Avicenna (Ibn Sina)" },
  "baruch-spinoza": { wikidataId: "Q35802", slug: "baruch-spinoza", entityType: "person", name: "Baruch Spinoza" },
  "benito-mussolini": { wikidataId: "Q23559", slug: "benito-mussolini", entityType: "person", name: "Benito Mussolini" },
  "bertrand-russell": { wikidataId: "Q33760", slug: "bertrand-russell", entityType: "person", name: "Bertrand Russell" },
  "blaise-pascal": { wikidataId: "Q1290", slug: "blaise-pascal", entityType: "person", name: "Blaise Pascal" },
  "boethius": { wikidataId: "Q102851", slug: "boethius", entityType: "person", name: "Boethius" },
  "chanakya": { wikidataId: "Q9045", slug: "chanakya", entityType: "person", name: "Chanakya" },
  "charles-de-gaulle": { wikidataId: "Q2042", slug: "charles-de-gaulle", entityType: "person", name: "Charles de Gaulle" },
  "david-hume": { wikidataId: "Q37160", slug: "david-hume", entityType: "person", name: "David Hume" },
  "democritus": { wikidataId: "Q41980", slug: "democritus", entityType: "person", name: "Democritus" },
  "denis-diderot": { wikidataId: "Q448", slug: "denis-diderot", entityType: "person", name: "Denis Diderot" },
  "diogenes-of-sinope": { wikidataId: "Q59180", slug: "diogenes-of-sinope", entityType: "person", name: "Diogenes of Sinope" },
  "edmund-burke": { wikidataId: "Q165792", slug: "edmund-burke", entityType: "person", name: "Edmund Burke" },
  "edmund-husserl": { wikidataId: "Q58586", slug: "edmund-husserl", entityType: "person", name: "Edmund Husserl" },
  "epictetus": { wikidataId: "Q183144", slug: "epictetus", entityType: "person", name: "Epictetus" },
  "epicurus": { wikidataId: "Q43216", slug: "epicurus", entityType: "person", name: "Epicurus" },
  "erasmus": { wikidataId: "Q43499", slug: "erasmus", entityType: "person", name: "Erasmus" },
  "ferdinand-ii-of-aragon": { wikidataId: "Q12860", slug: "ferdinand-ii-of-aragon", entityType: "person", name: "Ferdinand II of Aragon" },
  "francis-bacon": { wikidataId: "Q37388", slug: "francis-bacon", entityType: "person", name: "Francis Bacon" },
  "francisco-franco": { wikidataId: "Q29179", slug: "francisco-franco", entityType: "person", name: "Francisco Franco" },
  "franz-joseph-i": { wikidataId: "Q51056", slug: "franz-joseph-i", entityType: "person", name: "Franz Joseph I" },
  "friedrich-engels": { wikidataId: "Q34787", slug: "friedrich-engels", entityType: "person", name: "Friedrich Engels" },
  "friedrich-nietzsche": { wikidataId: "Q9358", slug: "friedrich-nietzsche", entityType: "person", name: "Friedrich Nietzsche" },
  "gamal-abdel-nasser": { wikidataId: "Q39524", slug: "gamal-abdel-nasser", entityType: "person", name: "Gamal Abdel Nasser" },
  "georg-wilhelm-friedrich-hegel": { wikidataId: "Q9235", slug: "georg-wilhelm-friedrich-hegel", entityType: "person", name: "Georg Wilhelm Friedrich Hegel" },
  "george-berkeley": { wikidataId: "Q82049", slug: "george-berkeley", entityType: "person", name: "George Berkeley" },
  "gottfried-wilhelm-leibniz": { wikidataId: "Q9047", slug: "gottfried-wilhelm-leibniz", entityType: "person", name: "Gottfried Wilhelm Leibniz" },
  "gottlob-frege": { wikidataId: "Q60028", slug: "gottlob-frege", entityType: "person", name: "Gottlob Frege" },
  "han-feizi": { wikidataId: "Q28959", slug: "han-feizi", entityType: "person", name: "Han Fei" },
  "heraclitus": { wikidataId: "Q41155", slug: "heraclitus", entityType: "person", name: "Heraclitus" },
  "hypatia": { wikidataId: "Q11903", slug: "hypatia", entityType: "person", name: "Hypatia" },
  "ibn-khaldun": { wikidataId: "Q9294", slug: "ibn-khaldun", entityType: "person", name: "Ibn Khaldun" },
  "immanuel-kant": { wikidataId: "Q9312", slug: "immanuel-kant", entityType: "person", name: "Immanuel Kant" },
  "jean-jacques-rousseau": { wikidataId: "Q6527", slug: "jean-jacques-rousseau", entityType: "person", name: "Jean-Jacques Rousseau" },
  "jean-paul-sartre": { wikidataId: "Q9364", slug: "jean-paul-sartre", entityType: "person", name: "Jean-Paul Sartre" },
  "jeremy-bentham": { wikidataId: "Q60887", slug: "jeremy-bentham", entityType: "person", name: "Jeremy Bentham" },
  "john-locke": { wikidataId: "Q9353", slug: "john-locke", entityType: "person", name: "John Locke" },
  "john-stuart-mill": { wikidataId: "Q50020", slug: "john-stuart-mill", entityType: "person", name: "John Stuart Mill" },
  "josip-broz-tito": { wikidataId: "Q9161", slug: "josip-broz-tito", entityType: "person", name: "Josip Broz Tito" },
  "karl-marx": { wikidataId: "Q9061", slug: "karl-marx", entityType: "person", name: "Karl Marx" },
  "laozi": { wikidataId: "Q9333", slug: "laozi", entityType: "person", name: "Laozi" },
  "leon-trotsky": { wikidataId: "Q33391", slug: "leon-trotsky", entityType: "person", name: "Leon Trotsky" },
  "ludwig-wittgenstein": { wikidataId: "Q9391", slug: "ludwig-wittgenstein", entityType: "person", name: "Ludwig Wittgenstein" },
  "mahavira": { wikidataId: "Q9422", slug: "mahavira", entityType: "person", name: "Mahavira" },
  "maimonides": { wikidataId: "Q127398", slug: "maimonides", entityType: "person", name: "Maimonides" },
  "marcus-aurelius": { wikidataId: "Q1430", slug: "marcus-aurelius", entityType: "person", name: "Marcus Aurelius" },
  "margaret-thatcher": { wikidataId: "Q7416", slug: "margaret-thatcher", entityType: "person", name: "Margaret Thatcher" },
  "martin-heidegger": { wikidataId: "Q48301", slug: "martin-heidegger", entityType: "person", name: "Martin Heidegger" },
  "mary-wollstonecraft": { wikidataId: "Q101638", slug: "mary-wollstonecraft", entityType: "person", name: "Mary Wollstonecraft" },
  "mencius": { wikidataId: "Q188903", slug: "mencius", entityType: "person", name: "Mencius" },
  "michel-de-montaigne": { wikidataId: "Q41568", slug: "michel-de-montaigne", entityType: "person", name: "Michel de Montaigne" },
  "mikhail-gorbachev": { wikidataId: "Q30487", slug: "mikhail-gorbachev", entityType: "person", name: "Mikhail Gorbachev" },
  "montesquieu": { wikidataId: "Q15975", slug: "montesquieu", entityType: "person", name: "Montesquieu" },
  "mozi": { wikidataId: "Q272411", slug: "mozi", entityType: "person", name: "Mozi" },
  "mustafa-kemal-ataturk": { wikidataId: "Q5152", slug: "mustafa-kemal-ataturk", entityType: "person", name: "Mustafa Kemal Atatürk" },
  "nagarjuna": { wikidataId: "Q171195", slug: "nagarjuna", entityType: "person", name: "Nagarjuna" },
  "niccolo-machiavelli": { wikidataId: "Q1399", slug: "niccolo-machiavelli", entityType: "person", name: "Niccolò Machiavelli" },
  "nicholas-ii": { wikidataId: "Q40787", slug: "nicholas-ii", entityType: "person", name: "Nicholas II of Russia" },
  "parmenides": { wikidataId: "Q125551", slug: "parmenides", entityType: "person", name: "Parmenides" },
  "peter-abelard": { wikidataId: "Q4295", slug: "peter-abelard", entityType: "person", name: "Peter Abelard" },
  "plotinus": { wikidataId: "Q134189", slug: "plotinus", entityType: "person", name: "Plotinus" },
  "protagoras": { wikidataId: "Q169243", slug: "protagoras", entityType: "person", name: "Protagoras" },
  "pythagoras": { wikidataId: "Q10261", slug: "pythagoras", entityType: "person", name: "Pythagoras" },
  "rene-descartes": { wikidataId: "Q9191", slug: "rene-descartes", entityType: "person", name: "René Descartes" },
  "seneca": { wikidataId: "Q2054", slug: "seneca", entityType: "person", name: "Seneca the Younger" },
  "simone-de-beauvoir": { wikidataId: "Q7197", slug: "simone-de-beauvoir", entityType: "person", name: "Simone de Beauvoir" },
  "soren-kierkegaard": { wikidataId: "Q6512", slug: "soren-kierkegaard", entityType: "person", name: "Søren Kierkegaard" },
  "thales-of-miletus": { wikidataId: "Q36303", slug: "thales-of-miletus", entityType: "person", name: "Thales of Miletus" },
  "thomas-aquinas": { wikidataId: "Q9438", slug: "thomas-aquinas", entityType: "person", name: "Thomas Aquinas" },
  "thomas-hobbes": { wikidataId: "Q37621", slug: "thomas-hobbes", entityType: "person", name: "Thomas Hobbes" },
  "thomas-more": { wikidataId: "Q42544", slug: "thomas-more", entityType: "person", name: "Thomas More" },
  "thomas-paine": { wikidataId: "Q126462", slug: "thomas-paine", entityType: "person", name: "Thomas Paine" },
  "voltaire": { wikidataId: "Q9068", slug: "voltaire", entityType: "person", name: "Voltaire" },
  "wang-yangming": { wikidataId: "Q378462", slug: "wang-yangming", entityType: "person", name: "Wang Yangming" },
  "wilhelm-ii": { wikidataId: "Q2677", slug: "wilhelm-ii", entityType: "person", name: "Wilhelm II" },
  "william-james": { wikidataId: "Q125249", slug: "william-james", entityType: "person", name: "William James" },
  "william-of-ockham": { wikidataId: "Q43936", slug: "william-of-ockham", entityType: "person", name: "William of Ockham" },
  "xunzi": { wikidataId: "Q216072", slug: "xunzi", entityType: "person", name: "Xunzi" },
  "zeno-of-citium": { wikidataId: "Q171303", slug: "zeno-of-citium", entityType: "person", name: "Zeno of Citium" },
  "zhu-xi": { wikidataId: "Q9397", slug: "zhu-xi", entityType: "person", name: "Zhu Xi" },
  "zhuangzi": { wikidataId: "Q47739", slug: "zhuangzi", entityType: "person", name: "Zhuangzi" },
  "elizabeth-ii": { wikidataId: "Q9682", slug: "elizabeth-ii", entityType: "person", name: "Elizabeth II" },
  "frantz-fanon": { wikidataId: "Q193670", slug: "frantz-fanon", entityType: "person", name: "Frantz Fanon" },
  "hannah-arendt": { wikidataId: "Q60025", slug: "hannah-arendt", entityType: "person", name: "Hannah Arendt" },
  "henry-viii": { wikidataId: "Q38370", slug: "henry-viii", entityType: "person", name: "Henry VIII" },
  "john-rawls": { wikidataId: "Q172544", slug: "john-rawls", entityType: "person", name: "John Rawls" },
  "karl-popper": { wikidataId: "Q81244", slug: "karl-popper", entityType: "person", name: "Karl Popper" },
  "louis-xvi": { wikidataId: "Q7732", slug: "louis-xvi", entityType: "person", name: "Louis XVI" },
  "marie-antoinette": { wikidataId: "Q47365", slug: "marie-antoinette", entityType: "person", name: "Marie Antoinette" },
  "michel-foucault": { wikidataId: "Q44272", slug: "michel-foucault", entityType: "person", name: "Michel Foucault" },
  "nishida-kitaro": { wikidataId: "Q45125", slug: "nishida-kitaro", entityType: "person", name: "Nishida Kitarō" },
  "oliver-cromwell": { wikidataId: "Q44279", slug: "oliver-cromwell", entityType: "person", name: "Oliver Cromwell" },
  "richard-i-of-england": { wikidataId: "Q42305", slug: "richard-i-of-england", entityType: "person", name: "Richard I of England" },
  "sun-tzu": { wikidataId: "Q37151", slug: "sun-tzu", entityType: "person", name: "Sun Tzu" },
  "alexander-hamilton": { wikidataId: "Q178903", slug: "alexander-hamilton", entityType: "person", name: "Alexander Hamilton" },
  "benjamin-franklin": { wikidataId: "Q34969", slug: "benjamin-franklin", entityType: "person", name: "Benjamin Franklin" },
  "frederick-the-great": { wikidataId: "Q33550", slug: "frederick-the-great", entityType: "person", name: "Frederick the Great" },
  "gustavus-adolphus": { wikidataId: "Q52938", slug: "gustavus-adolphus", entityType: "person", name: "Gustavus Adolphus" },
  "maria-theresa": { wikidataId: "Q131706", slug: "maria-theresa", entityType: "person", name: "Maria Theresa" },
  "maximilien-robespierre": { wikidataId: "Q44197", slug: "maximilien-robespierre", entityType: "person", name: "Maximilien Robespierre" },
  "philip-ii-of-spain": { wikidataId: "Q34417", slug: "philip-ii-of-spain", entityType: "person", name: "Philip II of Spain" },
  "theodore-roosevelt": { wikidataId: "Q33866", slug: "theodore-roosevelt", entityType: "person", name: "Theodore Roosevelt" },
  "thomas-jefferson": { wikidataId: "Q11812", slug: "thomas-jefferson", entityType: "person", name: "Thomas Jefferson" },
  "askia-muhammad-i": { wikidataId: "Q1771994", slug: "askia-muhammad-i", entityType: "person", name: "Askia Muhammad I" },
  "atahualpa": { wikidataId: "Q179577", slug: "atahualpa", entityType: "person", name: "Atahualpa" },
  "aurangzeb": { wikidataId: "Q485547", slug: "aurangzeb", entityType: "person", name: "Aurangzeb" },
  "babur": { wikidataId: "Q797848", slug: "babur", entityType: "person", name: "Babur" },
  "benito-juarez": { wikidataId: "Q182276", slug: "benito-juarez", entityType: "person", name: "Benito Juárez" },
  "che-guevara": { wikidataId: "Q5809", slug: "che-guevara", entityType: "person", name: "Che Guevara" },
  "dwight-d-eisenhower": { wikidataId: "Q9916", slug: "dwight-d-eisenhower", entityType: "person", name: "Dwight D. Eisenhower" },
  "emiliano-zapata": { wikidataId: "Q41718", slug: "emiliano-zapata", entityType: "person", name: "Emiliano Zapata" },
  "fidel-castro": { wikidataId: "Q11256", slug: "fidel-castro", entityType: "person", name: "Fidel Castro" },
  "francisco-pizarro": { wikidataId: "Q44741", slug: "francisco-pizarro", entityType: "person", name: "Francisco Pizarro" },
  "frederick-douglass": { wikidataId: "Q215562", slug: "frederick-douglass", entityType: "person", name: "Frederick Douglass" },
  "giuseppe-garibaldi": { wikidataId: "Q539", slug: "giuseppe-garibaldi", entityType: "person", name: "Giuseppe Garibaldi" },
  "haile-selassie": { wikidataId: "Q41178", slug: "haile-selassie", entityType: "person", name: "Haile Selassie" },
  "harriet-tubman": { wikidataId: "Q102870", slug: "harriet-tubman", entityType: "person", name: "Harriet Tubman" },
  "hernan-cortes": { wikidataId: "Q7326", slug: "hernan-cortes", entityType: "person", name: "Hernán Cortés" },
  "jawaharlal-nehru": { wikidataId: "Q1047", slug: "jawaharlal-nehru", entityType: "person", name: "Jawaharlal Nehru" },
  "john-f-kennedy": { wikidataId: "Q9696", slug: "john-f-kennedy", entityType: "person", name: "John F. Kennedy" },
  "john-iii-sobieski": { wikidataId: "Q53454", slug: "john-iii-sobieski", entityType: "person", name: "John III Sobieski" },
  "jomo-kenyatta": { wikidataId: "Q173563", slug: "jomo-kenyatta", entityType: "person", name: "Jomo Kenyatta" },
  "jose-de-san-martin": { wikidataId: "Q134160", slug: "jose-de-san-martin", entityType: "person", name: "José de San Martín" },
  "juan-peron": { wikidataId: "Q93330", slug: "juan-peron", entityType: "person", name: "Juan Perón" },
  "klemens-von-metternich": { wikidataId: "Q45662", slug: "klemens-von-metternich", entityType: "person", name: "Klemens von Metternich" },
  "kwame-nkrumah": { wikidataId: "Q8620", slug: "kwame-nkrumah", entityType: "person", name: "Kwame Nkrumah" },
  "martin-luther-king-jr": { wikidataId: "Q8027", slug: "martin-luther-king-jr", entityType: "person", name: "Martin Luther King Jr." },
  "menelik-ii": { wikidataId: "Q244748", slug: "menelik-ii", entityType: "person", name: "Menelik II" },
  "osman-i": { wikidataId: "Q83100", slug: "osman-i", entityType: "person", name: "Osman I" },
  "rani-lakshmibai": { wikidataId: "Q181878", slug: "rani-lakshmibai", entityType: "person", name: "Rani Lakshmibai" },
  "ranjit-singh": { wikidataId: "Q332620", slug: "ranjit-singh", entityType: "person", name: "Ranjit Singh" },
  "shivaji": { wikidataId: "Q239505", slug: "shivaji", entityType: "person", name: "Shivaji" },
  "sitting-bull": { wikidataId: "Q43527", slug: "sitting-bull", entityType: "person", name: "Sitting Bull" },
  "tecumseh": { wikidataId: "Q257808", slug: "tecumseh", entityType: "person", name: "Tecumseh" },
  "tipu-sultan": { wikidataId: "Q10088", slug: "tipu-sultan", entityType: "person", name: "Tipu Sultan" },
  "ulysses-s-grant": { wikidataId: "Q34836", slug: "ulysses-s-grant", entityType: "person", name: "Ulysses S. Grant" },
  "woodrow-wilson": { wikidataId: "Q34296", slug: "woodrow-wilson", entityType: "person", name: "Woodrow Wilson" },
};

/** Crosswalk for historical events. */
export const EVENTS_CROSSWALK: Record<string, CrosswalkEntry & { entityType: EntityType }> = {
  // Original 8 — Europe/Mediterranean
  "fall-of-rome":               { wikidataId: "Q608613",  slug: "fall-of-rome",               entityType: "event" },
  "black-death":                { wikidataId: "Q42005",   slug: "black-death",                entityType: "event" },
  "mongol-invasion-of-europe":  { wikidataId: "Q852171",  slug: "mongol-invasion-of-europe",  entityType: "event" },
  "crusades":                   { wikidataId: "Q12546",   slug: "crusades",                   entityType: "event" },
  "age-of-discovery":           { wikidataId: "Q133641",  slug: "age-of-discovery",           entityType: "event" },
  "battle-of-marathon":         { wikidataId: "Q31900",   slug: "battle-of-marathon",         entityType: "event" },
  "french-revolution":          { wikidataId: "Q6534",    slug: "french-revolution",          entityType: "event" },
  "fall-of-constantinople":     { wikidataId: "Q160077",  slug: "fall-of-constantinople",     entityType: "event" },
  // Americas
  "fall-of-tenochtitlan":               { wikidataId: "Q593267",  slug: "fall-of-tenochtitlan",               entityType: "event" },
  "spanish-conquest-of-the-inca-empire":{ wikidataId: "Q636771",  slug: "spanish-conquest-of-the-inca-empire",entityType: "event" },
  "haitian-revolution":                 { wikidataId: "Q689128",  slug: "haitian-revolution",                 entityType: "event" },
  // Asia & Africa
  "an-lushan-rebellion":        { wikidataId: "Q253774",  slug: "an-lushan-rebellion",        entityType: "event" },
  "house-of-wisdom":            { wikidataId: "Q33018",   slug: "house-of-wisdom",            entityType: "event" },
  "bantu-expansion":            { wikidataId: "Q130251",  slug: "bantu-expansion",            entityType: "event" },
  "meiji-restoration":          { wikidataId: "Q8707",    slug: "meiji-restoration",          entityType: "event" },
  "siege-of-baghdad":           { wikidataId: "Q369560",  slug: "siege-of-baghdad",           entityType: "event" },
  // Europe (additional)
  "protestant-reformation":     { wikidataId: "Q12562",   slug: "protestant-reformation",     entityType: "event" },
  "american-revolution":        { wikidataId: "Q192769",  slug: "american-revolution",        entityType: "event" },
  "battle-of-hastings":         { wikidataId: "Q83224",   slug: "battle-of-hastings",         entityType: "event" },
  // Added 2026-10: ancient, early-modern and 19th–20th century events
"neolithic-revolution": { wikidataId: "Q180548", slug: "neolithic-revolution", entityType: "event", name: "Neolithic Revolution" },
  "late-bronze-age-collapse": { wikidataId: "Q1059758", slug: "late-bronze-age-collapse", entityType: "event", name: "Late Bronze Age collapse" },
  "greco-persian-wars": { wikidataId: "Q76026", slug: "greco-persian-wars", entityType: "event", name: "Greco-Persian Wars" },
  "peloponnesian-war": { wikidataId: "Q33745", slug: "peloponnesian-war", entityType: "event", name: "Peloponnesian War" },
  "punic-wars": { wikidataId: "Q124988", slug: "punic-wars", entityType: "event", name: "Punic Wars" },
  "qins-wars-of-unification": { wikidataId: "Q2986801", slug: "qins-wars-of-unification", entityType: "event", name: "Qin's wars of unification" },
  "battle-of-tours": { wikidataId: "Q173077", slug: "battle-of-tours", entityType: "event", name: "Battle of Tours" },
  "battle-of-ain-jalut": { wikidataId: "Q244356", slug: "battle-of-ain-jalut", entityType: "event", name: "Battle of Ain Jalut" },
  "reconquista": { wikidataId: "Q79791", slug: "reconquista", entityType: "event", name: "Reconquista" },
  "hundred-years-war": { wikidataId: "Q12551", slug: "hundred-years-war", entityType: "event", name: "Hundred Years' War" },
  "sengoku-period": { wikidataId: "Q204023", slug: "sengoku-period", entityType: "event", name: "Sengoku period" },
  "columbian-exchange": { wikidataId: "Q767253", slug: "columbian-exchange", entityType: "event", name: "Columbian exchange" },
  "atlantic-slave-trade": { wikidataId: "Q10701282", slug: "atlantic-slave-trade", entityType: "event", name: "Atlantic slave trade" },
  "thirty-years-war": { wikidataId: "Q2487", slug: "thirty-years-war", entityType: "event", name: "Thirty Years' War" },
  "glorious-revolution": { wikidataId: "Q189508", slug: "glorious-revolution", entityType: "event", name: "Glorious Revolution" },
  "industrial-revolution": { wikidataId: "Q2269", slug: "industrial-revolution", entityType: "event", name: "Industrial Revolution" },
  "napoleonic-wars": { wikidataId: "Q78994", slug: "napoleonic-wars", entityType: "event", name: "Napoleonic Wars" },
  "spanish-american-wars-of-independence": { wikidataId: "Q1123201", slug: "spanish-american-wars-of-independence", entityType: "event", name: "Spanish American wars of independence" },
  "first-opium-war": { wikidataId: "Q191282", slug: "first-opium-war", entityType: "event", name: "First Opium War" },
  "taiping-rebellion": { wikidataId: "Q192408", slug: "taiping-rebellion", entityType: "event", name: "Taiping Rebellion" },
  "american-civil-war": { wikidataId: "Q8676", slug: "american-civil-war", entityType: "event", name: "American Civil War" },
  "unification-of-germany": { wikidataId: "Q154705", slug: "unification-of-germany", entityType: "event", name: "Unification of Germany" },
  "unification-of-italy": { wikidataId: "Q51122", slug: "unification-of-italy", entityType: "event", name: "Unification of Italy" },
  "scramble-for-africa": { wikidataId: "Q179848", slug: "scramble-for-africa", entityType: "event", name: "Scramble for Africa" },
  "world-war-i": { wikidataId: "Q361", slug: "world-war-i", entityType: "event", name: "World War I" },
  "russian-revolution": { wikidataId: "Q8729", slug: "russian-revolution", entityType: "event", name: "Russian Revolution" },
  "great-depression": { wikidataId: "Q8698", slug: "great-depression", entityType: "event", name: "Great Depression" },
  "world-war-ii": { wikidataId: "Q362", slug: "world-war-ii", entityType: "event", name: "World War II" },
  "holocaust": { wikidataId: "Q2763", slug: "holocaust", entityType: "event", name: "The Holocaust" },
  "partition-of-india": { wikidataId: "Q129053", slug: "partition-of-india", entityType: "event", name: "Partition of India" },
  "chinese-civil-war": { wikidataId: "Q179975", slug: "chinese-civil-war", entityType: "event", name: "Chinese Civil War" },
  "cold-war": { wikidataId: "Q8683", slug: "cold-war", entityType: "event", name: "Cold War" },
  "korean-war": { wikidataId: "Q8663", slug: "korean-war", entityType: "event", name: "Korean War" },
  "decolonisation-of-africa": { wikidataId: "Q1146918", slug: "decolonisation-of-africa", entityType: "event", name: "Decolonisation of Africa" },
  "vietnam-war": { wikidataId: "Q8740", slug: "vietnam-war", entityType: "event", name: "Vietnam War" },
  "cuban-missile-crisis": { wikidataId: "Q128160", slug: "cuban-missile-crisis", entityType: "event", name: "Cuban Missile Crisis" },
  "apollo-11": { wikidataId: "Q43653", slug: "apollo-11", entityType: "event", name: "Apollo 11" },
  "revolutions-of-1989": { wikidataId: "Q382861", slug: "revolutions-of-1989", entityType: "event", name: "Revolutions of 1989" },
  "dissolution-of-the-soviet-union": { wikidataId: "Q5167679", slug: "dissolution-of-the-soviet-union", entityType: "event", name: "Dissolution of the Soviet Union" },
};

/** Crosswalk for cultures / topics. */
export const CULTURES_CROSSWALK: Record<string, CrosswalkEntry & { entityType: EntityType }> = {
  // Original 8
  "silk-road":             { wikidataId: "Q36288",    slug: "silk-road",             entityType: "culture" },
  "renaissance":           { wikidataId: "Q4692",     slug: "renaissance",           entityType: "culture" },
  "islamic-golden-age":    { wikidataId: "Q745799",   slug: "islamic-golden-age",    entityType: "culture" },
  "ancient-greece":        { wikidataId: "Q11772",    slug: "ancient-greece",        entityType: "culture" },
  "ancient-egypt":         { wikidataId: "Q11768",    slug: "ancient-egypt",         entityType: "culture" },
  "viking-age":            { wikidataId: "Q213649",   slug: "viking-age",            entityType: "culture" },
  "feudal-japan":          { wikidataId: "Q130436",   slug: "feudal-japan",          entityType: "culture" },
  "ancient-rome":          { wikidataId: "Q1747689",  slug: "ancient-rome",          entityType: "culture" },
  // New — broader world coverage
  "polynesian-navigation": { wikidataId: "Q826781",   slug: "polynesian-navigation", entityType: "culture" },
  "maya-civilization":     { wikidataId: "Q28567",    slug: "maya-civilization",     entityType: "culture" },
  "aztec-civilization":    { wikidataId: "Q12542",    slug: "aztec-civilization",    entityType: "culture" },
  "inca-civilization":     { wikidataId: "Q60197531",  slug: "inca-civilization",     entityType: "culture" },
  "confucianism":          { wikidataId: "Q9581",     slug: "confucianism",          entityType: "culture" },
  "hellenistic-period":    { wikidataId: "Q428995",   slug: "hellenistic-period",    entityType: "culture" },
  // Added 2026-10: early civilizations, world religions, intellectual movements
"sumer": { wikidataId: "Q35355", slug: "sumer", entityType: "culture", name: "Sumer" },
  "mycenaean-greece": { wikidataId: "Q181264", slug: "mycenaean-greece", entityType: "culture", name: "Mycenaean Greece" },
  "phoenicia": { wikidataId: "Q41642", slug: "phoenicia", entityType: "culture", name: "Phoenicia" },
  "nok-culture": { wikidataId: "Q927291", slug: "nok-culture", entityType: "culture", name: "Nok culture" },
  "swahili-culture": { wikidataId: "Q1758211", slug: "swahili-culture", entityType: "culture", name: "Swahili culture" },
  "mississippian-culture": { wikidataId: "Q1052095", slug: "mississippian-culture", entityType: "culture", name: "Mississippian culture" },
  "ancestral-puebloans": { wikidataId: "Q478805", slug: "ancestral-puebloans", entityType: "culture", name: "Ancestral Puebloans" },
  "aboriginal-australians": { wikidataId: "Q12060728", slug: "aboriginal-australians", entityType: "culture", name: "Aboriginal Australians" },
  "judaism": { wikidataId: "Q9268", slug: "judaism", entityType: "culture", name: "Judaism" },
  "hinduism": { wikidataId: "Q9089", slug: "hinduism", entityType: "culture", name: "Hinduism" },
  "buddhism": { wikidataId: "Q748", slug: "buddhism", entityType: "culture", name: "Buddhism" },
  "zoroastrianism": { wikidataId: "Q9601", slug: "zoroastrianism", entityType: "culture", name: "Zoroastrianism" },
  "christianity": { wikidataId: "Q5043", slug: "christianity", entityType: "culture", name: "Christianity" },
  "islam": { wikidataId: "Q432", slug: "islam", entityType: "culture", name: "Islam" },
  "scientific-revolution": { wikidataId: "Q214078", slug: "scientific-revolution", entityType: "culture", name: "Scientific Revolution" },
  "age-of-enlightenment": { wikidataId: "Q12539", slug: "age-of-enlightenment", entityType: "culture", name: "Age of Enlightenment" },
};

// Build slug → entry maps
const _personBySlug = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _eventBySlug  = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _cultureBySlug = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _personByQid = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _eventByQid = new Map<string, CrosswalkEntry & { entityType: EntityType }>();
const _cultureByQid = new Map<string, CrosswalkEntry & { entityType: EntityType }>();

for (const e of Object.values(PEOPLE_CROSSWALK)) {
  _personBySlug.set(e.slug, e);
  _personByQid.set(e.wikidataId, e);
}
for (const e of Object.values(EVENTS_CROSSWALK)) {
  _eventBySlug.set(e.slug, e);
  _eventByQid.set(e.wikidataId, e);
}
for (const e of Object.values(CULTURES_CROSSWALK)) {
  _cultureBySlug.set(e.slug, e);
  _cultureByQid.set(e.wikidataId, e);
}

export function lookupPerson(slug: string)  { return _personBySlug.get(slug); }
export function lookupEvent(slug: string)   { return _eventBySlug.get(slug); }
export function lookupCulture(slug: string) { return _cultureBySlug.get(slug); }

export function lookupPersonByQid(qid: string)  { return _personByQid.get(qid); }
export function lookupEventByQid(qid: string)   { return _eventByQid.get(qid); }
export function lookupCultureByQid(qid: string) { return _cultureByQid.get(qid); }

export function registerResolvedEntity(
  entityType: EntityType,
  slug: string,
  wikidataId: string,
): CrosswalkEntry & { entityType: EntityType } {
  const entry: CrosswalkEntry & { entityType: EntityType } = {
    wikidataId,
    slug,
    entityType,
  };

  if (entityType === "person") {
    // Never overwrite existing verified entries.
    if (_personBySlug.has(slug) || _personByQid.has(wikidataId)) {
      return _personBySlug.get(slug) ?? _personByQid.get(wikidataId) ?? entry;
    }
    _personBySlug.set(slug, entry);
    _personByQid.set(wikidataId, entry);
  } else if (entityType === "event") {
    if (_eventBySlug.has(slug) || _eventByQid.has(wikidataId)) {
      return _eventBySlug.get(slug) ?? _eventByQid.get(wikidataId) ?? entry;
    }
    _eventBySlug.set(slug, entry);
    _eventByQid.set(wikidataId, entry);
  } else if (entityType === "culture") {
    if (_cultureBySlug.has(slug) || _cultureByQid.has(wikidataId)) {
      return _cultureBySlug.get(slug) ?? _cultureByQid.get(wikidataId) ?? entry;
    }
    _cultureBySlug.set(slug, entry);
    _cultureByQid.set(wikidataId, entry);
  }

  return entry;
}

/** All people, events, cultures — for browse/search. */
function allEntities() {
  return [
    ...Object.values(PEOPLE_CROSSWALK),
    ...Object.values(EVENTS_CROSSWALK),
    ...Object.values(CULTURES_CROSSWALK),
  ];
}
