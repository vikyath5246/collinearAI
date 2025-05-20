import math

def compute_impact(size_bytes: int | None = None,
                   num_samples: int | None = None) -> float:
    """
    Naive impact metric:
      • if size known → log10(MB) × 10
      • else if sample-count known → log10(n) × 10
    """
    if size_bytes:
        mb = size_bytes / (1024 * 1024)
        return round(math.log10(mb + 1) * 10, 2)
    if num_samples:
        return round(math.log10(num_samples + 1) * 10, 2)
    return 0.0
