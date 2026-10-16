/** Reference simulation port. Rendering, storage and platform APIs are injected. */
import zh from './locale';
let _n:any;let persistence:(data:any)=>void=()=>{};
export function configurePhysics(api:any){_n=api}
export function configurePersistence(fn:(data:any)=>void){persistence=fn}
const Yt=(_key:any):any=>null;const Xt=(_key:any,value:any)=>persistence(value);const gt=():any=>zh;const _t=(key:any):any=>(zh as any)[key]??Ye[key];const vt=(kind:any,id:any):any=>(zh as any)[kind]?.[id]??Ye[kind]?.[id];
var Ye: any = { title: `Last Lantern`, tagline: `The sun was stolen. Carry the last of its fire through the night.`, play: `Play`, continue: `Continue`, hearth: `The Hearth`, journal: `Journal`, howto: `How to play`, settings: `Settings`, back: `\u2190 Back`, embers: `embers`, emberCount: `{n} embers`, madeBy: `Made by {name}, with the help of Claude`, techLine: `A {nape} physics game \xB7 {three}`, chooseHero: `Choose your lantern-bearer`, chooseStage: `Choose a beacon`, begin: `Light the way`, locked: `Locked`, bloodMoon: `Blood Moon`, bloodMoonDesc: `Stronger, faster, more of them. \xD71.75 embers.`, bloodLocked: `Light this beacon first`, stageN: `Beacon {n}`, bossAt: `The keeper comes at {t}`, cleared: `Lit`, clearedBlood: `Lit under the Blood Moon`, best: `Best: {t} \xB7 {k} kills`, unlockStage: `Light beacon {n} to unlock`, unlockLevel: `Reach level {n} in a run`, unlockKills: `Slay {n} monsters in total ({have} so far)`, active: `Ability`, startsWith: `Starts with`, hp: `Health`, speed: `Speed`, perk: `Trait`, set_language: `Language`, set_sound: `Sound`, set_master: `Master volume`, set_sfx: `Effects`, set_music: `Music`, set_graphics: `Graphics`, set_quality: `Quality`, q_high: `High`, q_low: `Low`, q_ultra: `Ultra`, set_numbers: `Damage numbers`, set_calm: `Reduce flashing (photosensitivity)`, safety_eyebrow: `Before you begin`, safety_title: `Photosensitivity warning`, safety_text: `This game has bright flashes of light, lightning and fast-moving effects. A small number of people may have seizures when exposed to flashing lights. If you or anyone in your family has epilepsy, or you feel dizzy or unwell while playing, stop at once. You can turn on reduced flashing now or any time in Settings.`, safety_ok: `Continue`, safety_calm: `Reduce flashing`, set_shake: `Screen shake`, set_progress: `Progress`, set_progressRow: `Embers, upgrades and unlocks`, set_reset: `Reset progress`, confirmReset: `Reset every beacon, ember and upgrade?`, progressReset: `Progress reset`, h_goal: `The night`, p_goal: `Every weapon fires on its own \u2014 you only move. Survive the night's waves until the <b>keeper of the beacon</b> comes, then destroy it to light the beacon and win the stage.`, h_grow: `Growing stronger`, p_grow: `Monsters drop <b>soul gems</b>. A full bar lets you pick a new weapon, a passive or an upgrade. Elites and bosses drop <b>chests</b>: a weapon at its top level together with its partner passive <b>evolves</b> when you open one.`, h_embers: `Embers`, p_embers: `<b>Embers</b> are kept even when the night takes you. Spend them at <b>the Hearth</b> on upgrades that last for every run. Lit beacons unlock new lantern-bearers and weapons.`, h_keys: `Controls`, k_move: `Move`, k_active: `Use your ability`, k_pick: `Pick a card`, k_pause: `Pause`, h_touch: `Touch`, p_touch: `Drag anywhere to move \u2014 the stick appears under your thumb. Tap the round button for your ability.`, h_tips: `Tips`, tip1: `Candelabras around the arena break open: they hide bread, flares, magnets, hourglasses and embers.`, tip2: `The crowd is physical. Crates, barrels and pews block, knockback throws monsters into each other, and the grave hook hurls them like bowling balls.`, tip3: `Mud slows everything that walks, ice makes you slide \u2014 ghosts and flyers ignore both.`, tip4: `Red circles on the ground mean a slam or a charge is coming. Move.`, tip5: `Elites drop chests. The first elite's chest of every run holds a <b>relic</b> \u2014 a one-off item with a strong effect; a purple glow marks relic chests. You can carry two.`, hud_lv: `LV {n}`, hud_kills: `{n}`, hud_boss: `The keeper`, hud_ready: `READY`, hud_space: `SPACE`, levelUp: `Level up!`, chooseOne: `Choose one`, newTag: `New`, lvTag: `Level {n}`, maxTag: `Max`, reroll: `Reroll ({n})`, banish: `Banish ({n})`, skip: `Skip`, banishMode: `Pick a card to banish it for the rest of the run`, card_gold: `A pouch of embers`, card_goldDesc: `+10 embers`, card_heal: `Bread and wine`, card_healDesc: `Restore 30 health`, evoHint: `Evolves with {p} at max level`, st_dmg: `Damage`, st_range: `Reach`, st_cd: `Cooldown`, st_arcs: `Lashes`, st_width: `Width`, st_n: `Count`, st_pierce: `Pierce`, st_radius: `Radius`, st_knock: `Knockback`, st_speed: `Speed`, st_chain: `Chains`, st_dur: `Duration`, st_blast: `Burst`, st_reach: `Throw`, relicTag: `Relic`, relicsTab: `Relics`, passivesTab: `Passives`, tierBoss: `Keeper`, tierElite: `Elite`, boostLine: `You set out stronger: +{n} levels`, boostIntro: `You start with {n} extra levels`, chestTitle: `A chest!`, chestEvolve: `{a} became {b}!`, chestItems: `Inside:`, chestGold: `+{n} embers`, chestOk: `Take it`, paused: `Paused`, resume: `Resume`, restart: `Restart`, abandon: `Abandon the run`, mainMenu: `Main menu`, confirmAbandon: `Give up this run? You keep the embers you carry.`, wonTitle: `The beacon burns`, lostTitle: `The night takes you`, r_time: `Time survived`, r_kills: `Monsters slain`, r_level: `Level reached`, r_embers: `Embers gathered`, r_tithe: `{n} from the night's tithe`, r_weapons: `Your arsenal`, r_dmg: `damage`, r_kills2: `kills`, r_newUnlock: `Unlocked: {x}`, r_again: `Again`, r_toHearth: `The Hearth`, r_continue: `Continue`, b_start: `SURVIVE UNTIL THE KEEPER COMES`, b_dead: `THE NIGHT TAKES YOU`, b_beacon: `THE BEACON IS LIT`, b_revive: `THE EMBER REKINDLES`, b_bossDown: `THE KEEPER FALLS`, b_eliteDown: `ELITE SLAIN`, b_magnet: `MAGNET`, b_flare: `SUNBURST`, b_freeze: `TIME STANDS STILL`, b_martyr: `THE CANDLE FLARES`, b_relicChest: `A RELIC GLEAMS IN THE CHEST`, b_king2: `THE KING DRAWS HIS SCYTHES`, b_king3: `ECLIPSE`, ev_ring: `THEY SURROUND YOU`, ev_wall: `A WALL OF THE DEAD`, ev_pack: `THE PACK HUNTS`, ev_elite: `AN ELITE APPROACHES`, ev_ring_crow: `A MURDER OF CROWS`, ev_ring_shambler: `THE GRAVES OPEN`, ev_ring_banshee: `THE BANSHEES WAIL`, ev_wall_gravebound: `A WALL OF BONE`, ev_ring_leech: `THE WATER BOILS WITH LEECHES`, ev_wall_drowned: `THE DROWNED RISE`, ev_ring_bogslime: `THE BOG HEAVES`, ev_ring_wisp: `LIGHTS IN THE MARSH`, ev_ring_imp: `SPARKS ON THE WIND`, ev_pack_ashwolf: `THE PACK HUNTS`, ev_ring_husk: `THE BURNING DEAD`, ev_ring_frostbat: `FROZEN WINGS`, ev_wall_iceskel: `AN ARMY OF ICE`, ev_pack_snowwolf: `HOWLS ON THE PASS`, ev_ring_rime: `THE COLD WHISPERS`, ev_ring_gargoyle: `THE GARGOYLES WAKE`, ev_ring_hollow: `THE HOLLOW CONGREGATION`, ev_wall_hollow: `THE KING'S HOST`, ev_ring_specter: `SPECTRES OF THE NAVE`, ev_elite_headless: `THE HEADLESS KNIGHT RIDES`, ev_elite_sentinel: `A DROWNED SENTINEL WADES IN`, ev_elite_alpha: `THE ALPHA OF ASHWOOD`, ev_elite_frostknight: `A FROST KNIGHT DESCENDS`, ev_elite_moonknight: `A MOON KNIGHT DRAWS STEEL`, boss_colossus: `THE BONE COLOSSUS`, boss_bogmother: `THE BOG MOTHER`, boss_stag: `THE CHARRED STAG`, boss_wormhead: `THE RIMEWORM`, boss_king: `THE HOLLOW KING`, unlockedToast: `Unlocked: {x}`, notEnough: `Not enough embers`, bought: `{x} upgraded`, webgl_title: `WebGL is not available`, webgl_text: `Last Lantern needs a browser with WebGL. Try another browser or turn on hardware acceleration.`, hearthIntro: `Warm your hands and spend the embers you carried back. Upgrades last for every run.`, h_might: `Might`, hd_might: `+8% damage`, h_vitality: `Vitality`, hd_vitality: `+15 max health`, h_armor: `Iron Skin`, hd_armor: `\u22121 damage taken`, h_recovery: `Recovery`, hd_recovery: `+0.3 health per second`, h_swift: `Swiftness`, hd_swift: `+6% move speed`, h_reach: `Reach`, hd_reach: `+20% pickup range`, h_growth: `Growth`, hd_growth: `+5% experience`, h_greed: `Greed`, hd_greed: `+10% embers`, h_luck: `Fortune`, hd_luck: `+8% luck`, h_haste: `Haste`, hd_haste: `\u22124% cooldowns`, h_reroll: `Second Thoughts`, hd_reroll: `+1 reroll per run: swap all the offered cards for new ones`, h_banish: `Exorcism`, hd_banish: `+1 banish per run: shut an offered card out of the rest of the run`, h_revival: `Rekindle`, hd_revival: `Come back at half health (once per level, per run)`, masteryTitle: `Mastery`, masteryOf: `Each step adds more than strength.`, mastery1: `{a} hits 40% harder and recharges 10% faster.`, m_wren_2: `It leaves a ring of sunfire that burns whatever stands in it.`, m_wren_3: `A wider, fiercer flare that also heals you 10%.`, m_mira_2: `Where you roll from, a blast pulls the crowd in and hurts it.`, m_mira_3: `A bigger, harder blast, and twice the bolts, piercing further.`, m_oskar_2: `Sanctuary lasts a second longer and burns whatever presses on it.`, m_oskar_3: `It ends with a great toll that throws back and hurts everything near.`, m_sable_2: `You leave grasping earth behind you that slows the crowd.`, m_sable_3: `You burst out in a wider, harder blast that throws the crowd much further and stuns for longer.`, h_radiance: `Radiance`, hd_radiance: `+6% area`, h_headstart: `Head Start`, hd_headstart: `Start every run 2 levels higher`, h_legion: `Legion`, hd_legion: `+1 projectile for every weapon`, buy: `Upgrade \xB7 {n}`, maxed: `Maxed`, journalIntro: `Pages gathered along the way.`, jn_locked: `Light the beacon to read on.`, storyTab: `Story`, evoFrom: `{w} at max level + {p}`, bestiary: `Bestiary`, arsenal: `Arsenal`, story: { prologue: [`For a hundred nights the sun has not risen over Emberhollow.`, `The Hollow King took it \u2014 reached up from his cathedral on the moon-cliff and closed his hand around it \u2014 and without it, the dead walk.`, `The lamplighters kept the town's lanterns burning as long as there was oil. Now there is one lantern left, and it does not burn with oil. It burns with the last spark of the old sun.`, `Five beacons stand between the town and the cathedral. Light them, and the night goes back a step. Light them all, and you can take back the dawn.`], ending: `The sun rises over Emberhollow. You blow out your lantern. You won't need it now.` }, seen: `Met`, notSeen: `Not yet met`, hpUnit: `{n} HP`, homeName: `Emberhollow`, heroes: { wren: [`Wren`, `the Lamplighter`, `Sunflare`, `A burst of the old sun: hurts, stuns and hurls back everything near you.`, `+10% area`], mira: [`Mira`, `the Warden`, `Tumble`, `Roll through the crowd untouchable, loosing a ring of bolts as you rise.`, `Quick on her feet, but frail`], oskar: [`Brother Oskar`, `the Bellringer`, `Sanctuary`, `Three seconds of holy ground: nothing can hurt you, a quarter of your health returns, the crowd is thrown back.`, `+35 health, 1 armour, slow`], sable: [`Sable`, `the Gravedigger`, `Dig`, `Burrow under the earth, move fast and untouchable, and burst out in a blast that throws the crowd clear and stuns it.`, `+12% damage`] }, weapons: { flail: [`Lantern Flail`, `A burning arc toward the nearest monster. Lashes behind you too at level 3.`], crossbow: [`Warden's Crossbow`, `Bolts at the nearest monsters, piercing through.`], knives: [`Throwing Knives`, `A fan of knives the way you run.`], bell: [`Chapel Bell`, `Tolls around you: hurts and shoves back whatever comes close.`], spades: [`Grave Spades`, `Spades circle you and strike whatever they pass through.`], storm: [`Storm Call`, `Lightning finds monsters near you, and later chains between them.`], water: [`Holy Water`, `Flasks thrown into the crowd leave burning pools behind.`], hook: [`Grave Hook`, `Hooks a monster and hurls it into the rest of the crowd.`], sunflail: [`Sunflail`, `Evolved. Two blazing lashes that set the dead alight.`], dawnbreaker: [`Dawnbreaker`, `Evolved. Bolts of dawn pierce everything and burst where they end.`], edges: [`Thousand Edges`, `Evolved. An endless storm of knives in every direction.`], toll: [`Cathedral Toll`, `Evolved. A great ring; every fifth toll shakes the whole night.`], halo: [`Iron Halo`, `Evolved. Eight heavy spades that throw the dead aside.`], wrath: [`Wrath of Heaven`, `Evolved. Six strikes at once, each chaining three times.`], font: [`Font of Dawn`, `Evolved. Four wide, long-burning pools.`], reaper: [`Reaper's Chain`, `Evolved. Four monsters at a time, and they explode where they land.`], wisps: [`Will-o'-Wisp Lanterns`, `Little flames that curve after the nearest monster and burst where they strike.`], choir: [`Choir of Wisps`, `Evolved. Five wisps at a time; each bursts, then hunts another.`], sickle: [`Reaper's Sickle`, `Thrown at the nearest monster, it slows, turns and comes back, cutting through everything both ways.`], harvest: [`Harvest Moon`, `Evolved. Four great sickles in every direction.`], censer: [`Swinging Censer`, `A heavy censer on a chain swings round you and bowls the crowd over; from level 3 it trails slowing incense.`], thurible: [`Thurible of Dawn`, `Evolved. Two censers, a wider swing, and incense that burns.`], raven: [`Raven Familiar`, `A raven circles over you, dives at the strongest monster near and fetches far-off soul gems.`], unkindness: [`An Unkindness of Ravens`, `Evolved. Four ravens whose dives burst on impact.`] }, passives: { boots: [`Swift Boots`, `+8% move speed`], heart: [`Hollow Heart`, `+15 max health`], magnet: [`Lodestone`, `+30% pickup range`], tome: [`Dusty Tome`, `\u22127% cooldowns`], fist: [`Iron Fist`, `+10% damage`], plate: [`Grave Plate`, `\u22121 damage taken`], root: [`Mandrake Root`, `+0.3 health per second`], oil: [`Lamp Oil`, `+10% area`], clover: [`Four-leaf Clover`, `+10% luck and crits`], quiver: [`Deep Quiver`, `+1 projectile for every weapon`], chrism: [`Chrism Vial`, `+15% duration, +10% projectile speed`], feather: [`Raven Feather`, `+10% experience`] }, stages: { graveyard: [`Hollowmere`, `The old churchyard`, `The first beacon stands behind the ruined chapel of Hollowmere, in the churchyard where the town has buried its dead for four hundred years. Since the sun went out, none of them stay buried \u2014 and the crows came back with them. Keep the lantern burning until the Bone Colossus climbs out of the ossuary.`, `The Colossus falls apart into a heap of old bones, and the beacon catches. For the first time in a hundred nights, a light burns on the hill that is not yours. Far to the south, someone lights a candle in a window.`], mill: [`The Drowned Mill`, `The flooded valley`, `The river broke its banks the night the sun was stolen, and the mill has stood in black water ever since. Something breeds in the pools \u2014 something big. The second beacon waits on the mill's roof beam.`, `The Bog Mother sinks for the last time and does not come back up. The water stills. On the beacon's light the mill wheel starts turning again, slowly, for no one.`], ashwood: [`Ashwood`, `The burning forest`, `The Hollow King set fire to Ashwood so no one could cross it. It has been burning for a hundred nights without burning out. The third beacon is in a clearing at its heart, guarded by the stag that was once the forest's lord.`, `The Charred Stag kneels, and the fire in its antlers goes out. The trees keep smouldering, but the beacon burns brighter than all of them. You can see the mountains from here.`], pass: [`Frostfang Pass`, `The mountain road`, `The only road to the Moon Cathedral crosses Frostfang Pass. The cold here is the King's, not winter's. Under the ice something long is waiting, and it has not eaten since the sun went out.`, `The Rimeworm shatters like a frozen river in spring. The fourth beacon throws your shadow a mile down the mountain. Above, on the cliff, the cathedral's windows are watching you.`], cathedral: [`The Moon Cathedral`, `Where the sun is kept`, `The Hollow King keeps the sun in his cathedral on the moon-cliff, a cold white coal on the altar. The last beacon is the altar itself. Everything the night has left is here. So is he.`, `The Hollow King breaks like a mirror. On the altar the white coal takes your lantern's fire and turns gold, then too bright to look at. The cathedral roof falls away and the sky above Emberhollow goes pale, then blue. Morning. It has been a long time.`], vigil: [`The Keepers' Vigil`, `The moon cathedral, by blood-light`, `The sun is back, but the dead keep their own hours. In the moon cathedral the five keepers have risen again, out of the shadow the King left behind, to put it out once more. They come one after another, and each brings its own night with it.`, `The last keeper falls, and the cathedral is quiet in a way it has never been. The shadow on the altar thins and goes out. Somewhere below, in Emberhollow, a bell starts ringing for morning.`] }, relics: { martyr: [`Martyr's Candle`, `Below 30% health, a burst of the old sun heals you and scorches everything near. Once a minute.`], ravenskull: [`Raven Skull`, `A chest for every 150 monsters slain.`], bloodseal: [`Blood Moon Seal`, `+30% damage, but you take 20% more.`], pilgrim: [`Pilgrim's Staff`, `Stand still for a moment: +40% damage. On the move: +10% speed.`], hourglass: [`Cracked Hourglass`, `\u221225% cooldowns, \u221220% max health.`], saintsbone: [`Saint's Knucklebone`, `Come back once at half health.`], thorns: [`Thorned Shroud`, `Whatever touches you takes twice the damage back and is thrown off.`], mirror: [`Moon Mirror`, `Projectiles have a 25% chance to fire twice.`], wick: [`Everburning Wick`, `Your ability recharges 40% faster.`], souljar: [`Soul Jar`, `+30% experience and +50% pickup range.`], clapper: [`Cracked Bell Clapper`, `Every 8 seconds a toll rings out around you and throws the crowd back.`], reliquary: [`Reliquary of St. Ember`, `Every hit has a 15% chance to set the monster alight.`], keys: [`Sexton's Keys`, `Chests hold one more upgrade and 60% more embers.`], leechtooth: [`Leech Tooth`, `Every third kill heals you a little.`], stormglass: [`Storm Glass`, `Every 6 seconds lightning finds three monsters near you.`], ghostlamp: [`Ghost Lantern`, `A 15% chance to slip through a blow unharmed.`] }, monsters: { crow: `Carrion Crow`, shambler: `Shambler`, gravebound: `Gravebound`, archer: `Bone Archer`, digger: `Gravedigger Brute`, banshee: `Banshee`, headless: `Headless Knight`, colossus: `Bone Colossus`, leech: `Leech`, drowned: `Drowned`, toad: `Bile Toad`, bogslime: `Bog Slime`, bogling: `Bogling`, wisp: `Marsh Wisp`, mirebrute: `Mire Brute`, sentinel: `Drowned Sentinel`, bogmother: `The Bog Mother`, imp: `Cinder Imp`, ashwolf: `Ash Wolf`, husk: `Burning Husk`, caller: `Flame Caller`, treant: `Charred Treant`, cinder: `Ember Wisp`, alpha: `Alpha of Ashwood`, stag: `The Charred Stag`, frostbat: `Frost Bat`, iceskel: `Ice Skeleton`, snowwolf: `Snow Wolf`, shard: `Shard Slime`, shardling: `Shardling`, yeti: `Yeti`, rime: `Rime Wraith`, frostknight: `Frost Knight`, wormhead: `The Rimeworm`, bogwitch: `Bog Witch`, ashshaman: `Ash Shaman`, frostseer: `Frost Seer`, hollowpriest: `Hollow Priest`, gargoyle: `Gargoyle`, hollow: `Hollow Knight`, cultist: `Moon Cultist`, bellgolem: `Bell Golem`, specter: `Spectre`, moonknight: `Moon Knight`, king: `The Hollow King` }, monsterLore: { crow: `Carrion birds that followed the dead back up. They come in clouds and peck at whatever still has a light.`, shambler: `The town's own dead, slow and hungry. One is nothing; a churchyard of them is a wall.`, gravebound: `Soldiers buried with their shields, still keeping the old watch. Faster than they look.`, archer: `Hooded bones with a yew bow. They keep their distance and loose arrows at your lantern.`, digger: `The gravedigger who never stopped digging. Heavy enough to shrug off a blow and swing a spade back.`, banshee: `A wailing veil that drifts through stone and wall alike. Only you are solid to her.`, headless: `A knight who lost his head at the gate and carries it still. He winds up, then charges.`, colossus: `A giant stacked from the ossuary's bones. It slams the ground, charges, and calls the buried to it.`, leech: `Fat black leeches that boil out of the pools in dozens. Fast, and hungry for warmth.`, drowned: `Millers and ferrymen the flood took. Waterlogged and slow, but there are always more.`, toad: `A bloated toad that spits bile. From the mill on, its spittle bends after you.`, bogslime: `A heap of living bog. Split it and it becomes two smaller, quicker ones.`, bogling: `A splinter of bog slime, small and quick.`, wisp: `A marsh light that leads travellers into deep water. It drifts through anything.`, mirebrute: `Something big wearing the mire like a coat. Slow, hard to move, hits like a mill wheel.`, bogwitch: `She keeps to the back of the crowd and mends it with green light. Kill her first.`, sentinel: `The mill's old guard, drowned in his armour and still at his post. He charges like the knights do.`, bogmother: `The thing that breeds in the pools. She lobs mud that clings, calls her leeches, and sinks to rise beneath you.`, imp: `Sparks with teeth, born of the burning forest. They swoop in swarms.`, ashwolf: `Wolves of cinder that stalk in circles, crouch, and leap at where you will be.`, husk: `A body still burning from the inside. When it falls, it bursts \u2014 keep your distance.`, caller: `A cultist who throws fire that curves after you. Stays out of reach.`, treant: `An oak the fire could not kill, only char. Slow and very hard to stop.`, cinder: `An ember wisp that floats through trees and walls alike.`, ashshaman: `Chants over the pack and mends its burns. The wolves will not stay down while he lives.`, alpha: `The pack's leader, big as a bear. His lunges come faster and reach further.`, stag: `Once lord of the forest, now a torch with antlers. It charges again and again, leaving the ground on fire.`, frostbat: `Bats with frost on their wings, fast and many.`, iceskel: `Soldiers who froze on the pass and marched on. Tougher than the churchyard's dead.`, snowwolf: `White wolves that hunt in packs on the snow and lunge from the drifts.`, shard: `A crawling mass of ice that splits in two when broken.`, shardling: `A shard of the ice slime, small and quick.`, yeti: `A great white beast of the pass. Its fists shatter ice and bone.`, rime: `A wraith of frozen breath that passes through rock.`, frostseer: `A seer of the cold who knits the frozen dead back together.`, frostknight: `A knight in ice-bound plate. The cold has made him stronger, not slower.`, wormhead: `A worm longer than the road, its body a chain of frozen segments. It charges, and sheds shards of ice.`, gargoyle: `Stone guardians from the cathedral roof. They circle overhead, then dive.`, hollow: `Empty armour marching for the King. There is nothing inside but his will.`, cultist: `A priest of the moon whose light bends after you as it flies.`, bellgolem: `A walking bell of bronze and stone. Every step rings through the nave.`, specter: `The cathedral's dead, drifting through pews and pillars alike.`, hollowpriest: `His chant mends the empty armour a little and drives one of them on at a run. Kill him first.`, moonknight: `The King's own guard in moonlit steel. Their charges are the fastest of all.`, king: `He holds the stolen sun. He summons his host, draws his scythes, and in the end darkens the sky itself.` }, b_wrath: `THE KEEPER'S WRATH`, confirmNo: `Cancel`, confirmGiveUp: `Give up`, next: `Next`, changeHero: `Change lantern-bearer`, pedlar: `The Pedlar`, pedlarIntro: `A hooded pedlar sells what the road needs. Every ware is used up once you use it; the rest stays in your satchel for the next run.`, buyItem: `Buy \xB7 {n}`, satchelFull: `Satchel full`, inSatchel: `In your satchel: {n} / {max}`, boughtItem: `{x} bought`, h_items: `The Pedlar's wares`, p_items: `Buy tonics, wards and bombs from <b>the Pedlar</b> between runs. In a run they wait in your <b>satchel</b> over the health orb: press <b>1\u20137</b>, tap one, or pick one with the pad's <b>LB / RB</b> and use it with <b>X</b>.`, k_item: `Use an item from your satchel`, deeds: `Deeds`, deedCount: `{n} / {of}`, r_deed: `Deed: {x}`, deedToast: `Deed: {x} (+{n} embers)`, deedsToast: `{n} deeds done (+{e} embers)`, vigilTag: `The Vigil`, unlockVigil: `Light all five beacons to unlock`, vigilFact: `{n} keepers, one after another, each with its own night`, bestVigil: `Best: {n} / {of} keepers \xB7 {t}`, r_keepers: `Keepers slain`, b_vigil: `THE KEEPERS RETURN`, b_vigilNext: `{n} OF {of} KEEPERS FALLEN \u2014 THE NEXT ONE STIRS`, b_item_tonic_s: `A SIP OF TONIC`, b_item_tonic_m: `TONIC`, b_item_tonic_l: `GREAT TONIC`, b_item_ward: `WARDED`, b_item_draught: `SWIFT AS A HARE`, b_item_firebomb: `FIREBOMB`, b_item_lodestone: `LODESTONE`, h_pad: `Gamepad`, pad_active: `Use your ability`, pad_item: `Pick an item \xB7 use it`, pad_zoom: `Zoom (menus: scroll)`, pad_cards: `Level-up: reroll \xB7 banish \xB7 skip`, pad_menu: `Pause \xB7 back`, set_pad: `Controller`, pad_mapping: `Mapping`, pad_buttons: `Buttons`, pad_axes: `Axes`, pad_none: `No controller found. Press a button on it to wake it.`, padOn: `Controller connected`, padOff: `Controller disconnected`, items: { tonic_s: [`Small Tonic`, `Restores a quarter of your health.`], tonic_m: [`Tonic`, `Restores half of your health.`], tonic_l: [`Great Tonic`, `Restores all of your health.`], ward: [`Ward of St. Ember`, `Five seconds in which every blow turns aside.`], draught: [`Hare's Draught`, `+40% move speed for eight seconds.`], firebomb: [`Firebomb`, `A blast around you that throws the crowd back and sets it alight.`], lodestone: [`Lodestone Shard`, `Pulls every soul gem and ember on the field to you.`] }, deedText: { firstLight: [`First Light`, `Light a beacon.`], allBeacons: [`Dawnbringer`, `Light all five beacons.`], vigil: [`The Long Vigil`, `Outlast all five keepers in the Keepers' Vigil.`], bloodMoon: [`Blood on the Moon`, `Light a beacon under the Blood Moon.`], bloodAll: [`Crimson Dawn`, `Light all five beacons under the Blood Moon.`], win_wren: [`The Lamplighter's Way`, `Light a beacon as Wren.`], win_mira: [`The Warden's Way`, `Light a beacon as Mira.`], win_oskar: [`The Bellringer's Way`, `Light a beacon as Brother Oskar.`], win_sable: [`The Gravedigger's Way`, `Light a beacon as Sable.`], kills1000: [`A Thousand Dead`, `Slay 1,000 monsters in one run.`], kills2500: [`Tide Breaker`, `Slay 2,500 monsters in one run.`], slayer: [`Slayer`, `Slay 10,000 monsters in total.`], legend: [`Legend of Emberhollow`, `Slay 50,000 monsters in total.`], level40: [`Kindled`, `Reach level 40 in one run.`], evolve: [`Reforged`, `Evolve a weapon.`], evolve3: [`Arsenal of Dawn`, `Carry three evolved weapons in one run.`], relics2: [`Pilgrim's Burden`, `Carry two relics in one run.`], swiftKeeper: [`Swift Judgement`, `Slay a keeper within 30 seconds of its coming.`], unbowed: [`Unbowed`, `Light a beacon taking less than 100 damage.`], hearthMax: [`Well Tended`, `Raise one of the Hearth's upgrades to its highest.`], mastery: [`Master of the Craft`, `Learn all three steps of a mastery.`], pedlar: [`The Pedlar's Friend`, `Use 10 of the Pedlar's wares.`], runs25: [`The Lantern Never Sleeps`, `Set out 25 times.`], relicHunter: [`Relic Hunter`, `Find 8 different relics.`], allRelics: [`Keeper of Relics`, `Find every relic.`], bestiary: [`The Whole Night`, `Meet every monster in the bestiary.`] } };
function O(e3?: any, t2?: any): any {
    let n2: any = _t(e3);
    n2 === void 0 && e3.startsWith(`ev_`) && (n2 = _t(e3.split(`_`).slice(0, 2).join(`_`)));
    let r2: any = typeof n2 == `string` ? n2 : e3;
    if (t2)
        for (let e4 of Object.keys(t2))
            r2 = r2.split(`{${e4}}`).join(String(t2[e4]));
    return r2;
}
var yt: any = (e3?: any, t2?: any) => {
    let n2: any = vt(e3, t2) ?? [t2, ``];
    return { name: n2[0], desc: n2[1] };
};
function bt(e3?: any): any {
    let t2: any = vt(`heroes`, e3) ?? [e3, ``, ``, ``, ``];
    return { name: t2[0], epithet: t2[1], active: t2[2], activeDesc: t2[3], trait: t2[4] };
}
var xt: any = (e3?: any) => yt(`weapons`, e3);
var St: any = (e3?: any) => yt(`passives`, e3);
var Ct: any = (e3?: any) => yt(`relics`, e3);
var wt: any = (e3?: any) => yt(`items`, e3);
var Tt: any = (e3?: any) => yt(`deedText`, e3);
function Et(e3?: any): any {
    let t2: any = vt(`stages`, e3) ?? [e3, ``, ``, ``];
    return { name: t2[0], place: t2[1], intro: t2[2], outro: t2[3] };
}
var Dt: any = (e3?: any) => vt(`monsters`, e3) ?? e3;
var Ot: any = (e3?: any) => vt(`monsterLore`, e3) ?? ``;
var kt: any = () => gt().story ?? Ye.story;
var At: any = [{ id: `wren`, weapon: `flail`, active: `flare`, hp: 100, speed: 175, armor: 0, might: 1, area: 1.1, color: 9051690, trim: 16765286, unlock: null }, { id: `mira`, weapon: `crossbow`, active: `tumble`, hp: 85, speed: 192, armor: 0, might: 1, area: 1, color: 3103290, trim: 13214554, unlock: { stage: 0 } }, { id: `oskar`, weapon: `bell`, active: `sanctuary`, hp: 135, speed: 164, armor: 1, might: 1.08, area: 1, color: 4864618, trim: 14729328, unlock: { stage: 1 } }, { id: `sable`, weapon: `spades`, active: `dig`, hp: 100, speed: 176, armor: 0, might: 1.12, area: 1, color: 3813936, trim: 10531008, unlock: { stage: 2 } }];
var jt: any = { flare: { cd: 14 }, tumble: { cd: 4.5 }, sanctuary: { cd: 24 }, dig: { cd: 9 } };
var Mt: any = [{ id: `might`, max: 10, cost: 60 }, { id: `vitality`, max: 10, cost: 50 }, { id: `armor`, max: 5, cost: 120 }, { id: `recovery`, max: 8, cost: 70 }, { id: `swift`, max: 5, cost: 80 }, { id: `radiance`, max: 5, cost: 90 }, { id: `haste`, max: 6, cost: 150 }, { id: `reach`, max: 5, cost: 50 }, { id: `growth`, max: 8, cost: 90 }, { id: `headstart`, max: 3, cost: 220 }, { id: `greed`, max: 8, cost: 70 }, { id: `luck`, max: 5, cost: 100 }, { id: `legion`, max: 1, cost: 1200 }, { id: `reroll`, max: 5, cost: 120 }, { id: `banish`, max: 5, cost: 120 }, { id: `revival`, max: 2, cost: 600 }, { id: `m_wren`, max: 3, cost: 250, hero: `wren` }, { id: `m_mira`, max: 3, cost: 250, hero: `mira` }, { id: `m_oskar`, max: 3, cost: 250, hero: `oskar` }, { id: `m_sable`, max: 3, cost: 250, hero: `sable` }];
var Nt: any = (e3?: any, t2?: any) => Math.round(e3.cost * (1 + t2 * 0.9));
var Pt: any = [{ id: `tonic_s`, cost: 40, heal: 0.25, color: `#ff7b72` }, { id: `tonic_m`, cost: 90, heal: 0.5, color: `#ff5a48` }, { id: `tonic_l`, cost: 170, heal: 1, color: `#e0302a` }, { id: `ward`, cost: 120, dur: 5, color: `#9fd8ff` }, { id: `draught`, cost: 70, dur: 8, color: `#7ee787` }, { id: `firebomb`, cost: 110, color: `#ffb347` }, { id: `lodestone`, cost: 50, color: `#79c0ff` }];
var Ft: any = Pt.map((e3?: any) => e3.id);
var It: any = 0.6;
var Lt: any = [{ id: `graveyard`, world: [2600, 1800], bossAt: 300, boss: `colossus`, hpMul: 1.4, dmgMul: 1.3, rate: 1.15, mix: [[`crow`, 0, 5, 2], [`shambler`, 0, 5, 4], [`gravebound`, 40, 3, 5], [`archer`, 90, 1.2, 1.6], [`digger`, 130, 0.5, 1.1], [`banshee`, 180, 0.8, 1.5]], events: [[60, `ring`, `crow`, 36], [105, `elite`, `headless`, 1], [150, `ring`, `shambler`, 44], [210, `elite`, `headless`, 1], [240, `wall`, `gravebound`, 40], [275, `ring`, `banshee`, 24]], look: `churchyard` }, { id: `mill`, world: [2800, 1900], bossAt: 330, boss: `bogmother`, hpMul: 1.9, dmgMul: 1.55, rate: 1.2, mix: [[`leech`, 0, 6, 3], [`drowned`, 0, 5, 4], [`toad`, 60, 1.2, 1.8], [`bogslime`, 100, 1, 1.6], [`wisp`, 150, 0.8, 1.4], [`mirebrute`, 200, 0.3, 0.6], [`bogwitch`, 70, 0.5, 0.9]], events: [[55, `ring`, `leech`, 48], [110, `elite`, `sentinel`, 1], [160, `wall`, `drowned`, 40], [215, `elite`, `sentinel`, 1], [250, `ring`, `bogslime`, 20], [300, `ring`, `wisp`, 28]], ground: `mud`, look: `mill` }, { id: `ashwood`, world: [2800, 2e3], bossAt: 360, boss: `stag`, hpMul: 2.25, dmgMul: 1.49, rate: 1.25, mix: [[`imp`, 0, 5, 3], [`ashwolf`, 0, 3, 4], [`husk`, 45, 2, 3], [`caller`, 100, 1.2, 1.8], [`treant`, 150, 0.5, 1.1], [`cinder`, 200, 0.8, 1.5], [`ashshaman`, 60, 0.5, 0.9]], events: [[60, `ring`, `imp`, 40], [120, `elite`, `alpha`, 1], [170, `pack`, `ashwolf`, 16], [230, `elite`, `alpha`, 1], [270, `ring`, `husk`, 30], [320, `pack`, `ashwolf`, 24]], ground: `ash`, look: `ashwood` }, { id: `pass`, world: [2600, 2200], bossAt: 390, boss: `wormhead`, hpMul: 3.1, dmgMul: 1.95, rate: 1.3, mix: [[`frostbat`, 0, 5, 2], [`iceskel`, 0, 5, 4], [`snowwolf`, 50, 2, 3.5], [`shard`, 100, 1, 1.6], [`yeti`, 150, 0.5, 1.1], [`rime`, 200, 0.8, 1.6], [`frostseer`, 60, 0.6, 1]], events: [[60, `ring`, `frostbat`, 44], [120, `elite`, `frostknight`, 1], [180, `wall`, `iceskel`, 44], [240, `elite`, `frostknight`, 1], [280, `pack`, `snowwolf`, 22], [340, `ring`, `rime`, 30]], ground: `ice`, look: `pass` }, { id: `cathedral`, world: [2400, 2400], bossAt: 450, boss: `king`, hpMul: 3.8, dmgMul: 2.15, rate: 1.35, mix: [[`gargoyle`, 0, 4, 3], [`hollow`, 0, 5, 4], [`cultist`, 60, 1.2, 1.8], [`specter`, 120, 0.8, 1.6], [`bellgolem`, 160, 0.5, 1.1], [`gravebound`, 0, 2, 2], [`hollowpriest`, 50, 0.6, 1.1]], events: [[60, `ring`, `gargoyle`, 40], [110, `elite`, `moonknight`, 1], [170, `ring`, `hollow`, 50], [230, `elite`, `headless`, 2], [290, `wall`, `hollow`, 48], [340, `elite`, `moonknight`, 1], [390, `ring`, `specter`, 36]], look: `cathedral` }, { id: `vigil`, world: [2400, 2400], bossAt: 6, rush: [[`colossus`, 1.4, 1.3], [`bogmother`, 1.9, 1.55], [`stag`, 2.25, 1.49], [`wormhead`, 3.1, 1.95], [`king`, 3.8, 2.15]], gap: 8, keeperHp: 3, hordeRate: 0.6, boost: 24, clearBonus: 500, hpMul: 1.4, dmgMul: 1.3, rate: 1, mix: [], events: [], horde: [`hollow`, `gravebound`, `specter`, `drowned`, `iceskel`], hordeLead: `king`, look: `cathedral`, mood: { fog: 1574920, fogD: 5e-4, amb: 4858928, ambI: 2, hemiSky: 10508906, hemiGnd: 1970196, moon: 16758952, moonI: 1.5, outer: 2232340, bloom: 0.8 } }].map((e3?: any, t2?: any) => ({ ...e3, index: t2 }));
var Rt: any = { hp: 1.6, dmg: 1.25, rate: 1.35, embers: 1.75 };
var zt: any = [`flail`, `crossbow`, `knives`, `bell`, `spades`, `storm`, `water`, `hook`, `wisps`, `sickle`, `censer`, `raven`];
var Bt: any = { flail: { color: `#ffd166`, evo: `oil`, into: `sunflail` }, crossbow: { color: `#79c0ff`, evo: `tome`, into: `dawnbreaker` }, knives: { color: `#c9d1d9`, evo: `boots`, into: `edges` }, bell: { color: `#e0c070`, evo: `heart`, into: `toll` }, spades: { color: `#a0b0c0`, evo: `plate`, into: `halo` }, storm: { color: `#ffe066`, evo: `clover`, into: `wrath`, unlock: { stage: 0 } }, water: { color: `#7ad8ff`, evo: `root`, into: `font`, unlock: { level: 25 } }, hook: { color: `#d2a8ff`, evo: `fist`, into: `reaper`, unlock: { kills: 2500 } }, wisps: { color: `#ffb86a`, evo: `chrism`, into: `choir` }, sickle: { color: `#d8e0e8`, evo: `quiver`, into: `harvest` }, censer: { color: `#c9a35a`, evo: `magnet`, into: `thurible`, unlock: { stage: 0 } }, raven: { color: `#8a8aa8`, evo: `feather`, into: `unkindness`, unlock: { level: 15 } }, sunflail: { color: `#ffb347`, evolved: true }, dawnbreaker: { color: `#bfe3ff`, evolved: true }, edges: { color: `#ffffff`, evolved: true }, toll: { color: `#ffe9a8`, evolved: true }, halo: { color: `#dfe8f0`, evolved: true }, wrath: { color: `#fff3a0`, evolved: true }, font: { color: `#b8f0ff`, evolved: true }, reaper: { color: `#e8c8ff`, evolved: true }, choir: { color: `#ffd8a0`, evolved: true }, harvest: { color: `#ffffff`, evolved: true }, thurible: { color: `#ffe0a0`, evolved: true }, unkindness: { color: `#b8b8e0`, evolved: true } };
var Vt: any = [`boots`, `heart`, `magnet`, `tome`, `fist`, `plate`, `root`, `oil`, `clover`, `quiver`, `chrism`, `feather`];
var Ht: any = (e3?: any) => e3 === `quiver` ? 2 : 5;
var Ut: any = [`martyr`, `ravenskull`, `bloodseal`, `pilgrim`, `hourglass`, `saintsbone`, `thorns`, `mirror`, `wick`, `souljar`, `clapper`, `reliquary`, `keys`, `leechtooth`, `stormglass`, `ghostlamp`];
var Wt: any = (e3?: any) => zt.find((t2?: any) => Bt[t2].into === e3);
var Gt: any = `endless-night.progress.v1`;
var qt: any = { master: 0.8, sfx: 0.85, music: 0.55, quality: `high`, numbers: true, shake: true, calm: false, safetySeen: false, hero: `wren`, stage: 0, blood: false };
var Jt: any = () => ({ embers: 0, hearth: {}, cleared: [], clearedBlood: [], best: [], totalKills: 0, maxLevel: 0, runs: 0, seenMonsters: [], seenWeapons: [], seenRelics: [], storyRead: 0, heroWins: {}, items: {}, itemsUsed: 0, ach: {} });
var en: any = (e3?: any) => Xt(Gt, e3);
function nn(e3?: any, t2?: any): any {
    return t2 ? t2.stage === void 0 ? t2.level === void 0 ? t2.kills === void 0 || e3.totalKills >= t2.kills : e3.maxLevel >= t2.level : !!e3.cleared[t2.stage] : true;
}
var rn: any = (e3?: any, t2?: any) => nn(e3, t2.unlock);
function an(e3?: any, t2?: any): any {
    return Lt[t2]?.rush ? Lt.slice(0, 5).every((t3?: any, n2?: any) => e3.cleared[n2]) : t2 === 0 || !!e3.cleared[t2 - 1];
}
var on: any = (e3?: any) => new Set(zt.filter((t2?: any) => nn(e3, Bt[t2].unlock)));
function sn(e3?: any, t2?: any): any {
    let n2: any = { heroes: At.filter((t3?: any) => rn(e3, t3)).map((e4?: any) => e4.id), weapons: [...Array.from<any>(on(e3))], stages: Lt.filter((t3?: any, n3?: any) => an(e3, n3)).map((e4?: any) => e4.id) };
    e3.runs++, e3.embers += t2.embers, e3.totalKills += t2.kills, e3.maxLevel = Math.max(e3.maxLevel, t2.level), t2.won && (t2.blood && (e3.clearedBlood[t2.stage] = true), e3.cleared[t2.stage] = true, e3.heroWins ??= {}, e3.heroWins[t2.hero] = (e3.heroWins[t2.hero] || 0) + 1);
    let r2: any = e3.best[t2.stage], i2: any = (t2.keepers || 0) - (r2?.keepers || 0);
    (!r2 || t2.won && !r2.won || t2.won === !!r2.won && (i2 > 0 || i2 === 0 && t2.time > r2.time)) && (e3.best[t2.stage] = { time: Math.round(t2.time), kills: t2.kills, won: t2.won, keepers: t2.keepers || 0 });
    for (let n3 of t2.monstersSeen)
        e3.seenMonsters.includes(n3) || e3.seenMonsters.push(n3);
    for (let n3 of t2.weaponsSeen)
        e3.seenWeapons.includes(n3) || e3.seenWeapons.push(n3);
    e3.seenRelics ??= [];
    for (let n3 of t2.relicsSeen)
        e3.seenRelics.includes(n3) || e3.seenRelics.push(n3);
    en(e3);
    let a2: any = [];
    for (let t3 of At)
        rn(e3, t3) && !n2.heroes.includes(t3.id) && a2.push({ kind: `hero`, id: t3.id });
    for (let t3 of on(e3))
        n2.weapons.includes(t3) || a2.push({ kind: `weapon`, id: t3 });
    return Lt.forEach((t3?: any, r3?: any) => {
        an(e3, r3) && !n2.stages.includes(t3.id) && a2.push({ kind: `stage`, id: t3.id });
    }), a2;
}
function cn(e3?: any, t2?: any): any {
    Ft.includes(t2) && (e3.items[t2] ?? 0) > 0 && (e3.items[t2] = (e3.items[t2] ?? 0) - 1, e3.itemsUsed = (e3.itemsUsed || 0) + 1, en(e3));
}
var k: any = 1 / 60;
var j: any = (e3?: any, t2?: any, n2?: any) => e3 < t2 ? t2 : e3 > n2 ? n2 : e3;
var ln: any = (e3?: any, t2?: any, n2?: any) => e3 + (t2 - e3) * n2;
var M: any = (e3?: any, t2?: any) => Math.hypot(e3, t2) || 1e-6;
var un: any = (e3?: any) => Math.atan2(Math.sin(e3), Math.cos(e3));
function dn(e3?: any): any {
    let t2: any = e3 >>> 0;
    return () => {
        t2 = t2 + 1831565813 >>> 0;
        let e4: any = t2;
        return e4 = Math.imul(e4 ^ e4 >>> 15, e4 | 1), e4 ^= e4 + Math.imul(e4 ^ e4 >>> 7, e4 | 61), ((e4 ^ e4 >>> 14) >>> 0) / 4294967296;
    };
}
var pn: any = (e3?: any) => Math.floor(5 + e3 * 4 + e3 * e3 * 0.45);
var gn: any = (e3?: any) => parseInt(e3.slice(1, 7), 16);
var bn: any = 1;
var xn: any = 2;
var Sn: any = 4;
var Cn: any = 8;
var wn: any = 16;
var Tn: any = 32;
var En: any = 64;
var Dn: any = (e3?: any, t2?: any) => (e3 << 16 | t2) >>> 0;
var On: any = { static: Dn(bn, 65535), prop: Dn(Cn, 127), hero: Dn(xn, 77), heroDig: Dn(xn, bn), mon: Dn(Sn, 127), ghost: Dn(Sn, xn), worm: Dn(En, 30), thrown: Dn(wn, 77), censer: Dn(Tn, 76), none: 0 };
var kn: any = { x: 0, y: 0 };
var An: any = class {
    [key: string]: any;
    phys: any;
    rb: any;
    col: any;
    x: any;
    y: any;
    vx: any = 0;
    vy: any = 0;
    rot: any;
    dynamic: any;
    removed: any = false;
    constructor(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any) {
        this.phys = e3, this.rb = t2, this.col = n2, this.x = r2, this.y = i2, this.rot = a2, this.dynamic = t2.isDynamic();
    }
    get mass() {
        return this.rb.mass();
    }
    setVel(e3?: any, t2?: any): any {
        this.vx = e3, this.vy = t2, !this.removed && (kn.x = e3, kn.y = t2, this.rb.setLinvel(kn, true));
    }
    addVel(e3?: any, t2?: any): any {
        this.setVel(this.vx + e3, this.vy + t2);
    }
    setPos(e3?: any, t2?: any): any {
        this.x = e3, this.y = t2, !this.removed && (kn.x = e3, kn.y = t2, this.rb.setTranslation(kn, true));
    }
    get angVel() {
        return this.removed ? 0 : this.rb.angvel();
    }
    set angVel(e3: any) {
        this.removed || this.rb.setAngvel(e3, true);
    }
    setGroups(e3?: any): any {
        this.removed || this.col.setCollisionGroups(e3);
    }
    setEvents(e3?: any): any {
        this.removed || this.col.setActiveEvents(e3 ? _n.ActiveEvents.COLLISION_EVENTS : _n.ActiveEvents.NONE);
    }
    remove(): any {
        this.removed || (this.removed = true, this.phys.removeBody(this));
    }
};
var jn: any = class {
    [key: string]: any;
    world: any;
    queue: any;
    dynamics: any = new Set();
    owners: any = new Map();
    constructor() {
        this.world = new _n.World({ x: 0, y: 0 }), this.world.timestep = k, this.world.lengthUnit = 20, this.world.numSolverIterations = 4, this.queue = new _n.EventQueue(true);
    }
    make(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any): any {
        e3.setTranslation(n2, r2), i2.rotation && e3.setRotation(i2.rotation), i2.lockRotation && e3.lockRotations();
        let o2: any = this.world.createRigidBody(e3);
        t2.setDensity(i2.density ?? 1).setFriction(i2.friction ?? 0.3).setRestitution(i2.restitution ?? 0).setCollisionGroups(i2.groups ?? On.mon);
        let s2: any = this.world.createCollider(t2, o2), c2: any = new An(this, o2, s2, n2, r2, i2.rotation ?? 0);
        return c2.dynamic && this.dynamics.add(c2), a2 !== void 0 && this.owners.set(s2.handle, a2), c2;
    }
    circle(e3?: any, t2?: any, n2?: any, r2: any = {}, i2?: any): any {
        let a2: any = r2.kind === `fixed` ? _n.RigidBodyDesc.fixed() : _n.RigidBodyDesc.dynamic();
        return this.make(a2, _n.ColliderDesc.ball(n2), e3, t2, r2, i2);
    }
    box(e3?: any, t2?: any, n2?: any, r2?: any, i2: any = {}, a2?: any): any {
        let o2: any = i2.kind === `fixed` ? _n.RigidBodyDesc.fixed() : _n.RigidBodyDesc.dynamic();
        return this.make(o2, _n.ColliderDesc.cuboid(n2 / 2, r2 / 2), e3, t2, i2, a2);
    }
    setOwner(e3?: any, t2?: any): any {
        this.owners.set(e3.col.handle, t2);
    }
    removeBody(e3?: any): any {
        this.dynamics.delete(e3), this.owners.delete(e3.col.handle), this.world.removeRigidBody(e3.rb);
    }
    step(): any {
        this.world.step(this.queue);
        for (let e3 of this.dynamics) {
            let t2: any = e3.rb.translation(), n2: any = e3.rb.linvel();
            e3.x = t2.x, e3.y = t2.y, e3.vx = n2.x, e3.vy = n2.y, e3.rot = e3.rb.rotation();
        }
    }
    drainStarts(e3?: any): any {
        this.queue.drainCollisionEvents((t2?: any, n2?: any, r2?: any) => {
            if (!r2)
                return;
            let i2: any = this.owners.get(t2), a2: any = this.owners.get(n2);
            i2 !== void 0 && a2 !== void 0 && e3(i2, a2);
        });
    }
    disposed: any = false;
    dispose(): any {
        this.disposed || (this.disposed = true, this.dynamics.clear(), this.owners.clear(), this.queue.free(), this.world.free());
    }
};
var tr: any = { "#f85149": `#ff7aa8`, "#ff6b6b": `#ff8fb8`, "#ff6b4a": `#ff9a86`, "#ff9a5a": `#ffb37a`, "#ff9a4a": `#ffb37a`, "#ff7b72": `#ff9aa8`, "#ffd166": `#ffd97a`, "#ffe066": `#ffe38a`, "#7ee787": `#8ff0c8`, "#9aff7a": `#a8f5c8`, "#c8a0ff": `#cdb8ff`, "#d2a8ff": `#d8c4ff`, "#e0302a": `#ff6f9f` };
var nr: any = new Map();
function rr(e3?: any): any {
    let t2: any = nr.get(e3);
    if (t2)
        return t2;
    let n2: any = tr[e3.toLowerCase()];
    if (!n2) {
        let t3: any = /^#([0-9a-f]{6})$/i.exec(e3);
        if (t3) {
            let e4: any = parseInt(t3[1], 16), r2: any = (e5?: any, t4?: any) => Math.round(e5 + (t4 - e5) * 0.18);
            n2 = `rgb(${r2(e4 >> 16 & 255, 255)},${r2(e4 >> 8 & 255, 246)},${r2(e4 & 255, 232)})`;
        }
        else
            n2 = e3;
    }
    return nr.set(e3, n2), n2;
}
var xr: any = (e3?: any) => Lt.slice(0, 5).every((t2?: any, n2?: any) => e3[n2]);
var Sr: any = [...Array.from<any>(new Set(Lt.flatMap((e3?: any) => [...Array.from<any>(e3.mix.map((e4?: any) => e4[0])), ...Array.from<any>(e3.events.map((e4?: any) => e4[2])), e3.boss].filter((e4?: any) => !!e4))))];
var Cr: any = [{ id: `firstLight`, icon: `flare`, reward: 50, test: (e3?: any) => e3.cleared.some(Boolean) }, { id: `allBeacons`, icon: `beacon`, reward: 300, test: (e3?: any) => xr(e3.cleared), prog: (e3?: any) => [e3.cleared.slice(0, 5).filter(Boolean).length, 5] }, { id: `vigil`, icon: `crown`, reward: 600, test: (e3?: any) => !!e3.cleared[5] }, { id: `bloodMoon`, icon: `bloodmoon`, reward: 150, test: (e3?: any) => e3.clearedBlood.some(Boolean) }, { id: `bloodAll`, icon: `bloodmoon`, reward: 800, test: (e3?: any) => xr(e3.clearedBlood), prog: (e3?: any) => [e3.clearedBlood.slice(0, 5).filter(Boolean).length, 5] }, ...Array.from<any>(At.map((e3?: any) => ({ id: `win_${e3.id}`, icon: e3.active, reward: 100, test: (t2?: any) => (t2.heroWins?.[e3.id] || 0) > 0 }))), { id: `kills1000`, icon: `skull`, reward: 100, run: (e3?: any) => e3.kills >= 1e3 }, { id: `kills2500`, icon: `skull`, reward: 250, run: (e3?: any) => e3.kills >= 2500 }, { id: `slayer`, icon: `banish`, reward: 200, test: (e3?: any) => e3.totalKills >= 1e4, prog: (e3?: any) => [e3.totalKills, 1e4] }, { id: `legend`, icon: `banish`, reward: 500, test: (e3?: any) => e3.totalKills >= 5e4, prog: (e3?: any) => [e3.totalKills, 5e4] }, { id: `level40`, icon: `growth`, reward: 150, run: (e3?: any) => e3.level >= 40 }, { id: `evolve`, icon: `sunflail`, reward: 100, run: (e3?: any) => e3.evolved.length >= 1 }, { id: `evolve3`, icon: `toll`, reward: 300, run: (e3?: any) => e3.evolved.length >= 3 }, { id: `relics2`, icon: `reliquary`, reward: 100, run: (e3?: any) => e3.relics.length >= 2 }, { id: `swiftKeeper`, icon: `haste`, reward: 200, run: (e3?: any) => !!e3.fastKeeper }, { id: `unbowed`, icon: `plate`, reward: 250, run: (e3?: any) => e3.won && e3.damageTaken < 100 }, { id: `hearthMax`, icon: `ember`, reward: 100, test: (e3?: any) => Mt.some((t2?: any) => !t2.hero && (e3.hearth[t2.id] || 0) >= t2.max) }, { id: `mastery`, icon: `tome`, reward: 150, test: (e3?: any) => Mt.some((t2?: any) => t2.hero && (e3.hearth[t2.id] || 0) >= t2.max) }, { id: `pedlar`, icon: `satchel`, reward: 100, test: (e3?: any) => (e3.itemsUsed || 0) >= 10, prog: (e3?: any) => [e3.itemsUsed || 0, 10] }, { id: `runs25`, icon: `revival`, reward: 100, test: (e3?: any) => e3.runs >= 25, prog: (e3?: any) => [e3.runs, 25] }, { id: `relicHunter`, icon: `keys`, reward: 200, test: (e3?: any) => (e3.seenRelics || []).length >= 8, prog: (e3?: any) => [(e3.seenRelics || []).length, 8] }, { id: `allRelics`, icon: `saintsbone`, reward: 400, test: (e3?: any) => (e3.seenRelics || []).length >= Ut.length, prog: (e3?: any) => [(e3.seenRelics || []).length, Ut.length] }, { id: `bestiary`, icon: `raven`, reward: 200, test: (e3?: any) => Sr.every((t2?: any) => e3.seenMonsters.includes(t2)), prog: (e3?: any) => [Sr.filter((t2?: any) => e3.seenMonsters.includes(t2)).length, Sr.length] }];
function wr(e3?: any, t2: any = null): any {
    e3.ach ??= {};
    let n2: any = [];
    for (let r2 of Cr)
        e3.ach[r2.id] || (t2 && r2.run?.(t2) || r2.test?.(e3)) && (e3.ach[r2.id] = Date.now(), e3.embers += r2.reward, n2.push(r2));
    return n2.length && en(e3), n2;
}
var ma: any = (e3?: any) => e3 >= 30 ? 3 : e3 >= 8 ? 2 : +(e3 >= 3);
var qa: any = Object.fromEntries(Object.entries({ crow: { r: 8, hp: 6, speed: 138, dmg: 3, xp: 1, mass: 0.6, ai: `swoop`, rig: `crow`, c: 1973286, c2: 3814992, fly: 26 }, shambler: { r: 12, hp: 18, speed: 60, dmg: 5, xp: 1, mass: 1, ai: `chase`, rig: `shambler`, c: 8030826, c2: 4864558 }, gravebound: { r: 11, hp: 28, speed: 92, dmg: 6, xp: 1, mass: 1.1, ai: `chase`, rig: `gravebound`, c: 13156006, c2: 6969928, heavy: false, shield: true }, archer: { r: 11, hp: 30, speed: 74, dmg: 4, xp: 3, mass: 1, ai: `ranged`, rig: `archer`, c: 12629662, c2: 3820074, spit: { dmg: 6, speed: 240, color: 15261896, arrow: true }, cap: 16 }, digger: { r: 22, hp: 170, speed: 48, dmg: 13, xp: 4, mass: 4, ai: `chase`, rig: `digger`, c: 9075306, c2: 3812904, heavy: true, cap: 9 }, banshee: { r: 10, hp: 40, speed: 116, dmg: 7, xp: 3, mass: 0.8, ai: `chase`, rig: `banshee`, c: 13625072, c2: 6982312, ghost: true, fly: 10 }, headless: { r: 20, hp: 1e3, speed: 88, dmg: 15, xp: 12, mass: 6, ai: `charger`, rig: `headless`, c: 4869726, c2: 2763316, c3: 16742954, elite: true }, colossus: { r: 42, hp: 8500, speed: 56, dmg: 24, xp: 40, mass: 40, ai: `colossus`, rig: `colossus`, c: 12102804, c2: 9075290, boss: true }, leech: { r: 7, hp: 7, speed: 128, dmg: 3, xp: 1, mass: 0.5, ai: `wiggle`, rig: `leech`, c: 7027274, c2: 3808296 }, drowned: { r: 12, hp: 24, speed: 64, dmg: 5, xp: 1, mass: 1.1, ai: `chase`, rig: `ghoul`, c: 7311242, c2: 4151896 }, toad: { r: 13, hp: 38, speed: 70, dmg: 5, xp: 3, mass: 1.3, ai: `ranged`, rig: `toad`, c: 8034874, c2: 4876830, spit: { dmg: 7, speed: 205, color: 10473290, home: 9e-3, life: 120 }, cap: 16 }, bogslime: { r: 15, hp: 60, speed: 58, dmg: 6, xp: 2, mass: 1.6, ai: `chase`, rig: `slime`, c: 5212762, c2: 3103290, split: `bogling` }, bogling: { r: 8, hp: 14, speed: 96, dmg: 3, xp: 1, mass: 0.7, ai: `chase`, rig: `slime`, c: 7318138, c2: 4160074 }, wisp: { r: 9, hp: 36, speed: 120, dmg: 6, xp: 3, mass: 0.7, ai: `swoop`, rig: `wisp`, c: 10481856, c2: 4173952, ghost: true, fly: 14 }, mirebrute: { r: 23, hp: 190, speed: 46, dmg: 14, xp: 4, mass: 4.5, ai: `chase`, rig: `brute`, c: 5925450, c2: 3820074, heavy: true, cap: 7 }, bogwitch: { r: 12, hp: 35, speed: 64, dmg: 5, xp: 4, mass: 1.2, ai: `healer`, rig: `witch`, c: 3820082, c2: 5925434, c3: 10157946, heal: 0.07, healCd: 300, healR: 130, cap: 4 }, sentinel: { r: 20, hp: 950, speed: 86, dmg: 16, xp: 12, mass: 6, ai: `charger`, rig: `knight`, c: 6261382, c2: 3824216, c3: 10473290, elite: true }, bogmother: { r: 46, hp: 6400, speed: 58, dmg: 24, xp: 40, mass: 45, ai: `bogmother`, rig: `bogmother`, c: 5204538, c2: 7027274, boss: true }, imp: { r: 8, hp: 10, speed: 140, dmg: 4, xp: 1, mass: 0.6, ai: `swoop`, rig: `imp`, c: 16742970, c2: 9054736, fly: 20 }, ashwolf: { r: 12, hp: 28, speed: 92, dmg: 6, xp: 2, mass: 1.2, ai: `lunge`, rig: `wolf`, c: 5919312, c2: 16747066 }, husk: { r: 12, hp: 28, speed: 70, dmg: 5, xp: 2, mass: 1, ai: `chase`, rig: `husk`, c: 5915192, c2: 16738848, explode: { r: 70, dmg: 14 } }, caller: { r: 12, hp: 44, speed: 70, dmg: 5, xp: 3, mass: 1.2, ai: `ranged`, rig: `cultist`, c: 6957600, c2: 16756810, spit: { dmg: 9, speed: 212, color: 16747066, home: 0.026 }, cap: 16 }, treant: { r: 25, hp: 300, speed: 40, dmg: 15, xp: 5, mass: 5, ai: `chase`, rig: `treant`, c: 5914672, c2: 16738848, heavy: true, cap: 7 }, cinder: { r: 9, hp: 40, speed: 124, dmg: 7, xp: 3, mass: 0.7, ai: `chase`, rig: `wisp`, c: 16756810, c2: 16734752, ghost: true, fly: 12 }, ashshaman: { r: 12, hp: 45, speed: 66, dmg: 6, xp: 4, mass: 1.2, ai: `healer`, rig: `witch`, c: 4860448, c2: 8010266, c3: 16756810, heal: 0.07, healCd: 300, healR: 130, cap: 4 }, alpha: { r: 19, hp: 1200, speed: 104, dmg: 17, xp: 12, mass: 5, ai: `lunge`, rig: `wolf`, c: 2761248, c2: 16734752, elite: true, scale: 1.6 }, stag: { r: 40, hp: 9e3, speed: 70, dmg: 26, xp: 40, mass: 40, ai: `stag`, rig: `stag`, c: 4863016, c2: 16738848, boss: true }, frostbat: { r: 8, hp: 12, speed: 140, dmg: 4, xp: 1, mass: 0.6, ai: `swoop`, rig: `bat`, c: 10475775, c2: 3828378, fly: 24 }, iceskel: { r: 11, hp: 36, speed: 90, dmg: 7, xp: 1, mass: 1.1, ai: `chase`, rig: `skeleton`, c: 13626111, c2: 9091288 }, snowwolf: { r: 12, hp: 40, speed: 96, dmg: 7, xp: 2, mass: 1.2, ai: `lunge`, rig: `wolf`, c: 14674160, c2: 8042751 }, shard: { r: 15, hp: 80, speed: 56, dmg: 7, xp: 2, mass: 1.8, ai: `chase`, rig: `slime`, c: 9095408, c2: 4885184, split: `shardling` }, shardling: { r: 8, hp: 18, speed: 100, dmg: 4, xp: 1, mass: 0.7, ai: `chase`, rig: `slime`, c: 11197695, c2: 6990048 }, yeti: { r: 24, hp: 360, speed: 50, dmg: 16, xp: 5, mass: 5, ai: `chase`, rig: `yeti`, c: 15265524, c2: 6982312, heavy: true, cap: 7 }, rime: { r: 10, hp: 52, speed: 120, dmg: 8, xp: 3, mass: 0.8, ai: `chase`, rig: `ghost`, c: 12642559, c2: 5937872, ghost: true, fly: 8 }, frostseer: { r: 12, hp: 110, speed: 64, dmg: 7, xp: 4, mass: 1.2, ai: `healer`, rig: `witch`, c: 4872824, c2: 9087176, c3: 10477823, heal: 0.25, cap: 4 }, frostknight: { r: 20, hp: 1500, speed: 84, dmg: 18, xp: 12, mass: 6, ai: `charger`, rig: `knight`, c: 11061480, c2: 5929626, c3: 8050943, elite: true }, wormhead: { r: 30, hp: 9e3, speed: 150, dmg: 26, xp: 40, mass: 12, ai: `worm`, rig: `wormhead`, c: 9089232, c2: 2771562, boss: true }, gargoyle: { r: 10, hp: 30, speed: 120, dmg: 6, xp: 2, mass: 1, ai: `diver`, rig: `gargoyle`, c: 6975354, c2: 3817290, fly: 30 }, hollow: { r: 12, hp: 50, speed: 80, dmg: 7, xp: 1, mass: 1.3, ai: `chase`, rig: `hollow`, c: 5921400, c2: 12634367 }, cultist: { r: 12, hp: 60, speed: 72, dmg: 6, xp: 3, mass: 1.2, ai: `ranged`, rig: `cultist`, c: 5913226, c2: 12626175, spit: { dmg: 10, speed: 216, color: 12626175, home: 0.03 }, cap: 16 }, bellgolem: { r: 25, hp: 400, speed: 44, dmg: 18, xp: 5, mass: 6, ai: `chase`, rig: `brute`, c: 9075290, c2: 5917242, heavy: true, cap: 7 }, specter: { r: 10, hp: 64, speed: 124, dmg: 9, xp: 3, mass: 0.8, ai: `chase`, rig: `ghost`, c: 14207231, c2: 8022720, ghost: true, fly: 8 }, hollowpriest: { r: 12, hp: 120, speed: 66, dmg: 7, xp: 4, mass: 1.2, ai: `healer`, rig: `witch`, c: 3811914, c2: 6965898, c3: 14203135, heal: 0.0625, haste: true, cap: 4 }, moonknight: { r: 21, hp: 2e3, speed: 90, dmg: 20, xp: 12, mass: 7, ai: `charger`, rig: `knight`, c: 3816026, c2: 2763322, c3: 12634367, elite: true }, king: { r: 36, hp: 11e3, speed: 64, dmg: 28, xp: 50, mass: 40, ai: `king`, rig: `king`, c: 3816024, c2: 12634367, boss: true }, wormseg: { r: 22, hp: 1, speed: 0, dmg: 18, xp: 0, mass: 5, ai: `segment`, rig: `wormseg`, c: 8036032, c2: 2771562, part: true }, candle: { r: 10, hp: 12, speed: 0, dmg: 0, xp: 0, mass: 1, ai: `prop`, rig: `candle`, c: 16765578, c2: 3813936, prop: true } }).map(([e3, t2]: any) => [e3, { ...t2, id: e3 }]));
var Wo: any = 600;
function Go(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any, s2?: any, c2: any = 0, l2: any = 0): any {
    e3.particles.length > Wo || e3.particles.push({ x: t2, y: n2, z: c2, vx: r2, vy: i2, vz: l2, color: a2, life: o2, T: o2, size: s2 });
}
function H(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2: any = 2): any {
    e3.particles.length > 520 && (r2 = Math.min(r2, 3));
    for (let o2: any = 0; o2 < r2; o2++) {
        let r3: any = e3.rng() * Math.PI * 2, o3: any = 40 + e3.rng() * 160;
        Go(e3, t2, n2, Math.cos(r3) * o3, Math.sin(r3) * o3, i2, 18 + Math.floor(e3.rng() * 16), a2 * (0.6 + e3.rng() * 0.7), 8, 60 + e3.rng() * 120);
    }
}
function Ko(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2: any = 1): any {
    e3.floaters.push({ x: t2, y: n2, text: r2, color: i2, t: 0, T: 42, scale: a2 });
}
function qo(e3?: any, t2?: any, n2?: any): any {
    e3.shakeAmp = Math.max(e3.shakeAmp, t2), e3.shakeT = Math.max(e3.shakeT, n2);
}
function Jo(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    e3.banners.push({ key: t2, vars: i2, color: n2, t: 0, T: r2 });
}
function U(e3?: any, t2?: any, n2?: any): any {
    e3.sfx.push(n2 === void 0 ? [t2] : [t2, n2]);
}
function Yo(e3?: any, t2?: any): any {
    let n2: any = 0;
    for (let e4 of t2)
        n2 += e4[1];
    let r2: any = e3.rng() * n2;
    for (let e4 of t2)
        if (r2 -= e4[1], r2 <= 0)
            return e4[0];
    return t2[t2.length - 1][0];
}
function Xo(e3?: any): any {
    for (let t2 of [...Array.from<any>(e3.monsters)])
        t2.alive && !t2.def.prop && (H(e3, t2.body.x, t2.body.y, 3, t2.def.c, 2), nc(e3, t2, true));
    for (let t2 of e3.gems)
        t2.pull = true;
}
function Zo(e3?: any, t2?: any): any {
    e3.clock - e3.bossSpawnedAt <= 1800 && (e3.fastKeeper = true);
    let n2: any = e3.stage;
    if (n2.rush && e3.rushIdx < n2.rush.length) {
        e3.eclipse = 0, e3.hazards.length = 0, e3.flash = 0.8, Xo(e3), e3.bossSpawned = false, e3.rushNext = e3.clock + (n2.gap ?? 8) * 60, Jo(e3, `b_vigilNext`, `#ffd166`, 200, { n: e3.rushIdx, of: n2.rush.length });
        let t3: any = e3.hero;
        t3.level += 3, t3.xpNext = pn(t3.level), e3.levelUpQueue += 3;
    }
    else
        e3.bossKilledAt = e3.frame, e3.eclipse = 0, e3.hazards.length = 0, e3.flash = 1, Jo(e3, `b_beacon`, `#ffd166`, 300), U(e3, `beacon`), Xo(e3), e3.clearBonus = n2.clearBonus ?? 60 + n2.index * 40;
}
function Qo(e3?: any): any {
    let t2: any = e3.stage;
    if (e3.boss?.alive) {
        $o(e3, e3.boss);
        return;
    }
    let n2: any = t2.rush;
    if (e3.rushIdx >= n2.length || e3.clock < e3.rushNext)
        return;
    let [r2, i2, a2]: any = n2[e3.rushIdx++];
    e3.hpMul = i2 * (e3.blood ? Rt.hp : 1), e3.dmgMul = a2 * (e3.blood ? Rt.dmg : 1), e3.rushHome = Lt.find((e4?: any) => e4.boss === r2) ?? null, e3.rushCalls = 0, e3.wrathT = 0, e3.bossSpawned = true, e3.bossSpawnedAt = e3.clock;
    let o2: any = wc(e3, r2);
    o2 && (o2.hp *= t2.keeperHp ?? 1, o2.maxHp *= t2.keeperHp ?? 1), Jo(e3, `boss_${r2}`, `#f85149`, 200), U(e3, `bossArrive`), qo(e3, 10, 0.6);
}
function $o(e3?: any, t2?: any): any {
    let n2: any = e3.rushHome;
    if (!n2)
        return;
    let r2: any = t2.hp / t2.maxHp;
    if (e3.freeze <= 0) {
        let t3: any = (0.8 + n2.bossAt / 60 * 1.35) * n2.rate * (e3.blood ? Rt.rate : 1) * 1.4 * 0.55 * (e3.stage.hordeRate ?? 1), r3: any = 0, i3: any = {};
        for (let t4 of e3.monsters)
            t4.alive && !t4.def.prop && !t4.def.part && (r3++, i3[t4.id] = (i3[t4.id] || 0) + 1);
        r3 >= 400 && (t3 = 0), e3.spawnAcc += t3 * k;
        let a2: any = n2.mix.filter(([e4]: any) => !(qa[e4].cap && (i3[e4] || 0) >= qa[e4].cap)).map(([e4, , , t4]: any) => [e4, t4]);
        for (; e3.spawnAcc >= 1 && a2.length;) {
            e3.spawnAcc--;
            let t4: any = pc(e3);
            ec(e3, Yo(e3, a2), t4.x, t4.y);
        }
    }
    let i2: any = r2 < 0.33 ? 2 : +(r2 < 0.66);
    if (i2 > e3.rushCalls) {
        e3.rushCalls = i2;
        let t3: any = n2.events.find((e4?: any) => e4[1] === `elite`)[2];
        for (let n3: any = 0; n3 < i2; n3++) {
            let n4: any = pc(e3, 480, 560), r3: any = ec(e3, t3, n4.x, n4.y);
            r3 && H(e3, n4.x, n4.y, 30, r3.def.c, 3);
        }
        Jo(e3, `ev_elite_${t3}`, `#ff9a5a`, 150), U(e3, `elite`), qo(e3, 6, 0.3);
    }
    if (r2 < 0.5 && t2.hidden <= 0 && --e3.wrathT <= 0) {
        e3.rushWrathFor !== t2 && (e3.rushWrathFor = t2, Jo(e3, `b_wrath`, `#ff6b4a`, 150)), e3.wrathT = Math.round((r2 < 0.25 ? 4 : 5.5) * 60);
        let n3: any = r2 < 0.25 ? 22 : 16, i3: any = e3.rng() * Math.PI * 2;
        for (let r3: any = 0; r3 < n3; r3++)
            cc(e3, t2.body.x, t2.body.y, i3 + r3 / n3 * Math.PI * 2, { dmg: 11, speed: 190, color: t2.def.c2, r: 7, life: 240, big: true });
        U(e3, `orbs`);
    }
}
function es(e3?: any): any {
    if (e3.bossKilledAt)
        return;
    let t2: any = e3.stage;
    if (t2.rush) {
        Qo(e3);
        return;
    }
    let n2: any = e3.clock / 60, r2: any = j(n2 / t2.bossAt, 0, 1), i2: any = (0.8 + n2 / 60 * 1.35) * e3.rateMul;
    r2 > 0.8 && (i2 *= 1.4), e3.bossSpawned && (i2 *= 0.55), e3.freeze > 0 && (i2 = 0);
    let a2: any = 0;
    for (let t3 of e3.monsters)
        t3.alive && !t3.def.prop && a2++;
    a2 >= 400 && (i2 = 0), e3.spawnAcc += i2 * k;
    let o2: any = {};
    if (e3.spawnAcc >= 1)
        for (let t3 of e3.monsters)
            t3.alive && (o2[t3.id] = (o2[t3.id] || 0) + 1);
    let s2: any = [];
    for (let [e4, i3, a3, c2] of t2.mix) {
        let t3: any = qa[e4].cap;
        n2 >= i3 && !(t3 && (o2[e4] || 0) >= t3) && s2.push([e4, ln(a3, c2, r2)]);
    }
    for (; e3.spawnAcc >= 1 && a2 < 400 && s2.length;) {
        e3.spawnAcc--;
        let t3: any = pc(e3), n3: any = Yo(e3, s2);
        ec(e3, n3, t3.x, t3.y), o2[n3] = (o2[n3] || 0) + 1;
        let r3: any = qa[n3].cap;
        r3 && o2[n3] >= r3 && s2.splice(s2.findIndex((e4?: any) => e4[0] === n3), 1), a2++;
    }
    for (; e3.events.length && e3.events[0].at <= e3.clock;) {
        let t3: any = e3.events.shift(), n3: any = W(e3), r3: any = G(e3);
        if (Jo(e3, `ev_${t3.kind}_${t3.id}`, t3.kind === `elite` ? `#ff9a5a` : `#ffd166`, 150), U(e3, t3.kind === `elite` ? `elite` : `horde`), t3.kind === `ring`)
            for (let i3: any = 0; i3 < t3.n; i3++) {
                let a3: any = i3 / t3.n * Math.PI * 2;
                ec(e3, t3.id, n3 + Math.cos(a3) * 520, r3 + Math.sin(a3) * 520);
            }
        else if (t3.kind === `wall`) {
            let i3: any = e3.rng() < 0.5 ? -1 : 1;
            for (let a3: any = 0; a3 < t3.n; a3++)
                ec(e3, t3.id, n3 + i3 * 560, r3 - 520 + a3 * (1040 / t3.n));
        }
        else if (t3.kind === `pack`) {
            let n4: any = pc(e3, 500, 560);
            for (let r4: any = 0; r4 < t3.n; r4++)
                ec(e3, t3.id, n4.x + (e3.rng() - 0.5) * 120, n4.y + (e3.rng() - 0.5) * 120);
        }
        else {
            for (let n4: any = 0; n4 < t3.n; n4++) {
                let n5: any = pc(e3, 480, 560), r4: any = ec(e3, t3.id, n5.x, n5.y);
                r4 && H(e3, n5.x, n5.y, 30, r4.def.c, 3);
            }
            qo(e3, 6, 0.3);
        }
    }
    !e3.bossSpawned && n2 >= t2.bossAt && t2.boss && (e3.bossSpawned = true, e3.bossSpawnedAt = e3.clock, wc(e3, t2.boss), Jo(e3, `boss_${t2.boss}`, `#f85149`, 200), U(e3, `bossArrive`), qo(e3, 10, 0.6));
}
var ts: any = Math.floor;
var ns: any = Math.ceil;
var rs: any = { flail: { stats: (e3?: any) => ({ dmg: 12 + e3 * 4, range: 92 + e3 * 7, cd: 50 - e3 * 3, arcs: e3 >= 3 ? 2 : 1, width: e3 >= 5 ? 1.35 : 1.15 }), fire: (e3?: any, t2?: any, n2?: any) => us(e3, t2, n2, false) }, sunflail: { stats: () => ({ dmg: 62, range: 175, cd: 34, arcs: 2, width: 1.6 }), fire: (e3?: any, t2?: any, n2?: any) => us(e3, t2, n2, true) }, crossbow: { stats: (e3?: any) => ({ dmg: 12 + e3 * 4, n: 1 + ts((e3 - 1) / 2), pierce: 1 + ts(e3 / 3), cd: 64 - e3 * 4 }), fire: (e3?: any, t2?: any, n2?: any) => ds(e3, t2, n2, 520, 0) }, dawnbreaker: { stats: () => ({ dmg: 38, n: 4, pierce: 99, cd: 40 }), fire: (e3?: any, t2?: any, n2?: any) => ds(e3, t2, n2, 620, 64) }, knives: { stats: (e3?: any) => ({ dmg: 8 + e3 * 2, n: 2 + e3, pierce: +(e3 >= 6), cd: 58 - e3 * 3 }), fire(e3?: any, t2?: any, n2?: any): any {
            let r2: any = e3.hero, i2: any = r2.moveX || r2.moveY ? Math.atan2(r2.moveY, r2.moveX) : r2.face, a2: any = n2.n + r2.stats.amount;
            for (let r3: any = 0; r3 < a2; r3++)
                Ms(e3, t2, `knife`, i2 + (r3 - (a2 - 1) / 2) * 0.09, { speed: 660, dmg: n2.dmg, pierce: n2.pierce, r: 4, life: 70, delay: r3 * 2 });
            U(e3, `knives`);
        } }, edges: { stats: () => ({ dmg: 20, n: 2, pierce: 2, cd: 6 }), fire(e3?: any, t2?: any, n2?: any): any {
            let r2: any = e3.hero;
            t2.spin = (t2.spin || 0) + 0.55;
            let i2: any = r2.moveX || r2.moveY ? Math.atan2(r2.moveY, r2.moveX) : r2.face, a2: any = n2.n + r2.stats.amount;
            for (let r3: any = 0; r3 < a2; r3++)
                Ms(e3, t2, `knife`, r3 === 0 ? i2 + Math.sin(t2.spin) * 0.25 : t2.spin + r3 / a2 * Math.PI * 2, { speed: 700, dmg: n2.dmg, pierce: n2.pierce, r: 4, life: 60 });
            e3.frame % 18 == 0 && U(e3, `knives`);
        } }, bell: { stats: (e3?: any) => ({ dmg: 5 + e3 * 3.5, radius: 60 + e3 * 11, cd: 32, knock: 100 + e3 * 10 }), fire: (e3?: any, t2?: any, n2?: any) => fs(e3, t2, n2.radius * e3.hero.stats.area, n2.dmg, n2.knock) }, toll: { stats: () => ({ dmg: 34, radius: 200, cd: 30, knock: 180 }), fire(e3?: any, t2?: any, n2?: any): any {
            t2.count = (t2.count || 0) + 1;
            let r2: any = t2.count % 5 == 0, i2: any = e3.hero.stats.area;
            fs(e3, t2, (r2 ? 310 : n2.radius) * i2, r2 ? 70 : n2.dmg, r2 ? 420 : n2.knock), r2 && (e3.rings.push({ x: W(e3), y: G(e3), r: 20, max: 310 * i2, t: 0, T: 24, color: 16771496 }), U(e3, `bigtoll`));
        } }, spades: { stats: (e3?: any) => ({ dmg: 12 + e3 * 6, n: 1 + ns(e3 * 0.72), radius: 72 + e3 * 5, speed: 2.7 + e3 * 0.32 }), tick: ps }, halo: { stats: () => ({ dmg: 52, n: 8, radius: 112, speed: 4.6 }), tick: ps }, storm: { stats: (e3?: any) => ({ dmg: 24 + e3 * 7, n: 1 + ts(e3 / 2), chain: e3 >= 6 ? 2 : +(e3 >= 3), cd: 100 - e3 * 6 }), fire: (e3?: any, t2?: any, n2?: any) => hs(e3, t2, n2, 320) }, wrath: { stats: () => ({ dmg: 72, n: 6, chain: 3, cd: 54 }), fire: (e3?: any, t2?: any, n2?: any) => hs(e3, t2, n2, 380) }, water: { stats: (e3?: any) => ({ dmg: 6 + e3 * 2, n: 1 + ts(e3 / 3), radius: 42 + e3 * 5, dur: 150 + e3 * 18, cd: 150 - e3 * 8 }), fire: vs }, font: { stats: () => ({ dmg: 20, n: 4, radius: 85, dur: 320, cd: 110 }), fire: vs }, hook: { stats: (e3?: any) => ({ dmg: 20 + e3 * 6, n: 1 + ts(e3 / 3), cd: 96 - e3 * 5 }), fire: (e3?: any, t2?: any, n2?: any) => ys(e3, t2, n2, false) }, reaper: { stats: () => ({ dmg: 60, n: 4, cd: 60 }), fire: (e3?: any, t2?: any, n2?: any) => ys(e3, t2, n2, true) }, wisps: { stats: (e3?: any) => ({ dmg: 8 + e3 * 3, n: 1 + ts(e3 / 2), blast: 22 + e3 * 2, cd: 84 - e3 * 5 }), fire: (e3?: any, t2?: any, n2?: any) => xs(e3, t2, n2, 0) }, choir: { stats: () => ({ dmg: 30, n: 5, blast: 48, cd: 40 }), fire: (e3?: any, t2?: any, n2?: any) => xs(e3, t2, n2, 2) }, sickle: { stats: (e3?: any) => ({ dmg: 16 + e3 * 5, n: 1 + ts((e3 - 1) / 2), reach: 30 + e3 * 2, cd: 72 - e3 * 4 }), fire: (e3?: any, t2?: any, n2?: any) => Ss(e3, t2, n2, false) }, harvest: { stats: () => ({ dmg: 46, n: 4, reach: 46, cd: 50 }), fire: (e3?: any, t2?: any, n2?: any) => Ss(e3, t2, n2, true) }, censer: { stats: (e3?: any) => ({ dmg: 18 + e3 * 6, reach: 80 + e3 * 6, speed: 3 + e3 * 0.22, smoke: +(e3 >= 3) }), tick: (e3?: any, t2?: any, n2?: any) => Os(e3, t2, n2, 1) }, thurible: { stats: () => ({ dmg: 55, reach: 124, speed: 4.4, smoke: 1 }), tick: (e3?: any, t2?: any, n2?: any) => Os(e3, t2, n2, 2) }, raven: { stats: (e3?: any) => ({ dmg: 44 + e3 * 16, n: 1 + +(e3 >= 4) + +(e3 >= 7), cd: 60 - e3 * 4 }), tick: (e3?: any, t2?: any, n2?: any) => js(e3, t2, n2, false) }, unkindness: { stats: () => ({ dmg: 110, n: 4, cd: 30 }), tick: (e3?: any, t2?: any, n2?: any) => js(e3, t2, n2, true) } };
var is: any = (e3?: any, t2?: any) => rs[e3].stats(t2);
function as(e3?: any, t2?: any): any {
    let n2: any = e3.hero.weapons.find((e4?: any) => e4.id === t2);
    if (n2)
        return n2.level = Math.min(7, n2.level + 1), n2;
    let r2: any = { id: t2, level: 1, cd: 20, pulse: 0, radius: 0, angle: 0 };
    return e3.hero.weapons.push(r2), e3.weaponsSeen.add(t2), r2;
}
function os(e3?: any): any {
    let t2: any = e3.hero;
    return t2.weapons.filter((e4?: any) => {
        let n2: any = Bt[e4.id];
        return !!n2.into && e4.level >= 7 && (t2.passives[n2.evo] || 0) > 0;
    });
}
function ss(e3?: any, t2?: any): any {
    let n2: any = Bt[t2.id].into;
    t2.id === `spades` && (e3.orbs.length = 0), t2.id === `censer` && ks(e3), t2.id === `raven` && (e3.ravens.length = 0), t2.id = n2, t2.level = 1, t2.evolved = true, t2.cd = 10, e3.weaponsSeen.add(n2), e3.evolved.push(n2);
}
function cs(e3?: any): any {
    let t2: any = e3.hero;
    if (!(t2.dig > 0))
        for (let n2 of t2.weapons) {
            let r2: any = rs[n2.id], i2: any = r2.stats(n2.level);
            r2.tick ? r2.tick(e3, n2, i2) : (n2.pulse *= 0.9, --n2.cd <= 0 && (n2.cd = Math.max(5, Math.round(i2.cd * t2.stats.cdMul)), r2.fire(e3, n2, i2)), n2.extra && n2.extra > 0 && --n2.extra === 0 && r2.fire(e3, { ...n2, extraShot: true }, i2));
        }
}
function ls(e3?: any, t2?: any): any {
    let n2: any = W(e3), r2: any = G(e3), i2: any = null, a2: any = t2, o2: any = e3.boss?.alive ? [e3.boss] : e3.elites;
    for (let e4 of o2) {
        if (!e4.alive || e4.hidden > 0)
            continue;
        let t3: any = Math.hypot(e4.body.x - n2, e4.body.y - r2);
        t3 < a2 && (a2 = t3, i2 = e4);
    }
    return i2;
}
function us(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = e3.hero, a2: any = n2.range * i2.stats.area, o2: any = n2.width, s2: any = i2.face, c2: any = oc(e3, 1, a2 * 1.4)[0];
    c2 && (s2 = Math.atan2(c2.body.y - G(e3), c2.body.x - W(e3)));
    let l2: any = W(e3), u2: any = G(e3);
    for (let i3 of n2.arcs >= 2 ? [0, Math.PI] : [0]) {
        let c3: any = s2 + i3;
        e3.arcs.push({ x: l2, y: u2, a: c3, arc: o2, r: a2, t: 0, T: 10, color: r2 ? 16757575 : 16765286, sun: r2 });
        for (let i4 of e3.monsters) {
            if (!i4.alive)
                continue;
            let s3: any = i4.body.x - l2, d2: any = i4.body.y - u2, f2: any = Math.hypot(s3, d2);
            f2 > a2 + i4.def.r || Math.abs(un(Math.atan2(d2, s3) - c3)) > o2 || (q(e3, i4, n2.dmg, s3 / (f2 || 1), d2 / (f2 || 1), 170, r2 ? `#ffb347` : `#ffd166`, t2.id), r2 && rc(i4, 8, 120));
        }
    }
    !t2.extraShot && i2.stats.amount > 0 && (t2.extra = 9), i2.attackFlash = 6, U(e3, `whip`, +!!r2);
}
function ds(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    let a2: any = n2.n + e3.hero.stats.amount, o2: any = oc(e3, a2, 480);
    if (!o2.length) {
        t2.cd = 10;
        return;
    }
    let s2: any = ls(e3, 480);
    s2 && !o2.includes(s2) && o2.unshift(s2);
    for (let s3: any = 0; s3 < a2; s3++) {
        let a3: any = o2[s3 % o2.length].body, c2: any = s3 >= o2.length ? (s3 - o2.length + 1) * 0.12 : 0;
        Ms(e3, t2, `bolt`, Math.atan2(a3.y - G(e3), a3.x - W(e3)) + c2, { speed: r2, dmg: n2.dmg, pierce: n2.pierce, r: i2 ? 7 : 5, life: 90, blast: i2, delay: s3 * 3 });
    }
    e3.hero.attackFlash = 6, U(e3, `bow`, +!!i2);
}
function fs(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    t2.radius = n2;
    let a2: any = W(e3), o2: any = G(e3);
    for (let s2 of e3.monsters) {
        if (!s2.alive)
            continue;
        let c2: any = s2.body.x - a2, l2: any = s2.body.y - o2, u2: any = Math.hypot(c2, l2);
        u2 <= n2 + s2.def.r && q(e3, s2, r2, c2 / (u2 || 1), l2 / (u2 || 1), i2, `#e0c070`, t2.id);
    }
    ac(e3, a2, o2, n2, i2 * 0.4), t2.pulse = 1, e3.frame % 64 < 32 && U(e3, `bell`);
}
function ps(e3?: any, t2?: any, n2?: any): any {
    let r2: any = e3.hero, i2: any = n2.n + r2.stats.amount, a2: any = e3.orbs;
    for (; a2.length < i2;)
        a2.push({ body: { x: W(e3), y: G(e3) - 70, vx: 0, vy: 0 }, r: t2.id === `halo` ? 13 : 10, dmg: 10, a: 0, w: t2, hidden: false, touching: /* @__PURE__ */ new Set() });
    for (; a2.length > i2;)
        a2.pop();
    let o2: any = n2.radius * r2.stats.area;
    t2.angle = (t2.angle || 0) + n2.speed * k * (1 / Math.max(0.5, r2.stats.cdMul));
    let s2: any = W(e3), c2: any = G(e3), l2: any = r2.dig > 0;
    for (let e4: any = 0; e4 < a2.length; e4++) {
        let r3: any = a2[e4], u2: any = t2.angle + e4 / i2 * Math.PI * 2;
        r3.body.vx = (s2 + Math.cos(u2) * o2 - r3.body.x) / k, r3.body.vy = (c2 + Math.sin(u2) * o2 - r3.body.y) / k, r3.dmg = n2.dmg, r3.a = u2, r3.w = t2, r3.hidden = l2;
    }
}
function ms(e3?: any, t2?: any, n2?: any): any {
    if (n2.orbCd > 0 || t2.hidden)
        return;
    n2.orbCd = 13;
    let r2: any = n2.body.x - W(e3), i2: any = n2.body.y - G(e3), a2: any = M(r2, i2), o2: any = t2.w.id === `halo`;
    q(e3, n2, t2.dmg, r2 / a2, i2 / a2, o2 ? 260 : 150, `#c9d4e0`, t2.w.id || `spades`), e3.frame % 3 == 0 && U(e3, `spade`);
}
function hs(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = W(e3), a2: any = G(e3), o2: any = e3.monsters.filter((e4?: any) => e4.alive && !e4.def.prop && Math.hypot(e4.body.x - i2, e4.body.y - a2) < r2);
    if (!o2.length) {
        t2.cd = 12;
        return;
    }
    let s2: any = n2.n + e3.hero.stats.amount, c2: any = ls(e3, r2);
    for (let r3: any = 0; r3 < s2; r3++)
        _s(e3, t2.id, c2 && r3 % 2 == 0 ? c2 : o2[ts(e3.rng() * o2.length)], n2.dmg, n2.chain);
    U(e3, `thunder`, +(t2.id === `wrath`));
}
function gs(e3?: any): any {
    let t2: any = W(e3), n2: any = G(e3), r2: any = e3.monsters.filter((e4?: any) => e4.alive && !e4.def.prop && Math.hypot(e4.body.x - t2, e4.body.y - n2) < 360);
    for (let t3: any = 0; t3 < Math.min(3, r2.length); t3++)
        _s(e3, `stormglass`, r2[ts(e3.rng() * r2.length)], 45, 1);
    r2.length && U(e3, `thunder`, 0);
}
function _s(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    let a2: any = n2.body, o2: any = [];
    for (let t3: any = 0; t3 <= 7; t3++) {
        let n3: any = t3 / 7;
        o2.push({ x: a2.x + (1 - n3) * (e3.rng() - 0.5) * 80 * (t3 === 0 ? 0 : 1), y: a2.y, z: (1 - n3) * 300 });
    }
    o2[7] = { x: a2.x, y: a2.y, z: 0 }, e3.bolts.push({ pts: o2, t: 0, T: 10, color: 16774048 }), e3.flash = Math.max(e3.flash, 0.2), H(e3, a2.x, a2.y, 8, 16769126, 3);
    let s2: any = n2, c2: any = new Set([n2]);
    q(e3, n2, r2, 0, 0, 0, `#ffe066`, t2);
    for (let n3: any = 0; n3 < i2; n3++) {
        let n4: any = null, i3: any = 140, a3: any = s2.body;
        for (let t3 of e3.monsters) {
            if (!t3.alive || c2.has(t3) || t3.def.prop)
                continue;
            let e4: any = Math.hypot(t3.body.x - a3.x, t3.body.y - a3.y);
            e4 < i3 && (i3 = e4, n4 = t3);
        }
        if (!n4)
            break;
        let o3: any = n4.body;
        e3.bolts.push({ pts: [{ x: a3.x, y: a3.y, z: 20 }, { x: (a3.x + o3.x) / 2 + (e3.rng() - 0.5) * 40, y: (a3.y + o3.y) / 2 + (e3.rng() - 0.5) * 40, z: 34 }, { x: o3.x, y: o3.y, z: 4 }], t: 0, T: 10, color: 16774048 }), q(e3, n4, r2 * 0.7, 0, 0, 0, `#ffe066`, t2), c2.add(n4), s2 = n4;
    }
}
function vs(e3?: any, t2?: any, n2?: any): any {
    let r2: any = e3.hero, i2: any = n2.n + r2.stats.amount, a2: any = W(e3), o2: any = G(e3), s2: any = oc(e3, 12, 360);
    for (let c2: any = 0; c2 < i2; c2++) {
        let i3: any, l2: any;
        if (s2.length) {
            let t3: any = s2[ts(e3.rng() * s2.length)];
            i3 = t3.body.x, l2 = t3.body.y;
        }
        else {
            let t3: any = e3.rng() * 6.28, n3: any = 80 + e3.rng() * 160;
            i3 = a2 + Math.cos(t3) * n3, l2 = o2 + Math.sin(t3) * n3;
        }
        e3.globs.push({ x0: a2, y0: o2, x1: i3, y1: l2, t: -c2 * 6, T: 34, kind: `holy`, r: n2.radius * r2.stats.area, dmg: n2.dmg, dur: Math.round(n2.dur * r2.stats.dur), src: t2.id, color: 8050943, friendly: true });
    }
    U(e3, `throw`);
}
function ys(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = n2.n + e3.hero.stats.amount, a2: any = oc(e3, i2 * 3, 320).filter((e4?: any) => !e4.def.boss && !e4.def.part && !e4.thrown);
    if (!a2.length) {
        t2.cd = 12;
        return;
    }
    let o2: any = W(e3), s2: any = G(e3);
    for (let c2: any = 0; c2 < Math.min(i2, a2.length); c2++) {
        let i3: any = a2[c2], l2: any = i3.body, u2: any = Math.atan2(l2.y - s2, l2.x - o2), d2: any = 0, f2: any = u2;
        for (let t3 of [-0.6, -0.3, 0, 0.3, 0.6]) {
            let n3: any = u2 + t3, r3: any = 0;
            for (let t4 of e3.monsters) {
                if (!t4.alive || t4 === i3)
                    continue;
                let e4: any = t4.body.x - l2.x, a3: any = t4.body.y - l2.y, o3: any = e4 * Math.cos(n3) + a3 * Math.sin(n3);
                o3 < 0 || o3 > 300 || Math.abs(-e4 * Math.sin(n3) + a3 * Math.cos(n3)) < 40 && r3++;
            }
            r3 > d2 && (d2 = r3, f2 = n3);
        }
        let p2: any = 780 / Math.sqrt(Math.max(1, i3.def.mass * 0.6));
        i3.body.setVel(Math.cos(f2) * p2, Math.sin(f2) * p2), i3.thrown = 36, i3.thrownDmg = n2.dmg, i3.thrownSrc = t2.id, i3.reap = r2, $s(i3, `thrown`), i3.body.setEvents(true), q(e3, i3, n2.dmg * 0.5, 0, 0, 0, `#d2a8ff`, t2.id), e3.beams.push({ x0: o2, y0: s2, x1: l2.x, y1: l2.y, t: 0, T: 10, color: 13805823 });
    }
    e3.hero.attackFlash = 6, U(e3, `hook`);
}
function bs(e3?: any, t2?: any, n2?: any): any {
    if (!n2.alive || n2 === t2)
        return;
    let r2: any = t2.body.vx, i2: any = t2.body.vy, a2: any = M(r2, i2);
    a2 < 120 || (q(e3, n2, t2.thrownDmg, r2 / a2, i2 / a2, 140, `#d2a8ff`, t2.thrownSrc), t2.alive && q(e3, t2, t2.thrownDmg * 0.3, 0, 0, 0, `#d2a8ff`, t2.thrownSrc), Go(e3, n2.body.x, n2.body.y, 0, 0, 13805823, 14, 3, 10, 30), e3.frame % 2 == 0 && U(e3, `thud`));
}
function xs(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = e3.hero, a2: any = n2.n + i2.stats.amount, o2: any = oc(e3, a2, 520);
    if (!o2.length)
        t2.cd = 12;
    else {
        for (let s2: any = 0; s2 < a2; s2++)
            Ms(e3, t2, `wisp`, i2.face + Math.PI + (s2 - (a2 - 1) / 2) * 0.7 + (e3.rng() - 0.5) * 0.4, { speed: 230, dmg: n2.dmg, pierce: r2, r: 6, life: 170, blast: n2.blast * i2.stats.area, delay: s2 * 4, homing: o2[s2 % o2.length] });
        U(e3, `wisp`);
    }
}
function Ss(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = e3.hero, a2: any = n2.n + i2.stats.amount, o2: any = oc(e3, 1, 360)[0], s2: any = o2 ? Math.atan2(o2.body.y - G(e3), o2.body.x - W(e3)) : i2.face;
    for (let i3: any = 0; i3 < a2; i3++)
        Ms(e3, t2, `sickle`, r2 ? s2 + i3 / a2 * Math.PI * 2 : s2 + (i3 - (a2 - 1) / 2) * 0.5, { speed: 560, dmg: n2.dmg, pierce: 1e9, r: r2 ? 14 : 11, life: 400, out: n2.reach, delay: i3 * 3 });
    U(e3, `sickle`);
}
var Cs: any = 2 * Math.PI * 6;
var ws: any = 0.6;
var Ts: any = k * Cs;
var Es: any = Ts * (2 * ws + Ts) / (1 + Ts * (2 * ws + Ts));
var Ds: any = Cs / (2 * ws + Ts);
function Os(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = e3.hero, a2: any = W(e3), o2: any = G(e3), s2: any = n2.reach * i2.stats.area;
    for (; e3.censers.length < r2;) {
        let t3: any = e3.censers.length * Math.PI, n3: any = e3.phys.circle(a2 + Math.cos(t3) * s2, o2 + Math.sin(t3) * s2, 12, { density: 1.4, friction: 0.3, restitution: 0.3, groups: On.censer });
        e3.censers.push({ body: n3, a: t3, smokeT: 0, hidden: false });
    }
    let c2: any = i2.dig > 0;
    for (let l2 of e3.censers) {
        let u2: any = l2.body, d2: any = u2.x - a2, f2: any = u2.y - o2, p2: any = M(d2, f2), m2: any = p2 > s2 ? p2 - s2 : p2 < s2 * 0.6 ? p2 - s2 * 0.6 : 0;
        if (m2 !== 0) {
            let e4: any = d2 / p2, t3: any = f2 / p2, n3: any = (u2.vx - i2.body.vx) * e4 + (u2.vy - i2.body.vy) * t3, r3: any = -Es * (n3 + Ds * m2);
            (m2 > 0 && r3 > 0 || m2 < 0 && r3 < 0) && (r3 = 0), u2.setVel(u2.vx + e4 * r3, u2.vy + t3 * r3);
        }
        let h2: any = n2.speed * s2, g2: any = -f2 / p2, _2: any = d2 / p2, v2: any = (u2.vx - i2.body.vx) * g2 + (u2.vy - i2.body.vy) * _2, y2: any = Math.max(0, h2 - v2) * 0.2;
        if (u2.setVel(u2.vx + g2 * y2, u2.vy + _2 * y2), l2.hidden = c2, !c2) {
            for (let a3 of e3.monsters) {
                if (!a3.alive || (a3.censerCd || 0) > e3.frame)
                    continue;
                let o3: any = a3.body.x - u2.x, s3: any = a3.body.y - u2.y, c3: any = (r2 > 1 ? 30 : 24) * i2.stats.area + a3.def.r;
                if (o3 * o3 + s3 * s3 > c3 * c3)
                    continue;
                a3.censerCd = e3.frame + 16;
                let l3: any = M(o3, s3);
                q(e3, a3, n2.dmg, o3 / l3, s3 / l3, 180, `#e8c070`, t2.id), r2 > 1 && rc(a3, 8, 90), e3.frame % 3 == 0 && U(e3, `censer`);
            }
            if (n2.smoke && ++l2.smokeT % 14 == 0) {
                let t3: any = Math.round(130 * i2.stats.dur);
                e3.zones.push({ kind: `smoke`, x: u2.x, y: u2.y, r: 34 * i2.stats.area, life: t3, T: t3 });
            }
        }
    }
}
function ks(e3?: any): any {
    for (let t2 of e3.censers)
        t2.body.remove();
    e3.censers.length = 0;
}
function As(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    let a2: any = t2 - e3.x, o2: any = n2 - e3.y, s2: any = M(a2, o2), c2: any = Math.min(r2, s2 * 0.12 + r2 * 0.25), l2: any = a2 / s2 * c2 - e3.vx, u2: any = o2 / s2 * c2 - e3.vy, d2: any = Math.min(1, i2 / M(l2, u2));
    return e3.vx += l2 * d2, e3.vy += u2 * d2, s2;
}
function js(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = e3.hero, a2: any = W(e3), o2: any = G(e3), s2: any = n2.n + (r2 ? 0 : i2.stats.amount);
    for (; e3.ravens.length < s2;)
        e3.ravens.push({ x: a2, y: o2, z: 70, vx: 0, vy: 0, a: e3.rng() * 6.28, state: `circle`, cd: 30 + e3.ravens.length * 20, target: null, gem: null, fp: 0, t: 0 });
    for (; e3.ravens.length > s2;)
        e3.ravens.pop();
    let c2: any = Math.max(20, Math.round(n2.cd * i2.stats.cdMul));
    e3.ravens.forEach((s3?: any, l2?: any) => {
        if (s3.t++, s3.state === `circle`) {
            if (s3.a += 0.016 * (l2 % 2 ? -1 : 1), As(s3, a2 + Math.cos(s3.a + l2 * 1.7) * 62, o2 + Math.sin(s3.a + l2 * 1.7) * 62, 5, 0.18), s3.z += (72 - s3.z) * 0.04, --s3.cd <= 0) {
                let t3: any = null, n3: any = 0;
                for (let r3 of e3.monsters) {
                    if (!r3.alive || r3.def.prop || r3.hidden > 0)
                        continue;
                    let e4: any = Math.hypot(r3.body.x - a2, r3.body.y - o2);
                    if (e4 > 420)
                        continue;
                    let i3: any = (r3.def.boss ? 1e6 : r3.def.elite ? 1e5 : r3.hp) / (1 + e4 / 200);
                    i3 > n3 && (n3 = i3, t3 = r3);
                }
                if (t3)
                    s3.state = `dive`, s3.target = t3, s3.t = 0;
                else {
                    let t4: any = null, n4: any = i2.stats.magnet;
                    for (let r3 of e3.gems) {
                        let e4: any = Math.hypot(r3.x - a2, r3.y - o2);
                        !r3.pull && e4 > n4 && e4 < 700 && (n4 = e4, t4 = r3);
                    }
                    t4 && (s3.state = `fetch`, s3.gem = t4), s3.cd = 30;
                }
            }
        }
        else if (s3.state === `dive`) {
            let i3: any = s3.target;
            if (!i3?.alive) {
                s3.state = `return`, s3.t = 0;
                return;
            }
            let a3: any = i3.body, o3: any = As(s3, a3.x, a3.y, Math.min(12, 4 + s3.t * 0.35), 0.9);
            if (s3.z = Math.max(8, s3.z - 1.6 - s3.t * 0.05), o3 < i3.def.r + 12) {
                let o4: any = a3.x - s3.x, l3: any = a3.y - s3.y, u2: any = M(o4, l3);
                q(e3, i3, n2.dmg, o4 / u2, l3 / u2, 160, `#b8b8e0`, t2.id), r2 && ic(e3, a3.x, a3.y, 50, n2.dmg * 0.4, 9079464, false, t2.id), H(e3, a3.x, a3.y, 6, 2763322, 2.4), U(e3, `caw`), s3.state = `return`, s3.t = 0, s3.cd = c2;
            }
            else
                s3.t > 120 && (s3.state = `return`, s3.t = 0);
        }
        else if (s3.state === `return`) {
            let e4: any = As(s3, a2 + Math.cos(s3.a + l2 * 1.7) * 62, o2 + Math.sin(s3.a + l2 * 1.7) * 62, 4.2, 0.12);
            s3.z += (72 - s3.z) * 0.03, e4 < 30 && (s3.state = `circle`);
        }
        else {
            let t3: any = s3.gem;
            if (!t3 || !e3.gems.includes(t3) || t3.pull) {
                s3.state = `return`, s3.t = 0;
                return;
            }
            let n3: any = As(s3, t3.x, t3.y, 8, 0.35);
            s3.z += (40 - s3.z) * 0.05, n3 < 18 && (t3.pull = true, s3.state = `return`, s3.t = 0);
        }
        if (s3.x += s3.vx, s3.y += s3.vy, M(s3.vx, s3.vy) > 0.3) {
            let e4: any = Math.atan2(s3.vy, s3.vx);
            s3.face = s3.face === void 0 ? e4 : s3.face + un(e4 - s3.face) * 0.2;
        }
        s3.fp += s3.state === `circle` ? 0.12 + (s3.t % 90 < 30 ? 0.18 : 0) : s3.state === `dive` ? 0.1 : 0.32;
    });
}
function Ms(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    let a2: any = e3.hero.stats, o2: any = { kind: n2, w: t2.id, body: null, angle: r2, dmg: i2.dmg, pierce: i2.pierce, r: i2.r, life: Math.round(i2.life * a2.dur), speed: i2.speed * a2.proj, delay: i2.delay || 0, blast: i2.blast || 0, hit: /* @__PURE__ */ new Set(), touching: /* @__PURE__ */ new Set(), homing: i2.homing || null, out: i2.out ? Math.round(i2.out * a2.dur) : 0, t: 0 };
    o2.delay <= 0 && Ns(e3, o2), e3.shots.push(o2), K(e3, `mirror`) && !i2.mirrored && e3.rng() < 0.25 && Ms(e3, t2, n2, r2 + 0.14, { ...i2, mirrored: true, delay: (i2.delay || 0) + 3 });
}
function Ns(e3?: any, t2?: any): any {
    let n2: any = Math.cos(t2.angle), r2: any = Math.sin(t2.angle);
    t2.body = { x: W(e3) + n2 * 18, y: G(e3) + r2 * 18, vx: n2 * t2.speed, vy: r2 * t2.speed };
}
function Ps(e3?: any, t2?: any): any {
    t2.blast && t2.body && ic(e3, t2.body.x, t2.body.y, t2.blast, t2.dmg * 0.6, t2.kind === `wisp` ? 16758890 : 12575743, false, t2.w), t2.body = null, t2.done = true;
}
var Fs: any = { knife: `#e6edf3`, bolt: `#9fd0ff`, wisp: `#ffc88a`, sickle: `#e8eef4` };
function Is(e3?: any, t2?: any, n2?: any): any {
    if (t2.hit.has(n2) || t2.done)
        return;
    t2.hit.add(n2);
    let r2: any = t2.body ? Math.atan2(t2.body.vy, t2.body.vx) : t2.angle, i2: any = Fs[t2.kind] || `#9fd0ff`, a2: any = t2.kind === `knife` ? 60 : t2.kind === `sickle` ? 90 : 110;
    q(e3, n2, t2.dmg, Math.cos(r2), Math.sin(r2), a2, i2, t2.w), Go(e3, n2.body.x, n2.body.y, 0, 0, gn(i2), 12, 2, 10, 20), t2.kind === `wisp` ? (t2.blast && ic(e3, n2.body.x, n2.body.y, t2.blast, t2.dmg * 0.4, 16758890, false, t2.w), t2.pierce-- <= 0 ? (t2.blast = 0, Ps(e3, t2)) : t2.homing = null) : t2.pierce-- <= 0 && Ps(e3, t2);
}
function Ls(e3?: any): any {
    let { W: t2, H: n2 }: any = e3.world;
    for (let r2: any = e3.shots.length - 1; r2 >= 0; r2--) {
        let i2: any = e3.shots[r2];
        if (!i2.body && !i2.done)
            --i2.delay <= 0 && Ns(e3, i2);
        else {
            if (i2.body) {
                i2.t++;
                let r3: any = i2.body;
                if (i2.kind === `wisp`) {
                    i2.homing?.alive || (i2.homing = oc(e3, 3, 420, r3.x, r3.y).find((e4?: any) => !i2.hit.has(e4)) || null);
                    let t3: any = Math.min(i2.speed * 2.2, M(r3.vx, r3.vy) + 10), n3: any = Math.cos(i2.angle), a2: any = Math.sin(i2.angle);
                    if (i2.homing) {
                        let e4: any = i2.homing.body, t4: any = M(e4.x - r3.x, e4.y - r3.y);
                        n3 = (e4.x - r3.x) / t4, a2 = (e4.y - r3.y) / t4;
                    }
                    r3.vx += (n3 * t3 - r3.vx) * 0.1, r3.vy += (a2 * t3 - r3.vy) * 0.1, i2.angle = Math.atan2(r3.vy, r3.vx), i2.t % 3 == 0 && Go(e3, r3.x, r3.y, 0, 0, 16752720, 16, 2.2, 14, 20);
                }
                else if (i2.kind === `sickle`) {
                    if (i2.t < i2.out)
                        r3.vx *= 0.965, r3.vy *= 0.965;
                    else {
                        i2.back || (i2.back = true, i2.hit.clear());
                        let t3: any = W(e3) - r3.x, n3: any = G(e3) - r3.y, a2: any = M(t3, n3), o2: any = Math.min(760, M(r3.vx, r3.vy) + 30);
                        r3.vx += (t3 / a2 * o2 - r3.vx) * 0.2, r3.vy += (n3 / a2 * o2 - r3.vy) * 0.2, a2 < 22 && Ps(e3, i2);
                    }
                }
                if (i2.body && --i2.life <= 0)
                    Ps(e3, i2);
                else if (i2.body) {
                    let r4: any = i2.body;
                    (r4.x < -20 || r4.x > t2 + 20 || r4.y < -20 || r4.y > n2 + 20) && Ps(e3, i2);
                }
            }
            i2.done && e3.shots.splice(r2, 1);
        }
    }
}
function Rs(e3?: any, t2?: any): any {
    if ((t2.life ?? 0) % 12 == 0)
        for (let n2 of e3.monsters) {
            if (!n2.alive)
                continue;
            let r2: any = n2.body.x - t2.x, i2: any = n2.body.y - t2.y, a2: any = t2.r + n2.def.r;
            r2 * r2 + i2 * i2 < a2 * a2 && (q(e3, n2, t2.dmg ?? 0, 0, 0, 0, `#7ad8ff`, t2.src), n2.body.setVel(n2.body.vx * 0.7, n2.body.vy * 0.7));
        }
}
function zs(e3?: any): any {
    let { start: t2 }: any = e3.world, n2: any = e3.phys.circle(t2.x, t2.y, 14, { density: 3, friction: 0.3, restitution: 0, groups: On.hero, lockRotation: true });
    return { def: e3.heroDef, body: n2, hp: 100, maxHp: 100, face: -Math.PI / 2, moveX: 0, moveY: 0, speedNow: 0, dist: 0, iframes: 0, hitFlash: 0, attackFlash: 0, level: 1, xp: 0, xpNext: pn(1), weapons: [], passives: {}, regenAcc: 0, stats: null, activeCd: 60, activeMax: jt[e3.heroDef.active].cd * 60, activeT: 0, tumble: 0, tumbleA: 0, sanct: 0, dig: 0, flareT: 0, ward: 0, swift: 0, revives: e3.hearthLv.revival || 0, onIce: false, stillT: 0 };
}
function Bs(e3?: any): any {
    let t2: any = e3.hero, n2: any = e3.heroDef, r2: any = (e4?: any) => t2.passives[e4] || 0, i2: any = (t3?: any) => e3.hearthLv[t3] || 0, a2: any = { speed: n2.speed * (1 + 0.08 * r2(`boots`) + 0.06 * i2(`swift`)), magnet: 90 * (1 + 0.3 * r2(`magnet`) + 0.2 * i2(`reach`)), cdMul: Math.max(0.35, (1 - 0.07 * r2(`tome`)) * (1 - 0.04 * i2(`haste`))), dmgMul: 0.82 * n2.might * (1 + 0.1 * r2(`fist`)) * (1 + 0.08 * i2(`might`)), armor: n2.armor + r2(`plate`) + i2(`armor`), regen: 0.3 * r2(`root`) + 0.3 * i2(`recovery`), area: n2.area * (1 + 0.1 * r2(`oil`)) * (1 + 0.06 * i2(`radiance`)), luck: 1 + 0.1 * r2(`clover`) + 0.08 * i2(`luck`), amount: r2(`quiver`) + i2(`legion`), growth: 1 + 0.05 * i2(`growth`) + 0.1 * r2(`feather`), dur: 1 + 0.15 * r2(`chrism`), proj: 1 + 0.1 * r2(`chrism`), greed: (1 + 0.1 * i2(`greed`)) * (e3.blood ? Rt.embers : 1), crit: 0.05 * (1 + 0.1 * r2(`clover`) + 0.08 * i2(`luck`)), activeMul: 1 };
    K(e3, `bloodseal`) && (a2.dmgMul *= 1.3), K(e3, `hourglass`) && (a2.cdMul = Math.max(0.3, a2.cdMul * 0.75)), K(e3, `pilgrim`) && (a2.speed *= 1.1), K(e3, `souljar`) && (a2.growth *= 1.3, a2.magnet *= 1.5), a2.activeMul = K(e3, `wick`) ? 0.6 : 1, t2.stats = a2;
    let o2: any = Math.round((n2.hp + 15 * r2(`heart`) + 15 * i2(`vitality`)) * (K(e3, `hourglass`) ? 0.8 : 1));
    o2 !== t2.maxHp && (t2.maxHp === 100 && t2.level === 1 && t2.xp === 0 ? t2.hp = o2 : t2.hp += Math.max(0, o2 - t2.maxHp), t2.maxHp = o2, t2.hp = Math.min(t2.hp, t2.maxHp));
}
function Vs(e3?: any, t2?: any, n2?: any, r2?: any): any {
    for (let i2 of e3.zones) {
        if (i2.kind !== t2)
            continue;
        let e4: any = n2 - i2.x, a2: any = r2 - i2.y;
        if (e4 * e4 + a2 * a2 < i2.r * i2.r)
            return true;
    }
    return false;
}
var Hs: any = (e3?: any) => e3.hearthLv[`m_${e3.heroDef.id}`] || 0;
var Us: any = (e3?: any) => 1 + (e3 >= 1 ? 0.4 : 0) + (e3 >= 3 ? 0.3 : 0);
function Ws(e3?: any, t2?: any): any {
    let n2: any = e3.hero, r2: any = n2.stats;
    n2.iframes > 0 && n2.iframes--, n2.hitFlash > 0 && n2.hitFlash--, n2.attackFlash > 0 && n2.attackFlash--, n2.activeCd > 0 && n2.activeCd--;
    let i2: any = t2?.mx || 0, a2: any = t2?.my || 0, o2: any = Math.hypot(i2, a2);
    o2 > 1 && (i2 /= o2, a2 /= o2), o2 > 0.05 && (n2.face = Math.atan2(a2, i2)), n2.moveX = i2, n2.moveY = a2;
    let s2: any = W(e3), c2: any = G(e3);
    n2.onIce = Vs(e3, `ice`, s2, c2);
    let l2: any = Vs(e3, `mud`, s2, c2) && n2.dig <= 0, u2: any = r2.speed * (l2 ? 0.62 : 1) * (n2.dig > 0 ? 1.45 : 1) * (n2.swift > 0 ? 1.4 : 1), d2: any = n2.body;
    if (n2.tumble > 0)
        n2.tumble--, d2.setVel(Math.cos(n2.tumbleA) * 720, Math.sin(n2.tumbleA) * 720), n2.tumble === 0 && Js(e3);
    else {
        let e4: any = n2.onIce ? 0.035 : 0.28;
        d2.setVel(ln(d2.vx, i2 * u2, e4), ln(d2.vy, a2 * u2, e4));
    }
    if (n2.speedNow = Math.hypot(d2.vx, d2.vy), n2.stillT = n2.speedNow < 25 && o2 < 0.05 ? (n2.stillT || 0) + 1 : 0, n2.dist += n2.speedNow * k, r2.regen > 0 && n2.hp < n2.maxHp && (n2.regenAcc += r2.regen * k, n2.regenAcc >= 1 && (n2.hp = Math.min(n2.maxHp, n2.hp + 1), n2.regenAcc--)), e3.wantActive && (e3.wantActive = false, n2.activeCd <= 0 && qs(e3)), n2.sanct > 0) {
        if (n2.sanct--, n2.sanct % 10 == 0 && (Gs(e3, 150, 60), Hs(e3) >= 2))
            for (let t3 of e3.monsters)
                t3.alive && !t3.def.prop && Math.hypot(t3.body.x - s2, t3.body.y - c2) < 70 + t3.def.r && q(e3, t3, 9 * Us(Hs(e3)), 0, 0, 0, `#ffe9a8`, `sanctuary`);
        n2.sanct === 0 && Js(e3);
    }
    if (n2.dig > 0 && (n2.dig--, n2.dig % 4 == 0 && Go(e3, s2, c2, (e3.rng() - 0.5) * 60, (e3.rng() - 0.5) * 60, 5917242, 24, 3.5, 2, 60), Hs(e3) >= 2 && n2.dig % 8 == 0 && e3.zones.push({ kind: `smoke`, x: s2, y: c2, r: 42, life: 240, T: 240, earth: true }), n2.dig === 0 && Js(e3)), n2.flareT > 0 && n2.flareT--, e3.itemCd > 0 && e3.itemCd--, e3.wantItem) {
        let t3: any = e3.wantItem;
        e3.wantItem = null, Xs(e3, t3);
    }
    if (n2.ward > 0 && n2.ward--, n2.swift > 0 && (n2.swift--, n2.swift % 3 == 0 && n2.speedNow > 60 && Go(e3, s2, c2, -n2.moveX * 40, -n2.moveY * 40, 8316807, 22, 2.6, 6, 10)), K(e3, `clapper`) && e3.clock % 480 == 0 && e3.clock > 0) {
        e3.rings.push({ x: W(e3), y: G(e3), r: 10, max: 220, t: 0, T: 22, color: 14729328 });
        for (let t3 of e3.monsters) {
            if (!t3.alive || t3.def.prop)
                continue;
            let n3: any = t3.body.x - W(e3), r3: any = t3.body.y - G(e3), i3: any = M(n3, r3);
            i3 < 220 + t3.def.r && q(e3, t3, 24, n3 / i3, r3 / i3, 380, `#e0c070`, `clapper`);
        }
        U(e3, `bigtoll`);
    }
    K(e3, `stormglass`) && e3.clock % 360 == 180 && gs(e3);
}
function Gs(e3?: any, t2?: any, n2?: any): any {
    let r2: any = W(e3), i2: any = G(e3);
    for (let a2 of e3.monsters) {
        if (!a2.alive || a2.def.boss || a2.def.prop || a2.def.part)
            continue;
        let e4: any = a2.body.x - r2, o2: any = a2.body.y - i2, s2: any = M(e4, o2);
        s2 < t2 + a2.def.r && a2.body.addVel(e4 / s2 * n2, o2 / s2 * n2);
    }
}
function Ks(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    e3.rings.push({ x: t2, y: n2, r: r2, max: 12, t: 0, T: 20, color: 11565823 }), H(e3, t2, n2, 18, 11565823, 3);
    for (let a2 of [...Array.from<any>(e3.monsters)]) {
        if (!a2.alive || a2.def.prop)
            continue;
        let o2: any = t2 - a2.body.x, s2: any = n2 - a2.body.y, c2: any = M(o2, s2);
        if (!(c2 > r2 + a2.def.r) && (q(e3, a2, i2, 0, 0, 0, `#c8a0ff`, `tumble`), a2.alive && !a2.def.boss && !a2.def.part)) {
            let e4: any = Math.min(420, c2 * 2.4) / Math.sqrt(a2.def.mass);
            a2.body.addVel(o2 / c2 * e4, s2 / c2 * e4), a2.stun = Math.max(a2.stun, 30);
        }
    }
    U(e3, `boom`, 0);
}
function qs(e3?: any): any {
    let t2: any = e3.hero, n2: any = t2.stats, r2: any = W(e3), i2: any = G(e3), a2: any = e3.heroDef.active, o2: any = Hs(e3), s2: any = Us(o2);
    if (t2.activeCd = Math.round(t2.activeMax * n2.cdMul * n2.activeMul * (o2 >= 1 ? 0.9 : 1)), t2.activeT = 30, U(e3, `active_${a2}`), a2 === `flare`) {
        let a3: any = 250 * n2.area * (o2 >= 3 ? 1.2 : 1);
        e3.rings.push({ x: r2, y: i2, r: 10, max: a3, t: 0, T: 22, color: 16773296 }), e3.flash = 0.9, t2.flareT = 40;
        for (let t3 of [...Array.from<any>(e3.monsters)]) {
            if (!t3.alive)
                continue;
            let n3: any = t3.body.x - r2, o3: any = t3.body.y - i2, c2: any = M(n3, o3);
            c2 > a3 + t3.def.r || (q(e3, t3, 40 * s2, n3 / c2, o3 / c2, 320, `#fff0b0`, `flare`), t3.alive && !t3.def.boss && (t3.stun = 100));
        }
        if (ac(e3, r2, i2, a3, 300), qo(e3, 8, 0.3), o2 >= 2 && e3.zones.push({ kind: `holy`, x: r2, y: i2, r: a3 * 0.55, life: 200, T: 200, dmg: 10 * s2, src: `flare`, sun: true }), o2 >= 3) {
            let n3: any = Math.round(t2.maxHp * 0.1);
            t2.hp = Math.min(t2.maxHp, t2.hp + n3), Ko(e3, r2, i2 - 26, `+${n3}`, `#7ee787`, 1.1);
        }
    }
    else if (a2 === `tumble`)
        t2.tumbleA = t2.moveX || t2.moveY ? Math.atan2(t2.moveY, t2.moveX) : t2.face, t2.tumble = 12, t2.iframes = Math.max(t2.iframes, 26), o2 >= 2 && Ks(e3, r2, i2, o2 >= 3 ? 250 : 190, (o2 >= 3 ? 55 : 35) * s2);
    else if (a2 === `sanctuary`) {
        t2.sanct = 190 + (o2 >= 2 ? 60 : 0);
        let n3: any = Math.round(t2.maxHp * 0.25);
        t2.hp = Math.min(t2.maxHp, t2.hp + n3), Ko(e3, r2, i2 - 26, `+${n3}`, `#7ee787`, 1.2), Gs(e3, 170, 420), e3.rings.push({ x: r2, y: i2, r: 10, max: 170, t: 0, T: 20, color: 16771496 });
    }
    else
        a2 === `dig` && (t2.dig = 100, t2.body.setGroups(On.heroDig), H(e3, r2, i2, 20, 5917242, 3));
}
function Js(e3?: any): any {
    let t2: any = e3.hero, n2: any = e3.heroDef.active, r2: any = W(e3), i2: any = G(e3), a2: any = Hs(e3), o2: any = Us(a2);
    if (n2 === `tumble`) {
        let t3: any = a2 >= 3 ? 20 : 10;
        for (let n3: any = 0; n3 < t3; n3++)
            Ys(e3, n3 / t3 * Math.PI * 2, 18 * o2, a2 >= 3 ? 4 : 2);
        U(e3, `bow`, 0);
    }
    else if (n2 === `dig`) {
        t2.body.setGroups(On.hero), t2.iframes = Math.max(t2.iframes, 30);
        let n3: any = 210 * t2.stats.area * (a2 >= 3 ? 1.4 : 1);
        e3.rings.push({ x: r2, y: i2, r: 10, max: n3, t: 0, T: 20, color: 10518624 }), e3.rings.push({ x: r2, y: i2, r: 10, max: n3 * 0.6, t: 0, T: 14, color: 13676688 }), H(e3, r2, i2, 40, 6969930, 4);
        for (let t3 of [...Array.from<any>(e3.monsters)]) {
            if (!t3.alive || t3.def.prop)
                continue;
            let s2: any = t3.body.x - r2, c2: any = t3.body.y - i2, l2: any = M(s2, c2);
            if (!(l2 > n3 + t3.def.r) && (q(e3, t3, 75 * o2, 0, 0, 0, `#d0b090`, `dig`), t3.alive && !t3.def.boss && !t3.def.part)) {
                let e4: any = (900 * (1 - l2 / (n3 + 40)) + 200) * (a2 >= 3 ? 1.6 : 1) / Math.sqrt(t3.def.mass);
                t3.body.addVel(s2 / l2 * e4, c2 / l2 * e4), t3.stun = a2 >= 3 ? 130 : 70;
            }
        }
        ac(e3, r2, i2, n3, 600), qo(e3, 10, 0.35), U(e3, `slam`);
    }
    else if (n2 === `sanctuary` && a2 >= 3) {
        e3.rings.push({ x: r2, y: i2, r: 20, max: 280, t: 0, T: 26, color: 16771496 });
        for (let t3 of [...Array.from<any>(e3.monsters)]) {
            if (!t3.alive)
                continue;
            let n3: any = t3.body.x - r2, a3: any = t3.body.y - i2, s2: any = M(n3, a3);
            s2 < 280 + t3.def.r && q(e3, t3, 80 * o2, n3 / s2, a3 / s2, 420, `#ffe9a8`, `sanctuary`);
        }
        ac(e3, r2, i2, 280, 360), qo(e3, 10, 0.4), U(e3, `bigtoll`);
    }
}
function Ys(e3?: any, t2?: any, n2: any = 18, r2: any = 2): any {
    let i2: any = Math.cos(t2), a2: any = Math.sin(t2);
    e3.shots.push({ kind: `bolt`, w: `tumble`, body: { x: W(e3) + i2 * 18, y: G(e3) + a2 * 18, vx: i2 * 560, vy: a2 * 560 }, angle: t2, dmg: n2, pierce: r2, r: 5, life: 50, speed: 560, delay: 0, blast: 0, hit: /* @__PURE__ */ new Set(), touching: /* @__PURE__ */ new Set(), homing: null, out: 0, t: 0 });
}
function Xs(e3?: any, t2?: any): any {
    let n2: any = Pt.find((e4?: any) => e4.id === t2), r2: any = e3.hero;
    if (!n2 || !((e3.items[t2] ?? 0) > 0) || e3.itemCd > 0 || e3.phase !== `play`)
        return false;
    if (n2.heal && r2.hp >= r2.maxHp)
        return U(e3, `locked`), false;
    e3.items[t2] = (e3.items[t2] ?? 0) - 1, e3.itemCd = Math.round(It * 60), e3.itemLog.push(t2), e3.itemsUsedTotal++;
    let i2: any = W(e3), a2: any = G(e3), o2: any = parseInt(n2.color.slice(1), 16);
    if (n2.heal) {
        let t3: any = Math.round(r2.maxHp * n2.heal);
        r2.hp = Math.min(r2.maxHp, r2.hp + t3), Ko(e3, i2, a2 - 26, `+${t3}`, `#7ee787`, 1.3), H(e3, i2, a2, 14, 8316807, 2.4), e3.rings.push({ x: i2, y: a2, r: 10, max: 90, t: 0, T: 18, color: 8316807 }), U(e3, `heal`);
    }
    else if (t2 === `ward`)
        r2.ward = (n2.dur ?? 0) * 60, e3.rings.push({ x: i2, y: a2, r: 10, max: 60, t: 0, T: 16, color: o2 }), U(e3, `ward`);
    else if (t2 === `draught`)
        r2.swift = (n2.dur ?? 0) * 60, H(e3, i2, a2, 12, o2, 2.2), U(e3, `draught`);
    else if (t2 === `firebomb`) {
        e3.flash = Math.max(e3.flash, 0.6), ic(e3, i2, a2, 300, 150, 16747066, false, `firebomb`);
        for (let t3 of e3.monsters)
            t3.alive && !t3.def.prop && Math.hypot(t3.body.x - i2, t3.body.y - a2) < 300 + t3.def.r && rc(t3, 12, 180);
        qo(e3, 12, 0.4);
    }
    else if (t2 === `lodestone`) {
        for (let t3 of e3.gems)
            t3.pull = true;
        for (let t3 of e3.pickups)
            t3.kind === `ember` && (t3.pull = true);
        e3.rings.push({ x: i2, y: a2, r: 10, max: 700, t: 0, T: 30, color: o2 }), U(e3, `magnet`);
    }
    return Jo(e3, `b_item_${t2}`, n2.color, 70), true;
}
function Zs(e3?: any): any {
    let t2: any = e3.hero;
    t2.revives > 0 ? (t2.revives--, t2.hp = Math.round(t2.maxHp * 0.5), t2.iframes = 150, Jo(e3, `b_revive`, `#ffd166`, 150), U(e3, `revive`), ic(e3, W(e3), G(e3), 360, 120, 16765286), e3.flash = 1) : (t2.hp = 0, e3.phase = `dead`, e3.tithe = Math.round((Math.floor(e3.clock / 60 / 5) + t2.level * 3) * t2.stats.greed), e3.embers += e3.tithe, e3.phaseT = 0, qo(e3, 18, 0.6), H(e3, W(e3), G(e3), 40, 15026253, 4), Jo(e3, `b_dead`, `#ff6b6b`, 240), U(e3, `death`));
}
var W: any = (e3?: any) => e3.hero.body.x;
var G: any = (e3?: any) => e3.hero.body.y;
var K: any = (e3?: any, t2?: any) => e3.relics.includes(t2);
var Qs: any = { mon: On.mon, ghost: On.ghost, worm: On.worm, thrown: On.thrown, none: On.none, candle: On.none };
function $s(e3?: any, t2?: any): any {
    e3.filter = t2, e3.body.setGroups(Qs[t2]);
}
function ec(e3?: any, t2?: any, n2?: any, r2?: any, i2: any = {}): any {
    let a2: any = qa[t2];
    if (!a2)
        return null;
    let { W: o2, H: s2 }: any = e3.world;
    n2 = j(n2, a2.r + 8, o2 - a2.r - 8), r2 = j(r2, a2.r + 8, s2 - a2.r - 8);
    let c2: any = i2.r ?? a2.r, l2: any = a2.prop ? `candle` : a2.ghost ? `ghost` : a2.part || a2.ai === `worm` ? `worm` : `mon`, u2: any = e3.phys.circle(n2, r2, c2, { kind: a2.prop ? `fixed` : `dynamic`, density: a2.mass, friction: 0.2, restitution: 0.05, groups: Qs[l2], lockRotation: true }), d2: any = e3.clock / (e3.stage.bossAt * 60), f2: any = a2.boss || a2.prop ? 1 : 1 + Math.min(1.2, d2) * 1.25, p2: any = a2.boss || a2.elite ? 1 : Math.min(1, 0.35 + d2 * 1.3), m2: any = a2.hp * (a2.prop ? 1 : 1 + (e3.hpMul - 1) * p2) * f2 * (i2.hpMul ?? 1), h2: any = { def: a2, id: t2, body: u2, r: c2, filter: l2, alive: true, hp: m2, maxHp: m2, scale: a2.scale || 1, face: Math.atan2(G(e3) - r2, W(e3) - n2), wobble: e3.rng() * 6.28, seed: e3.rng(), hitFlash: 0, touchFrame: -9, orbCd: 0, spitCd: 90 + Math.floor(e3.rng() * 120), dash: 0, dashCd: 200 + Math.floor(e3.rng() * 90), wind: 0, windKind: ``, t: 0, slamCd: 420, summonCd: 360, phase: 0, stun: 0, burn: 0, burnDmg: 0, slow: 1, thrown: 0, anim: e3.rng() * 6.28, born: e3.frame, hidden: 0, lastSrc: ``, healedAt: -1e9, haste: 0, censerCd: 0, combo: 0, scA: 0, spiral: 0, zones: 0, thrownDmg: 0, thrownSrc: ``, reap: false, idleA: 0, idleR: 0, z: -1, segs: null, parent: null, segR: 0, index: 0, segHits: null, along: 0, trail: null, faceVis: 0, faceInit: false, colState: -1, slotCheck: -1 };
    return e3.phys.setOwner(u2, h2), e3.monsters.push(h2), a2.boss && (e3.boss = h2), a2.elite && e3.elites.push(h2), h2;
}
function tc(e3?: any): any {
    e3.alive = false, e3.body.remove();
}
function nc(e3?: any, t2?: any, n2: any = false): any {
    if (!t2.alive)
        return;
    tc(t2);
    let { x: r2, y: i2 }: any = t2.body, a2: any = t2.def;
    if (t2.segs)
        for (let n3 of t2.segs)
            n3.alive && (tc(n3), H(e3, n3.body.x, n3.body.y, 12, a2.c, 3));
    if (!n2) {
        if (a2.prop)
            H(e3, r2, i2, 14, 16765322, 2.5), U(e3, `candle`), fc(e3, r2, i2);
        else {
            if (e3.kills++, K(e3, `leechtooth`) && e3.kills % 3 == 0 && e3.hero.hp < e3.hero.maxHp && (e3.hero.hp = Math.min(e3.hero.maxHp, e3.hero.hp + 1)), K(e3, `ravenskull`) && e3.kills % 150 == 0 && e3.pickups.push({ kind: `chest`, x: r2, y: i2, t: 0 }), e3.killsBy[t2.lastSrc] = (e3.killsBy[t2.lastSrc] || 0) + 1, H(e3, r2, i2, a2.boss ? 70 : a2.elite ? 30 : 5, a2.c, a2.boss ? 4 : 2), a2.xp && lc(e3, r2, i2, a2.xp), dc(e3, t2), (e3.kills % 3 == 0 || a2.elite || a2.boss) && U(e3, `kill`, a2.heavy || a2.elite ? 1 : 0), a2.split)
                for (let t3: any = 0; t3 < 2; t3++) {
                    let t4: any = e3.rng() * 6.28;
                    ec(e3, a2.split, r2 + Math.cos(t4) * 10, i2 + Math.sin(t4) * 10)?.body.addVel(Math.cos(t4) * 120, Math.sin(t4) * 120);
                }
            if (a2.explode && ic(e3, r2, i2, a2.explode.r, a2.explode.dmg * e3.dmgMul, 16742970, true), a2.elite || a2.boss) {
                let n3: any = !a2.boss && e3.relics.length + e3.relicPending < 2 && (!e3.relicDropped || e3.rng() < 0.4);
                n3 && (e3.relicDropped = true, Jo(e3, `b_relicChest`, `#c8a0ff`, 150)), e3.pickups.push({ kind: `chest`, x: r2, y: i2, t: 0, relic: n3 }), Jo(e3, a2.boss ? `b_bossDown` : `b_eliteDown`, `#ffd166`, 150), qo(e3, a2.boss ? 18 : 8, 0.5), U(e3, a2.boss ? `bossDie` : `eliteDie`), uc(e3, r2, i2, a2.boss ? 60 : 10), a2.boss ? (e3.boss = null, Zo(e3, t2)) : e3.elites = e3.elites.filter((e4?: any) => e4 !== t2);
            }
        }
    }
}
function q(e3?: any, t2?: any, n2?: any, r2: any = 0, i2: any = 0, a2: any = 0, o2: any = `#ffffff`, s2: any = ``): any {
    if (!t2.alive)
        return 0;
    if (t2.def.part) {
        t2.hitFlash = 5;
        let r3: any = t2.parent;
        if (!r3?.alive)
            return 0;
        r3.segHits ??= {};
        let i3: any = r3.segHits[s2];
        if (i3 && e3.frame - i3.frame < 8) {
            if (n2 <= i3.dmg)
                return 0;
            let t3: any = (n2 - i3.dmg) * 0.6;
            return i3.dmg = n2, q(e3, r3, t3, 0, 0, 0, o2, s2);
        }
        return r3.segHits[s2] = { frame: e3.frame, dmg: n2 }, q(e3, r3, n2 * 0.6, 0, 0, 0, o2, s2);
    }
    if (t2.hidden > 0)
        return 0;
    let c2: any = e3.hero.stats, l2: any = e3.rng() < c2.crit, u2: any = K(e3, `pilgrim`) && e3.hero.stillT > 45 ? 1.4 : 1, d2: any = Math.max(1, Math.round(n2 * c2.dmgMul * u2 * (0.9 + e3.rng() * 0.2) * (l2 ? 2 : 1)));
    if (t2.hp -= d2, t2.hitFlash = 6, s2 !== `burn` && K(e3, `reliquary`) && e3.rng() < 0.15 && rc(t2, Math.max(4, d2 * 0.25), 120), t2.lastSrc = s2, e3.dmgBy[s2] = (e3.dmgBy[s2] || 0) + d2, a2 > 0 && !t2.def.boss && !t2.def.prop && t2.body.dynamic) {
        let e4: any = a2 / Math.sqrt(t2.def.mass) * (t2.def.heavy ? 0.6 : 1);
        t2.body.addVel(r2 * e4, i2 * e4);
    }
    return (e3.floaters.length < 40 || l2 || t2.def.elite || t2.def.boss) && Ko(e3, t2.body.x, t2.body.y - t2.def.r - 6, String(d2), l2 ? `#ffe066` : o2, l2 ? 1.25 : t2.def.boss ? 1.1 : 0.85), e3.hitsThisFrame++, t2.hp <= 0 && nc(e3, t2), d2;
}
function rc(e3?: any, t2?: any, n2?: any): any {
    e3.alive && !e3.def.prop && (e3.burn = Math.max(e3.burn, n2), e3.burnDmg = Math.max(e3.burnDmg, t2));
}
function ic(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2: any = false, s2: any = ``): any {
    e3.rings.push({ x: t2, y: n2, r: 8, max: r2, t: 0, T: 18, color: a2 }), H(e3, t2, n2, 16, a2, 3), U(e3, `boom`, +(r2 > 150));
    for (let a3 of e3.monsters) {
        if (!a3.alive)
            continue;
        let c2: any = a3.body.x - t2, l2: any = a3.body.y - n2, u2: any = M(c2, l2);
        u2 >= r2 + a3.def.r || (o2 ? !a3.def.boss && !a3.def.part && (a3.hp -= i2 * 0.6, a3.hitFlash = 4, a3.hp <= 0 && nc(e3, a3)) : q(e3, a3, i2, c2 / u2, l2 / u2, 200, `#ffb347`, s2));
    }
    ac(e3, t2, n2, r2, 260), o2 && Math.hypot(W(e3) - t2, G(e3) - n2) < r2 + 14 && sc(e3, i2, t2, n2);
}
function ac(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    for (let a2 of e3.world.props) {
        let e4: any = a2.body.x - t2, o2: any = a2.body.y - n2, s2: any = M(e4, o2);
        if (s2 < r2) {
            let t3: any = i2 * (1 - s2 / r2);
            a2.body.addVel(e4 / s2 * t3, o2 / s2 * t3);
        }
    }
}
function oc(e3?: any, t2?: any, n2?: any, r2: any = W(e3), i2: any = G(e3)): any {
    let a2: any = [], o2: any = n2 * n2;
    for (let t3 of e3.monsters) {
        if (!t3.alive || t3.def.prop || t3.hidden > 0)
            continue;
        let e4: any = t3.body.x - r2, n3: any = t3.body.y - i2, s2: any = e4 * e4 + n3 * n3;
        s2 < o2 && a2.push([s2, t3]);
    }
    if (t2 === 1) {
        let e4: any = null;
        for (let t3 of a2)
            (!e4 || t3[0] < e4[0]) && (e4 = t3);
        return e4 ? [e4[1]] : [];
    }
    return a2.sort((e4?: any, t3?: any) => e4[0] - t3[0]), a2.slice(0, t2).map((e4?: any) => e4[1]);
}
function sc(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    let a2: any = e3.hero;
    if (e3.phase !== `play` || a2.iframes > 0 || a2.hp <= 0 || a2.dig > 0 || a2.sanct > 0)
        return;
    let o2: any = W(e3), s2: any = G(e3);
    if (a2.ward > 0) {
        a2.iframes = 12, Ko(e3, o2, s2 - 22, `\u2727`, `#9fd8ff`, 1.1);
        return;
    }
    if (K(e3, `ghostlamp`) && e3.rng() < 0.15) {
        a2.iframes = 18, Ko(e3, o2, s2 - 22, `\u2727`, `#b8e0ff`, 1.2);
        return;
    }
    let c2: any = Math.max(1, Math.round(t2 * (K(e3, `bloodseal`) ? 1.2 : 1) - a2.stats.armor));
    if (i2?.alive && K(e3, `thorns`)) {
        let t3: any = i2.body.x - o2, n3: any = i2.body.y - s2, r3: any = M(t3, n3);
        q(e3, i2, c2 * 2 + 10, t3 / r3, n3 / r3, 260, `#c8a0ff`, `thorns`);
    }
    if (a2.hp -= c2, a2.iframes = 30, a2.hitFlash = 8, e3.damageTaken += c2, qo(e3, Math.min(10, 3 + c2 * 0.3), 0.18), Ko(e3, o2, s2 - 22, `-${c2}`, `#ff6b6b`, 1.1), H(e3, o2, s2, 6, 16739179, 2.2), U(e3, `hurt`), n2 !== void 0 && r2 !== void 0) {
        let e4: any = o2 - n2, t3: any = s2 - r2, i3: any = M(e4, t3);
        a2.body.addVel(e4 / i3 * 90, t3 / i3 * 90);
    }
    a2.hp > 0 && a2.hp < a2.maxHp * 0.3 && K(e3, `martyr`) && e3.frame > e3.martyrT && (e3.martyrT = e3.frame + 3600, a2.hp = Math.min(a2.maxHp, a2.hp + 20), Jo(e3, `b_martyr`, `#ffd166`, 90), ic(e3, o2, s2, 380, 140, 16765286, false, `martyr`)), a2.hp <= 0 && Zs(e3);
}
function cc(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any): any {
    let a2: any = Math.cos(r2), o2: any = Math.sin(r2);
    e3.spits.push({ body: { x: t2 + a2 * 16, y: n2 + o2 * 16, vx: a2 * i2.speed, vy: o2 * i2.speed }, dmg: i2.dmg * e3.dmgMul, life: i2.life || 150, angle: r2, color: i2.color, r: i2.r || 5, big: i2.big, arrow: i2.arrow, home: i2.home || 0 });
}
function lc(e3?: any, t2?: any, n2?: any, r2?: any): any {
    if (e3.gems.push({ x: t2 + (e3.rng() - 0.5) * 12, y: n2 + (e3.rng() - 0.5) * 12, xp: r2, vx: 0, vy: 0, pull: false, bob: e3.rng() * 6.28 }), e3.gems.length <= 360)
        return;
    let i2: any = 0, a2: any = 0, o2: any = 0, s2: any = 0, c2: any = W(e3), l2: any = G(e3);
    for (let t3: any = 0; t3 < e3.gems.length && s2 < 80; t3++) {
        let n3: any = e3.gems[t3];
        !n3.pull && Math.hypot(n3.x - c2, n3.y - l2) > 300 && (i2 += n3.xp, a2 += n3.x, o2 += n3.y, s2++, e3.gems.splice(t3, 1), t3--);
    }
    s2 > 0 && e3.gems.push({ x: a2 / s2, y: o2 / s2, xp: i2, vx: 0, vy: 0, pull: false, bob: 0 });
}
function uc(e3?: any, t2?: any, n2?: any, r2?: any): any {
    let i2: any = Math.min(8, Math.max(1, Math.ceil(r2 / 5))), a2: any = r2;
    for (let o2: any = 0; o2 < i2; o2++) {
        let s2: any = o2 === i2 - 1 ? a2 : Math.ceil(r2 / i2);
        a2 -= s2;
        let c2: any = e3.rng() * 6.28, l2: any = i2 > 1 ? 10 + e3.rng() * 26 : 0;
        e3.pickups.push({ kind: `ember`, x: t2 + Math.cos(c2) * l2, y: n2 + Math.sin(c2) * l2, t: 0, v: s2 });
    }
}
function dc(e3?: any, t2?: any): any {
    let n2: any = e3.rng(), r2: any = e3.hero.stats.luck, i2: any = t2.def, { x: a2, y: o2 }: any = t2.body, s2: any = i2.heavy ? n2 < 0.14 * r2 ? `bread` : null : i2.ai === `ranged` ? n2 < 0.06 * r2 ? `magnet` : null : i2.ghost ? n2 < 0.045 * r2 ? `flare` : null : n2 < 6e-3 * r2 ? `bread` : n2 < 85e-4 * r2 ? `hourglass` : null;
    s2 && e3.pickups.push({ kind: s2, x: a2, y: o2, t: 0 }), e3.rng() < (i2.heavy ? 0.3 : 0.05) * r2 && uc(e3, a2, o2, i2.heavy ? 3 : 1);
}
function fc(e3?: any, t2?: any, n2?: any): any {
    let r2: any = e3.rng();
    r2 < 0.14 ? e3.pickups.push({ kind: `bread`, x: t2, y: n2, t: 0 }) : r2 < 0.3 ? e3.pickups.push({ kind: `magnet`, x: t2, y: n2, t: 0 }) : r2 < 0.5 ? e3.pickups.push({ kind: `flare`, x: t2, y: n2, t: 0 }) : r2 < 0.58 ? e3.pickups.push({ kind: `hourglass`, x: t2, y: n2, t: 0 }) : uc(e3, t2, n2, r2 < 0.64 ? 15 : 3 + Math.floor(e3.rng() * 4));
}
function pc(e3?: any, t2: any = 560, n2: any = 660): any {
    let { W: r2, H: i2 }: any = e3.world, a2: any = W(e3), o2: any = G(e3);
    for (let s2: any = 0; s2 < 12; s2++) {
        let s3: any = e3.rng() * Math.PI * 2, c2: any = t2 + e3.rng() * (n2 - t2), l2: any = a2 + Math.cos(s3) * c2, u2: any = o2 + Math.sin(s3) * c2;
        if (l2 > 40 && l2 < r2 - 40 && u2 > 40 && u2 < i2 - 40)
            return { x: l2, y: u2 };
    }
    for (let n3: any = 0; n3 < 20; n3++) {
        let n4: any = 60 + e3.rng() * (r2 - 120), s2: any = 60 + e3.rng() * (i2 - 120);
        if (Math.hypot(n4 - a2, s2 - o2) > t2)
            return { x: n4, y: s2 };
    }
    return { x: 60 + e3.rng() * (r2 - 120), y: 60 + e3.rng() * (i2 - 120) };
}
function mc(e3?: any, t2?: any, n2?: any, r2: any = 1, i2: any = 0.16): any {
    let a2: any = t2 - e3.body.x, o2: any = n2 - e3.body.y, s2: any = M(a2, o2), c2: any = e3.def.speed * r2 * e3.slow * (e3.haste > 0 ? 1.55 : 1);
    e3.body.setVel(ln(e3.body.vx, a2 / s2 * c2, i2), ln(e3.body.vy, o2 / s2 * c2, i2)), e3.face = Math.atan2(o2, a2);
}
var hc: any = (e3?: any, t2?: any, n2?: any) => e3.body.setVel(Math.cos(t2) * n2, Math.sin(t2) * n2);
var gc: any = (e3?: any, t2: any = 0.8) => e3.body.setVel(e3.body.vx * t2, e3.body.vy * t2);
function _c(e3?: any, t2?: any): any {
    if (t2.def.boss)
        return 1;
    let n2: any = 1;
    for (let r2 of e3.zones) {
        if (r2.kind === `smoke`) {
            let e5: any = t2.body.x - r2.x, i3: any = t2.body.y - r2.y;
            e5 * e5 + i3 * i3 < r2.r * r2.r && (n2 = Math.min(n2, 0.5));
            continue;
        }
        if (t2.def.fly || t2.def.ghost || r2.kind !== `mud` && r2.kind !== `ash`)
            continue;
        let e4: any = t2.body.x - r2.x, i2: any = t2.body.y - r2.y;
        e4 * e4 + i2 * i2 < r2.r * r2.r && (n2 = Math.min(n2, r2.kind === `mud` ? 0.55 : 0.82));
    }
    return n2;
}
var vc: any = {};
function yc(e3?: any): any {
    vc = e3;
}
function bc(e3?: any): any {
    let t2: any = W(e3), n2: any = G(e3), r2: any = e3.freeze > 0;
    for (let i2: any = e3.monsters.length - 1; i2 >= 0; i2--) {
        let a2: any = e3.monsters[i2];
        if (!a2.alive) {
            e3.monsters.splice(i2, 1);
            continue;
        }
        let o2: any = a2.def;
        if (a2.hitFlash > 0 && a2.hitFlash--, o2.prop || (a2.orbCd > 0 && a2.orbCd--, a2.haste > 0 && (a2.haste--, a2.haste % 6 == 0 && Go(e3, a2.body.x, a2.body.y, 0, 0, 14203135, 18, 2.4, o2.r * 1.2, 30)), a2.t++, a2.anim += 1 / 60 * (o2.speed / 40 + 2) * (r2 || a2.stun > 0 ? 0.1 : 1), a2.burn > 0 && (a2.burn--, a2.burn % 20 == 0 && q(e3, a2, a2.burnDmg, 0, 0, 0, `#ff9a4a`, `burn`), a2.burn % 6 == 0 && Go(e3, a2.body.x, a2.body.y, 0, 0, 16747066, 20, 2.5, o2.r * 1.5, 40)), !a2.alive))
            continue;
        if (a2.thrown > 0) {
            a2.thrown--, a2.thrown === 0 && xc(e3, a2);
            continue;
        }
        if (a2.segs && Dc(a2), o2.part)
            continue;
        if ((e3.frame + i2) % 6 == 0 && (a2.slow = _c(e3, a2)), r2 && !o2.boss) {
            gc(a2, 0.7);
            continue;
        }
        if (a2.stun > 0) {
            a2.stun--, gc(a2, 0.85);
            continue;
        }
        let s2: any = t2 - a2.body.x, c2: any = n2 - a2.body.y, l2: any = M(s2, c2);
        if (l2 > 1150 && !o2.elite && !o2.boss) {
            let t3: any = pc(e3, 560, 640);
            a2.body.setPos(t3.x, t3.y), a2.body.setVel(0, 0);
            continue;
        }
        let u2: any = vc[o2.ai];
        u2 ? u2(e3, a2, s2, c2, l2, t2, n2) : mc(a2, t2, n2);
    }
}
function xc(e3?: any, t2?: any): any {
    t2.body.setEvents(false), $s(t2, t2.def.ghost ? `ghost` : `mon`), t2.reap && ic(e3, t2.body.x, t2.body.y, 80, t2.thrownDmg * 0.8, 13805823, false, t2.thrownSrc);
}
function Sc(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any): any {
    for (let o2: any = 0; o2 < i2; o2++) {
        let s2: any = o2 / i2 * Math.PI * 2;
        ec(e3, t2, n2 + Math.cos(s2) * a2, r2 + Math.sin(s2) * a2);
    }
    H(e3, n2, r2, 20, qa[t2].c, 3), U(e3, `summon`);
}
function Cc(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
    e3.rings.push({ x: t2, y: n2, r: 10, max: r2, t: 0, T: 22, color: o2 }), qo(e3, 14, 0.45), U(e3, `slam`);
    for (let i3 of e3.monsters) {
        if (!i3.alive || i3.def.boss || i3.def.part || i3.def.prop)
            continue;
        let e4: any = i3.body.x - t2, o3: any = i3.body.y - n2, s3: any = Math.hypot(e4, o3);
        if (s3 < r2 && s3 > 1) {
            let t3: any = a2 * (1 - s3 / r2) / Math.sqrt(i3.def.mass) + 60;
            i3.body.addVel(e4 / s3 * t3, o3 / s3 * t3);
        }
    }
    ac(e3, t2, n2, r2, a2 * 0.8);
    let s2: any = W(e3) - t2, c2: any = G(e3) - n2, l2: any = M(s2, c2);
    if (l2 < r2) {
        let t3: any = a2 * 0.9 * (1 - l2 / r2) + 120;
        e3.hero.body.addVel(s2 / l2 * t3, c2 / l2 * t3), sc(e3, i2 * e3.dmgMul);
    }
}
function wc(e3?: any, t2?: any): any {
    let n2: any = pc(e3, 460, 540);
    if (t2 === `wormhead`)
        return Ec(e3, n2.x, n2.y);
    let r2: any = ec(e3, t2, n2.x, n2.y);
    return r2 && H(e3, n2.x, n2.y, 40, r2.def.c, 4), r2;
}
var Tc: any = 4;
function Ec(e3?: any, t2?: any, n2?: any): any {
    let r2: any = ec(e3, `wormhead`, t2, n2);
    if (!r2)
        return null;
    r2.segs = [];
    let i2: any = r2, a2: any = 0, o2: any = Math.atan2(n2 - G(e3), t2 - W(e3));
    for (let s2: any = 0; s2 < 14; s2++) {
        let c2: any = 22 * (1 - s2 / 14 * 0.45);
        a2 += ((i2 === r2 ? r2.def.r : i2.segR) + c2 - 6) * 0.82;
        let l2: any = ec(e3, `wormseg`, t2 + Math.cos(o2) * a2, n2 + Math.sin(o2) * a2, { r: c2 });
        if (!l2)
            break;
        l2.segR = c2, l2.parent = r2, l2.index = s2, l2.along = a2, r2.segs.push(l2), i2 = l2;
    }
    r2.trail = [];
    for (let e4: any = 0; e4 <= a2 + 40; e4 += Tc)
        r2.trail.push({ x: t2 + Math.cos(o2) * e4, y: n2 + Math.sin(o2) * e4 });
    return r2;
}
function Dc(e3?: any): any {
    let t2: any = e3.trail, n2: any = e3.segs, r2: any = e3.body.x, i2: any = e3.body.y, a2: any = Math.hypot(r2 - t2[0].x, i2 - t2[0].y);
    if (a2 >= Tc) {
        for (; a2 >= Tc;) {
            let e5: any = t2[0];
            t2.unshift({ x: e5.x + (r2 - e5.x) / a2 * Tc, y: e5.y + (i2 - e5.y) / a2 * Tc }), a2 -= Tc;
        }
        let e4: any = Math.ceil((n2.at(-1)?.along ?? 0) / Tc) + 4;
        t2.length > e4 && (t2.length = e4);
    }
    let o2: any = Math.hypot(r2 - t2[0].x, i2 - t2[0].y);
    for (let e4 of n2) {
        if (!e4.alive)
            continue;
        let n3: any = Math.max(0, (e4.along - o2) / Tc), r3: any = Math.min(t2.length - 2, Math.floor(n3)), i3: any = Math.min(1, n3 - r3), a3: any = t2[r3], s2: any = t2[r3 + 1], c2: any = a3.x + (s2.x - a3.x) * i3, l2: any = a3.y + (s2.y - a3.y) * i3, u2: any = e4.body, d2: any = Math.hypot(c2 - u2.x, l2 - u2.y);
        d2 > 30 && u2.setPos(c2 + (u2.x - c2) * (30 / d2), l2 + (u2.y - l2) * (30 / d2));
        let f2: any = (c2 - u2.x) * 18, p2: any = (l2 - u2.y) * 18, m2: any = Math.hypot(f2, p2);
        m2 > 1100 && (f2 *= 1100 / m2, p2 *= 1100 / m2), u2.setVel(f2, p2), e4.face = Math.atan2(a3.y - s2.y, a3.x - s2.x);
    }
}
function Oc(e3?: any): any {
    if (e3.hero.iframes > 0)
        return;
    let t2: any = null;
    for (let n3 of e3.monsters)
        n3.alive && n3.touchFrame === e3.frame - 1 && n3.hidden <= 0 && (!t2 || n3.def.dmg > t2.def.dmg) && (t2 = n3);
    t2 && sc(e3, t2.def.dmg * e3.dmgMul, t2.body.x, t2.body.y, t2);
    let n2: any = W(e3), r2: any = G(e3);
    for (let t3 of e3.hazards)
        if (Math.hypot(t3.x - n2, t3.y - r2) < t3.r + 14) {
            sc(e3, t3.dmg, t3.x, t3.y);
            break;
        }
    for (let t3 of e3.zones)
        if (t3.kind === `fire` && Math.hypot(t3.x - n2, t3.y - r2) < t3.r + 7) {
            sc(e3, 9 * e3.dmgMul);
            break;
        }
}
function kc(e3?: any): any {
    let t2: any = e3.hero, n2: any = [], r2: any = t2.weapons.length, i2: any = Object.keys(t2.passives).length;
    for (let i3 of zt) {
        if (e3.banished.has(i3) || !e3.unlocked.has(i3))
            continue;
        let a3: any = t2.weapons.find((e4?: any) => e4.id === i3 || Bt[e4.id].evolved && Wt(e4.id) === i3);
        a3 && (a3.evolved || a3.level >= 7) || !a3 && r2 >= 6 || n2.push({ kind: `weapon`, id: i3, wt: a3 ? 3 : r2 >= 4 ? 1 : 2.2, level: 0, color: `` });
    }
    for (let r3 of Vt) {
        if (e3.banished.has(r3))
            continue;
        let a3: any = t2.passives[r3] || 0;
        if (a3 >= Ht(r3) || !a3 && i2 >= 6)
            continue;
        let o3: any = t2.weapons.some((e4?: any) => Bt[e4.id].evo === r3);
        n2.push({ kind: `passive`, id: r3, wt: (a3 ? 2 : 1.5) * (o3 ? 1.4 : 1), level: 0, color: `` });
    }
    let a2: any = 3 + +(e3.rng() < (t2.stats.luck - 1) * 1.5), o2: any = [];
    for (; o2.length < a2 && n2.length;) {
        let t3: any = 0;
        for (let e4 of n2)
            t3 += e4.wt;
        let r3: any = e3.rng() * t3, i3: any = 0;
        for (; i3 < n2.length && (r3 -= n2[i3].wt, !(r3 <= 0)); i3++)
            ;
        o2.push(n2.splice(Math.min(i3, n2.length - 1), 1)[0]);
    }
    o2.length || o2.push({ kind: `gold`, id: `gold`, level: 0, color: `` }, { kind: `heal`, id: `heal`, level: 0, color: `` }), e3.cards = o2.map((t3?: any) => Ac(e3, t3)), e3.rollId++;
}
function Ac(e3?: any, t2?: any): any {
    let n2: any = e3.hero;
    if (t2.kind === `weapon`) {
        let e4: any = t2.id, r2: any = n2.weapons.find((t3?: any) => t3.id === e4), i2: any = r2 ? r2.level : 0, a2: any = is(e4, i2 + 1), o2: any = i2 ? is(e4, i2) : null, s2: any = [];
        if (o2)
            for (let e5 of Object.keys(a2))
                a2[e5] !== o2[e5] && s2.push([e5, o2[e5], a2[e5]]);
        return { ...t2, level: i2 + 1, isNew: !r2, diff: s2, color: Bt[e4].color };
    }
    if (t2.kind === `passive`) {
        let e4: any = n2.passives[t2.id] || 0;
        return { ...t2, level: e4 + 1, isNew: !e4, max: Ht(t2.id), color: `#9aa6b6` };
    }
    return { ...t2, level: 0, color: t2.kind === `gold` ? `#ffb347` : `#7ee787` };
}
function jc(e3?: any): any {
    e3.phase = `levelup`, e3.phaseT = 0, kc(e3), U(e3, `levelup`);
}
function Mc(e3?: any, t2?: any): any {
    if (e3.phase !== `levelup`)
        return;
    let n2: any = e3.cards[t2];
    n2 && (Nc(e3, n2), e3.levelUpQueue = Math.max(0, e3.levelUpQueue - 1), e3.levelUpQueue > 0 ? (kc(e3), U(e3, `levelup`)) : e3.phase = `play`);
}
function Nc(e3?: any, t2?: any): any {
    let n2: any = e3.hero;
    if (t2.kind === `weapon`)
        as(e3, t2.id);
    else if (t2.kind === `passive`) {
        let r2: any = t2.id;
        n2.passives[r2] = (n2.passives[r2] || 0) + 1, Bs(e3);
    }
    else
        t2.kind === `gold` ? e3.embers += 10 : n2.hp = Math.min(n2.maxHp, n2.hp + 30);
    H(e3, W(e3), G(e3), 16, 16765286, 3), e3.rings.push({ x: W(e3), y: G(e3), r: 10, max: 120, t: 0, T: 18, color: 16765286 }), U(e3, `pick`);
}
function Pc(e3?: any): any {
    e3.phase !== `levelup` || e3.rerolls <= 0 || (e3.rerolls--, kc(e3), U(e3, `reroll`));
}
function Fc(e3?: any, t2?: any): any {
    if (e3.phase !== `levelup` || e3.banishes <= 0)
        return;
    let n2: any = e3.cards[t2];
    !n2 || n2.kind !== `weapon` && n2.kind !== `passive` || (e3.banishes--, e3.banished.add(n2.id), e3.cards.splice(t2, 1), e3.cards.length || kc(e3), U(e3, `banish`));
}
function Ic(e3?: any): any {
    e3.phase === `levelup` && (e3.levelUpQueue = Math.max(0, e3.levelUpQueue - 1), e3.levelUpQueue > 0 ? kc(e3) : e3.phase = `play`);
}
function Lc(e3?: any): any {
    let t2: any = e3.hero, n2: any = os(e3), r2: any = [];
    if (n2.length) {
        let t3: any = n2[0], i3: any = t3.id;
        ss(e3, t3), r2.push({ kind: `evolve`, from: i3, id: t3.id });
    }
    else {
        let n3: any = e3.rng() * t2.stats.luck, i3: any = (n3 > 1.05 ? 3 : n3 > 0.75 ? 2 : 1) + +!!K(e3, `keys`);
        for (let t3: any = 0; t3 < i3; t3++) {
            kc(e3);
            let t4: any = e3.cards.find((e4?: any) => e4.kind === `weapon` && !e4.isNew) || e3.cards.find((e4?: any) => e4.kind === `passive` && !e4.isNew) || e3.cards[0];
            if (!t4)
                break;
            Nc(e3, t4), r2.push(t4);
        }
        e3.cards = [];
    }
    if (e3.relicPending > 0) {
        e3.relicPending--;
        let t3: any = Ut.filter((t4?: any) => !e3.relics.includes(t4));
        if (e3.relics.length < 2 && t3.length) {
            let n3: any = t3[Math.floor(e3.rng() * t3.length)];
            Rc(e3, n3), r2.unshift({ kind: `relic`, id: n3 });
        }
    }
    let i2: any = Math.round((15 + e3.stage.index * 5) * t2.stats.greed * (K(e3, `keys`) ? 1.6 : 1));
    e3.embers += i2, e3.chest = { items: r2, gold: i2, t: 0 }, e3.phase = `chest`, U(e3, `chest`, +(r2[0]?.kind === `evolve` || r2[0]?.kind === `relic`));
}
function Rc(e3?: any, t2?: any): any {
    e3.relics.push(t2), e3.relicsSeen.add(t2), t2 === `saintsbone` && e3.hero.revives++, Bs(e3);
}
function zc(e3?: any): any {
    e3.phase === `chest` && (e3.chest = null, e3.chestQueue = Math.max(0, e3.chestQueue - 1), e3.phase = `play`);
}
function Bc(e3?: any): any {
    let t2: any = e3.hero, n2: any = W(e3), r2: any = G(e3), i2: any = t2.stats.magnet;
    e3.gemStreakT > 0 && --e3.gemStreakT === 0 && (e3.gemStreak = 0);
    for (let t3: any = e3.gems.length - 1; t3 >= 0; t3--) {
        let a2: any = e3.gems[t3], o2: any = n2 - a2.x, s2: any = r2 - a2.y, c2: any = M(o2, s2);
        if (!a2.pull && c2 < i2 && (a2.pull = true), !a2.pull)
            continue;
        let l2: any = j(900 - c2 * 1.5, 380, 900);
        a2.vx = ln(a2.vx, o2 / c2 * l2, 0.2), a2.vy = ln(a2.vy, s2 / c2 * l2, 0.2), a2.x += a2.vx * k, a2.y += a2.vy * k, c2 < 20 && (e3.gems.splice(t3, 1), Hc(e3, a2.xp), e3.gemStreak++, e3.gemStreakT = 40, (e3.frame % 2 == 0 || ma(a2.xp) > 0) && U(e3, `gem`, Math.min(24, e3.gemStreak)));
    }
    for (let t3: any = e3.pickups.length - 1; t3 >= 0; t3--) {
        let a2: any = e3.pickups[t3];
        a2.t++;
        let o2: any = n2 - a2.x, s2: any = r2 - a2.y, c2: any = M(o2, s2);
        if (a2.kind === `ember` && (c2 < i2 * 1.2 || e3.bossKilledAt || a2.pull)) {
            let e4: any = j(900 - c2, 300, 900);
            a2.x += o2 / c2 * e4 * k, a2.y += s2 / c2 * e4 * k;
        }
        c2 < 28 && (e3.pickups.splice(t3, 1), Vc(e3, a2));
    }
}
function Vc(e3?: any, t2?: any): any {
    let n2: any = e3.hero, r2: any = W(e3), i2: any = G(e3);
    switch (t2.kind) {
        case `ember`: {
            let a2: any = Math.max(1, Math.round((t2.v ?? 1) * n2.stats.greed));
            e3.embers += a2, a2 > 2 && Ko(e3, r2, i2 - 24, `+${a2}`, `#ffb347`, 0.9), U(e3, `ember`);
            break;
        }
        case `bread`: {
            let t3: any = Math.round(n2.maxHp * 0.2);
            n2.hp = Math.min(n2.maxHp, n2.hp + t3), Ko(e3, r2, i2 - 24, `+${t3}`, `#7ee787`, 1.1), H(e3, r2, i2, 10, 8316807, 2), U(e3, `heal`);
            break;
        }
        case `magnet`:
            for (let t3 of e3.gems)
                t3.pull = true;
            Jo(e3, `b_magnet`, `#79c0ff`, 60), e3.rings.push({ x: r2, y: i2, r: 10, max: 700, t: 0, T: 30, color: 7979263 }), U(e3, `magnet`);
            break;
        case `flare`:
            e3.flash = 1, Jo(e3, `b_flare`, `#ffd166`, 60), ic(e3, r2, i2, 540, 100, 16765286, false, `flare`);
            for (let t3 of e3.monsters)
                t3.alive && t3.def.boss && q(e3, t3, 200, 0, 0, 0, `#ffd166`, `flare`);
            qo(e3, 14, 0.4);
            break;
        case `hourglass`:
            e3.freeze = 360, Jo(e3, `b_freeze`, `#9fd8ff`, 90), U(e3, `freeze`);
            break;
        case `chest`:
            e3.chestQueue++, t2.relic && e3.relics.length + e3.relicPending < 2 && e3.relicPending++, U(e3, `chestGet`);
    }
}
function Hc(e3?: any, t2?: any): any {
    let n2: any = e3.hero;
    for (n2.xp += t2 * n2.stats.growth; n2.xp >= n2.xpNext;)
        n2.xp -= n2.xpNext, n2.level++, n2.xpNext = pn(n2.level), e3.levelUpQueue++;
}
var Uc: any = 64;
var Wc: any = class {
    [key: string]: any;
    cells: any = new Map();
    pool: any = [];
    key(e3?: any, t2?: any): any {
        return (e3 + 512) * 4096 + (t2 + 512);
    }
    build(e3?: any): any {
        for (let e4 of this.cells.values())
            e4.length = 0, this.pool.push(e4);
        this.cells.clear();
        for (let t2 of e3) {
            if (!t2.alive || t2.filter === `none`)
                continue;
            let e4: any = this.key(Math.floor(t2.body.x / Uc), Math.floor(t2.body.y / Uc)), n2: any = this.cells.get(e4);
            n2 || this.cells.set(e4, n2 = this.pool.pop() ?? []), n2.push(t2);
        }
    }
    query(e3?: any, t2?: any, n2?: any, r2?: any): any {
        let i2: any = n2 + 48, a2: any = Math.floor((e3 - i2) / Uc), o2: any = Math.floor((e3 + i2) / Uc), s2: any = Math.floor((t2 - i2) / Uc), c2: any = Math.floor((t2 + i2) / Uc);
        for (let i3: any = a2; i3 <= o2; i3++)
            for (let a3: any = s2; a3 <= c2; a3++) {
                let o3: any = this.cells.get(this.key(i3, a3));
                if (o3)
                    for (let i4 of o3) {
                        let a4: any = i4.body.x - e3, o4: any = i4.body.y - t2, s3: any = n2 + i4.r;
                        a4 * a4 + o4 * o4 < s3 * s3 && r2(i4);
                    }
            }
    }
};
var Gc: any = new WeakMap();
var Kc: any = new Set();
function qc(e3?: any): any {
    for (let t2 of e3.shots)
        t2.body && (t2.body.x += t2.body.vx * k, t2.body.y += t2.body.vy * k);
    for (let t2 of e3.spits)
        t2.body && (t2.body.x += t2.body.vx * k, t2.body.y += t2.body.vy * k);
    for (let t2 of e3.orbs)
        t2.body.x += t2.body.vx * k, t2.body.y += t2.body.vy * k;
}
function Jc(e3?: any): any {
    qc(e3);
    let t2: any = Gc.get(e3);
    t2 || Gc.set(e3, t2 = new Wc()), t2.build(e3.monsters);
    for (let n3 of e3.shots)
        if (n3.body && !n3.done) {
            Kc.clear(), t2.query(n3.body.x, n3.body.y, n3.r, (e4?: any) => Kc.add(e4));
            for (let t3 of Kc)
                !n3.touching.has(t3) && t3.alive && Is(e3, n3, t3);
            n3.touching.clear();
            for (let e4 of Kc)
                n3.touching.add(e4);
        }
    for (let n3 of e3.orbs) {
        Kc.clear(), t2.query(n3.body.x, n3.body.y, n3.r, (e4?: any) => Kc.add(e4));
        for (let t3 of Kc)
            !n3.touching.has(t3) && t3.alive && ms(e3, n3, t3);
        n3.touching.clear();
        for (let e4 of Kc)
            n3.touching.add(e4);
    }
    let n2: any = e3.hero, r2: any = W(e3), i2: any = G(e3);
    if (n2.dig <= 0)
        for (let t3 of e3.spits) {
            if (!t3.body)
                continue;
            let n3: any = t3.body.x - r2, a2: any = t3.body.y - i2, o2: any = t3.r + 14;
            n3 * n3 + a2 * a2 < o2 * o2 && (sc(e3, t3.dmg, t3.body.x, t3.body.y), t3.body = null);
        }
    n2.dig <= 0 && t2.query(r2, i2, 15, (t3?: any) => {
        (t3.filter === `mon` || t3.filter === `ghost` || t3.filter === `worm`) && (t3.touchFrame = e3.frame);
    }), e3.phys.drainStarts((t3?: any, n3?: any) => {
        let r3: any = t3.thrown > 0 ? t3 : n3, i3: any = r3 === t3 ? n3 : t3;
        r3.thrown > 0 && bs(e3, r3, i3);
    });
}
function Yc(e3?: any, t2?: any): any {
    let [n2, r2]: any = t2.world, i2: any = dn(t2.index * 7919 + 20260926), a2: any = { W: n2, H: r2, obstacles: [], walls: [], props: [], zones: [], candles: [], decor: [], start: { x: n2 / 2, y: r2 * 0.6 }, beacon: null }, o2: any = a2.start, s2: any = (e4?: any, t3?: any, n3?: any) => Math.hypot(e4 - o2.x, t3 - o2.y) < n3, c2: any = (e4?: any) => ((e4.kind === `wall` ? a2.walls : a2.obstacles).push(e4), e4), l2: any = (t3?: any, n3?: any, r3?: any, i3?: any, a3?: any, o3: any = 0, s3: any = {}) => {
        let l3: any = e3.box(n3, r3, i3, a3, { kind: `fixed`, rotation: o3, groups: On.static });
        return c2({ kind: t3, w: i3, h: a3, rot: o3, ...s3, body: l3, x: n3, y: r3 });
    }, u2: any = (t3?: any, n3?: any, r3?: any, i3?: any, a3: any = {}) => {
        let o3: any = e3.circle(n3, r3, i3, { kind: `fixed`, groups: On.static });
        return c2({ kind: t3, r: i3, ...a3, body: o3, x: n3, y: r3 });
    };
    l2(`wall`, n2 / 2, -40, n2 + 160, 80), l2(`wall`, n2 / 2, r2 + 40, n2 + 160, 80), l2(`wall`, -40, r2 / 2, 80, r2), l2(`wall`, n2 + 40, r2 / 2, 80, r2), a2.beacon = u2(`beacon`, n2 / 2, 130, 38);
    let d2: any = { W: n2, H: r2, rnd: i2, box: l2, circle: u2, prop(t3?: any, n3?: any, r3?: any, i3?: any, o3?: any, s3: any = {}): any {
            let c3: any = { density: o3, friction: 0.9, restitution: 0.1, groups: On.prop, rotation: s3.rot ?? 0 }, l3: any = `r` in i3 ? e3.circle(n3, r3, i3.r, c3) : e3.box(n3, r3, i3.w, i3.h, c3);
            a2.props.push({ kind: t3, body: l3, ...i3, ...s3 });
        }, zone: (e4?: any, t3?: any, n3?: any, r3?: any) => void a2.zones.push({ kind: e4, x: t3, y: n3, r: r3 }), candle: (e4?: any, t3?: any) => void a2.candles.push({ x: e4, y: t3 }), free(e4?: any, t3: any = 40, o3: any = 40): any {
            for (let c3: any = 0; c3 < o3; c3++) {
                let o4: any = t3 + e4 + i2() * (n2 - 2 * (t3 + e4)), c4: any = t3 + e4 + i2() * (r2 - 2 * (t3 + e4));
                if (s2(o4, c4, 230))
                    continue;
                let l3: any = true;
                for (let t4 of a2.obstacles) {
                    let n3: any = t4.r ?? Math.max(t4.w ?? 0, t4.h ?? 0) / 2;
                    if (Math.hypot(t4.x - o4, t4.y - c4) < n3 + e4 + 36) {
                        l3 = false;
                        break;
                    }
                }
                if (l3)
                    return { x: o4, y: c4 };
            }
            return null;
        }, nearStart: s2, start: o2, decor: a2.decor };
    return Xc[t2.look](d2), a2;
}
var Xc: any = { churchyard({ W: e3, H: t2, rnd: n2, box: r2, circle: i2, prop: a2, candle: o2, free: s2, nearStart: c2, decor: l2 }: any): any {
        let u2: any = { x: e3 / 2, y: 470 };
        r2(`chapelwall`, u2.x, u2.y - 90, 340, 18, 0, { seed: n2() }), r2(`chapelwall`, u2.x - 170, u2.y, 18, 196, 0, { seed: n2() }), r2(`chapelwall`, u2.x + 170, u2.y + 34, 18, 128, 0, { seed: n2() }), r2(`chapelwall`, u2.x - 108, u2.y + 90, 142, 18, 0, { seed: n2() }), r2(`chapelwall`, u2.x + 108, u2.y + 90, 142, 18, 0, { seed: n2() }), r2(`belltower`, u2.x + 176, u2.y - 96, 74, 74), r2(`chapelaltar`, u2.x, u2.y - 56, 70, 26);
        for (let e4 of [-1, 1])
            i2(`brokenpillar`, u2.x + e4 * 70, u2.y - 10, 11, { seed: n2() });
        let d2: any = (e4?: any, t3: any = []) => {
            for (let i3: any = 1; i3 < e4.length; i3++) {
                let [a3, o3]: any = e4[i3 - 1], [s3, c3]: any = e4[i3], l3: any = Math.hypot(s3 - a3, c3 - o3), u3: any = Math.max(1, Math.round(l3 / 90));
                for (let e5: any = 0; e5 < u3; e5++) {
                    if (t3.includes(`${i3}:${e5}`))
                        continue;
                    let d3: any = e5 / u3, f3: any = (e5 + 1) / u3;
                    r2(`drywall`, a3 + (s3 - a3) * (d3 + f3) / 2, o3 + (c3 - o3) * (d3 + f3) / 2, l3 / u3 + 4, 20, Math.atan2(c3 - o3, s3 - a3), { seed: n2() });
                }
            }
        };
        d2([[140, 820], [520, 800], [960, 840]], [`1:2`]), d2([[1640, 840], [2080, 800], [2460, 820]], [`2:1`]), d2([[760, 1180], [740, 1450], [780, 1700]], [`1:1`]), d2([[1840, 1180], [1860, 1450], [1820, 1700]], [`2:1`]);
        let f2: any = [[260, 300, 5, 4], [e3 - 760, 300, 5, 4], [240, 980, 4, 5], [e3 - 640, 980, 4, 5]];
        for (let [e4, t3, i3, a3] of f2)
            for (let o3: any = 0; o3 < a3; o3++)
                for (let a4: any = 0; a4 < i3; a4++) {
                    if (n2() < 0.18)
                        continue;
                    let i4: any = e4 + a4 * 108 + (n2() - 0.5) * 26, s3: any = t3 + o3 * 118 + (n2() - 0.5) * 22;
                    if (c2(i4, s3, 230))
                        continue;
                    let l3: any = n2(), u3: any = (n2() - 0.5) * 0.35;
                    l3 < 0.12 ? r2(`tomb`, i4, s3 + 10, 66, 34, u3 * 0.3, { seed: n2() }) : l3 < 0.26 ? r2(`celtic`, i4, s3, 26, 12, u3, { tall: 52 + n2() * 16 }) : l3 < 0.36 ? r2(`marker`, i4, s3, 16, 8, u3 * 1.6, { tall: 26 + n2() * 10 }) : l3 < 0.42 ? r2(`opengrave`, i4, s3 + 14, 34, 54, u3 * 0.3, { seed: n2() }) : r2(`headstone`, i4, s3, 28 + n2() * 12, 12, u3, { tall: 28 + n2() * 18, shape: Math.floor(n2() * 4), seed: n2() });
                }
        for (let [e4, t3] of [[1150, 700], [1450, 700], [1130, 1450], [1480, 1500], [980, 1060], [1640, 1040], [300, 700], [2300, 690], [160, 1700], [2440, 1720], [640, 200], [1960, 200]])
            c2(e4, t3, 200) || i2(`yew`, e4, t3, 20 + n2() * 6, { seed: n2() });
        i2(`greatoak`, 470, 1420, 26, { seed: n2() }), i2(`greatoak`, e3 - 420, 1380, 26, { seed: n2() });
        for (let [e4, t3, r3] of [[1240, 1580, 0], [1370, 1270, Math.PI], [1240, 900, 0], [1370, 680, Math.PI], [700, 900, 0], [1900, 900, Math.PI], [520, 560, 0], [2080, 560, Math.PI]])
            i2(`crooklamp`, e4, t3, 6, { a: r3, phase: n2() * 6.28 });
        for (let e4 of [-1, 1])
            i2(`gatepost`, u2.x + e4 * 60, t2 - 40, 12, { gate: e4 });
        for (let e4: any = 0; e4 < 5; e4++) {
            let e5: any = s2(22);
            e5 && a2(`coffin`, e5.x, e5.y, { w: 46, h: 20 }, 1.6, { rot: n2() * 3 });
        }
        for (let e4: any = 0; e4 < 6; e4++) {
            let e5: any = s2(12);
            e5 && a2(`urn`, e5.x, e5.y, { r: 9 }, 1.8);
        }
        for (let e4: any = 0; e4 < 14; e4++) {
            let e5: any = s2(12);
            e5 && o2(e5.x, e5.y);
        }
        for (let r3: any = 0; r3 < 260; r3++) {
            let r4: any = n2() < 0.7 ? `tuft` : n2() < 0.6 ? `mushroom` : `bones`, i3: any = 40 + n2() * (e3 - 80), a3: any = 40 + n2() * (t2 - 80);
            l2.push({ kind: r4, x: i3, y: a3, s: n2() });
        }
    }, mill({ W: e3, H: t2, rnd: n2, box: r2, circle: i2, prop: a2, zone: o2, candle: s2, free: c2, nearStart: l2, decor: u2 }: any): any {
        r2(`millhouse`, e3 * 0.5, t2 * 0.24, 220, 150), i2(`wheel`, e3 * 0.5 + 138, t2 * 0.24, 20);
        let d2: any = [[e3 * 0.2, t2 * 0.3, 190], [e3 * 0.78, t2 * 0.35, 210], [e3 * 0.25, t2 * 0.78, 200], [e3 * 0.72, t2 * 0.8, 180], [e3 * 0.5, t2 * 0.5, 120]];
        for (let [e4, t3, r3] of d2)
            if (!l2(e4, t3, r3 + 60)) {
                o2(`mud`, e4, t3, r3);
                for (let i3: any = 0; i3 < 4; i3++) {
                    let i4: any = n2() * 6.28, a3: any = r3 * (0.4 + n2() * 0.5);
                    o2(`mud`, e4 + Math.cos(i4) * a3, t3 + Math.sin(i4) * a3, r3 * (0.45 + n2() * 0.3));
                }
                for (let i3: any = 0; i3 < 14; i3++) {
                    let i4: any = n2() * 6.28;
                    u2.push({ kind: `reed`, x: e4 + Math.cos(i4) * r3 * 1.02, y: t3 + Math.sin(i4) * r3 * 1.02, s: n2() });
                }
            }
        for (let e4: any = 0; e4 < 22; e4++) {
            let e5: any = c2(10);
            e5 && i2(`pier`, e5.x, e5.y, 7 + n2() * 3);
        }
        for (let e4: any = 0; e4 < 14; e4++) {
            let e5: any = c2(26);
            e5 && i2(`rock`, e5.x, e5.y, 16 + n2() * 14, { seed: n2() });
        }
        for (let e4: any = 0; e4 < 9; e4++) {
            let e5: any = c2(20);
            e5 && i2(`stump`, e5.x, e5.y, 14 + n2() * 5, { seed: n2() });
        }
        for (let e4: any = 0; e4 < 10; e4++) {
            let e5: any = c2(16);
            e5 && a2(`barrel`, e5.x, e5.y, { r: 12 }, 1.2);
        }
        for (let e4: any = 0; e4 < 6; e4++) {
            let e5: any = c2(20);
            e5 && a2(`crate`, e5.x, e5.y, { w: 28, h: 28 }, 1.5, { rot: n2() * 3 });
        }
        for (let e4: any = 0; e4 < 14; e4++) {
            let e5: any = c2(12);
            e5 && s2(e5.x, e5.y);
        }
    }, ashwood({ W: e3, H: t2, rnd: n2, box: r2, circle: i2, prop: a2, candle: o2, free: s2, zone: c2, decor: l2 }: any): any {
        for (let e4: any = 0; e4 < 46; e4++) {
            let e5: any = s2(24, 60);
            if (e5) {
                let t3: any = 15 + n2() * 9;
                i2(`ashtree`, e5.x, e5.y, t3, { seed: n2(), burning: n2() < 0.35 });
            }
        }
        for (let e4: any = 0; e4 < 12; e4++) {
            let e5: any = s2(60);
            if (e5) {
                let t3: any = 110 + n2() * 50;
                r2(`log`, e5.x, e5.y, t3, 22, n2() * 3.14, { seed: n2() });
            }
        }
        for (let e4: any = 0; e4 < 10; e4++) {
            let e5: any = s2(26);
            e5 && i2(`rock`, e5.x, e5.y, 16 + n2() * 12, { seed: n2() });
        }
        for (let e4: any = 0; e4 < 8; e4++) {
            let e5: any = s2(40);
            e5 && c2(`ash`, e5.x, e5.y, 90 + n2() * 80);
        }
        for (let e4: any = 0; e4 < 8; e4++) {
            let e5: any = s2(16);
            e5 && a2(`crate`, e5.x, e5.y, { w: 28, h: 28 }, 1.4, { rot: n2() * 3 });
        }
        for (let r3: any = 0; r3 < 60; r3++) {
            let r4: any = n2() * e3, i3: any = n2() * t2;
            l2.push({ kind: `ember`, x: r4, y: i3, s: n2() });
        }
        for (let e4: any = 0; e4 < 14; e4++) {
            let e5: any = s2(12);
            e5 && o2(e5.x, e5.y);
        }
    }, pass({ rnd: e3, box: t2, circle: n2, prop: r2, zone: i2, candle: a2, free: o2 }: any): any {
        for (let t3: any = 0; t3 < 18; t3++) {
            let t4: any = o2(50, 60);
            t4 && n2(`boulder`, t4.x, t4.y, 28 + e3() * 26, { seed: e3() });
        }
        for (let t3: any = 0; t3 < 30; t3++) {
            let t4: any = o2(20, 50);
            t4 && n2(`pine`, t4.x, t4.y, 13 + e3() * 5, { seed: e3() });
        }
        for (let n3: any = 0; n3 < 10; n3++) {
            let n4: any = o2(18);
            if (n4) {
                let r3: any = e3() * 3;
                t2(`crystal`, n4.x, n4.y, 18, 18, r3, { tall: 40 + e3() * 40, seed: e3() });
            }
        }
        for (let t3: any = 0; t3 < 7; t3++) {
            let t4: any = o2(40);
            t4 && i2(`ice`, t4.x, t4.y, 110 + e3() * 90);
        }
        for (let e4: any = 0; e4 < 7; e4++) {
            let e5: any = o2(30);
            e5 && r2(`snowball`, e5.x, e5.y, { r: 24 }, 2.2);
        }
        for (let e4: any = 0; e4 < 14; e4++) {
            let e5: any = o2(12);
            e5 && a2(e5.x, e5.y);
        }
    }, cathedral({ W: e3, H: t2, rnd: n2, box: r2, circle: i2, prop: a2, candle: o2, start: s2 }: any): any {
        s2.x = e3 / 2, s2.y = t2 * 0.62, r2(`altar`, e3 / 2, t2 * 0.16, 200, 70);
        for (let n3 of [-1, 1])
            i2(`statue`, e3 / 2 + n3 * 170, t2 * 0.16, 18);
        for (let t3: any = 0; t3 < 7; t3++)
            for (let n3 of [-1, 1])
                i2(`pillar`, e3 / 2 + n3 * 520, 300 + t3 * 280, 24);
        for (let t3: any = 0; t3 < 6; t3++)
            for (let n3 of [-1, 1]) {
                let r3: any = 440 + t3 * 290;
                if (!(Math.abs(r3 - s2.y) < 120))
                    for (let t4 of [0, 1])
                        a2(`pew`, e3 / 2 + n3 * (150 + t4 * 180), r3, { w: 150, h: 22 }, 2.8);
            }
        for (let t3 of [-1, 1])
            for (let n3: any = 0; n3 < 5; n3++)
                i2(`statue`, e3 / 2 + t3 * 900, 400 + n3 * 380, 18);
        for (let r3: any = 0; r3 < 16; r3++) {
            let i3: any = e3 / 2 + (r3 % 2 ? 1 : -1) * (300 + n2() * 500), a3: any = 300 + n2() * (t2 - 500);
            Math.hypot(i3 - s2.x, a3 - s2.y) > 220 && o2(i3, a3);
        }
    } };
function Zc({ stageIndex: e3 = 0, heroId: t2 = `wren`, hearth: n2 = {}, blood: r2 = false, seed: i2 = 1, unlocked: a2 = null, title: o2 = false, items: s2 = {} }: any = {}): any {
    let c2: any = Lt[e3], l2: any = At.find((e4?: any) => e4.id === t2) || At[0], u2: any = new jn(), d2: any = { phys: u2, stage: c2, heroDef: l2, blood: r2, seed: i2, hearthLv: n2, rng: dn(i2), title: o2, frame: 0, clock: 0, phase: `play`, phaseT: 0, hpMul: c2.hpMul * (r2 ? Rt.hp : 1), dmgMul: c2.dmgMul * (r2 ? Rt.dmg : 1), rateMul: c2.rate * (r2 ? Rt.rate : 1), monsters: [], shots: [], spits: [], orbs: [], gems: [], pickups: [], censers: [], ravens: [], relics: [], relicPending: 0, relicDropped: false, relicsSeen: /* @__PURE__ */ new Set(), martyrT: 0, particles: [], floaters: [], arcs: [], bolts: [], rings: [], beams: [], banners: [], globs: [], hazards: [], zones: [], elites: [], boss: null, bossSpawned: false, bossKilledAt: 0, bossSpawnedAt: 0, kills: 0, embers: 0, tithe: 0, clearBonus: 0, damageTaken: 0, dmgBy: {}, killsBy: {}, weaponsSeen: /* @__PURE__ */ new Set(), monstersSeen: /* @__PURE__ */ new Set(), evolved: [], spawnAcc: 0, events: [], cards: [], rollId: 0, chest: null, levelUpQueue: 0, chestQueue: 0, startBoost: 0, rerolls: n2.reroll || 0, banishes: n2.banish || 0, banished: /* @__PURE__ */ new Set(), unlocked: a2 || new Set(zt), freeze: 0, flash: 0, eclipse: 0, shakeAmp: 0, shakeT: 0, sfx: [], hitsThisFrame: 0, gemStreak: 0, gemStreakT: 0, beaconLit: 0, items: { ...s2 }, itemCd: 0, itemLog: [], itemsUsedTotal: 0, wantItem: null, wantActive: false, rushIdx: 0, rushNext: c2.bossAt * 60, rushHome: null, rushCalls: 0, wrathT: 0, rushWrathFor: null, fastKeeper: false };
    d2.world = Yc(u2, c2), d2.zones.push(...Array.from<any>(d2.world.zones)), d2.hero = zs(d2), Bs(d2), as(d2, l2.weapon);
    for (let e4 of d2.world.candles)
        ec(d2, `candle`, e4.x, e4.y);
    let f2: any = o2 ? 0 : (c2.boost ?? c2.index * 2) + 2 * (n2.headstart || 0);
    return f2 > 0 && (d2.hero.level += f2, d2.hero.xpNext = pn(d2.hero.level), d2.levelUpQueue = f2, d2.startBoost = f2), d2.events = c2.events.map(([e4, t3, n3, r3]: any) => ({ at: e4 * 60, kind: t3, id: n3, n: r3 })), o2 ? Qc(d2) : Jo(d2, c2.rush ? `b_vigil` : `b_start`, `#ffd166`, 160, { stage: c2.id }), d2;
}
function Qc(e3?: any): any {
    let t2: any = e3.stage, n2: any = t2.horde || t2.mix.map((e4?: any) => e4[0]), r2: any = t2.hordeLead || t2.events.find((e4?: any) => e4[1] === `elite`)[2], i2: any = e3.world.start;
    for (let t3: any = 0; t3 < 70; t3++) {
        let a2: any = e3.rng() * Math.PI * 2, o2: any = 230 + e3.rng() * 330, s2: any = ec(e3, t3 === 0 ? r2 : n2[Math.floor(e3.rng() * n2.length)], i2.x + Math.cos(a2) * o2, i2.y + Math.sin(a2) * o2);
        s2 && (s2.idleA = a2, s2.idleR = o2, s2.born = -100);
    }
}
function $c(e3?: any): any {
    let t2: any = e3.world.start;
    for (let n3 of e3.monsters) {
        if (!n3.alive || n3.def.prop)
            continue;
        n3.anim += k * 3, n3.idleA += k * 0.1 * (n3.seed > 0.5 ? 1 : -1);
        let e4: any = t2.x + Math.cos(n3.idleA) * n3.idleR, r2: any = t2.y + Math.sin(n3.idleA) * n3.idleR, i2: any = e4 - n3.body.x, a2: any = r2 - n3.body.y, o2: any = Math.hypot(i2, a2) || 1e-6, s2: any = Math.min(n3.def.speed * 0.5, o2 * 2);
        n3.body.setVel(ln(n3.body.vx, i2 / o2 * s2, 0.1), ln(n3.body.vy, a2 / o2 * s2, 0.1)), n3.body.vx ** 2 + n3.body.vy ** 2 > 25 && (n3.face = Math.atan2(n3.body.vy, n3.body.vx));
    }
    let n2: any = e3.hero.body;
    n2.setVel(n2.vx * 0.8, n2.vy * 0.8), e3.hero.face = Math.PI / 2 + Math.sin(e3.frame / 200) * 0.6, e3.phys.step();
}
function el(e3?: any): any {
    for (let t2: any = e3.globs.length - 1; t2 >= 0; t2--) {
        let n2: any = e3.globs[t2];
        ++n2.t < n2.T || (e3.globs.splice(t2, 1), n2.kind === `holy` ? (e3.zones.push({ kind: `holy`, x: n2.x1, y: n2.y1, r: n2.r, life: n2.dur, T: n2.dur, dmg: n2.dmg, src: n2.src }), H(e3, n2.x1, n2.y1, 8, 8050943, 2), U(e3, `splash`)) : (e3.zones.push({ kind: `mud`, x: n2.x1, y: n2.y1, r: n2.r, life: 600, T: 600 }), H(e3, n2.x1, n2.y1, 12, n2.color, 3), Math.hypot(e3.hero.body.x - n2.x1, e3.hero.body.y - n2.y1) < n2.r * 0.7 && sc(e3, n2.dmg, n2.x1, n2.y1), U(e3, `splat`)));
    }
    for (let t2: any = e3.zones.length - 1; t2 >= 0; t2--) {
        let n2: any = e3.zones[t2];
        n2.life !== void 0 && (n2.kind === `holy` && Rs(e3, n2), --n2.life <= 0 && e3.zones.splice(t2, 1));
    }
}
function tl(e3?: any): any {
    let t2: any = e3.hero.body.x, n2: any = e3.hero.body.y;
    for (let r2: any = e3.spits.length - 1; r2 >= 0; r2--) {
        let i2: any = e3.spits[r2];
        if (i2.body && i2.home) {
            let e4: any = i2.body, r3: any = Math.hypot(e4.vx, e4.vy), a2: any = Math.atan2(n2 - e4.y, t2 - e4.x), o2: any = i2.angle + Math.max(-i2.home, Math.min(i2.home, Math.atan2(Math.sin(a2 - i2.angle), Math.cos(a2 - i2.angle))));
            i2.angle = o2, e4.vx = Math.cos(o2) * r3, e4.vy = Math.sin(o2) * r3;
        }
        i2.body && --i2.life <= 0 && (i2.body = null), i2.body || e3.spits.splice(r2, 1);
    }
}
function nl(e3?: any): any {
    for (let t2 of e3.world.props) {
        let e4: any = t2.body;
        e4.vx * e4.vx + e4.vy * e4.vy > 0.01 && e4.setVel(e4.vx * 0.92, e4.vy * 0.92), e4.angVel *= 0.9;
    }
}
function rl(e3?: any): any {
    let t2: any = e3.particles;
    for (let e4: any = t2.length - 1; e4 >= 0; e4--) {
        let n2: any = t2[e4];
        if (n2.x += n2.vx * k, n2.y += n2.vy * k, n2.z += n2.vz * k, n2.vx *= 0.9, n2.vy *= 0.9, n2.vz -= 400 * k, n2.z < 0 && (n2.z = 0, n2.vz *= -0.3), --n2.life <= 0) {
            let n3: any = t2.pop();
            e4 < t2.length && (t2[e4] = n3);
        }
    }
    for (let t3: any = e3.floaters.length - 1; t3 >= 0; t3--) {
        let n2: any = e3.floaters[t3];
        n2.y -= 0.7, ++n2.t >= n2.T && e3.floaters.splice(t3, 1);
    }
    for (let t3 of [e3.arcs, e3.bolts, e3.beams])
        for (let e4: any = t3.length - 1; e4 >= 0; e4--)
            ++t3[e4].t >= t3[e4].T && t3.splice(e4, 1);
    for (let t3: any = e3.rings.length - 1; t3 >= 0; t3--) {
        let n2: any = e3.rings[t3];
        n2.t++, n2.r = n2.max * (1 - (1 - n2.t / n2.T) ** 2), n2.t >= n2.T && e3.rings.splice(t3, 1);
    }
    il(e3), e3.flash *= 0.88, e3.flash < 0.01 && (e3.flash = 0), e3.shakeT > 0 && (e3.shakeT -= k, e3.shakeT <= 0 && (e3.shakeAmp = 0));
}
function il(e3?: any): any {
    for (let t2: any = e3.banners.length - 1; t2 >= 0; t2--)
        ++e3.banners[t2].t >= e3.banners[t2].T && e3.banners.splice(t2, 1);
}
function al(e3?: any, t2?: any): any {
    if (e3.title)
        e3.frame++, $c(e3);
    else if (e3.frame++, e3.phaseT++, e3.hitsThisFrame = 0, e3.phase === `levelup` || e3.phase === `chest`)
        il(e3), e3.chest && e3.chest.t++;
    else {
        if (e3.phase === `play`)
            e3.clock++, Ws(e3, t2), es(e3), bc(e3), cs(e3), Ls(e3), tl(e3), Bc(e3), el(e3), Oc(e3), nl(e3), e3.freeze > 0 && e3.freeze--, e3.bossKilledAt && e3.frame - e3.bossKilledAt > 150 && e3.phase === `play` && (e3.phase = `won`, e3.phaseT = 0, e3.embers += Math.round(e3.clearBonus * e3.hero.stats.greed));
        else {
            let t3: any = e3.hero.body;
            t3.setVel(t3.vx * 0.9, t3.vy * 0.9), e3.phase === `dead` && bc(e3), e3.phase === `won` && (Bc(e3), e3.beaconLit = Math.min(1, e3.beaconLit + k * 0.5));
        }
        if (e3.phys.step(), Jc(e3), rl(e3), e3.phase === `play` && (e3.chestQueue > 0 ? Lc(e3) : e3.levelUpQueue > 0 && !e3.bossKilledAt && jc(e3)), e3.frame % 30 == 0)
            for (let t3 of e3.monsters)
                t3.alive && !t3.def.prop && !t3.def.part && e3.monstersSeen.add(t3.id);
    }
}
var ol: any = (e3?: any) => {
    e3.wantActive = true;
};
var sl: any = (e3?: any, t2?: any) => {
    e3.wantItem = t2;
};
function cl(e3?: any): any {
    return { stage: e3.stage.index, stageId: e3.stage.id, hero: e3.heroDef.id, blood: e3.blood, won: e3.phase === `won`, time: e3.clock / 60, kills: e3.kills, level: e3.hero.level, embers: e3.embers, tithe: e3.tithe || 0, weapons: e3.hero.weapons.map((t2?: any) => ({ id: t2.id, level: t2.level, dmg: Math.round(e3.dmgBy[t2.id] || 0), kills: e3.killsBy[t2.id] || 0 })), passives: { ...e3.hero.passives }, relics: [...Array.from<any>(e3.relics)], damageTaken: e3.damageTaken, evolved: [...Array.from<any>(e3.evolved)], fastKeeper: e3.fastKeeper, itemsUsed: e3.itemsUsedTotal, keepers: e3.stage.rush ? e3.rushIdx - +!!e3.boss?.alive : 0, monstersSeen: [...Array.from<any>(e3.monstersSeen)], weaponsSeen: [...Array.from<any>(e3.weaponsSeen)], relicsSeen: [...Array.from<any>(e3.relicsSeen)] };
}
yc({ chase(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        mc(t2, a2, o2);
    }, swoop(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let s2: any = Math.sin(e3.frame * 0.09 + t2.wobble) * 90;
        mc(t2, a2 - r2 / i2 * s2, o2 + n2 / i2 * s2);
    }, wiggle(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let s2: any = Math.sin(e3.frame * 0.3 + t2.wobble) * 26;
        mc(t2, a2 - r2 / i2 * s2, o2 + n2 / i2 * s2, 1, 0.22);
    }, ranged(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let { x: s2, y: c2 }: any = t2.body;
        if (i2 > 250)
            mc(t2, a2, o2);
        else if (i2 < 170)
            mc(t2, s2 - n2, c2 - r2, 0.8);
        else {
            let i3: any = Math.sin(e3.frame * 0.02 + t2.wobble) > 0 ? 1 : -1;
            mc(t2, s2 - r2 * i3, c2 + n2 * i3, 0.45), t2.face = Math.atan2(r2, n2);
        }
        --t2.spitCd <= 0 && i2 < 340 && (t2.spitCd = 140 + Math.floor(e3.rng() * 60), cc(e3, s2, c2, Math.atan2(r2, n2), t2.def.spit), t2.hitFlash = 2, t2.wind = 8, U(e3, `spit`)), t2.wind > 0 && t2.wind--;
    }, healer(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let { x: s2, y: c2 }: any = t2.body;
        if (i2 > 300)
            mc(t2, a2, o2, 0.9);
        else if (i2 < 220)
            mc(t2, s2 - n2, c2 - r2, 0.9);
        else {
            let i3: any = Math.sin(e3.frame * 0.015 + t2.wobble) > 0 ? 1 : -1;
            mc(t2, s2 - r2 * i3, c2 + n2 * i3, 0.4), t2.face = Math.atan2(r2, n2);
        }
        if (t2.wind > 0 && t2.wind--, --t2.spitCd > 0)
            return;
        let l2: any = t2.def;
        t2.spitCd = (l2.healCd || 170) + Math.floor(e3.rng() * 50);
        let u2: any = l2.healR || 170, d2: any = l2.c3, f2: any = 0;
        for (let n3 of e3.monsters) {
            if (!n3.alive || n3 === t2 || n3.def.prop || n3.def.part || n3.hp >= n3.maxHp || (n3.healedAt || -1e9) > e3.frame - 240)
                continue;
            let r3: any = n3.body;
            if ((r3.x - s2) ** 2 + (r3.y - c2) ** 2 > u2 * u2)
                continue;
            n3.healedAt = e3.frame;
            let i3: any = l2.heal ?? 0, a3: any = n3.maxHp * (n3.def.boss ? i3 * 0.08 : n3.def.elite ? i3 * 0.3 : i3);
            n3.hp = Math.min(n3.maxHp, n3.hp + a3), Go(e3, r3.x, r3.y, 0, 0, d2, 26, 2.6, n3.def.r * 2, 70), a3 > 30 && Ko(e3, r3.x, r3.y - n3.def.r - 6, `+${Math.round(a3)}`, `#9aff7a`, 0.8), f2++;
        }
        if (l2.haste) {
            let n3: any = null, r3: any = 0;
            for (let i3 of e3.monsters) {
                if (!i3.alive || i3 === t2 || i3.def.prop || i3.def.part || i3.def.boss || i3.haste > 0)
                    continue;
                let e4: any = Math.hypot(i3.body.x - s2, i3.body.y - c2);
                if (e4 > 260)
                    continue;
                let a3: any = i3.maxHp / (1 + e4 / 120);
                a3 > r3 && (r3 = a3, n3 = i3);
            }
            n3 && (n3.haste = 220, e3.beams.push({ x0: s2, y0: c2, x1: n3.body.x, y1: n3.body.y, t: 0, T: 16, color: d2 }), H(e3, n3.body.x, n3.body.y, 10, d2, 2.6), f2++);
        }
        f2 && (e3.rings.push({ x: s2, y: c2, r: 10, max: u2, t: 0, T: 26, color: d2 }), t2.wind = 20, U(e3, `mend`));
    }, lunge(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let s2: any = !!t2.def.elite;
        if (t2.dash > 0) {
            t2.dash--, hc(t2, t2.face, (s2 ? 560 : 470) * t2.slow), t2.dash % 3 == 0 && Go(e3, t2.body.x, t2.body.y, 0, 0, t2.def.c2, 14, 2.4, 6, 20);
            return;
        }
        if (t2.wind > 0) {
            t2.wind--, gc(t2, 0.75);
            let n3: any = e3.hero.body;
            t2.face = Math.atan2(o2 + n3.vy * 0.25 - t2.body.y, a2 + n3.vx * 0.25 - t2.body.x), t2.wind === 0 && (t2.dash = s2 ? 22 : 16, U(e3, `lunge`));
            return;
        }
        if (--t2.dashCd <= 0 && i2 < (s2 ? 320 : 220) && i2 > 60) {
            t2.dashCd = (s2 ? 150 : 200) + Math.floor(e3.rng() * 120), t2.wind = s2 ? 26 : 22;
            return;
        }
        let c2: any = Math.sin(e3.frame * 0.03 + t2.wobble) * 60;
        mc(t2, a2 - r2 / i2 * c2, o2 + n2 / i2 * c2);
    }, diver(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        if (t2.z < 0 && (t2.z = 30), t2.dash > 0) {
            t2.dash--, hc(t2, t2.face, 400), t2.z = Math.max(4, t2.z - 3);
            return;
        }
        if (t2.z = Math.min(40, t2.z + 0.8), --t2.dashCd <= 0 && i2 < 260) {
            t2.dashCd = 180 + Math.floor(e3.rng() * 100), t2.face = Math.atan2(r2, n2), t2.dash = 34, U(e3, `dive`);
            return;
        }
        let s2: any = Math.atan2(-r2, -n2) + 0.9 * (t2.seed > 0.5 ? 1 : -1);
        mc(t2, a2 + Math.cos(s2) * 170, o2 + Math.sin(s2) * 170, 1.1);
    }, charger(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        t2.dash > 0 ? (t2.dash--, hc(t2, t2.face, 520), t2.dash % 3 == 0 && Go(e3, t2.body.x, t2.body.y, 0, 0, t2.def.c, 18, 3, 10, 10)) : t2.wind > 0 ? (t2.wind--, gc(t2, 0.5), t2.face = Math.atan2(r2, n2), t2.wind === 0 && (t2.dash = 24, U(e3, `charge`))) : --t2.dashCd <= 0 && i2 < 420 && i2 > 90 ? (t2.dashCd = 230 + Math.floor(e3.rng() * 90), t2.wind = 36) : mc(t2, a2, o2);
    }, colossus(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let { x: s2, y: c2 }: any = t2.body;
        if (t2.dash > 0) {
            t2.dash--, hc(t2, t2.face, 380);
            return;
        }
        if (t2.wind > 0) {
            t2.wind--, gc(t2, 0.5), t2.wind === 0 && (t2.windKind === `slam` ? Cc(e3, s2, c2, 240, 26, 440, t2.def.c) : (t2.face = Math.atan2(r2, n2), t2.dash = 42, U(e3, `charge`)));
            return;
        }
        let l2: any = t2.hp < t2.maxHp * 0.4;
        --t2.slamCd <= 0 && i2 < 260 ? (t2.slamCd = (l2 ? 300 : 420) + Math.floor(e3.rng() * 120), t2.wind = 48, t2.windKind = `slam`) : --t2.dashCd <= 0 && i2 < 520 && i2 > 160 ? (t2.dashCd = 330 + Math.floor(e3.rng() * 120), t2.wind = 40, t2.windKind = `dash`) : (--t2.summonCd <= 0 && (t2.summonCd = l2 ? 360 : 480, Sc(e3, `gravebound`, s2, c2, 10, 70)), mc(t2, a2, o2));
    }, bogmother(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let { x: s2, y: c2 }: any = t2.body;
        if (t2.hidden > 0)
            t2.hidden--, mc(t2, a2, o2, 2.8, 0.2), t2.hidden % 5 == 0 && Go(e3, s2, c2, 0, 0, 5204538, 30, 4, 2, 10), t2.hidden === 0 && ($s(t2, `mon`), Cc(e3, s2, c2, 210, 24, 420, 6982218), t2.zones = (t2.zones || 0) + 1, e3.zones.push({ kind: `mud`, x: s2, y: c2, r: 120, life: 900, T: 900 }));
        else if (t2.wind > 0)
            t2.wind--, gc(t2, 0.5), t2.wind === 0 && (t2.hidden = 110, $s(t2, `none`), U(e3, `submerge`));
        else if (--t2.slamCd <= 0)
            t2.slamCd = 640 + Math.floor(e3.rng() * 120), t2.wind = 40;
        else {
            if (--t2.spitCd <= 0) {
                t2.spitCd = t2.hp < t2.maxHp * 0.5 ? 150 : 210;
                for (let t3: any = 0; t3 < 3; t3++) {
                    let n3: any = e3.hero.body, r3: any = a2 + n3.vx * 0.6 + (e3.rng() - 0.5) * 160, i3: any = o2 + n3.vy * 0.6 + (e3.rng() - 0.5) * 160;
                    e3.globs.push({ x0: s2, y0: c2, x1: r3, y1: i3, t: -t3 * 8, T: 60, kind: `mud`, r: 70, dmg: 14 * e3.dmgMul, color: 5929530 });
                }
                U(e3, `lob`);
            }
            --t2.summonCd <= 0 && (t2.summonCd = 420, Sc(e3, `leech`, s2, c2, 12, 80)), mc(t2, a2, o2);
        }
    }, stag(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let { x: s2, y: c2 }: any = t2.body;
        if (t2.dash > 0) {
            t2.dash--, hc(t2, t2.face, 560), t2.dash % 5 == 0 && e3.zones.push({ kind: `fire`, x: s2, y: c2, r: 34, life: 260, T: 260 }), ac(e3, s2, c2, 70, 120), t2.dash === 0 && t2.combo > 0 && (t2.combo--, t2.wind = 24, t2.windKind = `dash`);
            return;
        }
        if (t2.wind > 0) {
            t2.wind--, gc(t2, 0.5), t2.windKind === `dash` && (t2.face = Math.atan2(r2, n2)), t2.wind === 0 && (t2.windKind === `sweep` ? Cc(e3, s2, c2, 170, 22, 380, 16742970) : (t2.dash = 38, U(e3, `charge`)));
            return;
        }
        let l2: any = t2.hp < t2.maxHp * 0.5;
        if (--t2.slamCd <= 0 && i2 < 170)
            t2.slamCd = 200, t2.wind = 30, t2.windKind = `sweep`;
        else if (--t2.dashCd <= 0 && i2 > 140)
            t2.dashCd = l2 ? 330 : 420, t2.combo = l2 ? 3 : 2, t2.wind = 40, t2.windKind = `dash`;
        else {
            if (--t2.summonCd <= 0) {
                t2.summonCd = 600;
                for (let t3: any = 0; t3 < 6; t3++) {
                    let t4: any = pc(e3, 380, 460);
                    ec(e3, `ashwolf`, t4.x, t4.y);
                }
                U(e3, `howl`);
            }
            mc(t2, a2, o2);
        }
    }, worm(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        if (t2.dash > 0) {
            t2.dash--, t2.face += j(un(Math.atan2(r2, n2) - t2.face), -0.02, 0.02), hc(t2, t2.face, 440);
            return;
        }
        if (t2.wind > 0) {
            t2.wind--, gc(t2, 0.7), t2.face = Math.atan2(r2, n2), t2.wind === 0 && (t2.dash = 90, U(e3, `roar`));
            return;
        }
        if (--t2.dashCd <= 0 && i2 > 200) {
            t2.dashCd = 380 + Math.floor(e3.rng() * 100), t2.wind = 40;
            return;
        }
        --t2.spitCd <= 0 && (t2.spitCd = t2.hp < t2.maxHp * 0.5 ? 260 : 360, t2.segs.forEach((t3?: any, n3?: any) => {
            if (!t3.alive || n3 % 2)
                return;
            let r3: any = Math.atan2(o2 - t3.body.y, a2 - t3.body.x) + (e3.rng() - 0.5) * 0.6;
            cc(e3, t3.body.x, t3.body.y, r3, { dmg: 10, speed: 230, color: 11197695, r: 6 });
        }), U(e3, `shards`));
        let s2: any = Math.atan2(r2, n2) + Math.sin(e3.frame * 0.025 + t2.wobble) * 0.7;
        t2.face += j(un(s2 - t2.face), -0.05, 0.05);
        let c2: any = t2.body;
        c2.setVel(ln(c2.vx, Math.cos(t2.face) * t2.def.speed, 0.1), ln(c2.vy, Math.sin(t2.face) * t2.def.speed, 0.1));
    }, king(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any): any {
        let { x: s2, y: c2 }: any = t2.body, l2: any = t2.hp / t2.maxHp, u2: any = l2 > 0.66 ? 0 : l2 > 0.33 ? 1 : 2;
        if (u2 > t2.phase && (t2.phase = u2, Jo(e3, u2 === 1 ? `b_king2` : `b_king3`, `#c0c8ff`, 150), Cc(e3, s2, c2, 260, 10, 520, 12634367), U(e3, `roar`), u2 === 2 && (e3.eclipse = 1)), t2.phase >= 1) {
            t2.scA = (t2.scA || 0) + 1 / 60 * (t2.phase === 2 ? 2.2 : 1.6);
            let n3: any = t2.phase === 2 ? 4 : 3;
            e3.hazards.length = 0;
            for (let r3: any = 0; r3 < n3; r3++) {
                let i3: any = t2.scA + r3 / n3 * Math.PI * 2;
                e3.hazards.push({ x: s2 + Math.cos(i3) * 120, y: c2 + Math.sin(i3) * 120, r: 18, dmg: 18 * e3.dmgMul, a: i3, kind: `scythe` });
            }
        }
        if (t2.phase === 2) {
            let t3: any = e3.hero.body;
            t3.setVel(t3.vx - n2 / i2 * 5, t3.vy - r2 / i2 * 5), e3.frame % 4 == 0 && Go(e3, a2 + (e3.rng() - 0.5) * 300, o2 + (e3.rng() - 0.5) * 300, -n2 * 0.4, -r2 * 0.4, 12634367, 24, 2, 4, 0);
        }
        if (t2.hidden > 0) {
            if (t2.hidden--, t2.hidden === 20) {
                let n3: any = e3.rng() * 6.28;
                t2.body.setPos(j(a2 + Math.cos(n3) * 240, 80, e3.world.W - 80), j(o2 + Math.sin(n3) * 240, 80, e3.world.H - 80)), H(e3, t2.body.x, t2.body.y, 30, 12634367, 3);
            }
            t2.hidden === 0 && $s(t2, `mon`), gc(t2, 0.5);
        }
        else if (t2.phase >= 1 && --t2.dashCd <= 0)
            t2.dashCd = 420, t2.hidden = 40, $s(t2, `none`), U(e3, `blink`);
        else {
            if (--t2.spitCd <= 0) {
                t2.spitCd = t2.phase === 0 ? 220 : t2.phase === 1 ? 170 : 120;
                let n3: any = t2.phase === 2 ? 22 : 16, r3: any = e3.rng() * 6.28;
                for (let t3: any = 0; t3 < n3; t3++)
                    cc(e3, s2, c2, r3 + t3 / n3 * Math.PI * 2, { dmg: 12, speed: 200, color: 12634367, r: 7, life: 260, big: true });
                U(e3, `orbs`);
            }
            t2.phase >= 1 && e3.frame % (t2.phase === 2 ? 8 : 12) == 0 && (e3.frame / 120 | 0) % 3 == 0 && (t2.spiral = (t2.spiral || 0) + 0.45, cc(e3, s2, c2, t2.spiral, { dmg: 10, speed: 240, color: 14733567, r: 5, life: 200 })), --t2.summonCd <= 0 && (t2.summonCd = t2.phase === 2 ? 420 : 540, Sc(e3, t2.phase === 2 ? `specter` : `hollow`, a2, o2, 10, 300)), mc(t2, a2, o2, t2.phase === 2 ? 0.7 : 1);
        }
    } });

export{Zc as createRun,al as stepRun,cl as runResult,ol as requestActive,sl as requestItem,Mc as pickCard,Pc as reroll,Fc as banish,Ic as skip,zc as closeChest,At as HEROES,Lt as STAGES,Bt as WEAPONS,Vt as PASSIVES,Ht as passiveMax,Ut as RELICS,Mt as HEARTH,Nt as hearthCost,Pt as ITEMS,Ft as ITEM_IDS,Jt as defaultProgress,qt as defaultSettings,sn as recordResult,nn as unlocked,rn as heroUnlocked,an as stageUnlocked,on as unlockedWeapons,cn as consumeItem,wr as awardAchievements,bt as heroText,Et as stageText,xt as weaponText,St as passiveText,Ct as relicText,wt as itemText,Tt as achievementText,Dt as monsterText,Ot as monsterLore,kt as story,O as text,is as weaponStats,Cr as ACHIEVEMENTS,zt as BASE_WEAPONS,qa as MONSTERS};
