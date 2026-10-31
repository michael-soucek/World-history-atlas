import type { Tour } from "@/data/tours";

export const TOUR: Tour = {
  slug: "american-civil-war",
  title: "The American Civil War",
  description:
    "From the secession of the slave states and the guns at Fort Sumter to Gettysburg, Vicksburg, Sherman's march and Appomattox: four years of war that destroyed slavery in the United States and opened the struggle of Reconstruction.",
  duration: 9,
  difficulty: "standard",
  steps: [
    {
      title: "Secession and Fort Sumter",
      date: "December 1860 – April 1861",
      text: "The war was rooted in slavery. In November 1860 Abraham Lincoln, a Republican who opposed letting slavery spread into new territories, was elected president. Seeing their slave system under threat, South Carolina voted to leave the Union on 20 December, and six cotton states of the Deep South followed by February 1861, forming the Confederate States of America. Before dawn on 12 April 1861, Confederate batteries opened fire on Fort Sumter in Charleston harbour. After 34 hours its commander, Major Robert Anderson, agreed to leave; nobody died in the bombardment itself. Lincoln called for 75,000 volunteers, and four more slave states seceded, making eleven under President Jefferson Davis.",
      mapState: { year: 1861, mapYear: 1880, lat: 35.5, lng: -84, zoom: 3.9 },
      markers: [
        { label: "Fort Sumter, 12–13 April 1861", at: [-79.8747, 32.7522], kind: "battle" },
        { label: "Washington, D.C.", at: [-77.0164, 38.9047] },
        { label: "Richmond: Confederate capital", at: [-77.4367, 37.5408] },
      ],
    },
    {
      title: "First Bull Run: the war will be long",
      date: "21 July 1861",
      text: "The Northern public demanded a quick march on the Confederate capital, Richmond. Under that pressure, Brigadier General Irvin McDowell led an untested Union army out of Washington and, on 21 July 1861, attacked across the stream called Bull Run near Manassas Junction, Virginia. Each side committed only about 18,000 men. Confederate reinforcements under Joseph E. Johnston arrived by railroad from the Shenandoah Valley, a Virginian brigade under Thomas J. Jackson held firm and earned him the name 'Stonewall', and the Union withdrawal collapsed into a panicked flight towards Washington. The Union lost about 2,700 men and the Confederates nearly 2,000. Both sides now understood the war would not be short.",
      mapState: { year: 1861, mapYear: 1880, lat: 38.9, lng: -77.6, zoom: 6 },
      markers: [
        { label: "First Bull Run (First Manassas), 21 July 1861", at: [-77.5225, 38.815], kind: "battle" },
        { label: "Washington, D.C.", at: [-77.0164, 38.9047] },
      ],
      routes: [
        { label: "McDowell's advance, July 1861", kind: "conquest", path: [[-77.03, 38.88], [-77.2, 38.85], [-77.31, 38.84], [-77.44, 38.82], [-77.5, 38.815]] },
        { label: "Johnston's troops arrive by rail", kind: "conquest", path: [[-78.16, 39.18], [-77.95, 39.0], [-77.75, 38.85], [-77.47, 38.75]] },
        { label: "The Union rout back to Washington", kind: "retreat", path: [[-77.5, 38.83], [-77.35, 38.86], [-77.2, 38.87], [-77.05, 38.89]] },
      ],
    },
    {
      title: "The war in the West: Shiloh and New Orleans",
      date: "February – May 1862",
      text: "While the East stalled, the Union made lasting gains in the West. In February 1862 Ulysses S. Grant captured Forts Henry and Donelson, opening the Tennessee and Cumberland rivers, and Nashville fell. On 6–7 April a Confederate army under Albert Sidney Johnston surprised Grant beside the Tennessee River at Shiloh. Johnston was killed, and reinforced overnight, Grant drove the Confederates back the next morning. Nearly 24,000 men were killed, wounded or missing, making it the costliest battle of the war so far. Weeks later a Union fleet under David Farragut forced its way past the forts below New Orleans and took the largest city in the Confederacy, a heavy blow to its control of the Mississippi.",
      mapState: { year: 1862, mapYear: 1880, lat: 33, lng: -88.5, zoom: 4.8 },
      markers: [
        { label: "Fort Donelson, February 1862", at: [-87.8561, 36.4931], kind: "battle" },
        { label: "Shiloh, 6–7 April 1862", at: [-88.3422, 35.1386], kind: "battle" },
        { label: "New Orleans falls, April–May 1862", at: [-90.0631, 29.9575] },
      ],
      routes: [
        { label: "Grant's army moves up the Tennessee River", kind: "conquest", path: [[-87.86, 36.49], [-88.0, 36.45], [-88.05, 36.0], [-88.1, 35.6], [-88.25, 35.3], [-88.33, 35.15]] },
        { label: "Farragut's fleet runs past the forts", kind: "voyage", path: [[-88.9, 28.95], [-89.25, 29.2], [-89.45, 29.4], [-89.75, 29.65], [-90.06, 29.95]] },
      ],
    },
    {
      title: "Antietam and the Emancipation Proclamation",
      date: "September 1862 – January 1863",
      text: "In September 1862 Robert E. Lee carried the war north into Maryland. On 17 September George B. McClellan's Army of the Potomac attacked him along Antietam Creek near Sharpsburg. The fighting left 22,726 men dead, wounded or missing, the bloodiest single day in American history. Lee pulled back across the Potomac, and five days later Lincoln announced that emancipation would follow. On 1 January 1863 his Emancipation Proclamation declared free the people enslaved in the rebelling states, over 3.5 million of the country's 4 million, though not those in slave states loyal to the Union. Freedom now advanced with Union armies, and nearly 200,000 Black men, most formerly enslaved, served in the Union Army.",
      mapState: { year: 1862, mapYear: 1880, lat: 39.2, lng: -77.6, zoom: 6 },
      markers: [
        { label: "Antietam, 17 September 1862", at: [-77.7447, 39.4733], kind: "battle" },
        { label: "Washington, D.C.", at: [-77.0164, 38.9047] },
      ],
      routes: [
        { label: "Lee invades Maryland, September 1862", kind: "conquest", path: [[-77.6, 38.75], [-77.52, 39.05], [-77.45, 39.25], [-77.41, 39.41], [-77.6, 39.45], [-77.74, 39.46]] },
        { label: "Lee withdraws across the Potomac", kind: "retreat", path: [[-77.76, 39.46], [-77.8, 39.43], [-77.88, 39.35], [-77.98, 39.25]] },
      ],
    },
    {
      title: "Gettysburg",
      date: "1–3 July 1863",
      text: "After beating the Union at Chancellorsville in May 1863, Lee marched up the Shenandoah Valley into Pennsylvania, his second invasion of the North. On the way his army seized between 40 and nearly 60 free Black civilians and sent them south into slavery. The armies collided at the crossroads town of Gettysburg on 1 July. For three days George Meade's Union army held its ground; on the last afternoon about 12,000 Confederates in Pickett's Charge were cut down attacking Cemetery Ridge. Between 46,000 and 51,000 men were killed, wounded, captured or missing. Lee retreated to Virginia. That November, Lincoln's 271-word Gettysburg Address, given at the new soldiers' cemetery, gave the war a new meaning.",
      mapState: { year: 1863, mapYear: 1880, lat: 39.3, lng: -77.8, zoom: 5.6 },
      markers: [
        { label: "Gettysburg, 1–3 July 1863", at: [-77.2258, 39.8114], kind: "battle" },
      ],
      routes: [
        { label: "Lee's invasion of the North, June 1863", kind: "conquest", path: [[-77.46, 38.3], [-78.0, 38.47], [-78.16, 39.18], [-77.75, 39.6], [-77.66, 39.94], [-77.23, 39.81]] },
        { label: "Lee's retreat, July 1863", kind: "retreat", path: [[-77.25, 39.82], [-77.45, 39.85], [-77.72, 39.75], [-77.82, 39.6], [-77.95, 39.4]] },
      ],
    },
    {
      title: "Vicksburg: the Mississippi cut",
      date: "May – July 1863",
      text: "In the West, Grant took on the river fortress of Vicksburg, the last great Confederate stronghold on the Mississippi. In spring 1863 he crossed the river south of the city at Bruinsburg, struck inland to win at Port Gibson and Raymond, took Jackson, the state capital, on 14 May, and then turned west, beating John C. Pemberton's army at Champion Hill. Two assaults on Vicksburg's defences failed, so Grant laid siege. With food almost gone, Pemberton surrendered on 4 July, the day after Gettysburg ended, and about 29,500 Confederates gave themselves up. Port Hudson fell five days later. The Union held the whole river, and the Confederacy was split in two.",
      mapState: { year: 1863, mapYear: 1880, lat: 32.2, lng: -90.6, zoom: 6 },
      markers: [
        { label: "Vicksburg surrenders, 4 July 1863", at: [-90.8511, 32.3436], kind: "battle" },
      ],
      routes: [
        { label: "Grant's Vicksburg campaign, April–May 1863", kind: "conquest", path: [[-91.07, 32.45], [-91.2, 32.15], [-91.13, 31.96], [-90.98, 31.96], [-90.42, 32.26], [-90.18, 32.3], [-90.53, 32.32], [-90.83, 32.35]] },
      ],
    },
    {
      title: "Atlanta and the March to the Sea",
      date: "May – December 1864",
      text: "Grant, now commanding all Union armies, pressed the Confederacy on several fronts at once. From Chattanooga, William T. Sherman pushed into Georgia in May 1864, and Atlanta fell on 2 September, a boost that helped Lincoln win re-election. On 15 November Sherman left Atlanta with about 62,000 men and cut loose from his supply lines. His columns lived off the land and wrecked railways, factories, farms and homes in a band across Georgia, a 'hard war' aimed at the South's economy and transport. Many enslaved people followed the columns to freedom; hundreds drowned at Ebenezer Creek trying to keep up. Sherman took Savannah on 21 December and offered it to Lincoln as a Christmas gift.",
      mapState: { year: 1864, mapYear: 1880, lat: 33.4, lng: -83.3, zoom: 5.3 },
      markers: [
        { label: "Chattanooga", at: [-85.2484, 35.066] },
        { label: "Atlanta falls, 2 September 1864", at: [-84.388, 33.749], kind: "battle" },
        { label: "Savannah taken, 21 December 1864", at: [-81.0911, 32.0811] },
      ],
      routes: [
        { label: "The Atlanta campaign, May–September 1864", kind: "conquest", path: [[-85.25, 35.05], [-84.97, 34.77], [-84.94, 34.58], [-84.75, 34.2], [-84.58, 33.98], [-84.39, 33.76]] },
        { label: "The March to the Sea, November–December 1864", kind: "conquest", path: [[-84.36, 33.73], [-83.7, 33.4], [-83.23, 33.08], [-82.5, 32.9], [-81.95, 32.8], [-81.4, 32.4], [-81.1, 32.09]] },
      ],
    },
    {
      title: "Appomattox",
      date: "April 1865",
      text: "Around Petersburg and Richmond, Grant had kept Lee's army in trenches for nine and a half months. When his last supply railways were cut, Lee abandoned both cities on the night of 2–3 April 1865 and fled west, hoping to join Confederate forces in North Carolina. Union cavalry under Philip Sheridan raced ahead; at Sailor's Creek on 6 April nearly a quarter of Lee's army was cut off. On 9 April, blocked at Appomattox Court House, Lee surrendered to Grant in the parlour of Wilmer McLean's house. About 28,000 Confederates were paroled and sent home. Other Confederate forces gave up over the following weeks; the last military department disbanded on 26 May.",
      mapState: { year: 1865, mapYear: 1880, lat: 37.35, lng: -78, zoom: 6 },
      markers: [
        { label: "Siege of Petersburg, 1864–1865", at: [-77.3778, 37.2183], kind: "battle" },
        { label: "Richmond abandoned, 2–3 April 1865", at: [-77.4367, 37.5408] },
        { label: "Appomattox Court House: Lee surrenders, 9 April 1865", at: [-78.7961, 37.3775], kind: "battle" },
      ],
      routes: [
        { label: "Lee's retreat, April 1865", kind: "retreat", path: [[-77.42, 37.4], [-77.75, 37.36], [-77.98, 37.34], [-78.2, 37.3], [-78.39, 37.3], [-78.79, 37.38]] },
        { label: "Union pursuit and the cut-off", kind: "conquest", path: [[-77.4, 37.2], [-77.8, 37.2], [-78.2, 37.19], [-78.5, 37.28], [-78.83, 37.36]] },
      ],
    },
    {
      title: "Lincoln's death and the start of Reconstruction",
      date: "April – December 1865",
      text: "On 14 April 1865 the actor and Confederate sympathiser John Wilkes Booth shot Lincoln at Ford's Theatre in Washington; he died the next morning. The war's dead are usually put at about 620,000 soldiers, but a 2011 study of census data estimated around 750,000, and possibly 850,000, before counting civilians and the many freed people who died of disease. The Thirteenth Amendment, ratified in December 1865, ended slavery except as punishment for crime, freeing four million people. The Freedmen's Bureau gave food and shelter to freed people, but President Andrew Johnson let Southern states pass Black Codes restricting their rights. The fight over equal citizenship, and the violence of groups like the Ku Klux Klan, had only begun.",
      mapState: { year: 1865, mapYear: 1880, lat: 35.5, lng: -84, zoom: 3.9 },
      markers: [{ label: "Ford's Theatre: Lincoln shot, 14 April 1865", at: [-77.0258, 38.8967] }],
    },
  ],
};
