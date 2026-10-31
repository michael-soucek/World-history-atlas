import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "scramble-for-africa",
  title: "The Scramble for Africa",
  description:
    "How seven European states carved up a continent that was still mostly African-ruled in 1880, from the Berlin Conference and the Congo Free State to Adwa, the Boer War and the Herero and Nama genocide, and how Africans resisted.",
  duration: 9,
  difficulty: "standard",
  steps: [
    {
      title: "Africa Before the Scramble",
      date: "c. 1880",
      text: "As late as the 1870s, Europeans controlled only about a tenth of Africa, nearly all of it close to the coast. Portugal held Angola and Mozambique, Britain the Cape Colony and France Algeria, alongside scattered trading posts on the West African shore. The rest of the continent was governed by Africans, in states as varied as Ethiopia, Asante, Buganda, the Sokoto Caliphate and the Sultanate of Zanzibar, and Liberia had been an independent republic since 1847. Malaria and other tropical diseases had long kept Europeans near the sea. Quinine, steamships, railways and the telegraph were about to change that.",
      mapState: { year: 1880, lat: 3, lng: 18, zoom: 2.6 },
      highlight: ["Algeria (FR)", "Cape Colony", "Angola (Portugal)", "Mozambique"],
      markers: [
        { label: "Kumasi, capital of Asante", at: [-1.62, 6.7] },
        { label: "Monrovia, Liberia: independent since 1847", at: [-10.8, 6.31] },
        { label: "Zanzibar", at: [39.2, -6.17] },
        { label: "Luanda (Portuguese)", at: [13.23, -8.84] },
        { label: "Cape Town (British)", at: [18.42, -33.93] },
      ],
    },
    {
      title: "The Race Begins: Berlin, 1884–1885",
      date: "1881–1885",
      text: "In 1881 France occupied Tunisia, and in 1882 Britain took over Egypt, with its vital Suez Canal, after an army revolt. In the Congo basin, agents of France and of King Leopold II of Belgium raced each other to sign treaties with local rulers. To keep these rivalries from ending in war, the German chancellor Otto von Bismarck hosted fourteen countries in Berlin from November 1884 to February 1885. No African ruler was invited. The General Act set rules for claiming land through 'effective occupation', declared the Congo basin a free-trade zone and recognised Leopold's claim there. Some scholars stress that most borders were actually fixed by later bilateral treaties.",
      mapState: { year: 1884, mapYear: 1880, lat: 20, lng: 15, zoom: 2.6 },
      markers: [
        { label: "Berlin Conference, 1884–1885", at: [13.4, 52.52] },
        { label: "Tunisia occupied by France, 1881", at: [10.18, 36.81] },
        { label: "Egypt occupied by Britain, 1882", at: [31.24, 30.04] },
        { label: "Brazzaville: French flag raised, 1881", at: [15.27, -4.27] },
      ],
    },
    {
      title: "Leopold's Congo Free State",
      date: "1885–1908",
      text: "In 1885 Leopold proclaimed the Congo Free State, a territory more than 85 times the size of Belgium that he owned personally and never visited. His army, the Force Publique, and the militias of concession companies forced villagers to collect wild rubber to quotas, taking hostages, flogging people and burning villages that fell short. Soldiers cut hands from those they had shot, to prove bullets had not been wasted. Missionaries, the British consul Roger Casement and the journalist E. D. Morel exposed the abuses. Historians' estimates of the population loss range from about one million to ten million. Under international pressure, Belgium annexed the colony in 1908.",
      mapState: { year: 1895, mapYear: 1914, lat: -2, lng: 21, zoom: 4.2 },
      highlight: ["Belgian Congo"],
      markers: [
        { label: "Boma, near the mouth of the Congo", at: [13.05, -5.85] },
        { label: "Brazzaville (French)", at: [15.27, -4.27] },
        { label: "Kisangani, on the upper Congo", at: [25.2, 0.52] },
      ],
      routes: [
        { label: "Stanley works for Leopold up the Congo, 1878–1885", kind: "voyage", path: [[13.05, -5.85], [14.5, -5.3], [15.31, -4.32], [16.6, -2.5], [18.26, 0.05], [21.5, 2.15], [23.6, 1.24], [25.2, 0.52]] },
      ],
    },
    {
      title: "Samori Ture and French West Africa",
      date: "1882–1898",
      text: "France pushed east from Senegal toward the Niger. Its most stubborn opponent was Samori Ture, a Malinke Muslim leader who had built the Wassoulou Empire across today's Guinea and southern Mali, buying modern rifles through British Sierra Leone. From 1882 he fought the French for sixteen years, combining pitched battles with guerrilla raids and scorched-earth retreats. When they cut his arms supply he moved his whole state east, with a following of some 120,000 people, and took the trading city of Kong. He was captured in September 1898 and exiled to Gabon, where he died in 1900. France had already merged its West African colonies into French West Africa in 1895.",
      mapState: { year: 1891, mapYear: 1900, lat: 12, lng: -9, zoom: 4.3 },
      highlight: ["First Samori Empire", "Second Samori Empire"],
      markers: [
        { label: "Saint-Louis, Senegal", at: [-16.5, 16.03] },
        { label: "Kita: French garrison", at: [-9.49, 13.04] },
        { label: "Bissandugu: Samori's base", at: [-9.16, 9.93] },
        { label: "Kankan", at: [-9.3, 10.38] },
        { label: "Sikasso: Samori's failed siege, 1887–1888", at: [-5.67, 11.32], kind: "battle" },
        { label: "Kong: taken 1895, destroyed 1897", at: [-4.62, 9.15] },
      ],
      routes: [
        { label: "The French advance from Senegal toward the Niger", kind: "conquest", path: [[-16.5, 16.03], [-14.5, 15.2], [-11.43, 14.45], [-10.4, 13.7], [-9.49, 13.04], [-9.17, 11.42]] },
        { label: "Samori moves his state east, 1893–1895", kind: "migration", path: [[-9.16, 9.93], [-8, 9.6], [-6.8, 9.4], [-5.6, 9.3], [-4.62, 9.15]] },
      ],
    },
    {
      title: "Adwa: Ethiopia Defeats Italy",
      date: "1 March 1896",
      text: "Italy, which held Eritrea on the Red Sea, claimed that the 1889 Treaty of Wuchale made Ethiopia its protectorate; the Amharic version of the treaty said nothing of the kind. As Italian troops pushed into Tigray, Emperor Menelik II called the country to arms in September 1895. His army, estimated at 73,000 to more than 100,000 men and largely armed with modern rifles from France and Russia, was led by Menelik, Empress Taytu and regional lords. On 1 March 1896, near Adwa, General Baratieri's much smaller force attacked in separated columns and was overwhelmed. More than 6,000 Italian and Eritrean colonial troops were killed and about 3,800 captured; Ethiopian dead are estimated at 4,000 to 7,000.",
      mapState: { year: 1896, mapYear: 1900, lat: 14, lng: 39, zoom: 6 },
      highlight: ["Ethiopia"],
      markers: [
        { label: "Adwa, 1 March 1896", at: [38.97, 14.02], kind: "battle" },
        { label: "Asmara, Italian Eritrea", at: [38.94, 15.34] },
        { label: "Massawa", at: [39.45, 15.61] },
      ],
      routes: [
        { label: "The Italian advance into Tigray, 1895", kind: "conquest", path: [[39.45, 15.61], [39.15, 15.45], [38.94, 15.34], [38.9, 14.8], [38.95, 14.3]] },
        { label: "The Italian rout, 1 March 1896", kind: "retreat", path: [[38.97, 14.02], [38.9, 14.45], [38.82, 14.88]] },
      ],
    },
    {
      title: "Cape to Cairo: Omdurman and Fashoda",
      date: "1896–1898",
      text: "British imperialists, above all Cecil Rhodes, dreamed of a chain of colonies joined by railway from the Cape to Cairo. France wanted a belt from Senegal to the Red Sea. The two plans met on the upper Nile. In 1896 an Anglo-Egyptian army under Herbert Kitchener set out to reconquer Sudan from the Mahdist State. At Omdurman on 2 September 1898, its rifles, machine guns and artillery cut down the Khalifa's army: about 12,000 Sudanese were killed, against fewer than 50 on Kitchener's side. Days later his gunboats reached Fashoda, where Jean-Baptiste Marchand's small French force had raised the flag after a 14-month trek. After a war scare in Europe, France withdrew.",
      mapState: { year: 1898, mapYear: 1914, lat: 2, lng: 26, zoom: 2.6 },
      highlight: ["Egypt", "Anglo-Egyptian Sudan", "Uganda", "British East Africa", "Rhodesia", "South Africa"],
      markers: [
        { label: "Cairo", at: [31.24, 30.04] },
        { label: "Omdurman, 2 September 1898", at: [32.52, 15.75], kind: "battle" },
        { label: "Fashoda: French and British face off, 1898", at: [32.11, 9.89] },
        { label: "Cape Town", at: [18.42, -33.93] },
      ],
      routes: [
        { label: "Kitchener's advance up the Nile, 1896–1898", kind: "conquest", path: [[31.37, 21.78], [33.34, 19.54], [33.98, 17.7], [32.52, 15.75], [32.66, 13.17], [32.78, 11.75], [32.11, 9.89]] },
        { label: "Marchand's expedition from Brazzaville, 1897–1898", kind: "raid", path: [[15.27, -4.27], [16.6, -1], [18.56, 4.37], [22.5, 4.8], [26, 5.5], [29, 7.7], [32.11, 9.89]] },
      ],
    },
    {
      title: "The Boer War",
      date: "1899–1902",
      text: "Gold found on the Witwatersrand drew thousands of mostly British outsiders into the Transvaal, an independent Boer republic that denied them the vote. War broke out in October 1899. The Boers struck first, besieging Ladysmith, Mafeking and Kimberley, but a British force that grew to 180,000 relieved the towns and took both Boer capitals in 1900. The Boers fought on as guerrillas. Britain replied by burning farms and crops and forcing civilians into concentration camps, where about 26,000 Boer women and children died; around 20,000 Black Africans died in separate camps. The republics surrendered in May 1902 and were absorbed into the British Empire.",
      mapState: { year: 1900, lat: -27.5, lng: 26.5, zoom: 5.2 },
      highlight: ["Transvaal", "Orange Free State"],
      markers: [
        { label: "Witwatersrand gold fields", at: [28.05, -26.2] },
        { label: "Siege of Ladysmith", at: [29.78, -28.56], kind: "battle" },
        { label: "Siege of Mafeking", at: [25.64, -25.87], kind: "battle" },
        { label: "Siege of Kimberley", at: [24.76, -28.74], kind: "battle" },
        { label: "Bloemfontein, Orange Free State capital", at: [26.22, -29.12] },
        { label: "Pretoria, Transvaal capital", at: [28.19, -25.75] },
      ],
      routes: [
        { label: "The British advance on the Boer capitals, 1900", kind: "conquest", path: [[24.1, -29.6], [24.76, -28.74], [26.22, -29.12], [27.5, -27.6], [28.05, -26.2], [28.19, -25.75]] },
      ],
    },
    {
      title: "The Herero and Nama Genocide",
      date: "1904–1908",
      text: "In German South West Africa, colonial rule was tightening and settlers sought to turn Africans into a subordinate labour force. On 12 January 1904 the Herero leader Samuel Maharero launched an uprising. In August, after reinforcements arrived, General Lothar von Trotha defeated the Herero at the Waterberg, and most fled into the Omaheke desert, where German troops guarded or poisoned the waterholes. In October Trotha ordered that every Herero in the colony be shot. In September the Nama, under Hendrik Witbooi, also rose. Survivors were held in concentration camps such as Shark Island, where around half of those held died. Historians estimate that 40,000 to 80,000 Herero and around 10,000 Nama died. Germany acknowledged the genocide in 2015.",
      mapState: { year: 1904, mapYear: 1914, lat: -22.5, lng: 18, zoom: 5 },
      highlight: ["German South-West Africa"],
      markers: [
        { label: "Okahandja: the uprising begins, January 1904", at: [16.92, -21.98] },
        { label: "Waterberg, August 1904", at: [17.23, -20.52], kind: "battle" },
        { label: "Windhoek", at: [17.08, -22.57] },
        { label: "Shark Island concentration camp, Lüderitz", at: [15.15, -26.65] },
      ],
      routes: [
        { label: "Herero flight into the Omaheke desert, 1904", kind: "forced", path: [[17.23, -20.52], [18.2, -20.9], [19, -21.3], [19.8, -21.8], [20.8, -22.2]] },
      ],
    },
    {
      title: "Maji Maji",
      date: "1905–1907",
      text: "In German East Africa, head taxes and forced labour were followed by orders that villages grow cotton for export to set quotas. In July 1905 the Matumbi people rose and tore up the cotton. A spirit medium, Kinjikitile Ngwale, had given his followers maji, a water medicine said to turn German bullets into water, and the revolt spread across the south among the Ngindo, Yao, Ngoni and others. Armed mostly with spears, the rebels were mown down by machine guns at Mahenge and elsewhere. Governor von Götzen's columns then burned villages and crops to starve the region into surrender. Between 75,000 and 300,000 people died, most of them in the famine that followed.",
      mapState: { year: 1905, mapYear: 1914, lat: -8, lng: 37, zoom: 5 },
      highlight: ["German E. Africa (Tanganyika)"],
      markers: [
        { label: "Mahenge: attack on the German fort, 1905", at: [36.72, -8.68], kind: "battle" },
        { label: "Songea", at: [35.65, -10.68] },
        { label: "Dar es Salaam", at: [39.28, -6.82] },
      ],
      routes: [
        { label: "The rising spreads from the Matumbi Hills, 1905", kind: "spread", path: [[38.9, -8.6], [37.8, -8.5], [36.72, -8.68]] },
        { label: "South to the Ngoni country", kind: "spread", path: [[38.9, -8.6], [37.6, -9.6], [36.6, -10.3], [35.65, -10.68]] },
      ],
    },
    {
      title: "Africa in 1914",
      date: "1914",
      text: "By 1914 only Ethiopia and Liberia remained outside European control. Belgium, Britain, France, Germany, Italy, Portugal and Spain had divided everything else; between 1885 and 1914 Britain alone took nearly 30 percent of Africa's people under its rule, and France 15 percent. Resistance went on: in the Horn of Africa, the Dervish movement of Mohammed Abdullah Hassan held out against Britain until 1920. Ethiopia stayed independent until Fascist Italy invaded in the 1930s. The borders drawn in these decades largely outlived colonial rule: in 1964 the newly independent African states agreed to keep them, fearing that redrawing them would bring civil wars.",
      mapState: { year: 1914, lat: 3, lng: 18, zoom: 2.6 },
      highlight: ["Abyssinia", "Liberia"],
      markers: [
        { label: "Ethiopia: independent", at: [38.75, 9.04] },
        { label: "Liberia: independent", at: [-10.8, 6.31] },
      ],
    },
  ],
};
