//only change this part!
var path = "";
var version = "1.13"
//version: "1.12", "1.13" oder "1.14"
var scale = 10;
//Scale = 10: 10752x5376 pixel
//Scale = 20: 20504x10752 pixel

//don't change anything from here!

//shift the image, so 0,0 is in the exact middle of the map
var westShift = -537.6 * scale;
var northShift = -268.8 * scale;

//import heightmap and masks from images
var heightMap = wp.getHeightMap().fromFile(path+'images/HeightMap'+scale+'k.png').go();
var biomeMap = wp.getHeightMap().fromFile(path+'images/BiomeMap'+scale+'k.png').go();
var riverMask = wp.getHeightMap().fromFile(path+'images/WaterMap'+scale+'k.png').go();
var borderMask = wp.getHeightMap().fromFile(path+'images/Border'+scale+'k.png').go();
var iceMask = wp.getHeightMap().fromFile(path+'images/Ice'+scale+'k.png').go();
var citiesMask = wp.getHeightMap().fromFile(path+'images/Cities'+scale+'k.png').go();

//first of all, create the map using the heightmap (16bit image, so 0-65535, to avoid rounding errors)
//important to create this before importing custom terrain
var world = wp.createWorld()
	.fromHeightMap(heightMap)
	.shift(westShift, northShift)
	.fromLevels(0, 65535).toLevels(0, 255)
	.go();

//import layers
var biomesLayer = wp.getLayer().withName("Biomes").go();
var riverLayer = wp.getLayer().fromFile(path+'layers/Rivers.layer').go();
var borderLayer = wp.getLayer().fromFile(path+'layers/Borders.layer').go();
var citiesLayer = wp.getLayer().fromFile(path+'layers/Cities.layer').go();
var mesaLayer = wp.getLayer().fromFile(path+'layers/Mesa.layer').go();

//some filters for later
var deepOceanFilter = wp.createFilter()
    .belowLevel(61-(scale*1.3)/2)
    .go();

var waterFilter = wp.createFilter()
	.aboveLevel(0)
    .belowLevel(61)
    .onlyOnBiome(0) // ocean
    .go();
	
var riverFilter = wp.createFilter()
	.aboveLevel(62)
    .belowLevel(255)
    .onlyOnBiome(0) // ocean
    .go();

//import custom terrain
var terrain = wp.getTerrain().fromFile('terrain/Custom_Mesa.terrain').go();
var customMesa = wp.installCustomTerrain(terrain).toWorld(world).inSlot(1).go(); //Slot 1 = 47
var terrain = wp.getTerrain().fromFile('terrain/Deep_Ocean_Floor.terrain').go();
var deepOcean_Floor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(2).go(); //Slot 2 = 48
var terrain = wp.getTerrain().fromFile('terrain/Deep_Snow.terrain').go();
var deepsnow = wp.installCustomTerrain(terrain).toWorld(world).inSlot(3).go(); //Slot 3 = 49
var terrain = wp.getTerrain().fromFile('terrain/Ocean_Floor.terrain').go();
var oceanFloor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(4).go(); //Slot 4 = 50
var terrain = wp.getTerrain().fromFile('terrain/Patagonien.terrain').go();
var patagonien = wp.installCustomTerrain(terrain).toWorld(world).inSlot(5).go(); //Slot 5 = 51
var terrain = wp.getTerrain().fromFile('terrain/Red_Sand_Red_Sanstone_Mix.terrain').go();
var redSandSanstone = wp.installCustomTerrain(terrain).toWorld(world).inSlot(6).go(); //Slot 6 = 52
var terrain = wp.getTerrain().fromFile('terrain/Sand_Sanstone_Mix.terrain').go();
var sandSanstone = wp.installCustomTerrain(terrain).toWorld(world).inSlot(7).go(); //Slot 7 = 53
var terrain = wp.getTerrain().fromFile('terrain/Snow_Surface.terrain').go();
var snowSurface = wp.installCustomTerrain(terrain).toWorld(world).inSlot(8).go(); //Slot 8 = 54
var terrain = wp.getTerrain().fromFile('terrain/Taiga_Floor.terrain').go();
var taigaFloor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(9).go(); //Slot 9 = 55

//apply biomes
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.shift(westShift, northShift)
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

//apply terrain to biomes
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.shift(westShift, northShift)
	.applyToTerrain()
	.fromColour(0, 0, 255).toTerrain(1) //Af - Gras
	.fromColour(0, 120, 255).toTerrain(1) //Am - Gras
	.fromColour(70, 170, 250).toTerrain(1) //Aw - Gras
	.fromColour(255, 0, 0).toTerrain(53) //BWh - Sand
	.fromColour(255, 150, 150).toTerrain(51) //BWk - Sand
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

//apply mesa layer to one biome
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(mesaLayer)
	.fromColour(255, 100, 0).toTerrain(1)
	.go();

//apply MyRiver Layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(riverLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();

//apply ocean biome on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.fromLevels(1, 255).toLevel(0) //ocean
	.go();

//apply deep_ocean biome with filter
wp.applyHeightMap(riverMask) 
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.withFilter(deepOceanFilter)
	.fromColour(0, 0, 0).toLevel(24) // deep_ocean
	.go();
wp.applyHeightMap(biomeMap) 
	.toWorld(world)
	.shift(westShift, northShift)
	.withFilter(deepOceanFilter)
	.applyToTerrain()
	.fromColour(0, 0, 0).toLevel(48) // deep_ocean_floor
	.go();

//1.13 Ocean Biomes
if (version === "1.13" || version === "1.14") {
	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.fromColour(0, 150, 150).toLevel(46) //Cold Ocean - ocean 009696
		.fromColour(0, 150, 200).toLevel(0) //Ocean - ocean 0096C8
		.fromColour(100, 255, 100).toLevel(45) //Lukewarm Ocean - ocean 64FF64
		.fromColour(255, 0, 100).toLevel(44) //Warm Ocean - ocean FF0064
		.go();

	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(0, 150, 150).toLevel(49) // deep_cold_ocean
		.go();

	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(100, 255, 100).toLevel(48) // deep_lukewarn_ocean on lukewarm_ocean
		.go();

	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(255, 0, 100).toLevel(48) // deep_lukewarm_ocean on warm_ocean
		.go();
}

if (version === "1.14") {
	wp.applyHeightMap(biomeMap) 
		.toWorld(world)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.fromColour(0, 120, 255).toLevel(189) //Am - bamboo_jungle 0000FF 
		.go();
}

//replace river terrain on "river mask" with filter
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToTerrain()
	.fromLevels(1,255).toLevel(50) //Ocean Floor
	.withFilter(riverFilter)
	.go();
	
//replace ocean biome with river biome with filter
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.fromLevels(1,255).toLevel(7) //River
	.withFilter(riverFilter)
	.go();

//remove MyRiver layer on "river mask" with filter
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(riverLayer)
	.fromLevel(1).toLevel(0)
	.withFilter(waterFilter)
	.go()

//apply frozen_ocean on "ice mask"
wp.applyHeightMap(iceMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.fromLevels(1, 255).toLevel(10) // frozen_ocean
	.go();

//apply Border layer on "border mask"
wp.applyHeightMap(borderMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(borderLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
//remove border layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(borderLayer)
	.fromLevel(1).toLevel(0)
	.go()

//apply Cities layer on "cities mask"
wp.applyHeightMap(citiesMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(citiesLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
//remove Cities layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.shift(westShift, northShift)
	.applyToLayer(citiesLayer)
	.fromLevel(1).toLevel(0)
	.go()

//save the world
wp.saveWorld(world)
	.toFile(path+'earth_1-'+40/scale*1000+'.world')
	.go();
