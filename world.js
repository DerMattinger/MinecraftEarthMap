//path to your world.js script file
var path = "C:/WorldPainter/Script/"; //Use "/" instead of "\"

//version: "1-12", "1-13" or "1-14"
var version = "1-12";

//Scales:
//"10" = Scale 1:4000 - uses 10752x5376 pixel images
//"20" = Scale 1:2000 - uses 20504x10752 pixel images
//"40" = scale 1:1000 - uses 43008x20504 pixel images
var scale = 10;

//scale / resize of the images in percent, standard / no change = 100
var resize = 100;

//groundmaterial: "globecover", or "biomes"
var groundmaterial = "globecover";

//######################################
//## Don't change anything from here! ##
//######################################

//shift the image, so 0,0 is in the exact middle of the map (latitude and longitude 0,0)
var westShift = -Math.round(537.6 * scale * (resize / 100));
var northShift = -Math.round(268.8 * scale * (resize / 100));

if (scale == 40) {
	var globeCovera = wp.getHeightMap().fromFile(path+'images/globecover1_40k.png').go();
	var globeCoverb = wp.getHeightMap().fromFile(path+'images/globecover2a_40k.png').go();
	var globeCoverc = wp.getHeightMap().fromFile(path+'images/globecover2b_40k.png').go();
	var globeCoverd = wp.getHeightMap().fromFile(path+'images/globecover3_40k.png').go();
	var globeCovere = wp.getHeightMap().fromFile(path+'images/globecover4_40k.png').go();
} else {
	var globeCover = wp.getHeightMap().fromFile(path+'images/globecover'+Math.round(scale)+'k.png').go();
}
var biomeMap = wp.getHeightMap().fromFile(path+'images/BiomeMap'+Math.round(scale)+'k.png').go();
var oceanBiomeMap = wp.getHeightMap().fromFile(path+'images/OceanBiomeMap'+Math.round(scale)+'k.png').go();
var riverMask = wp.getHeightMap().fromFile(path+'images/WaterMap'+Math.round(scale)+'k.png').go();

//first of all, create the map using the heightmap (I prefer a 16bit grayscale image, so 0-65535 color steps, to avoid rounding errors)
//it's important to create this before importing custom terrain
var heightMap = wp.getHeightMap().fromFile(path+'images/HeightMap'+Math.round(scale)+'k.png').go();
var world = wp.createWorld()
    .fromHeightMap(heightMap)
    .scale(resize)
    .shift(westShift, northShift)
    .fromLevels(0, 65535).toLevels(0, 255)
    .go();
heightMap = null;

//calculate the spawnpoint
var spawnX = Math.round(110.5 * scale);
var spawnY = -Math.round(11.4 * scale);
//set spawnpoint
world.setSpawnPoint(new java.awt.Point(spawnX, spawnY));

//now import the layers
var biomesLayer = wp.getLayer().withName("Biomes").go();
var riverLayer = wp.getLayer().fromFile(path+'layer/Rivers.layer').go();
var mesaLayer = wp.getLayer().fromFile(path+'layer/Mesa.layer').go();
var swampLayer = wp.getLayer().fromFile(path+'layer/Swamp.layer').go();

//create some filters for later use
var oceanFilter = wp.createFilter()
    .aboveLevel(0)
    .belowLevel(Math.round(61-(scale*0.3)))
    .onlyOnBiome(0) // ocean
    .go();

var deepOceanFilter = wp.createFilter()
    .aboveLevel(0)
    .belowLevel(Math.round(61-(scale*0.65)))
    .onlyOnBiome(0) // ocean
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
var terrain = wp.getTerrain().fromFile(path+'terrain/Custom_Mesa.terrain').go();
var customMesa = wp.installCustomTerrain(terrain).toWorld(world).inSlot(1).go(); //Slot 1 = 47 see Documentation
var terrain = wp.getTerrain().fromFile(path+'terrain/Deep_Ocean_Floor.terrain').go();
var deepOcean_Floor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(2).go(); //Slot 2 = 48
var terrain = wp.getTerrain().fromFile(path+'terrain/Deep_Snow.terrain').go();
var deepsnow = wp.installCustomTerrain(terrain).toWorld(world).inSlot(3).go(); //Slot 3 = 49
var terrain = wp.getTerrain().fromFile(path+'terrain/Ocean_Floor.terrain').go();
var oceanFloor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(4).go(); //Slot 4 = 50
var terrain = wp.getTerrain().fromFile(path+'terrain/stone_sand_gravel_grass_block.terrain').go();
var stoneSandGravelGrass_block = wp.installCustomTerrain(terrain).toWorld(world).inSlot(5).go(); //Slot 5 = 51
var terrain = wp.getTerrain().fromFile(path+'terrain/Red_Sand_Red_Sanstone_Mix.terrain').go();
var redSandSanstone = wp.installCustomTerrain(terrain).toWorld(world).inSlot(6).go(); //Slot 6 = 52
var terrain = wp.getTerrain().fromFile(path+'terrain/Sand_Sanstone_Mix.terrain').go();
var sandSanstone = wp.installCustomTerrain(terrain).toWorld(world).inSlot(7).go(); //Slot 7 = 53
var terrain = wp.getTerrain().fromFile(path+'terrain/Snow_Surface.terrain').go();
var snowSurface = wp.installCustomTerrain(terrain).toWorld(world).inSlot(8).go(); //Slot 8 = 54
var terrain = wp.getTerrain().fromFile(path+'terrain/Taiga_Floor.terrain').go();
var taigaFloor = wp.installCustomTerrain(terrain).toWorld(world).inSlot(9).go(); //Slot 9 = 55
var terrain = wp.getTerrain().fromFile(path+'terrain/Sand_Gras_Mix.terrain').go();
var sandGrasMix = wp.installCustomTerrain(terrain).toWorld(world).inSlot(10).go(); //Slot 10 = 56
var terrain = wp.getTerrain().fromFile(path+'terrain/Swamp.terrain').go();
var swamp = wp.installCustomTerrain(terrain).toWorld(world).inSlot(11).go(); //Slot 11 = 57

//apply terrain to biomes
if (groundmaterial === "biomes") {
	wp.applyHeightMap(biomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToTerrain()
		.fromColour(0, 0, 255).toTerrain(1) //Af - Gras
		.fromColour(0, 120, 255).toTerrain(1) //Am - Gras
		.fromColour(70, 170, 250).toTerrain(1) //Aw - Gras
		.fromColour(255, 0, 0).toTerrain(53) //BWh - Sand
		.fromColour(255, 150, 150).toTerrain(51) //BWk - Sand
		.fromColour(245, 165, 0).toTerrain(1) //BSh - Gras
		.fromColour(255, 220, 100).toTerrain(56) //BSk - Sand
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
		.fromColour(150, 50, 150).toTerrain(1) //Dsc - Gras
		.fromColour(150, 100, 150).toTerrain(55) //Dsd - Podzol
		.fromColour(170, 175, 255).toTerrain(1) //Dwa - Gras
		.fromColour(90, 120, 220).toTerrain(1) //Dwb - Gras
		.fromColour(75, 80, 180).toTerrain(55) //Dwc - Podzol
		.fromColour(50, 0, 135).toTerrain(55) //Dwd - Podzol
		.fromColour(0, 255, 255).toTerrain(1) //Dfa - Gras
		.fromColour(55, 200, 255).toTerrain(1) //Dfb - Gras
		.fromColour(0, 125, 125).toTerrain(55) //Dfc - Podzol
		.fromColour(0, 70, 95).toTerrain(1) //Dfd - Gras
		.fromColour(178, 178, 178).toTerrain(40) //ET - deep_snow
		.fromColour(102, 102, 102).toTerrain(49) //EF - Custom Deep Snow
		.fromColour(200, 200, 200).toTerrain(5) // sand
		.fromColour(220, 220, 220).toTerrain(40) // deep_snow
		.fromColour(255, 100, 0).toTerrain(6) // red_sand
		.fromColour(0, 0, 0).toTerrain(50) // Sand
		//Australia
		.fromColour(255, 20, 0).toLevel(52) //BWh - custom_red_sand
		.fromColour(255, 170, 150).toLevel(52) //BWk - custom_red_sand
		.fromColour(255, 255, 100).toLevel(52) //BSk - custom_red_sand
		.go();
} else if (groundmaterial === "globecover") {
	if (scale == 40) {
		wp.applyHeightMap(globeCovera) 
			.toWorld(world)
			.scale(resize)
			.shift(westShift, northShift)
			.applyToTerrain()
			.fromColour(0, 255, 0).toTerrain(1) //Gras
			.fromColour(255, 255, 0).toTerrain(53) //custom_sand
			.fromColour(255, 255, 255).toTerrain(40) // deep_snow
			.fromColour(127, 0, 0).toTerrain(55) //Podzol
			.fromColour(255, 0, 0).toTerrain(52) //custom_red_sand
			.fromColour(150, 150, 150).toTerrain(51) //stone_sand_gravel_grass
			.fromColour(255, 127, 0).toTerrain(56) //Sand_Gras_Mix
			.fromColour(0, 127, 127).toTerrain(1) //Swamp -> Gras, gets partly overwritten
			.fromColour(0, 148, 255).toTerrain(5) //Ocean / Rivers -> Sand, gets partly overwritten
			.go();
		//apply swamp layer to one biome
		wp.applyHeightMap(globeCovera) 
			.toWorld(world)
			.scale(resize)
			.shift(westShift, northShift)
			.applyToLayer(swampLayer)
			.fromColour(0, 127, 127).toLevel(1)
			.go();
		wp.applyHeightMap(globeCoverb) 
			.toWorld(world)
			.scale(resize)
			.shift(0, northShift)
			.applyToTerrain()
			.fromColour(0, 255, 0).toTerrain(1) //Gras
			.fromColour(255, 255, 0).toTerrain(53) //custom_sand
			.fromColour(255, 255, 255).toTerrain(40) // deep_snow
			.fromColour(127, 0, 0).toTerrain(55) //Podzol
			.fromColour(255, 0, 0).toTerrain(52) //custom_red_sand
			.fromColour(150, 150, 150).toTerrain(51) //stone_sand_gravel_grass
			.fromColour(255, 127, 0).toTerrain(56) //Sand_Gras_Mix
			.fromColour(0, 127, 127).toTerrain(1) //Swamp -> Gras, gets partly overwritten
			.fromColour(0, 148, 255).toTerrain(5) //Ocean / Rivers -> Sand, gets partly overwritten
			.go();
		//apply swamp layer to one biome
		wp.applyHeightMap(globeCoverb) 
			.toWorld(world)
			.scale(resize)
			.shift(0, northShift)
			.applyToLayer(swampLayer)
			.fromColour(0, 127, 127).toLevel(1)
			.go();
		wp.applyHeightMap(globeCoverc) 
			.toWorld(world)
			.scale(resize)
			.shift(-westShift/2, northShift)
			.applyToTerrain()
			.fromColour(0, 255, 0).toTerrain(1) //Gras
			.fromColour(255, 255, 0).toTerrain(53) //custom_sand
			.fromColour(255, 255, 255).toTerrain(40) // deep_snow
			.fromColour(127, 0, 0).toTerrain(55) //Podzol
			.fromColour(255, 0, 0).toTerrain(52) //custom_red_sand
			.fromColour(150, 150, 150).toTerrain(51) //stone_sand_gravel_grass
			.fromColour(255, 127, 0).toTerrain(56) //Sand_Gras_Mix
			.fromColour(0, 127, 127).toTerrain(1) //Swamp -> Gras, gets partly overwritten
			.fromColour(0, 148, 255).toTerrain(5) //Ocean / Rivers -> Sand, gets partly overwritten
			.go();
		//apply swamp layer to one biome
		wp.applyHeightMap(globeCoverc) 
			.toWorld(world)
			.scale(resize)
			.shift(-westShift/2, northShift)
			.applyToLayer(swampLayer)
			.fromColour(0, 127, 127).toLevel(1)
			.go();
		wp.applyHeightMap(globeCoverd) 
			.toWorld(world)
			.scale(resize)
			.shift(westShift, 0)
			.applyToTerrain()
			.fromColour(0, 255, 0).toTerrain(1) //Gras
			.fromColour(255, 255, 0).toTerrain(53) //custom_sand
			.fromColour(255, 255, 255).toTerrain(40) // deep_snow
			.fromColour(127, 0, 0).toTerrain(55) //Podzol
			.fromColour(255, 0, 0).toTerrain(52) //custom_red_sand
			.fromColour(150, 150, 150).toTerrain(51) //stone_sand_gravel_grass
			.fromColour(255, 127, 0).toTerrain(56) //Sand_Gras_Mix
			.fromColour(0, 127, 127).toTerrain(1) //Swamp -> Gras, gets partly overwritten
			.fromColour(0, 148, 255).toTerrain(5) //Ocean / Rivers -> Sand, gets partly overwritten
			.go();
		//apply swamp layer to one biome
		wp.applyHeightMap(globeCoverd) 
			.toWorld(world)
			.scale(resize)
			.shift(westShift, 0)
			.applyToLayer(swampLayer)
			.fromColour(0, 127, 127).toLevel(1)
			.go();
		wp.applyHeightMap(globeCovere) 
			.toWorld(world)
			.scale(resize)
			.shift(0, 0)
			.applyToTerrain()
			.fromColour(0, 255, 0).toTerrain(1) //Gras
			.fromColour(255, 255, 0).toTerrain(53) //custom_sand
			.fromColour(255, 255, 255).toTerrain(40) // deep_snow
			.fromColour(127, 0, 0).toTerrain(55) //Podzol
			.fromColour(255, 0, 0).toTerrain(52) //custom_red_sand
			.fromColour(150, 150, 150).toTerrain(51) //stone_sand_gravel_grass
			.fromColour(255, 127, 0).toTerrain(56) //Sand_Gras_Mix
			.fromColour(0, 127, 127).toTerrain(1) //Swamp -> Gras, gets partly overwritten
			.fromColour(0, 148, 255).toTerrain(5) //Ocean / Rivers -> Sand, gets partly overwritten
			.go();
		//apply swamp layer to one biome
		wp.applyHeightMap(globeCovere)
			.toWorld(world)
			.scale(resize)
			.shift(0, 0)
			.applyToLayer(swampLayer)
			.fromColour(0, 127, 127).toLevel(1)
			.go();
	} else {
		wp.applyHeightMap(globeCover) 
			.toWorld(world)
			.scale(resize)
			.shift(westShift, northShift)
			.applyToTerrain()
			.fromColour(0, 255, 0).toTerrain(1) //Gras
			.fromColour(255, 255, 0).toTerrain(53) //custom_sand
			.fromColour(255, 255, 255).toTerrain(40) // deep_snow
			.fromColour(127, 0, 0).toTerrain(55) //Podzol
			.fromColour(255, 0, 0).toTerrain(52) //custom_red_sand
			.fromColour(150, 150, 150).toTerrain(51) //stone_sand_gravel_grass
			.fromColour(255, 127, 0).toTerrain(56) //Sand_Gras_Mix
			.fromColour(0, 127, 127).toTerrain(1) //Swamp -> Gras, gets partly overwritten
			.fromColour(0, 148, 255).toTerrain(5) //Ocean / Rivers -> Sand, gets partly overwritten
			.go();
		//apply swamp layer to one biome
		wp.applyHeightMap(globeCover) 
			.toWorld(world)
			.scale(resize)
			.shift(westShift, northShift)
			.applyToLayer(swampLayer)
			.fromColour(0, 127, 127).toLevel(1)
			.go();
	}
}

//apply biomes
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.scale(resize)
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
	.fromColour(150, 50, 150).toLevel(30) //Dsc - snowy_taiga 963296
	.fromColour(150, 100, 150).toLevel(161) //Dsd - giant_spruce_taiga_hills 966496
	.fromColour(170, 175, 255).toLevel(6) //Dwa - swamp AAAFFF
	.fromColour(90, 120, 220).toLevel(134) //Dwb - swampland_hills 5A78DC
	.fromColour(75, 80, 180).toLevel(32) //Dwc - giant_tree_taiga 4B50B4
	.fromColour(50, 0, 135).toLevel(160) //Dwd - giant_spruce_taiga 320087
	.fromColour(0, 255, 255).toLevel(29) //Dfa - dark_forest 00FFFF
	.fromColour(55, 200, 255).toLevel(5) //Dfb - taiga 37C8FF
	.fromColour(0, 125, 125).toLevel(33) //Dfc - giant_tree_taiga_hills 007D7D
	.fromColour(0, 70, 95).toLevel(13) //Dfd - snowy_mountains 00465F
	.fromColour(178, 178, 178).toLevel(12) //ET - snowy_tundra B2B2B2
	.fromColour(102, 102, 102).toLevel(140) //EF - ice_spikes 666666
	.fromColour(200, 200, 200).toLevel(16) // - beach B2B2B2
	.fromColour(220, 220, 220).toLevel(26) // - snowy_beach DCDCDC
	.fromColour(255, 100, 0).toLevel(37) // - badlands FF6400
	.fromColour(0, 0, 0).toLevel(0) //Ocean - ocean 000000
	//Australia
	.fromColour(255, 20, 0).toLevel(2) //BWh - desert FF0000
	.fromColour(255, 170, 150).toLevel(17) //BWk - desert_hills FF9696
	.fromColour(255, 255, 100).toLevel(130) //BSk - desert_lakes FFDC64
	.go();

//apply mesa layer to one biome
wp.applyHeightMap(biomeMap) 
    .toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(mesaLayer)
	.fromColour(255, 100, 0).toTerrain(1)
	.go();

//apply MyRiver Layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(riverLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();

//apply ocean biome on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.fromLevels(1, 255).toLevel(0) //ocean
	.go();

//apply deep_ocean biome with filter
wp.applyHeightMap(biomeMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.withFilter(deepOceanFilter)
	.fromColour(0, 0, 0).toLevel(24) // deep_ocean
	.go();
wp.applyHeightMap(biomeMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.withFilter(oceanFilter)
	.applyToTerrain()
	.fromColour(0, 0, 0).toLevel(50) // ocean_floor
	.go();
wp.applyHeightMap(biomeMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.withFilter(deepOceanFilter)
	.applyToTerrain()
	.fromColour(0, 0, 0).toLevel(48) // deep_ocean_floor
	.go();

//1-13 Ocean Biomes
if (version === "1-13" || version === "1-14") {
	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.fromColour(0, 150, 150).toLevel(46) //Cold Ocean - ocean 009696
		.fromColour(0, 150, 200).toLevel(0) //Ocean - ocean 0096C8
		.fromColour(100, 255, 100).toLevel(45) //Lukewarm Ocean - ocean 64FF64
		.fromColour(255, 0, 100).toLevel(44) //Warm Ocean - ocean FF0064
		.go();
			
	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(0, 150, 200).toLevel(24) // deep_ocean
		.go();

	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(0, 150, 150).toLevel(49) // deep_cold_ocean
		.go();

	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(100, 255, 100).toLevel(48) // deep_lukewarn_ocean on lukewarm_ocean
		.go();

	wp.applyHeightMap(oceanBiomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.withFilter(deepOceanFilter)
		.fromColour(255, 0, 100).toLevel(48) // deep_lukewarm_ocean on warm_ocean
		.go();
}

if (version === "1-14") {
	wp.applyHeightMap(biomeMap) 
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.fromColour(0, 120, 255).toLevel(189) //Am - bamboo_jungle 0000FF 
		.go();
}

if (scale == 40) {
	globeCovera = null;
	globeCoverb = null;
	globeCoverc = null;
	globeCoverd = null;
	globeCovere = null;
	globeCover = null;
} else {
	globeCover = null;
}
biomeMap = null;
oceanBiomeMap = null;

//replace river terrain on "river mask" with filter
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToTerrain()
	.fromLevels(1,255).toLevel(50) //Ocean Floor
	.withFilter(riverFilter)
	.go();
	
//replace ocean biome with river biome with filter
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.fromLevels(1,255).toLevel(7) //River
	.withFilter(riverFilter)
	.go();

//remove MyRiver layer on "river mask" with ocean filter
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(riverLayer)
	.fromLevel(1).toLevel(0)
	.withFilter(waterFilter)
	.go()
	
var iceMask = wp.getHeightMap().fromFile(path+'images/Ice'+Math.round(scale)+'k.png').go();
//apply frozen_ocean on "ice mask"
wp.applyHeightMap(iceMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(biomesLayer)
	.fromLevels(1, 255).toLevel(10) // frozen_ocean
	.go();
if (version === "1-13" || version === "1-14") {
	//apply deep_frozen_ocean on "ice mask"
	wp.applyHeightMap(iceMask)
		.toWorld(world)
		.scale(resize)
		.shift(westShift, northShift)
		.applyToLayer(biomesLayer)
		.fromLevels(1, 255).toLevel(50) // deep_frozen_ocean
		.withFilter(deepOceanFilter)
		.go();
}
iceMask = null;

//apply Border layer on "border mask"
var borderMask = wp.getHeightMap().fromFile(path+'images/Border'+Math.round(scale)+'k.png').go();
var borderLayer = wp.getLayer().fromFile(path+'layer/Borders.layer').go();
wp.applyHeightMap(borderMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(borderLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
//remove border layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(borderLayer)
	.fromLevel(1).toLevel(0)
	.go()
borderMask = null;

//apply Cities layer on "cities mask"
var citiesMask = wp.getHeightMap().fromFile(path+'images/Cities'+Math.round(scale)+'k.png').go();
var citiesLayer = wp.getLayer().fromFile(path+'layer/Cities.layer').go();
wp.applyHeightMap(citiesMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(citiesLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
//remove Cities layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(citiesLayer)
	.fromLevel(1).toLevel(0)
	.go()
citiesLayer = null;

//apply streets layer on "street mask"
var streetMask = wp.getHeightMap().fromFile(path+'images/street'+Math.round(scale)+'k.png').go();
var streetLayer = wp.getLayer().fromFile(path+'layer/street.layer').go();
wp.applyHeightMap(streetMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(streetLayer)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
//remove street layer on "river mask"
wp.applyHeightMap(riverMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(streetLayer)
	.fromLevel(1).toLevel(0)
	.go()
//remove border layer on "steet mask"
wp.applyHeightMap(streetMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(borderLayer)
	.fromLevel(1).toLevel(0)
	.go()
//remove street layer on "city mask"
wp.applyHeightMap(citiesMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(streetLayer)
	.fromLevel(1).toLevel(0)
	.go()
streetMask = null;
streetLayer = null;

borderLayer = null;
citiesMask = null;

//apply Gold layer on "gold mask"
var GoldMask = wp.getHeightMap().fromFile(path+'images/Gold'+Math.round(scale)+'k.png').go();
var goldDeposit = wp.getLayer().fromFile(path+'ore/gold_deposit.layer').go();
wp.applyHeightMap(GoldMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(goldDeposit)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
GoldMask = null;
goldDeposit = null;	
	
//apply Iron layer on "iron mask"
var IronMask = wp.getHeightMap().fromFile(path+'images/Iron'+Math.round(scale)+'k.png').go();
var ironDeposit = wp.getLayer().fromFile(path+'ore/iron_deposit.layer').go();
wp.applyHeightMap(IronMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(ironDeposit)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
IronMask = null;
ironDeposit = null;
	
//apply Diamond layer on "diamond mask"
var DiamondMask = wp.getHeightMap().fromFile(path+'images/Diamond'+Math.round(scale)+'k.png').go();
var diamondDeposit = wp.getLayer().fromFile(path+'ore/diamond_deposit.layer').go();
wp.applyHeightMap(DiamondMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(diamondDeposit)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
DiamondMask = null;
diamondDeposit = null;	
	
//apply Coal layer on "coal mask"
var CoalMask = wp.getHeightMap().fromFile(path+'images/Coal'+Math.round(scale)+'k.png').go();
var coalDeposit = wp.getLayer().fromFile(path+'ore/coal_deposit.layer').go();
wp.applyHeightMap(CoalMask)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(coalDeposit)
	.fromLevel(0).toLevel(0)
	.fromLevels(1, 255).toLevel(1)
	.go();
CoalMask = null;
coalDeposit = null;
	
//the following layers only on land
var OceanMap = wp.getHeightMap().fromFile(path+'images/Mask'+Math.round(scale)+'k.png').go();
	
//apply clay layer on "clay mask"
var clayDeposit = wp.getLayer().fromFile(path+'ore/clay_deposit.layer').go();
wp.applyHeightMap(OceanMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(clayDeposit)
	.fromLevel(0).toLevel(1)
	.fromLevels(1, 255).toLevel(0)
	.go();
clayDeposit = null;
	
//apply clay layer on "sand mask"
var sandDeposit = wp.getLayer().fromFile(path+'ore/sand_deposit.layer').go();
wp.applyHeightMap(OceanMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(sandDeposit)
	.fromLevel(0).toLevel(1)
	.fromLevels(1, 255).toLevel(0)
	.go();
sandDeposit = null;

//apply red sand layer on land
var redSandDeposit = wp.getLayer().fromFile(path+'ore/red_sand_deposit.layer').go();
wp.applyHeightMap(OceanMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(redSandDeposit)
	.fromLevel(0).toLevel(1)
	.fromLevels(1, 255).toLevel(0)
	.go();
redSandDeposit = null;

//apply emerald layer everywhere
var emeraldDeposit = wp.getLayer().fromFile(path+'ore/emerald_deposit.layer').go();
wp.applyHeightMap(OceanMap)
	.toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(emeraldDeposit)
	.fromLevel(0).toLevel(1)
	.fromLevels(1, 255).toLevel(1)
	.go();
emeraldDeposit = null;

OceanMap = null;

//end-portal
var portalMask = wp.getHeightMap().fromFile(path+'images/Portal'+Math.round(scale)+'k.png').go();
var Endportal_East = wp.getLayer().fromFile(path+'portal/Endportal_East.layer').go();
var Endportal_North = wp.getLayer().fromFile(path+'portal/Endportal_North.layer').go();
var Endportal_South = wp.getLayer().fromFile(path+'portal/Endportal_South.layer').go();
var Endportal_West = wp.getLayer().fromFile(path+'portal/Endportal_West.layer').go();

wp.applyHeightMap(portalMask) 
    .toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(Endportal_East)
	.fromColour(255, 255, 0).toLevel(1)
	.go();
	
wp.applyHeightMap(portalMask) 
    .toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(Endportal_North)
	.fromColour(0, 255, 0).toLevel(1)
	.go();
	
wp.applyHeightMap(portalMask) 
    .toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(Endportal_South)
	.fromColour(255, 0, 0).toLevel(1)
	.go();
	
wp.applyHeightMap(portalMask) 
    .toWorld(world)
	.scale(resize)
	.shift(westShift, northShift)
	.applyToLayer(Endportal_West)
	.fromColour(0, 0, 255).toLevel(1)
	.go();

var portalMask = null;
var Endportal_East = null;
var Endportal_North = null;
var Endportal_South = null;
var Endportal_West = null;

//last but not least, save the world
if (resize == 100) {
	wp.saveWorld(world)
		.toFile(path+'earth_1-'+Math.round(40/scale*1000)+'_'+version+'.world')
		.go();
} else {
	wp.saveWorld(world)
		.toFile(path+'earth_1-'+Math.round(40/scale*1000)+'_'+version+'(resized by '+resize+' percent).world')
		.go();
}

world = null;
