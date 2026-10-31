import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "thirty-years-war",
  title: "The Thirty Years' War",
  description:
    "From a window in Prague Castle in 1618 to the peace congresses of Münster and Osnabrück in 1648: how a Bohemian revolt grew into a European war that left millions dead and redrew the rules of the Holy Roman Empire.",
  duration: 9,
  difficulty: "standard",
  trail: true,
  steps: [
    {
      title: "Out of the Window: Prague, 1618",
      date: "23 May 1618",
      text: "Bohemia's Protestant nobles feared that their new Habsburg king, Ferdinand of Styria, a zealous Catholic who had stamped out Protestantism in his own duchy, would strip away their religious freedoms. When he had building work on Protestant chapels halted and their assembly dissolved, a group led by Count Thurn confronted two of his Catholic regents, Vilém Slavata and Jaroslav Bořita of Martinice, in Prague Castle. Both men, and their secretary Filip Fabricius, were hurled from a high window. All three survived the fall. The rebels set up their own government, and a quarrel inside the Holy Roman Empire began to draw in all of Europe.",
      mapState: { year: 1618, mapYear: 1600, lat: 50.1, lng: 14.4, zoom: 5.4 },
      highlight: ["Holy Roman Empire"],
      markers: [{ label: "Prague Castle: the Defenestration, 1618", at: [14.4, 50.09] }],
    },
    {
      title: "White Mountain: the Revolt Crushed",
      date: "8 November 1620",
      text: "In 1619 the Bohemian estates deposed Ferdinand and offered their crown to Frederick V, the Calvinist Elector Palatine; days later Ferdinand was elected Holy Roman Emperor. Backed by Maximilian of Bavaria's Catholic League and by Spain, an Imperial army under Tilly and Bucquoy marched on Prague. Outside the city, at White Mountain, it routed Christian of Anhalt's Bohemian army; one modern estimate puts the rebels' losses at about 2,800 against some 650 for the victors. Frederick fled, his lands and electoral vote went to Bavaria, and rebel estates were confiscated, many passing to loyal Catholics.",
      mapState: { year: 1620, mapYear: 1600, lat: 49.6, lng: 13.2, zoom: 5.6 },
      highlight: ["Holy Roman Empire"],
      markers: [{ label: "White Mountain, 8 November 1620", at: [14.32, 50.08], kind: "battle" }],
      routes: [
        { label: "Imperial and Catholic League advance on Prague, 1620", kind: "conquest", path: [[16.37, 48.21], [15.2, 48.8], [14.2, 49.3], [13.9, 49.8], [14.32, 50.08]] },
        { label: "Frederick flees to Silesia", kind: "retreat", path: [[14.42, 50.09], [15.4, 50.4], [16.6, 50.8], [17.03, 51.11]] },
      ],
    },
    {
      title: "Denmark Steps In",
      date: "1625–1629",
      text: "Protestant princes in northern Germany feared Catholic lands lost since the Reformation would be taken back. Christian IV of Denmark, who as Duke of Holstein sat among them, agreed to lead their army, funded by promised Dutch and English subsidies, most of which never arrived. His three-pronged plan collapsed: Wallenstein beat the mercenary leader Ernst von Mansfeld at Dessau Bridge in April 1626, and in August Tilly smashed the Danish king himself at Lutter, where Christian lost at least 30 per cent of his army and all his guns. The Treaty of Lübeck in 1629 let Denmark keep its lands in return for leaving German affairs.",
      mapState: { year: 1626, mapYear: 1600, lat: 53, lng: 10.5, zoom: 5.3 },
      highlight: ["Denmark-Norway"],
      markers: [
        { label: "Dessau Bridge, April 1626", at: [12.24, 51.88], kind: "battle" },
        { label: "Lutter, 27 August 1626", at: [10.24, 51.97], kind: "battle" },
        { label: "Lübeck: peace, 1629", at: [10.69, 53.87] },
      ],
      routes: [
        { label: "Christian IV's march south, 1626", kind: "conquest", path: [[10, 53.6], [9.6, 53], [10.1, 52.5], [10.54, 52.16], [10.24, 51.97]] },
        { label: "Danish retreat after Lutter", kind: "retreat", path: [[10.24, 51.97], [10.54, 52.16], [10.2, 52.9], [10, 53.6]] },
      ],
    },
    {
      title: "Wallenstein's Army",
      date: "1625–1630",
      text: "Albrecht von Wallenstein, a Bohemian noble who had grown rich on estates seized from the rebels, offered the emperor an army that would pay for itself: in 1625 he raised about 50,000 men, funded by forced levies on the towns they passed through. By the end of 1627 he held Mecklenburg, Pomerania and Jutland, and the emperor made him Duke of Mecklenburg. Stralsund, helped by Swedish-sent Scots, held out against his siege in 1628. Then Ferdinand overreached with his 1629 Edict of Restitution, demanding the return of all church lands taken since 1555. Princes of both faiths had turned against Wallenstein, and in 1630 the emperor dismissed him.",
      mapState: { year: 1628, mapYear: 1600, lat: 53, lng: 12, zoom: 5 },
      markers: [
        { label: "Stralsund: siege fails, 1628", at: [13.08, 54.3], kind: "battle" },
        { label: "Schwerin: Wallenstein, Duke of Mecklenburg", at: [11.42, 53.63] },
        { label: "Jičín: capital of his Duchy of Friedland", at: [15.35, 50.44] },
      ],
      routes: [
        { label: "Wallenstein's army conquers the north, 1626–1627", kind: "conquest", path: [[12.24, 51.88], [11.64, 52.13], [11.4, 53.2], [11.42, 53.63], [13.08, 54.3]] },
        { label: "Into Jutland, 1627", kind: "conquest", path: [[11.42, 53.63], [10.3, 54], [9.6, 54.8], [9.5, 55.8]] },
      ],
    },
    {
      title: "Sweden Lands, Magdeburg Burns",
      date: "1630–1631",
      text: "In mid-1630 Gustavus Adolphus of Sweden came ashore near Peenemünde with nearly 18,000 men, driven by Protestant solidarity and by Sweden's stake in Baltic trade; from 1631 France paid him subsidies. German princes hesitated to join him. Then, on 20 May 1631, Imperial and Catholic League troops under Tilly and Pappenheim stormed Protestant Magdeburg on the Elbe. Fire swept the city, destroying around 1,700 of its 1,900 buildings, and soldiers looted, raped and killed for days. Roughly 20,000 defenders and civilians died; a count in 1632 found only 449 inhabitants. It was the war's worst massacre.",
      mapState: { year: 1631, mapYear: 1600, lat: 53.2, lng: 12.8, zoom: 5.4 },
      highlight: ["Sweden"],
      markers: [
        { label: "Peenemünde: the Swedes land, 1630", at: [13.77, 54.13] },
        { label: "Sack of Magdeburg, 20 May 1631", at: [11.64, 52.13], kind: "battle" },
      ],
      routes: [
        { label: "Swedish invasion fleet, 1630", kind: "voyage", path: [[18.07, 59.33], [18.8, 57.8], [16.5, 55.8], [14.6, 54.6], [13.77, 54.13]] },
        { label: "Gustavus advances up the Oder", kind: "conquest", path: [[13.77, 54.13], [14.2, 53.8], [14.55, 53.43], [14.6, 52.9], [14.55, 52.34]] },
        { label: "Tilly's army on Magdeburg", kind: "conquest", path: [[12.6, 52.5], [12.1, 52.3], [11.64, 52.13]] },
      ],
    },
    {
      title: "Breitenfeld: the Swedish Triumph",
      date: "17 September 1631",
      text: "Magdeburg's fate pushed Saxony into alliance with Sweden. North of Leipzig, at Breitenfeld, about 40,000 Swedes and Saxons met some 31,000 Imperial and Catholic League troops under Tilly. Tilly's cavalry quickly broke the Saxons and tried to wrap around the Swedish army, but the Swedes re-formed and drove them back with a series of counter-attacks. Tilly's army was shattered, with thousands killed or wounded and about 6,000 taken prisoner. Victory opened the way for Gustavus to campaign through central and southern Germany. At Rain on the Lech the following April, Tilly himself was killed.",
      mapState: { year: 1631, mapYear: 1600, lat: 50.3, lng: 11.4, zoom: 5.2 },
      markers: [
        { label: "Breitenfeld, 17 September 1631", at: [12.38, 51.42], kind: "battle" },
        { label: "Rain on the Lech: Tilly falls, April 1632", at: [10.92, 48.68], kind: "battle" },
      ],
      routes: [
        { label: "Swedish advance into southern Germany, 1631–1632", kind: "conquest", path: [[12.38, 51.42], [11.4, 50.9], [10, 50.1], [9.93, 49.79], [11, 49.47], [10.92, 48.68], [11.58, 48.14]] },
      ],
    },
    {
      title: "Lützen: a King Falls",
      date: "16 November 1632",
      text: "Alarmed, Ferdinand recalled Wallenstein, who raised a new army and in August 1632 beat off a costly Swedish assault on his fortified camp at the Alte Veste near Fürth. In November the two armies met at Lützen, south-west of Leipzig. Gustavus was killed when his first infantry attacks were thrown back, but his men re-formed, overran the Imperial centre by nightfall and Wallenstein withdrew, leaving his wounded and guns behind. Most historians call it a Swedish victory, though some dispute it. Sweden fought on under the chancellor Axel Oxenstierna. Suspected of treason, Wallenstein was murdered by his own officers at Cheb in February 1634.",
      mapState: { year: 1632, mapYear: 1600, lat: 50.4, lng: 12, zoom: 5.6 },
      markers: [
        { label: "Alte Veste, August 1632", at: [10.97, 49.45], kind: "battle" },
        { label: "Lützen, 16 November 1632: Gustavus killed", at: [12.16, 51.27], kind: "battle" },
        { label: "Cheb: Wallenstein murdered, 25 February 1634", at: [12.37, 50.08] },
      ],
      routes: [
        { label: "Wallenstein moves north into Saxony, autumn 1632", kind: "conquest", path: [[10.97, 49.45], [11.6, 50], [12.1, 50.7], [12.16, 51.27]] },
      ],
    },
    {
      title: "France Joins the Fight",
      date: "1634–1643",
      text: "At Nördlingen in September 1634 a combined Spanish and Imperial army crushed the Swedes, ending their hold on southern Germany. In 1635 Sweden's main German allies made peace with the emperor at Prague, and the religious civil war turned into a contest between great powers. Catholic France, the Habsburgs' great rival, had so far fought through subsidies; now Cardinal Richelieu declared war on Spain and in 1636 joined Sweden as an open ally. The fighting spread across the Rhineland and the Low Countries. At Rocroi on 19 May 1643, the 21-year-old Duke of Enghien defeated a Spanish army, a battle often seen as the end of the Spanish infantry's long dominance.",
      mapState: { year: 1643, mapYear: 1650, lat: 49.3, lng: 6.5, zoom: 4.8 },
      highlight: ["France", "Spanish Netherlands"],
      markers: [
        { label: "Nördlingen, September 1634", at: [10.49, 48.81], kind: "battle" },
        { label: "Rocroi, 19 May 1643", at: [4.53, 49.92], kind: "battle" },
        { label: "Breisach: taken by Bernard of Saxe-Weimar, 1638", at: [7.58, 48.03] },
      ],
      routes: [
        { label: "Spanish invasion of northern France, 1643", kind: "conquest", path: [[4.35, 50.85], [4.4, 50.4], [4.53, 49.92]] },
        { label: "French-funded campaign on the Upper Rhine, 1638", kind: "conquest", path: [[6.17, 48.7], [7, 48.2], [7.58, 48.03]] },
      ],
    },
    {
      title: "A Land Laid Waste",
      text: "Armies of unpaid mercenaries lived off the land, stripping the same districts again and again. Hunger and disease followed them; in surviving local records, plague alone caused about two-thirds of civilian deaths, and violence only a few per cent. Estimates of the war's total dead range from 4.5 to 8 million, mostly civilians. Modern historians generally put the fall in population of the German lands at roughly 40 per cent, though this includes flight and fewer births. Losses varied widely: parts of the north-west escaped lightly, while Mecklenburg, Pomerania and Württemberg lost close to half their people. Augsburg shrank from about 48,000 to 21,000.",
      mapState: { year: 1640, mapYear: 1600, lat: 51, lng: 11, zoom: 4.8 },
      highlight: ["Holy Roman Empire"],
      markers: [
        { label: "Mecklenburg: losses near 50%", at: [11.8, 53.6] },
        { label: "Pomerania: losses near 50%", at: [14.5, 53.8] },
        { label: "Württemberg: losses near 50%", at: [9.18, 48.78] },
        { label: "Augsburg: about 48,000 people fall to 21,000", at: [10.9, 48.37] },
      ],
    },
    {
      title: "The Peace of Westphalia",
      date: "October 1648",
      text: "Peace talks opened in the Westphalian towns of Münster and Osnabrück, where a total of 109 delegations came and went over several years. When the emperor finally signed on 24 October 1648, Swedish troops who had seized part of Prague that July were still fighting there. Spain had already recognised Dutch independence that January. Sweden gained much of Pomerania, Bremen and Verden, plus five million thalers; France took Metz, Toul and Verdun and towns in Alsace. Calvinism won legal recognition, and German princes gained wide autonomy under a weakened emperor. Many scholars of international relations see Westphalia as the birth of a Europe of sovereign states, although some historians argue that idea was read back into it much later.",
      mapState: { year: 1648, mapYear: 1650, lat: 52, lng: 9.5, zoom: 4.6 },
      highlight: ["Holy Roman Empire", "Dutch Republic", "Sweden"],
      markers: [
        { label: "Münster", at: [7.63, 51.96] },
        { label: "Osnabrück", at: [8.05, 52.28] },
        { label: "Prague: Swedish siege, 1648", at: [14.42, 50.09], kind: "battle" },
      ],
    },
  ],
};
