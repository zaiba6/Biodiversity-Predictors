from pathlib import Path

import numpy as np
import pandas as pd


def build_feature_dataset(base: Path) -> pd.DataFrame:
    """Recreate the cleanup + engineered-variable step used in the project."""
    input_fp = base / "data" / "external" / "biotime_sites_aggregated.csv"
    output_fp = base / "data" / "external" / "biotime_sites_with_features.csv"

    df = pd.read_csv(input_fp)

    for col in [
        "LATITUDE",
        "LONGITUDE",
        "mean_depth",
        "n_samples",
        "n_years",
        "AREA_SQ_KM",
        "species_richness",
    ]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Geographic features
    df["abs_latitude"] = df["LATITUDE"].abs()
    df["dist_from_equator_km"] = df["abs_latitude"] * 111.32
    df["hemisphere"] = np.where(df["LATITUDE"] >= 0, "N", "S")
    df["tropical"] = (df["abs_latitude"] < 23.5).astype(int)
    df["temperate"] = (
        (df["abs_latitude"] >= 23.5) & (df["abs_latitude"] < 66.5)
    ).astype(int)
    df["polar"] = (df["abs_latitude"] >= 66.5).astype(int)

    # Climate proxies
    rng = np.random.default_rng(42)
    noise = rng.normal(loc=0.0, scale=100.0, size=len(df))
    df["temp_proxy"] = 30 - (0.5 * df["abs_latitude"])
    df["temp_range_proxy"] = df["abs_latitude"] * 0.3
    df["precip_proxy"] = 2000 - (15 * df["abs_latitude"]) + noise

    # Cleanup and effort/depth features
    if "realm" in df.columns and "mean_depth" in df.columns:
        realm_median_depth = df.groupby("realm")["mean_depth"].transform("median")
        df["mean_depth"] = df["mean_depth"].fillna(realm_median_depth)
    if "mean_depth" in df.columns:
        df["mean_depth"] = df["mean_depth"].fillna(df["mean_depth"].median())

    if "AREA_SQ_KM" in df.columns:
        df["AREA_SQ_KM"] = df["AREA_SQ_KM"].fillna(df["AREA_SQ_KM"].median())
        df["log_area"] = np.log(df["AREA_SQ_KM"].clip(lower=0) + 1)
    else:
        df["log_area"] = np.nan

    if "n_years" in df.columns and "n_samples" in df.columns:
        n_years_safe = df["n_years"].replace(0, np.nan)
        df["sampling_intensity"] = df["n_samples"] / n_years_safe

    if "mean_depth" in df.columns:
        df["depth_category"] = np.select(
            [
                df["mean_depth"] < 50,
                (df["mean_depth"] >= 50) & (df["mean_depth"] <= 200),
                df["mean_depth"] > 200,
            ],
            ["shallow", "medium", "deep"],
            default="unknown",
        )
        df["coastal_proxy"] = (df["mean_depth"] < 200).astype(int)

    # Interaction and polynomial features
    df["temp_squared"] = df["temp_proxy"] ** 2
    df["temp_x_precip"] = df["temp_proxy"] * df["precip_proxy"]
    df["latitude_squared"] = df["abs_latitude"] ** 2
    df["productivity_proxy"] = (df["temp_proxy"] * df["precip_proxy"]) / 1000

    df.to_csv(output_fp, index=False)
    print(f"Saved feature dataset: {output_fp}")
    return df


def build_marine_modeling_dataset(base: Path, features_df: pd.DataFrame) -> None:
    """Apply project filter and save the final cleaned modeling dataset."""
    output_fp = base / "data" / "processed" / "marine_data_cleaned.csv"

    marine_df = features_df.copy()
    if "realm" in marine_df.columns:
        marine_df = marine_df[marine_df["realm"].astype(str).str.lower() == "marine"]
    if "biome" in marine_df.columns:
        marine_df = marine_df[
            marine_df["biome"].astype(str).str.lower()
            == "temperate shelf and seas ecoregions"
        ]

    marine_df.to_csv(output_fp, index=False)
    print(f"Saved cleaned modeling dataset: {output_fp}")
    print(f"Final shape: {marine_df.shape[0]} rows x {marine_df.shape[1]} columns")


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[1]
    features = build_feature_dataset(project_root)
    build_marine_modeling_dataset(project_root, features)
