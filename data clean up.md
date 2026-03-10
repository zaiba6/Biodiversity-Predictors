# Data Clean Up Plan (Summary)

This document captures the cleanup and feature-engineering plan used to create the modeling dataset for this project.

## 1) Input Data and Targets

- Primary aggregated input: `data/external/biotime_sites_aggregated.csv`
- Feature-engineered output: `data/external/biotime_sites_with_features.csv`
- Final modeling dataset: `data/processed/marine_data_cleaned.csv`
- Response variable: `species_richness`

## 2) Core Cleaning Steps

1. Load site-level aggregated data.
2. Coerce key numeric columns to numeric where needed (`LATITUDE`, `LONGITUDE`, `mean_depth`, `n_samples`, `n_years`, `AREA_SQ_KM`, `species_richness`).
3. Handle missing values:
   - Fill `mean_depth` using realm-level median, then global median fallback.
   - Fill `AREA_SQ_KM` with median before log transform.
4. Build sampling-effort metric safely:
   - `sampling_intensity = n_samples / n_years`, with divide-by-zero protected.

## 3) Engineered Variables Added

### Geographic features

- `abs_latitude = abs(LATITUDE)`
- `dist_from_equator_km = abs_latitude * 111.32`
- `hemisphere = 'N' if LATITUDE >= 0 else 'S'`
- Binary latitude zones:
  - `tropical` if `abs_latitude < 23.5`
  - `temperate` if `23.5 <= abs_latitude < 66.5`
  - `polar` if `abs_latitude >= 66.5`

### Climate proxy features

- `temp_proxy = 30 - (0.5 * abs_latitude)`
- `temp_range_proxy = abs_latitude * 0.3`
- `precip_proxy = 2000 - (15 * abs_latitude) + noise` (seeded noise for reproducibility)

### Site-character and interaction features

- `log_area = log(AREA_SQ_KM + 1)`
- `depth_category`: shallow/medium/deep using thresholds `<50`, `50-200`, `>200`
- `coastal_proxy = 1 if mean_depth < 200 else 0`
- `temp_squared = temp_proxy ** 2`
- `temp_x_precip = temp_proxy * precip_proxy`
- `latitude_squared = abs_latitude ** 2`
- `productivity_proxy = (temp_proxy * precip_proxy) / 1000`

## 4) Final Filtering for Modeling Dataset

After feature creation, keep only rows with:

- `realm == Marine`
- `biome == Temperate shelf and seas ecoregions`

Save this filtered table as `data/processed/marine_data_cleaned.csv`.

## 5) Notes

- The project variable definitions align with `data/processed/column_dictionary.csv`.
- This plan is intended for reproducible preprocessing before model fitting (Ridge/Lasso/Elastic Net, GAM, and tree-based methods).
