/** Mechanisms are reconstructed from public observations; tuning is explicit local data. */
export type Element='physical'|'fire'|'ice'|'electric'|'energy'|'wind'|'poison';
export type SkillId='rifle'|'thermo'|'dryice'|'electro'|'guided'|'ray'|'frost'|'cyclone'|'fuel'|'electron'|'blade'|'vehicle'|'airdrop'|'drone'|'rift'|'matrix'|'dragon'|'pillar'|'orb';
export type Attack='bullet'|'shell'|'beam'|'guided'|'ray'|'field'|'tornado'|'chain'|'blade'|'vehicle'|'airdrop'|'drone'|'rift'|'matrix'|'dragon'|'pillar'|'orb';
export interface Skill {id:SkillId;name:string;element:Element;attack:Attack;color:string;damage:number;interval:number;radius:number;pierce:number;duration:number;description:string}
// Base special-weapon cooldowns match SkillBaseConfg and the level-1 display
// fields in MagicSkillLevelConfig. Damage, unit mapping and haste stacking remain
// local tuning; the summoned dragon uses its separate 2-second attack cadence.
export const SKILLS:readonly Skill[]=[
 {id:'rifle',name:'突击步枪',element:'physical',attack:'bullet',color:'#e3b76c',damage:28,interval:.27,radius:3,pierce:0,duration:0,description:'自动锁定靠近防线的敌人。弹匣耗尽后重新装填。'},
 {id:'thermo',name:'温压弹',element:'fire',attack:'shell',color:'#f29a38',damage:85,interval:6.2,radius:55,pierce:0,duration:0,description:'发射温压弹，命中爆炸并击退范围内敌人。'},
 {id:'dryice',name:'干冰弹',element:'ice',attack:'bullet',color:'#8cdef1',damage:48,interval:4.1,radius:9,pierce:4,duration:0,description:'冰系穿透弹道，可击中多名敌人并轻微击退。'},
 {id:'electro',name:'电磁穿刺',element:'electric',attack:'beam',color:'#c2a0ef',damage:100,interval:3.8,radius:44,pierce:0,duration:0,description:'雷击目标并溅射附近敌人，附带麻痹。'},
 {id:'guided',name:'制导激光',element:'energy',attack:'guided',color:'#efbd75',damage:95,interval:10.3,radius:18,pierce:0,duration:1.4,description:'持续追踪锁定目标，目标倒下后自动转移；升级后可折射。'},
 {id:'ray',name:'高能射线',element:'energy',attack:'ray',color:'#78d9ef',damage:60,interval:7.5,radius:14,pierce:99,duration:0,description:'从枪口向目标射出贯穿整条路径的能量射线。'},
 {id:'frost',name:'冰暴发生器',element:'ice',attack:'field',color:'#67cce9',damage:26,interval:6.2,radius:62,pierce:0,duration:2.7,description:'生成冰暴领域，周期伤害并冻结其中的敌人。'},
 {id:'cyclone',name:'旋风加农',element:'wind',attack:'tornado',color:'#8fdcc8',damage:24,interval:17.1,radius:43,pierce:99,duration:4,description:'旋风持续推进，将敌人卷向中心并造成多次伤害。'},
 {id:'fuel',name:'燃油弹',element:'fire',attack:'field',color:'#e77640',damage:23,interval:4,radius:61,pierce:0,duration:4,description:'燃油覆盖地面，持续烧灼范围内的尸群。'},
 {id:'electron',name:'跃迁电子',element:'electric',attack:'chain',color:'#aca0ee',damage:51,interval:6.1,radius:128,pierce:4,duration:0,description:'电子在相邻敌人之间跃迁，适合密集尸群。'},
 {id:'blade',name:'压缩气刃',element:'wind',attack:'blade',color:'#bdddb7',damage:64,interval:6.5,radius:20,pierce:8,duration:0,description:'气刃穿过多个目标，并降低敌人的受治疗量。'},
 {id:'vehicle',name:'装甲车',element:'physical',attack:'vehicle',color:'#bdb79a',damage:55,interval:17.4,radius:38,pierce:99,duration:4,description:'装甲车从防线出击，沿途碾压并推开敌人。'},
 {id:'airdrop',name:'空投轰炸',element:'physical',attack:'airdrop',color:'#ddab69',damage:130,interval:7.7,radius:70,pierce:0,duration:0,description:'在尸群中标记区域，短暂延迟后实施空中轰炸。'},
 {id:'drone',name:'无人机',element:'physical',attack:'drone',color:'#d5d9c4',damage:42,interval:10,radius:15,pierce:99,duration:9,description:'无人机在战场内穿行，碰到边界反弹，可反复撞击沿途敌人。'},
 {id:'rift',name:'时空裂隙',element:'energy',attack:'rift',color:'#ae97e8',damage:22,interval:7.5,radius:66,pierce:0,duration:2.5,description:'生成菱形裂隙，每0.4秒造成伤害；区域内施加的负面状态延长20%。'},
 {id:'matrix',name:'生化矩阵',element:'poison',attack:'matrix',color:'#b0d56b',damage:19,interval:7.5,radius:43,pierce:0,duration:2.5,description:'布下多个毒系矩阵，相邻矩阵合并；持续伤害并逐步禁锢区域内的敌人。'},
 {id:'dragon',name:'冰筑龙体',element:'ice',attack:'dragon',color:'#7cd6e9',damage:62,interval:2,radius:52,pierce:0,duration:0,description:'召唤机械冰龙，以利爪攻击；能量蓄满后释放冰狱坠击。'},
 {id:'pillar',name:'电极柱',element:'electric',attack:'pillar',color:'#79d5f4',damage:29,interval:15,radius:9,pierce:0,duration:3.5,description:'地面升起数座电极柱，依次连接；触碰电流连线的敌人持续受到电系伤害。'},
 {id:'orb',name:'多维弹球',element:'physical',attack:'orb',color:'#e0a9dd',damage:38,interval:8,radius:10,pierce:0,duration:8,description:'弹球在目标与墙壁间反弹；每施放6次召唤幸运弹球。选词条积攒幸运，超过21重置为1。'},
];
export const skillById=Object.fromEntries(SKILLS.map(s=>[s.id,s])) as Record<SkillId,Skill>;
/** Ordinary and fission timing from the serialized reference; quantized to 60Hz in core. */
export const ORB_TIMING={volleyInterval:.5,hitInterval:.5,childLife:3.5,wallEventInterval:.5};
/** Reference has three enemy redirects; battlefield-boundary reflections use a separate budget.
 * Pixel speed and target selection remain local mappings, see LUCKY-ORB-REFERENCE.md. */
export const ORB_MOTION={targetRebounds:3,speed:320,childSpeedRatio:14/18,childRadiusRatio:.7};
export type OrbQuality='low'|'mid'|'high';
/** Cast gate, weights, delay, flight and derivative timing follow serialized reference settings.
 * World-to-screen units, lifetime start and damage composition are documented local choices. */
export const LUCKY_ORB={casts:6,prepare:2.8,flight:5,hitInterval:.5,deriveInterval:3,speed:280,lightSpeed:560,lightLife:2,lightRadius:8,blastRadius:64,
 qualities:[{id:'low',name:'辉银',weight:100,color:'#9bdaef',radius:12},{id:'mid',name:'耀紫',weight:50,color:'#c8a4f2',radius:18},{id:'high',name:'鎏金',weight:10,color:'#f5c76e',radius:18}] as const};
export type SkinId='ranger'|'ember'|'arctic'|'hazard'|'arc';
/** Trigger counts and the plasma/blade damage ratios are stated on the official website.
 * Our original outfits reuse those mechanics; storm tuning/volley geometry remain local. */
export const SKIN_ABILITIES={
 ember:{name:'温压序列',skill:'thermo',hits:12,description:'温压弹累计命中12次，追加一波并列温压弹。'},
 arctic:{name:'零度风暴',skill:'dryice',hits:32,description:'干冰弹累计命中32次，在命中处释放冰风暴。'},
 hazard:{name:'追加气刃',skill:'blade',hits:36,description:'气刃累计命中36次，追加三连气刃，每道造成80%伤害并重伤5秒。'},
 arc:{name:'电磁引导',skill:'electro',hits:2,description:'电磁穿刺命中同一敌人2次，释放等离子场；扩散/收缩造成10%/5%电系伤害。'},
} as const;
export const skinAbility=(skin:SkinId)=>skin==='ranger'?null:SKIN_ABILITIES[skin];
export type Modifier='damage'|'haste'|'count'|'radius'|'pierce'|'duration'|'burn'|'freeze'|'stun'|'bounce'|'crit'|'magazine'|'knock'|'vulnerability'|'repeat'|'size'|'speed';
export interface Upgrade {id:string;skill:SkillId;name:string;description:string;max:number;requires:readonly [string,number][];mods:Partial<Record<Modifier,number>>;evolution?:boolean;luck?:{min:number;delta:readonly [number,number]};researchVariant?:{level:number;name:string;description:string;mods:Partial<Record<Modifier,number>>}}
const upgrade=(id:string,skill:SkillId,name:string,description:string,mods:Upgrade['mods'],requires:Upgrade['requires']=[],max=1,evolution=false):Upgrade=>({id,skill,name,description,mods,requires,max,evolution});
const orbUpgrade=(id:string,name:string,description:string,mods:Upgrade['mods'],min:number,delta:readonly [number,number],max=1):Upgrade=>({...upgrade('orb:'+id,'orb',name,description,mods,[],max,min===21),luck:{min,delta}});
export function upgradeForResearch(u:Upgrade,level=0):Upgrade{
 const variant=u.researchVariant;return variant&&level>=variant.level?{...u,name:variant.name,description:variant.description,mods:variant.mods}:u;
}
export const signedLuck=(value:number)=>`${value>=0?'+':''}${value}`;
export function describeUpgrade(u:Upgrade){
 if(!u.luck)return u.description;
 const [min,max]=u.luck.delta;
 return `${u.description} 幸运${signedLuck(min)}${min===max?'':'～'+signedLuck(max)}。`;
}
export const UPGRADES:readonly Upgrade[]=[
 ...SKILLS.filter(s=>s.id!=='orb').flatMap(s=>[
  upgrade(s.id+':power',s.id,s.name+'增伤','本技能伤害提高 25%。',{damage:.25},[],5),
  upgrade(s.id+':haste',s.id,s.name+'速发','本技能冷却缩短 10%。',{haste:.1},[],3),
 ]),
 upgrade('rifle:pierce','rifle','穿透弹','子弹多穿透 1 名敌人。',{pierce:1},[],3),
 upgrade('rifle:salvo','rifle','枪械齐射','每轮多发射 1 颗子弹。',{count:1},[['rifle:power',1]],2),
 upgrade('rifle:magazine','rifle','扩容弹匣','弹匣容量增加 6 发。',{magazine:6},[],3),
 upgrade('rifle:crit','rifle','弱点瞄准','暴击率增加 10%。',{crit:.1},[],3),
 upgrade('rifle:explosive','rifle','爆炸子弹','步枪命中产生小范围火焰爆炸。',{radius:22,burn:8},[['thermo',1],['rifle:power',2]],1,true),
 upgrade('rifle:frost','rifle','急冻子弹','步枪命中使目标短暂冻结。',{freeze:.45},[['dryice',1],['rifle:pierce',1]],1,true),
 upgrade('rifle:ricochet','rifle','弹射子弹','枪械命中后向附近另一个目标弹射。',{bounce:1},[['drone',1]],2),
 upgrade('thermo:salvo','thermo','温压弹连发','额外发射 1 枚温压弹。',{count:1},[],2),
 upgrade('thermo:heat','thermo','热能爆发','温压爆炸伤害提高 40%，范围扩大。',{damage:.4,radius:15},[['thermo:power',1]]),
 upgrade('thermo:ignite','thermo','爆炸引燃','爆炸命中的敌人持续烧灼。',{burn:18},[['thermo:power',1]]),
 upgrade('thermo:super','thermo','超爆弹','大幅提升温压爆炸的范围与冲击。',{damage:.6,radius:28,knock:20},[['thermo:heat',1],['thermo:salvo',1]],1,true),
 upgrade('thermo:spread','thermo','传火','烧灼更猛烈，击杀时传播到附近敌人。',{burn:24},[['thermo:super',1],['thermo:ignite',1]],1,true),
 upgrade('thermo:burst','thermo','连珠火球','同时投射更多超爆弹。',{count:2,damage:.2},[['thermo:super',1],['thermo:salvo',2]],1,true),
 upgrade('dryice:salvo','dryice','干冰弹连发','额外发射 1 枚干冰弹。',{count:1},[],2),
 upgrade('dryice:freeze','dryice','急冻寒冰','穿透命中附带冻结。',{freeze:1.1},[['dryice:power',1]]),
 upgrade('dryice:pierce','dryice','低温贯穿','增加 3 次穿透，扩大弹道。',{pierce:3,radius:3},[],2),
 upgrade('dryice:extreme','dryice','极寒冰弹','延长冻结并增强干冰弹伤害。',{damage:.7,freeze:1},[['dryice:freeze',1],['dryice:pierce',1],['dryice:power',2]],1,true),
 upgrade('electro:split','electro','电磁分流','雷击增加一个目标。',{count:1},[],2),
 upgrade('electro:paralyze','electro','麻痹增伤','延长麻痹，提高电磁伤害。',{stun:.8,damage:.25},[['electro:power',1]]),
 upgrade('electro:fission','electro','电磁裂变','雷击向更多目标扩散。',{count:2,radius:18},[['electro:split',1],['electro:paralyze',1]],1,true),
 upgrade('electro:voltage','electro','高压粒子','裂变雷击更强，并产生额外溅射。',{damage:.8,radius:20},[['electro:fission',1],['electro:power',2]],1,true),
 upgrade('guided:focus','guided','聚焦','提高制导激光的单体伤害。',{damage:.5},[],2),
 upgrade('guided:refract','guided','追踪折射','激光折射命中更多敌人。',{bounce:2},[['guided:power',1]],2),
 upgrade('guided:wave','guided','能量光波','加强聚焦激光并扩大折射。',{damage:.65,bounce:2,radius:8},[['guided:focus',1],['guided:refract',1]],1,true),
 upgrade('ray:spread','ray','射线扩散','射线增宽，并提高伤害。',{radius:9,damage:.15},[['ray:power',1]],2),
 upgrade('ray:overload','ray','高能过载','贯穿射线冷却明显缩短。',{haste:.22},[['ray:power',2]]),
 upgrade('ray:flash','ray','闪击射线','额外释放一道高能射线。',{count:1,damage:.3},[['ray:overload',1],['ray:spread',1]],1,true),
 upgrade('frost:area','frost','冰暴扩张','冰暴范围增加 20。',{radius:20},[['frost:power',1]],2),
 upgrade('frost:lasting','frost','冰雹延续','冰暴持续时间增加 1.5 秒。',{duration:1.5},[],2),
 upgrade('frost:heavy','frost','重型冰暴','冰暴伤害、范围与冻结强度提升。',{damage:.6,radius:16,freeze:.5},[['frost:area',1],['frost:lasting',1]],1,true),
 upgrade('cyclone:lasting','cyclone','延长气流','旋风持续时间增加 1.5 秒。',{duration:1.5},[],2),
 upgrade('cyclone:double','cyclone','双重旋风','额外发射一道旋风。',{count:1},[['cyclone:lasting',1]],1,true),
 upgrade('cyclone:storm','cyclone','风暴聚焦','旋风扩大，并更强地聚拢敌人。',{radius:18,damage:.4,knock:15},[['cyclone:power',2]],1,true),
 upgrade('fuel:area','fuel','燃烧扩散','扩大燃油覆盖区域。',{radius:20},[],2),
 upgrade('fuel:lasting','fuel','火焰侵袭','延长燃烧区域的持续时间。',{duration:2,burn:8},[],2),
 upgrade('fuel:death','fuel','死亡爆炸','燃烧伤害提高，燃烧中的敌人倒下时爆炸。',{burn:18,damage:.4},[['thermo',1],['fuel:lasting',1]],1,true),
 upgrade('electron:compound','electron','复合电子','电子增加 3 次跃迁。',{bounce:3},[],2),
 upgrade('electron:high','electron','高压电子','提升电子伤害并附带麻痹。',{damage:.35,stun:.35},[['electron:power',1]]),
 upgrade('electron:perpetual','electron','永动电子','增加跃迁，显著缩短冷却。',{bounce:4,haste:.25},[['electron:compound',2],['electron:high',1]],1,true),
 upgrade('blade:salvo','blade','三连气刃','额外释放气刃。',{count:1},[],2),
 upgrade('blade:wide','blade','气刃风波','加宽气刃并提升重伤效果。',{radius:10,vulnerability:.12},[],2),
 upgrade('blade:frost','blade','低温风波','气刃附带冻结。',{freeze:1,damage:.3},[['blade:wide',1],['dryice',1]],1,true),
 upgrade('vehicle:armor','vehicle','军备强化','增强装甲车的碾压伤害。',{damage:.4},[],2),
 upgrade('vehicle:heavy','vehicle','重型坦克','装甲车进化，增大车体和伤害。',{damage:.6,radius:18},[['vehicle:armor',1],['vehicle:power',1]],1,true),
 upgrade('vehicle:repeat','vehicle','连续出击','额外派出一辆战车。',{count:1},[['vehicle:heavy',1]],2),
 upgrade('vehicle:crush','vehicle','碾压术','坦克体积和推力进一步提高。',{radius:16,knock:20},[['vehicle:heavy',1]],1,true),
 upgrade('airdrop:precise','airdrop','精准打击','提高轰炸伤害与覆盖范围。',{damage:.4,radius:14},[],2),
 upgrade('airdrop:repeat','airdrop','连续轰炸','多标记一个轰炸区域。',{count:1},[],2),
 upgrade('airdrop:nuke','airdrop','战术核弹','更大范围的爆炸留下燃烧地带。',{damage:.8,radius:42,burn:30},[['airdrop:precise',2],['thermo',1]],1,true),
 upgrade('drone:slow','drone','迟滞旋翼','无人机命中使目标减速0.5秒。',{},[['drone:power',1]]),
 upgrade('drone:rebound','drone','反弹增幅','每次撞墙提高伤害10%，单架最多提高100%。',{},[['drone:power',1]]),
 upgrade('drone:wing','drone','编队飞行','每次多派出一架无人机。',{count:1},[],2),
 upgrade('drone:falcon','drone','猎隼编队','无人机持续时间增加4秒，机体扩大，伤害提升。',{duration:4,radius:6,damage:.4},[['drone:wing',1],['drone:rebound',1]],1,true),
 upgrade('rift:future','rift','未来虫洞','裂隙内烧灼伤害频率提升15%。',{},[['rift:power',1]]),
 upgrade('rift:lasting','rift','时序延展','裂隙持续时间增加1秒，范围扩大。',{duration:1,radius:10},[],2),
 upgrade('rift:fall','rift','无序陷落','裂隙结束时将范围内最多3名普通敌人传送到战场上方。',{},[['rift:future',1],['rift:lasting',1]],1,true),
 upgrade('rift:quantum','rift','量子纠缠','虫洞连接3名敌人，持续10秒；其中一名倒下时，另外两名承受其在连接期间受到的生命伤害。',{},[['rift:future',1],['rift:power',2]],1,true),
 upgrade('matrix:area','matrix','矩阵扩散','矩阵覆盖范围增加12。',{radius:12},[],2),
 upgrade('matrix:more','matrix','同源重组','每次多生成一个可合并的矩阵。',{count:1},[],2),
 upgrade('matrix:pulse','matrix','矩阵脉冲','伤害间隔缩短，禁锢积累更快。',{},[['matrix:power',1]]),
 upgrade('matrix:core','matrix','中心力场','合并后的矩阵将周围敌人向中心牵引。',{damage:.35},[['matrix:area',1],['matrix:more',1]],1,true),
 upgrade('dragon:heart','dragon','巨龙之心','每消灭一名敌人积攒一层龙心，每层提高龙体伤害3%，最多9层。',{},[['dragon:power',1]]),
 upgrade('dragon:energy','dragon','能量回收','提高龙体的能量恢复和击杀能量收益。',{},[],2),
 upgrade('dragon:claw','dragon','极寒利爪','龙体的利爪范围扩大，附带短暂冻结。',{radius:14,freeze:.35},[],2),
 upgrade('dragon:awaken','dragon','机械蜕变','冰狱坠击范围和伤害提升，能量上限提高到140。',{damage:.3,radius:16},[['dragon:heart',1],['dragon:energy',1]],1,true),
 upgrade('pillar:lasting','pillar','持续供能','电极连线持续时间增加2秒。',{duration:2},[],2),
 upgrade('pillar:more','pillar','增设电极','每次升起的电极柱增加1座。',{count:1},[],2),
 upgrade('pillar:wide','pillar','电弧扩展','连线宽度扩大，伤害增加25%。',{radius:5,damage:.25},[['pillar:power',1]],2),
 // Signed endpoints from the independently inspected BuildConfig 1502–1521.
 // Inclusive sampling, offer-time rolls, selection gates and rank caps are
 // explicit reconstruction choices; current client dispatch is not yet verified.
 {...orbUpgrade('rise','升维','伤害降低10%。',{damage:-.1},0,[8,10],3),researchVariant:{level:6,name:'升维+',description:'伤害提高10%。',mods:{damage:.1}}},
 orbUpgrade('heavy','弹球重击','体积增大，击退提高25%，伤害提高20%。',{size:.25,knock:2.5,damage:.2},0,[4,6],2),
 orbUpgrade('wall-split','弹射裂变','撞墙时分裂一枚无强化弹球。',{},0,[4,6]),
 orbUpgrade('salvo','弹球连发','释放个数+1，弹射次数-1。',{count:1,bounce:-1},0,[4,6],2),
 orbUpgrade('bounce','低维弹射','弹射次数+1。',{bounce:1},0,[3,5],3),
 orbUpgrade('repeat','低维连发','释放轮数+1。',{repeat:1},0,[4,6],2),
 orbUpgrade('power','低维增伤','伤害提高60%。',{damage:.6},0,[3,5],4),
 orbUpgrade('haste','急速弹射','冷却缩短10%，伤害提高30%。',{haste:.1,damage:.3},0,[3,5],3),
 orbUpgrade('hinder','阻滞打击','命中削弱50%加速增益，持续1秒；狂暴免疫。',{},10,[-8,-6]),
 orbUpgrade('rain','弹珠雨','释放个数+2，体积减小25%。',{count:2,size:-.25},10,[4,8]),
 orbUpgrade('wall-blast','动能爆破','撞墙时产生80%伤害的爆炸。',{},10,[-12,-9]),
 orbUpgrade('split','动能裂变','每命中4个目标，分裂一枚无强化弹球。',{},10,[6,8]),
 orbUpgrade('high-bounce','高维弹射','弹射次数+2，体积增大25%。',{bounce:2,size:.25},10,[4,8],2),
 orbUpgrade('high-repeat','高维连发','释放轮数+2。',{repeat:2},10,[4,8]),
 orbUpgrade('armed','武装弹球','每枚强化弹球的前两次命中必定暴击。',{},10,[4,8]),
 orbUpgrade('cripple','致残撞击','命中减速90%，持续0.5秒。',{},10,[4,8]),
 orbUpgrade('tide','弹球浪潮','弹射次数+2，释放个数、轮数各+1；幸运弹球数量+1。',{bounce:2,count:1,repeat:1},21,[1,2]),
 orbUpgrade('destroy','毁灭猛击','大小弹球叠加3%易伤，持续3秒，最多20层；幸运弹球少施放1次触发。',{},21,[1,2]),
 orbUpgrade('cycle','终极循环','冷却-25%，速度+20%，伤害+120%；幸运弹球撞墙爆炸。',{haste:.25,speed:.2,damage:1.2},21,[1,2]),
 orbUpgrade('ultimate','终极破坏','伤害提高300%；幸运弹球体积+15%。',{damage:3},21,[1,2]),
];
export const upgradeById=Object.fromEntries(UPGRADES.map(u=>[u.id,u])) as Record<string,Upgrade>;

export type EnemyId='walker'|'runner'|'brute'|'shield'|'armor'|'spitter'|'healer'|'splitter'|'bat'|'bomber'|'fireguard'|'frostguard'|'shockguard'|'burrower'|'butcher'|'mech'|'queen';
export interface EnemyDefinition {id:EnemyId;name:string;hp:number;speed:number;damage:number;interval:number;radius:number;xp:number;color:string;resist?:Partial<Record<Element,number>>;boss?:boolean;description:string}
export const ENEMIES:readonly EnemyDefinition[]=[
 {id:'walker',name:'感染者',hp:64,speed:12,damage:5,interval:1.5,radius:15,xp:2,color:'#88aa96',description:'缓慢接近并持续攻击防线。'},
 {id:'runner',name:'狂奔者',hp:46,speed:24,damage:4,interval:1.2,radius:13,xp:2,color:'#a3b487',description:'移动迅速，控制技能可争取集火时间。'},
 {id:'brute',name:'臃肿怪',hp:230,speed:8,damage:13,interval:2,radius:22,xp:5,color:'#a2ae72',description:'血量很高，倒下时掉落更多经验。'},
 {id:'shield',name:'持盾者',hp:108,speed:11,damage:8,interval:1.7,radius:17,xp:3,color:'#90a594',resist:{physical:.45},description:'护盾消耗前抵挡伤害，物理抗性较高。'},
 {id:'armor',name:'装甲感染者',hp:160,speed:9,damage:9,interval:1.8,radius:18,xp:4,color:'#7e999a',resist:{physical:.35,fire:.8},description:'厚重护甲克制普通弹道，冰电伤害更有效。'},
 {id:'spitter',name:'酸液投手',hp:100,speed:12,damage:13,interval:3,radius:16,xp:3,color:'#91ba7a',description:'接近到射程后投掷酸液，优先消灭。'},
 {id:'healer',name:'孢子医师',hp:125,speed:9,damage:5,interval:2,radius:17,xp:4,color:'#b0a5c3',description:'周期治疗周围敌人；气刃重伤可抑制恢复。'},
 {id:'splitter',name:'裂殖体',hp:142,speed:10,damage:8,interval:1.7,radius:20,xp:4,color:'#79b29c',description:'倒下后分裂出两只迅捷的小型感染者。'},
 {id:'bat',name:'毒翼蝠',hp:67,speed:22,damage:5,interval:1,radius:14,xp:2,color:'#b494c0',resist:{physical:.8},description:'飞行敌人不受地面燃油和装甲车伤害。'},
 {id:'bomber',name:'爆破感染者',hp:74,speed:16,damage:40,interval:2,radius:17,xp:3,color:'#c0ac87',description:'接触防线后自爆；远处击败不会损伤防线。'},
 {id:'fireguard',name:'炽热感染者',hp:150,speed:11,damage:9,interval:1.4,radius:17,xp:4,color:'#ba8064',resist:{fire:.15,ice:1.35},description:'抵抗火焰与烧灼，冰系伤害提高。'},
 {id:'frostguard',name:'寒霜感染者',hp:150,speed:11,damage:9,interval:1.4,radius:17,xp:4,color:'#8bbbc8',resist:{ice:.15,fire:1.35},description:'抗冻结且冰系伤害大幅降低。'},
 {id:'shockguard',name:'绝缘感染者',hp:150,speed:11,damage:9,interval:1.4,radius:17,xp:4,color:'#b7ab66',resist:{electric:.15},description:'抵抗雷电和麻痹，改用其他流派集火。'},
 {id:'burrower',name:'潜地感染者',hp:92,speed:15,damage:8,interval:1.2,radius:15,xp:3,color:'#9f9981',description:'从战场中段钻出，突然逼近防线。'},
 {id:'butcher',name:'屠戮巨尸',hp:1900,speed:7,damage:34,interval:3,radius:36,xp:40,color:'#af896a',boss:true,description:'标记重击后冲锋；被冻结会延后行动。'},
 {id:'mech',name:'冰钻机甲',hp:2350,speed:6,damage:30,interval:2.7,radius:39,xp:45,color:'#b1ab84',resist:{physical:.6,ice:.4},boss:true,description:'护甲厚重，周期发射远程钻头并呼叫援军。'},
 {id:'queen',name:'孢子女王',hp:2100,speed:7,damage:28,interval:2.6,radius:35,xp:45,color:'#ac90ae',resist:{fire:1.25},boss:true,description:'召唤尸群并治疗附近感染者，重伤与爆炸效果突出。'},
];
export const enemyById=Object.fromEntries(ENEMIES.map(e=>[e.id,e])) as Record<EnemyId,EnemyDefinition>;
export const MAPS=[
 {id:'street',name:'废弃街区',ground:'#81858c',edge:'#48525d',accent:'#c8b78e',enemies:['walker','runner','brute','bomber'],boss:'butcher'},
 {id:'factory',name:'锈铁工厂',ground:'#6e7777',edge:'#3f4b50',accent:'#ca974b',enemies:['armor','walker','spitter','shield'],boss:'mech'},
 {id:'hospital',name:'隔离医院',ground:'#8c9690',edge:'#505e5d',accent:'#b3c7c2',enemies:['healer','splitter','runner','spitter'],boss:'queen'},
 {id:'frozen',name:'极寒站台',ground:'#92abb7',edge:'#4c6273',accent:'#c9e4eb',enemies:['frostguard','brute','bat','runner'],boss:'mech'},
 {id:'refinery',name:'燃烧炼厂',ground:'#937f6d',edge:'#594c48',accent:'#de9a5d',enemies:['fireguard','bomber','armor','burrower'],boss:'butcher'},
 {id:'reactor',name:'零号反应堆',ground:'#768681',edge:'#394e4e',accent:'#9fc58c',enemies:['shockguard','healer','splitter','bat','burrower'],boss:'queen'},
] as const;
export const STAGES=Array.from({length:36},(_,i)=>({id:i,map:Math.floor(i/6),name:`${MAPS[Math.floor(i/6)].name} ${i%6+1}`,waves:8+Math.floor(i/6)*2+(i%6===5?2:0),elite:i%6===5}));
/** Local daily variants; these are not claimed to be the reference game's event table. */
export const DAILY_RULES=[
 {id:'rush',name:'疾行尸潮',description:'敌人移动加快 25%，击杀和波次奖励提高。',speed:1.25,health:1,damage:1,wall:1,ammo:0},
 {id:'heavy',name:'重装包围',description:'敌人生命提高 40%，移速降低 10%，考验持续火力。',speed:.9,health:1.4,damage:1,wall:1,ammo:0},
 {id:'short-magazine',name:'弹药精算',description:'弹匣减少 4 发，技能和枪械伤害提高 25%。',speed:1,health:1,damage:1.25,wall:1,ammo:-4},
 {id:'breach',name:'残垣坚守',description:'防线耐久只有 70%，全部伤害提高 10%。',speed:1,health:1,damage:1.1,wall:.7,ammo:0},
] as const;
