# Biodiversity Predictors

Statistical learning project for MATH 6243 (Spring 2026).

## Project Overview

This project studies which environmental and geographic factors predict marine biodiversity, measured as species richness at site level.

- **Primary question:** Which predictors best explain variation in marine species richness?
- **Methods being compared:** Regularized regression (ridge/lasso/elastic net), GAMs, and tree-based models (random forest).
- **Current scope (Phase I):** Temperate marine ecosystems from BioTIME 2.0.

## Data Sources

Main and planned data inputs:

1. **BioTIME 2.0** (primary biodiversity records and site-level summaries)
2. **Derived site features** from latitude/longitude and depth
3. **Planned external covariates** (as available), such as climate and human-impact indicators

See `data/READMEDATA.md` and `data/column_dictionary.csv` for additional notes and variable documentation.

## Reproducible Repository Structure

This repository follows a simple reproducible structure:

```
Biodiversity-Predictors/
  data/
    raw/          # immutable source files (not edited by scripts)
    processed/    # cleaned/model-ready datasets
    external/     # optional downloaded third-party data
  src/            # preprocessing, feature engineering, modeling scripts
  reports/        # pitch/proposal/report/poster materials
  README.md
```

Current files may still be moved into this structure as the pipeline is finalized.

## How to Run (Basic, Phase I)

1. Clone the repository:
   - `git clone <your-repo-url>`
   - `cd Biodiversity-Predictors`
2. Create and activate a Python environment:
   - `python3 -m venv .venv`
   - `source .venv/bin/activate`
3. Install dependencies (when `requirements.txt` is added):
   - `pip install -r requirements.txt`
4. Run project scripts from `src/` to regenerate processed data and model outputs.

As code is finalized, exact command examples will be added here.

## Data Sharing and Responsible Use Plan

- Do **not** upload restricted, personally identifiable, or licensed non-shareable data.
- Keep original raw datasets in `data/raw/` with clear source attribution and access notes.
- Share only:
  - reproducible code,
  - documentation,
  - and derived/aggregated data that is permitted by source terms.
- If a data source has redistribution limits, provide a download link + instructions instead of uploading the file.

## Phase I Pitch (Concise Version)

- **Problem:** Predict marine species richness from environmental and geographic variables.
- **Data:** BioTIME 2.0 marine site-level records (filtered to feasible sites).
- **Methods:** Ridge/Lasso/Elastic Net, GAM, Random Forest.
- **Evaluation:** 5-fold cross-validation with RMSE and R^2.
- **Risks:** Missing covariates, sampling bias, correlated predictors.
- **Mitigation:** Site filtering, sampling-effort features, regularization, model comparison.
