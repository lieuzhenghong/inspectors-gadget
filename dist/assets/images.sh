convert -background 'rgba(240, 240, 240, 1.0)' -fill 'rgba(150, 150, 150, 0.8)' -size 300x300 -draw 'line 0,0 120,120 line 0,300 120,180 line 300,0 180,120 line 300,300 180,180' -pointsize 36 -gravity center label:'Image preview' placeholder.png

convert -background 'rgba(240, 240, 240, 1.0)' -fill 'rgba(150, 150, 150, 0.8)' -size 800x600 -pointsize 36 -gravity center label:'Upload floor plan' canvas_placeholder.png

convert -size 100x100 xc:none \
-stroke green -strokewidth 10 -fill 'rgba(0, 200, 150, 1)' \
-draw "circle 50,50 20,20" no_defect.png

convert -size 100x100 xc:none \
-stroke orange -strokewidth 10 -fill 'rgba(250, 250, 50, 1)' \
-draw "circle 50,50 20,20" non-structural.png

convert -size 100x100 xc:none \
-stroke red -strokewidth 10 -fill 'rgba(250, 150, 0, 1)' \
-draw "circle 50,50 20,20" structural.png
