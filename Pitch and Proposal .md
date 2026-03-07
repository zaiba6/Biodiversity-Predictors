**Research Question:** What environmental and geographic factors predict species richness in marine ecosystems, and which statistical learning methods best capture these relationships?

\*\*\* HAVE TO DO BY ECO SYSTEM AS WE HAVE MULTIPLE IN THE DATASET \*\*\*

Or for each realm we need to pick different features and more calculations – I think we should do marine \- if we do all the realms as categorical variables then we get worse degrees of freedom. Basically a cleaner story. 

Temperate shelf and seas ecoregions: 1625 ← marine has more features

- Many ecology papers use 500-2,000 sites

Temperate broadleaf and mixed forests: 1223

Tropical and subtropical moist broadleaf forests: 576

Unknown: 274

Tundra: 7

**How you'd build the dataset:**

1. **Unit of observation**: Each study site with 5+ years of data  
2. **Target variable**: Coefficient of variation in species richness over time (stability metric)  
3. **Features**:  
   * Mean species richness  
   * Latitude, realm, taxa  
   * Sampling duration  
   * Sampling frequency  
   * Climate variables (merged from external data)  
   * Human disturbance index

Methods:

- Ridge/Lasso/Elastic Net (many potentially correlated predictors) → Inaya  
1. Which environmental factors are important for predicting species richness in the various enviro types (temporal, marine etc)?  
2. How does each regularization method handle the correlated predictors  
   1. Which features are set to 0 and which ones shrink?  
   2. Which regularization model is the best?  
   3. Is there an optimal alpha?  
   4. How do coefficients change? ← Multicollinearity  
   5. What do the coefficients mean? 

- GAMs (non-linear climate-stability relationships) → Zaiba  
1. What is the shape of the relationship between environmental gradients and enviro (temporal, marine etc), and are these non-linear relationships?  
   1. Non-Linear relationships  
      1. Latitude \- diversity relationship  
      2. When does species richness peak at certain temperatures?  
      3. Does depth effect flatten out at extreme depths?  
   2. Smooth function shapes  
      1. What does the smooth curve look like for each predictor?  
      2. Variables that show strong curvature  
   3. Degrees of freedom  
      1. Complex non-linearity → how wiggly are the smooths  
      2. Which variables need complex vs simple smooths

- Tree-based methods → Jules  
1. Which features matter the most for predicting species richness  
   1. Ranking feature importance  
2. Partial Dependence plots of how richness changes with each feature  
   1. Which complex interactions exist?  
3. Where does the model fall?   
   1. Error analysis 

   

- Comparing all 3 models   
  - Does GAM improve linear regression?  
  - Likelihood ratio test  
  - How much variance is explained between smooth term vs linear terms


  


  


  


  


  


  


  


  

  Problem statement: Predict species richness in temperate marine ecosystems from environmental and geographic variables, comparing regularized regression, generalized additive models, and random forest to evaluate feature selection, non-linear relationships, and predictive performance.


  Literature review ideas: 

- The actual problem: Marine Biodiversity  
  - Latitude diversity gradient → how species richness peaks in the tropics and decreases towards the poles  
  - Depth zonation → diversity changed with ocean depth   
  - Species and energy → higher temp and productivity \= more species  
  - Human impact on marine biodiversity \- pollution, overfishing and habitat degradation  
  - Global warming? → warming waters and how it shifts species distributions  
      
- Past use of these models in ecology   
  - Ridge/Lasso/Elastic Net  
    - Something about correlated climate variables with species distribution modeling  
    - Habitat suitability prediction with environmental predictions  
    - feature selection within biodiversity with high-dimensional data  
  - GAMs  
    - non \-linear species-environment relationships (depth curves )  
    - Spatial biodiversity modeling with smooth lat/long terms  
    - Modeling abundance vs environmental conditions  
  - Random forest  
    - Spices richness prediction from environmental layers  
    - Habitat classification → ecosystem type mapping  
    - Feature importance for conservation   
    - Would be good to benchmark against some of the simpler models in other biodiversity studies. 

      

All in all these methods all exist in ecology but have not been compared on BioTIME’s marine data\!