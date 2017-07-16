convert -background 'rgba(240, 240, 240, 1.0)' -fill 'rgba(150, 150, 150, 0.8)' -size 300x300 -draw 'line 0,0 120,120 line 0,300 120,180 line 300,0 180,120 line 300,300 180,180' -pointsize 36 -gravity center label:'Image preview' placeholder.png

convert -background 'rgba(240, 240, 240, 1.0)' -fill 'rgba(150, 150, 150, 0.8)' -size 800x600 -pointsize 36 -gravity center label:'Upload floor plan' canvas_placeholder.png

convert -size 100x100 xc:none \
-fill red -stroke red -draw "circle 50,50 50,0" -fill 'orange' \
-draw "circle 50,50 40,10" structural.png

convert -size 100x100 xc:none \
-fill green -stroke green -draw "circle 50,50 50,0" -fill 'rgba(0, 200, 150, 1)' \
-draw "circle 50,50 40,10" no_defect.png

convert -size 100x100 xc:none \
-fill orange -stroke orange -draw "circle 50,50 50,0" -fill 'white' \
-draw "circle 50,50 40,10" non-structural.png

