import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "fall-of-communism",
  title: "1989: The Fall of Communism in Europe",
  description:
    "From the Gdańsk shipyard strikes to the Berlin Wall, the Velvet Revolution, the end of the Soviet Union and the wars that tore Yugoslavia apart: how one-party rule collapsed across Eastern Europe.",
  duration: 9,
  difficulty: "standard",
  steps: [
    {
      title: "Solidarity: Gdańsk, 1980",
      date: "August 1980 – December 1981",
      text: "The first crack opened in Poland. In August 1980 a wave of strikes reached the Lenin Shipyard in Gdańsk, and on 31 August the communist government signed an agreement allowing an independent trade union, Solidarity, led by Lech Wałęsa. It was the only such union in the Soviet bloc, and by September 1981 it counted about 10 million members, roughly a third of Poland's working-age population. On 13 December 1981 General Wojciech Jaruzelski declared martial law, banned the union and interned its leaders. Solidarity survived underground, backed by the Catholic Church, and in 1983 Wałęsa received the Nobel Peace Prize.",
      mapState: { year: 1980, mapYear: 1985, lat: 52.5, lng: 19.5, zoom: 5.3 },
      highlight: ["Poland"],
      markers: [
        { label: "Gdańsk Shipyard: Solidarity founded, August 1980", at: [18.649, 54.376] },
        { label: "Warsaw: martial law declared, December 1981", at: [21.011, 52.23] },
      ],
    },
    {
      title: "Gorbachev's Reforms",
      date: "1985–1989",
      text: "In March 1985 the Soviet Politburo chose Mikhail Gorbachev, at 54 its youngest member, as party leader. The Soviet economy was stagnating, strained further by heavy military costs. From 1986 Gorbachev promoted glasnost, or openness, and perestroika, economic restructuring. The Chernobyl nuclear disaster of April 1986 gave openness new urgency. In spring 1989 Soviet voters chose between several candidates for a new Congress of People's Deputies. Gorbachev urged Eastern Europe's leaders to reform too; Hungary and Poland listened, while hardliners in East Germany, Czechoslovakia, Bulgaria and Romania did not. In July 1989 he told the Council of Europe that interfering in other states' affairs was inadmissible, implicitly giving up the use of force to keep allies in line.",
      mapState: { year: 1986, mapYear: 1985, lat: 53, lng: 30, zoom: 3.6 },
      highlight: ["USSR"],
      markers: [
        { label: "Moscow: Gorbachev takes power, March 1985", at: [37.618, 55.752] },
        { label: "Chernobyl: nuclear disaster, April 1986", at: [30.224, 51.272] },
      ],
      routes: [
        { label: "Reform urged on Poland", kind: "spread", path: [[37.6, 55.75], [32, 54.5], [26, 53.3], [21.01, 52.23]] },
        { label: "Reform urged on Hungary", kind: "spread", path: [[37.6, 55.6], [31, 51.5], [24.5, 49], [19.04, 47.5]] },
      ],
    },
    {
      title: "Poland Votes",
      date: "February–August 1989",
      text: "New strikes in 1988 forced Poland's rulers to negotiate. Round Table talks between the government and the opposition opened in Warsaw on 6 February 1989, and the agreement signed in April legalised Solidarity and set partly free elections for 4 June. Only 161 of the 460 seats in the Sejm, the lower house, were open to opposition candidates; Solidarity won every one of them, and 99 of the 100 seats in a new, freely elected Senate. The vote fell on the day after Chinese troops crushed the protests in Tiananmen Square. In August Tadeusz Mazowiecki, a Catholic editor allied with Solidarity, became Poland's first non-communist prime minister since the early post-war years.",
      mapState: { year: 1989, mapYear: 1985, lat: 52.3, lng: 19.5, zoom: 5.3 },
      highlight: ["Poland"],
      markers: [
        { label: "Warsaw: Round Table talks, February–April 1989", at: [21.011, 52.23] },
        { label: "Gdańsk: strikes, 1988", at: [18.646, 54.348] },
      ],
    },
    {
      title: "Hungary Opens the Border",
      date: "May–September 1989",
      text: "Hungary's reformers moved fast. On 2 May 1989 they began taking down the 240-kilometre fence along the Austrian frontier. On 16 June at least 100,000 people attended the reburial in Budapest of Imre Nagy, the leader of the 1956 uprising executed after a show trial. On 19 August, at a 'Pan-European Picnic' near Sopron, a border gate was opened for three hours and several hundred East German holidaymakers rushed through into Austria while the guards stood back. When Hungary opened its border fully on 11 September, tens of thousands more East Germans left for the West. East Germany's leaders could no longer keep their citizens in.",
      mapState: { year: 1989, mapYear: 1985, lat: 48, lng: 16, zoom: 5.5 },
      highlight: ["Hungary"],
      markers: [
        { label: "Pan-European Picnic, 19 August 1989", at: [16.622, 47.757] },
        { label: "Budapest: Imre Nagy reburied, 16 June 1989", at: [19.051, 47.493] },
      ],
      routes: [
        { label: "East Germans flee west via Austria, 1989", kind: "migration", path: [[19.05, 47.49], [17.6, 47.68], [16.62, 47.76], [16.37, 48.21], [14.3, 48.3], [13.46, 48.57]] },
      ],
    },
    {
      title: "The Baltic Way",
      date: "23 August 1989",
      text: "On 23 August 1989, the 50th anniversary of the Molotov–Ribbentrop Pact that had handed Estonia, Latvia and Lithuania to the Soviet sphere, about two million people joined hands in a human chain some 675 kilometres long, running through Tallinn, Riga and Vilnius. The Baltic Way was organised by the three countries' popular movements, Estonia's Popular Front, Latvia's Popular Front and Lithuania's Sąjūdis, to show the world how many wanted independence. Moscow answered with angry words but no concessions. Seven months later, on 11 March 1990, Lithuania became the first Soviet republic to declare independence.",
      mapState: { year: 1989, mapYear: 1985, lat: 57, lng: 24.8, zoom: 5.4 },
      highlight: ["USSR"],
      markers: [
        { label: "Tallinn", at: [24.745, 59.437] },
        { label: "Riga", at: [24.106, 56.949] },
        { label: "Vilnius", at: [25.28, 54.687] },
      ],
      routes: [
        { label: "The Baltic Way human chain, 23 August 1989", kind: "spread", path: [[24.745, 59.437], [24.9, 58.4], [24.6, 57.6], [24.106, 56.949], [24.3, 56.0], [25.28, 54.687]] },
      ],
    },
    {
      title: "The Wall Falls",
      date: "October 1989 – October 1990",
      text: "By autumn, crowds were marching every Monday in Leipzig. On 9 October, despite fears of a massacre like Tiananmen, some 70,000 demonstrated and the security forces did not open fire. Erich Honecker was ousted on 18 October, and on 4 November around half a million people rallied in East Berlin. On the evening of 9 November a confused announcement by the party spokesman Günter Schabowski, that new travel rules applied 'immediately', sent thousands to the checkpoints. At Bornholmer Straße the commander gave way, and soon the gates were open and Berliners were hacking at the Wall. East Germany held free elections in March 1990, and on 3 October 1990 the two German states were reunited.",
      mapState: { year: 1989, mapYear: 1985, lat: 52, lng: 12.8, zoom: 6 },
      highlight: ["East Germany"],
      markers: [
        { label: "Leipzig: Monday demonstrations", at: [12.375, 51.34] },
        { label: "Alexanderplatz: half a million rally, 4 November", at: [13.414, 52.522] },
        { label: "Bornholmer Straße: the first gate opens, 9 November", at: [13.398, 52.554] },
      ],
    },
    {
      title: "The Velvet Revolution",
      date: "November–December 1989",
      text: "The day after the Wall opened, Bulgaria's long-serving leader Todor Zhivkov was pushed out by his own Politburo. In Czechoslovakia, riot police broke up a peaceful student march in Prague on 17 November 1989. The crackdown set off daily protests: by 20 November an estimated half a million people filled the capital, and on 25 November about 800,000 gathered on Letná plain. The entire party leadership resigned, a two-hour general strike on 27 November drew in the whole country, and the next day the Communist Party agreed to give up its monopoly of power. On 29 December the dissident playwright Václav Havel was elected president.",
      mapState: { year: 1989, mapYear: 1985, lat: 47, lng: 19.5, zoom: 4.8 },
      highlight: ["Czechoslovakia", "Bulgaria"],
      markers: [
        { label: "Prague: student march, 17 November 1989", at: [14.428, 50.081] },
        { label: "Bratislava: student demonstration, 16 November", at: [17.11, 48.144] },
        { label: "Sofia: Zhivkov ousted, 10 November", at: [23.33, 42.7] },
      ],
    },
    {
      title: "Romania: The Violent Exception",
      date: "16–25 December 1989",
      text: "Nicolae Ceaușescu meant to hold on. On 16 December 1989 people in Timișoara gathered to protect László Tőkés, a Hungarian Calvinist pastor the secret police had ordered arrested and sent away, and days of unrest followed. Back from a visit to Iran, Ceaușescu called a mass rally in Bucharest on 21 December, but the crowd booed him. Security forces fired on protesters; on 22 December the army switched sides, and the Ceaușescus fled by helicopter. They were caught, condemned by a hasty military tribunal and shot on Christmas Day. Romania was the only Eastern Bloc country where the regime fell by violence; estimates of the dead range from about 700 to almost 1,300.",
      mapState: { year: 1989, mapYear: 1985, lat: 45.5, lng: 24.5, zoom: 5.6 },
      highlight: ["Romania"],
      markers: [
        { label: "Timișoara: uprising begins, 16 December", at: [21.23, 45.76] },
        { label: "Bucharest: Ceaușescu booed, 21 December", at: [26.104, 44.432] },
        { label: "Târgoviște: the Ceaușescus captured", at: [25.457, 44.924] },
      ],
      routes: [
        { label: "The revolt spreads to the capital", kind: "spread", path: [[21.23, 45.76], [22.9, 45.3], [24.4, 44.9], [26.1, 44.43]] },
      ],
    },
    {
      title: "The End of the Soviet Union",
      date: "1990–1991",
      text: "The Soviet republics now pulled away too. On 13 January 1991 Soviet troops stormed the television tower in Vilnius, killing 14 unarmed civilians. In August 1991 communist hardliners tried to overthrow Gorbachev; crowds defended the Russian parliament building in Moscow behind Boris Yeltsin, three civilians died, and the coup collapsed within days. Republic after republic declared independence. On 8 December the leaders of Russia, Ukraine and Belarus met in the Belovezha forest and declared that the Soviet Union no longer existed. Gorbachev resigned on 25 December, and the next day the Soviet Union was formally dissolved into 15 independent states. A deep economic crisis followed across much of the former union.",
      mapState: { year: 1991, mapYear: 1994, lat: 54, lng: 32, zoom: 3.8 },
      highlight: ["Russia", "Ukraine", "Estonia", "Latvia", "Lithuania", "Moldova"],
      markers: [
        { label: "Vilnius TV tower, 13 January 1991", at: [25.215, 54.687] },
        { label: "Moscow: the August coup fails, 1991", at: [37.573, 55.755] },
        { label: "Viskuli, Belovezha: the Soviet Union declared dead, 8 December", at: [23.95, 52.617] },
      ],
    },
    {
      title: "Yugoslavia Breaks Apart",
      date: "1991–1995",
      text: "Yugoslavia, a communist federation of six republics outside the Soviet bloc, came apart in war. After Tito's death in 1980 the federal system weakened, and from 1987 Slobodan Milošević rose to power in Serbia. Slovenia and Croatia declared independence on 25 June 1991, and Bosnia and Herzegovina followed. The wars that ensued killed roughly 130,000 to 140,000 people and drove about four million from their homes. Yugoslav and then Bosnian Serb forces besieged Sarajevo for 1,425 days, and in July 1995, at Srebrenica, units under Ratko Mladić killed more than 8,000 Bosniak men and boys, which two international courts later ruled a genocide. The Dayton Accords ended the Bosnian war in November 1995.",
      mapState: { year: 1992, mapYear: 1994, lat: 44, lng: 18.5, zoom: 5.5 },
      highlight: ["Slovenia", "Croatia", "Bosnia and Herzegovina", "Serbia", "Montenegro", "Macedonia"],
      markers: [
        { label: "Ljubljana: Slovenia declares independence, 25 June 1991", at: [14.506, 46.051] },
        { label: "Zagreb: Croatia declares independence, 25 June 1991", at: [15.978, 45.813] },
        { label: "Siege of Sarajevo, 1992–1996", at: [18.413, 43.856], kind: "battle" },
        { label: "Srebrenica genocide, July 1995", at: [19.297, 44.104] },
        { label: "Belgrade", at: [20.457, 44.818] },
      ],
    },
  ],
};
