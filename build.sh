version_num=$(python - <<'EOF'
import json
jd = open("dist/package.json", "r")
data = json.load(jd)
print(data['version'])
EOF
)

dd=$
cp ./inspectors-gadget-win ./inspectors-gadget-v$version_num-win/ -r
cp ./dist ./app -r
mv ./app ./inspectors-gadget-v$version_num-win/resources/
zip ./inspectors-gadget-v$version_num-win.zip ./inspectors-gadget-v$version_num-win -r
rm ./inspectors-gadget-v$version_num-win/ -r
