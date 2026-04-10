# Biodiversity Predictors

MATH 6243 Statistical Learning · Spring 2026 · Julianna, Zaiba, Inaya

**Live site:** https://biodiversity-predictors.netlify.app

---

## Overview

Which environmental and geographic factors predict marine species richness? We compare regularized regression, GAMs, and tree-based models across 1,619 BioTIME marine sampling sites.

- **Target:** `log_richness` — log-transformed species richness per km²
- **Methods:** Ridge, Lasso, Elastic Net, GAM (B-splines), Decision Tree, Random Forest
- **Evaluation:** 10-fold cross-validation, RMSE, R², AIC

## Repository Structure

```
Biodiversity-Predictors/
  Methods/
    Regression.ipynb      # Ridge, Lasso, Elastic Net
    GAMs.ipynb            # Generalized Additive Models
    all_forest.ipynb      # Decision Tree + Random Forest
  data/
    raw/                  # immutable source files
    processed/            # cleaned, model-ready datasets
    external/             # third-party data
    READMEDATA.md         # variable documentation
    column_dictionary.csv
  src/
    DataExploration.py    # preprocessing and feature engineering
  website-showcase/       # interactive results site
  Biodiversity_Predictors.pdf
```

## Data

**BioTIME 2.0** — marine biodiversity time series filtered to 1,619 globally distributed sites. Raw data is not redistributed; see `data/READMEDATA.md` for source and access instructions.

Feature engineering produces 27 predictors spanning geographic (lat, lon, dist_equator), climatic (temp_proxy, precip), habitat (depth, coastal, realm), and sampling (intensity, n_years) dimensions.

## How to Run

```bash
git clone https://github.com/zaiba6/Biodiversity-Predictors.git
cd Biodiversity-Predictors
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Then open and run the notebooks in order:

1. `src/DataExploration.py` — cleans raw data and engineers features
2. `Methods/Regression.ipynb` — regularized linear models
3. `Methods/GAMs.ipynb` — generalized additive models
4. `Methods/all_forest.ipynb` — tree-based models

Outputs (plots, metrics) are written to `website-showcase/assets/plots/`.

## Dependencies

Key packages: `scikit-learn`, `statsmodels`, `pygam`, `numpy`, `pandas`, `matplotlib`
