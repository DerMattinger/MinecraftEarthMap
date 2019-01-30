//Borders: Skizze nachzeichnen 50, 50; Tontrennung
//Cities: Manuelle Anpassung Mitte: 0,6; Tontrennung
//Ice: Manuelle Anpassung Mitte: 0,6; Tontrennung
//Water: Skizze nachzeichnen 0, 0; Manuelle Anpassung Mitte: 0,38; Tontrennung 2
//Mask: Skizze nachzeichnen 50, 50; Manuelle Anpassung Mitte: 2; Tontrennung 2
//Heightmap 10k: Water als Mask; Manuelle Anpassung Mitte: 61 - 1 - 48; Manuelle Anpassung Mitte: 110 - 1 - 62; Gausßscher Weichzeichner 1; zusammenführen; gimp: 16bit Gray
//Heightmap 20k: Water als Mask; Manuelle Anpassung Mitte: 61 - 1 - 35; Manuelle Anpassung Mitte: 158 - 1 - 62; Gausßscher Weichzeichner 1; zusammenführen; gimp: 16bit Gray
//Heightmap 40k: Water als Mask; Manuelle Anpassung Mitte: 61 - 1 - 9; Manuelle Anpassung Mitte: 254 - 1 - 62; Gausßscher Weichzeichner 1; zusammenführen; gimp: 16bit Gray
//OceanBiomes: Oberflächenunsdchärfe 6 - 74; Tontrennung 2

// variables for scaling
var scale = 20; //blocks in thausend: e.g. 10 / 20 / 40
var west = -537.6 * scale;
var north = -268.8 * scale;

// variables from Images
var heightMap = wp.getHeightMap().fromFile('HeightMap'+scale+'k.png').go();
var biomeMap = wp.getHeightMap().fromFile('BiomeMap'+scale+'k.png').go();
//var oceanBiomeMap = wp.getHeightMap().fromFile('OceanBiomeMap'+scale+'k.png').go();
var riverMask = wp.getHeightMap().fromFile('WaterMap'+scale+'k.png').go();
var borderMask = wp.getHeightMap().fromFile('Border'+scale+'k.png').go();
var iceMask = wp.getHeightMap().fromFile('Ice'+scale+'k.png').go();
var citiesMask = wp.getHeightMap().fromFile('Cities'+scale+'k.png').go();

//first of all, create the map
var world = wp.createWorld()
	.fromHeightMap(heightMap)
	.shift(west, north)
	.fromLevels(0, 65535).toLevels(0, 255)
	.go();

// Other variables
var biomesLayer = wp.getLayer().withName("Biomes").go();
var riverLayer = wp.getLayer().fromFile('layers/Rivers.layer').go();
var borderLayer = wp.getLayer().fromFile('layers/Borders.layer').go();
var citiesLayer = wp.getLayer().fromFile('layers/Cities.layer').go();
var mesaLayer = wp.getLayer().fromFile('layers/Mesa.layer').go();

var beachFilter = wp.createFilter()
	.exceptOnLayer(riverLayer)
    .aboveLevel(62)
    .belowLevel(255)
    .go();

var deepOceanFilter = wp.createFilter()
    .belowLevel(61-(scale*1.3)/2)
    .go();

var waterFilter = wp.createFilter()
    .onlyOnBiome(0) // ocean
    .go();

var riverFilter = wp.createFilter()
	.aboveLevel(62)
    .onlyOnBiome(0) // ocean
    .go();

//custom terrain
var terrain = wp.getTerrain().fromFile('layers/Custom_Mesa.terrain').go();
var customMesa = wp.installCustomTerrain(terrain).toWorld(world).inSlot(1).go(); //Slot 1 = 47
var terrain = wp.getTerrain().fromFile('layers/Deep_Ocean_Floor.terrain').go();
var deepOcean_Floor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(2).go(); //Slot 2 = 48
var terrain = wp.getTerrain().fromFile('layers/Deep_Snow.terrain').go();
var deepsnow = wp.installCustomTerrain(terrain).toWorld(world).inSlot(3).go(); //Slot 3 = 49
var terrain = wp.getTerrain().fromFile('layers/Ocean_Floor.terrain').go();
var oceanFloor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(4).go(); //Slot 4 = 50
var terrain = wp.getTerrain().fromFile('layers/Patagonien.terrain').go();
var patagonien = wp.installCustomTerrain(terrain).toWorld(world).inSlot(5).go(); //Slot 5 = 51
var terrain = wp.getTerrain().fromFile('layers/Red_Sand_Red_Sanstone_Mix.terrain').go();
var redSandSanstone = wp.installCustomTerrain(terrain).toWorld(world).inSlot(6).go(); //Slot 6 = 52
var terrain = wp.getTerrain().fromFile('layers/Sand_Sanstone_Mix.terrain').go();
var sandSanstone = wp.installCustomTerrain(terrain).toWorld(world).inSlot(7).go(); //Slot 7 = 53
var terrain = wp.getTerrain().fromFile('layers/Snow_Surface.terrain').go();
var snowSurface = wp.installCustomTerrain(terrain).toWorld(world).inSlot(8).go(); //Slot 8 = 54
var terrain = wp.getTerrain().fromFile('layers/Taiga_Floor.terrain').go();
var taigaFloor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(9).go(); //Slot 9 = 55
 //Slot 1 = 47

//Functions	
//Spawnpunkt verschieben	
//var spawnX = 0; 
//var spawnY = 0;
//var spawnZ = world.getHeightAt(spawnX, spawnY).go();
//world.setSpawnX(spawnX).go();
//world.setSpawnY(spawnY).go();
//world.setSpawnZ(spawnZ).go();


wp.applyHeightMap(heightMap)
	.toWorld(world)
	.applyToTerrain()
	.fromLevels(0, 61).toTerrain(5)
	.fromLevels(62, 255).toTerrain(2)
	.go();
	
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.shift(west, north)
	.applyToLayer(biomesLayer)
	.fromColour(0, 0, 255).toLevel(149) //Af - modified_jungle 0000FF 
	.fromColour(0, 120, 255).toLevel(21) //Am - jungle 0078FF
	.fromColour(70, 170, 250).toLevel(23) //Aw - jungle_edge 46AAFA
	.fromColour(255, 0, 0).toLevel(2) //BWh - desert FF0000
	.fromColour(255, 150, 150).toLevel(17) //BWk - desert_hills FF9696
	.fromColour(245, 165, 0).toLevel(35) //BSh - savanna F5A500
	.fromColour(255, 220, 100).toLevel(130) //BSk - desert_lakes FFDC64
	.fromColour(255, 255, 0).toLevel(1) //Csa - plains FFFF00
	.fromColour(200, 200, 0).toLevel(129) //Csb - sunflower_plains C8C800
	.fromColour(150, 255, 150).toLevel(151) //Cwa - modified_jungle_edge 96FF96
	.fromColour(100, 200, 100).toLevel(22) //Cwb - jungle_hills 64C864
	.fromColour(50, 150, 50).toLevel(131) //Cwc - gravelly_mountains 329632
	.fromColour(200, 255, 80).toLevel(4) //Cfa - forest C8FF50
	.fromColour(100, 255, 80).toLevel(132) //Cfb - flower_forest 64FF50
	.fromColour(50, 200, 0).toLevel(3) //Cfc - mountains 32C800
	.fromColour(255, 0, 255).toLevel(36) //Dsa - savanna_plateau FF00FF
	.fromColour(200, 0, 200).toLevel(38) //Dsb - wooded_badlands_plateau C800C8
	.fromColour(150, 50, 150).toLevel(33) //Dsc - giant_tree_taiga_hills 963296
	.fromColour(150, 100, 150).toLevel(161) //Dsd - giant_spruce_taiga_hills 966496
	.fromColour(170, 175, 255).toLevel(6) //Dwa - swamp AAAFFF
	.fromColour(90, 120, 220).toLevel(134) //Dwb - swampland_hills 5A78DC
	.fromColour(75, 80, 180).toLevel(32) //Dwc - giant_tree_taiga 4B50B4
	.fromColour(50, 0, 135).toLevel(160) //Dwd - giant_spruce_taiga 320087
	.fromColour(0, 255, 255).toLevel(29) //Dfa - dark_forest 00FFFF
	.fromColour(55, 200, 255).toLevel(5) //Dfb - taiga 37C8FF
	.fromColour(0, 125, 125).toLevel(30) //Dfc - snowy_taiga 007D7D
	.fromColour(0, 70, 95).toLevel(13) //Dfd - snowy_mountains 00465F
	.fromColour(178, 178, 178).toLevel(12) //ET - snowy_tundra B2B2B2
	.fromColour(102, 102, 102).toLevel(127) //EF - the_void 666666
	.fromColour(200, 200, 200).toLevel(16) // - beach B2B2B2
	.fromColour(220, 220, 220).toLevel(26) // - snowy_beach DCDCDC
	.fromColour(255, 100, 0).toLevel(37) // - badlands FF6400
	.fromColour(0, 0, 0).toLevel(0) //Ocean - ocean 000000
	.go();

//only for 1.13 Maps
//wp.applyHeightMap(oceanBiomeMap) 
//    .toWorld(world)
//	.shift(west, north)
//	.applyToLayer(biomesLayer)
//	.fromColour(0, 150, 150).toLevel(0) //Cold Ocean - ocean 000000
//	.fromColour(0, 150, 200).toLevel(0) //Ocean - ocean 000000
//	.fromColour(100, 255, 100).toLevel(0) //Lukewarm Ocean - ocean 64FF64
//	.fromColour(255, 0, 100).toLevel(0) //Warm Ocean - ocean 000000
//	.go();
	
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.shift(west, north)
	.applyToTerrain()
	.fromColour(0, 0, 255).toTerrain(1) //Af - Gras
	.fromColour(0, 120, 255).toTerrain(1) //Am - Gras
	.fromColour(70, 170, 250).toTerrain(1) //Aw - Gras
	.fromColour(255, 0, 0).toTerrain(53) //BWh - Sand
	.fromColour(255, 150, 150).toTerrain(53) //BWk - Sand
	.fromColour(245, 165, 0).toTerrain(1) //BSh - Gras
	.fromColour(255, 220, 100).toTerrain(53) //BSk - Sand
	.fromColour(255, 255, 0).toTerrain(1) //Csa - Gras
	.fromColour(200, 200, 0).toTerrain(1) //Csb - Gras
	.fromColour(150, 255, 150).toTerrain(1) //Cwa - Gras
	.fromColour(100, 200, 100).toTerrain(1) //Cwb - Gras
	.fromColour(50, 150, 50).toTerrain(1) //Cwc - Gras
	.fromColour(200, 255, 80).toTerrain(1) //Cfa - Gras
	.fromColour(100, 255, 80).toTerrain(1) //Cfb - Gras
	.fromColour(50, 200, 0).toTerrain(1) //Cfc - Gras
	.fromColour(255, 0, 255).toTerrain(1) //Dsa - Gras
	.fromColour(200, 0, 200).toTerrain(1) //Dsb - Gras
	.fromColour(150, 50, 150).toTerrain(55) //Dsc - Podzol
	.fromColour(150, 100, 150).toTerrain(55) //Dsd - Podzol
	.fromColour(170, 175, 255).toTerrain(1) //Dwa - Gras
	.fromColour(90, 120, 220).toTerrain(1) //Dwb - Gras
	.fromColour(75, 80, 180).toTerrain(55) //Dwc - Podzol
	.fromColour(50, 0, 135).toTerrain(55) //Dwd - Podzol
	.fromColour(0, 255, 255).toTerrain(1) //Dfa - Gras
	.fromColour(55, 200, 255).toTerrain(1) //Dfb - Gras
	.fromColour(0, 125, 125).toTerrain(1) //Dfc - Gras
	.fromColour(0, 70, 95).toTerrain(1) //Dfd - Gras
	.fromColour(178, 178, 178).toTerrain(40) //ET - deep_snow
	.fromColour(102, 102, 102).toTerrain(49) //EF - Custom Deep Snow
	.fromColour(200, 200, 200).toTerrain(5) // sand
	.fromColour(220, 220, 220).toTerrain(40) // deep_snow
	.fromColour(255, 100, 0).toTerrain(6) // red_sand
	.fromColour(0, 0, 0).toTerrain(50) // Sand
	.go();
	
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.shift(west, north)
	.applyToLayer(mesaLayer)
	.fromColour(255, 100, 0).toTerrain(1)
	.go();

//Apply MyRiver Layer on River Mask
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(riverLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();

//Apply deep_ocean on ocean biome on land
wp.applyHeightMap(biomeMap) 
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(biomesLayer)
	.withFilter(deepOceanFilter)
	.fromColour(0, 0, 0).toLevel(24) // deep_ocean
	.go();
	
wp.applyHeightMap(biomeMap) 
	.toWorld(world)
	.shift(west, north)
	.withFilter(deepOceanFilter)
	.applyToTerrain()
	.fromColour(0, 0, 0).toLevel(48) // deep_ocean_floor
	.go();

//Apply frozen_ocean on Ice Mask
wp.applyHeightMap(iceMask)
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(biomesLayer)
	.fromLevels(1, 255).toLevel(10) // frozen_ocean
	.go();

//Apply Border Layer on Border Mask
wp.applyHeightMap(borderMask)
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(borderLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();

//Remove Border on RiverMask
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(borderLayer)
	.fromLevel(1).toLevel(0)
	.go()

//Apply Cities Layer on Cities Mask
wp.applyHeightMap(citiesMask)
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(citiesLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();

//Remove Cities on RiverMask
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(west, north)
	.applyToLayer(citiesLayer)
	.fromLevel(1).toLevel(0)
	.go()

//wp.applyLayer(biomesLayer)
//	.toWorld(world)
//	.toLevel(7) //River
//	.withFilter(riverFilter)
//	.go();

wp.saveWorld(world)
	.toFile('earth_1-'+40/scale*1000+'.world')
	.go();
	
//global operations:
//fill with biome: "River" at or above "62" only on "River" Layer
//remove "River" Layer only on Ocean

//manuell operations
//change sand to red_sand on australia
//change sand to patagonien on south america
//change sand to red sand on north america