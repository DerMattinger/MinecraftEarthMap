# Minecraft Earth Map
WorldPainter script and heightmaps for generating an Earth map for Minecraft.

Just run the script "world.js" from "tools" -> "Run Script..." in WorldPainter.
Be sure to change the "path" variable to match your folder with the script and files. Be sure to place all images, layers and terrain in the right folders.

The script was tested on an Intel i5-6500 with 32 GB of RAM.

Time / RAM needed to execute the script for 1.12:

1:4000 = 3 min / 2.1 GB RAM

1:2000 = 14 min / 5.7 GB RAM

1:1000 = 62 min / 19.1 GB RAM


## Sources
Heightmap: https://visibleearth.nasa.gov/view.php?id=73934

Bathymetry: https://visibleearth.nasa.gov/view.php?id=73963

Globcover: http://due.esrin.esa.int/page_globcover.php

Köppen Climate Classification: https://figshare.com/articles/Present_and_future_K_ppen-Geiger_climate_classification_maps_at_1-km_resolution/6396959/2

Sea Surface Temperature: https://svs.gsfc.nasa.gov/3652

Cities & Ice: http://www.shadedrelief.com/natural3/pages/extra.html

Major Mineral Deposits: https://mrdata.usgs.gov/major-deposits/

Streets: https://download.geofabrik.de/


## Images
The base of the script are the various images linked above. To determine the right resolution, I referred to Minecraft's region files, which have a size of 512x512 blocks. The final map should be a multiple of 512. The next step in my process was to edit the existing images. For example, the "Köppen Climate Classification" image had an original resolution of 43200x21600 pixels. The nearest fit for the map is 43008x21504, so I changed the canvas size (I didn't want to resize the image, otherwise information would be lost. Anti-aliasing is also forbidden since the script assigns a biome to a specific RGB color.)

The same step was made for the Globcover, except the original resolution was 129600x55800, which is not the 2:1 format. That's because Antarctica isn't pictured in this image. At first, I changed the canvas size to 129600x64800 (added the new pixels at the bottom of the existing image), then resized the image to 43200x21600 pixels (this is exact 1/3) without resampling (again, we don't want anti-aliasing) and then changed the canvas again to match 43008x21504.

For the heightmaps, I combined the surface elevation and the bathymetry images from NASA, which had a resolutions of 21600x10800. At first, I resized the images to 43200x21600, this time with resampling (Bicubic interpolation), so we get smoother mountains. Later, I also used a blur effect for more realistic elevation in Minecraft.

A lot of the images from "shadedrelief.com" had to be resized from 16200x8100 pixels and be applied a posterize effect afterwards, because layers are only applied or not applied. 1 or 0, black or white.

For the street data I used QGIS3 to export the images.

In summary, each image has an original resolution of 43200x21600 and is then cut to 43008x21504 (even on all sides).
