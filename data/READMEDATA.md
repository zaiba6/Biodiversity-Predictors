some data notes: 

The methods we want to use for this project include: 
Methods:
Ridge/Lasso/Elastic Net (many potentially correlated predictors) → Inaya
- need more human impact data: (human footprint score, pop density, distance to city and land use intensity) we should be able to find a lot of correlation here
GAMs (non-linear climate-stability relationships) → Zaiba
- Need to merge Lat/Long from the BioTime Site and extract climate data at that coordinate. (adding data about the temperature from World Clim)
    -GAMs need continuous variable with non-linear realtionships.
    - Temp vs Species richness
Tree-based methods → Jules


Derieved features: 
- From Real Lat/Lon Coordinates:
    abs_latitude = |LATITUDE|
    Example: 45.3°N → 45.3

- dist_from_equator_km = abs_latitude × 111.32
    Example: 45.3° → 5,040 km

- hemisphere = 'N' if LATITUDE ≥ 0 else 'S'
    Example: 45.3°N → "North"

- tropical/temperate/polar = Based on latitude ranges
    tropical: abs_latitude < 23.5°
    temperate: 23.5° ≤ abs_latitude < 66.5°
    polar: abs_latitude ≥ 66.5°

Climate Proxies (Approximations):

- temp_proxy = 30 - (0.5 × abs_latitude)
    Example: 45.3° → 7.35°C
    Based on: Temperature decreases with latitude

- temp_range_proxy = abs_latitude × 0.3
    Example: 45.3° → 13.6°C range
    Based on: Seasonality increases with latitude

- precip_proxy = 2000 - (15 × abs_latitude)
    Example: 45.3° → 1,320 mm/year
    Based on: Precipitation patterns by climate zone

Interaction Terms (Correlated Features):
- temp_squared = temp_proxy²
- temp_x_precip = temp_proxy × precip_proxy
- latitude_squared = abs_latitude²
- productivity_proxy = temp_proxy × precip_proxy / 1000

From BioTIME Aggregation:
- species_richness = Count of unique species per site
- total_abundance = Sum of abundance per site
- sampling_intensity = n_samples / n_years
- log_area = log(AREA_SQ_KM + 1) (if area exists)

Categorical Encoding:
- depth_category = 'shallow'/'medium'/'deep' based on mean_depth
- coastal_proxy = 1 if mean_depth < 200 else 0