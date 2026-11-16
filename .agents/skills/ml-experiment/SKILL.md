---
name: ml-experiment
version: 1.0.0
description: Dataset validation, data leakage prevention, reproducible training, metric evaluation, model artifact versioning, and explainability.
triggers:
  - "train model"
  - "ml experiment"
  - "evaluate model"
  - "run benchmark"
  - "model training"
negative_triggers:
  - "write css"
  - "fix typo"
load_tier: S
max_reference_reads_per_task: 2
last_verified: 2026-11-16
---

# ML Experiment

## Activation and Load Discipline
- **Load when:** Conducting machine learning experiments, training models, evaluating metrics, or logging benchmarks.
- **Do NOT load when:** Writing non-ML application code or web frontends.

## Purpose
Execute reproducible machine learning pipelines with rigorous data leakage prevention, metric benchmarking, and model artifact tracking.

## When to use
Use when training Scikit-Learn, PyTorch, XGBoost, or Gemini fine-tuned models, evaluating feature importance, or benchmarking datasets.

## Inputs
- Dataset paths (train/validation/test splits).
- Model hyperparameters, architecture configs, and evaluation metrics.

## Procedure
1. **Data Leakage & Shape Check:** Verify train/test isolation before scaling or imputing. Check for target leakage and missing values.
2. **Reproducibility Lock:** Fix random seeds across NumPy, PyTorch, Python random, and framework runtimes.
3. **Pipeline Construction:** Use Scikit-Learn `Pipeline` or PyTorch modules to encapsulate preprocessing and estimator logic.
4. **Training Execution:** Execute training loop, logging training loss, validation loss, and step metrics.
5. **Evaluation & Explainability:** Calculate test metrics (ROC-AUC, F1, MAE, accuracy) on untouched test split. Generate SHAP or feature importance plots.
6. **Artifact Versioning:** Save model weights, scaler artifacts, and metric scorecard with associated commit SHA.

## Verification
- Test set performance evaluated on strictly held-out data.
- Metric gains statistically validated against baseline.
- Model serialization and deserialization smoke tests pass.

## Safety
- Never evaluate on training data to report performance.
- Avoid committing large dataset binaries (>50MB) directly to git; use DVC or external bucket references.

## Outputs
- Model artifact and pipeline definition.
- Metric scorecard and evaluation visualization.
- Experiment log with reproducible parameters.
