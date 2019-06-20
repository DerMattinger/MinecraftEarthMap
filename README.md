# MinecraftEarthMap
WorldPainter Script and Heightmaps for generating an "Earth Map" for Minecraft

Just run the script "world.js" from "tools" -> "Run Script..." in WorldPainter.
Be sure to place all images, layers and terrain in the right folders.
But first change the "path" variable to match your folder with the script and files.

The script was testet on an intel i5 6500 with 32GB RAM.
Time / needed RAM to execute the script for 1.12:

1:4000 = 3 min / 2,1GB RAM

1:2000 = 14 min / 5,7GB RAM

1:1000 = 62 min / 19,1GB RAM


## Sources
Heightmap: https://visibleearth.nasa.gov/view.php?id=73934

Bathymetry: https://visibleearth.nasa.gov/view.php?id=73963

Globcover: http://due.esrin.esa.int/page_globcover.php

Köppen climate classification: https://figshare.com/articles/Present_and_future_K_ppen-Geiger_climate_classification_maps_at_1-km_resolution/6396959/2

Sea Temperatur: https://svs.gsfc.nasa.gov/3652

Cities & Ice: http://www.shadedrelief.com/natural3/pages/extra.html

Mineral Distribution: https://mrdata.usgs.gov/major-deposits/

OSM-Data: https://download.geofabrik.de/


## Images
The basement of the script are the various images. To determine the right resolution, I referred to Minecraft's region files, which have a size of 512x512 blocks. The final map should be a multiple of 512. The next step in my process was to edit the existing images. For example, the "Köppen climate classification" image had a original resolution of 43200x21600 pixel. The nearest fit for the map is 43008x21504, so I changed the canvas size (I didn't want to resize the image, otherwise information would be lost. Anti-aliasing is also forbidden since the script assigns a biome to a specific RGB color.)

The same step was made for Globcover, except the original resolution was 129600x55800, which is not the 2:1 format. That's because antarctica isn't pictured in this image. At first, I changed the canvas size to 129600x64800 (added the new pixels at the bottom of the existing image), then resized the image to 43200x21600 pixel (this is exact 1/3) without resampling (again, we don't want anti-aliasing) and then changed the canvas again to match 43008x21504.

For the heightmaps, I combined the surface elevation and the bathymetry images of the nasa, which had a resolutions of 21600x10800. At first, I resized the images to 43200x21600, this time with resampling (Bicubic interpolation), so we get smoother mountains. Later, I also used a blur effect for a more realistic elevation in Minecraft.

For a lot of images from "shadedrelief" I had to resize from 16200x8100 pixel and used a posterize effect afterwards, because layers are only applied or not applied /  1 or 0 / black or white.

For the OSM-Data I used QGIS3 to export the images.

In summary, each image has an original resolution of 43200x21600 and is then cut to 43008x21504 (even on all sides).
