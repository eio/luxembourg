import json

# Read the GeoJSON data from the input file
input_file = "uav_202310071657.json"
output_file = "uav_no_fly_zones.json"

# Use utf-8-sig encoding to open the file
with open(input_file, "r", encoding="utf-8-sig") as infile:
    geojson_data = json.load(infile)

# Create a new GeoJSON FeatureCollection
feature_collection = {"type": "FeatureCollection", "features": []}

# Iterate through the original features and restructure them as Features
for original_feature in geojson_data.get("features", []):
    geometry = original_feature.get("geometry")[0]["horizontalProjection"]
    del original_feature["geometry"]
    new_feature = {
        "type": "Feature",
        "properties": original_feature,
        "geometry": geometry,
    }
    feature_collection["features"].append(new_feature)

# Write the corrected GeoJSON data to the output file
with open(output_file, "w") as outfile:
    json.dump(feature_collection, outfile, indent=2)

print(f"Fixed GeoJSON data saved to {output_file}")
