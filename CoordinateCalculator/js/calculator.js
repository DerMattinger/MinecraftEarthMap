$("#latitude_hour").change(function() {
	displayDMS();
});

$("#latitude_minute").change(function() {
	displayDMS();
});

$("#latitude_second").change(function() {
	displayDMS();
});

$("#longitude_hour").change(function() {
	displayDMS();
});

$("#longitude_minute").change(function() {
	displayDMS();
});

$("#longitude_second").change(function() {
	displayDMS();
});

$("latitude_direction").change(function() {
	displayDMS();
});

$("longitude_direction").change(function() {
	displayDMS();
});

$("#latitude_dec").change(function() {
	displayDEC();
});

$("#longitude_dec").change(function() {
	displayDEC();
});
$("#scale").change(function() {
	displayDMS();
});
$("#xcoord").change(function() {
	displayCoords();
});
$("#zcoord").change(function() {
	displayCoords();
});

function displayDMS(){
	var latitude_hour = $("#latitude_hour").val();
	var latitude_minute = $("#latitude_minute").val();
	var latitude_second = $("#latitude_second").val();
	var latitude_direction = $("#latitude_direction").val();
	var longitude_hour = $("#longitude_hour").val();
	var longitude_minute = $("#longitude_minute").val();
	var longitude_second = $("#longitude_second").val();
	var longitude_direction = $("#longitude_direction").val();
	var scale = $("#scale").val();
	
	var latitude_dec = 0;
	if(latitude_direction == "south"){
		latitude_dec = -1 * (latitude_hour / 1) + (latitude_minute / 60) + (latitude_second / 3600);
	}else if(latitude_direction == "north"){
		latitude_dec = ((latitude_hour / 1) + (latitude_minute / 60) + (latitude_second / 3600));
	}
	
	var longitude_dec = 0;
	if(longitude_direction == "east"){
		longitude_dec = (longitude_hour / 1) + (longitude_minute / 60) + (longitude_second / 3600);
	}else if(longitude_direction == "west"){
		longitude_dec = -1 * ((longitude_hour / 1) + (longitude_minute / 60) + (longitude_second / 3600));
	}
	
	latitude_dec = round_six(latitude_dec);
	longitude_dec = round_six(longitude_dec);
	
	var x_coord = 0;
	xcoord = Math.round(longitude_dec * 120000 / scale);
	
	var z_coord = 0;
	zcoord = -1 * Math.round(latitude_dec * 120000 / scale);
	
	$("#latitude_dec").val( latitude_dec );
	$("#longitude_dec").val( longitude_dec );
	
	$("#xcoord").val( xcoord );
	$("#zcoord").val( zcoord );
	
	$("#command").val( "/tp <name> " + xcoord + " 255 " + zcoord );
}

function displayDEC(){
	var latitude_dec = $("#latitude_dec").val();
	var longitude_dec = $("#longitude_dec").val();
	var scale = $("#scale").val();
	
	var latitude_direction = "north";
	var latitude_hour = 0;
	var latitude_minute = 0;
	var latitude_second = 0;
	if(latitude_dec < 0){
		latitude_direction = "south";
		latitude_hour = Math.floor(-1 * latitude_dec);
		latitude_minute = Math.floor((-1 * latitude_dec - latitude_hour) * 60);
		latitude_second = (-1 * latitude_dec - (latitude_hour + latitude_minute / 60)) * 3600;
		latitude_second = round_three(latitude_second);
	}else{
		latitude_direction = "north";
		latitude_hour = Math.floor(latitude_dec);
		latitude_minute = Math.floor((latitude_dec - latitude_hour) * 60);
		latitude_second = (latitude_dec - (latitude_hour + latitude_minute / 60)) * 3600;
		latitude_second = round_three(latitude_second);
	}
	
	var longitude_direction = "east";
	var longitude_hour = 0;
	var longitude_minute = 0;
	var longitude_second = 0;
	if(longitude_dec < 0){
		longitude_direction = "west";
		longitude_hour = Math.floor(-1 * longitude_dec);
		longitude_minute = Math.floor((-1 * longitude_dec - longitude_hour) * 60);
		longitude_second = (-1 * longitude_dec - (longitude_hour + longitude_minute / 60)) * 3600;
		longitude_second = round_three(longitude_second);
	}else{
		longitude_direction = "east";
		longitude_hour = Math.floor(longitude_dec);
		longitude_minute = Math.floor((longitude_dec - longitude_hour) * 60);
		longitude_second = (longitude_dec - (longitude_hour + longitude_minute / 60)) * 3600;
		longitude_second = round_three(longitude_second);
	}
	
	$("#latitude_hour").val( latitude_hour );
	$("#latitude_minute").val( latitude_minute );
	$("#latitude_second").val( latitude_second );
	$("#latitude_direction").val( latitude_direction );
	$("#longitude_hour").val( longitude_hour );
	$("#longitude_minute").val( longitude_minute );
	$("#longitude_second").val( longitude_second );
	$("#longitude_direction").val( longitude_direction );

	var x_coord = 0;
	xcoord = Math.round(longitude_dec * 120000 / scale );
	
	var z_coord = 0;
	zcoord = -1 * Math.round(latitude_dec * 120000 / scale);
		
	$("#xcoord").val( xcoord );
	$("#zcoord").val( zcoord );
	
	$("#command").val( "/tp <name> " + xcoord + " 255 " + zcoord );
}

function displayCoords(){
	var xcoord = $("#xcoord").val();
	var zcoord = $("#zcoord").val();
	var scale = $("#scale").val();

	var longitude_dec = 0;
	longitude_dec = xcoord * scale / 120000;
	
	var latitude_dec = 0;
	latitude_dec = -1 * zcoord * scale / 120000;
	
	latitude_dec = round_six(latitude_dec);
	longitude_dec = round_six(longitude_dec);
	
	$("#latitude_dec").val( latitude_dec );
	$("#longitude_dec").val( longitude_dec );

	var latitude_direction = "north";
	var latitude_hour = 0;
	var latitude_minute = 0;
	var latitude_second = 0;
	if(latitude_dec < 0){
		latitude_direction = "south";
		latitude_hour = Math.floor(-1 * latitude_dec);
		latitude_minute = Math.floor((-1 * latitude_dec - latitude_hour) * 60);
		latitude_second = (-1 * latitude_dec - (latitude_hour + latitude_minute / 60)) * 3600;
		latitude_second = round_three(latitude_second);
	}else{
		latitude_direction = "north";
		latitude_hour = Math.floor(latitude_dec);
		latitude_minute = Math.floor((latitude_dec - latitude_hour) * 60);
		latitude_second = (latitude_dec - (latitude_hour + latitude_minute / 60)) * 3600;
		latitude_second = round_three(latitude_second);
	}
	
	var longitude_direction = "east";
	var longitude_hour = 0;
	var longitude_minute = 0;
	var longitude_second = 0;
	if(longitude_dec < 0){
		longitude_direction = "west";
		longitude_hour = Math.floor(-1 * longitude_dec);
		longitude_minute = Math.floor((-1 * longitude_dec - longitude_hour) * 60);
		longitude_second = (-1 * longitude_dec - (longitude_hour + longitude_minute / 60)) * 3600;
		longitude_second = round_three(longitude_second);
	}else{
		longitude_direction = "east";
		longitude_hour = Math.floor(longitude_dec);
		longitude_minute = Math.floor((longitude_dec - longitude_hour) * 60);
		longitude_second = (longitude_dec - (longitude_hour + longitude_minute / 60)) * 3600;
		longitude_second = round_three(longitude_second);
	}
	
	$("#latitude_hour").val( latitude_hour );
	$("#latitude_minute").val( latitude_minute );
	$("#latitude_second").val( latitude_second );
	$("#latitude_direction").val( latitude_direction );
	$("#longitude_hour").val( longitude_hour );
	$("#longitude_minute").val( longitude_minute );
	$("#longitude_second").val( longitude_second );
	$("#longitude_direction").val( longitude_direction );
	
	$("#command").val( "/tp <name> " + xcoord + " 255 " + zcoord );
}


function round_six(x) {
  return Number.parseFloat(x).toFixed(6);
}

function round_three(x) {
  return Number.parseFloat(x).toFixed(3);
}